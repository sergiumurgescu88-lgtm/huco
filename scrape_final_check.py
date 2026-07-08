import requests
import json
import time
import os

DATA_FILE = 'public/data/products.json'
API_BASE_URL = "https://hocotech.com/wp-json/wc/store/products"

# Încarcă produsele existente
if os.path.exists(DATA_FILE):
    with open(DATA_FILE, 'r') as f:
        existing_products = json.load(f)
else:
    existing_products = []

existing_ids = {p['id'] for p in existing_products}
new_products = []
total_new = 0

print(f"Am găsit {len(existing_products)} produse existente. Verific API-ul...")

page = 1
while True:
    try:
        # Luăm 100 de produse pe pagină
        resp = requests.get(f"{API_BASE_URL}?per_page=100&page={page}", timeout=15)
        if resp.status_code != 200:
            print(f"Eroare la pagina {page}: {resp.status_code}")
            break
            
        products_data = resp.json()
        if not products_data:
            break # Nu mai sunt produse
            
        print(f"Verificare pagina {page} ({len(products_data)} produse)...")
        
        for item in products_data:
            pid = item.get('id')
            if pid not in existing_ids:
                # Traducere simplă
                name = item.get('name', '')
                # Aici poți adăuga logica de traducere dacă vrei
                
                new_product = {
                    "id": pid,
                    "name": name,
                    "price": int(float(item.get('prices', {}).get('price', '0').replace(',', '.')) * 100) if item.get('prices') else 0,
                    "regular_price": int(float(item.get('prices', {}).get('regular_price', '0').replace(',', '.')) * 100) if item.get('prices') else 0,
                    "on_sale": False,
                    "images": [{"src": img.get('src')} for img in item.get('images', [])],
                    "description": item.get('short_description', ''),
                    "categories": [{"name": c.get('name')} for c in item.get('categories', [])],
                    "slug": item.get('slug')
                }
                new_products.append(new_product)
                existing_ids.add(pid)
                total_new += 1
        
        if len(products_data) < 100:
            break # Ultima pagină
            
        page += 1
        time.sleep(0.5) # Pauză mică
        
    except Exception as e:
        print(f"Eroare: {e}")
        break

# Salvare
if total_new > 0:
    all_products = existing_products + new_products
    with open(DATA_FILE, 'w') as f:
        json.dump(all_products, f)
    print(f"\n✅ SUCCES! Au fost adăugate {total_new} produse NOI.")
    print(f"Total produse acum: {len(all_products)}")
else:
    print(f"\nℹ️ INFO: Nu au fost găsite produse noi. Ai deja toate cele {len(existing_products)} produse în baza de date.")
    print("Dacă vrei să reîmprospătezi datele, șterge fișierul public/data/products.json și rulează din nou.")
