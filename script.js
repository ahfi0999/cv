// Enhanced JavaScript functionality for Ahmed Hussain's Portfolio

// Performance monitoring
const startTime = performance.now();

// Utility functions
const utils = {
    debounce: (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },
    
    throttle: (func, limit) => {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
};

// Theme management
class ThemeManager {
    constructor() {
        this.currentTheme = localStorage.getItem('theme') || 'light';
        this.themeToggle = document.querySelector('.theme-toggle i');
        this.init();
    }
    
    init() {
        this.applyTheme(this.currentTheme);
        this.setupEventListeners();
    }
    
    applyTheme(theme) {
        document.body.setAttribute('data-theme', theme);
        this.themeToggle.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        localStorage.setItem('theme', theme);
        this.currentTheme = theme;
    }
    
    toggle() {
        const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.applyTheme(newTheme);
    }
    
    setupEventListeners() {
        document.querySelector('.theme-toggle').addEventListener('click', () => {
            this.toggle();
        });
    }
}

// Navigation manager
class NavigationManager {
    constructor() {
        this.navLinks = document.querySelectorAll('.nav-links a');
        this.sections = document.querySelectorAll('section[id]');
        this.currentSection = '';
        this.init();
    }
    
    init() {
        this.setupSmoothScrolling();
        this.setupActiveNavigation();
    }
    
    setupSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }
    
    setupActiveNavigation() {
        const updateActiveNav = utils.throttle(() => {
            let currentSection = '';
            this.sections.forEach(section => {
                const sectionTop = section.offsetTop - 100;
                const sectionHeight = section.clientHeight;
                if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                    currentSection = section.getAttribute('id');
                }
            });

            this.navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href').substring(1) === currentSection) {
                    link.classList.add('active');
                }
            });
        }, 100);
        
        window.addEventListener('scroll', updateActiveNav);
    }
}

// Animation manager
class AnimationManager {
    constructor() {
        this.observer = null;
        this.init();
    }
    
    init() {
        this.setupScrollAnimations();
        this.setupHeroAnimations();
        this.setupParticleEffect();
    }
    
    setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in-up');
                    
                    // Add staggered animation for grid items
                    const gridItems = entry.target.querySelectorAll('.skill-category, .project-card, .cert-card');
                    gridItems.forEach((item, index) => {
                        setTimeout(() => {
                            item.style.animation = `fadeInUp 0.8s ease forwards`;
                        }, index * 100);
                    });
                }
            });
        }, observerOptions);

        document.querySelectorAll('section').forEach(section => {
            this.observer.observe(section);
        });
    }
    
    setupHeroAnimations() {
        const heroTitle = document.querySelector('.hero-content h1');
        const heroSubtitle = document.querySelector('.hero-content h2');
        
        const typeWriter = (element, text, speed = 100) => {
            element.innerHTML = '';
            let i = 0;
            const type = () => {
                if (i < text.length) {
                    element.innerHTML += text.charAt(i);
                    i++;
                    setTimeout(type, speed);
                }
            };
            type();
        };

        window.addEventListener('load', () => {
            setTimeout(() => typeWriter(heroTitle, 'Ahmed Hussain'), 500);
            setTimeout(() => typeWriter(heroSubtitle, 'Aspiring AI/ML Engineer'), 2000);
        });
    }
    
    setupParticleEffect() {
        const createParticle = () => {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 6 + 's';
            particle.style.animationDuration = (Math.random() * 3 + 3) + 's';
            return particle;
        };
        
        const hero = document.querySelector('.hero');
        if (hero) {
            const particlesContainer = document.createElement('div');
            particlesContainer.className = 'particles';
            
            for (let i = 0; i < 50; i++) {
                particlesContainer.appendChild(createParticle());
            }
            
            hero.style.position = 'relative';
            hero.appendChild(particlesContainer);
        }
    }
}

// Contact form manager
class ContactFormManager {
    constructor() {
        this.form = document.getElementById('contactForm');
        this.init();
    }
    
    init() {
        if (this.form) {
            this.setupFormValidation();
            this.setupFormSubmission();
        }
    }
    
