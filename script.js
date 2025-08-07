/**
 * Eva Sagmeister Logopädie Website
 * Consolidated JavaScript - All functionality in a single file
 */

/**
 * Navigation Module
 * Handles mobile menu functionality and navigation state
 */
class Navigation {
    constructor() {
        this.mobileMenuBtn = document.getElementById('mobile-menu-btn');
        this.mobileMenu = document.getElementById('mobile-menu');
        this.isMenuOpen = false;
        
        this.init();
    }

    init() {
        if (!this.mobileMenuBtn || !this.mobileMenu) {
            console.warn('Navigation elements not found');
            return;
        }

        this.bindEvents();
        this.setupAccessibility();
    }

    bindEvents() {
        // Mobile menu toggle
        this.mobileMenuBtn.addEventListener('click', () => {
            this.toggleMobileMenu();
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (this.isMenuOpen && 
                !this.mobileMenu.contains(e.target) && 
                !this.mobileMenuBtn.contains(e.target)) {
                this.closeMobileMenu();
            }
        });

        // Close menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isMenuOpen) {
                this.closeMobileMenu();
            }
        });

        // Close mobile menu when clicking on menu items
        const mobileMenuItems = this.mobileMenu.querySelectorAll('.mobile-menu-item');
        mobileMenuItems.forEach(item => {
            item.addEventListener('click', () => {
                this.closeMobileMenu();
            });
        });
    }

    setupAccessibility() {
        // Ensure proper ARIA attributes
        this.mobileMenuBtn.setAttribute('aria-expanded', 'false');
        this.mobileMenuBtn.setAttribute('aria-controls', 'mobile-menu');
    }

    toggleMobileMenu() {
        if (this.isMenuOpen) {
            this.closeMobileMenu();
        } else {
            this.openMobileMenu();
        }
    }

    openMobileMenu() {
        this.mobileMenu.classList.remove('hidden');
        this.mobileMenuBtn.setAttribute('aria-expanded', 'true');
        this.isMenuOpen = true;
        
        // Focus management
        const firstMenuItem = this.mobileMenu.querySelector('.mobile-menu-item');
        if (firstMenuItem) {
            firstMenuItem.focus();
        }
    }

    closeMobileMenu() {
        this.mobileMenu.classList.add('hidden');
        this.mobileMenuBtn.setAttribute('aria-expanded', 'false');
        this.isMenuOpen = false;
        
        // Return focus to menu button
        this.mobileMenuBtn.focus();
    }

    // Public method to check if menu is open
    isMobileMenuOpen() {
        return this.isMenuOpen;
    }

    // Public method to programmatically close menu
    closeMenu() {
        if (this.isMenuOpen) {
            this.closeMobileMenu();
        }
    }
}

/**
 * Smooth Scrolling Module
 * Handles smooth scrolling for navigation links and anchor links
 */
class SmoothScrolling {
    constructor() {
        this.scrollOffset = 80; // Account for fixed header
        this.scrollDuration = 400; // Reduced from 800ms to 400ms for faster animation
        this.easing = 'easeInOutCubic';
        
        this.init();
    }

    init() {
        this.bindEvents();
    }

    bindEvents() {
        // Handle all anchor links
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a[href^="#"]');
            if (link) {
                e.preventDefault();
                this.scrollToSection(link.getAttribute('href'));
            }
        });

        // Handle programmatic navigation
        window.addEventListener('app:navigate', (e) => {
            if (e.detail && e.detail.target) {
                this.scrollToSection(e.detail.target);
            }
        });
    }

    scrollToSection(targetId) {
        const target = document.querySelector(targetId);
        if (!target) {
            console.warn(`Target element ${targetId} not found`);
            return;
        }

        const targetPosition = target.offsetTop - this.scrollOffset;
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        let startTime = null;

        const animation = (currentTime) => {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const progress = Math.min(timeElapsed / this.scrollDuration, 1);
            const easeProgress = this.easeInOutCubic(progress);
            
            window.scrollTo(0, startPosition + distance * easeProgress);
            
            if (timeElapsed < this.scrollDuration) {
                requestAnimationFrame(animation);
            }
        };

        requestAnimationFrame(animation);
    }

    // Easing function for smooth animation
    easeInOutCubic(t) {
        return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
    }

    // Public method to scroll to a specific section
    scrollTo(targetId) {
        this.scrollToSection(targetId);
    }

    // Public method to update scroll offset (useful if header height changes)
    updateScrollOffset(offset) {
        this.scrollOffset = offset;
    }

    // Public method to update scroll duration
    updateScrollDuration(duration) {
        this.scrollDuration = duration;
    }
}

