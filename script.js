/**
 * Eva Sagmeister Logopädie Website
 * Enhanced JavaScript with expandable service sections
 */

/**
 * Service Expansion Module
 * Handles expandable children and adult service sections
 */
class ServiceExpansion {
  constructor() {
    this.init();
  }

  init() {
    // Wait a bit to ensure DOM is fully loaded
    setTimeout(() => {
      this.setupElements();
    }, 100);
  }

  setupElements() {
    const childrenToggle = document.getElementById("children-toggle");
    const childrenServices = document.getElementById("children-services");
    const childrenChevron = document.getElementById("children-chevron");
    
    const adultsToggle = document.getElementById("adults-toggle");
    const adultsServices = document.getElementById("adults-services");
    const adultsChevron = document.getElementById("adults-chevron");

    console.log('Service elements found:', {
      childrenToggle: !!childrenToggle,
      childrenServices: !!childrenServices,
      adultsToggle: !!adultsToggle,
      adultsServices: !!adultsServices
    });

    if (childrenToggle && childrenServices && childrenChevron) {
      childrenToggle.addEventListener("click", (e) => {
        e.preventDefault();
        this.toggleSection(childrenServices, childrenToggle, childrenChevron, "children");
      });
    }

    if (adultsToggle && adultsServices && adultsChevron) {
      adultsToggle.addEventListener("click", (e) => {
        e.preventDefault();
        this.toggleSection(adultsServices, adultsToggle, adultsChevron, "adults");
      });
    }
  }

  toggleSection(serviceElement, toggleButton, chevronElement, sectionType) {
    const isHidden = serviceElement.classList.contains("hidden");
    console.log(`Toggling ${sectionType} section. Currently hidden:`, isHidden);
    
    if (isHidden) {
      // Show the section
      serviceElement.classList.remove("hidden");
      chevronElement.style.transform = "rotate(180deg)";
      toggleButton.setAttribute("aria-expanded", "true");
      toggleButton.querySelector("span").textContent = "Behandlungsbereiche ausblenden";
      
      // Smooth scroll into view
      setTimeout(() => {
        serviceElement.scrollIntoView({ 
          behavior: "smooth", 
          block: "nearest" 
        });
      }, 100);
    } else {
      // Hide the section
      serviceElement.classList.add("hidden");
      chevronElement.style.transform = "rotate(0deg)";
      toggleButton.setAttribute("aria-expanded", "false");
      toggleButton.querySelector("span").textContent = "Alle Behandlungsbereiche anzeigen";
    }
  }
}

/**
 * Navigation Module
 * Handles mobile menu functionality and navigation state
 */
class Navigation {
  constructor() {
    this.mobileMenuBtn = document.getElementById("mobile-menu-btn");
    this.mobileMenu = document.getElementById("mobile-menu");
    this.isMenuOpen = false;

    this.init();
  }

  init() {
    if (!this.mobileMenuBtn || !this.mobileMenu) {
      console.warn("Navigation elements not found");
      return;
    }

    this.bindEvents();
    this.setupAccessibility();
  }

  bindEvents() {
    // Mobile menu toggle
    this.mobileMenuBtn.addEventListener("click", () => {
      this.toggleMobileMenu();
    });

    // Close menu when clicking outside
    document.addEventListener("click", (e) => {
      if (
        this.isMenuOpen &&
        !this.mobileMenu.contains(e.target) &&
        !this.mobileMenuBtn.contains(e.target)
      ) {
        this.closeMobileMenu();
      }
    });

    // Close menu on escape key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && this.isMenuOpen) {
        this.closeMobileMenu();
      }
    });

    // Close mobile menu when clicking on menu items
    const mobileMenuItems =
      this.mobileMenu.querySelectorAll(".mobile-menu-item");
    mobileMenuItems.forEach((item) => {
      item.addEventListener("click", () => {
        this.closeMobileMenu();
      });
    });
  }

  setupAccessibility() {
    // Ensure proper ARIA attributes
    this.mobileMenuBtn.setAttribute("aria-expanded", "false");
    this.mobileMenuBtn.setAttribute("aria-controls", "mobile-menu");
  }

  toggleMobileMenu() {
    if (this.isMenuOpen) {
      this.closeMobileMenu();
    } else {
      this.openMobileMenu();
    }
  }

  openMobileMenu() {
    this.mobileMenu.classList.remove("hidden");
    this.mobileMenuBtn.setAttribute("aria-expanded", "true");
    this.isMenuOpen = true;

    // Focus management
    const firstMenuItem = this.mobileMenu.querySelector(".mobile-menu-item");
    if (firstMenuItem) {
      firstMenuItem.focus();
    }
  }

  closeMobileMenu() {
    this.mobileMenu.classList.add("hidden");
    this.mobileMenuBtn.setAttribute("aria-expanded", "false");
    this.isMenuOpen = false;

    // Return focus to menu button
    this.mobileMenuBtn.focus();
  }
}