    setupFormValidation() {
        const inputs = this.form.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearErrors(input));
        });
    }
    
    validateField(field) {
        const value = field.value.trim();
        const fieldName = field.name;
        
        this.clearErrors(field);
        
        if (!value) {
            this.showError(field, `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`);
            return false;
        }
        
        if (fieldName === 'email' && !this.isValidEmail(value)) {
            this.showError(field, 'Please enter a valid email address');
            return false;
        }
        
        return true;
    }
    
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    showError(field, message) {
        field.classList.add('error');
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        errorDiv.style.color = 'var(--accent-primary)';
        errorDiv.style.fontSize = '0.9rem';
        errorDiv.style.marginTop = '0.5rem';
        field.parentNode.appendChild(errorDiv);
    }
    
    clearErrors(field) {
        field.classList.remove('error');
        const errorMessage = field.parentNode.querySelector('.error-message');
        if (errorMessage) {
            errorMessage.remove();
        }
    }
    
    setupFormSubmission() {
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const formData = new FormData(this.form);
            const isValid = Array.from(this.form.querySelectorAll('input, textarea'))
                .every(field => this.validateField(field));
            
            if (isValid) {
                this.submitForm(formData);
            }
        });
    }
    
    async submitForm(formData) {
        const submitBtn = this.form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        // Show loading state
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;
        
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Success message
            this.showSuccessMessage();
            this.form.reset();
        } catch (error) {
            this.showErrorMessage();
        } finally {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    }
    
    showSuccessMessage() {
        const message = document.createElement('div');
        message.className = 'success-message';
        message.innerHTML = '<i class="fas fa-check-circle"></i> Thank you! Your message has been sent successfully.';
        message.style.cssText = `
            background: #d4edda;
            color: #155724;
            padding: 1rem;
            border-radius: 8px;
            margin-top: 1rem;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        `;
        
        this.form.appendChild(message);
        setTimeout(() => message.remove(), 5000);
    }
    
    showErrorMessage() {
        const message = document.createElement('div');
        message.className = 'error-message';
        message.innerHTML = '<i class="fas fa-exclamation-circle"></i> Sorry, there was an error sending your message. Please try again.';
        message.style.cssText = `
            background: #f8d7da;
            color: #721c24;
            padding: 1rem;
            border-radius: 8px;
            margin-top: 1rem;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        `;
        
        this.form.appendChild(message);
        setTimeout(() => message.remove(), 5000);
    }
}

// Performance manager
class PerformanceManager {
    constructor() {
        this.init();
    }
    
    init() {
        this.setupLazyLoading();
        this.setupImageOptimization();
        this.logPerformanceMetrics();
    }
    
    setupLazyLoading() {
        const images = document.querySelectorAll('img[data-src]');
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }
    
    setupImageOptimization() {
        // Add loading="lazy" to images
        document.querySelectorAll('img').forEach(img => {
            if (!img.hasAttribute('loading')) {
                img.setAttribute('loading', 'lazy');
            }
        });
    }
    
    logPerformanceMetrics() {
        window.addEventListener('load', () => {
            const loadTime = performance.now() - startTime;
            console.log(`🚀 Portfolio loaded in ${loadTime.toFixed(2)}ms`);
            
            // Log other metrics if available
            if ('connection' in navigator) {
                console.log(`📡 Connection: ${navigator.connection.effectiveType}`);
            }
        });
    }
}

// Accessibility manager
class AccessibilityManager {
    constructor() {
        this.init();
    }
    
    init() {
        this.setupKeyboardNavigation();
        this.setupSkipLinks();
        this.setupFocusManagement();
    }
    
    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                document.body.classList.add('keyboard-navigation');
            }
        });
        
        document.addEventListener('mousedown', () => {
            document.body.classList.remove('keyboard-navigation');
        });
    }
    
    setupSkipLinks() {
        const skipLink = document.createElement('a');
        skipLink.href = '#main';
        skipLink.className = 'skip-link sr-only';
        skipLink.textContent = 'Skip to main content';
        skipLink.style.cssText = `
            position: absolute;
            top: -40px;
            left: 6px;
            background: var(--accent-primary);
            color: white;
            padding: 8px;
            text-decoration: none;
            border-radius: 4px;
            z-index: 1000;
        `;
        
        skipLink.addEventListener('focus', () => {
            skipLink.style.top = '6px';
        });
        
        skipLink.addEventListener('blur', () => {
            skipLink.style.top = '-40px';
        });
        
        document.body.insertBefore(skipLink, document.body.firstChild);
    }
    
    setupFocusManagement() {
        // Add aria-labels where needed
        document.querySelectorAll('button, a').forEach(element => {
            if (!element.hasAttribute('aria-label') && !element.textContent.trim()) {
                const icon = element.querySelector('i');
                if (icon) {
                    const iconClass = icon.className;
                    if (iconClass.includes('fa-moon')) element.setAttribute('aria-label', 'Switch to dark theme');
                    if (iconClass.includes('fa-sun')) element.setAttribute('aria-label', 'Switch to light theme');
                    if (iconClass.includes('fa-bars')) element.setAttribute('aria-label', 'Open mobile menu');
                }
            }
        });
    }
}

// Main application initialization
class PortfolioApp {
    constructor() {
        this.components = [];
        this.init();
    }
    
    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initializeComponents());
        } else {
            this.initializeComponents();
        }
    }
    
    initializeComponents() {
        try {
            this.components.push(new ThemeManager());
            this.components.push(new NavigationManager());
            this.components.push(new AnimationManager());
            this.components.push(new ContactFormManager());
            this.components.push(new PerformanceManager());
            this.components.push(new AccessibilityManager());
            
            console.log('✅ Portfolio app initialized successfully');
        } catch (error) {
            console.error('❌ Error initializing portfolio app:', error);
        }
    }
}

// Initialize the application
const portfolioApp = new PortfolioApp();

// Global function for theme toggle (for backward compatibility)
window.toggleTheme = () => {
    const themeManager = portfolioApp.components.find(c => c instanceof ThemeManager);
    if (themeManager) {
        themeManager.toggle();
    }
};

// Export for module usage if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { PortfolioApp, ThemeManager, NavigationManager };
}
