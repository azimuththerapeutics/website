/**
 * WAYPOINT COOPERATIVE - MAIN JAVASCRIPT
 * Minimal vanilla JS for navigation, scroll effects, and interactivity
 */

// ============================================================================
// NAVIGATION MENU TOGGLE
// ============================================================================

document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Toggle menu on hamburger click
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    // Close menu when a link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Set active nav link based on current page
    setActiveNavLink();
});

function setActiveNavLink() {
    const currentLocation = location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(link => {
        const href = link.getAttribute('href').split('/').pop() || 'index.html';
        if (href === currentLocation) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// ============================================================================
// NAVBAR SCROLL EFFECT
// ============================================================================

window.addEventListener('scroll', function() {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// ============================================================================
// SCROLL ANIMATIONS
// ============================================================================

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe all cards and sections for fade-in animation
document.addEventListener('DOMContentLoaded', function() {
    const elementsToObserve = document.querySelectorAll(
        '.approach-card, .service-card, .value-card, .provider-card, ' +
        '.program-item, .testimonial-card, .card, .faq-item'
    );

    elementsToObserve.forEach(element => {
        observer.observe(element);
    });
});

// ============================================================================
// CONTACT FORM HANDLING
// ============================================================================

document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Basic validation
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const message = document.getElementById('message').value.trim();
            const consent = document.getElementById('consent').checked;

            if (!name || !email || !message || !consent) {
                alert('Please fill in all required fields.');
                return;
            }

            // Email validation
            if (!isValidEmail(email)) {
                alert('Please enter a valid email address.');
                return;
            }

            // Here you would typically send the form data to a server
            // For now, we'll just show a success message
            handleFormSubmission(contactForm, {
                name: name,
                email: email,
                phone: document.getElementById('phone').value,
                interest: document.getElementById('interest').value,
                provider: document.getElementById('provider').value,
                modality: document.getElementById('modality').value,
                message: message,
                insurance: document.getElementById('insurance').checked
            });
        });
    }
});

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function handleFormSubmission(form, data) {
    // Display success message
    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;

    submitButton.textContent = 'Message Sent!';
    submitButton.disabled = true;
    submitButton.style.opacity = '0.7';

    // You can integrate with a service like Formspree, Cloudflare Workers, etc.
    // For now, we'll just log the data and reset after a delay
    console.log('Form submitted with data:', data);

    setTimeout(() => {
        form.reset();
        submitButton.textContent = originalText;
        submitButton.disabled = false;
        submitButton.style.opacity = '1';
    }, 2000);
}

// ============================================================================
// SMOOTH SCROLL FOR ANCHOR LINKS
// ============================================================================

document.addEventListener('click', function(e) {
    const target = e.target.closest('a[href^="#"]');
    if (target) {
        const anchorId = target.getAttribute('href').substring(1);
        const anchorElement = document.getElementById(anchorId);

        if (anchorElement) {
            e.preventDefault();
            const offsetTop = anchorElement.offsetTop - 80; // Offset for fixed navbar

            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    }
});

// ============================================================================
// KEYBOARD NAVIGATION
// ============================================================================

document.addEventListener('keydown', function(e) {
    // Close mobile menu on Escape key
    if (e.key === 'Escape') {
        const hamburger = document.getElementById('hamburger');
        const navMenu = document.getElementById('navMenu');

        if (hamburger && navMenu) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
    }
});

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Debounce function for scroll events
 */
function debounce(func, delay) {
    let timeoutId;
    return function(...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func(...args), delay);
    };
}

/**
 * Check if element is in viewport
 */
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// ============================================================================
// PERFORMANCE & LOGGING
// ============================================================================

// Log page performance metrics
window.addEventListener('load', function() {
    if (window.performance && window.performance.timing) {
        const perfData = window.performance.timing;
        const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
        console.log('Page Load Time: ' + pageLoadTime + 'ms');
    }
});

// ============================================================================
// ACCESSIBILITY ENHANCEMENTS
// ============================================================================

// Ensure all interactive elements are keyboard accessible
document.addEventListener('DOMContentLoaded', function() {
    const buttons = document.querySelectorAll('button, a[role="button"]');
    buttons.forEach(button => {
        if (!button.hasAttribute('aria-label') && !button.textContent.trim()) {
            console.warn('Button missing aria-label:', button);
        }
    });
});

// ============================================================================
// THEME & SYSTEM PREFERENCES
// ============================================================================

// Check for system dark mode preference (future expansion)
if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    // Could implement dark mode here
    console.log('System prefers dark mode');
}

// ============================================================================
// READY STATE
// ============================================================================

console.log('Waypoint Cooperative website ready');
