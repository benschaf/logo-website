/**
 * Main Application Module
 * Initializes all components and manages the overall application state
 */

import { Navigation } from './modules/navigation.js';
import { SmoothScrolling } from './modules/smooth-scrolling.js';
import { FlipCards } from './modules/flip-cards.js';
import { ContactForm } from './modules/contact-form.js';
import { ScrollSpy } from './modules/scroll-spy.js';
import { ThemeManager } from './modules/theme-manager.js';

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

// Export for potential use in other modules
export default App; 