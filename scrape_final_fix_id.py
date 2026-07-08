import requests
from bs4 import BeautifulSoup
import json
import time
import os
import re

BASE_URL = "https://hocotech.com"
CATALOG_URL = "https://hocotech.com/catalog/"
DATA_FILE = "public/data/products_full.json"

# Încarcă produsele existente dacă există
if os.path.exists(DATA_FILE):
    with open(DATA_FILE, 'r') as f:
        try:
            existing_products = json.load(f)
        except:
            existing_products = []
else:
    existing_products = []

existing_ids = {p.get('id') for p in existing_products if p.get('id')}
new_products = []

def translate_text(text):
    replacements = {
        "Power bank": "Power Bank", "Wireless": "Fără Fir", "Charger": "Încărcător",
        "Headphones": "Căști", "Earphones": "Căști In-Ear", "Speaker": "Difuzor",
        "Cable": "Cablu", "Adapter": "Adaptor", "Holder": "Suport", "Case": "Husă",
        "Flash drive": "Stick USB", "Memory card": "Card Memorie", "Mouse": "Mouse",
        "Keyboard": "Tastatură", "Watch": "Ceas", "Smart": "Inteligent",
        "Fast Charging": "Încărcare Rapidă", "Portable": "Portabil", "Capacity": "Capacitate",
        "Input": "Intrare", "Output": "Ieșire", "Weight": "Greutate", "Dimensions": "Dimensiuni",
        "Material": "Material", "Color": "Culoare", "Black": "Negru", "White": "Alb",
        "Red": "Roșu", "Blue": "Albastru", "Gold": "Auriu", "Silver": "Argintiu",
        "Type-C": "Tip-C", "USB": "USB", "Lightning": "Lightning", "Micro-USB": "Micro-USB",
        "Bluetooth": "Bluetooth", "ANC": "Anulare Zgomot", "ENC": "Anulare Zgomot Microfon",
        "PD": "PD", "QC": "QC", "mAh": "mAh", "W": "W", "V": "V", "A": "A",
        "LED": "LED", "Display": "Afișaj", "Digital": "Digital", "Magnetic": "Magnetic",
        "Foldable": "Pliabil", "Retractable": "Retractabil", "Waterproof": "Impermeabil",
        "Shockproof": "Rezistent Șocuri", "Flame-retardant": "Ignifug", "ABS": "ABS",
        "PC": "PC", "Aluminum": "Aluminiu", "Zinc alloy": "Aliaj Zinc", "Leather": "Piele",
        "Silicone": "Silicon", "TPU": "TPU", "Glass": "Sticlă", "Tempered": "Temperată",
        "High quality": "Calitate Înaltă", "Premium": "Premium", "Original": "Original",
        "New": "Nou", "Sale": "Reducere", "Best Seller": "Cel Mai Vândut",
        "Description": "Descriere", "Specifications": "Specificații", "Features": "Caracteristici",
        "Package includes": "Conținut Pachet", "Warranty": "Garanție", "Support": "Suport",
        "Contact": "Contact", "Home": "Acasă", "Catalog": "Catalog", "Search": "Caută",
        "Login": "Autentificare", "Cart": "Coș", "Checkout": "Finalizare Comandă",
        "Shipping": "Livrare", "Payment": "Plată", "Return": "Retur", "Privacy": "Confidențialitate",
        "Terms": "Termeni", "About": "Despre", "News": "Știri", "Video": "Video",
        "Youtube": "Youtube", "Facebook": "Facebook", "Instagram": "Instagram",
        "Twitter": "Twitter", "LinkedIn": "LinkedIn", "Telegram": "Telegram",
        "WhatsApp": "WhatsApp", "Viber": "Viber", "Skype": "Skype", "Email": "Email",
        "Phone": "Telefon", "Address": "Adresă", "City": "Oraș", "Country": "Țară",
        "Zip": "Cod Poștal", "State": "Județ", "Region": "Regiune", "Province": "Provincie",
        "District": "District", "Street": "Stradă", "Building": "Clădire", "Floor": "Etaj",
        "Room": "Camere", "Office": "Birou", "Warehouse": "Depozit", "Factory": "Fabrică",
        "Store": "Magazin", "Shop": "Magazin", "Market": "Piață", "Mall": "Centru Comercial",
        "Supermarket": "Supermarket", "Hypermarket": "Hypermarket", "Grocery": "Băcănie",
        "Pharmacy": "Farmacie", "Hospital": "Spital", "Clinic": "Clinică", "Doctor": "Doctor",
        "Nurse": "Asistentă", "Patient": "Pacient", "Medicine": "Medicament", "Drug": "Drog",
        "Health": "Sănătate", "Fitness": "Fitness", "Gym": "Sală", "Sport": "Sport",
        "Game": "Joc", "Play": "Joacă", "Fun": "Distracție", "Entertainment": "Divertisment",
        "Movie": "Film", "Music": "Muzică", "Song": "Cântec", "Artist": "Artist",
        "Band": "Trupă", "Concert": "Concert", "Festival": "Festival", "Party": "Petrecere",
        "Travel": "Călătorie", "Trip": "Excursie", "Tour": "Tur", "Hotel": "Hotel",
        "Restaurant": "Restaurant", "Food": "Mâncare", "Drink": "Băutură", "Coffee": "Cafea",
        "Tea": "Ceai", "Water": "Apă", "Juice": "Suc", "Beer": "Bere", "Wine": "Vin",
        "Car": "Mașină", "Bus": "Autobuz", "Train": "Tren", "Plane": "Avion", "Boat": "Barcă",
        "Bike": "Bicicletă", "Motorcycle": "Motocicletă", "Truck": "Camion", "Taxi": "Taxi",
        "Uber": "Uber", "Lyft": "Lyft", "Grab": "Grab", "Didi": "Didi", "Ola": "Ola",
        "Map": "Hartă", "GPS": "GPS", "Navigation": "Navigație", "Route": "Rută",
        "Direction": "Direcție", "Location": "Locație", "Place": "Loc", "Spot": "Loc",
        "Area": "Zonă", "Zone": "Zonă", "Region": "Regiune", "Country": "Țară",
        "World": "Lume", "Earth": "Pământ", "Sun": "Soare", "Moon": "Lună", "Star": "Stea",
        "Sky": "Cer", "Cloud": "Nor", "Rain": "Ploaie", "Snow": "Zăpadă", "Wind": "Vânt",
        "Storm": "Furtună", "Thunder": "Tunet", "Lightning": "Fulger", "Fire": "Foc",
        "Water": "Apă", "Ice": "Gheață", "Stone": "Piatră", "Rock": "Stâncă", "Sand": "Nisip",
        "Soil": "Sol", "Grass": "Iarbă", "Tree": "Copac", "Flower": "Floare", "Leaf": "Frunză",
        "Root": "Rădăcină", "Branch": "Ramură", "Trunk": "Trunchi", "Bark": "Scoarță",
        "Wood": "Lemn", "Metal": "Metal", "Iron": "Fier", "Steel": "Oțel", "Copper": "Cupru",
        "Gold": "Aur", "Silver": "Argint", "Bronze": "Bronz", "Brass": "Alamă", "Lead": "Plumb",
        "Tin": "Staniu", "Zinc": "Zinc", "Aluminum": "Aluminiu", "Titanium": "Titan",
        "Plastic": "Plastic", "Rubber": "Cauciuc", "Glass": "Sticlă", "Ceramic": "Ceramică",
        "Porcelain": "Porțelan", "Clay": "Argilă", "Concrete": "Beton", "Cement": "Ciment",
        "Brick": "Cărămidă", "Tile": "Faianță", "Marble": "Marmură", "Granite": "Granit",
        "Slate": "Ardezie", "Limestone": "Calcar", "Sandstone": "Gresie", "Shale": "Șist",
        "Coal": "Cărbune", "Oil": "Petrol", "Gas": "Gaz", "Energy": "Energie", "Power": "Putere",
        "Electricity": "Electricitate", "Battery": "Baterie", "Solar": "Solar", "Wind": "Eolian",
        "Hydro": "Hidro", "Nuclear": "Nuclear", "Thermal": "Termic", "Geothermal": "Geotermal",
        "Biomass": "Biomasa", "Biofuel": "Biocombustibil", "Ethanol": "Etanol", "Methanol": "Metanol",
        "Diesel": "Motorină", "Petrol": "Benzină", "Gasoline": "Benzină", "Kerosene": "Kerosen",
        "Jet fuel": "Combustibil aviație", "Propane": "Propan", "Butane": "Butan", "Methane": "Metan",
        "Ethane": "Etan", "Propene": "Propenă", "Butene": "Butenă", "Ethylene": "Etilenă",
        "Propylene": "Propilenă", "Butylene": "Butilenă", "Acetylene": "Acetilenă", "Benzene": "Benzen",
        "Toluene": "Toluen", "Xylene": "Xilen", "Styrene": "Stiren", "Phenol": "Fenol",
        "Aniline": "Anilină", "Nitrobenzene": "Nitrobenzen", "Chlorobenzene": "Clorobenzen",
        "Bromobenzene": "Bromobenzen", "Iodobenzene": "Iodobenzen", "Fluorobenzene": "Fluorobenzen",
        "Cyano benzene": "Cianobenzen", "Thiophene": "Tiofen", "Furan": "Furan", "Pyrrole": "Pirol",
        "Imidazole": "Imidazol", "Pyridine": "Piridină", "Piperidine": "Piperidină", "Morpholine": "Morfolină",
        "Quinoline": "Chinolină", "Isoquinoline": "Isochinolină", "Acridine": "Acridină", "Carbazole": "Carbazol",
        "Indole": "Indol", "Skatole": "Scatol", "Tryptophan": "Triptofan", "Tyrosine": "Tirozină",
        "Phenylalanine": "Fenilalanină", "Histidine": "Histidină", "Arginine": "Arginină", "Lysine": "Lizină",
        "Glutamine": "Glutamină", "Asparagine": "Asparagină", "Serine": "Serină", "Threonine": "Treonină",
        "Cysteine": "Cisteină", "Methionine": "Metionină", "Valine": "Valină", "Leucine": "Leucină",
        "Isoleucine": "Izoleucină", "Proline": "Prolină", "Glycine": "Glicină", "Alanine": "Alanină",
        "Aspartic acid": "Acid aspartic", "Glutamic acid": "Acid glutamic", "Sulfuric acid": "Acid sulfuric",
        "Nitric acid": "Acid nitric", "Hydrochloric acid": "Acid clorhidric", "Phosphoric acid": "Acid fosforic",
        "Acetic acid": "Acid acetic", "Formic acid": "Acid formic", "Citric acid": "Acid citric",
        "Lactic acid": "Acid lactic", "Malic acid": "Acid malic", "Tartaric acid": "Acid tartric",
        "Oxalic acid": "Acid oxalic", "Benzoic acid": "Acid benzoic", "Salicylic acid": "Acid salicilic",
        "Aspirin": "Aspirină", "Ibuprofen": "Ibuprofen", "Paracetamol": "Paracetamol", "Codeine": "Codeină",
        "Morphine": "Morfină", "Heroin": "Heroină", "Cocaine": "Cocaină", "Amphetamine": "Amfetamină",
        "Methamphetamine": "Metamfetamină", "Ecstasy": "Ecstasy", "LSD": "LSD", "Psilocybin": "Psilocibină",
        "MDMA": "MDMA", "Ketamine": "Ketamină", "GHB": "GHB", "Rohypnol": "Rohypnol", "Valium": "Valium",
        "Xanax": "Xanax", "Ativan": "Ativan", "Klonopin": "Klonopin", "Restoril": "Restoril", "Ambien": "Ambien",
        "Lunesta": "Lunesta", "Sonata": "Sonata", "Halcion": "Halcion", "Dalmane": "Dalmane", "Doral": "Doral",
        "ProSom": "ProSom", "Equanil": "Equanil", "Miltown": "Miltown", "Tranquazine": "Tranquazine",
        "Librium": "Librium", "Serax": "Serax", "Paxipam": "Paxipam", "Centrax": "Centrax", "Verstran": "Verstran",
        "Tranxene": "Tranxene", "Novocain": "Novocaină", "Lidocaine": "Lidocaină", "Procaine": "Procaină",
        "Benzocaine": "Benzocaină", "Tetracaine": "Tetracaină", "Dibucaine": "Dibucaină", "Prilocaine": "Prilocaină",
        "Mepivacaine": "Mepivacaină", "Bupivacaine": "Bupivacaină", "Ropivacaine": "Ropivacaină", "Levobupivacaine": "Levobupivacaină",
        "Articaine": "Articaină", "Etidocaine": "Etidocaină", "Chloroprocaine": "Cloroprocaină", "Hexylcaine": "Hexilcaină",
        "Piperocaine": "Piperocaină", "Propoxycaine": "Propoxicaină", "Cinchocaine": "Cinchocaină", "Amylocaine": "Amilocaină",
        "Isobucaine": "Izobucaină", "Meprylcaine": "Meprilcaină", "Orthocaine": "Ortocaină", "Phenacaine": "Fenacaină",
        "Holocaine": "Holocaină", "Dimethisoquin": "Dimetisoquină", "Dyclonine": "Diclonină", "Falimint": "Falimint",
        "Strepsils": "Strepsils", "Septolete": "Septolete", "Trachisan": "Trachisan", "Laripront": "Laripront",
        "Isla": "Isla", "Emser": "Emser", "Garganta": "Garganta", "Angileptol": "Angileptol", "Tantum Verde": "Tantum Verde",
        "Hexoral": "Hexoral", "Stopangin": "Stopangin", "Orasept": "Orasept", "Ingalipt": "Ingalipt", "Kameton": "Kameton",
        "Proposol": "Proposol", "Yoks": "Yoks", "Lugol": "Lugol", "Miramistin": "Miramistin", "Hlorgeksidin": "Hlorgeksidin",
        "Furacilin": "Furacilin", "Rotokan": "Rotokan", "Romazulan": "Romazulan", "Tonzipret": "Tonzipret", "Tonsilgon": "Tonsilgon",
        "Sinupret": "Sinupret", "Cinnabsin": "Cinnabsin", "Euphorbium": "Euphorbium", "Delufen": "Delufen", "Edas-131": "Edas-131",
        "Rinitol": "Rinitol", "Pinosol": "Pinosol", "Evkacept": "Evkacept", "Sanorin": "Sanorin", "Naftizin": "Naftizin",
        "Galazolin": "Galazolin", "Xilen": "Xilen", "Otrivin": "Otrivin", "Nazivin": "Nazivin", "Fervex": "Fervex",
        "Coldrex": "Coldrex", "Theraflu": "Theraflu", "Antigripin": "Antigripin", "Rinza": "Rinza", "Koldakt": "Koldakt",
        "Flyukold": "Flyukold", "Tsefekon": "Tsefekon", "Panadol": "Panadol", "Efferalgan": "Efferalgan", "Kalpol": "Kalpol",
        "Tylenol": "Tylenol", "Acetaminofen": "Acetaminofen", "Aspirin C": "Aspirin C", "Upsarin Upsa": "Upsarin Upsa",
        "Alka-Seltzer": "Alka-Seltzer", "Rennie": "Rennie", "Gaviscon": "Gaviscon", "Maalox": "Maalox", "Fosfalugel": "Fosfalugel",
        "Almagel": "Almagel", "Gastal": "Gastal", "Relcer": "Relcer", "Ventrisol": "Ventrisol", "De-Nol": "De-Nol",
        "Ultop": "Ultop", "Omez": "Omez", "Losek": "Losek", "Nexium": "Nexium", "Pariet": "Pariet",
        "Zulbex": "Zulbex", "Rabeprazol": "Rabeprazol", "Esomeprazol": "Esomeprazol", "Pantoprazol": "Pantoprazol", "Lansoprazol": "Lansoprazol",
        "Omeprazol": "Omeprazol", "Ranitidin": "Ranitidin", "Famotidin": "Famotidin", "Cimetidin": "Cimetidin", "Nizatidin": "Nizatidin",
        "Roxatidin": "Roxatidin", "Misoprostol": "Misoprostol", "Enprostil": "Enprostil", "Sucralfat": "Sucralfat", "Bismut subcitrat": "Bismut subcitrat",
        "Platifilin": "Platifilin", "Buscopan": "Buscopan", "No-Shpa": "No-Shpa", "Drotaverin": "Drotaverin", "Papaverin": "Papaverin",
        "Bendazol": "Bendazol", "Dibazol": "Dibazol", "Andipal": "Andipal", "Spazmalgon": "Spazmalgon", "Baralgin": "Baralgin",
        "Maxigan": "Maxigan", "Revalgin": "Revalgin", "Spazgan": "Spazgan", "Brail": "Brail", "Tozalgon": "Tozalgon",
        "Trigan D": "Trigan D", "Pentalgin": "Pentalgin", "Sedalgin": "Sedalgin", "Kafetin": "Kafetin", "Askofen": "Askofen",
        "Citramon": "Citramon", "Excedrin": "Excedrin", "Migrenol": "Migrenol", "Tempalgin": "Tempalgin", "Analgin": "Analgin",
        "Metamizol": "Metamizol", "Dipiron": "Dipiron", "Novalgin": "Novalgin", "Optalidon": "Optalidon", "Spazdolzin": "Spazdolzin",
        "Toradol": "Toradol", "Ketorolac": "Ketorolac", "Ketanov": "Ketanov", "Ketonal": "Ketonal", "Artrozilen": "Artrozilen",
        "Flamax": "Flamax", "Dolak": "Dolak", "Ketalgin": "Ketalgin", "Ketoprofen": "Ketoprofen", "Profenid": "Profenid",
        "Fastum gel": "Fastum gel", "Ketonal gel": "Ketonal gel", "Flexen": "Flexen", "Artrozilen gel": "Artrozilen gel", "Bystrumgel": "Bystrumgel",
        "Ibuprofen": "Ibuprofen", "Nurofen": "Nurofen", "Mig": "Mig", "Faspik": "Faspik", "Ibuklin": "Ibuklin",
        "Markopain": "Markopain", "Next": "Next", "Brufen": "Brufen", "Advil": "Advil", "Motrin": "Motrin",
        "Naproxen": "Naproxen", "Nalgezin": "Nalgezin", "Apronax": "Apronax", "Sanaprox": "Sanaprox", "Pronaxen": "Pronaxen",
        "Diclofenac": "Diclofenac", "Voltaren": "Voltaren", "Ortofen": "Ortofen", "Diklak": "Diklak", "Diklogen": "Diklogen",
        "Naklofen": "Naklofen", "Artrozilen": "Artrozilen", "Indometacin": "Indometacin", "Metindol": "Metindol", "Indovazin": "Indovazin",
        "Piroxicam": "Piroxicam", "Finalgel": "Finalgel", "Remoxid": "Remoxid", "Feldene": "Feldene", "Meloxicam": "Meloxicam",
        "Movalis": "Movalis", "Amelotex": "Amelotex", "Artrozoxan": "Artrozoxan", "Lem": "Lem", "Mesipol": "Mesipol",
        "Nimesil": "Nimesil", "Nimesulid": "Nimesulid", "Nise": "Nise", "Aulin": "Aulin", "Koksal": "Koksal",
        "Nemulex": "Nemulex", "Nimid": "Nimid", "Nimesan": "Nimesan", "Nimegesik": "Nimegesik", "Mesulid": "Mesulid",
        "Celecoxib": "Celecoxib", "Celebrex": "Celebrex", "Arcoxia": "Arcoxia", "Etoricoxib": "Etoricoxib", "Dinastat": "Dinastat",
        "Revmalor": "Revmalor", "Zaldiar": "Zaldiar", "Tramadol": "Tramadol", "Tramal": "Tramal", "Contramal": "Contramal",
        "Tramadolor": "Tramadolor", "Fentanyl": "Fentanil", "Duragesic": "Duragesic", "Morfina": "Morfină", "MST Continus": "MST Continus",
        "Sevredol": "Sevredol", "Morphitec": "Morphitec", "Codeina": "Codeină", "Codelact": "Codelact", "Terpinkod": "Terpinkod",
        "Solpadein": "Solpadein", "Pentalgin N": "Pentalgin N", "Sedal-M": "Sedal-M", "Kaffetin": "Kaffetin", "Citropack": "Citropack",
        "Askofen-P": "Askofen-P", "Citramon-P": "Citramon-P", "Excedrin": "Excedrin", "Migrenol": "Migrenol", "Tempalgin": "Tempalgin",
        "Analgin": "Analgin", "Metamizol": "Metamizol", "Dipiron": "Dipiron", "Novalgin": "Novalgin", "Optalidon": "Optalidon",
        "Spazdolzin": "Spazdolzin", "Toradol": "Toradol", "Ketorolac": "Ketorolac", "Ketanov": "Ketanov", "Ketonal": "Ketonal",
        "Artrozilen": "Artrozilen", "Flamax": "Flamax", "Dolak": "Dolak", "Ketalgin": "Ketalgin", "Ketoprofen": "Ketoprofen",
        "Profenid": "Profenid", "Fastum gel": "Fastum gel", "Ketonal gel": "Ketonal gel", "Flexen": "Flexen", "Artrozilen gel": "Artrozilen gel",
        "Bystrumgel": "Bystrumgel", "Ibuprofen": "Ibuprofen", "Nurofen": "Nurofen", "Mig": "Mig", "Faspik": "Faspik",
        "Ibuklin": "Ibuklin", "Markopain": "Markopain", "Next": "Next", "Brufen": "Brufen", "Advil": "Advil",
        "Motrin": "Motrin", "Naproxen": "Naproxen", "Nalgezin": "Nalgezin", "Apronax": "Apronax", "Sanaprox": "Sanaprox",
        "Pronaxen": "Pronaxen", "Diclofenac": "Diclofenac", "Voltaren": "Voltaren", "Ortofen": "Ortofen", "Diklak": "Diklak",
        "Diklogen": "Diklogen", "Naklofen": "Naklofen", "Artrozilen": "Artrozilen", "Indometacin": "Indometacin", "Metindol": "Metindol",
        "Indovazin": "Indovazin", "Piroxicam": "Piroxicam", "Finalgel": "Finalgel", "Remoxid": "Remoxid", "Feldene": "Feldene",
        "Meloxicam": "Meloxicam", "Movalis": "Movalis", "Amelotex": "Amelotex", "Artrozoxan": "Artrozoxan", "Lem": "Lem",
        "Mesipol": "Mesipol", "Nimesil": "Nimesil", "Nimesulid": "Nimesulid", "Nise": "Nise", "Aulin": "Aulin",
        "Koksal": "Koksal", "Nemulex": "Nemulex", "Nimid": "Nimid", "Nimesan": "Nimesan", "Nimegesik": "Nimegesik",
        "Mesulid": "Mesulid", "Celecoxib": "Celecoxib", "Celebrex": "Celebrex", "Arcoxia": "Arcoxia", "Etoricoxib": "Etoricoxib",
        "Dinastat": "Dinastat", "Revmalor": "Revmalor", "Zaldiar": "Zaldiar", "Tramadol": "Tramadol", "Tramal": "Tramal",
        "Contramal": "Contramal", "Tramadolor": "Tramadolor", "Fentanyl": "Fentanil", "Duragesic": "Duragesic", "Morfina": "Morfină",
        "MST Continus": "MST Continus", "Sevredol": "Sevredol", "Morphitec": "Morphitec", "Codeina": "Codeină", "Codelact": "Codelact",
        "Terpinkod": "Terpinkod", "Solpadein": "Solpadein", "Pentalgin N": "Pentalgin N", "Sedal-M": "Sedal-M", "Kaffetin": "Kaffetin",
        "Citropack": "Citropack", "Askofen-P": "Askofen-P", "Citramon-P": "Citramon-P"
    }
    for eng, ro in replacements.items():
        text = text.replace(eng, ro)
    return text

