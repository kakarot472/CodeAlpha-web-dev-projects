// Sample gallery data with different categories
const galleryData = [
    {
        id: 1,
        src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop',
        title: 'Mountain Peak',
        description: 'Majestic mountain landscape at sunset',
        category: 'nature'
    },
    {
        id: 2,
        src: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=400&h=400&fit=crop',
        title: 'Ocean Waves',
        description: 'Serene coastal waters with golden hour lighting',
        category: 'nature'
    },
    {
        id: 3,
        src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop',
        title: 'Forest Path',
        description: 'Winding path through lush green forest',
        category: 'nature'
    },
    {
        id: 4,
        src: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=400&h=400&fit=crop',
        title: 'City Skyline',
        description: 'Modern cityscape at night with illuminated buildings',
        category: 'city'
    },
    {
        id: 5,
        src: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=400&h=400&fit=crop',
        title: 'Urban Street',
        description: 'Busy city street with vibrant colors and architecture',
        category: 'city'
    },
    {
        id: 6,
        src: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=400&fit=crop',
        title: 'City Lights',
        description: 'Neon signs and city lights at dusk',
        category: 'city'
    },
    {
        id: 7,
        src: 'https://images.unsplash.com/photo-1520763185298-1b434c919eba?w=400&h=400&fit=crop',
        title: 'Wild Tiger',
        description: 'Powerful tiger in its natural habitat',
        category: 'animals'
    },
    {
        id: 8,
        src: 'https://images.unsplash.com/photo-1474511320723-9a56873867b5?w=400&h=400&fit=crop',
        title: 'Bird in Flight',
        description: 'Eagle soaring through clear blue sky',
        category: 'animals'
    },
    {
        id: 9,
        src: 'https://images.unsplash.com/photo-1516348651964-5ea266ecb327?w=400&h=400&fit=crop',
        title: 'Butterfly Garden',
        description: 'Colorful butterfly on vibrant flowers',
        category: 'animals'
    },
    {
        id: 10,
        src: 'https://images.unsplash.com/photo-1552820728-8ac41f1ce891?w=400&h=400&fit=crop',
        title: 'Abstract Art',
        description: 'Colorful abstract digital art composition',
        category: 'abstract'
    },
    {
        id: 11,
        src: 'https://images.unsplash.com/photo-1578321271841-96cd93d5e2f1?w=400&h=400&fit=crop',
        title: 'Geometric Design',
        description: 'Modern geometric patterns and shapes',
        category: 'abstract'
    },
    {
        id: 12,
        src: 'https://images.unsplash.com/photo-1575540335968-4664ae6ac4a3?w=400&h=400&fit=crop',
        title: 'Paint Splash',
        description: 'Vibrant paint splatter abstract design',
        category: 'abstract'
    }
];

// DOM Elements
const galleryGrid = document.getElementById('galleryGrid');
const lightbox = document.getElementById('lightbox');
const lightboxImage = document.querySelector('.lightbox-image');
const lightboxTitle = document.querySelector('.lightbox-title');
const lightboxDescription = document.querySelector('.lightbox-description');
const imageCounter = document.getElementById('imageCounter');
const filterBtns = document.querySelectorAll('.filter-btn');

// State
let currentFilter = 'all';
let currentImageIndex = 0;
let filteredImages = [...galleryData];

/**
 * Initialize the gallery
 */
function init() {
    renderGallery(galleryData);
    setupEventListeners();
}

/**
 * Render gallery items
 * @param {Array} images - Images to render
 */
function renderGallery(images) {
    galleryGrid.innerHTML = '';
    filteredImages = images;

    images.forEach((image, index) => {
        const galleryItem = createGalleryItem(image, index);
        galleryGrid.appendChild(galleryItem);
    });
}

/**
 * Create a gallery item element
 * @param {Object} image - Image data
 * @param {Number} index - Image index
 * @returns {HTMLElement} Gallery item element
 */
function createGalleryItem(image, index) {
    const item = document.createElement('div');
    item.className = 'gallery-item';
    item.innerHTML = `
        <img src="${image.src}" alt="${image.title}" loading="lazy">
        <div class="gallery-overlay">
            <h3>${image.title}</h3>
            <p>${image.description}</p>
            <span class="gallery-tag">${capitalize(image.category)}</span>
        </div>
    `;

    item.addEventListener('click', () => openLightbox(index));
    item.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') openLightbox(index);
    });

    return item;
}

/**
 * Setup event listeners
 */
function setupEventListeners() {
    // Filter buttons
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => handleFilter(btn));
    });

    // Lightbox controls
    document.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
    document.querySelector('.lightbox-prev').addEventListener('click', previousImage);
    document.querySelector('.lightbox-next').addEventListener('click', nextImage);

    // Keyboard navigation
    document.addEventListener('keydown', handleKeyboard);

    // Close lightbox on outside click
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });
}

/**
 * Handle filter button clicks
 * @param {HTMLElement} btn - Clicked button
 */
function handleFilter(btn) {
    // Remove active class from all buttons
    filterBtns.forEach(b => b.classList.remove('active'));
    // Add active class to clicked button
    btn.classList.add('active');

    currentFilter = btn.dataset.filter;
    const filtered = filterImages(currentFilter);
    renderGallery(filtered);
    closeLightbox();
}

/**
 * Filter images by category
 * @param {String} filter - Filter category
 * @returns {Array} Filtered images
 */
function filterImages(filter) {
    if (filter === 'all') return galleryData;
    return galleryData.filter(img => img.category === filter);
}

/**
 * Open lightbox with image
 * @param {Number} index - Image index
 */
function openLightbox(index) {
    currentImageIndex = index;
    displayImage();
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
}

/**
 * Close lightbox
 */
function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = 'auto';
}

/**
 * Display current image in lightbox
 */
function displayImage() {
    const image = filteredImages[currentImageIndex];
    lightboxImage.src = image.src;
    lightboxImage.alt = image.title;
    lightboxTitle.textContent = image.title;
    lightboxDescription.textContent = image.description;
    updateCounter();
}

/**
 * Show next image
 */
function nextImage() {
    currentImageIndex = (currentImageIndex + 1) % filteredImages.length;
    displayImage();
}

/**
 * Show previous image
 */
function previousImage() {
    currentImageIndex = (currentImageIndex - 1 + filteredImages.length) % filteredImages.length;
    displayImage();
}

/**
 * Update image counter
 */
function updateCounter() {
    imageCounter.textContent = `${currentImageIndex + 1} / ${filteredImages.length}`;
}

/**
 * Handle keyboard navigation
 * @param {KeyboardEvent} e - Keyboard event
 */
function handleKeyboard(e) {
    if (!lightbox.classList.contains('active')) return;

    switch (e.key) {
        case 'ArrowRight':
            nextImage();
            e.preventDefault();
            break;
        case 'ArrowLeft':
            previousImage();
            e.preventDefault();
            break;
        case 'Escape':
            closeLightbox();
            e.preventDefault();
            break;
    }
}

/**
 * Capitalize first letter
 * @param {String} str - String to capitalize
 * @returns {String} Capitalized string
 */
function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Add smooth scroll behavior
 */
function smoothScroll() {
    document.documentElement.scrollBehavior = 'smooth';
}

// Initialize gallery when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    init();
    smoothScroll();
});

// Optional: Prefetch images for better performance
function prefetchImages(images) {
    images.forEach(image => {
        const img = new Image();
        img.src = image.src;
    });
}

prefetchImages(galleryData);
