import requests
from bs4 import BeautifulSoup
import json
import time
import os
import re

CATALOG_URL = "https://hocotech.com/catalog/"
DATA_FILE = "public/data/products.json"

# Încarcă produsele existente
if os.path.exists(DATA_FILE):
    with open(DATA_FILE, 'r') as f:
        try: existing_products = json.load(f)
        except: existing_products = []
else:
    existing_products = []

existing_slugs = {p.get('slug') for p in existing_products if p.get('slug')}
print(f"Am găsit {len(existing_products)} produse existente.")

def get_product_details(url):
    try:
        resp = requests.get(url, timeout=30)
        if resp.status_code != 200: return None
        soup = BeautifulSoup(resp.content, 'html.parser')
        
        match = re.search(r'/product/(\d+)/', url)
        product_id = int(match.group(1)) if match else None
        
        title_tag = soup.find('h1', class_='product_title')
        title = title_tag.text.strip() if title_tag else "Unknown"
        
        price_tag = soup.find('span', class_='woocommerce-Price-amount')
        price = 0
        if price_tag:
            try: price = float(price_tag.text.replace('lei','').replace(',','.').strip()) * 100
            except: pass
            
        images = []
        gallery_div = soup.find('div', class_='woocommerce-product-gallery')
        if gallery_div:
            for img in gallery_div.find_all('img'):
                src = img.get('data-src') or img.get('src')
                if src and 'http' in src:
                    images.append({"src": f"https://images.weserv.nl/?url={src}&output=jpg"})
        
        if not images:
            main_img = soup.find('img', class_='wp-post-image')
            if main_img:
                src = main_img.get('data-src') or main_img.get('src')
                if src: images.append({"src": f"https://images.weserv.nl/?url={src}&output=jpg"})

        desc_div = soup.find('div', class_='woocommerce-Tabs-panel--description')
        description = str(desc_div) if desc_div else ""
            
        specs_table = soup.find('table', class_='shop_attributes')
        specs_html = str(specs_table) if specs_table else ""
        
        full_content = description
        if specs_html: full_content += "<br><br><h3>Specificații Tehnice:</h3>" + specs_html

        categories = [{"name": c.text.strip()} for c in soup.select('.posted_in a')]
            
        return {
            "id": product_id, "name": title, "price": 0, "regular_price": 0,
            "on_sale": False, "images": images, "description": full_content,
            "categories": categories, "slug": url.split('/')[-2]
        }
    except Exception as e:
        return None

# Continuăm de la pagina 95
page = 95
max_pages = 182

while page <= max_pages:
    url = f"{CATALOG_URL}page/{page}/" if page > 1 else CATALOG_URL
    print(f"--- Pagina {page}/{max_pages} ---")
    
    try:
        resp = requests.get(url, timeout=30)
        if resp.status_code != 200: break
        soup = BeautifulSoup(resp.content, 'html.parser')
        
        links = soup.select('.products a[href*="/product/"]')
        if not links: break
        
        new_count = 0
        for link in links:
            href = link['href']
            slug = href.split('/')[-2]
            
            if slug not in existing_slugs:
                data = get_product_details(href)
                if data:
                    existing_products.append(data)
                    existing_slugs.add(slug)
                    new_count += 1
                    
                    # Salvăm la fiecare 3 produse noi
                    if new_count % 3 == 0:
                        with open(DATA_FILE, 'w') as f:
                            json.dump(existing_products, f)
                
                time.sleep(2)
                
        print(f"  -> Adăugate {new_count} produse noi.")
        page += 1
        time.sleep(3)
    except Exception as e:
        print(f"Eroare: {e}")
        break

with open(DATA_FILE, 'w') as f:
    json.dump(existing_products, f)

print(f"\n✅ FINAL! Total produse: {len(existing_products)}")
