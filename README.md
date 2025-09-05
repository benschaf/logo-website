# Eva Sagmeister Logopädie Website

A modern, accessible, and maintainable website for Eva Sagmeister's speech therapy practice.

## 🚀 Technical Improvements

### Code Structure & Maintainability

#### Modular JavaScript Architecture
- **ES6 Modules**: Organized code into reusable modules
- **Separation of Concerns**: Each module handles specific functionality
- **Event-Driven Architecture**: Custom events for inter-module communication
- **Error Handling**: Comprehensive error handling and logging

#### Module Structure
```
js/
├── app.js                 # Main application entry point
└── modules/
    ├── navigation.js      # Mobile menu and navigation state
    ├── smooth-scrolling.js # Smooth scroll functionality
    ├── flip-cards.js      # Interactive service cards
    ├── contact-form.js    # Form validation and submission
    ├── scroll-spy.js      # Active navigation highlighting
    └── theme-manager.js   # Theme preferences (simplified)
```

### Accessibility Improvements

#### ARIA Support
- Proper ARIA labels and roles throughout
- Screen reader announcements for interactive elements
- Keyboard navigation support
- Focus management for mobile menu

#### Semantic HTML
- Proper heading hierarchy
- Semantic elements (`main`, `nav`, `section`, `address`)
- Form labels and validation messages
- Alt text for all images

### Enhanced User Experience

#### Form Validation
- Real-time field validation
- Custom error messages in German
- Loading states and success feedback
- Keyboard shortcuts (Ctrl+Enter to submit)

#### Interactive Elements
- Smooth animations with easing functions
- Hover effects and micro-interactions
- Responsive design across all devices

### CSS Architecture

#### CSS Custom Properties
- Centralized design tokens
- Consistent spacing and typography
- Easy customization and maintenance

#### Organized Structure
```css
/* Sections */
- Base Styles
- Navigation Styles  
- Hero Section Styles
- Button Styles
- Flip Card Styles
- Form Styles
- Interactive Elements
- Animations
- Utility Classes
- Responsive Design
- Print Styles
```

## 🛠️ Development

### Prerequisites
- Modern web browser with ES6 support
- Local development server (for module loading)

### Setup
1. Clone the repository
2. Serve files using a local server:
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js
   npx serve .
   
   # Using PHP
   php -S localhost:8000
   ```
3. Open `http://localhost:8000` in your browser

### File Structure
```
website-eva/
├── index.html          # Main HTML file
├── styles.css          # All CSS styles
├── js/
│   ├── app.js         # Main application
│   └── modules/       # JavaScript modules
├── README.md          # This file
└── script.js          # Legacy script (can be removed)
```

## 📱 Features

### Core Functionality
- **Responsive Navigation**: Mobile-friendly menu with smooth transitions
- **Smooth Scrolling**: Animated navigation between sections
- **Interactive Service Cards**: Flip animations with detailed information
- **Contact Form**: Validation, submission handling, and user feedback
- **Scroll Spy**: Active navigation highlighting

### Technical Features
- **Modular JavaScript**: ES6 modules with clear separation of concerns
- **Accessibility**: WCAG 2.1 AA compliance
- **Performance**: Optimized animations and event handling
- **Cross-browser**: Modern browser support with graceful degradation
- **SEO-friendly**: Semantic HTML and meta tags

## 🎨 Customization

### Adding New Sections
1. Add HTML section with proper ID and ARIA labels
2. Update navigation links
3. Add any custom styles to `styles.css`

### Adding New Modules
1. Create new module in `js/modules/`
2. Export class with `init()` method
3. Import and initialize in `js/app.js`

### Color Customization
```css
:root {
    --primary: #F8BBD9;      /* Change primary color */
    --secondary: #B2DFDB;    /* Change secondary color */
    --accent: #FFF9C4;       /* Change accent color */
}
```

## 🔧 Maintenance

### Code Organization
- **HTML**: Semantic structure with accessibility attributes
- **CSS**: Modular organization with CSS custom properties
- **JavaScript**: ES6 modules with clear interfaces

### Best Practices
- Use CSS custom properties for consistent styling
- Follow accessibility guidelines (WCAG 2.1)
- Implement proper error handling
- Add meaningful comments and documentation
- Test across different browsers and devices

### Performance Tips
- Use `requestAnimationFrame` for smooth animations
- Throttle scroll events
- Optimize images and assets
- Minimize DOM queries with caching

### Security
- External links hardened with `rel="noopener noreferrer"`
- Automated security validation and fixing tools included

## 🔒 Security Features

### External Links Hardening
All external links with `target="_blank"` are automatically secured with `rel="noopener noreferrer"` to prevent:
- **Reverse tabnabbing attacks**: New pages cannot access `window.opener`
- **Privacy leaks**: New pages cannot access the referring URL

### Security Validation Tools

#### Quick Security Check
```bash
# Check all HTML files for security issues
npm run check-security

# Automatically fix any security issues found
npm run fix-security

# Show help and security details
npm run security-help
```

#### Manual Tool Usage
```bash
# Check specific files
node check-external-links.js index.html datenschutz.html

# Check and fix all HTML files
node check-external-links.js --fix

# Check specific file and fix issues
node check-external-links.js --fix index.html
```

#### Integration with CI/CD
The security checker returns appropriate exit codes for automation:
- `0`: All links are secure
- `1`: Security issues found (when not using --fix)

Example GitHub Actions integration:
```yaml
- name: Check external links security
  run: npm run check-security
```

## 🐛 Troubleshooting

### Common Issues
1. **Modules not loading**: Ensure using a local server (not file://)
2. **Styles not applying**: Check CSS custom properties support
3. **Form not working**: Verify JavaScript modules are loaded
4. **Mobile menu issues**: Check for conflicting CSS

### Debug Mode
Add to browser console for debugging:
```javascript
// Access app instance
console.log(window.app);

// Check module status
console.log(window.app.getModule('navigation'));
```

## 📄 License

This project is for Eva Sagmeister's speech therapy practice. All rights reserved.

## 🤝 Contributing

For development improvements:
1. Follow the existing code structure
2. Add proper documentation
3. Test accessibility features
4. Ensure cross-browser compatibility
5. Update this README if needed

---

**Built with ❤️ for accessible and maintainable web development** 