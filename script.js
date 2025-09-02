// Academic Portfolio - Interactive Horizontal Scrolling
class AcademicPortfolio {
    constructor() {
        this.currentSection = 0;
        this.totalSections = 6;
        this.isTransitioning = false;
        this.container = document.querySelector('.horizontal-container');
        this.navButtons = document.querySelectorAll('.nav-btn');
        this.progressBar = document.querySelector('.progress-bar::after') || document.querySelector('.progress-bar');
        this.sectionNumber = document.querySelector('.section-number');
        this.scrollLeftBtn = document.getElementById('scrollLeft');
        this.scrollRightBtn = document.getElementById('scrollRight');
        
        this.init();
    }

    init() {
        this.setupNavigation();
        this.setupScrollButtons();
        this.setupKeyboardNavigation();
        this.setupMouseWheel();
        this.setupTouchNavigation();
        this.setupProgressTracking();
        this.updateUI();
        this.addAnimationObserver();
        this.loadBlogPosts();
        
        // Initial animation
        this.animateCurrentSection();
    }

    setupNavigation() {
        this.navButtons.forEach((btn, index) => {
            btn.addEventListener('click', () => {
                if (window.innerWidth <= 968) {
                    // Mobile: scroll to section directly
                    const targetPanel = document.getElementById(this.getSectionId(index));
                    if (targetPanel) {
                        targetPanel.scrollIntoView({ 
                            behavior: 'smooth',
                            block: 'start'
                        });
                        this.currentSection = index;
                        this.updateUI();
                    }
                } else {
                    // Desktop: use horizontal scrolling
                    this.goToSection(index);
                }
            });
        });
    }

    setupScrollButtons() {
        this.scrollLeftBtn?.addEventListener('click', () => {
            this.previousSection();
        });
        
        this.scrollRightBtn?.addEventListener('click', () => {
            this.nextSection();
        });
    }

    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            // Only enable keyboard navigation on desktop
            if (window.innerWidth <= 968) return;
            
            if (this.isTransitioning) return;
            
