import requests
from bs4 import BeautifulSoup
import json
import time
import os
import re

DATA_FILE = 'public/data/products.json'
if os.path.exists(DATA_FILE):
    with open(DATA_FILE, 'r') as f:
        existing_products = json.load(f)
else:
    existing_products = []

existing_ids = {p['id'] for p in existing_products}
new_products = []

# Categorii de scrapat
CATEGORIES = [
    {"url": "https://hocotech.com/category/mobile-accessories/flash-disks/", "name": "Flash Disks"},
    {"url": "https://hocotech.com/category/power/", "name": "Power Banks"},
    {"url": "https://hocotech.com/category/power/wall-chargers/", "name": "Wall Chargers"},
    {"url": "https://hocotech.com/category/audio/", "name": "Audio"},
    {"url": "https://hocotech.com/category/audio/earphones/", "name": "Earphones"},
    {"url": "https://hocotech.com/category/home-office/", "name": "Home Office"},
    {"url": "https://hocotech.com/category/mobile-accessories/", "name": "Mobile Accessories"}
]

def clean_text(text):
    if not text: return ""
    return re.sub(r'\s+', ' ', text).strip()

def get_product_details(url):
    try:
        response = requests.get(url, timeout=10)
        soup = BeautifulSoup(response.content, 'html.parser')
        
        parts = url.rstrip('/').split('/')
        if len(parts) >= 2 and parts[-2].isdigit():
            product_id = int(parts[-2])
        else:
            return None

        if product_id in existing_ids:
            return None

        title_tag = soup.find('h1', class_='product_title')
        title = title_tag.text.strip() if title_tag else "Unknown"
        
        # Traducere simplă prin înlocuire termeni cheie
        replacements = {
            "Wireless": "Fără Fir", "Charger": "Încărcător", "Power Bank": "Power Bank",
            "Headphones": "Căști", "Earphones": "Căști In-Ear", "Holder": "Suport",
            "Case": "Husă", "Cable": "Cablu", "Adapter": "Adaptor", "Smart": "Inteligent",
            "Fast Charging": "Încărcare Rapidă", "Portable": "Portabil", "Black": "Negru",
            "White": "Alb", "Red": "Roșu", "Blue": "Albastru", "Green": "Verde",
            "Pink": "Roz", "Gold": "Auriu", "Silver": "Argintiu", "Gray": "Gri",
            "Phone": "Telefon", "Car": "Auto", "Desk": "Birou", "Speaker": "Difuzor",
            "Microphone": "Microfon", "Camera": "Cameră", "LED": "LED", "USB": "USB",
            "Type-C": "Tip-C", "Lightning": "Lightning", "HDMI": "HDMI", "Audio": "Audio",
            "Video": "Video", "Data": "Date", "Sync": "Sincronizare", "Charge": "Încărcare",
            "Battery": "Baterie", "Capacity": "Capacitate", "mAh": "mAh", "Watt": "Wați",
            "Volt": "Volți", "Input": "Intrare", "Output": "Ieșire", "Protection": "Protecție",
            "Safety": "Siguranță", "Certified": "Certificat", "Original": "Original",
            "High Quality": "Calitate Înaltă", "Premium": "Premium", "Best Seller": "Cel Mai Vândut",
            "New Arrival": "Noutate", "Sale": "Reducere", "Discount": "Discount",
            "Offer": "Ofertă", "Deal": "Ofertă Specială", "Bundle": "Pachet", "Set": "Set",
            "Kit": "Kit", "Pack": "Pachet", "Piece": "Bucată", "Pcs": "Buc", "Unit": "Unitate",
            "Item": "Articol", "Product": "Produs", "Accessory": "Accesorii", "Gadget": "Gadget",
            "Tool": "Unealtă", "Device": "Dispozitiv", "Electronic": "Electronic", "Digital": "Digital",
            "Analog": "Analog", "Signal": "Semnal", "Frequency": "Frecvență", "Range": "Rază",
            "Distance": "Distanță", "Speed": "Viteză", "Performance": "Performanță",
            "Efficiency": "Eficiență", "Durability": "Durabilitate", "Resistance": "Rezistență",
            "Waterproof": "Rezistent la Apă", "Dustproof": "Rezistent la Praf", "Shockproof": "Rezistent la Șocuri",
            "Drop Proof": "Rezistent la Căderi", "Scratch Resistant": "Rezistent la Zgârieturi",
            "Anti-Fingerprint": "Anti-Amprentă", "Matte": "Mat", "Glossy": "Lucios",
            "Transparent": "Transparent", "Clear": "Clar", "Opaque": "Opac", "Flexible": "Flexibil",
            "Rigid": "Rigid", "Soft": "Moale", "Hard": "Dur", "Lightweight": "Ușor",
            "Heavy": "Greu", "Compact": "Compact", "Slim": "Subțire", "Thin": "Subțire",
            "Thick": "Gros", "Wide": "Lat", "Narrow": "Îngust", "Long": "Lung", "Short": "Scurt",
            "Tall": "Înalt", "Low": "Jos", "High": "Înalt", "Big": "Mare", "Small": "Mic",
            "Large": "Mare", "Tiny": "Foarte Mic", "Huge": "Imens", "Massive": "Masiv",
            "Standard": "Standard", "Custom": "Personalizat", "Universal": "Universal",
            "Specific": "Specific", "Compatible": "Compatibil", "Incompatible": "Incompatibil",
            "Support": "Suport", "Does Not Support": "Nu Suportă", "Works With": "Funcționează Cu",
            "Designed For": "Proiectat Pentru", "Made In": "Fabricat În", "Imported": "Importat",
            "Local": "Local", "Global": "Global", "International": "Internațional", "Domestic": "Național",
            "Foreign": "Străin", "Brand": "Brand", "Model": "Model", "Version": "Versiune",
            "Generation": "Generație", "Year": "An", "Month": "Lună", "Day": "Zi", "Week": "Săptămână",
            "Hour": "Oră", "Minute": "Minut", "Second": "Secundă", "Time": "Timp", "Date": "Dată",
            "Schedule": "Program", "Calendar": "Calendar", "Event": "Eveniment", "Meeting": "Întâlnire",
            "Appointment": "Programare", "Reminder": "Memento", "Notification": "Notificare",
            "Alert": "Alertă", "Warning": "Avertisment", "Error": "Eroare", "Success": "Succes",
            "Failure": "Eșec", "Problem": "Problemă", "Solution": "Soluție", "Fix": "Reparație",
            "Repair": "Reparație", "Maintenance": "Întreținere", "Service": "Serviciu",
            "Help": "Ajutor", "Guide": "Ghid", "Manual": "Manual", "Instruction": "Instrucțiune",
            "Tutorial": "Tutorial", "Lesson": "Lecție", "Course": "Curs", "Training": "Instruire",
            "Education": "Educație", "Learning": "Învățare", "Study": "Studiu", "Research": "Cercetare",
            "Development": "Dezvoltare", "Innovation": "Inovație", "Technology": "Tehnologie",
            "Science": "Știință", "Engineering": "Inginerie", "Design": "Design", "Art": "Artă",
            "Culture": "Cultură", "History": "Istorie", "Geography": "Geografie", "Politics": "Politică",
            "Economy": "Economie", "Business": "Afaceri", "Finance": "Finanțe", "Marketing": "Marketing",
            "Sales": "Vânzări", "Management": "Management", "Leadership": "Leadership", "Team": "Echipă",
            "Collaboration": "Colaborare", "Communication": "Comunicare", "Networking": "Networking",
            "Social": "Social", "Media": "Media", "Internet": "Internet", "Web": "Web", "Online": "Online",
            "Offline": "Offline", "Cloud": "Cloud", "Server": "Server", "Database": "Bază de Date",
            "Software": "Software", "Hardware": "Hardware", "App": "Aplicație", "Application": "Aplicație",
            "Program": "Program", "Code": "Cod", "Script": "Script", "Algorithm": "Algoritm",
            "AI": "IA", "Machine Learning": "Învățare Automată", "Deep Learning": "Învățare Profundă",
            "Neural Network": "Rețea Neurală", "Robotics": "Robotică", "Automation": "Automatizare",
            "IoT": "IoT", "Smart Home": "Casă Inteligentă", "Wearable": "Wearable", "VR": "VR",
            "AR": "AR", "MR": "MR", "Metaverse": "Metavers", "Crypto": "Crypto", "Blockchain": "Blockchain",
            "NFT": "NFT", "Bitcoin": "Bitcoin", "Ethereum": "Ethereum", "Token": "Token", "Coin": "Monedă",
            "Wallet": "Portofel", "Exchange": "Schimb", "Trading": "Tranzacționare", "Investment": "Investiție",
            "Stock": "Acțiune", "Market": "Piață", "Price": "Preț", "Cost": "Cost", "Value": "Valoare",
            "Profit": "Profit", "Loss": "Pierdere", "Revenue": "Venit", "Income": "Venit", "Expense": "Cheltuială",
            "Budget": "Buget", "Tax": "Taxă", "Fee": "Taxă", "Commission": "Comision", "Coupon": "Cupon",
            "Voucher": "Voucher", "Gift": "Cadou", "Reward": "Recompensă", "Bonus": "Bonus", "Prize": "Premiu",
            "Award": "Premiu", "Contest": "Concurs", "Competition": "Competiție", "Game": "Joc", "Sport": "Sport",
            "Fitness": "Fitness", "Health": "Sănătate", "Wellness": "Bunăstare", "Beauty": "Frumusețe",
            "Fashion": "Modă", "Style": "Stil", "Trend": "Tendință", "Luxury": "Lux", "Exclusive": "Exclusiv",
            "Limited": "Limitat", "Rare": "Rar", "Unique": "Unic", "Special": "Special", "Handmade": "Făcut Manual",
            "Artisan": "Artizanal", "Craft": "Meșteșug", "DIY": "DIY", "Hobby": "Hobby", "Interest": "Interes",
            "Passion": "Pasiune", "Love": "Dragoste", "Like": "Like", "Follow": "Urmărește", "Subscribe": "Abonează-te",
            "Join": "Alătură-te", "Member": "Membru", "Community": "Comunitate", "Forum": "Forum", "Chat": "Chat",
            "Message": "Mesaj", "Email": "Email", "SMS": "SMS", "Call": "Apel", "Voice": "Voce",
            "Video Call": "Apel Video", "Conference": "Conferință", "Webinar": "Webinar", "Live Stream": "Transmisiune Live",
            "Broadcast": "Transmisiune", "Podcast": "Podcast", "Blog": "Blog", "Article": "Articol", "Post": "Postare",
            "Comment": "Comentariu", "Review": "Recenzie", "Rating": "Evaluare", "Feedback": "Feedback",
            "Survey": "Sondaj", "Poll": "Sondaj", "Vote": "Vot", "Petition": "Petiție", "Campaign": "Campanie",
            "Movement": "Mișcare", "Cause": "Cauză", "Charity": "Caritate", "Donation": "Donație",
            "Fundraising": "Strângere de Fonduri", "Volunteer": "Voluntar", "Activism": "Activism",
            "Protest": "Protest", "Demonstration": "Demonstrație", "Rally": "Mitinq", "March": "Marș",
            "Strike": "Greva", "Boycott": "Boicot", "Sanction": "Sancțiune", "Embargo": "Embargo",
            "Trade": "Comerț", "Commerce": "Comerț", "Retail": "Retail", "Wholesale": "En-gros",
            "Distribution": "Distribuție", "Logistics": "Logistică", "Supply Chain": "Lanț de Aprovizionare",
            "Inventory": "Inventar", "Stock": "Stoc", "Warehouse": "Depozit", "Shipping": "Transport",
            "Delivery": "Livrare", "Courier": "Curier", "Package": "Pachet", "Parcel": "Colet", "Box": "Cutie",
            "Envelope": "Plic", "Label": "Etichetă", "Tag": "Tag", "Barcode": "Cod de Bare", "QR Code": "Cod QR",
            "RFID": "RFID", "NFC": "NFC", "Sensor": "Senzor", "Detector": "Detector", "Monitor": "Monitor",
            "Tracker": "Tracker", "GPS": "GPS", "Location": "Locație", "Map": "Hartă", "Navigation": "Navigație",
            "Route": "Rută", "Direction": "Direcție", "Destination": "Destinație", "Origin": "Origine",
            "Start": "Start", "End": "Sfârșit", "Begin": "Începe", "Finish": "Termină", "Complete": "Complet",
            "Incomplete": "Incomplet", "Partial": "Parțial", "Full": "Plin", "Empty": "Gol", "Available": "Disponibil",
            "Unavailable": "Indisponibil", "In Stock": "În Stoc", "Out of Stock": "Stoc Epuizat", "Pre-order": "Pre-comandă",
            "Backorder": "Comandă Întârziată", "Restock": "Reaprovizionare", "New": "Nou", "Used": "Folosit",
            "Refurbished": "Recondiționat", "Open Box": "Cutie Deschisă", "Damaged": "Deteriorat", "Defective": "Defect",
            "Broken": "Stricat", "Fixed": "Reparat", "Repaired": "Reparat", "Restored": "Restaurat", "Renewed": "Reînnoit",
            "Updated": "Actualizat", "Upgraded": "Îmbunătățit", "Downgraded": "Degradat", "Changed": "Schimbat",
            "Modified": "Modificat", "Altered": "Alterat", "Transformed": "Transformat", "Converted": "Convertit",
            "Translated": "Tradus", "Interpreted": "Interpretat", "Explained": "Explicat", "Described": "Descris",
            "Defined": "Definit", "Identified": "Identificat", "Recognized": "Recunoscut", "Acknowledged": "Recunoscut",
            "Accepted": "Acceptat", "Rejected": "Respins", "Approved": "Aprobat", "Denied": "Refuzat", "Granted": "Acordat",
            "Revoked": "Revocat", "Cancelled": "Anulat", "Void": "Nul", "Valid": "Valid", "Invalid": "Invalid",
            "True": "Adevărat", "False": "Fals", "Yes": "Da", "No": "Nu", "Maybe": "Poate", "Perhaps": "Poate",
            "Possibly": "Posibil", "Probably": "Probabil", "Certainly": "Cu Siguranță", "Definitely": "Cu Siguranță",
            "Absolutely": "Absolut", "Exactly": "Exact", "Precisely": "Precis", "Approximately": "Aproximativ",
            "Roughly": "Aproximativ", "About": "Despre", "Around": "În Jurul", "Near": "Lângă", "Far": "Departe",
            "Close": "Aproape", "Distant": "Îndepărtat", "Remote": "Îndepărtat", "Isolated": "Izolat", "Connected": "Conectat",
            "Disconnected": "Deconectat", "Linked": "Legat", "Unlinked": "Nelegat", "Attached": "Atașat", "Detached": "Detașat",
            "Joined": "Unit", "Separated": "Separat", "Combined": "Combinat", "Divided": "Împărțit", "Split": "Împărțit",
            "Merged": "Fuzionat", "Integrated": "Integrat", "Unified": "Unificat", "Consolidated": "Consolidat",
            "Centralized": "Centralizat", "Decentralized": "Descentralizat", "Distributed": "Distribuit", "Shared": "Partajat",
            "Private": "Privat", "Public": "Public", "Secret": "Secret", "Confidential": "Confidențial", "Secure": "Securizat",
            "Unsafe": "Nesigur", "Safe": "Sigur", "Dangerous": "Periculos", "Risky": "Riscant", "Hazardous": "Periculos",
            "Toxic": "Toxic", "Poisonous": "Otrăvitor", "Harmful": "Dăunător", "Beneficial": "Benefic", "Helpful": "Util",
            "Useful": "Util", "Useless": "Inutil", "Worthless": "Fără Valoare", "Valuable": "Valoros", "Precious": "Prețios",
            "Expensive": "Scump", "Cheap": "Ieftin", "Affordable": "Accesibil", "Costly": "Costisitor", "Pricey": "Scump",
            "Budget-Friendly": "Prietenos cu Bugetul", "Economical": "Economic", "Efficient": "Eficient", "Inefficient": "Ineficient",
            "Productive": "Productiv", "Unproductive": "Neproductiv", "Effective": "Eficient", "Ineffective": "Ineficient",
            "Successful": "De Succes", "Unsuccessful": "Fără Succes", "Winning": "Câștigător", "Losing": "Pierzător",
            "Victory": "Victorie", "Defeat": "Înfrângere", "Triumph": "Triumf", "Achievement": "Realizare",
            "Accomplishment": "Realizare", "Goal": "Obiectiv", "Target": "Țintă", "Objective": "Obiectiv", "Aim": "Scop",
            "Purpose": "Scop", "Mission": "Misiune", "Vision": "Viziune", "Strategy": "Strategie", "Plan": "Plan",
            "Tactic": "Tactică", "Method": "Metodă", "Approach": "Abordare", "Technique": "Tehnică", "Skill": "Abilitate",
            "Talent": "Talent", "Ability": "Abilitate", "Capability": "Capacitate", "Potential": "Potențial", "Strength": "Putere",
            "Weakness": "Slăbiciune", "Advantage": "Avantaj", "Disadvantage": "Dezavantaj", "Benefit": "Beneficiu",
            "Drawback": "Dezavantaj", "Pro": "Pro", "Con": "Contra", "Plus": "Plus", "Minus": "Minus", "Positive": "Pozitiv",
            "Negative": "Negativ", "Good": "Bun", "Bad": "Rău", "Better": "Mai Bun", "Worse": "Mai Rău", "Best": "Cel Mai Bun",
            "Worst": "Cel Mai Rău", "Great": "Groaznic", "Terrible": "Teribil", "Excellent": "Excelent", "Poor": "Slab",
            "Superior": "Superior", "Inferior": "Inferior", "High": "Înalt", "Low": "Jos", "Top": "Sus", "Bottom": "Jos",
            "Upper": "Superior", "Lower": "Inferior", "Front": "Față", "Back": "Spate", "Left": "Stânga", "Right": "Dreapta",
            "Center": "Centru", "Middle": "Mijloc", "Side": "Lateral", "Edge": "Margine", "Corner": "Colț", "Inside": "Interior",
            "Outside": "Exterior", "Internal": "Intern", "External": "Extern", "Inner": "Interior", "Outer": "Exterior",
            "Surface": "Suprafață", "Depth": "Adâncime", "Height": "Înălțime", "Width": "Lățime", "Length": "Lungime",
            "Size": "Dimensiune", "Dimension": "Dimensiune", "Volume": "Volum", "Area": "Arie", "Space": "Spațiu",
            "Room": "Cameră", "Place": "Loc", "Spot": "Loc", "Position": "Poziție", "Site": "Site", "Venue": "Locație",
            "Address": "Adresă", "Street": "Stradă", "Road": "Drum", "Highway": "Autostradă", "Path": "Cale", "Trail": "Potecă",
            "Track": "Pistă", "Lane": "Bandă", "Way": "Cale", "Orientation": "Orientare", "Alignment": "Aliniere",
            "Angle": "Unghi", "Degree": "Grad", "Level": "Nivel", "Stage": "Etapă", "Phase": "Fază", "Step": "Pas",
            "Process": "Proces", "Procedure": "Procedură", "Operation": "Operație", "Function": "Funcție", "Feature": "Caracteristică",
            "Characteristic": "Caracteristică", "Attribute": "Atribut", "Property": "Proprietate", "Quality": "Calitate",
            "Quantity": "Cantitate", "Amount": "Cantitate", "Number": "Număr", "Count": "Număr", "Total": "Total", "Sum": "Sumă",
            "Average": "Medie", "Mean": "Medie", "Median": "Mediană", "Mode": "Mod", "Range": "Interval", "Variance": "Varianță",
            "Standard Deviation": "Deviație Standard", "Probability": "Probabilitate", "Chance": "Șansă", "Likelihood": "Probabilitate",
            "Risk": "Risc", "Uncertainty": "Incertitudine", "Certainty": "Certitudine", "Confidence": "Încredere", "Trust": "Încredere",
            "Belief": "Credință", "Faith": "Credință", "Hope": "Speranță", "Dream": "Vis", "Wish": "Dorință", "Desire": "Dorință",
            "Want": "Dorință", "Need": "Nevoie", "Requirement": "Cerință", "Demand": "Cerere", "Supply": "Ofertă", "Request": "Cerere",
            "Order": "Comandă", "Purchase": "Achiziție", "Buy": "Cumpără", "Sell": "Vinde", "Swap": "Schimb", "Barter": "Trocul",
            "Negotiate": "Negociază", "Bargain": "Târguială", "Contract": "Contract", "Agreement": "Acord", "Promise": "Promisiune",
            "Commitment": "Angajament", "Obligation": "Obligație", "Duty": "Datorie", "Responsibility": "Responsabilitate",
            "Accountability": "Răspundere", "Liability": "Răspundere", "Guarantee": "Garanție", "Warranty": "Garanție",
            "Insurance": "Asigurare", "Defense": "Apărare", "Offense": "Atac", "Attack": "Atac", "Assault": "Asalt",
            "Violence": "Violență", "Peace": "Pace", "War": "Război", "Conflict": "Conflict", "Dispute": "Dispută",
            "Argument": "Argument", "Debate": "Dezbatere", "Discussion": "Discuție", "Conversation": "Conversație",
            "Dialogue": "Dialog", "Speech": "Discurs", "Presentation": "Prezentare", "Lecture": "Prelegere", "Talk": "Vorbește",
            "Speak": "Vorbește", "Say": "Spune", "Tell": "Spune", "Ask": "Întreabă", "Answer": "Răspunde", "Reply": "Răspunde",
            "Respond": "Răspunde", "Question": "Întrebare", "Query": "Interogare", "Inquiry": "Anchetă", "Investigation": "Investigație",
            "Examination": "Examinare", "Inspection": "Inspecție", "Audit": "Audit", "Analysis": "Analiză", "Evaluation": "Evaluare",
            "Assessment": "Evaluare", "Test": "Test", "Exam": "Examen", "Quiz": "Quiz", "Challenge": "Provocare", "Trial": "Proces",
            "Experiment": "Experiment", "Discovery": "Descoperire", "Invention": "Invenție", "Creation": "Creație",
            "Production": "Producție", "Manufacturing": "Fabricație", "Assembly": "Asamblare", "Construction": "Construcție",
            "Building": "Clădire", "Structure": "Structură", "Framework": "Cadru", "Skeleton": "Schelet", "Body": "Corp",
            "Form": "Formă", "Shape": "Formă", "Figure": "Figură", "Image": "Imagine", "Picture": "Poză", "Photo": "Foto",
            "Photograph": "Fotografie", "Snapshot": "Instantaneu", "Shot": "Cadru", "Frame": "Cadru", "Scene": "Scenă",
            "View": "Vedere", "Perspective": "Perspectivă", "Focus": "Focus", "Blur": "Estompare", "Sharp": "Clar",
            "Bright": "Luminos", "Dark": "Întunecat", "Light": "Lumină", "Shadow": "Umbră", "Color": "Culoare", "Hue": "Nuanță",
            "Saturation": "Saturație", "Brightness": "Luminozitate", "Contrast": "Contrast", "Resolution": "Rezoluție",
            "Pixel": "Pixel", "Megapixel": "Megapixel", "HD": "HD", "Full HD": "Full HD", "4K": "4K", "8K": "8K",
            "Ultra HD": "Ultra HD", "Retina": "Retina", "Display": "Ecran", "Screen": "Ecran", "TV": "TV", "Television": "Televizor",
            "Projector": "Proiector", "Beam": "Fascicul", "Lens": "Obiectiv", "Zoom": "Zoom", "Aperture": "Diafragmă",
            "Shutter": "Obturator", "ISO": "ISO", "Exposure": "Expunere", "Flash": "Blitz", "Natural Light": "Lumină Naturală",
            "Artificial Light": "Lumină Artificială", "Sunlight": "Lumina Soarelui", "Moonlight": "Lumina Lunii",
            "Starlight": "Lumina Stelelor", "Fire": "Foc", "Flame": "Flacără", "Heat": "Căldură", "Cold": "Frig",
            "Temperature": "Temperatură", "Climate": "Climă", "Weather": "Vreme", "Rain": "Ploaie", "Snow": "Zăpadă",
            "Wind": "Vânt", "Storm": "Furtună", "Thunder": "Tunet", "Lightning": "Fulger", "Cloud": "Nor", "Sky": "Cer",
            "Sun": "Soare", "Moon": "Lună", "Star": "Stea", "Planet": "Planetă", "Earth": "Pământ", "World": "Lume",
            "Universe": "Univers", "Galaxy": "Galaxie", "Cosmos": "Cosmos", "Nature": "Natură", "Environment": "Mediu",
            "Ecology": "Ecologie", "Biology": "Biologie", "Chemistry": "Chimie", "Physics": "Fizică", "Mathematics": "Matematică",
            "Geometry": "Geometrie", "Algebra": "Algebră", "Calculus": "Calcul", "Statistics": "Statistică", "Logic": "Logică",
            "Philosophy": "Filozofie", "Psychology": "Psihologie", "Sociology": "Sociologie", "Anthropology": "Antropologie",
            "Archaeology": "Arheologie", "Geology": "Geologie", "Astronomy": "Astronomie", "Astrology": "Astrologie",
            "Mythology": "Mitologie", "Religion": "Religie", "Spirituality": "Spiritualitate", "God": "Dumnezeu",
            "Devil": "Diavol", "Angel": "Înger", "Demon": "Demon", "Heaven": "Rai", "Hell": "Iad", "Soul": "Suflet",
            "Spirit": "Spirit", "Mind": "Minte", "Brain": "Creier", "Heart": "Inimă", "Disease": "Boală", "Illness": "Boală",
            "Sickness": "Boală", "Cure": "Leac", "Treatment": "Tratament", "Medicine": "Medicină", "Drug": "Medicament",
            "Pill": "Pastilă", "Tablet": "Tabletă", "Capsule": "Capsulă", "Injection": "Injecție", "Surgery": "Chirurgie",
            "Hospital": "Spital", "Clinic": "Clinică", "Doctor": "Doctor", "Nurse": "Asistentă", "Patient": "Pacient",
            "Care": "Îngrijire", "Therapy": "Terapie", "Rehabilitation": "Reabilitare", "Recovery": "Recuperare",
            "Healing": "Vindecare", "Exercise": "Exercițiu", "Workout": "Antrenament", "Gym": "Sală", "Play": "Joacă",
            "Fun": "Distracție", "Entertainment": "Divertisment", "Movie": "Film", "Cinema": "Cinema", "Theater": "Teatru",
            "Music": "Muzică", "Song": "Cântec", "Melody": "Melodie", "Rhythm": "Ritm", "Beat": "Beat", "Note": "Notă",
            "Chord": "Acord", "Instrument": "Instrument", "Guitar": "Chitară", "Piano": "Pian", "Violin": "Vioară",
            "Drums": "Tobe", "Bass": "Bas", "Singer": "Cântăreț", "Band": "Trupă", "Orchestra": "Orchestră", "Concert": "Concert",
            "Festival": "Festival", "Party": "Petrecere", "Celebration": "Sărbătoare", "Holiday": "Sărbătoare", "Vacation": "Vacanță",
            "Trip": "Călătorie", "Travel": "Călătorie", "Tour": "Tur", "Journey": "Călătorie", "Adventure": "Aventură",
            "Explore": "Explorează", "Discover": "Descoperă", "Visit": "Vizitează", "See": "Vezi", "Look": "Privește",
            "Watch": "Urmărește", "Observe": "Observă", "Notice": "Observă", "Perceive": "Percepe", "Sense": "Simte",
            "Feel": "Simte", "Touch": "Atinge", "Smell": "Miros", "Taste": "Gust", "Hear": "Aude", "Listen": "Ascultă",
            "Sound": "Sunet", "Noise": "Zgomot", "Silence": "Liniște", "Quiet": "Liniște", "Loud": "Tare", "Soft": "Încet",
            "Whisper": "Șoaptă", "Shout": "Strigăt", "Scream": "Țipăt", "Laugh": "Râs", "Cry": "Plâns", "Smile": "Zâmbet",
            "Frown": "Încruntare", "Happy": "Fericit", "Sad": "Trist", "Angry": "Furios", "Fear": "Frică", "Joy": "Bucurie",
            "Sorrow": "Tristețe", "Pain": "Durere", "Pleasure": "Plăcere", "Comfort": "Confort", "Discomfort": "Disconfort",
            "Ease": "Ușurință", "Difficulty": "Dificultate", "Simple": "Simplu", "Complex": "Complex", "Easy": "Ușor",
            "Hard": "Greu", "Difficult": "Dificil", "Challenging": "Provocator", "Interesting": "Interesant", "Boring": "Plictisitor",
            "Exciting": "Emoționant", "Thrilling": "Palpitant", "Amazing": "Uimitor", "Wonderful": "Minunat", "Beautiful": "Frumos",
            "Ugly": "Urât", "Pretty": "Drăguț", "Handsome": "Chipeș", "Cute": "Drăguț", "Lovely": "Încântător",
            "Charming": "Farmec", "Attractive": "Atractiv", "Repulsive": "Respingător", "Disgusting": "Dezgustător",
            "Clean": "Curat", "Dirty": "Murdar", "Fresh": "Proaspăt", "Stale": "Învechit", "Old": "Vechi", "Young": "Tânăr",
            "Ancient": "Antic", "Modern": "Modern", "Traditional": "Tradițional", "Classic": "Clasic", "Vintage": "Vintage",
            "Retro": "Retro", "Futuristic": "Futurist", "Advanced": "Avansat", "Primitive": "Primitiv", "Basic": "De Bază",
            "Professional": "Profesional", "Amateur": "Amator", "Expert": "Expert", "Novice": "Începător", "Master": "Maestru",
            "Student": "Student", "Teacher": "Profesor", "Professor": "Profesor", "Scholar": "Cărturar", "Scientist": "Om de Știință",
            "Engineer": "Inginer", "Artist": "Artist", "Writer": "Scriitor", "Author": "Autor", "Editor": "Editor",
            "Publisher": "Editor", "Journalist": "Jurnalist", "Reporter": "Reporter", "Anchor": "Prezentator", "Host": "Gazdă",
            "Guest": "Oaspete", "Visitor": "Vizitator", "Tourist": "Turist", "Traveler": "Călător", "Explorer": "Explorator",
            "Adventurer": "Aventurier", "Hero": "Erou", "Villain": "Răufăcător", "Protagonist": "Protagonist", "Antagonist": "Antagonist",
            "Character": "Personaj", "Role": "Rol", "Actor": "Actor", "Actress": "Actriță", "Director": "Regizor",
            "Producer": "Producător", "Crew": "Echipă", "Staff": "Personal", "Employee": "Angajat", "Employer": "Angajator",
            "Boss": "Șef", "Manager": "Manager", "Leader": "Lider", "Follower": "Următor", "Group": "Grup", "Crowd": "Mulțime",
            "Audience": "Public", "Fan": "Fan", "Supporter": "Suporter", "Critic": "Critic", "Reviewer": "Recenzent",
            "Judge": "Judecător", "Jury": "Juriu", "Winner": "Câștigător", "Loser": "Pierzător", "Champion": "Campion",
            "Runner-up": "Locul Doi", "Participant": "Participant", "Competitor": "Competitor", "Opponent": "Adversar",
            "Rival": "Rival", "Enemy": "Inamic", "Friend": "Prieten", "Ally": "Aliat", "Partner": "Partener", "Colleague": "Coleg",
            "Associate": "Asociat", "Contact": "Contact", "Network": "Rețea", "Connection": "Conexiune", "Link": "Legătură",
            "Bond": "Legătură", "Relationship": "Relație", "Family": "Familie", "Parent": "Părinte", "Child": "Copil",
            "Sibling": "Frate/Soră", "Spouse": "Soț/Soție", "Husband": "Soț", "Wife": "Soție", "Son": "Fiul", "Daughter": "Fiica",
            "Brother": "Frate", "Sister": "Soră", "Grandparent": "Bunic", "Grandchild": "Nepot", "Uncle": "Unchi", "Aunt": "Mătușă",
            "Cousin": "Văr", "Nephew": "Nepot", "Niece": "Nepoată", "Relative": "Rudă", "Ancestor": "Strămoș",
            "Descendant": "Descendent", "Lineage": "Linie", "Heritage": "Moștenire", "Legacy": "Moștenire", "Tradition": "Tradiție",
            "Custom": "Obicei", "Society": "Societate", "Nation": "Națiune", "Country": "Țară", "State": "Stat", "City": "Oraș",
            "Town": "Oraș", "Village": "Sat", "Neighborhood": "Cartier", "District": "District", "Region": "Regiune",
            "Province": "Provincie", "Territory": "Teritoriu", "Zone": "Zonă", "Sector": "Sector", "Department": "Departament",
            "Division": "Divizie", "Branch": "Ramură", "Office": "Birou", "Headquarters": "Sediu", "Base": "Bază", "Camp": "Tabără",
            "Station": "Stație", "Terminal": "Terminal", "Hub": "Hub", "Core": "Nucleu", "Essence": "Esență", "Life": "Viață",
            "Death": "Moarte", "Birth": "Naștere", "Growth": "Creștere", "Evolution": "Evoluție", "Change": "Schimbare",
            "Transformation": "Transformare", "Metamorphosis": "Metamorfoză", "Cycle": "Ciclu", "Loop": "Buclă", "Circle": "Cerc",
            "Sphere": "Sferă", "Globe": "Glob", "Infinity": "Infinit", "Eternity": "Eternitate", "Reality": "Realitate",
            "Illusion": "Iluzie", "Nightmare": "Coșmar", "Fantasy": "Fantezie", "Imagination": "Imaginație", "Creativity": "Creativitate",
            "Inspiration": "Inspirație", "Motivation": "Motivație", "Drive": "Impuls", "Ambition": "Ambiție", "Gain": "Câștig",
            "Pros": "Pro", "Cons": "Contra", "Right": "Corect", "Wrong": "Greșit", "Fact": "Fapt", "Opinion": "Opinie",
            "Knowledge": "Cunoștințe", "Wisdom": "Înțelepciune", "Intelligence": "Inteligență", "Smart": "Deștept", "Stupid": "Prost",
            "Genius": "Geniu", "Idiot": "Idiot", "Clever": "Isteț", "Foolish": "Nebun", "Wise": "Înțelept", "Ignorant": "Ignorant",
            "Educated": "Educat"
        }
        
        for eng, ro in replacements.items():
            title = title.replace(eng, ro)

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
        for eng, ro in replacements.items():
            description = description.replace(eng, ro)

        return {
            "id": product_id,
            "name": title,
            "price": int(price),
            "regular_price": int(price),
            "on_sale": False,
            "images": images,
            "description": description,
            "categories": [{"name": cat["name"]}],
            "slug": parts[-2] if len(parts) >= 2 else str(product_id)
        }
    except Exception as e:
        print(f"Eroare la {url}: {e}")
        return None

print("Începere scraping extra produse...")
for cat in CATEGORIES:
    page = 1
    while True:
        full_url = f"{cat['url']}page/{page}/" if page > 1 else cat['url']
        try:
            resp = requests.get(full_url, timeout=10)
            if resp.status_code != 200: 
                break
            
            soup = BeautifulSoup(resp.content, 'html.parser')
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
            time.sleep(1)
        except Exception as e:
            print(f"Eroare pagină {full_url}: {e}")
            break

all_products = existing_products + new_products
with open(DATA_FILE, 'w') as f:
    json.dump(all_products, f)

print(f"Gata! Total produse acum: {len(all_products)}")
