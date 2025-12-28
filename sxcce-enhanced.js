/**
 * MODERN COLLEGE WEBSITE - ENHANCED JAVASCRIPT
 * Vanilla JavaScript implementation with modern features
 */

(function() {
    'use strict';

    // ===== UTILITY FUNCTIONS =====
    const $ = (selector, context = document) => context.querySelector(selector);
    const $$ = (selector, context = document) => Array.from(context.querySelectorAll(selector));

    // ===== SCROLL PROGRESS INDICATOR =====
    function initScrollProgress() {
        const progressBar = document.createElement('div');
        progressBar.className = 'scroll-progress';
        progressBar.setAttribute('role', 'progressbar');
        progressBar.setAttribute('aria-label', 'Scroll progress');
        progressBar.setAttribute('aria-valuemin', '0');
        progressBar.setAttribute('aria-valuemax', '100');
        document.body.appendChild(progressBar);

        function updateProgress() {
            const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (window.scrollY / windowHeight) * 100;
            progressBar.style.width = scrolled + '%';
            progressBar.setAttribute('aria-valuenow', Math.round(scrolled));
        }

        window.addEventListener('scroll', updateProgress, { passive: true });
        updateProgress();
    }

    // ===== ANIMATED NAVBAR (STICKY + SHRINK) =====
    function initAnimatedNavbar() {
        // Find the main navbar (prefer .top-bar1 or .navbar)
        const navbar = $('.top-bar1') || $('.navbar') || $('.navbar-enhanced');
        if (!navbar) return;

        // Add enhanced class if not present
        if (!navbar.classList.contains('navbar-enhanced')) {
            navbar.classList.add('navbar-enhanced');
        }

        let lastScroll = 0;
        const scrollThreshold = 50;

        function handleScroll() {
            const currentScroll = window.scrollY;

            if (currentScroll > scrollThreshold) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }

            // Optional: Hide/show navbar on scroll down (can be disabled if not desired)
            // Uncomment below if you want navbar to hide on scroll down
            /*
            if (currentScroll > lastScroll && currentScroll > 200) {
                navbar.style.transform = 'translateY(-100%)';
            } else {
                navbar.style.transform = 'translateY(0)';
            }
            */

            lastScroll = currentScroll;
        }

        window.addEventListener('scroll', handleScroll, { passive: true });
    }

    // ===== SMOOTH SCROLLING AND SECTION REVEAL =====
    function initSectionReveal() {
        const sections = $$('.section-reveal, section, .card, .stat-box, .feature-box');
        
        if (!window.IntersectionObserver) {
            // Fallback for older browsers
            sections.forEach(section => {
                section.classList.add('revealed');
            });
            return;
        }

        const observerOptions = {
            root: null,
            rootMargin: '0px 0px -100px 0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        sections.forEach(section => {
            observer.observe(section);
        });
    }

    // ===== ANIMATED STATISTICS COUNTER =====
    function initStatCounter() {
        const statNumbers = $$('.stat-number, .stat-counter');
        
        if (!window.IntersectionObserver) {
            // Fallback: animate immediately
            statNumbers.forEach(stat => {
                if (stat.getAttribute('data-target')) {
                    animateCounter(stat);
                }
            });
            return;
        }

        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.5
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.dataset.animated) {
                    animateCounter(entry.target);
                    entry.target.dataset.animated = 'true';
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        statNumbers.forEach(stat => {
            if (stat.getAttribute('data-target')) {
                stat.textContent = '0'; // Initialize to 0
                observer.observe(stat);
            }
        });
    }

    function animateCounter(element) {
        const targetAttr = element.getAttribute('data-target');
        if (!targetAttr) return;
        
        const target = parseInt(targetAttr);
        if (isNaN(target)) return;
        
        const duration = 2000; // 2 seconds
        const steps = 60; // 60 frames
        const increment = target / steps;
        let current = 0;
        let frame = 0;

        const updateCounter = () => {
            frame++;
            current += increment;
            if (frame < steps) {
                element.textContent = Math.floor(current);
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target;
            }
        };

        updateCounter();
    }

    // ===== DARK MODE TOGGLE =====
    function initDarkMode() {
        // Check for saved theme preference or default to light mode
        const currentTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', currentTheme);

        // Create toggle button
        const toggleBtn = document.createElement('button');
        toggleBtn.className = 'dark-mode-toggle';
        toggleBtn.setAttribute('aria-label', 'Toggle dark mode');
        toggleBtn.setAttribute('title', 'Toggle dark mode');
        toggleBtn.innerHTML = currentTheme === 'dark' ? '☀️' : '🌙';
        document.body.appendChild(toggleBtn);

        toggleBtn.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            toggleBtn.innerHTML = newTheme === 'dark' ? '☀️' : '🌙';
            
            // Add animation
            toggleBtn.style.transform = 'rotate(360deg)';
            setTimeout(() => {
                toggleBtn.style.transform = '';
            }, 300);
        });
    }

    // ===== ENHANCED CAROUSEL =====
    function initEnhancedCarousel() {
        const carousels = $$('.carousel, #carouselExample');
        
        carousels.forEach(carousel => {
            carousel.classList.add('carousel-enhanced');
            
            // Add keyboard navigation
            carousel.addEventListener('keydown', (e) => {
                const prevBtn = carousel.querySelector('.carousel-control-prev');
                const nextBtn = carousel.querySelector('.carousel-control-next');
                
                if (e.key === 'ArrowLeft' && prevBtn) {
                    prevBtn.click();
                } else if (e.key === 'ArrowRight' && nextBtn) {
                    nextBtn.click();
                }
            });
        });
    }

    // ===== SMOOTH SCROLL FOR ANCHOR LINKS =====
    function initSmoothScroll() {
        const links = $$('a[href^="#"]');
        
        links.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                if (href === '#' || !href) return;
                
                const target = $(href);
                if (target) {
                    e.preventDefault();
                    const offsetTop = target.offsetTop - 100; // Account for sticky navbar
                    
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    // ===== ADD ENHANCED CLASSES TO EXISTING ELEMENTS =====
    function enhanceExistingElements() {
        // Add enhanced classes to cards (but preserve existing classes)
        $$('.card').forEach(card => {
            if (!card.classList.contains('card-enhanced')) {
                card.classList.add('card-enhanced');
            }
        });

        // Add enhanced classes to images (skip carousel images, logos, and small icons)
        $$('img').forEach(img => {
            const isCarousel = img.closest('.carousel');
            const isLogo = img.alt && (img.alt.toLowerCase().includes('logo') || img.src.toLowerCase().includes('logo'));
            const isVideo = img.closest('.video-background');
            const isSmallIcon = img.width < 100 || img.height < 100 || img.style.width && parseInt(img.style.width) < 100;
            const isNavbar = img.closest('nav, .navbar');
            const isFooter = img.closest('footer, #footer');
            
            // Only enhance larger images that are not in special containers
            if (!isCarousel && !isLogo && !isVideo && !isSmallIcon && !isNavbar && !isFooter) {
                if (!img.classList.contains('img-enhanced')) {
                    img.classList.add('img-enhanced');
                }
                // Add parallax class only for larger images in content areas
                if (!isCarousel && img.naturalWidth > 200) {
                    img.classList.add('img-parallax');
                }
            }
        });

        // Add enhanced classes to buttons (skip special buttons)
        $$('.btn, button').forEach(btn => {
            const isSpecial = btn.classList.contains('dark-mode-toggle') || 
                           btn.classList.contains('navbar-toggler') ||
                           btn.classList.contains('carousel-control');
            if (!isSpecial && !btn.classList.contains('btn-enhanced')) {
                btn.classList.add('btn-enhanced');
            }
        });

        // Add section-reveal to main sections (avoid duplicates)
        $$('section, .stats-section, .features-section, .gallery-section, .testimonials-section, .links-section').forEach(section => {
            if (!section.classList.contains('section-reveal')) {
                section.classList.add('section-reveal');
            }
        });

        // Add stagger effect to stat boxes container if not already added
        const statsContainer = $('.stats-container, .stats-section');
        if (statsContainer && !statsContainer.classList.contains('stagger')) {
            statsContainer.classList.add('stagger');
        }
    }

    // ===== ACCESSIBILITY ENHANCEMENTS =====
    function initAccessibility() {
        // Add skip link
        const skipLink = document.createElement('a');
        skipLink.href = '#main-content';
        skipLink.className = 'skip-link';
        skipLink.textContent = 'Skip to main content';
        document.body.insertBefore(skipLink, document.body.firstChild);

        // Add main content id if not present
        const mainContent = $('#main-content') || $('main') || $('.container-fluid, .container').first;
        if (mainContent && !mainContent.id) {
            mainContent.id = 'main-content';
        }

        // Add ARIA labels to interactive elements
        $$('button:not([aria-label])').forEach(btn => {
            if (!btn.textContent.trim()) {
                btn.setAttribute('aria-label', 'Button');
            }
        });

        // Enhance focus management
        document.addEventListener('keydown', (e) => {
            // Tab navigation enhancement
            if (e.key === 'Tab') {
                document.body.classList.add('keyboard-navigation');
            }
        });

        document.addEventListener('mousedown', () => {
            document.body.classList.remove('keyboard-navigation');
        });
    }

    // ===== PERFORMANCE OPTIMIZATION =====
    function initPerformanceOptimizations() {
        // Lazy load images
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                            img.removeAttribute('data-src');
                        }
                        img.classList.add('fade-in');
                        observer.unobserve(img);
                    }
                });
            });

            $$('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        }

        // Debounce scroll events
        let scrollTimeout;
        const originalScrollHandler = window.onscroll;
        window.onscroll = function() {
            if (scrollTimeout) {
                clearTimeout(scrollTimeout);
            }
            scrollTimeout = setTimeout(() => {
                if (originalScrollHandler) originalScrollHandler();
            }, 10);
        };
    }

    // ===== BUTTON RIPPLE EFFECT =====
    function initButtonRipple() {
        const buttons = $$('.btn-enhanced, .btn, button:not(.dark-mode-toggle):not(.navbar-toggler):not(.carousel-control)');
        
        // Use event delegation for better performance
        document.addEventListener('click', function(e) {
            const button = e.target.closest('.btn-ripple, .btn-enhanced, .btn');
            if (!button) return;

            // Add btn-ripple class if not present
            if (!button.classList.contains('btn-ripple')) {
                button.classList.add('btn-ripple');
            }

            const rect = button.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Remove existing ripples to prevent accumulation
            const existingRipples = button.querySelectorAll('.ripple');
            existingRipples.forEach(r => r.remove());
            
            const ripple = document.createElement('span');
            ripple.className = 'ripple';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            
            button.appendChild(ripple);
            
            // Remove ripple after animation
            setTimeout(() => {
                if (ripple.parentNode) {
                    ripple.remove();
                }
            }, 600);
        }, true);

        // Add btn-ripple class to buttons
        buttons.forEach(button => {
            button.classList.add('btn-ripple');
        });
    }

    // ===== CURSOR GLOW EFFECT =====
    function initCursorGlow() {
        // Only on desktop (not mobile)
        if (window.matchMedia('(max-width: 768px)').matches) {
            return;
        }

        // Check if user prefers reduced motion
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            return;
        }

        const cursor = document.createElement('div');
        cursor.className = 'cursor-glow';
        document.body.appendChild(cursor);

        let mouseX = 0;
        let mouseY = 0;
        let cursorX = 0;
        let cursorY = 0;
        let isAnimating = false;

        // Smooth cursor follow using requestAnimationFrame for performance
        function animateCursor() {
            if (!isAnimating) return;
            
            cursorX += (mouseX - cursorX) * 0.15; // Smooth follow speed
            cursorY += (mouseY - cursorY) * 0.15;
            cursor.style.left = cursorX + 'px';
            cursor.style.top = cursorY + 'px';
            
            requestAnimationFrame(animateCursor);
        }

        // Track mouse movement
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            
            if (!isAnimating) {
                isAnimating = true;
                cursor.classList.add('active');
                animateCursor();
            }
        }, { passive: true });

        // Hide cursor when mouse leaves window
        document.addEventListener('mouseleave', () => {
            isAnimating = false;
            cursor.classList.remove('active', 'hover');
        }, { passive: true });

        // Add hover effect on interactive elements (using event delegation for performance)
        document.addEventListener('mouseenter', (e) => {
            const target = e.target;
            if (target.matches('a, button, .card-enhanced, .btn-enhanced, .nav-link, input, textarea, select')) {
                cursor.classList.add('hover');
            }
        }, true);

        document.addEventListener('mouseleave', (e) => {
            const target = e.target;
            if (target.matches('a, button, .card-enhanced, .btn-enhanced, .nav-link, input, textarea, select')) {
                cursor.classList.remove('hover');
            }
        }, true);
    }

    // ===== IMAGE PARALLAX ON SCROLL =====
    function initImageParallax() {
        // Only on desktop for performance
        if (window.matchMedia('(max-width: 768px)').matches) {
            return;
        }

        // Exclude carousel images and small images
        const parallaxImages = $$('.img-parallax').filter(img => {
            const isCarousel = img.closest('.carousel');
            const isSmall = img.naturalWidth < 200 || img.offsetWidth < 200;
            return !isCarousel && !isSmall;
        });

        if (parallaxImages.length === 0) return;

        // Store initial positions
        const imageData = parallaxImages.map(img => {
            const rect = img.getBoundingClientRect();
            return {
                element: img,
                initialTop: rect.top + window.scrollY,
                height: img.offsetHeight || img.naturalHeight
            };
        });

        let ticking = false;

        function updateParallax() {
            const scrollY = window.scrollY;
            const windowHeight = window.innerHeight;

            imageData.forEach(({ element, initialTop, height }) => {
                const rect = element.getBoundingClientRect();
                
                // Only animate if image is in viewport and visible
                if (rect.bottom >= -50 && rect.top <= windowHeight + 50 && element.offsetParent !== null) {
                    // Calculate parallax offset (very subtle effect)
                    const elementCenter = initialTop + height / 2;
                    const scrollCenter = scrollY + windowHeight / 2;
                    const distance = elementCenter - scrollCenter;
                    const parallaxOffset = distance * 0.08; // Reduced intensity for subtlety
                    
                    // Limit the parallax offset to prevent images from moving too much
                    const limitedOffset = Math.max(-30, Math.min(30, parallaxOffset));
                    
                    element.style.transform = `translate3d(0, ${limitedOffset}px, 0)`;
                } else {
                    // Reset transform when out of viewport
                    element.style.transform = 'translate3d(0, 0, 0)';
                }
            });
            
            ticking = false;
        }

        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(updateParallax);
                ticking = true;
            }
        }, { passive: true });

        // Initial update after a short delay to ensure images are loaded
        setTimeout(() => {
            updateParallax();
        }, 100);
    }

    // ===== CARD TILT EFFECT ON MOUSE MOVE =====
    function initCardTilt() {
        // Only on desktop for performance
        if (window.matchMedia('(max-width: 768px)').matches) {
            return;
        }

        // Check if user prefers reduced motion
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            return;
        }

        const cards = $$('.card-enhanced, .card-tilt, .card');
        
        cards.forEach(card => {
            if (!card.classList.contains('card-tilt')) {
                card.classList.add('card-tilt');
            }

            let rafId = null;

            card.addEventListener('mousemove', (e) => {
                // Cancel previous animation frame for performance
                if (rafId) {
                    cancelAnimationFrame(rafId);
                }

                rafId = requestAnimationFrame(() => {
                    const rect = card.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;
                    
                    const centerX = rect.width / 2;
                    const centerY = rect.height / 2;
                    
                    // Calculate tilt (subtle effect)
                    const rotateX = (y - centerY) / 15; // Reduced intensity
                    const rotateY = (centerX - x) / 15;
                    
                    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px) scale(1.01)`;
                });
            }, { passive: true });

            card.addEventListener('mouseleave', () => {
                if (rafId) {
                    cancelAnimationFrame(rafId);
                }
                card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0) scale(1)';
            }, { passive: true });
        });
    }

    // ===== YOUTUBE VIDEO EMBED FIXES =====
    function initYouTubeEmbeds() {
        const youtubeEmbeds = $$('iframe[src*="youtube.com"], iframe[src*="youtu.be"]');
        
        youtubeEmbeds.forEach(iframe => {
            // Add loading class
            iframe.classList.add('youtube-embed', 'loading');
            
            // Fix common YouTube embed issues
            const src = iframe.getAttribute('src');
            if (src) {
                // Ensure proper embed URL format
                let newSrc = src;
                
                // Convert youtu.be to embed format
                if (src.includes('youtu.be/')) {
                    const videoId = src.split('youtu.be/')[1].split('?')[0];
                    newSrc = `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`;
                }
                
                // Ensure embed URL has proper parameters
                if (src.includes('youtube.com/embed/')) {
                    if (!src.includes('rel=')) {
                        newSrc += (src.includes('?') ? '&' : '?') + 'rel=0';
                    }
                    if (!src.includes('modestbranding=')) {
                        newSrc += '&modestbranding=1';
                    }
                }
                
                // Add allow attribute if missing
                if (!iframe.hasAttribute('allow')) {
                    iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share');
                }
                
                // Add allowfullscreen if missing
                if (!iframe.hasAttribute('allowfullscreen')) {
                    iframe.setAttribute('allowfullscreen', '');
                }
                
                // Update src if changed
                if (newSrc !== src) {
                    iframe.setAttribute('src', newSrc);
                }
                
                // Remove loading class when video loads
                iframe.addEventListener('load', () => {
                    iframe.classList.remove('loading');
                    
                    // Check for YouTube error after load
                    setTimeout(() => {
                        checkYouTubeError(iframe);
                    }, 2000);
                });
                
                // Handle errors
                iframe.addEventListener('error', () => {
                    console.warn('YouTube embed error:', src);
                    showYouTubeFallback(iframe);
                });
            }
        });
        
        // Wrap iframes in proper containers if needed
        youtubeEmbeds.forEach(iframe => {
            const parent = iframe.parentElement;
            if (!parent.classList.contains('video-container-enhanced') && 
                !parent.classList.contains('gallery-content')) {
                const wrapper = document.createElement('div');
                wrapper.className = 'video-container-enhanced';
                iframe.parentNode.insertBefore(wrapper, iframe);
                wrapper.appendChild(iframe);
            }
        });
    }
    
    // Check for YouTube embed errors
    function checkYouTubeError(iframe) {
        try {
            // Try to access iframe content (may fail due to CORS, but that's okay)
            const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
            if (iframeDoc) {
                const errorElements = iframeDoc.querySelectorAll('[class*="error"], [id*="error"]');
                if (errorElements.length > 0) {
                    showYouTubeFallback(iframe);
                }
            }
        } catch (e) {
            // CORS error is expected, check by other means
            // Check if iframe is visible and has content
            const rect = iframe.getBoundingClientRect();
            if (rect.width === 0 || rect.height === 0) {
                showYouTubeFallback(iframe);
            }
        }
    }
    
    // Show fallback when YouTube embed fails
    function showYouTubeFallback(iframe) {
        iframe.classList.add('error');
        const fallback = iframe.parentElement.querySelector('.youtube-fallback');
        if (fallback) {
            fallback.style.display = 'flex';
        }
    }

    // ===== ENHANCED TESTIMONIALS =====
    function initTestimonials() {
        const testimonialCards = $$('.testimonial-card');
        
        // Add stagger animation to testimonial cards
        testimonialCards.forEach((card, index) => {
            card.style.animationDelay = `${index * 0.1}s`;
            
            // Add intersection observer for fade-in
            if (window.IntersectionObserver) {
                const observer = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            entry.target.style.opacity = '1';
                            entry.target.style.transform = 'translateY(0)';
                            observer.unobserve(entry.target);
                        }
                    });
                }, { threshold: 0.1 });

                card.style.opacity = '0';
                card.style.transform = 'translateY(30px)';
                card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                observer.observe(card);
            }
        });

        // Enhance carousel with smooth transitions
        const testimonialCarousel = $('#testimonialCarousel');
        if (testimonialCarousel) {
            testimonialCarousel.addEventListener('slide.bs.carousel', (e) => {
                const cards = e.relatedTarget.querySelectorAll('.testimonial-card');
                cards.forEach((card, index) => {
                    setTimeout(() => {
                        card.style.opacity = '0';
                        card.style.transform = 'translateY(20px)';
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                        }, 50);
                    }, index * 50);
                });
            });
        }
    }

    // ===== PAGE LOAD ANIMATION =====
    function initPageLoadAnimation() {
        // Check if user prefers reduced motion
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            document.body.classList.add('page-loaded');
            return;
        }

        // Create loader
        const loader = document.createElement('div');
        loader.className = 'page-loader';
        loader.setAttribute('aria-label', 'Loading page');
        loader.innerHTML = `
            <div class="loader-content">
                <div class="loader-spinner" aria-hidden="true"></div>
                <div class="loader-text">SXCCE</div>
            </div>
        `;
        document.body.appendChild(loader);

        // Hide loader when page is loaded
        function hideLoader() {
            loader.classList.add('hidden');
            document.body.classList.add('page-loaded');
            
            // Remove loader from DOM after animation
            setTimeout(() => {
                if (loader.parentNode) {
                    loader.remove();
                }
            }, 500);
        }

        // Check if page is already loaded
        if (document.readyState === 'complete') {
            // Small delay for smooth transition
            setTimeout(hideLoader, 800);
        } else {
            window.addEventListener('load', () => {
                setTimeout(hideLoader, 800);
            });
        }
    }

    // ===== INITIALIZE ALL FEATURES =====
    function init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', init);
            return;
        }

        // Initialize page load animation first
        initPageLoadAnimation();

        // Initialize all features
        initScrollProgress();
        initAnimatedNavbar();
        initSectionReveal();
        initStatCounter();
        initDarkMode();
        initEnhancedCarousel();
        initSmoothScroll();
        enhanceExistingElements();
        initAccessibility();
        initPerformanceOptimizations();

        // Initialize micro-interactions (with delay to ensure images are loaded)
        setTimeout(() => {
            initButtonRipple();
            initCursorGlow();
            initImageParallax();
            initCardTilt();
            initTestimonials();
            initYouTubeEmbeds();
        }, 100);

        console.log('✅ Enhanced features initialized');
    }

    // Start initialization
    init();

    // Export functions for external use if needed
    window.SXCCEEnhanced = {
        initScrollProgress,
        initAnimatedNavbar,
        initSectionReveal,
        initStatCounter,
        initDarkMode,
        animateCounter,
        initButtonRipple,
        initCursorGlow,
        initImageParallax,
        initCardTilt,
        initPageLoadAnimation
    };

})();

