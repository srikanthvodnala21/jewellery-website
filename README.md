# Vibas Trendy — Static Jewellery Catalogue Website

A premium, responsive jewellery catalogue website designed for GitHub Pages deployment. Customers browse jewellery and order via WhatsApp with pre-filled product messages.

## Features

- 🌐 Fully static — no backend, no database, no server required
- 📱 Responsive design — mobile-first, works on all devices
- 💬 WhatsApp integration — one-click ordering with pre-filled product details
- 🔍 Search & filter — by name, category, material, price range
- 🎨 Elegant design — luxury jewellery-inspired aesthetic
- ⚡ Fast loading — lazy images, minimal dependencies
- 📋 Easy product management — edit a single JSON file

## Live Demo

After deploying: `https://<username>.github.io/jewlery-test1/`

---

## How to Run Locally

1. Clone or download this repository
2. Open a terminal in the project folder
3. Start a local server (required for JSON fetching):

```bash
# Option 1: Python
python3 -m http.server 8000

# Option 2: Node.js (npx)
npx serve .

# Option 3: VS Code Live Server extension
```

4. Open `http://localhost:8000` in your browser

---

## How to Deploy to GitHub Pages

### Step 1: Create a GitHub Repository
1. Go to [github.com/new](https://github.com/new)
2. Name it (e.g., `jewlery-test1`)
3. Set it to **Public**
4. Click "Create repository"

### Step 2: Push the Code

```bash
cd /path/to/jewlery-test1
git init
git add .
git commit -m "Initial commit: Vibas Trendy website"
git branch -M main
git remote add origin https://github.com/<your-username>/jewlery-test1.git
git push -u origin main
```

### Step 3: Enable GitHub Pages
1. Go to your repo **Settings** → **Pages**
2. Under "Source", select **GitHub Actions**
3. The included workflow (`.github/workflows/deploy.yml`) will deploy automatically on push

### Step 4: Access Your Website
Your site will be live at:
```
https://<your-username>.github.io/jewlery-test1/
```

---

## How to Add a New Jewellery Product

1. Open `data/products.json`
2. Copy an existing product entry
3. Update the fields:

```json
{
  "id": "JWL013",
  "name": "Your Product Name",
  "category": "Necklaces",
  "price": 29999,
  "currency": "INR",
  "description": "Product description here.",
  "material": "22K Gold",
  "weight": "10g",
  "type": "Necklace",
  "sizes": [],
  "images": [
    "images/jewellery/your-image-1.jpg",
    "images/jewellery/your-image-2.jpg"
  ],
  "available": true,
  "featured": false
}
```

4. Add product images to `images/jewellery/` (or use external URLs)
5. Commit and push — the website updates automatically

### Product Fields Reference

| Field | Required | Description |
|-------|----------|-------------|
| `id` | Yes | Unique product ID (e.g., JWL013) |
| `name` | Yes | Product display name |
| `category` | Yes | Category (drives filters & category page) |
| `price` | Yes | Price in INR (number, no symbols) |
| `currency` | Yes | Always "INR" |
| `description` | Yes | Full product description |
| `material` | Yes | Material composition |
| `weight` | No | Product weight |
| `type` | No | Specific type (Ring, Choker, etc.) |
| `sizes` | No | Array of available sizes |
| `images` | Yes | Array of image URLs (at least 1) |
| `available` | Yes | `true` or `false` |
| `featured` | No | `true` to show on homepage |

---

## How to Replace Product Images

### Using Local Images
1. Add your images to the `images/jewellery/` folder
2. Update the `images` array in `products.json`:
```json
"images": [
  "images/jewellery/my-necklace-front.jpg",
  "images/jewellery/my-necklace-side.jpg"
]
```

### Using External URLs
You can also use URLs from image hosting services:
```json
"images": [
  "https://your-image-host.com/necklace.jpg"
]
```

### Image Recommendations
- Square or near-square aspect ratio (1:1)
- Minimum 600×600 pixels
- JPEG format for photos
- Keep file sizes under 500KB for fast loading

---

## How to Change the WhatsApp Number

Edit `js/whatsapp.js` — change this line at the top:

```javascript
const WHATSAPP_NUMBER = '916300879914';
```

Replace with your number in international format (country code + number, no +, no spaces).

Also update the static WhatsApp links in the HTML files (header, footer, floating button). Search for `6300879914` and replace throughout.

---

## How to Change the Brand Name / Logo

The brand name "Vibas Trendy" appears in:
- Every HTML file's header and footer (`.logo-text` + `.logo-sub`)
- `<title>` tags
- Meta descriptions
- Footer text

Search and replace "Vibas" and "TRENDY" across all `.html` files.

To use a logo image, replace the text logo markup in the header with:
```html
<a href="index.html" class="logo">
  <img src="images/logo/your-logo.png" alt="Your Brand" height="48">
</a>
```

---

## Project Structure

```
jewlery-test1/
├── index.html              # Homepage
├── products.html           # Product catalogue with filters
├── product.html            # Individual product detail
├── about.html              # About us page
├── contact.html            # Contact page
├── data/
│   └── products.json       # ← All product data lives here
├── css/
│   ├── style.css           # Main styles
│   └── responsive.css      # Mobile/tablet breakpoints
├── js/
│   ├── app.js              # Core utilities, navigation
│   ├── products.js         # Product rendering, filters, sorting
│   └── whatsapp.js         # WhatsApp message generation
├── images/
│   └── jewellery/          # Product images go here
├── robots.txt
├── sitemap.xml
├── .gitignore
├── README.md
└── .github/
    └── workflows/
        └── deploy.yml      # GitHub Pages deployment
```

---

## Technology

- HTML5, CSS3, vanilla JavaScript
- No frameworks, no build step, no dependencies
- Google Fonts (Playfair Display + Lato)
- WhatsApp Click-to-Chat API

---

## License

This project is provided for personal/commercial use. Customize freely.
