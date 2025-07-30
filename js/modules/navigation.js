/**
 * Navigation Module
 * Handles mobile menu functionality and navigation state
 */

export class Navigation {
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