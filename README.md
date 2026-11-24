# PoshanPantries Ecommerce Website

PoshanPantries is a mobile-first static ecommerce website for seeds, Indian spices, dehydrated food powders and multigrain flours.

The website is built with plain HTML, CSS and JavaScript. It does not require npm, a build process or a database.

## Main features

- Responsive mobile-first design
- Product search and category filters
- Dynamic product-detail pages
- Shopping cart saved in the browser with `localStorage`
- Quantity updates, item removal and total calculation
- WhatsApp order checkout
- UPI payment and QR-code placeholders
- Product, shipping, returns, privacy, terms and FAQ pages
- Search-engine and social-sharing metadata

## Project structure

```text
RR_Ecommerce/
├── index.html
├── shop.html
├── product.html
├── cart.html
├── about.html
├── contact.html
├── css/style.css
├── js/main.js
├── js/products.js
└── images/
```

## Preview locally

Open `index.html` directly in a web browser. No installation or build command is required.

For a local web server, you can also run one of these commands if the tool is already installed:

```bash
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.

## Edit products

All product information is stored in `js/products.js`. Edit that file to change names, descriptions, prices, pack sizes and images.

## Important setup before launch

Open `js/main.js` and update `STORE_SETTINGS` with the real:

- WhatsApp number
- UPI ID
- Business email
- Business phone number

Also replace `images/qr-placeholder.svg` with the real UPI QR code and review all legal-policy templates before accepting public orders.

## Deployment

Because this is a static website, it can be hosted on GitHub Pages or another static hosting provider without a build command.