            switch (e.key) {
                case 'ArrowLeft':
                case 'ArrowUp':
                    e.preventDefault();
                    this.previousSection();
                    break;
                case 'ArrowRight':
                case 'ArrowDown':
                case ' ':
                    e.preventDefault();
                    this.nextSection();
                    break;
                case 'Home':
                    e.preventDefault();
                    this.goToSection(0);
                    break;
                case 'End':
                    e.preventDefault();
                    this.goToSection(this.totalSections - 1);
                    break;
            }
        });
    }

    setupMouseWheel() {
        let wheelAccumulator = 0;
        let wheelTimeout;
        const threshold = 100; // Lower threshold = more sensitive
        
        document.addEventListener('wheel', (e) => {
            // Disable horizontal scrolling behavior on mobile
            if (window.innerWidth <= 968) return;
            
            if (this.isTransitioning) return;
            
            e.preventDefault();
            
            // Accumulate wheel delta for more responsive scrolling
            wheelAccumulator += Math.abs(e.deltaY);
            
            clearTimeout(wheelTimeout);
            
            if (wheelAccumulator > threshold) {
                if (e.deltaY > 0) {
                    this.nextSection();
                } else if (e.deltaY < 0) {
                    this.previousSection();
                }
                wheelAccumulator = 0;
            }
            
            // Reset accumulator after inactivity
            wheelTimeout = setTimeout(() => {
                wheelAccumulator = 0;
            }, 150);
        }, { passive: false });
        
        // Add trackpad/touchpad support for horizontal scrolling (desktop only)
        document.addEventListener('wheel', (e) => {
            // Disable horizontal scrolling behavior on mobile
            if (window.innerWidth <= 968) return;
            
            if (this.isTransitioning || Math.abs(e.deltaY) > Math.abs(e.deltaX)) return;
            
            if (Math.abs(e.deltaX) > 50) {
                e.preventDefault();
                if (e.deltaX > 0) {
                    this.nextSection();
                } else {
                    this.previousSection();
                }
            }
        }, { passive: false });
    }

    setupTouchNavigation() {
        let touchStartX = 0;
        let touchStartY = 0;
        let touchEndX = 0;
        let touchEndY = 0;
        const minSwipeDistance = 50;
        
        document.addEventListener('touchstart', (e) => {
            // Only track touch on desktop for horizontal navigation
            if (window.innerWidth <= 968) return;
            
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
        }, { passive: true });
        
        document.addEventListener('touchend', (e) => {
            // Only handle touch navigation on desktop
            if (window.innerWidth <= 968) return;
            
            if (this.isTransitioning) return;
            
            touchEndX = e.changedTouches[0].clientX;
            touchEndY = e.changedTouches[0].clientY;
            
            const deltaX = touchEndX - touchStartX;
            const deltaY = touchEndY - touchStartY;
            
            // Only trigger if horizontal swipe is greater than vertical
            if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > minSwipeDistance) {
                if (deltaX > 0) {
                    this.previousSection(); // Swipe right = previous
                } else {
                    this.nextSection(); // Swipe left = next
                }
            }
        }, { passive: true });
    }

    setupProgressTracking() {
        // Create progress bar after element if it doesn't exist
        if (!document.querySelector('.progress-bar::after')) {
            const progressBar = document.querySelector('.progress-bar');
            if (progressBar) {
                progressBar.style.position = 'relative';
                progressBar.style.overflow = 'hidden';
                
                const afterElement = document.createElement('div');
                afterElement.style.position = 'absolute';
                afterElement.style.top = '0';
                afterElement.style.left = '0';
                afterElement.style.height = '100%';
                afterElement.style.width = '0%';
                afterElement.style.background = 'linear-gradient(90deg, #4f46e5, #7c3aed)';
                afterElement.style.transition = 'width 0.5s ease';
                afterElement.className = 'progress-fill';
                progressBar.appendChild(afterElement);
                
                this.progressFill = afterElement;
            }
        }
    }

    goToSection(index) {
        if (index < 0 || index >= this.totalSections || index === this.currentSection || this.isTransitioning) {
            return;
        }

        this.isTransitioning = true;
        this.currentSection = index;
        
        // Calculate transform
        const translateX = -index * 100;
        
        // Apply transform based on screen size
        if (window.innerWidth <= 968) {
            // Mobile: scroll vertically
            const targetPanel = document.getElementById(this.getSectionId(index));
            if (targetPanel) {
                targetPanel.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        } else {
            // Desktop: horizontal scroll with enhanced easing
            this.container.style.transition = 'transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            this.container.style.transform = `translateX(${translateX}vw)`;
            
            // Add parallax effect to background elements
            this.addParallaxEffect(index);
        }
        
        this.updateUI();
        this.animateCurrentSection();
        
        // Reset transition flag with slightly longer timeout for smoother feel
        setTimeout(() => {
            this.isTransitioning = false;
        }, 400); // Reduced from 800ms for more responsive feel
    }

    getSectionId(index) {
        const sections = ['home', 'research', 'tools', 'blog', 'cv', 'contact'];
        return sections[index];
    }

    nextSection() {
        if (this.currentSection < this.totalSections - 1) {
            this.goToSection(this.currentSection + 1);
        }
    }

    previousSection() {
        if (this.currentSection > 0) {
            this.goToSection(this.currentSection - 1);
        }
    }

    updateUI() {
        // Update navigation
        this.navButtons.forEach((btn, index) => {
            btn.classList.toggle('active', index === this.currentSection);
        });
        
        // Update section number
        if (this.sectionNumber) {
            this.sectionNumber.textContent = String(this.currentSection + 1).padStart(2, '0');
        }
        
        // Update progress bar
        if (this.progressFill) {
            const progress = ((this.currentSection + 1) / this.totalSections) * 100;
            this.progressFill.style.width = `${progress}%`;
        }
        
        // Update scroll buttons
        if (this.scrollLeftBtn) {
            this.scrollLeftBtn.classList.toggle('disabled', this.currentSection === 0);
        }
        if (this.scrollRightBtn) {
            this.scrollRightBtn.classList.toggle('disabled', this.currentSection === this.totalSections - 1);
        }
        
        // Update page title
        const sectionTitles = [
            'Home - Academic Portfolio',
            'Research - Academic Portfolio',
            'Assists - Academic Portfolio', 
            'Tools - Academic Portfolio',
            'Blog - Academic Portfolio',
            'CV - Academic Portfolio',
            'Contact - Academic Portfolio'
        ];
        document.title = sectionTitles[this.currentSection] || 'Academic Portfolio';
    }

    animateCurrentSection() {
        const currentPanel = document.querySelector(`#${this.getSectionId(this.currentSection)}`);
        if (!currentPanel) return;
        
        // Reset all animations
        document.querySelectorAll('.panel').forEach(panel => {
            panel.classList.remove('active');
        });
        
        // Add active class to current panel
        currentPanel.classList.add('active');
        
        // Animate elements in current section
        const animateElements = currentPanel.querySelectorAll('.research-card, .tool-card, .blog-post, .cv-item, .contact-item');
        
        animateElements.forEach((element, index) => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
            
            setTimeout(() => {
                element.style.transition = 'all 0.6s ease';
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, index * 100 + 300);
        });
    }

    addParallaxEffect(index) {
        // Add subtle parallax to floating elements
        const floatingElements = document.querySelectorAll('.element');
        floatingElements.forEach((element, i) => {
            const offset = (index * 10) + (i * 5);
            element.style.transform = `translateX(${offset}px) translateY(${Math.sin(index + i) * 10}px)`;
            element.style.transition = 'transform 0.8s ease-out';
        });
        
        // Add depth effect to sections
        const panels = document.querySelectorAll('.panel');
        panels.forEach((panel, i) => {
            if (i !== index) {
                const distance = Math.abs(i - index);
                const scale = 1 - (distance * 0.05);
                const opacity = 1 - (distance * 0.3);
                panel.style.transform = `scale(${scale})`;
                panel.style.opacity = Math.max(opacity, 0.3);
                panel.style.transition = 'transform 0.8s ease, opacity 0.8s ease';
            } else {
                panel.style.transform = 'scale(1)';
                panel.style.opacity = '1';
                panel.style.transition = 'transform 0.8s ease, opacity 0.8s ease';
            }
        });
    }

    addAnimationObserver() {
        // Intersection Observer for scroll animations
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animationPlayState = 'running';
                    // Add stagger animation effect
                    const siblings = entry.target.parentElement?.children || [];
                    Array.from(siblings).forEach((sibling, index) => {
                        if (sibling !== entry.target) {
                            sibling.style.animationDelay = `${index * 0.1}s`;
                        }
                    });
                }
            });
        }, {
            threshold: 0.1
        });

        // Observe floating elements
        document.querySelectorAll('.element').forEach(el => {
            observer.observe(el);
        });
    }
}

