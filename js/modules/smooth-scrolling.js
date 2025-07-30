/**
 * Smooth Scrolling Module
 * Handles smooth scrolling for navigation links and anchor links
 */

export class SmoothScrolling {
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