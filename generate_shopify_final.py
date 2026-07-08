import json
import csv
import os

DATA_FILE = 'public/data/products.json'
OUTPUT_CSV = 'hoco-shopify-complete.csv'

print("Încărcare date...")
with open(DATA_FILE, 'r') as f:
    products = json.load(f)

print(f"Generare CSV pentru {len(products)} produse...")

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

    for p in products:
        # Handle unic
        handle = p.get('slug', '').replace('/', '-') or f"hoco-{p['id']}"
        
        # Prețuri
        price = float(p.get('price', 0)) / 100
        compare_price = ""
        if p.get('on_sale') and p.get('regular_price'):
            compare_price = str(float(p['regular_price']) / 100)
        
        # Imagini - Folosim URL-urile originale de la sursă
        image_urls = []
        if 'images' in p and p['images']:
            for img in p['images']:
                src = img.get('src', '') if isinstance(img, dict) else img
                if src and src.startswith('http'):
                    image_urls.append(src)
        
        # Shopify acceptă multiple imagini separate prin virgulă într-o singură celulă
        # SAU putem crea rânduri separate pentru fiecare imagine. 
        # Pentru simplitate și compatibilitate maximă, punem prima imagine ca principală
        # și restul le adăugăm ca rânduri suplimentare dacă e nevoie, dar metoda simplă e:
        # Punem toate URL-urile separate prin virgulă în câmpul Image Src al primei variante.
        # Shopify va prelua prima ca principală și restul ca galeria.
        
        main_image = image_urls[0] if image_urls else ""
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

print(f"✅ Gata! Fișierul '{OUTPUT_CSV}' a fost generat.")
print("Acum poți descărca acest fișier și îl poți importa în Shopify.")