/**
 * Flip Cards Module
 * Handles interactive service cards with flip animations
 * Simplified: Multiple cards can be flipped at the same time
 */
class FlipCards {
  constructor() {
    this.cards = [];

    this.init();
  }

  init() {
    this.findCards();
    this.bindEvents();
    this.setupAccessibility();
  }

  findCards() {
    const cardElements = document.querySelectorAll(".flip-card");
    this.cards = Array.from(cardElements);
  }

  bindEvents() {
    this.cards.forEach((card) => {
      // Click to flip
      card.addEventListener("click", (e) => {
        this.toggleCard(card);
      });

      // Keyboard support
      card.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          this.toggleCard(card);
        }
      });
    });

    // Close all cards when clicking outside any card
    document.addEventListener("click", (e) => {
      const clickedCard = e.target.closest(".flip-card");
      if (!clickedCard) {
        // Clicked outside all cards, close any that are open
        this.cards.forEach((card) => {
          if (card.classList.contains("flipped")) {
            this.unflipCard(card);
          }
        });
      }
    });

    // Close all cards on escape key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        this.cards.forEach((card) => {
          if (card.classList.contains("flipped")) {
            this.unflipCard(card);
          }
        });
      }
    });
  }

  setupAccessibility() {
    this.cards.forEach((card) => {
      // Make cards focusable
      card.setAttribute("tabindex", "0");
      card.setAttribute("role", "button");
      card.setAttribute("aria-pressed", "false");

      // Add ARIA labels
      const serviceType = card.dataset.service;
      if (serviceType) {
        card.setAttribute(
          "aria-label",
          `Mehr Informationen über ${serviceType}`
        );
      }
    });
  }

  toggleCard(card) {
    if (card.classList.contains("flipped")) {
      this.unflipCard(card);
    } else {
      this.flipCard(card);
    }
  }

  flipCard(card) {
    // Simply flip the clicked card (no closing others)
    card.classList.add("flipped");
    card.setAttribute("aria-pressed", "true");

    // Announce to screen readers
    this.announceFlip(card, true);
  }

  unflipCard(card) {
    card.classList.remove("flipped");
    card.setAttribute("aria-pressed", "false");

    // Announce to screen readers
    this.announceFlip(card, false);
  }

  announceFlip(card, isFlipped) {
    const serviceType = card.dataset.service;
    const message = isFlipped
      ? `Detaillierte Informationen zu ${serviceType} werden angezeigt`
      : `Zurück zur Übersicht von ${serviceType}`;

    // Create temporary announcement element
    const announcement = document.createElement("div");
    announcement.setAttribute("aria-live", "polite");
    announcement.setAttribute("aria-atomic", "true");
    announcement.style.position = "absolute";
    announcement.style.left = "-10000px";
    announcement.style.width = "1px";
    announcement.style.height = "1px";
    announcement.style.overflow = "hidden";
    announcement.textContent = message;

    document.body.appendChild(announcement);

    // Remove after announcement
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  }
}

/**
 * Contact Form Module
 * Handles form validation, submission, and user feedback
 */
class ContactForm {
  constructor() {
    this.form = document.getElementById("contact-form");
    this.fields = {};
    this.isSubmitting = false;

    this.init();
  }

  init() {
    if (!this.form) {
      console.warn("Contact form not found");
      return;
    }

    this.findFields();
    this.bindEvents();
    this.setupValidation();
  }

  findFields() {
    this.fields = {
      name: this.form.querySelector("#name"),
      phone: this.form.querySelector("#phone"),
      email: this.form.querySelector("#email"),
      message: this.form.querySelector("#message"),
    };
  }

