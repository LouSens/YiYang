// js/main.js

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    initializePortfolio();
});

// Main initialization function
function initializePortfolio() {
    setupSmoothScrolling();
    setupMobileMenu();
    setupHeaderScroll();
    setupSmokeAnimation();
    setupSkillsAnimation();
    setupFormHandling(); // Restore this function call
    setupScrollAnimations();
    setupEnhancedAboutAnimations();
    setupLazyLoading();
    setupInfiniteScroller();
}

// Form handling with robust AJAX to gracefully handle FormSubmit's responses
function setupFormHandling() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;

    contactForm.addEventListener('submit', function (e) {
        e.preventDefault(); // Stop the default page redirect

        const formData = new FormData(contactForm);
        const submitBtn = contactForm.querySelector('.submit-btn');
        const btnText = submitBtn.querySelector('.btn-text');
        const btnLoading = submitBtn.querySelector('.btn-loading');

        // Show loading state
        submitBtn.disabled = true;
        btnText.style.display = 'none';
        btnLoading.style.display = 'inline';

        fetch(contactForm.action, {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json' // We PREFER JSON, but will handle HTML
            }
        })
        .then(response => {
            // Check the content type of the response
            const contentType = response.headers.get('content-type');
            if (response.ok) {
                // If FormSubmit sends back HTML (like a CAPTCHA or thank you page),
                // we will treat it as a success because the submission worked.
                if (contentType && contentType.indexOf('application/json') !== -1) {
                    return response.json(); // It's JSON, process it normally
                } else {
                    return { success: true }; // It's HTML, so we create our own success object
                }
            } else {
                // Handle server errors
                return response.json().then(data => {
                    const errorMessage = data.message || 'Server error. Please try again.';
                    throw new Error(errorMessage);
                });
            }
        })
        .then(data => {
            // Success! Show the notification and reset the form
            showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
            contactForm.reset();
        })
        .catch(error => {
            // Handle network errors or errors thrown from the .then blocks
            showNotification(error.toString(), 'error');
        })
        .finally(() => {
            // ALWAYS reset the button state
            submitBtn.disabled = false;
            btnText.style.display = 'inline';
            btnLoading.style.display = 'none';
        });
    });
}


// Smooth scrolling for navigation links
function setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerHeight = document.querySelector('header').offsetHeight;
                const targetPosition = target.offsetTop - headerHeight;
                window.scrollTo({ top: targetPosition, behavior: 'smooth' });
            }
        });
    });
}

// Mobile menu functionality
function setupMobileMenu() {
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const navLinks = document.querySelector('.nav-links');
    if (mobileMenuToggle && navLinks) {
        mobileMenuToggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            this.classList.toggle('active');
        });
    }
}

// Header background opacity on scroll
function setupHeaderScroll() {
    const header = document.querySelector('header');
    if (header) {
        window.addEventListener('scroll', () => {
            header.style.background = `rgba(0,0,0,${Math.min(window.pageYOffset / 100, 0.95)})`;
            header.style.boxShadow = (window.pageYOffset > 10) ? '0 2px 20px rgba(0,0,0,0.5)' : 'none';
        });
    }
}

// Generate animated smoke particles
function setupSmokeAnimation() {
    const smokeContainer = document.getElementById('smokeBackground');
    if (!smokeContainer) return;
    const createSmokeParticles = () => {
        smokeContainer.innerHTML = '';
        for (let i = 0; i < 15; i++) {
            setTimeout(() => {
                const particle = document.createElement('div');
                particle.className = 'smoke-particle';
                const size = Math.random() * 100 + 50;
                particle.style.width = `${size}px`;
                particle.style.height = `${size}px`;
                particle.style.left = `${Math.random() * 100}%`;
                particle.style.animationDelay = `${Math.random() * 15}s`;
                particle.style.animationDuration = `${Math.random() * 10 + 15}s`;
                smokeContainer.appendChild(particle);
            }, i * 1000);
        }
    };
    createSmokeParticles();
}

// Skills progress animation
function setupSkillsAnimation() {
    const skillProgressBars = document.querySelectorAll('.skill-progress');
    if (skillProgressBars.length === 0) return;
    const skillsSection = document.getElementById('skills');
    if (skillsSection) {
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                skillProgressBars.forEach((bar, index) => {
                    setTimeout(() => bar.style.width = bar.dataset.level + '%', index * 100);
                });
                observer.unobserve(skillsSection);
            }
        }, { threshold: 0.3 });
        observer.observe(skillsSection);
    }
}

// Notification system (make sure this is present and correct)
function showNotification(message, type = 'info') {
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) existingNotification.remove();
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `<span>${message}</span><button class="notification-close">&times;</button>`;
    Object.assign(notification.style, {
        position: 'fixed', top: '20px', right: '20px', background: type === 'success' ? '#10b981' : '#ef4444',
        color: 'white', padding: '1rem 1.5rem', borderRadius: '10px', boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
        zIndex: '10000', transform: 'translateX(120%)', transition: 'transform 0.3s ease'
    });
    const closeBtn = notification.querySelector('.notification-close');
    Object.assign(closeBtn.style, { background: 'none', border: 'none', color: 'white', fontSize: '1.5rem', cursor: 'pointer' });
    document.body.appendChild(notification);
    setTimeout(() => notification.style.transform = 'translateX(0)', 100);
    const removeNotification = () => {
        notification.style.transform = 'translateX(120%)';
        setTimeout(() => notification.remove(), 300);
    };
    closeBtn.addEventListener('click', removeNotification);
    setTimeout(removeNotification, 5000);
}


// Scroll animations using Intersection Observer
function setupScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    document.querySelectorAll('.card, .skill-item').forEach(el => observer.observe(el));
}


// Add this function after setupScrollAnimations()
function setupEnhancedAboutAnimations() {
    const aboutIntro = document.querySelector('.about-intro');
    const timelineTitle = document.querySelector('.timeline-title');
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px 0px -100px 0px'
    };
    
    // About intro animation
    const aboutObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                aboutObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    if (aboutIntro) aboutObserver.observe(aboutIntro);
    
    // Timeline title animation
    const titleObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                titleObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    if (timelineTitle) titleObserver.observe(timelineTitle);
    
    // Timeline items staggered animation
    const itemsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('animate-in');
                }, Array.from(timelineItems).indexOf(entry.target) * 200);
                itemsObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    timelineItems.forEach(item => itemsObserver.observe(item));
}


// Lazy loading for images
function setupLazyLoading() {
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.src; // This might be redundant if already set, but ensures it loads
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        document.querySelectorAll('img[loading="lazy"]').forEach(img => imageObserver.observe(img));
    }
}


// --- Replace your old scroller function with this one ---
function setupInfiniteScroller() {
    const scroller = document.querySelector(".skills-scroller");

    // If a user has 'prefers-reduced-motion' on, we don't play the animation
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        return;
    }

    // Get the list of skills
    const scrollerInner = scroller.querySelector(".skills-list");
    const scrollerContent = Array.from(scrollerInner.children);

    // Duplicate the items and add them to the list
    scrollerContent.forEach(item => {
        const duplicatedItem = item.cloneNode(true);
        duplicatedItem.setAttribute("aria-hidden", true); // Important for accessibility
        scrollerInner.appendChild(duplicatedItem);
    });
    
    // Add the attribute that triggers the CSS animation
    scroller.setAttribute("data-animated", "true");
}

// Console easter egg
console.log("Welcome to the portfolio!");