// Enhanced Card Interactions
class CardInteractions {
    constructor() {
        this.init();
    }

    init() {
        this.setupHoverEffects();
        this.setupClickHandlers();
    }

    setupHoverEffects() {
        // Research cards
        document.querySelectorAll('.research-card').forEach(card => {
            card.addEventListener('mouseenter', (e) => {
                this.createRippleEffect(e.target);
            });
        });

        // Tool cards
        document.querySelectorAll('.tool-card').forEach(card => {
            card.addEventListener('mouseenter', (e) => {
                this.animateToolIcon(e.target);
            });
        });

        // Blog posts
        document.querySelectorAll('.blog-post').forEach(post => {
            post.addEventListener('mouseenter', (e) => {
                this.highlightPost(e.target);
            });
        });
    }

    createRippleEffect(element) {
        const rect = element.getBoundingClientRect();
        const ripple = document.createElement('div');
        
        ripple.style.position = 'absolute';
        ripple.style.width = '4px';
        ripple.style.height = '4px';
        ripple.style.background = 'rgba(79, 70, 229, 0.6)';
        ripple.style.borderRadius = '50%';
        ripple.style.transform = 'translate(-50%, -50%) scale(0)';
        ripple.style.animation = 'ripple 0.6s ease-out';
        ripple.style.top = '20px';
        ripple.style.left = '20px';
        ripple.style.pointerEvents = 'none';
        ripple.style.zIndex = '1';
        
        element.style.position = 'relative';
        element.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }

