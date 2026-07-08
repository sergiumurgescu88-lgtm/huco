import json
import os

DATA_FILE = 'public/data/products.json'

if not os.path.exists(DATA_FILE):
    print("Fișierul products.json nu există.")
    exit(1)

with open(DATA_FILE, 'r') as f:
    products = json.load(f)

fixed_count = 0
for product in products:
    if 'images' in product and isinstance(product['images'], list):
        for img in product['images']:
            if 'src' in img and img['src']:
                original_src = img['src']
                # Verificăm dacă nu este deja procesat
                if 'images.weserv.nl' not in original_src:
                    # Codificăm URL-ul original pentru a-l pune ca parametru
                    from urllib.parse import quote
                    encoded_url = quote(original_src, safe='')
                    new_src = f"https://images.weserv.nl/?url={encoded_url}&output=jpg"
                    img['src'] = new_src
                    fixed_count += 1

with open(DATA_FILE, 'w') as f:
    json.dump(products, f)

print(f"✅ Am corectat {fixed_count} imagini. Acum rulează 'npm run build'.")