/**
 * Flip Cards Module
 * Handles interactive service cards with flip animations
 */
class FlipCards {
    constructor() {
        this.cards = [];
        this.activeCard = null;
        
        this.init();
    }

    init() {
        this.findCards();
        this.bindEvents();
        this.setupAccessibility();
    }

    findCards() {
        const cardElements = document.querySelectorAll('.flip-card');
        this.cards = Array.from(cardElements);
    }

    bindEvents() {
        this.cards.forEach(card => {
            // Click to flip
            card.addEventListener('click', (e) => {
                this.flipCard(card);
            });

            // Keyboard support
            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.flipCard(card);
                }
            });

            // Close card when clicking outside
            document.addEventListener('click', (e) => {
                if (!card.contains(e.target) && card.classList.contains('flipped')) {
                    this.unflipCard(card);
                }
            });

            // Close card on escape key
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && card.classList.contains('flipped')) {
                    this.unflipCard(card);
                }
            });
        });
    }

    setupAccessibility() {
        this.cards.forEach(card => {
            // Make cards focusable
            card.setAttribute('tabindex', '0');
            card.setAttribute('role', 'button');
            card.setAttribute('aria-pressed', 'false');
            
            // Add ARIA labels
            const serviceType = card.dataset.service;
            if (serviceType) {
                card.setAttribute('aria-label', `Mehr Informationen über ${serviceType}`);
            }
        });
    }

    flipCard(card) {
        // Close other cards first
        this.cards.forEach(otherCard => {
            if (otherCard !== card && otherCard.classList.contains('flipped')) {
                this.unflipCard(otherCard);
            }
        });

        // Flip the clicked card
        card.classList.add('flipped');
        card.setAttribute('aria-pressed', 'true');
        this.activeCard = card;

        // Announce to screen readers
        this.announceFlip(card, true);
    }

    unflipCard(card) {
        card.classList.remove('flipped');
        card.setAttribute('aria-pressed', 'false');
        
        if (this.activeCard === card) {
            this.activeCard = null;
        }

        // Announce to screen readers
        this.announceFlip(card, false);
    }

    announceFlip(card, isFlipped) {
        const serviceType = card.dataset.service;
        const message = isFlipped 
            ? `Detaillierte Informationen zu ${serviceType} werden angezeigt`
            : `Zurück zur Übersicht von ${serviceType}`;
        
        // Create temporary announcement element
        const announcement = document.createElement('div');
        announcement.setAttribute('aria-live', 'polite');
        announcement.setAttribute('aria-atomic', 'true');
        announcement.style.position = 'absolute';
        announcement.style.left = '-10000px';
        announcement.style.width = '1px';
        announcement.style.height = '1px';
        announcement.style.overflow = 'hidden';
        announcement.textContent = message;
        
        document.body.appendChild(announcement);
        
        // Remove after announcement
        setTimeout(() => {
            document.body.removeChild(announcement);
        }, 1000);
    }

    // Public method to flip a specific card
    flipCardByService(serviceType) {
        const card = this.cards.find(card => card.dataset.service === serviceType);
        if (card) {
            this.flipCard(card);
        }
    }

    // Public method to unflip all cards
    unflipAllCards() {
        this.cards.forEach(card => {
            if (card.classList.contains('flipped')) {
                this.unflipCard(card);
            }
        });
    }

    // Public method to get active card
    getActiveCard() {
        return this.activeCard;
    }
}

/**
 * Contact Form Module
 * Handles form validation, submission, and user feedback
 */
class ContactForm {
    constructor() {
        this.form = document.getElementById('contact-form');
        this.fields = {};
        this.isSubmitting = false;
        
        this.init();
    }

