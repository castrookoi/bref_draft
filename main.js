/**
 * Eshua Ofe Marine Limited - Main JavaScript
 * Handles navigation, mobile drawer, counters, lightbox modal, tabs, form AJAX & scroll interactions
 */

document.addEventListener('DOMContentLoaded', () => {
    // ----------------------------------------------------
    // 1. Sticky Header Scroll Effect
    // ----------------------------------------------------
    const header = document.querySelector('.site-header');
    const backToTopBtn = document.getElementById('backToTop');

    window.addEventListener('scroll', () => {
        const scrollPos = window.scrollY;

        if (header) {
            if (scrollPos > 40) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }

        if (backToTopBtn) {
            if (scrollPos > 400) {
                backToTopBtn.classList.add('show');
            } else {
                backToTopBtn.classList.remove('show');
            }
        }
    }, { passive: true });

    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ----------------------------------------------------
    // 2. Mobile Drawer Navigation
    // ----------------------------------------------------
    const mobileToggleBtn = document.getElementById('mobileToggleBtn');
    const mobileDrawer = document.getElementById('mobileDrawer');
    const drawerOverlay = document.getElementById('drawerOverlay');
    const drawerCloseBtn = document.getElementById('drawerCloseBtn');
    const drawerServicesBtn = document.getElementById('drawerServicesBtn');
    const drawerServicesPanel = document.getElementById('drawerServicesPanel');

    function openMobileDrawer() {
        if (!mobileDrawer || !drawerOverlay) return;
        mobileDrawer.classList.add('active');
        drawerOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
        if (mobileToggleBtn) mobileToggleBtn.setAttribute('aria-expanded', 'true');
    }

    function closeMobileDrawer() {
        if (!mobileDrawer || !drawerOverlay) return;
        mobileDrawer.classList.remove('active');
        drawerOverlay.classList.remove('active');
        document.body.style.overflow = '';
        if (mobileToggleBtn) mobileToggleBtn.setAttribute('aria-expanded', 'false');
    }

    if (mobileToggleBtn) mobileToggleBtn.addEventListener('click', openMobileDrawer);
    if (drawerCloseBtn) drawerCloseBtn.addEventListener('click', closeMobileDrawer);
    if (drawerOverlay) drawerOverlay.addEventListener('click', closeMobileDrawer);

    // Close on ESC key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeMobileDrawer();
            closeLightbox();
        }
    });

    // Drawer Services Accordion
    if (drawerServicesBtn && drawerServicesPanel) {
        drawerServicesBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const isOpen = drawerServicesPanel.classList.toggle('show');
            const chevron = drawerServicesBtn.querySelector('.fa-chevron-down');
            if (chevron) {
                chevron.style.transform = isOpen ? 'rotate(180deg)' : 'rotate(0deg)';
                chevron.style.transition = 'transform 0.2s ease';
            }
        });
    }

    // Close mobile drawer when clicking regular links
    if (mobileDrawer) {
        mobileDrawer.querySelectorAll('a:not(#drawerServicesBtn)').forEach(link => {
            link.addEventListener('click', closeMobileDrawer);
        });
    }

    // ----------------------------------------------------
    // 3. Animated Stats Counters
    // ----------------------------------------------------
    const counters = document.querySelectorAll('.stat-counter');
    if (counters.length > 0) {
        let hasAnimated = false;

        const counterObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !hasAnimated) {
                    hasAnimated = true;
                    counters.forEach(counter => {
                        const target = parseInt(counter.getAttribute('data-target'), 10) || 0;
                        const duration = 1800; // ms
                        const stepTime = 20;
                        const totalSteps = duration / stepTime;
                        const increment = target / totalSteps;
                        let current = 0;

                        const timer = setInterval(() => {
                            current += increment;
                            if (current >= target) {
                                counter.textContent = target + '+';
                                clearInterval(timer);
                            } else {
                                counter.textContent = Math.ceil(current) + '+';
                            }
                        }, stepTime);
                    });
                    observer.disconnect();
                }
            });
        }, { threshold: 0.2 });

        const statsBar = document.querySelector('.stats-bar-wrapper') || counters[0].closest('.stats-card-grid') || counters[0];
        if (statsBar) counterObserver.observe(statsBar);
    }

    // ----------------------------------------------------
    // 4. Tab Switcher (About Page: Values & Policies)
    // ----------------------------------------------------
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');

    if (tabButtons.length > 0) {
        tabButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const targetTab = btn.getAttribute('data-tab');

                tabButtons.forEach(b => b.classList.remove('active'));
                tabPanes.forEach(p => p.classList.remove('active'));

                btn.classList.add('active');
                const activePane = document.getElementById(targetTab);
                if (activePane) activePane.classList.add('active');
            });
        });
    }

    // ----------------------------------------------------
    // 5. Lightbox Modal (For Projects & Policies)
    // ----------------------------------------------------
    const lightbox = document.getElementById('lightboxModal');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxTitle = document.getElementById('lightboxTitle');
    const lightboxDesc = document.getElementById('lightboxDesc');
    const lightboxClose = document.getElementById('lightboxClose');

    window.openLightbox = function(src, title = '', desc = '') {
        if (!lightbox || !lightboxImg) return;
        lightboxImg.src = src;
        if (lightboxTitle) lightboxTitle.textContent = title;
        if (lightboxDesc) lightboxDesc.textContent = desc;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    window.closeLightbox = function() {
        if (!lightbox) return;
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
        setTimeout(() => {
            if (lightboxImg) lightboxImg.src = '';
        }, 200);
    };

    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    if (lightbox) {
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });
    }

    // Auto-bind click triggers for projects and policies
    document.querySelectorAll('[data-lightbox-src]').forEach(item => {
        item.addEventListener('click', () => {
            const src = item.getAttribute('data-lightbox-src');
            const title = item.getAttribute('data-lightbox-title') || '';
            const desc = item.getAttribute('data-lightbox-desc') || '';
            openLightbox(src, title, desc);
        });
    });

    // ----------------------------------------------------
    // 6. Contact Form AJAX Handler
    // ----------------------------------------------------
    const contactForm = document.getElementById('contactForm');
    const successAlert = document.getElementById('formSuccessAlert');
    const errorAlert = document.getElementById('formErrorAlert');

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const origBtnHtml = submitBtn ? submitBtn.innerHTML : 'Send Message';

            // Validate inputs
            const name = (contactForm.querySelector('#name') || {}).value || '';
            const email = (contactForm.querySelector('#email') || {}).value || '';
            const message = (contactForm.querySelector('#message') || {}).value || '';

            if (!name.trim() || !email.trim() || !message.trim()) {
                showAlert(errorAlert, '<i class="fas fa-exclamation-circle"></i> Please fill out all required fields.');
                return;
            }

            // Show loading state
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending message...';
            }

            try {
                const formData = new FormData(contactForm);
                const response = await fetch('send_email.php', {
                    method: 'POST',
                    body: formData
                });

                const result = await response.json();

                if (result.success) {
                    showAlert(successAlert, `<i class="fas fa-check-circle"></i> ${result.message || 'Thank you! Your message has been sent successfully.'}`);
                    contactForm.reset();
                } else {
                    showAlert(errorAlert, `<i class="fas fa-exclamation-circle"></i> ${result.message || 'Failed to send message. Please try again.'}`);
                }
            } catch (err) {
                showAlert(errorAlert, '<i class="fas fa-exclamation-circle"></i> An error occurred while sending. Please call or WhatsApp us directly.');
            } finally {
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = origBtnHtml;
                }
            }
        });
    }

    function showAlert(alertElem, htmlContent) {
        if (!alertElem) return;
        alertElem.innerHTML = htmlContent;
        alertElem.classList.add('show');
        alertElem.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        setTimeout(() => {
            alertElem.classList.remove('show');
        }, 6000);
    }

    // ----------------------------------------------------
    // 7. Hero Background Continuous Video & Image Swap Loop
    // ----------------------------------------------------
    const videoSlide = document.getElementById('heroBgVideoWrap');
    const imageSlide = document.getElementById('heroBgImageWrap');
    const heroVideo = document.getElementById('heroBgVideo');

    if (videoSlide && imageSlide && heroVideo) {
        // Enforce muted & inline playback for HTML5 background autoplay
        heroVideo.muted = true;
        heroVideo.defaultMuted = true;
        heroVideo.setAttribute('playsinline', '');
        heroVideo.setAttribute('webkit-playsinline', '');

        let isVideoActive = true;
        let swapTimeout = null;

        const VIDEO_DURATION = 8000; // Video plays for 8 seconds
        const IMAGE_DURATION = 5000; // Image displays for 5 seconds

        function cycleHeroBackground() {
            if (isVideoActive) {
                // Smoothly swipe/crossfade from video to image
                videoSlide.classList.remove('active');
                imageSlide.classList.add('active');
                try {
                    heroVideo.pause();
                } catch (e) {}
                isVideoActive = false;
                swapTimeout = setTimeout(cycleHeroBackground, IMAGE_DURATION);
            } else {
                // Smoothly swipe/crossfade from image to video
                imageSlide.classList.remove('active');
                videoSlide.classList.add('active');
                try {
                    heroVideo.currentTime = 0;
                    heroVideo.play().catch(() => {});
                } catch (e) {}
                isVideoActive = true;
                swapTimeout = setTimeout(cycleHeroBackground, VIDEO_DURATION);
            }
        }

        // Start initial playback immediately
        videoSlide.classList.add('active');
        imageSlide.classList.remove('active');

        heroVideo.play().then(() => {
            swapTimeout = setTimeout(cycleHeroBackground, VIDEO_DURATION);
        }).catch(() => {
            // If browser autoplay policy blocked autoplay before user interaction:
            // Display image first, then initiate alternating cycle on first user gesture
            imageSlide.classList.add('active');
            videoSlide.classList.remove('active');
            isVideoActive = false;

            const startOnInteraction = () => {
                heroVideo.play().then(() => {
                    imageSlide.classList.remove('active');
                    videoSlide.classList.add('active');
                    isVideoActive = true;
                    if (swapTimeout) clearTimeout(swapTimeout);
                    swapTimeout = setTimeout(cycleHeroBackground, VIDEO_DURATION);
                }).catch(() => {});

                window.removeEventListener('touchstart', startOnInteraction);
                window.removeEventListener('click', startOnInteraction);
                window.removeEventListener('scroll', startOnInteraction);
            };

            window.addEventListener('touchstart', startOnInteraction, { passive: true, once: true });
            window.addEventListener('click', startOnInteraction, { passive: true, once: true });
            window.addEventListener('scroll', startOnInteraction, { passive: true, once: true });
        });
    }
});
