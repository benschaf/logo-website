/**
 * Flip Cards Module
 * Handles interactive service cards with flip animations
 */

export class FlipCards {
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