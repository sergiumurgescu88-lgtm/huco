import requests
import csv
import time

BASE_URL = "https://hocotech.com/wp-json/wc/store/products"
OUTPUT_CSV = "hoco-shopify-api.csv"

print("Începere descărcare produse din API...")

all_products = []
page = 1

while True:
    print(f"Descărcare pagina {page}...")
    response = requests.get(f"{BASE_URL}?page={page}&per_page=100", timeout=30)
    
    if response.status_code != 200:
        print(f"Eroare la pagina {page}: {response.status_code}")
        break
        
    products = response.json()
    if not products:
        break
    
    all_products.extend(products)
    page += 1
    time.sleep(1) # Pauză pentru a nu bloca serverul

print(f"Total produse descărcate: {len(all_products)}")
print("Generare CSV...")

with open(OUTPUT_CSV, 'w', newline='', encoding='utf-8-sig') as csvfile:
    writer = csv.writer(csvfile)
    
    # Header standard Shopify
    header = [
        "Handle", "Title", "Body (HTML)", "Vendor", "Product Category", 
        "Type", "Tags", "Published", "Option1 Name", "Option1 Value", 
        "Variant SKU", "Variant Grams", "Variant Inventory Tracker", 
        "Variant Inventory Qty", "Variant Inventory Policy", 
        "Variant Fulfillment Service", "Variant Price", 
        "Variant Compare At Price", "Variant Requires Shipping", 
        "Variant Taxable", "Gift Card", "Image Src", "Image Alt Text", "Status"
    ]
    writer.writerow(header)

    for p in all_products:
        handle = p.get('slug', '').replace('/', '-') or f"hoco-{p['id']}"
        
        # Prețuri (API-ul returnează în cenți)
        price = float(p.get('prices', {}).get('price', 0)) / 100
        regular_price = float(p.get('prices', {}).get('regular_price', 0)) / 100
        
        compare_price = ""
        if regular_price > price and regular_price > 0:
            compare_price = str(regular_price)
        
        # Imagini - Extragem toate URL-urile valide
        images = p.get('images', [])
        image_urls = []
        for img in images:
            src = img.get('src', '')
            if src and src.startswith('http'):
                image_urls.append(src)
        
        # Dacă nu avem imagini, sărim peste produs sau punem un placeholder
        if not image_urls:
            continue 
            
        main_image = image_urls[0]
        alt_text = p.get('name', '')

        row = [
            handle,
            p.get('name', ''),
            p.get('description', '').replace('\n', '<br>'),
            'Hoco',
            p['categories'][0]['name'] if p.get('categories') else 'General',
            p['categories'][0]['name'] if p.get('categories') else 'General',
            ', '.join([c['name'] for c in p.get('categories', [])]),
            'TRUE',
            'Title',
            'Default Title',
            f"HOCO-{p['id']}",
            0,
            'shopify',
            100,
            'deny',
            'manual',
            f"{price:.2f}",
            compare_price,
            'TRUE',
            'TRUE',
            'FALSE',
            ','.join(image_urls), # Toate imaginile separate prin virgulă
            alt_text,
            'active'
        ]
        writer.writerow(row)

print(f"✅ Gata! Fișierul '{OUTPUT_CSV}' a fost generat cu {len(all_products)} produse.")
