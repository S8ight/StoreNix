const express = require('express');
const fetch = require('node-fetch');
const shopifyConfig = require('../api-config.json');
const cors = require('cors');
const app = express();
app.use(cors());

app.get('/products', async (req, res) => {
    try {
        const products = await getProducts();
        const parsed = await parseProducts(products);
        console.log(parsed);
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch products' });
    }
});

async function getProducts() {

    const endpoint = 'https://'+shopifyConfig.shopName+'.myshopify.com/admin/api/2023-04/products.json';
    const headers = {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': shopifyConfig.token,
    };

    try {
        const response = await fetch(endpoint, {
            method: 'GET',
            headers: headers,
        });

        if (response.ok) {
            const data = await response.json();
            return data.products;
        } else {
            console.log('Request Error Shopify API:', response.status);
        }
    } catch (error) {
        console.log('Error:', error);
    }
}

async function parseProducts(products) {
    let parsedProducts = [];

    for (const product of products) {
        let parsedProduct = {
            id: product.id,
            title: product.title,
            options: product.options.map(option => ({
                product_id: option.product_id,
                id: option.id,
                name: option.name,
                position: option.position,
                values: option.values,
            })),
            images: product.images.map(image => ({
                src: image.src,
            })),
        };

        parsedProducts.push(parsedProduct);
    }

    return parsedProducts;
}

app.listen(3000);