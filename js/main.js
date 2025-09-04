
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
    setupScrollAnimations();
    setupLazyLoading();
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
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                const nav = document.querySelector('.nav-links');
                if (nav && nav.classList.contains('active')) {
                    nav.classList.remove('active');
                }
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
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!e.target.closest('nav')) {
                navLinks.classList.remove('active');
                mobileMenuToggle.classList.remove('active');
            }
        });
        
        // Close mobile menu on window resize
        window.addEventListener('resize', function() {
            if (window.innerWidth > 768) {
                navLinks.classList.remove('active');
                mobileMenuToggle.classList.remove('active');
            }
        });
    }
}

// Header background opacity on scroll
function setupHeaderScroll() {
    const header = document.querySelector('header');
    
    if (header) {
        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            const opacity = Math.min(scrolled / 100, 0.95);
            header.style.background = `rgba(0,0,0,${opacity})`;
            
            // Add shadow when scrolled
            if (scrolled > 10) {
                header.style.boxShadow = '0 2px 20px rgba(0,0,0,0.5)';
            } else {
                header.style.boxShadow = 'none';
            }
        });
    }
}

// Generate animated smoke particles
function setupSmokeAnimation() {
    const smokeContainer = document.getElementById('smokeBackground');
    
    if (!smokeContainer) return;
    
    function createSmokeParticles() {
        // Clear existing particles
        smokeContainer.innerHTML = '';
        
        for (let i = 0; i < 15; i++) {
            setTimeout(() => {
                const particle = document.createElement('div');
                particle.className = 'smoke-particle';
                
                // Random size and position
                const size = Math.random() * 100 + 50;
                particle.style.width = size + 'px';
                particle.style.height = size + 'px';
                particle.style.left = Math.random() * 100 + '%';
                particle.style.animationDelay = Math.random() * 15 + 's';
                particle.style.animationDuration = (Math.random() * 10 + 15) + 's';
                
                smokeContainer.appendChild(particle);
                
                // Remove particle after animation
                setTimeout(() => {
                    if (particle.parentNode) {
                        particle.parentNode.removeChild(particle);
                    }
                }, 25000);
            }, i * 1000);
        }
    }
    
    // Initial smoke particles
    createSmokeParticles();
    
    // Continuously generate smoke particles
    setInterval(createSmokeParticles, 20000);
}

// Skills progress animation
function setupSkillsAnimation() {
    const skillProgressBars = document.querySelectorAll('.skill-progress');
    
    if (skillProgressBars.length === 0) return;
    
    const animateSkills = () => {
        skillProgressBars.forEach((bar, index) => {
            const level = bar.getAttribute('data-level');
            if (level) {
                setTimeout(() => {
                    bar.style.width = level + '%';
                }, index * 200);
            }
        });
    };
    
    // Use Intersection Observer to trigger animation when skills section is visible
    const skillsSection = document.getElementById('skills');
    if (skillsSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateSkills();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });
        
        observer.observe(skillsSection);
    }
}

    
    // Real-time validation
    const inputs = contactForm.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', () => validateField(input));
        input.addEventListener('input', () => clearFieldError(input));
    });
}

// Form validation
function validateForm(data) {
    let isValid = true;
    
    // Name validation
    if (!data.name || data.name.trim().length < 2) {
        showFieldError('name', 'Name must be at least 2 characters long');
        isValid = false;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!data.email || !emailRegex.test(data.email)) {
        showFieldError('email', 'Please enter a valid email address');
        isValid = false;
    }
    
    // Message validation
    if (!data.message || data.message.trim().length < 10) {
        showFieldError('message', 'Message must be at least 10 characters long');
        isValid = false;
    }
    
    return isValid;
}

function validateField(field) {
    const value = field.value.trim();
    const fieldName = field.name;
    
    clearFieldError(field);
    
    switch (fieldName) {
        case 'name':
            if (value.length > 0 && value.length < 2) {
                showFieldError(fieldName, 'Name must be at least 2 characters long');
            }
            break;
        case 'email':
            if (value.length > 0 && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                showFieldError(fieldName, 'Please enter a valid email address');
            }
            break;
        case 'message':
            if (value.length > 0 && value.length < 10) {
                showFieldError(fieldName, 'Message must be at least 10 characters long');
            }
            break;
    }
}