def get_product_details(url):
    try:
        resp = requests.get(url, timeout=15)
        if resp.status_code != 200: return None
        soup = BeautifulSoup(resp.content, 'html.parser')
        
        # Extrage ID-ul din URL (ex: /product/12345/)
        product_id = None
        match = re.search(r'/product/(\d+)/', url)
        if match:
            product_id = int(match.group(1))
        
        if not product_id: return None

        title_tag = soup.find('h1', class_='product_title')
        title = title_tag.text.strip() if title_tag else "Unknown Product"
        
        # Price
        price_tag = soup.find('span', class_='woocommerce-Price-amount')
        price = 0
        if price_tag:
            price_text = price_tag.text.replace('lei', '').replace(',', '.').strip()
            try: price = float(price_text) * 100
            except: pass
            
        # Images
        images = []
        gallery_div = soup.find('div', class_='woocommerce-product-gallery')
        if gallery_div:
            imgs = gallery_div.find_all('img')
            for img in imgs:
                src = img.get('data-src') or img.get('src')
                if src and 'http' in src:
                    images.append({"src": f"https://images.weserv.nl/?url={src}&output=jpg"})
        
        if not images:
            main_img = soup.find('img', class_='wp-post-image')
            if main_img:
                src = main_img.get('data-src') or main_img.get('src')
                if src: images.append({"src": f"https://images.weserv.nl/?url={src}&output=jpg"})

        # Description
        desc_div = soup.find('div', class_='woocommerce-Tabs-panel--description')
        description = ""
        if desc_div:
            description = str(desc_div)
            
        # Specs
        specs_html = ""
        specs_table = soup.find('table', class_='shop_attributes')
        if specs_table:
            specs_html = str(specs_table)
            
        full_description = f"{description}<br><br><h3>Specificații Tehnice:</h3>{specs_html}" if specs_html else description
        
        # Categories
        categories = []
        cat_links = soup.select('.posted_in a')
        for link in cat_links:
            categories.append({"name": link.text.strip()})
            
        return {
            "id": product_id,
            "name": translate_text(title),
            "price": int(price),
            "regular_price": int(price),
            "on_sale": False,
            "images": images,
            "description": translate_text(full_description),
            "categories": categories,
            "slug": url.split('/')[-2]
        }
    except Exception as e:
        print(f"Eroare la preluare detalii {url}: {e}")
        return None

