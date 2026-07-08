import requests
from bs4 import BeautifulSoup
import json
import time
import os

# Încarcă produsele existente
DATA_FILE = 'public/data/products.json'
if os.path.exists(DATA_FILE):
    with open(DATA_FILE, 'r') as f:
        existing_products = json.load(f)
else:
    existing_products = []

existing_ids = {p['id'] for p in existing_products}
new_products = []

CATEGORIES_URLS = [
    "https://hocotech.com/category/mobile-accessories/flash-disks/",
    "https://hocotech.com/category/power/",
    "https://hocotech.com/category/power/wall-chargers/",
    "https://hocotech.com/category/audio/",
    "https://hocotech.com/category/audio/earphones/",
    "https://hocotech.com/category/home-office/",
    "https://hocotech.com/category/mobile-accessories/"
]

def get_product_details(url):
    try:
        response = requests.get(url, timeout=10)
        soup = BeautifulSoup(response.content, 'html.parser')
        
        # Extrage ID-ul din URL (ex: /product/12345/)
        parts = url.rstrip('/').split('/')
        if len(parts) >= 2 and parts[-2].isdigit():
            product_id = int(parts[-2])
        else:
            return None

        # Verifică dacă există deja
        if product_id in existing_ids:
            return None

        title_tag = soup.find('h1', class_='product_title')
        title = title_tag.text.strip() if title_tag else "Unknown"
        
        price_tag = soup.find('span', class_='woocommerce-Price-amount amount')
        price = 0
        if price_tag:
            price_text = price_tag.text.replace('lei', '').replace(',', '.').strip()
            try:
                price = float(price_text) * 100
            except:
                price = 0
        
        images = []
        img_tags = soup.find_all('img', class_='wp-post-image')
        for img in img_tags:
            src = img.get('data-src') or img.get('src')
            if src and 'http' in src:
                images.append({"src": src})

        desc_div = soup.find('div', class_='woocommerce-product-details__short-description')
        description = desc_div.get_text(strip=True) if desc_div else ""

        return {
            "id": product_id,
            "name": title,
            "price": int(price),
            "regular_price": int(price),
            "on_sale": False,
            "images": images,
            "description": description,
            "categories": [{"name": "Extra"}],
            "slug": parts[-2] if len(parts) >= 2 else str(product_id)
        }
    except Exception as e:
        print(f"Eroare la {url}: {e}")
        return None

print("Începere scraping extra produse...")
for cat_url in CATEGORIES_URLS:
    page = 1
    while True:
        full_url = f"{cat_url}page/{page}/" if page > 1 else cat_url
        try:
            resp = requests.get(full_url, timeout=10)
            if resp.status_code != 200: 
                break
            
            soup = BeautifulSoup(resp.content, 'html.parser')
            # Selector specific pentru tema Hoco/WooCommerce
            links = soup.select('.product-item a[href*="/product/"]')
            
            if not links: 
                break
            
            for link in links:
                href = link['href']
                prod = get_product_details(href)
                if prod:
                    new_products.append(prod)
                    existing_ids.add(prod['id'])
                    print(f"Adăugat: {prod['name']}")
            
            page += 1
            time.sleep(1) # Pauză pentru a nu bloca serverul
        except Exception as e:
            print(f"Eroare pagină {full_url}: {e}")
            break

# Salvează toate produsele
all_products = existing_products + new_products
with open(DATA_FILE, 'w') as f:
    json.dump(all_products, f)

print(f"Gata! Total produse acum: {len(all_products)}")
