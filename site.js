/**
 * Azimuth Therapeutics - Shared JavaScript
 * site.js
 *
 * Core functionality for all pages:
 * - Password gate (dev access)
 * - Mobile menu toggle
 * - Scroll effects (navbar, buttons)
 * - Fade-in animations (Intersection Observer)
 * - FAQ toggle
 * - Smooth scroll for anchor links
 * - Form submission handler
 */

// ===== PASSWORD GATE =====
// Protects the entire site with a dev password
// Password: '1234'
// Stored in sessionStorage with key 'az_auth'
(function() {
    const PASS = '1234';
    const AUTH_KEY = 'az_auth';

    // If already authenticated in this session, skip the gate
    if (sessionStorage.getItem(AUTH_KEY) === PASS) {
        return;
    }

    // Hide content until auth check is complete
    document.documentElement.style.visibility = 'hidden';

    window.addEventListener('DOMContentLoaded', function() {
        document.body.style.visibility = 'hidden';

        // Create password gate overlay
        const overlay = document.createElement('div');
        overlay.id = 'az-gate';
        overlay.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:#1B3A5C;z-index:99999;display:flex;align-items:center;justify-content:center;flex-direction:column;visibility:visible';

        overlay.innerHTML = '<div style="text-align:center;color:#FAF9F7;font-family:Lato,sans-serif">'
            + '<p style="font-family:Cinzel,serif;font-size:1.8rem;color:#C9A96E;letter-spacing:4px;margin-bottom:2rem">AZIMUTH</p>'
            + '<p style="margin-bottom:1.5rem;font-size:0.95rem;opacity:0.7">This site is under development</p>'
            + '<input id="az-pw" type="password" placeholder="Enter access code" style="padding:0.8rem 1.5rem;font-size:1rem;border:1px solid #C9A96E;background:rgba(255,255,255,0.05);color:#FAF9F7;border-radius:4px;text-align:center;width:min(260px, 80vw);font-family:Lato,sans-serif" autocomplete="off">'
            + '<br><button id="az-btn" style="margin-top:1rem;padding:0.7rem 2rem;background:transparent;border:1px solid #C9A96E;color:#C9A96E;font-size:0.85rem;letter-spacing:2px;text-transform:uppercase;cursor:pointer;font-family:Lato,sans-serif;border-radius:4px;transition:all 0.3s">Enter</button>'
            + '<p id="az-err" style="margin-top:1rem;color:#e74c3c;font-size:0.85rem;opacity:0"></p>'
            + '</div>';

        document.body.prepend(overlay);
        document.documentElement.style.visibility = 'visible';

        const input = document.getElementById('az-pw');
        const btn = document.getElementById('az-btn');
        const err = document.getElementById('az-err');

        function tryAuth() {
            if (input.value === PASS) {
                sessionStorage.setItem(AUTH_KEY, PASS);
                overlay.remove();
                document.body.style.visibility = 'visible';
            } else {
                err.textContent = 'Incorrect code';
                err.style.opacity = '1';
                input.value = '';
                input.focus();
            }
        }

        btn.addEventListener('click', tryAuth);
        input.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') tryAuth();
        });
        input.focus();
    });
})();


// ===== MOBILE MENU TOGGLE =====
// Toggles mobile nav menu with hamburger icon and overlay
// Handles aria-expanded for accessibility
// Closes menu when nav links are clicked
function toggleMenu() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    const navOverlay = document.getElementById('navOverlay');

    if (!hamburger || !navMenu) return;

    hamburger.classList.toggle('active');
    navMenu.classList.toggle('open');

    if (navOverlay) {
        navOverlay.classList.toggle('active');
    }

    const isOpen = navMenu.classList.contains('open');
    document.body.style.overflow = isOpen ? 'hidden' : '';
    hamburger.setAttribute('aria-expanded', isOpen);
}

// Close menu when overlay is clicked
document.addEventListener('DOMContentLoaded', function() {
    const navOverlay = document.getElementById('navOverlay');
    if (navOverlay) {
        navOverlay.addEventListener('click', toggleMenu);
    }

    // Close menu when nav links are clicked
    document.querySelectorAll('#navMenu a').forEach(link => {
        link.addEventListener('click', function() {
            const navMenu = document.getElementById('navMenu');
            if (navMenu && navMenu.classList.contains('open')) {
                toggleMenu();
            }
        });
    });
});


// ===== SCROLL EFFECTS =====
// Adds 'scrolled' class to navbar when user scrolls past 50px
// Shows/hides scroll-to-top and book-float buttons at 600px
window.addEventListener('scroll', function() {
    // Navbar scroll effect
    const navbar = document.getElementById('navbar');
    if (navbar) {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }

    // Show/hide floating buttons
    const scrollTopBtn = document.getElementById('scrollTop');
    const bookFloat = document.getElementById('bookFloat');

    if (window.scrollY > 600) {
        if (scrollTopBtn) scrollTopBtn.classList.add('visible');
        if (bookFloat) bookFloat.classList.add('visible');
    } else {
        if (scrollTopBtn) scrollTopBtn.classList.remove('visible');
        if (bookFloat) bookFloat.classList.remove('visible');
    }
});


// ===== INTERSECTION OBSERVER FOR FADE-IN ANIMATIONS =====
// Observes all .fade-in elements and adds 'visible' class when they enter viewport
// Uses a threshold of 0.1 and a rootMargin for early triggering
document.addEventListener('DOMContentLoaded', function() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-in').forEach(function(element) {
        observer.observe(element);
    });
});


// ===== FAQ TOGGLE =====
// Toggles the visibility of FAQ answers and the state of toggle icons
// Used on index.html, but defined globally for safety
function toggleFAQ(element) {
    const answer = element.nextElementSibling;
    const toggle = element.querySelector('.faq-toggle');

    if (answer) {
        answer.classList.toggle('show');
    }
    if (toggle) {
        toggle.classList.toggle('open');
    }
}


// ===== SMOOTH SCROLL FOR ANCHOR LINKS =====
// Handles smooth scrolling for navigation links starting with '#'
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('nav a').forEach(function(anchor) {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href && href.startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
});


// ===== FORM SUBMISSION HANDLER =====
// POSTs form data to Formspree
// Shows loading state and handles success/error responses
const FORMSPREE_ID = 'xojkeqdr';

function handleSubmit(event) {
    event.preventDefault();

    const form = event.target;
    const nameField = form.querySelector('[name="name"]');
    const name = nameField ? nameField.value : 'there';
    const submitBtn = form.querySelector('button[type="submit"]');

    if (!submitBtn) return;

    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;

    const formData = new FormData(form);

    fetch('https://formspree.io/f/' + FORMSPREE_ID, {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' }
    })
    .then(function(response) {
        if (response.ok) {
            alert('Thank you, ' + name + '! Your message has been sent. We\'ll be in touch within 24 hours.');
            form.reset();
        } else {
            alert('There was a problem sending your message. Please call (203) 718-6513 or email info@azimuththerapeutics.com directly.');
        }
    })
    .catch(function() {
        alert('There was a problem sending your message. Please call (203) 718-6513 or email info@azimuththerapeutics.com directly.');
    })
    .finally(function() {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    });
}
