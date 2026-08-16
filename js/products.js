/**
 * Vibas Trendy - Products Module
 * Handles product rendering, filtering, sorting, and detail views
 */

// Category icons map
const categoryIcons = {
    'Rings': '💍',
    'Necklaces': '📿',
    'Earrings': '✨',
    'Bracelets': '⭕',
    'Bangles': '🔵',
    'Chains': '🔗',
    'Pendants': '💎',
    'Bridal Jewellery': '👑',
    'Gold Jewellery': '🥇',
    'Silver Jewellery': '🥈'
};

/**
 * Create a product card HTML element
 * @param {Object} product - Product object
 * @returns {HTMLElement}
 */
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';

    const badge = product.available
        ? (product.featured ? '<span class="product-card-badge">Featured</span>' : '')
        : '<span class="product-card-badge out-of-stock">Sold Out</span>';

    card.innerHTML = `
        <div class="product-card-image">
            ${badge}
            <img src="${product.images[0]}" alt="${product.name}" loading="lazy">
        </div>
        <div class="product-card-body">
            <div class="product-card-category">${product.category}</div>
            <h3 class="product-card-name">${product.name}</h3>
            <div class="product-card-price">${formatPrice(product.price)}</div>
            <p class="product-card-desc">${product.description}</p>
            <div class="product-card-actions">
                <a href="product.html?id=${product.id}" class="btn btn-outline btn-small">View Details</a>
            </div>
        </div>
    `;

    // Add WhatsApp button
    const actionsDiv = card.querySelector('.product-card-actions');
    const waBtn = createWhatsAppButton(product, 'small');
    actionsDiv.appendChild(waBtn);

    return card;
}

/**
 * Render featured products on homepage
 * @param {Array} products
 */
function renderFeaturedProducts(products) {
    const container = document.getElementById('featuredProducts');
    if (!container) return;

    const featured = products.filter(p => p.featured && p.available).slice(0, 6);
    container.innerHTML = '';
    featured.forEach(product => {
        container.appendChild(createProductCard(product));
    });
}

/**
 * Render categories on homepage (dynamically from product data)
 * @param {Array} products
 */
function renderCategories(products) {
    const container = document.getElementById('categoriesGrid');
    if (!container) return;

    const categories = {};
    products.forEach(p => {
        if (!categories[p.category]) {
            categories[p.category] = 0;
        }
        categories[p.category]++;
    });

    container.innerHTML = '';
    Object.entries(categories).forEach(([name, count]) => {
        const icon = categoryIcons[name] || '💎';
        const card = document.createElement('a');
        card.href = `products.html?category=${encodeURIComponent(name)}`;
        card.className = 'category-card';
        card.innerHTML = `
            <div class="category-card-icon">${icon}</div>
            <div class="category-card-name">${name}</div>
            <div class="category-card-count">${count} ${count === 1 ? 'piece' : 'pieces'}</div>
        `;
        container.appendChild(card);
    });
}

/**
 * Initialize the products listing page
 * @param {Array} products
 */
function initProductsPage(products) {
    const grid = document.getElementById('productsGrid');
    const countEl = document.getElementById('productsCount');
    const noResults = document.getElementById('noResults');
    const searchInput = document.getElementById('searchInput');
    const sortSelect = document.getElementById('sortSelect');
    const clearBtn = document.getElementById('clearFilters');
    const categoryFilters = document.getElementById('categoryFilters');
    const materialFilters = document.getElementById('materialFilters');

    if (!grid) return;

    // Build dynamic filter options
    const categories = [...new Set(products.map(p => p.category))];
    const materials = [...new Set(products.map(p => p.material))];

    categories.forEach(cat => {
        const label = document.createElement('label');
        label.className = 'filter-checkbox';
        label.innerHTML = `<input type="checkbox" name="category" value="${cat}"> ${cat}`;
        categoryFilters.appendChild(label);
    });

    materials.forEach(mat => {
        const label = document.createElement('label');
        label.className = 'filter-checkbox';
        label.innerHTML = `<input type="checkbox" name="material" value="${mat}"> ${mat}`;
        materialFilters.appendChild(label);
    });

    // Check URL params for pre-selected category
    const params = getQueryParams();
    const preCategory = params.get('category');
    if (preCategory) {
        const checkbox = categoryFilters.querySelector(`input[value="${preCategory}"]`);
        if (checkbox) checkbox.checked = true;
    }

    // Filter & render
    function applyFilters() {
        let filtered = [...products];

        // Search
        const searchTerm = searchInput.value.toLowerCase().trim();
        if (searchTerm) {
            filtered = filtered.filter(p =>
                p.name.toLowerCase().includes(searchTerm) ||
                p.id.toLowerCase().includes(searchTerm) ||
                p.category.toLowerCase().includes(searchTerm) ||
                p.material.toLowerCase().includes(searchTerm) ||
                p.description.toLowerCase().includes(searchTerm)
            );
        }

        // Category filter
        const selectedCategories = [...categoryFilters.querySelectorAll('input:checked')].map(i => i.value);
        if (selectedCategories.length > 0) {
            filtered = filtered.filter(p => selectedCategories.includes(p.category));
        }

        // Material filter
        const selectedMaterials = [...materialFilters.querySelectorAll('input:checked')].map(i => i.value);
        if (selectedMaterials.length > 0) {
            filtered = filtered.filter(p => selectedMaterials.includes(p.material));
        }

        // Price filter
        const selectedPrices = [...document.querySelectorAll('input[name="price"]:checked')].map(i => i.value);
        if (selectedPrices.length > 0) {
            filtered = filtered.filter(p => {
                return selectedPrices.some(range => {
                    const [min, max] = range.split('-').map(Number);
                    return p.price >= min && p.price <= max;
                });
            });
        }

        // Availability filter
        const selectedAvail = [...document.querySelectorAll('input[name="availability"]:checked')].map(i => i.value);
        if (selectedAvail.length > 0 && selectedAvail.length < 2) {
            const showAvailable = selectedAvail.includes('true');
            filtered = filtered.filter(p => p.available === showAvailable);
        }

        // Sort
        const sortValue = sortSelect.value;
        switch (sortValue) {
            case 'price-low':
                filtered.sort((a, b) => a.price - b.price);
                break;
            case 'price-high':
                filtered.sort((a, b) => b.price - a.price);
                break;
            case 'name-az':
                filtered.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'newest':
                filtered.reverse();
                break;
            case 'featured':
            default:
                filtered.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
                break;
        }

        // Render
        grid.innerHTML = '';
        filtered.forEach(product => {
            grid.appendChild(createProductCard(product));
        });

        countEl.textContent = `${filtered.length} ${filtered.length === 1 ? 'product' : 'products'} found`;
        noResults.style.display = filtered.length === 0 ? 'block' : 'none';
    }

    // Event listeners
    searchInput.addEventListener('input', applyFilters);
    sortSelect.addEventListener('change', applyFilters);

    document.querySelectorAll('.filter-options input[type="checkbox"]').forEach(cb => {
        cb.addEventListener('change', applyFilters);
    });

    clearBtn.addEventListener('click', () => {
        searchInput.value = '';
        document.querySelectorAll('.filter-options input[type="checkbox"]').forEach(cb => {
            cb.checked = cb.name === 'availability' && cb.value === 'true';
        });
        applyFilters();
    });

    // Initial render
    applyFilters();
}