function showFieldError(fieldName, message) {
    const field = document.querySelector(`[name="${fieldName}"]`);
    if (!field) return;
    
    field.style.borderColor = '#ff6b6b';
    
    // Remove existing error message
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
    
    // Add new error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.textContent = message;
    errorDiv.style.color = '#ff6b6b';
    errorDiv.style.fontSize = '0.85rem';
    errorDiv.style.marginTop = '0.25rem';
    
    field.parentNode.appendChild(errorDiv);
}

function clearFieldError(field) {
    field.style.borderColor = '';
    const errorDiv = field.parentNode.querySelector('.field-error');
    if (errorDiv) {
        errorDiv.remove();
    }
}

// Simulate form submission (replace with actual API call)
function simulateFormSubmission(data) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // Simulate success/failure
            if (Math.random() > 0.1) { // 90% success rate
                resolve(data);
            } else {
                reject(new Error('Network error'));
            }
        }, 2000);
    });
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notification
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button class="notification-close">&times;</button>
    `;
    
    // Notification styles
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        background: type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6',
        color: 'white',
        padding: '1rem 1.5rem',
        borderRadius: '10px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
        zIndex: '10000',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        maxWidth: '400px',
        transform: 'translateX(100%)',
        transition: 'transform 0.3s ease'
    });
    
    // Close button styles
    const closeBtn = notification.querySelector('.notification-close');
    Object.assign(closeBtn.style, {
        background: 'none',
        border: 'none',
        color: 'white',
        fontSize: '1.5rem',
        cursor: 'pointer',
        padding: '0',
        lineHeight: '1'
    });
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Close functionality
    closeBtn.addEventListener('click', () => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => notification.remove(), 300);
    });
    
    // Auto-close after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// Scroll animations using Intersection Observer
function setupScrollAnimations() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return;
    }
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe cards
    document.querySelectorAll('.card').forEach(card => {
        observer.observe(card);
    });
    
    // Observe skill items
    document.querySelectorAll('.skill-item').forEach(item => {
        observer.observe(item);
    });
}

// Lazy loading for images
function setupLazyLoading() {
    const images = document.querySelectorAll('img[loading="lazy"]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => {
            img.classList.add('lazy');
            imageObserver.observe(img);
        });
    }
}

// Keyboard navigation support
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        // Close mobile menu
        const navLinks = document.querySelector('.nav-links');
        const mobileMenuToggle = document.getElementById('mobileMenuToggle');
        
        if (navLinks && navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            mobileMenuToggle.classList.remove('active');
        }
        
        // Close any notifications
        const notification = document.querySelector('.notification');
        if (notification) {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        }
    }
});

// Handle focus for better accessibility
document.addEventListener('focusin', function(e) {
    if (e.target.matches('a, button, input, textarea, select')) {
        e.target.style.outline = '2px solid rgba(255, 255, 255, 0.5)';
        e.target.style.outlineOffset = '2px';
    }
});

document.addEventListener('focusout', function(e) {
    if (e.target.matches('a, button, input, textarea, select')) {
        e.target.style.outline = '';
        e.target.style.outlineOffset = '';
    }
});

// Performance optimization: Debounce scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Error handling for failed resources
window.addEventListener('error', function(e) {
    if (e.target.tagName === 'IMG') {
        // Handle failed image loads
        e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="200"%3E%3Crect width="100%25" height="100%25" fill="%23333"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23666"%3EImage not available%3C/text%3E%3C/svg%3E';
        e.target.alt = 'Image not available';
    }
});

// Console easter egg
console.log(`
🤖 Welcome to Alex Chen's AI Portfolio!
═══════════════════════════════════════

Built with:
• Modern JavaScript (ES6+)
• CSS3 with custom properties
• Intersection Observer API
• Accessible design principles
• Performance optimizations

Interested in the code? Check it out on GitHub!
https://github.com/yourusername/ai-portfolio

═══════════════════════════════════════
`);

// Export functions for testing (if in module environment)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        validateForm,
        showNotification,
        debounce
    };
}