    init() {
        if (!this.form) {
            console.warn('Contact form not found');
            return;
        }

        this.findFields();
        this.bindEvents();
        this.setupValidation();
    }

    findFields() {
        this.fields = {
            name: this.form.querySelector('#name'),
            phone: this.form.querySelector('#phone'),
            email: this.form.querySelector('#email'),
            message: this.form.querySelector('#message')
        };
    }

    bindEvents() {
        // Form submission
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSubmit();
        });

        // Real-time validation
        Object.values(this.fields).forEach(field => {
            if (field) {
                field.addEventListener('blur', () => {
                    this.validateField(field);
                });
                
                field.addEventListener('input', () => {
                    this.clearFieldError(field);
                });
            }
        });

        // Keyboard shortcuts
        this.form.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 'Enter') {
                e.preventDefault();
                this.handleSubmit();
            }
        });
    }

    setupValidation() {
        // Add validation attributes
        if (this.fields.name) {
            this.fields.name.setAttribute('minlength', '2');
            this.fields.name.setAttribute('maxlength', '100');
        }
        
        if (this.fields.phone) {
            this.fields.phone.setAttribute('pattern', '[0-9+\\s\\-\\(\\)]+');
        }
        
        if (this.fields.email) {
            this.fields.email.setAttribute('type', 'email');
        }
        
        if (this.fields.message) {
            this.fields.message.setAttribute('minlength', '10');
            this.fields.message.setAttribute('maxlength', '1000');
        }
    }

    validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';

        // Check if required field is empty
        if (field.hasAttribute('required') && !value) {
            isValid = false;
            errorMessage = 'Dieses Feld ist erforderlich.';
        }

        // Field-specific validation
        if (isValid && value) {
            switch (field.type) {
                case 'email':
                    if (!this.isValidEmail(value)) {
                        isValid = false;
                        errorMessage = 'Bitte geben Sie eine gültige E-Mail-Adresse ein.';
                    }
                    break;
                case 'tel':
                    if (!this.isValidPhone(value)) {
                        isValid = false;
                        errorMessage = 'Bitte geben Sie eine gültige Telefonnummer ein.';
                    }
                    break;
                default:
                    if (field.hasAttribute('minlength') && value.length < field.getAttribute('minlength')) {
                        isValid = false;
                        errorMessage = `Mindestens ${field.getAttribute('minlength')} Zeichen erforderlich.`;
                    }
                    break;
            }
        }

        if (!isValid) {
            this.showFieldError(field, errorMessage);
        } else {
            this.clearFieldError(field);
        }

        return isValid;
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    isValidPhone(phone) {
        const phoneRegex = /^[\+]?[0-9\s\-\(\)]{8,}$/;
        return phoneRegex.test(phone);
    }

    showFieldError(field, message) {
        this.clearFieldError(field);
        
        field.classList.add('error');
        
        const errorElement = document.createElement('div');
        errorElement.className = 'field-error';
        errorElement.textContent = message;
        errorElement.setAttribute('role', 'alert');
        
        field.parentNode.appendChild(errorElement);
    }

    clearFieldError(field) {
        field.classList.remove('error');
        
        const existingError = field.parentNode.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }
    }

    validateForm() {
        let isValid = true;
        
        Object.values(this.fields).forEach(field => {
            if (field && !this.validateField(field)) {
                isValid = false;
            }
        });
        
        return isValid;
    }

    async handleSubmit() {
        if (this.isSubmitting) {
            return;
        }

        if (!this.validateForm()) {
            this.showFormError('Bitte korrigieren Sie die markierten Felder.');
            return;
        }

        this.isSubmitting = true;
        this.showLoadingState();

        try {
            // Simulate form submission (replace with actual API call)
            await this.submitForm();
            this.showSuccessMessage();
            this.resetForm();
        } catch (error) {
            console.error('Form submission error:', error);
            this.showFormError('Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.');
        } finally {
            this.isSubmitting = false;
            this.hideLoadingState();
        }
    }

    async submitForm() {
        // Simulate API call
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Simulate 90% success rate
                if (Math.random() > 0.1) {
                    resolve();
                } else {
                    reject(new Error('Network error'));
                }
            }, 1500);
        });
    }

    showLoadingState() {
        const submitBtn = this.form.querySelector('button[type="submit"]');
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin" aria-hidden="true"></i><span>Wird gesendet...</span>';
        }
    }

    hideLoadingState() {
        const submitBtn = this.form.querySelector('button[type="submit"]');
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fas fa-paper-plane" aria-hidden="true"></i><span>Nachricht senden</span>';
        }
    }

    showSuccessMessage() {
        this.showFormMessage('Vielen Dank für Ihre Nachricht! Ich werde mich schnellstmöglich bei Ihnen melden.', 'success');
    }

    showFormError(message) {
        this.showFormMessage(message, 'error');
    }

    showFormMessage(message, type) {
        // Remove existing messages
        this.clearFormMessages();
        
        const messageElement = document.createElement('div');
        messageElement.className = `form-message form-message--${type}`;
        messageElement.setAttribute('role', 'alert');
        messageElement.textContent = message;
        
        this.form.insertBefore(messageElement, this.form.firstChild);
        
        // Auto-remove success messages after 5 seconds
        if (type === 'success') {
            setTimeout(() => {
                if (messageElement.parentNode) {
                    messageElement.remove();
                }
            }, 5000);
        }
    }

    clearFormMessages() {
        const existingMessages = this.form.querySelectorAll('.form-message');
        existingMessages.forEach(message => message.remove());
    }

    resetForm() {
        this.form.reset();
        Object.values(this.fields).forEach(field => {
            if (field) {
                this.clearFieldError(field);
            }
        });
    }

    // Public method to programmatically submit form
    submit() {
        this.handleSubmit();
    }

    // Public method to reset form
    reset() {
        this.resetForm();
    }
}