    animateToolIcon(card) {
        const icon = card.querySelector('.tool-icon');
        if (icon) {
            icon.style.transform = 'scale(1.1) rotate(5deg)';
            icon.style.transition = 'all 0.3s ease';
            
            setTimeout(() => {
                icon.style.transform = 'scale(1) rotate(0deg)';
            }, 300);
        }
    }

    highlightPost(post) {
        const title = post.querySelector('.post-title');
        if (title) {
            title.style.color = '#4f46e5';
            title.style.transition = 'color 0.3s ease';
            
            post.addEventListener('mouseleave', () => {
                title.style.color = '';
            }, { once: true });
        }
    }

    setupClickHandlers() {
        // Smooth scroll for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });
    }
}

// Form Handler
class ContactForm {
    constructor() {
        this.form = document.querySelector('.contact-form form');
        this.init();
    }

    init() {
        if (this.form) {
            this.form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleSubmit();
            });
            
            this.setupFormValidation();
        }
    }

    setupFormValidation() {
        const inputs = this.form.querySelectorAll('input, textarea');
        
        inputs.forEach(input => {
            input.addEventListener('blur', () => {
                this.validateField(input);
            });
            
            input.addEventListener('input', () => {
                this.clearValidation(input);
            });
        });
    }

    validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        
        if (field.required && !value) {
            isValid = false;
        } else if (field.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            isValid = emailRegex.test(value);
        }
        
        if (!isValid) {
            field.style.borderColor = '#ef4444';
            field.style.background = 'rgba(239, 68, 68, 0.1)';
        } else {
            field.style.borderColor = '#22c55e';
            field.style.background = 'rgba(34, 197, 94, 0.1)';
        }
        
        return isValid;
    }

    clearValidation(field) {
        field.style.borderColor = '';
        field.style.background = '';
    }

    handleSubmit() {
        const formData = new FormData(this.form);
        const data = Object.fromEntries(formData.entries());
        
        // Validate all fields
        const fields = this.form.querySelectorAll('input, textarea');
        let isFormValid = true;
        
        fields.forEach(field => {
            if (!this.validateField(field)) {
                isFormValid = false;
            }
        });
        
        if (!isFormValid) {
            this.showMessage('Please check your input and try again.', 'error');
            return;
        }
        
        // Simulate form submission
        this.showMessage('Message sent successfully!', 'success');
        this.form.reset();
        
        // Clear validations
        fields.forEach(field => this.clearValidation(field));
    }

    showMessage(message, type) {
        const existingMessage = this.form.querySelector('.form-message');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        const messageEl = document.createElement('div');
        messageEl.className = `form-message ${type}`;
        messageEl.textContent = message;
        messageEl.style.padding = '1rem';
        messageEl.style.borderRadius = '8px';
        messageEl.style.marginTop = '1rem';
        messageEl.style.textAlign = 'center';
        messageEl.style.fontWeight = '500';
        
        if (type === 'success') {
            messageEl.style.background = 'rgba(34, 197, 94, 0.1)';
            messageEl.style.border = '1px solid rgba(34, 197, 94, 0.3)';
            messageEl.style.color = '#22c55e';
        } else {
            messageEl.style.background = 'rgba(239, 68, 68, 0.1)';
            messageEl.style.border = '1px solid rgba(239, 68, 68, 0.3)';
            messageEl.style.color = '#ef4444';
        }
        
        this.form.appendChild(messageEl);
        
        setTimeout(() => {
            messageEl.remove();
        }, 5000);
    }
}

// Responsive Handler
class ResponsiveHandler {
    constructor() {
        this.breakpoint = 968;
        this.init();
    }

