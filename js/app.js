/**
 * Vibas Trendy - Core App Module
 * Handles navigation, mobile menu, and shared utilities
 */

// Mobile menu toggle
document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.getElementById('hamburger');
    const mainNav = document.getElementById('mainNav');

    if (hamburger && mainNav) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            mainNav.classList.toggle('active');
        });

        // Close menu on link click
        mainNav.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                mainNav.classList.remove('active');
            });
        });
    }

    // Filter sidebar toggle (products page)
    const filterToggle = document.getElementById('filterToggle');
    const filtersSidebar = document.getElementById('filtersSidebar');

    if (filterToggle && filtersSidebar) {
        // Create overlay
        const overlay = document.createElement('div');
        overlay.classList.add('filter-overlay');
        document.body.appendChild(overlay);

        filterToggle.addEventListener('click', () => {
            filtersSidebar.classList.toggle('active');
            overlay.classList.toggle('active');
        });

        overlay.addEventListener('click', () => {
            filtersSidebar.classList.remove('active');
            overlay.classList.remove('active');
        });
    }
});

/**
 * Format price in Indian Rupee format
 * @param {number} price - Price in INR
 * @returns {string} Formatted price string
 */
function formatPrice(price) {
    return '₹' + price.toLocaleString('en-IN');
}

/**
 * Get the base path for the site (handles GitHub Pages sub-path)
 * @returns {string} Base path
 */
function getBasePath() {
    const path = window.location.pathname;
    // If hosted under a GitHub Pages repo sub-path, extract it
    const parts = path.split('/');
    // Check if we are in a sub-path (e.g., /repo-name/index.html)
    if (parts.length > 2 && parts[1] !== '') {
        // Check if the second part is a page file
        const lastPart = parts[parts.length - 1];
        if (lastPart.endsWith('.html') || lastPart === '') {
            // Return everything except the last part
            const baseParts = parts.slice(0, -1);
            return baseParts.join('/') + '/';
        }
    }
    return './';
}

/**
 * Load products from the JSON file
 * @returns {Promise<Array>} Array of product objects
 */
async function loadProducts() {
    try {
        const response = await fetch('data/products.json');
        if (!response.ok) throw new Error('Failed to load products');
        return await response.json();
    } catch (error) {
        console.error('Error loading products:', error);
        return [];
    }
}

/**
 * Get URL query parameters
 * @returns {URLSearchParams}
 */
function getQueryParams() {
    return new URLSearchParams(window.location.search);
}