/**
 * Scroll Spy Module
 * Highlights active navigation items based on scroll position
 */
class ScrollSpy {
    constructor() {
        this.sections = [];
        this.navLinks = [];
        this.activeSection = '';
        this.scrollOffset = 100;
        this.isScrolling = false;
        
        this.init();
    }

    init() {
        this.findElements();
        this.bindEvents();
        this.updateActiveSection();
    }

    findElements() {
        // Find all sections with IDs
        this.sections = Array.from(document.querySelectorAll('section[id]'));
        
        // Find all navigation links
        this.navLinks = Array.from(document.querySelectorAll('.nav-link, .mobile-menu-item'));
    }

    bindEvents() {
        // Throttled scroll event
        let ticking = false;
        
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    this.updateActiveSection();
                    ticking = false;
                });
                ticking = true;
            }
        });

        // Update on resize
        window.addEventListener('resize', () => {
            this.updateActiveSection();
        });

        // Update on orientation change
        window.addEventListener('orientationchange', () => {
            setTimeout(() => {
                this.updateActiveSection();
            }, 100);
        });
    }

    updateActiveSection() {
        const scrollPosition = window.pageYOffset + this.scrollOffset;
        let newActiveSection = '';

        // Find the current active section
        this.sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (scrollPosition >= sectionTop && 
                scrollPosition < sectionTop + sectionHeight) {
                newActiveSection = section.getAttribute('id');
            }
        });

        // Update active section if it changed
        if (newActiveSection !== this.activeSection) {
            this.setActiveSection(newActiveSection);
        }
    }

    setActiveSection(sectionId) {
        // Remove active class from all links
        this.navLinks.forEach(link => {
            link.classList.remove('text-blue-600');
            link.classList.remove('active');
        });

        // Add active class to current section's link
        if (sectionId) {
            const activeLink = this.navLinks.find(link => {
                const href = link.getAttribute('href');
                return href === `#${sectionId}`;
            });

            if (activeLink) {
                activeLink.classList.add('text-blue-600');
                activeLink.classList.add('active');
            }
        }

        this.activeSection = sectionId;

        // Dispatch custom event for other modules
        window.dispatchEvent(new CustomEvent('scrollspy:changed', {
            detail: { activeSection: sectionId }
        }));
    }

    // Public method to get current active section
    getActiveSection() {
        return this.activeSection;
    }

    // Public method to manually set active section
    setActive(sectionId) {
        this.setActiveSection(sectionId);
    }

    // Public method to update scroll offset
    updateScrollOffset(offset) {
        this.scrollOffset = offset;
        this.updateActiveSection();
    }

    // Public method to refresh sections (useful if DOM changes)
    refresh() {
        this.findElements();
        this.updateActiveSection();
    }
}

