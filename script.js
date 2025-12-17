// Academic Portfolio - Tab-Based Navigation
class AcademicPortfolio {
    constructor() {
        this.currentSection = 0;
        this.totalSections = 6;
        this.navButtons = document.querySelectorAll('.nav-btn');
        this.sectionNumber = document.querySelector('.section-number');

        console.log('Portfolio initialized with', this.navButtons.length, 'nav buttons');

        this.init();
    }

    init() {
        this.setupNavigation();
        this.setupProgressTracking();
        this.loadBlogPosts();

        // Show first section by default
        this.goToSection(0);
    }

    setupNavigation() {
        this.navButtons.forEach((btn) => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const sectionName = btn.getAttribute('data-section');
                console.log('Button clicked for section:', sectionName);

                const sectionIndex = this.getSectionIndex(sectionName);
                console.log('Section index:', sectionIndex);

                if (sectionIndex !== -1) {
                    this.goToSection(sectionIndex);
                }
            });
        });

        console.log('Navigation setup complete for', this.navButtons.length, 'buttons');
    }

    getSectionIndex(sectionName) {
        const sections = ['home', 'research', 'tools', 'blog', 'cv', 'contact'];
        return sections.indexOf(sectionName);
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
        if (index < 0 || index >= this.totalSections) {
            console.log('Invalid section index:', index);
            return;
        }

        console.log('Going to section:', index, this.getSectionId(index));
        this.currentSection = index;

        // Hide all panels
        document.querySelectorAll('.panel').forEach(panel => {
            panel.classList.remove('active');
            console.log('Hiding panel:', panel.id);
        });

        // Show the selected panel
        const targetPanel = document.getElementById(this.getSectionId(index));
        console.log('Target panel:', targetPanel);
        if (targetPanel) {
            targetPanel.classList.add('active');
            console.log('Showing panel:', targetPanel.id);
            // Scroll to top of page when switching sections
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            console.error('Panel not found for section:', this.getSectionId(index));
        }

        this.updateUI();
    }

    getSectionId(index) {
        const sections = ['home', 'research', 'tools', 'blog', 'cv', 'contact'];
        return sections[index];
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

        // Update page title
        const sectionTitles = [
            'Home - Academic Portfolio',
            'Research - Academic Portfolio',
            'Tools - Academic Portfolio',
            'Blog - Academic Portfolio',
            'CV - Academic Portfolio',
            'Contact - Academic Portfolio'
        ];
        document.title = sectionTitles[this.currentSection] || 'Academic Portfolio';
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


// Add ripple animation CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: translate(-50%, -50%) scale(40);
            opacity: 0;
        }
    }

    /* Smooth scrolling */
    html {
        scroll-behavior: smooth;
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
                    excerpt: "Launching my research blog to share insights from neuromechanics and ergonomics work, including methodology deep-dives, industry applications, and tool development updates.",
                    tags: ["research", "biomechanics", "ergonomics"],
                    content: `# Welcome to My Research Blog

I'm excited to launch this blog as a platform to share insights from my research in neuromechanics and ergonomics. As a PhD candidate at Ontario Tech University, I've been deeply involved in understanding the complex relationships between biomechanics and workplace ergonomics.

## What You Can Expect

In this blog, I'll be sharing:

- **Research Updates**: Insights from my ongoing work in fatigue prediction and muscle physiology
- **Methodology Deep Dives**: Detailed explanations of the techniques and approaches I use in my research  
- **Industry Applications**: How academic research translates to real-world ergonomic solutions
- **Tool Development**: Updates on the open-source tools I'm developing for the research community

## My Current Research Focus

![Research Focus](/photos/portrait.jpg)
*Research in action: Exploring the intersection of biomechanics, ergonomics, and human performance*

My work centers on developing predictive models for neuromuscular fatigue, particularly in manufacturing settings. This involves:

- High-density EMG analysis using advanced signal processing techniques
- Motor unit decomposition and analysis
- Force-time history dependent fatigue modeling
- Real-world application in industrial ergonomics

## Recent Highlights

I recently published a comprehensive scoping review and meta-analysis of upper limb strength asymmetry in *Scientific Reports*, which provides new evidence for understanding handedness effects across populations. This work builds on years of research into motor neuron excitability and postural control.

## Looking Ahead

I'm particularly excited about the intersection of traditional biomechanical research and modern data science approaches. The tools I'm developing, like the MU Edit to OpenHDEMG converter, are designed to make advanced EMG analysis more accessible to researchers worldwide.

Stay tuned for more updates as I continue to explore the fascinating world of human movement and muscle physiology!

*Have questions about my research or want to collaborate? Feel free to reach out through my contact page or find me on [Google Scholar](https://scholar.google.ca/citations?user=IfJohqAAAAAJ&hl=en).*`
                },
                {
                    title: "Understanding Motor Unit Fatigue: A Deep Dive into Predictive Modeling",
                    date: "2024-12-10", 
                    excerpt: "Motor unit fatigue involves complex neural, metabolic, and mechanical factors. This post explores the challenges of creating accurate predictive models and my approach to force-time history dependent modeling.",
                    tags: ["motor-units", "fatigue", "modeling"],
                    content: `# Understanding Motor Unit Fatigue: A Deep Dive into Predictive Modeling

Motor unit fatigue is one of the most fascinating and complex phenomena in human physiology. As someone who spends countless hours analyzing EMG signals and developing fatigue prediction models, I've come to appreciate both the elegance and the challenges of understanding how our muscles tire.

## What Are Motor Units?

Before diving into fatigue, let's establish what we're working with. A motor unit consists of a motor neuron and all the muscle fibers it innervates. These are the functional units of muscle contraction, and they're recruited in a highly organized manner based on the force demands of the task.

![Motor Unit Recruitment](/photos/2023.04.06-FHS_UG_TeachingLabs-405925.jpg)
*Figure 1: Teaching lab setup for motor unit analysis - demonstrating EMG electrode placement for research*

## The Fatigue Process

Fatigue isn't just about muscles getting tired – it's a complex cascade of events involving:

- **Neural factors**: Changes in motor unit firing rates and recruitment patterns
- **Metabolic factors**: Accumulation of metabolites and depletion of energy stores  
- **Mechanical factors**: Changes in force-generating capacity of muscle fibers
- **Psychological factors**: Perception of effort and motivation

## Predictive Modeling Challenges

Creating accurate fatigue models is challenging because:

1. **Individual Variability**: People fatigue differently based on training, genetics, and fiber type composition
2. **Task Specificity**: Fatigue patterns vary dramatically between sustained contractions, intermittent work, and dynamic movements
3. **Multi-factorial Nature**: So many variables influence fatigue that isolating individual contributions is difficult

## My Approach

In my research, I focus on developing force-time history dependent models that can account for:

- Previous work history
- Recovery periods
- Individual muscle characteristics
- Real-world work patterns

The goal is to create models that are both scientifically accurate and practically applicable in industrial settings.

## Real-World Applications

This research has direct implications for:

- **Workplace Design**: Optimizing work-rest cycles to prevent injury
- **Athletic Performance**: Understanding training load and recovery
- **Rehabilitation**: Monitoring progress and preventing re-injury
- **Assistive Technology**: Developing adaptive systems that respond to user fatigue

## Tools and Techniques

I rely heavily on high-density EMG to capture motor unit behavior, combined with advanced signal processing techniques. The open-source tools I develop help make these sophisticated analyses accessible to other researchers.

![EMG Signal Analysis](/photos/Screenshot 2023-09-22 150039.png)
*Figure 2: Example of data analysis workflow - this represents the type of signal processing used in motor unit research*

## Looking Forward

The future of fatigue modeling lies in integrating multiple data streams – EMG, force, kinematics, and even wearable sensor data – into comprehensive models that can adapt to individual users in real-time.

This is an exciting time to be working in this field, as we're beginning to bridge the gap between laboratory research and practical applications that can improve people's working lives.

*What aspects of fatigue modeling are you most interested in? I'd love to hear from other researchers working in this space!*`
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
        
        // Ensure we only show the excerpt, not the full content
        const displayExcerpt = post.excerpt || (post.content ? post.content.substring(0, 150) + '...' : '');

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
                    <p class="blog-excerpt">${displayExcerpt}</p>
                    <button class="blog-read-more btn-primary" onclick="openBlogPost(\`${post.title.replace(/`/g, '\\`')}\`, '${formattedDate}', \`${(post.content || post.excerpt).replace(/`/g, '\\`').replace(/\$/g, '\\$')}\`)">Read More</button>
                </div>
            </article>
        `;
    }
}

// Add blog loading to AcademicPortfolio class
AcademicPortfolio.prototype.loadBlogPosts = function() {
    this.blogManager = new BlogManager();
};

// Open Blog Post Modal
function openBlogPost(title, date, content) {
    const modal = document.createElement('div');
    modal.className = 'blog-post-modal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.8);
        display: flex;
        align-items: flex-start;
        justify-content: center;
        z-index: 10000;
        color: #1a1a1a;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
        overflow-y: auto;
        padding: 2rem;
        box-sizing: border-box;
    `;
    
    // Process markdown-like content for display
    let processedContent = content
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/^## (.*$)/gim, '<h2>$1</h2>')
        .replace(/^# (.*$)/gim, '<h1>$1</h1>')
        .replace(/^- (.*$)/gim, '<li>$1</li>')
        .replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>')
        .replace(/\n\n/g, '</p><p>')
        .replace(/^(?!<[h|u|l])/gm, '<p>')
        .replace(/(?<!>)$/gm, '</p>')
        .replace(/<p><\/p>/g, '')
        .replace(/<p>(<[h|u])/g, '$1')
        .replace(/(<\/[h|u].*>)<\/p>/g, '$1');
    
    modal.innerHTML = `
        <div style="
            background: #FDF5E6; 
            padding: 3rem; 
            border-radius: 16px; 
            max-width: 800px; 
            width: 100%;
            max-height: 90vh;
            overflow-y: auto;
            border: 2px solid #E08F71;
            position: relative;
        ">
            <button onclick="this.parentElement.parentElement.remove()" style="
                position: absolute;
                top: 1rem;
                right: 1rem;
                background: #E08F71;
                color: white;
                border: none;
                border-radius: 50%;
                width: 40px;
                height: 40px;
                font-size: 1.5rem;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: bold;
            ">&times;</button>
            <h1 style="color: #E08F71; margin-bottom: 0.5rem; font-size: 2rem;">${title}</h1>
            <p style="color: #666; margin-bottom: 2rem; font-style: italic;">${date}</p>
            <div class="blog-post-content" style="line-height: 1.6;">${processedContent}</div>
        </div>
    `;
    
    // Disable background scrolling and store current scroll position
    const currentScrollY = window.scrollY;
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.top = `-${currentScrollY}px`;
    document.body.style.width = '100%';
    
    document.body.appendChild(modal);
    
    // Prevent scroll events from propagating to background
    modal.addEventListener('wheel', (e) => {
        e.stopPropagation();
    });
    
    modal.addEventListener('touchmove', (e) => {
        e.stopPropagation();
    });
    
    // Function to close modal and re-enable scrolling
    const closeModal = () => {
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        window.scrollTo(0, currentScrollY);
        modal.remove();
        document.removeEventListener('keydown', handleEscape);
    };
    
    // Close on background click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    // Close on escape key
    const handleEscape = (e) => {
        if (e.key === 'Escape') {
            closeModal();
        }
    };
    document.addEventListener('keydown', handleEscape);
    
    // Update close button to use closeModal function
    const closeButton = modal.querySelector('button');
    if (closeButton) {
        closeButton.onclick = closeModal;
    }
}

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
    new RetroEasterEgg();
    new MobileNavigation();

    console.log('🎓 Academic Portfolio initialized successfully!');
    console.log('Navigation: Click navigation buttons to switch between sections');
    console.log('🥚 Easter egg hint: Try clicking the profile photo...');
});