  bindEvents() {
    // Form submission
    this.form.addEventListener("submit", (e) => {
      e.preventDefault();
      this.handleSubmit();
    });

    // Real-time validation
    Object.values(this.fields).forEach((field) => {
      if (field) {
        field.addEventListener("blur", () => {
          this.validateField(field);
        });

        field.addEventListener("input", () => {
          this.clearFieldError(field);
        });
      }
    });

    // Keyboard shortcuts
    this.form.addEventListener("keydown", (e) => {
      if (e.ctrlKey && e.key === "Enter") {
        e.preventDefault();
        this.handleSubmit();
      }
    });
  }

  setupValidation() {
    // Add validation attributes
    if (this.fields.name) {
      this.fields.name.setAttribute("minlength", "2");
      this.fields.name.setAttribute("maxlength", "100");
    }

    if (this.fields.phone) {
      this.fields.phone.setAttribute("pattern", "[0-9+\\s\\-\\(\\)]+");
    }

    if (this.fields.email) {
      this.fields.email.setAttribute("type", "email");
    }

    if (this.fields.message) {
      this.fields.message.setAttribute("minlength", "10");
      this.fields.message.setAttribute("maxlength", "1000");
    }
  }

  validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = "";

    // Check if required field is empty
    if (field.hasAttribute("required") && !value) {
      isValid = false;
      errorMessage = "Dieses Feld ist erforderlich.";
    }

    // Field-specific validation
    if (isValid && value) {
      switch (field.type) {
        case "email":
          if (!this.isValidEmail(value)) {
            isValid = false;
            errorMessage = "Bitte geben Sie eine gültige E-Mail-Adresse ein.";
          }
          break;
        case "tel":
          if (!this.isValidPhone(value)) {
            isValid = false;
            errorMessage = "Bitte geben Sie eine gültige Telefonnummer ein.";
          }
          break;
        default:
          if (
            field.hasAttribute("minlength") &&
            value.length < field.getAttribute("minlength")
          ) {
            isValid = false;
            errorMessage = `Mindestens ${field.getAttribute(
              "minlength"
            )} Zeichen erforderlich.`;
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

    field.classList.add("error");

    const errorElement = document.createElement("div");
    errorElement.className = "field-error";
    errorElement.textContent = message;
    errorElement.setAttribute("role", "alert");

    field.parentNode.appendChild(errorElement);
  }

  clearFieldError(field) {
    field.classList.remove("error");

    const existingError = field.parentNode.querySelector(".field-error");
    if (existingError) {
      existingError.remove();
    }
  }

  validateForm() {
    let isValid = true;

    Object.values(this.fields).forEach((field) => {
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
      this.showFormError("Bitte korrigieren Sie die markierten Felder.");
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
      console.error("Form submission error:", error);
      this.showFormError(
        "Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut."
      );
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
          reject(new Error("Network error"));
        }
      }, 1500);
    });
  }

  showLoadingState() {
    const submitBtn = this.form.querySelector('button[type="submit"]');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML =
        '<i class="fas fa-spinner fa-spin" aria-hidden="true"></i><span>Wird gesendet...</span>';
    }
  }

  hideLoadingState() {
    const submitBtn = this.form.querySelector('button[type="submit"]');
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerHTML =
        '<i class="fas fa-paper-plane" aria-hidden="true"></i><span>Nachricht senden</span>';
    }
  }

  showSuccessMessage() {
    this.showFormMessage(
      "Vielen Dank für Ihre Nachricht! Ich werde mich schnellstmöglich bei Ihnen melden.",
      "success"
    );
  }

  showFormError(message) {
    this.showFormMessage(message, "error");
  }

  showFormMessage(message, type) {
    // Remove existing messages
    this.clearFormMessages();

    const messageElement = document.createElement("div");
    messageElement.className = `form-message form-message--${type}`;
    messageElement.setAttribute("role", "alert");
    messageElement.textContent = message;

    this.form.insertBefore(messageElement, this.form.firstChild);

    // Auto-remove success messages after 5 seconds
    if (type === "success") {
      setTimeout(() => {
        if (messageElement.parentNode) {
          messageElement.remove();
        }
      }, 5000);
    }
  }

  clearFormMessages() {
    const existingMessages = this.form.querySelectorAll(".form-message");
    existingMessages.forEach((message) => message.remove());
  }

  resetForm() {
    this.form.reset();
    Object.values(this.fields).forEach((field) => {
      if (field) {
        this.clearFieldError(field);
      }
    });
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
    this.activeSection = "";
    this.scrollOffset = 100;

    this.init();
  }

  init() {
    this.findElements();
    this.bindEvents();
    this.updateActiveSection();
  }

  findElements() {
    // Find all sections with IDs
    this.sections = Array.from(document.querySelectorAll("section[id]"));

    // Find all navigation links
    this.navLinks = Array.from(
      document.querySelectorAll(".nav-link, .mobile-menu-item")
    );
  }

  bindEvents() {
    // Throttled scroll event
    let ticking = false;

    window.addEventListener("scroll", () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          this.updateActiveSection();
          ticking = false;
        });
        ticking = true;
      }
    });

    // Update on resize
    window.addEventListener("resize", () => {
      this.updateActiveSection();
    });

    // Update on orientation change
    window.addEventListener("orientationchange", () => {
      setTimeout(() => {
        this.updateActiveSection();
      }, 100);
    });
  }

  updateActiveSection() {
    const scrollPosition = window.pageYOffset + this.scrollOffset;
    let newActiveSection = "";

    // Find the current active section
    this.sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;

      if (
        scrollPosition >= sectionTop &&
        scrollPosition < sectionTop + sectionHeight
      ) {
        newActiveSection = section.getAttribute("id");
      }
    });

    // Update active section if it changed
    if (newActiveSection !== this.activeSection) {
      this.setActiveSection(newActiveSection);
    }
  }

  setActiveSection(sectionId) {
    // Remove active class from all links
    this.navLinks.forEach((link) => {
      link.classList.remove("text-blue-600");
      link.classList.remove("active");
    });

    // Add active class to current section's link
    if (sectionId) {
      const activeLink = this.navLinks.find((link) => {
        const href = link.getAttribute("href");
        return href === `#${sectionId}`;
      });

      if (activeLink) {
        activeLink.classList.add("text-blue-600");
        activeLink.classList.add("active");
      }
    }

    this.activeSection = sectionId;
  }
}