/**
 * Render product detail page
 * @param {Array} products
 */
function renderProductDetail(products) {
    const container = document.getElementById('productDetail');
    const breadcrumb = document.getElementById('breadcrumbProduct');
    if (!container) return;

    const params = getQueryParams();
    const productId = params.get('id');

    if (!productId) {
        container.innerHTML = '<p>Product not found. <a href="products.html">Browse our collection</a>.</p>';
        return;
    }

    const product = products.find(p => p.id === productId);

    if (!product) {
        container.innerHTML = '<p>Product not found. <a href="products.html">Browse our collection</a>.</p>';
        return;
    }

    // Update page title and breadcrumb
    document.title = `${product.name} | Vibas Trendy`;
    if (breadcrumb) breadcrumb.textContent = product.name;

    // Update meta
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.content = `${product.name} - ${product.description} Price: ${formatPrice(product.price)}`;

    // Build gallery
    const galleryThumbs = product.images.map((img, idx) => `
        <div class="product-gallery-thumb ${idx === 0 ? 'active' : ''}" data-index="${idx}">
            <img src="${img}" alt="${product.name} - Image ${idx + 1}">
        </div>
    `).join('');

    // Build sizes
    const sizesHtml = product.sizes && product.sizes.length > 0 ? `
        <div class="product-sizes">
            <h4>Available Sizes</h4>
            <div class="size-options">
                ${product.sizes.map(s => `<span class="size-option">${s}</span>`).join('')}
            </div>
        </div>
    ` : '';

    // Build availability
    const availHtml = product.available
        ? '<span class="product-availability in-stock">● In Stock</span>'
        : '<span class="product-availability out-of-stock">● Currently Unavailable</span>';

    container.innerHTML = `
        <div class="product-gallery">
            <div class="product-gallery-main">
                <img src="${product.images[0]}" alt="${product.name}" id="mainImage">
            </div>
            <div class="product-gallery-thumbs">
                ${galleryThumbs}
            </div>
        </div>
        <div class="product-info">
            <div class="product-info-category">${product.category}</div>
            <h1>${product.name}</h1>
            <div class="product-info-price">${formatPrice(product.price)}</div>
            ${availHtml}
            <p class="product-info-desc">${product.description}</p>
            <div class="product-meta">
                <div class="product-meta-row">
                    <span class="product-meta-label">Product ID</span>
                    <span class="product-meta-value">${product.id}</span>
                </div>
                <div class="product-meta-row">
                    <span class="product-meta-label">Material</span>
                    <span class="product-meta-value">${product.material}</span>
                </div>
                ${product.weight ? `
                <div class="product-meta-row">
                    <span class="product-meta-label">Weight</span>
                    <span class="product-meta-value">${product.weight}</span>
                </div>` : ''}
                <div class="product-meta-row">
                    <span class="product-meta-label">Type</span>
                    <span class="product-meta-value">${product.type || product.category}</span>
                </div>
            </div>
            ${sizesHtml}
            <div class="product-actions" id="productActions">
                <a href="products.html" class="btn btn-outline">← Back to Collection</a>
            </div>
        </div>
    `;

    // Add WhatsApp button
    const actionsEl = document.getElementById('productActions');
    const waBtn = createWhatsAppButton(product, 'large');
    waBtn.className = 'btn btn-whatsapp';
    actionsEl.prepend(waBtn);

    // Image gallery switching
    const thumbs = container.querySelectorAll('.product-gallery-thumb');
    const mainImage = document.getElementById('mainImage');

    thumbs.forEach(thumb => {
        thumb.addEventListener('click', () => {
            const idx = parseInt(thumb.dataset.index);
            mainImage.src = product.images[idx];
            mainImage.alt = `${product.name} - Image ${idx + 1}`;
            thumbs.forEach(t => t.classList.remove('active'));
            thumb.classList.add('active');
        });
    });
}