    init() {
        this.handleResize();
        window.addEventListener('resize', () => {
            this.handleResize();
        });
    }

    handleResize() {
        const container = document.querySelector('.horizontal-container');
        const isMobile = window.innerWidth <= this.breakpoint;
        
        if (isMobile) {
            // Reset transform for mobile
            container.style.transform = 'translateX(0)';
            container.style.flexDirection = 'column';
            container.style.height = 'auto';
            container.style.overflowY = 'auto';
            
            // Update panels for mobile
            const panels = document.querySelectorAll('.panel');
            panels.forEach(panel => {
                panel.style.width = '100vw';
                panel.style.height = 'auto';
                panel.style.minHeight = 'calc(100vh - 80px)';
            });
        } else {
            // Reset for desktop
            container.style.flexDirection = 'row';
            container.style.height = '100vh';
            container.style.overflowY = 'hidden';
            
            const panels = document.querySelectorAll('.panel');
            panels.forEach(panel => {
                panel.style.width = '100vw';
                panel.style.height = 'calc(100vh - 80px)';
                panel.style.minHeight = 'auto';
            });
            
            // Reapply current section transform
            const currentSection = window.portfolio?.currentSection || 0;
            const translateX = -currentSection * 100;
            container.style.transform = `translateX(${translateX}vw)`;
        }
    }
}

// Add ripple animation CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: translate(-50%, -50%) scale(40);
            opacity: 0;
        }
    }
    
    .panel.active {
        z-index: 1;
    }
    
    /* Smooth scrolling for mobile */
    @media (max-width: 968px) {
        html {
            scroll-behavior: smooth;
        }
    }
