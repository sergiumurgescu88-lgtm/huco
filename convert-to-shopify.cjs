const fs = require('fs');
const { parse } = require('json2csv');

console.log('Încărcare date...');
const products = JSON.parse(fs.readFileSync('public/data/products.json', 'utf8'));
const categories = JSON.parse(fs.readFileSync('public/data/categories.json', 'utf8'));

// Mapăm ID-ul categoriei la Nume
const catMap = {};
categories.forEach(c => catMap[c.id] = c.name);

console.log(`Procesare ${products.length} produse pentru Shopify...`);

const shopifyProducts = products.map(p => {
    // Determinăm categoria principală
    let mainCat = (p.categories && p.categories.length > 0) ? catMap[p.categories[0].id] : 'General';
    
    // Construim lista de tag-uri din toate categoriile
    let tags = p.categories ? p.categories.map(c => c.name).join(', ') : '';

    // Gestionăm imaginile - folosim URL-urile originale de la sursă pentru import
    // Shopify va descărca automat imaginile de la aceste URL-uri în timpul importului
    let imageSrc = '';
    let imageAlt = p.name;
    
    if (p.images && p.images.length > 0) {
        // Prima imagine este cea principală
        // Verificăm dacă imaginea are proprietatea src sau este direct string
        const firstImg = p.images[0];
        imageSrc = (typeof firstImg === 'object' && firstImg.src) ? firstImg.src : firstImg;
        
        // Imagini suplimentare (separate prin virgulă pentru Shopify)
        if (p.images.length > 1) {
             const additionalImages = p.images.slice(1).map(img => 
                 (typeof img === 'object' && img.src) ? img.src : img
             ).join(',');
             imageSrc += ',' + additionalImages;
        }
    }

    // Calculăm prețurile (API WooCommerce returnează în cenți sau unități mici)
    // Verificăm dacă prețul există pentru a evita NaN
    const price = p.price ? (p.price / 100).toFixed(2) : '0.00';
    const comparePrice = (p.on_sale && p.regular_price) ? (p.regular_price / 100).toFixed(2) : '';

    return {
        Handle: p.slug || `hoco-${p.id}`,
        Title: p.name,
        'Body (HTML)': p.description || '',
        Vendor: 'Hoco',
        'Product Category': mainCat,
        Type: mainCat,
        Tags: tags,
        Published: 'TRUE',
        'Option1 Name': 'Title',
        'Option1 Value': 'Default Title',
        'Variant SKU': `HOCO-${p.id}`,
        'Variant Grams': 0,
        'Variant Inventory Tracker': 'shopify',
        'Variant Inventory Qty': 100,
        'Variant Inventory Policy': 'deny',
        'Variant Fulfillment Service': 'manual',
        'Variant Price': price,
        'Variant Compare At Price': comparePrice,
        'Variant Requires Shipping': 'TRUE',
        'Variant Taxable': 'TRUE',
        'Gift Card': 'FALSE',
        'SEO Title': p.name,
        'SEO Description': (p.description || '').replace(/<[^>]*>?/gm, '').substring(0, 300),
        'Image Src': imageSrc,
        'Image Alt Text': imageAlt,
        Status: 'active'
    };
});

const csv = parse(shopifyProducts);
fs.writeFileSync('hoco-shopify-import.csv', csv);
console.log(`✅ SUCCES! Fișier CSV generat: hoco-shopify-import.csv (${shopifyProducts.length} produse)`);
