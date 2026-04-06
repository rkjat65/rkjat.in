// Main JavaScript for Fiscal Federalism Project
// Author: RK Jat

// Initialize AOS
AOS.init({
    duration: 800,
    easing: 'ease-in-out',
    once: true,
    offset: 100
});

// Navbar scroll effect
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Mobile menu toggle
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
});

// Smooth scroll for nav links
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        if (targetSection) {
            targetSection.scrollIntoView({ behavior: 'smooth' });
            navMenu.classList.remove('active');
            
            // Update active link
            document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        }
    });
});

// CountUp animation for stats
document.addEventListener('DOMContentLoaded', () => {
    const statValues = document.querySelectorAll('.stat-value[data-count]');

    // Check if CountUp is loaded
    if (typeof CountUp === 'undefined') {
        console.error('CountUp.js not loaded');
        // Fallback: just display the numbers
        statValues.forEach(stat => {
            const countTo = parseFloat(stat.getAttribute('data-count'));
            stat.textContent = countTo.toFixed(2);
        });
        return;
    }

    const observerOptions = {
        threshold: 0.3,
        rootMargin: '0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.dataset.animated) {
                const target = entry.target;
                const countTo = parseFloat(target.getAttribute('data-count'));

                try {
                    const countUp = new countUp.CountUp(target, countTo, {
                        duration: 2.5,
                        separator: ',',
                        decimal: '.',
                        decimalPlaces: 2,
                        useEasing: true,
                        useGrouping: true
                    });

                    if (!countUp.error) {
                        countUp.start();
                        target.dataset.animated = 'true';
                    } else {
                        console.error('CountUp error:', countUp.error);
                        target.textContent = countTo.toFixed(2);
                    }
                } catch (error) {
                    console.error('CountUp initialization error:', error);
                    target.textContent = countTo.toFixed(2);
                }

                observer.unobserve(target);
            }
        });
    }, observerOptions);

    statValues.forEach(stat => observer.observe(stat));
});

// State selector functionality
const stateSelect = document.getElementById('stateSelect');
const stateInfo = document.getElementById('stateInfo');

stateSelect.addEventListener('change', (e) => {
    const selectedState = e.target.value;
    
    if (selectedState && statesData[selectedState]) {
        const data = statesData[selectedState];
        
        document.getElementById('stateContribution').textContent = data.contribution + '%';
        document.getElementById('stateDevolution').textContent = data.devolution + '%';
        document.getElementById('stateDifference').textContent = (data.netDiff > 0 ? '+' : '') + data.netDiff.toFixed(2) + 'pp';
        
        const badge = document.getElementById('stateClassification');
        badge.textContent = data.classification;
        badge.className = 'badge ' + (data.netDiff > 0 ? 'positive' : 'negative');
        
        stateInfo.classList.remove('hidden');
    } else {
        stateInfo.classList.add('hidden');
    }
});

// Infographic tabs
const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const targetTab = btn.getAttribute('data-tab');
        
        tabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        tabContents.forEach(content => {
            content.classList.remove('active');
            if (content.id === targetTab) {
                content.classList.add('active');
            }
        });
    });
});

// Chart tabs
const chartTabBtns = document.querySelectorAll('.chart-tab-btn');
const chartPanels = document.querySelectorAll('.chart-panel');

chartTabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const targetChart = btn.getAttribute('data-chart');
        
        chartTabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        chartPanels.forEach(panel => {
            panel.classList.remove('active');
            if (panel.id === targetChart + 'Chart') {
                panel.classList.add('active');
            }
        });
    });
});

// Lightbox functionality
window.expandImage = function(imageSrc) {
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightboxImage');
    
    lightboxImage.src = imageSrc;
    lightbox.classList.add('active');
};

window.closeLightbox = function() {
    const lightbox = document.getElementById('lightbox');
    lightbox.classList.remove('active');
};

// Close lightbox on click outside
document.getElementById('lightbox').addEventListener('click', (e) => {
    if (e.target.id === 'lightbox') {
        closeLightbox();
    }
});

// Close lightbox with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeLightbox();
    }
});

// Back to top button
const backToTop = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
        backToTop.classList.add('visible');
    } else {
        backToTop.classList.remove('visible');
    }
});

backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Active section highlighting
const sections = document.querySelectorAll('.section');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (window.pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + current) {
            link.classList.add('active');
        }
    });
});