`;
document.head.appendChild(style);

// GeoCities Easter Egg
class RetroEasterEgg {
    constructor() {
        this.isRetroMode = false;
        this.init();
    }

    init() {
        const profilePhoto = document.getElementById('profilePhoto');
        console.log('Looking for profilePhoto:', profilePhoto);
        
        if (profilePhoto) {
            profilePhoto.addEventListener('click', (e) => {
                console.log('Photo clicked!');
                e.preventDefault();
                e.stopPropagation();
                this.toggleRetroMode();
            });
            
            // Keep it completely hidden - no hints!
            profilePhoto.style.cursor = 'default';
            console.log('Easter egg initialized on photo');
        } else {
            console.error('Profile photo not found! Looking for element with ID "profilePhoto"');
        }
    }

    toggleRetroMode() {
        this.isRetroMode = !this.isRetroMode;
        
        if (this.isRetroMode) {
            this.enableRetroMode();
        } else {
            this.disableRetroMode();
        }
    }

    enableRetroMode() {
        document.body.classList.add('geocities-mode');
        
        // Add some retro sound effect (optional)
        this.playRetroSound();
        
        // Disable smooth scrolling for that authentic 90s feel
        document.documentElement.style.scrollBehavior = 'auto';
        
        // Add visitor counter (fake, but authentic!)
        this.addVisitorCounter();
        
        // Add "Under Construction" gif (CSS animation)
        this.addUnderConstruction();
        
        // Add floating sparkles
        this.addSparkles();
        
        // Change page title to be obnoxious
        document.title = '🌈 RYAN\'S TOTALLY RADICAL HOMEPAGE!!! 🌈 ⭐ WELCOME TO THE 90s! ⭐';
        
        console.log('🌈 WELCOME TO THE 90S! 🌈');
        console.log('You have discovered the secret GeoCities mode!');
        console.log('*dial-up modem sounds*');
    }

    disableRetroMode() {
        document.body.classList.remove('geocities-mode');
        document.documentElement.style.scrollBehavior = 'smooth';
        
        // Remove all 90s elements
        const counter = document.querySelector('.visitor-counter');
        const construction = document.querySelector('.under-construction');
        const sparkles = document.querySelectorAll('.sparkle');
        
        if (counter) counter.remove();
        if (construction) construction.remove();
        sparkles.forEach(sparkle => sparkle.remove());
        
        // Reset title
        document.title = 'Your Academic Portfolio';
        
        console.log('Back to the future! Welcome back to 2025.');
    }

    playRetroSound() {
        // Create a simple beep sound using Web Audio API
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(200, audioContext.currentTime + 0.5);
            
            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.5);
        } catch (e) {
            // Fallback: just log if audio doesn't work
            console.log('🔊 *dial-up modem sounds*');
        }
    }

    addVisitorCounter() {
        const counter = document.createElement('div');
        counter.className = 'visitor-counter';
        counter.innerHTML = `
            <div style="
                position: fixed;
                bottom: 20px;
                left: 20px;
                background: linear-gradient(45deg, #ff0000, #ffff00);
                border: 3px ridge #808080;
                padding: 10px;
                font-family: 'Comic Sans MS', cursive;
                font-weight: bold;
                color: #000;
                z-index: 9999;
                box-shadow: 5px 5px 0 #000;
                animation: counter-blink 2s linear infinite;
            ">
                📈 You are visitor #${Math.floor(Math.random() * 999999) + 100000}! 📈
                <br>
                <marquee>Thanks for visiting!</marquee>
            </div>
        `;
        
        // Add blinking animation for counter
        const style = document.createElement('style');
        style.textContent = `
            @keyframes counter-blink {
                0%, 50% { opacity: 1; }
                51%, 100% { opacity: 0.7; }
            }
        `;
        document.head.appendChild(style);
        
        document.body.appendChild(counter);
    }

    addUnderConstruction() {
        const construction = document.createElement('div');
        construction.className = 'under-construction';
        construction.innerHTML = `
            <div style="
                position: fixed;
                top: 120px;
                right: 20px;
                background: linear-gradient(45deg, #ffff00, #ff0000);
                border: 5px ridge #808080;
                padding: 15px;
                font-family: 'Comic Sans MS', cursive;
                font-weight: bold;
                color: #000;
                z-index: 9999;
                transform: rotate(-10deg);
                animation: construction-blink 0.8s linear infinite;
                box-shadow: 10px 10px 0 #000;
            ">
                🚧 UNDER CONSTRUCTION 🚧
                <br>
                <span style='font-size: 0.8em;'>Best viewed in Netscape!</span>
            </div>
        `;
        
        // Add blinking animation for construction sign
        const style = document.createElement('style');
        style.textContent = `
            @keyframes construction-blink {
                0%, 50% { opacity: 1; transform: rotate(-10deg) scale(1); }
                51%, 100% { opacity: 0.5; transform: rotate(-8deg) scale(1.05); }
            }
        `;
        document.head.appendChild(style);
        
        document.body.appendChild(construction);
    }

    addSparkles() {
        // Create floating sparkles
        for (let i = 0; i < 15; i++) {
            const sparkle = document.createElement('div');
            sparkle.className = 'sparkle';
            sparkle.innerHTML = i % 3 === 0 ? '✨' : i % 3 === 1 ? '⭐' : '💫';
            
            sparkle.style.position = 'fixed';
            sparkle.style.left = Math.random() * 100 + 'vw';
            sparkle.style.top = Math.random() * 100 + 'vh';
            sparkle.style.fontSize = (Math.random() * 20 + 15) + 'px';
            sparkle.style.zIndex = '9997';
            sparkle.style.pointerEvents = 'none';
            sparkle.style.animation = `sparkle-float ${3 + Math.random() * 4}s ease-in-out infinite`;
            sparkle.style.animationDelay = Math.random() * 2 + 's';
            
            document.body.appendChild(sparkle);
        }
        
        // Add sparkle animation
        const sparkleStyle = document.createElement('style');
        sparkleStyle.textContent = `
            @keyframes sparkle-float {
                0%, 100% { 
                    transform: translateY(0px) rotate(0deg) scale(1);
                    opacity: 0.8;
                }
                25% { 
                    transform: translateY(-20px) rotate(90deg) scale(1.2);
                    opacity: 1;
                }
                50% { 
                    transform: translateY(-10px) rotate(180deg) scale(0.8);
                    opacity: 0.6;
                }
                75% { 
                    transform: translateY(-30px) rotate(270deg) scale(1.1);
                    opacity: 1;
                }
            }
        `;
        document.head.appendChild(sparkleStyle);
    }
}

// Blog Post Management
class BlogManager {
    constructor() {
        this.blogContainer = document.querySelector('.blog-grid');
        this.loadPosts();
    }

    async loadPosts() {
        try {
            const posts = await this.fetchPosts();
            this.displayPosts(posts);
        } catch (error) {
            console.log('Loading sample posts...');
            this.displaySamplePost();
        }
    }

    async fetchPosts() {
        try {
            // Fetch Jekyll-generated posts JSON
            const response = await fetch('/posts.json');
            if (!response.ok) throw new Error('Posts not available');
            const data = await response.json();
            return data.posts;
        } catch (error) {
            // Fallback to hardcoded posts for local development
            return [
                {
                    title: "Welcome to My Research Blog",
                    date: "2025-01-15",
                    excerpt: "Welcome to my research blog where I'll be sharing insights from my work in neuromechanics, ergonomics, and fatigue prediction modeling.",
                    tags: ["research", "biomechanics", "ergonomics"]
                },
                {
                    title: "Understanding Motor Unit Fatigue",
                    date: "2024-12-10", 
                    excerpt: "Exploring the complexities of motor unit fatigue and how we can develop better predictive models for real-world applications.",
                    tags: ["motor-units", "fatigue", "modeling"]
                }
            ];
        }
    }

    parseMarkdown(content) {
        const parts = content.split('---');
        const frontMatter = parts[1];
        const body = parts[2];
        
        // Simple front matter parsing
        const metadata = {};
        frontMatter.split('\n').forEach(line => {
            if (line.includes(':')) {
                const [key, ...valueParts] = line.split(':');
                metadata[key.trim()] = valueParts.join(':').trim().replace(/"/g, '');
            }
        });

        return [{
            ...metadata,
            content: body.trim(),
            excerpt: body.trim().substring(0, 200) + '...'
        }];
    }

    displaySamplePost() {
        if (!this.blogContainer) return;
        
        const samplePost = {
            title: "Welcome to My Research Blog",
            date: "2025-08-31",
            excerpt: "This is my first blog post using the new content management system! I can now easily add new posts, images, and thoughts directly through a web interface...",
            tags: ["research", "biomechanics", "ergonomics"]
        };

        this.blogContainer.innerHTML = this.createPostHTML(samplePost);
    }

    displayPosts(posts) {
        if (!this.blogContainer || !posts.length) return;
        
        this.blogContainer.innerHTML = posts.map(post => this.createPostHTML(post)).join('');
    }

    createPostHTML(post) {
        const formattedDate = new Date(post.date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        const tags = Array.isArray(post.tags) ? post.tags : (post.tags ? post.tags.split(',') : []);

        return `
            <article class="blog-card">
                <div class="blog-card-content">
                    <div class="blog-meta">
                        <span class="blog-date">${formattedDate}</span>
                        <div class="blog-tags">
                            ${tags.map(tag => `<span class="blog-tag">${tag.trim()}</span>`).join('')}
                        </div>
                    </div>
                    <h3 class="blog-title">${post.title}</h3>
                    <p class="blog-excerpt">${post.excerpt}</p>
                    <a href="#" class="blog-read-more btn-primary">Read More</a>
                </div>
            </article>
        `;
    }
}

// Add blog loading to AcademicPortfolio class
AcademicPortfolio.prototype.loadBlogPosts = function() {
    this.blogManager = new BlogManager();
};

// Launch Motor Unit Fatigue Model App
function launchFatigueApp() {
    // First, show instructions for running the app
    showAppInstructions();
}

function showAppInstructions() {
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        color: white;
        font-family: Verdana, Arial, sans-serif;
    `;
    
    modal.innerHTML = `
        <div style="background: #1a1a1a; padding: 3rem; border-radius: 16px; max-width: 650px; text-align: center; border: 2px solid #E08F71;">
            <h2 style="color: #E08F71; margin-bottom: 1.5rem;">Motor Unit Fatigue Model App</h2>
            <p style="margin-bottom: 1.5rem; line-height: 1.6;">To launch this Streamlit application:</p>
            <div style="background: #333; padding: 1.5rem; border-radius: 8px; margin-bottom: 2rem; text-align: left;">
                <p style="margin-bottom: 1rem; font-weight: bold; color: #E08F71;">Windows:</p>
                <code style="display: block; margin-bottom: 0.5rem;">cd "Motor Unit Fatigue Model App"</code>
                <code style="display: block;">streamlit run fatigue-analysis-app-v56.py</code>
                
                <p style="margin: 1.5rem 0 1rem; font-weight: bold; color: #E08F71;">Mac/Linux:</p>
                <code style="display: block; margin-bottom: 0.5rem;">cd "Motor Unit Fatigue Model App"</code>
                <code style="display: block;">streamlit run fatigue-analysis-app-v56.py</code>
            </div>
            <div style="display: flex; gap: 1rem; justify-content: center;">
                <button onclick="tryOpenApp()" 
                        style="background: #E08F71; color: #1a1a1a; border: none; padding: 1rem 1.5rem; border-radius: 8px; font-weight: 600; cursor: pointer;">
                    Try Opening App
                </button>
                <button onclick="this.parentElement.parentElement.parentElement.remove()" 
                        style="background: transparent; color: #E08F71; border: 2px solid #E08F71; padding: 1rem 1.5rem; border-radius: 8px; font-weight: 600; cursor: pointer;">
                    Close
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

function tryOpenApp() {
    // Try to open the Streamlit app at common ports
    const ports = [8501, 8502, 8503];
    
    for (let port of ports) {
        const url = `http://localhost:${port}`;
        window.open(url, '_blank');
    }
    
    // Close the modal
    const modal = document.querySelector('div[style*="position: fixed"]');
    if (modal) modal.remove();
}