/**
 * Header Transparency Module
 * Handles transparent header when at top, solid when scrolling
 */
class HeaderTransparency {
  constructor() {
    this.header = document.querySelector("nav.nav-dark");
    this.mobileMenuBtn = document.getElementById("mobile-menu-btn");
    this.scrollThreshold = 10; // Pixels to scroll before becoming solid
    this.isTransparent = false;

    this.init();
  }

  init() {
    if (!this.header) {
      console.warn("Header element not found");
      return;
    }

    this.bindEvents();
    this.updateHeaderState(); // Set initial state
  }

  bindEvents() {
    // Throttled scroll event for performance
    let ticking = false;

    window.addEventListener("scroll", () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          this.updateHeaderState();
          ticking = false;
        });
        ticking = true;
      }
    });

    this.mobileMenuBtn.addEventListener("click", () => {
      this.updateHeaderState();
    });

    // Update on resize and orientation change
    window.addEventListener("resize", () => {
      this.updateHeaderState();
    });

    window.addEventListener("orientationchange", () => {
      setTimeout(() => {
        this.updateHeaderState();
      }, 100);
    });
  }

  updateHeaderState() {
    const scrollPosition =
      window.pageYOffset || document.documentElement.scrollTop;
    const shouldBeTransparent = scrollPosition <= this.scrollThreshold;
    const isMobileMenuExpanded =
      this.mobileMenuBtn.getAttribute("aria-expanded");

    if (shouldBeTransparent && !this.isTransparent) {
      this.makeTransparent();
    } else if (
      (!shouldBeTransparent && this.isTransparent) ||
      isMobileMenuExpanded
    ) {
      this.makeSolid();
    }
  }

  makeTransparent() {
    this.header.classList.remove("nav-solid");
    this.header.classList.add("nav-transparent");
    this.isTransparent = true;
  }

  makeSolid() {
    this.header.classList.remove("nav-transparent");
    this.header.classList.add("nav-solid");
    this.isTransparent = false;
  }
}

// Initialize the application when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  // Initialize all modules
  const navigation = new Navigation();
  const serviceExpansion = new ServiceExpansion();
  const flipCards = new FlipCards();
  const contactForm = new ContactForm();
  const scrollSpy = new ScrollSpy();
  const headerTransparency = new HeaderTransparency();

  // Log successful initialization
  console.log(
    "🚀 Eva Sagmeister Logopädie Website (enhanced) initialized successfully"
  );
});
