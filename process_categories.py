import json

with open('public/data/products.json', 'r') as f:
    products = json.load(f)

# Extragem categoriile unice
all_categories = set()
for p in products:
    for cat in p.get('categories', []):
        all_categories.add(cat['name'])

# Definim categoriile principale cerute
main_cats = {
    "Toate Produsele": "all",
    "Audio & Video": ["Audio", "Headphones", "Earphones", "Speakers"],
    "Power Banks": ["Power banks", "Power Bank"],
    "Accesorii Auto": ["Car Chargers", "Car Holders", "FM Transmitter"],
    "Smart Home": ["Home & Office", "Smart Home"],
    "Oferte Speciale": "sale" # Va fi filtrat dupa on_sale=true
}

category_map = {}
for display_name, keywords in main_cats.items():
    if keywords == "all":
        category_map[display_name] = [p['slug'] for p in products]
    elif keywords == "sale":
        category_map[display_name] = [p['slug'] for p in products if p.get('on_sale')]
    else:
        slugs = []
        for p in products:
            p_cats = [c['name'].lower() for c in p.get('categories', [])]
            if any(k.lower() in pc for k in keywords for pc in p_cats):
                slugs.append(p['slug'])
        category_map[display_name] = slugs

with open('public/data/categories.json', 'w') as f:
    json.dump(category_map, f)

print(f"Categorii procesate: {len(category_map)}")
for k, v in category_map.items():
    print(f"  - {k}: {len(v)} produse")
