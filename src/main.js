import './style.css';

// Mobile menu toggle
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const navLinks = document.querySelector('.nav-links');

mobileMenuBtn.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
    });
});

// Scroll animations
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('visible');
    });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
});

// ===== Gallery Carousel =====
const galleryImages = [
    '/images/gallery/Bella cafe 2.jpg',
    '/images/gallery/Bella cafe 3.jpg',
    '/images/gallery/Bella cafe 4.jpg',
    '/images/gallery/Bella cafe 5.jpg',
    '/images/gallery/Bella cafe 6.jpg',
    '/images/gallery/Bella cafe 7.jpg',
    '/images/gallery/Bella cafe 8.jpg',
    '/images/gallery/Bella cafe 9.jpg',
    '/images/gallery/Bella cafe 10.jpg',
    '/images/gallery/Bella cafe 11.jpg',
    '/images/gallery/Bella cafe 12.jpg',
    '/images/gallery/Bella cafe 13.jpg',
    '/images/gallery/Bella cafe 14.jpg',
    '/images/gallery/Bella cafe 16.jpg',
];

const ITEMS_PER_PAGE = 6;

function buildPages(images, size) {
    const pages = [];
    for (let i = 0; i < images.length; i += size) {
        pages.push(images.slice(i, i + size));
    }
    // Pad last page with wrapped images
    const last = pages[pages.length - 1];
    let i = 0;
    while (last.length < size) last.push(images[i++ % images.length]);
    return pages;
}

function buildCarousel() {
    const track = document.querySelector('.carousel-track');
    if (!track) return;

    const pages = buildPages(galleryImages, ITEMS_PER_PAGE);
    // Prepend clone of last page, append clone of first for infinite loop
    const allSlides = [pages[pages.length - 1], ...pages, pages[0]];

    allSlides.forEach(page => {
        const slide = document.createElement('div');
        slide.className = 'carousel-slide';
        page.forEach(src => {
            const img = document.createElement('img');
            img.src = src;
            img.alt = 'Bella Café';
            img.className = 'gallery-img';
            img.loading = 'lazy';
            img.addEventListener('click', () => {
                const idx = galleryImages.indexOf(src);
                openLightbox(idx >= 0 ? idx : 0);
            });
            slide.appendChild(img);
        });
        track.appendChild(slide);
    });

    let current = 1;
    let isTransitioning = false;
    let autoplayTimer;

    function goTo(index, animate = true) {
        if (animate) {
            track.style.transition = 'transform 0.5s ease-in-out';
        } else {
            track.style.transition = 'none';
        }
        track.style.transform = `translateX(-${index * 100}%)`;
        // Force reflow so no-transition applies immediately
        if (!animate) track.offsetHeight;
        current = index;
    }

    goTo(1, false);

    track.addEventListener('transitionend', (e) => {
        if (e.propertyName !== 'transform') return;
        if (current === 0) goTo(allSlides.length - 2, false);
        else if (current === allSlides.length - 1) goTo(1, false);
        isTransitioning = false;
    });

    function next() {
        if (isTransitioning) return;
        isTransitioning = true;
        goTo(current + 1);
    }

    function prev() {
        if (isTransitioning) return;
        isTransitioning = true;
        goTo(current - 1);
    }

    document.querySelector('.carousel-next').addEventListener('click', () => { next(); resetAutoplay(); });
    document.querySelector('.carousel-prev').addEventListener('click', () => { prev(); resetAutoplay(); });

    function startAutoplay() { autoplayTimer = setInterval(next, 4000); }
    function resetAutoplay() { clearInterval(autoplayTimer); startAutoplay(); }
    startAutoplay();
}

buildCarousel();

// ===== Lightbox =====
let lightboxIndex = 0;

function openLightbox(index) {
    lightboxIndex = index;
    document.querySelector('.lightbox-img').src = galleryImages[lightboxIndex];
    document.getElementById('lightbox').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    document.getElementById('lightbox').classList.remove('active');
    document.body.style.overflow = '';
}

function lightboxNext() {
    lightboxIndex = (lightboxIndex + 1) % galleryImages.length;
    document.querySelector('.lightbox-img').src = galleryImages[lightboxIndex];
}

function lightboxPrev() {
    lightboxIndex = (lightboxIndex - 1 + galleryImages.length) % galleryImages.length;
    document.querySelector('.lightbox-img').src = galleryImages[lightboxIndex];
}

document.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
document.querySelector('.lightbox-overlay').addEventListener('click', closeLightbox);
document.querySelector('.lightbox-next').addEventListener('click', lightboxNext);
document.querySelector('.lightbox-prev').addEventListener('click', lightboxPrev);

document.addEventListener('keydown', (e) => {
    if (!document.getElementById('lightbox').classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') lightboxNext();
    if (e.key === 'ArrowLeft') lightboxPrev();
});
