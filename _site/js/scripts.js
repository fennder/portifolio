/**
 * Abrindo Portas - JavaScript Interativo v2.0
 * Desenvolvido para otimizar performance e experiência do usuário
 */

// Utility functions
const utils = {
    // Debounce function for performance optimization
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

    // Throttle function for performance optimization
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
    },

    // Check if element is in viewport
    isInViewport: (element) => {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    },

    // Smooth scroll to element
    smoothScroll: (target, duration = 800) => {
        const targetElement = document.querySelector(target);
        if (!targetElement) return;

        const targetPosition = targetElement.offsetTop - 80;
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        let startTime = null;

        const animation = (currentTime) => {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const run = easeInOutQuad(timeElapsed, startPosition, distance, duration);
            window.scrollTo(0, run);
            if (timeElapsed < duration) requestAnimationFrame(animation);
        };

        const easeInOutQuad = (t, b, c, d) => {
            t /= d / 2;
            if (t < 1) return c / 2 * t * t + b;
            t--;
            return -c / 2 * (t * (t - 2) - 1) + b;
        };

        requestAnimationFrame(animation);
    }
};

// Initialize DOM elements
const elements = {
    html: document.documentElement,
    body: document.body,
    navbar: document.getElementById('navbar'),
    mobileMenuBtn: document.getElementById('mobile-menu-btn'),
    mobileMenu: document.getElementById('mobile-menu'),
    darkModeToggle: document.getElementById('dark-mode-toggle'),
    darkModeToggleMobile: document.getElementById('dark-mode-toggle-mobile'),
    revealElements: document.querySelectorAll('.reveal'),
    counterElements: document.querySelectorAll('.counter'),
    skillBars: document.querySelectorAll('.skill-bar'),
    typingElements: document.querySelectorAll('.typing-text'),
    lazyImages: document.querySelectorAll('img[data-src]'),
    parallaxElements: document.querySelectorAll('.parallax')
};

// Dark Mode Management
const darkMode = {
    init() {
        // Check user preference
        const isDark = localStorage.theme === 'dark' || 
                      (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
        
        if (isDark) {
            this.enable();
        }

        // Event listeners
        if (elements.darkModeToggle) {
            elements.darkModeToggle.addEventListener('click', () => this.toggle());
        }
        if (elements.darkModeToggleMobile) {
            elements.darkModeToggleMobile.addEventListener('click', () => this.toggle());
        }
    },

    enable() {
        elements.html.classList.add('dark');
        localStorage.theme = 'dark';
    },

    disable() {
        elements.html.classList.remove('dark');
        localStorage.theme = 'light';
    },

    toggle() {
        if (elements.html.classList.contains('dark')) {
            this.disable();
        } else {
            this.enable();
        }
    }
};

// Mobile Menu Management
const mobileMenu = {
    init() {
        if (!elements.mobileMenuBtn || !elements.mobileMenu) return;

        elements.mobileMenuBtn.addEventListener('click', () => this.toggle());
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!elements.mobileMenu.contains(e.target) && !elements.mobileMenuBtn.contains(e.target)) {
                this.close();
            }
        });
    },

    toggle() {
        elements.mobileMenu.classList.toggle('hidden');
        this.updateIcon();
    },

    close() {
        elements.mobileMenu.classList.add('hidden');
        this.updateIcon();
    },

    updateIcon() {
        const icon = elements.mobileMenuBtn.querySelector('svg');
        if (elements.mobileMenu.classList.contains('hidden')) {
            icon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>';
        } else {
            icon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>';
        }
    }
};

