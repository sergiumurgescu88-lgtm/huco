import requests
from bs4 import BeautifulSoup
import json
import time
import os
import re

BASE_URL = "https://hocotech.com"
CATALOG_URL = "https://hocotech.com/catalog/"
DATA_FILE = "public/data/products_full.json"

all_products = []

def get_product_details(url, retries=3):
    for i in range(retries):
        try:
            resp = requests.get(url, timeout=60) # Timeout mare
            if resp.status_code != 200: 
                if i < retries - 1: continue
                return None
            
            soup = BeautifulSoup(resp.content, 'html.parser')
            
            # Extrage ID
            match = re.search(r'/product/(\d+)/', url)
            product_id = int(match.group(1)) if match else None
            if not product_id: return None

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
            
            full_desc = f"{description}<br><br><h3>Specificații:</h3>{specs_html}" if specs_html else description
            
            categories = [{"name": c.text.strip()} for c in soup.select('.posted_in a')]
                
            return {
                "id": product_id,
                "name": title,
                "price": int(price),
                "regular_price": int(price),
                "on_sale": False,
                "images": images,
                "description": full_desc,
                "categories": categories,
                "slug": url.split('/')[-2]
            }
        except Exception as e:
            print(f"  -> Eroare la {url} (încercarea {i+1}): {e}")
            if i < retries - 1: time.sleep(5)
    return None

page = 1
max_pages = 182

while page <= max_pages:
    url = f"{CATALOG_URL}page/{page}/" if page > 1 else CATALOG_URL
    print(f"Pagina {page}/{max_pages}")
    
    try:
        resp = requests.get(url, timeout=60)
        if resp.status_code != 200: break
        soup = BeautifulSoup(resp.content, 'html.parser')
        
        links = soup.select('.products a[href*="/product/"]')
        if not links: break
        
        for link in links:
            href = link['href']
            slug = href.split('/')[-2]
            
            # Verifică dacă l-am adăugat deja în această sesiune
            if any(p['slug'] == slug for p in all_products):
                continue

            print(f"  -> Preluare: {slug}")
            data = get_product_details(href)
            if data:
                all_products.append(data)
                # Salvează progresiv la fiecare 10 produse
                if len(all_products) % 10 == 0:
                    with open(DATA_FILE, 'w') as f:
                        json.dump(all_products, f)
                    print(f"    (Salvat progresiv: {len(all_products)} produse)")
                
            time.sleep(2) # Pauză între produse
            
        page += 1
        time.sleep(3) # Pauză între pagini
    except Exception as e:
        print(f"Eroare critică la pagina {page}: {e}")
        break

# Salvare finală
with open(DATA_FILE, 'w') as f:
    json.dump(all_products, f)

print(f"Gata! Total produse salvate: {len(all_products)}")