/**
 * Theme Manager Module
 * Handles theme switching and user preferences
 */
class ThemeManager {
    constructor() {
        this.currentTheme = 'default';
        this.availableThemes = ['default'];
        this.themeToggle = null;
        
        this.init();
    }

    init() {
        this.loadUserPreference();
        this.bindEvents();
        this.applyTheme();
    }

    loadUserPreference() {
        // Load theme from localStorage
        const savedTheme = localStorage.getItem('eva-theme');
        if (savedTheme && this.availableThemes.includes(savedTheme)) {
            this.currentTheme = savedTheme;
        } else {
            this.currentTheme = 'default';
        }
    }

    bindEvents() {
        // Listen for custom theme change events
        window.addEventListener('theme:change', (e) => {
            if (e.detail && e.detail.theme) {
                this.setTheme(e.detail.theme);
            }
        });
    }

    setTheme(theme) {
        if (!this.availableThemes.includes(theme)) {
            console.warn(`Theme "${theme}" is not available`);
            return;
        }

        this.currentTheme = theme;
        localStorage.setItem('eva-theme', theme);
        this.applyTheme();
        
        // Dispatch custom event
        window.dispatchEvent(new CustomEvent('theme:changed', {
            detail: { theme: theme }
        }));
    }

    applyTheme() {
        const body = document.body;
        
        // Remove all theme classes
        this.availableThemes.forEach(theme => {
            body.classList.remove(`theme-${theme}`);
        });
        
        // Add current theme class
        body.classList.add(`theme-${this.currentTheme}`);
        body.setAttribute('data-theme', this.currentTheme);
        
        // Apply theme-specific styles
        this.applyThemeStyles();
    }

    applyThemeStyles() {
        // Apply theme-specific CSS variables
        const root = document.documentElement;
        
        switch (this.currentTheme) {
            default:
                // Reset to default values
                root.style.removeProperty('--bg-primary');
                root.style.removeProperty('--text-primary');
                root.style.removeProperty('--text-secondary');
                break;
        }
    }

    // Public method to get current theme
    getCurrentTheme() {
        return this.currentTheme;
    }

    // Public method to check if theme is available
    isThemeAvailable(theme) {
        return this.availableThemes.includes(theme);
    }

    // Public method to get available themes
    getAvailableThemes() {
        return [...this.availableThemes];
    }

    // Public method to add custom theme
    addTheme(themeName) {
        if (!this.availableThemes.includes(themeName)) {
            this.availableThemes.push(themeName);
        }
    }

    // Public method to remove theme
    removeTheme(themeName) {
        const index = this.availableThemes.indexOf(themeName);
        if (index > -1 && themeName !== 'default') {
            this.availableThemes.splice(index, 1);
            
            // If current theme was removed, switch to default
            if (this.currentTheme === themeName) {
                this.setTheme('default');
            }
        }
    }
}

/**
 * Main Application
 * Initializes all components and manages the overall application state
 */
class App {
    constructor() {
        this.modules = {};
        this.init();
    }

    init() {
        // Initialize all modules
        this.modules.navigation = new Navigation();
        this.modules.smoothScrolling = new SmoothScrolling();
        this.modules.flipCards = new FlipCards();
        this.modules.contactForm = new ContactForm();
        this.modules.scrollSpy = new ScrollSpy();
        this.modules.themeManager = new ThemeManager();

        // Log successful initialization
        console.log('🚀 Eva Sagmeister Logopädie Website initialized successfully');
        
        // Dispatch custom event for other modules that might need to know when app is ready
        window.dispatchEvent(new CustomEvent('app:ready'));
    }

    // Public method to access modules if needed
    getModule(name) {
        return this.modules[name];
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new App();
});