// Scroll Animations
const scrollAnimations = {
    init() {
        this.setupRevealAnimations();
        this.setupNavbarScroll();
        this.setupSkillBars();
        this.setupCounters();
        this.setupTypingEffects();
        this.setupParallax();
        
        // Initialize Intersection Observer
        this.setupIntersectionObserver();
    },

    setupRevealAnimations() {
        const revealOnScroll = utils.throttle(() => {
            elements.revealElements.forEach(element => {
                if (utils.isInViewport(element)) {
                    element.classList.add('active');
                }
            });
        }, 100);

        window.addEventListener('scroll', revealOnScroll);
        revealOnScroll(); // Initial check
    },

    setupNavbarScroll() {
        const updateNavbar = utils.throttle(() => {
            if (window.scrollY > 10) {
                elements.navbar.classList.add('shadow-lg', 'bg-white/98');
            } else {
                elements.navbar.classList.remove('shadow-lg', 'bg-white/98');
            }
        }, 100);

        window.addEventListener('scroll', updateNavbar);
    },

    setupSkillBars() {
        const animateSkillBars = utils.throttle(() => {
            elements.skillBars.forEach(bar => {
                if (utils.isInViewport(bar)) {
                    const width = bar.getAttribute('data-width') || '0';
                    bar.style.width = width;
                }
            });
        }, 100);

        window.addEventListener('scroll', animateSkillBars);
    },

    setupCounters() {
        const animateCounters = utils.throttle(() => {
            elements.counterElements.forEach(counter => {
                if (utils.isInViewport(counter) && !counter.classList.contains('animated')) {
                    counter.classList.add('animated');
                    this.animateCounter(counter);
                }
            });
        }, 100);

        window.addEventListener('scroll', animateCounters);
    },

    animateCounter(counter) {
        const target = parseInt(counter.getAttribute('data-target') || '0');
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;

        const updateCounter = () => {
            current += increment;
            if (current < target) {
                counter.textContent = Math.ceil(current);
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target;
            }
        };

        updateCounter();
    },

    setupTypingEffects() {
        elements.typingElements.forEach(element => {
            const text = element.textContent;
            element.textContent = '';
            let index = 0;

            const type = () => {
                if (index < text.length) {
                    element.textContent += text.charAt(index);
                    index++;
                    setTimeout(type, 50 + Math.random() * 50);
                }
            };

            // Start typing when element is in viewport
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && !element.classList.contains('typed')) {
                        element.classList.add('typed');
                        type();
                    }
                });
            });

            observer.observe(element);
        });
    },

    setupParallax() {
        const updateParallax = utils.throttle(() => {
            elements.parallaxElements.forEach(element => {
                const scrolled = window.pageYOffset;
                const rate = element.getAttribute('data-speed') || '0.5';
                const yPos = -(scrolled * rate);
                element.style.transform = `translateY(${yPos}px)`;
            });
        }, 10);

        window.addEventListener('scroll', updateParallax);
    },

    setupIntersectionObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    
                    // Add fade-in animation
                    entry.target.style.opacity = '0';
                    entry.target.style.transform = 'translateY(20px)';
                    
                    setTimeout(() => {
                        entry.target.style.transition = 'all 0.6s ease-out';
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, 100);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        // Observe all sections
        document.querySelectorAll('section').forEach(section => {
            observer.observe(section);
        });
    }
};

// Lazy Loading
const lazyLoading = {
    init() {
        if ('loading' in HTMLImageElement.prototype) {
            // Native lazy loading
            elements.lazyImages.forEach(img => {
                img.src = img.dataset.src;
                img.classList.remove('lazy');
            });
        } else {
            // Fallback for browsers that don't support native lazy loading
            this.setupIntersectionObserver();
        }
    },

    setupIntersectionObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    observer.unobserve(img);
                }
            });
        }, {
            threshold: 0.1
        });

        elements.lazyImages.forEach(img => {
            observer.observe(img);
        });
    }
};

