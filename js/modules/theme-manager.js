/**
 * Theme Manager Module
 * Handles theme switching and user preferences
 */

export class ThemeManager {
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