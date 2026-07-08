import requests
import json
import time
from urllib.parse import quote

DATA_FILE = "public/data/products.json"
API_BASE = "https://hocotech.com/wp-json/wc/store/products"

# Încarcă produsele existente
print("Încărcare produse existente...")
with open(DATA_FILE, 'r') as f:
    products = json.load(f)

print(f"Total produse în JSON: {len(products)}")

# Creează un index după slug pentru căutare rapidă
slug_to_index = {p['slug']: i for i, p in enumerate(products)}

# Verificăm câte produse au deja descrieri
produse_fara_descriere = sum(1 for p in products if not p.get('description') or len(p.get('description', '')) == 0)
print(f"Produse fără descriere: {produse_fara_descriere}")

if produse_fara_descriere == 0:
    print("Toate produsele au deja descrieri! Nu este necesară actualizarea.")
    exit(0)

# Parametri pentru paginare
page = 1
per_page = 100
total_fetched = 0
total_updated = 0

print("\nÎncepem extragerea descrierilor din API...")

while True:
    url = f"{API_BASE}?per_page={per_page}&page={page}"
    print(f"\nPagina {page}...", end=" ", flush=True)
    
    try:
        resp = requests.get(url, timeout=30)
        
        if resp.status_code != 200:
            print(f"Eroare HTTP {resp.status_code}")
            break
        
        api_products = resp.json()
        
        if not api_products:
            print("Gata! Nu mai sunt produse.")
            break
        
        print(f"({len(api_products)} produse)", flush=True)
        
        # Procesăm fiecare produs din API
        for api_prod in api_products:
            slug = api_prod.get('slug')
            
            if slug in slug_to_index:
                idx = slug_to_index[slug]
                local_prod = products[idx]
                
                # Actualizăm descrierea
                if api_prod.get('description'):
                    local_prod['description'] = api_prod['description']
                    total_updated += 1
                
                # Actualizăm descrierea scurtă
                if api_prod.get('short_description'):
                    local_prod['short_description'] = api_prod['short_description']
                
                # Actualizăm imaginile dacă lipsesc sau sunt incomplete
                if api_prod.get('images') and len(api_prod['images']) > len(local_prod.get('images', [])):
                    local_prod['images'] = [
                        {"src": img['src']} for img in api_prod['images']
                    ]
                
                # Actualizăm prețurile
                if api_prod.get('prices'):
                    prices = api_prod['prices']
                    if prices.get('price'):
                        local_prod['price'] = int(prices['price'])
                    if prices.get('regular_price'):
                        local_prod['regular_price'] = int(prices['regular_price'])
                    if prices.get('sale_price') and prices['sale_price'] != prices.get('regular_price'):
                        local_prod['on_sale'] = True
                
                # Actualizăm SKU
                if api_prod.get('sku'):
                    local_prod['sku'] = api_prod['sku']
                
                # Actualizăm ID-ul
                if api_prod.get('id'):
                    local_prod['id'] = api_prod['id']
        
        total_fetched += len(api_products)
        
        # Salvare progresivă la fiecare 5 pagini
        if page % 5 == 0:
            with open(DATA_FILE, 'w') as f:
                json.dump(products, f)
            print(f"  -> Salvat progresiv. Total procesate: {total_fetched}, actualizate: {total_updated}")
        
        page += 1
        time.sleep(1)  # Pauză pentru a nu suprasolicita API-ul
        
    except Exception as e:
        print(f"Eroare: {e}")
        break

# Salvare finală
print(f"\nSalvare finală...")
with open(DATA_FILE, 'w') as f:
    json.dump(products, f)

# Verificare finală
produse_fara_descriere_final = sum(1 for p in products if not p.get('description') or len(p.get('description', '')) == 0)

print(f"\n✅ FINALIZAT!")
print(f"Total produse procesate din API: {total_fetched}")
print(f"Total produse actualizate: {total_updated}")
print(f"Produse rămase fără descriere: {produse_fara_descriere_final}")
