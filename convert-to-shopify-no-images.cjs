const fs = require('fs');
const { parse } = require('json2csv');

console.log('Încărcare date...');
const products = JSON.parse(fs.readFileSync('public/data/products.json', 'utf8'));
const categories = JSON.parse(fs.readFileSync('public/data/categories.json', 'utf8'));

const catMap = {};
categories.forEach(c => catMap[c.id] = c.name);

console.log(`Procesare ${products.length} produse pentru Shopify (Fără Imagini)...`);

const shopifyProducts = products.map(p => {
    let mainCat = (p.categories && p.categories.length > 0) ? catMap[p.categories[0].id] : 'General';
    let tags = p.categories ? p.categories.map(c => c.name).join(', ') : '';
    
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
        Status: 'active'
        // Am eliminat coloanele Image Src și Image Alt Text pentru a evita eroarea
    };
});

const csv = parse(shopifyProducts);
fs.writeFileSync('hoco-shopify-import-no-images.csv', csv);
console.log(`✅ SUCCES! Fișier CSV generat: hoco-shopify-import-no-images.csv (${shopifyProducts.length} produse)`);