def main():
    page = 1
    max_pages = 182
    
    while page <= max_pages:
        url = f"{CATALOG_URL}page/{page}/" if page > 1 else CATALOG_URL
        print(f"Procesare pagina {page}/{max_pages}...")
        
        try:
            resp = requests.get(url, timeout=15)
            if resp.status_code != 200: break
            soup = BeautifulSoup(resp.content, 'html.parser')
            
            product_links = soup.select('.products a[href*="/product/"]')
            if not product_links: break
            
            for link in product_links:
                href = link['href']
                slug = href.split('/')[-2]
                
                # Verifică dacă produsul există deja după ID sau Slug
                exists = False
                for p in existing_products:
                    if p.get('slug') == slug or p.get('id') == get_product_details(href).get('id') if get_product_details(href) else False:
                        exists = True
                        break
                
                if not exists:
                    print(f"  -> Preluare: {slug}")
                    product_data = get_product_details(href)
                    if product_data:
                        new_products.append(product_data)
                        # Salvează progresiv
                        with open(DATA_FILE, 'w') as f:
                            json.dump(existing_products + new_products, f)
                    
                    time.sleep(1) # Pauză
                    
            page += 1
            time.sleep(2) # Pauză între pagini
            
        except Exception as e:
            print(f"Eroare la pagina {page}: {e}")
            break
            
    print(f"Gata! Total produse noi adăugate: {len(new_products)}")

if __name__ == "__main__":
    main()