// Form Enhancements
const formEnhancements = {
    init() {
        this.setupFormValidation();
        this.setupCharacterCounters();
        this.setupPhoneFormatting();
    },

    setupFormValidation() {
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
            const inputs = form.querySelectorAll('input, textarea, select');
            
            inputs.forEach(input => {
                // Real-time validation
                input.addEventListener('blur', () => this.validateField(input));
                input.addEventListener('input', () => {
                    if (input.classList.contains('invalid')) {
                        this.validateField(input);
                    }
                });
            });
        });
    },

    validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';

        // Required field validation
        if (field.hasAttribute('required') && !value) {
            isValid = false;
            errorMessage = 'Este campo é obrigatório';
        }

        // Email validation
        if (field.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                errorMessage = 'Por favor, informe um e-mail válido';
            }
        }

        // Phone validation
        if (field.type === 'tel' && value) {
            const phoneRegex = /\(\d{2}\)\s?\d{4,5}-\d{4}/;
            if (!phoneRegex.test(value)) {
                isValid = false;
                errorMessage = 'Formato: (63) 99999-9999';
            }
        }

        // Update field appearance
        if (isValid) {
            field.classList.remove('invalid', 'border-red-500');
            field.classList.add('valid', 'border-green-500');
            
            // Remove error message if exists
            const errorElement = field.parentNode.querySelector('.error-message');
            if (errorElement) {
                errorElement.remove();
            }
        } else {
            field.classList.remove('valid', 'border-green-500');
            field.classList.add('invalid', 'border-red-500');
            
            // Add or update error message
            let errorElement = field.parentNode.querySelector('.error-message');
            if (!errorElement) {
                errorElement = document.createElement('p');
                errorElement.className = 'error-message text-red-500 text-sm mt-1';
                field.parentNode.appendChild(errorElement);
            }
            errorElement.textContent = errorMessage;
        }

        return isValid;
    },

    setupCharacterCounters() {
        const textareas = document.querySelectorAll('textarea[maxlength]');
        textareas.forEach(textarea => {
            const counter = document.createElement('span');
            counter.className = 'text-sm text-gray-500 mt-1 block';
            counter.textContent = `0/${textarea.maxLength}`;
            textarea.parentNode.appendChild(counter);

            textarea.addEventListener('input', () => {
                const length = textarea.value.length;
                counter.textContent = `${length}/${textarea.maxLength}`;
                
                if (length > textarea.maxLength * 0.9) {
                    counter.classList.add('text-red-500');
                } else {
                    counter.classList.remove('text-red-500');
                }
            });
        });
    },

    setupPhoneFormatting() {
        const phoneInputs = document.querySelectorAll('input[type="tel"]');
        phoneInputs.forEach(input => {
            input.addEventListener('input', (e) => {
                let value = e.target.value.replace(/\D/g, '');
                if (value.length > 0) {
                    if (value.length <= 2) {
                        value = `(${value}`;
                    } else if (value.length <= 6) {
                        value = `(${value.slice(0, 2)}) ${value.slice(2)}`;
                    } else if (value.length <= 10) {
                        value = `(${value.slice(0, 2)}) ${value.slice(2, 6)}-${value.slice(6)}`;
                    } else {
                        value = `(${value.slice(0, 2)}) ${value.slice(2, 7)}-${value.slice(7, 11)}`;
                    }
                    e.target.value = value;
                }
            });
        });
    }
};

// Performance optimizations
const performance = {
    init() {
        this.setupLazyLoad();
        this.optimizeImages();
        this.setupPrefetching();
    },

    setupLazyLoad() {
        // Lazy load images
        const images = document.querySelectorAll('img[loading="lazy"]');
        images.forEach(img => {
            img.addEventListener('load', () => {
                img.classList.add('loaded');
            });
        });
    },

    optimizeImages() {
        // Add loading="lazy" to images not in viewport
        const allImages = document.querySelectorAll('img:not([loading="lazy"])');
        allImages.forEach(img => {
            if (!utils.isInViewport(img)) {
                img.setAttribute('loading', 'lazy');
            }
        });
    },

    setupPrefetching() {
        // Prefetch important resources
        const prefetchLinks = [
            'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap',
            'https://cdn.tailwindcss.com'
        ];

        prefetchLinks.forEach(url => {
            const link = document.createElement('link');
            link.rel = 'prefetch';
            link.href = url;
            document.head.appendChild(link);
        });
    }
};

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all modules
    darkMode.init();
    mobileMenu.init();
    scrollAnimations.init();
    lazyLoading.init();
    formEnhancements.init();
    performance.init();

    // Add smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            const target = anchor.getAttribute('href');
            if (target !== '#') {
                utils.smoothScroll(target);
            }
        });
    });

    // Add year to footer
    const yearElement = document.getElementById('year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }

    // Add loading class to body
    document.body.classList.remove('loading');
    document.body.classList.add('loaded');

    // Console welcome message (development only)
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        console.log('🚀 Abrindo Portas - Portfolio v2.0 loaded successfully!');
        console.log('💡 Check out the interactive features and animations');
    }
});

// Handle window resize
window.addEventListener('resize', utils.debounce(() => {
    // Recalculate viewport-based animations
    elements.revealElements.forEach(element => {
        if (utils.isInViewport(element)) {
            element.classList.add('active');
        }
    }
), 250));

// Handle page visibility change for performance
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Pause animations when page is not visible
        document.body.classList.add('paused');
    } else {
        // Resume animations when page becomes visible
        document.body.classList.remove('paused');
    }
});