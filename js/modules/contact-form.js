/**
 * Contact Form Module
 * Handles form validation, submission, and user feedback
 */

export class ContactForm {
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