// Mobile Navigation Handler
class MobileNavigation {
    constructor() {
        this.toggle = document.getElementById('mobileNavToggle');
        this.menu = document.getElementById('mobileNavMenu');
        this.navButtons = document.querySelectorAll('.mobile-nav-btn');
        
        this.init();
    }
    
    init() {
        // Toggle mobile menu
        this.toggle?.addEventListener('click', () => {
            this.menu.classList.toggle('active');
            this.toggle.textContent = this.menu.classList.contains('active') ? '✕' : '☰';
        });
        
        // Handle mobile nav clicks
        this.navButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                // Close mobile menu
                this.menu.classList.remove('active');
                this.toggle.textContent = '☰';
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!this.toggle?.contains(e.target) && !this.menu?.contains(e.target)) {
                this.menu?.classList.remove('active');
                if (this.toggle) this.toggle.textContent = '☰';
            }
        });
        
        // Close menu on resize to desktop
        window.addEventListener('resize', () => {
            if (window.innerWidth > 968) {
                this.menu?.classList.remove('active');
                if (this.toggle) this.toggle.textContent = '☰';
            }
        });
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.portfolio = new AcademicPortfolio();
    new CardInteractions();
    new ContactForm();
    new ResponsiveHandler();
    new RetroEasterEgg();
    new MobileNavigation();
    
    console.log('🎓 Academic Portfolio initialized successfully!');
    console.log('Navigation: Arrow keys, scroll wheel, or click navigation buttons');
    console.log('Keyboard shortcuts: Home (first section), End (last section)');
    console.log('🥚 Easter egg hint: Try clicking the profile photo...');
});

// Handle page visibility change
document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
        // Restart animations when page becomes visible
        const currentPanel = document.querySelector(`#${window.portfolio?.getSectionId(window.portfolio.currentSection)}`);
        if (currentPanel) {
            window.portfolio?.animateCurrentSection();
        }
    }
});

// Prevent default touch behaviors on mobile
document.addEventListener('touchmove', (e) => {
    if (window.innerWidth > 968) {
        e.preventDefault();
    }
}, { passive: false });