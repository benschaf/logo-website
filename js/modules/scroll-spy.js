/**
 * Scroll Spy Module
 * Highlights active navigation items based on scroll position
 */

export class ScrollSpy {
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