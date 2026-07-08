const fs = require('fs');
const path = require('path');
const axios = require('axios');

const API_BASE = 'https://hocotech.com/wp-json/wc/store';
const DATA_DIR = path.join(__dirname, 'public/data');
const IMAGES_DIR = path.join(__dirname, 'public/images/products');

// Creează directoarele dacă nu există
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
if (!fs.existsSync(IMAGES_DIR)) fs.mkdirSync(IMAGES_DIR, { recursive: true });

async function fetchAll(endpoint) {
    let page = 1;
    let allData = [];
    let hasMore = true;

    while (hasMore) {
        console.log(`Fetching ${endpoint} page ${page}...`);
        const response = await axios.get(`${API_BASE}${endpoint}`, {
            params: { per_page: 100, page }
        });
        
        allData = allData.concat(response.data);
        const totalPages = parseInt(response.headers['x-wp-totalpages'] || 1);
        hasMore = page < totalPages;
        page++;
    }
    return allData;
}

async function downloadImage(url, filename) {
    if (!url) return null;
    const filePath = path.join(IMAGES_DIR, filename);
    
    if (fs.existsSync(filePath)) return `/images/products/${filename}`;

    try {
        const response = await axios({ url, method: 'GET', responseType: 'stream' });
        return new Promise((resolve, reject) => {
            const writer = fs.createWriteStream(filePath);
            response.data.pipe(writer);
            writer.on('finish', () => resolve(`/images/products/${filename}`));
            writer.on('error', reject);
        });
    } catch (error) {
        console.error(`Failed to download ${url}:`, error.message);
        return null;
    }
}

async function main() {
    console.log('Fetching categories...');
    const categories = await fetchAll('/products/categories');
    fs.writeFileSync(path.join(DATA_DIR, 'categories.json'), JSON.stringify(categories, null, 2));
    console.log(`Saved ${categories.length} categories.`);

    console.log('Fetching products...');
    const products = await fetchAll('/products');
    console.log(`Fetched ${products.length} products.`);

    console.log('Downloading images and processing data...');
    const processedProducts = [];
    
    for (let i = 0; i < products.length; i++) {
        const p = products[i];
        const localImages = [];
        
        for (let j = 0; j < (p.images || []).length; j++) {
            const img = p.images[j];
            const ext = path.extname(new URL(img.src).pathname) || '.jpg';
            const filename = `${p.id}-${j}${ext}`;
            const localUrl = await downloadImage(img.src, filename);
            if (localUrl) localImages.push(localUrl);
        }

        processedProducts.push({
            id: p.id,
            name: p.name,
            slug: p.slug,
            price: p.prices?.price,
            currency: p.prices?.currency_code,
            on_sale: p.on_sale,
            regular_price: p.prices?.regular_price,
            sale_price: p.prices?.sale_price,
            images: localImages,
            categories: p.categories,
            description: p.description || p.short_description,
            link: p.permalink
        });

        if (i % 50 === 0) console.log(`Processed ${i}/${products.length} products...`);
    }

    fs.writeFileSync(path.join(DATA_DIR, 'products.json'), JSON.stringify(processedProducts, null, 2));
    console.log('Done! Data saved to public/data/');
}

main().catch(console.error);
