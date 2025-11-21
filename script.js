/* 
© 2024 Sergio Uribe Guinard. All rights reserved.
SUG2024-AB7C9D2E-F8A1B3C5
*/

// Initialize Lucide Icons
lucide.createIcons();

document.addEventListener('DOMContentLoaded', function () {
    
    // PWA Install Prompt Management
    let deferredPrompt;
    let installBannerShown = false;

    // Listen for the beforeinstallprompt event
    window.addEventListener('beforeinstallprompt', (e) => {
        // Prevent the mini-infobar from appearing on mobile
        e.preventDefault();
        // Store the event so it can be triggered later
        deferredPrompt = e;
        
        // Show install banner after user has been on site for a bit
        setTimeout(() => {
            if (!installBannerShown && !window.matchMedia('(display-mode: standalone)').matches) {
                showPWAInstallBanner();
            }
        }, 5000); // Show after 5 seconds
    });

    // Listen for successful app installation
    window.addEventListener('appinstalled', (evt) => {
        console.log('🎉 CV was successfully installed as a PWA');
        hidePWAInstallBanner();
        
        // Track installation analytics (you can add your analytics here)
        if (typeof gtag !== 'undefined') {
            gtag('event', 'pwa_install', {
                event_category: 'PWA',
                event_label: 'CV Installation'
            });
        }
    });

    // Show PWA Install Banner
    function showPWAInstallBanner() {
        if (installBannerShown) return;
        
        const banner = document.createElement('div');
        banner.className = 'pwa-install-banner';
        banner.innerHTML = `
            <img src="profile-small.jpg" alt="CV Icon" class="pwa-install-icon">
            <div class="pwa-install-content">
                <div class="pwa-install-title">Install CV App</div>
                <div class="pwa-install-text">Install this CV for quick offline access and app-like experience</div>
                <div class="pwa-install-actions">
                    <button class="pwa-install-btn primary" onclick="installPWA()">Install</button>
                    <button class="pwa-install-btn" onclick="dismissPWAInstall()">Not Now</button>
                </div>
            </div>
            <button class="pwa-install-close" onclick="dismissPWAInstall()" aria-label="Close install banner">&times;</button>
        `;
        
        document.body.appendChild(banner);
        
        // Trigger animation
        setTimeout(() => banner.classList.add('show'), 100);
        
        installBannerShown = true;
    }

    // Hide PWA Install Banner
    function hidePWAInstallBanner() {
        const banner = document.querySelector('.pwa-install-banner');
        if (banner) {
            banner.classList.remove('show');
            setTimeout(() => banner.remove(), 300);
        }
    }

    // Install PWA function (global scope for onclick handlers)
    window.installPWA = async function() {
        if (!deferredPrompt) {
            console.log('PWA installation not available');
            return;
        }
        
        try {
            // Show the install prompt
            deferredPrompt.prompt();
            
            // Wait for the user to respond to the prompt
            const { outcome } = await deferredPrompt.userChoice;
            
            console.log(`PWA installation ${outcome}`);
            
            // Clear the deferred prompt
            deferredPrompt = null;
            hidePWAInstallBanner();
            
        } catch (error) {
            console.error('PWA installation failed:', error);
        }
    };

    // Dismiss PWA Install function (global scope for onclick handlers)
    window.dismissPWAInstall = function() {
        hidePWAInstallBanner();
        installBannerShown = true; // Don't show again in this session
        
        // Optional: Set a flag to not show for a certain period
        localStorage.setItem('pwa-install-dismissed', Date.now().toString());
    };

    // ===========================================
    // MOBILE NAVIGATION & TOUCH INTERACTIONS
    // ===========================================
    
    // Mobile navigation state
    let mobileNav = {
        isMobile: window.innerWidth <= 768,
        currentSection: 'profile',
        swipeStartX: 0,
        swipeStartY: 0,
        fabMenuOpen: false,
        touchStartTime: 0
    };
    
    // Initialize mobile navigation
    function initMobileNavigation() {
        // Check if mobile view
        updateMobileState();
        
        // Show/hide mobile navigation based on screen size
        window.addEventListener('resize', updateMobileState);
        
        // Initialize mobile navigation events
        initBottomNavigation();
        initFloatingActionButton();
        initSwipeGestures();
        initTouchFeedback();
        initMobileOptimizations();
    }
    
    // Add mobile navigation styles to the context menu
    const mobileContextMenuStyle = `
        .mobile-context-menu {
            position: fixed;
            background: var(--surface);
            border: 1px solid var(--border);
            border-radius: 8px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.15);
            z-index: 10000;
            min-width: 150px;
            overflow: hidden;
        }
        
        .context-menu-item {
            padding: 12px 16px;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 10px;
            font-size: 14px;
            color: var(--text-primary);
            transition: background-color 0.2s;
        }
        
        .context-menu-item:hover {
            background-color: var(--border);
        }
        
        .context-menu-item i {
            width: 16px;
            text-align: center;
            color: var(--accent);
        }
    `;
    
    // Inject mobile context menu styles
    const style = document.createElement('style');
    style.textContent = mobileContextMenuStyle;
    document.head.appendChild(style);

    // Initialize mobile navigation when DOM is loaded
    // Add this call after the existing DOMContentLoaded event listener
    // Make sure this is called after the PWA install prompt setup
    setTimeout(() => {
        initMobileNavigation();
    }, 1000);
    
    // Update mobile navigation state
    function updateMobileState() {
        const wasMobile = mobileNav.isMobile;
        mobileNav.isMobile = window.innerWidth <= 768;
        
        const bottomNav = document.querySelector('.mobile-bottom-nav');
        const fabContainer = document.querySelector('.mobile-fab-container');
        const swipeIndicator = document.querySelector('.swipe-indicator');
        
        if (mobileNav.isMobile) {
            // Show mobile navigation elements
            if (bottomNav) bottomNav.classList.add('show');
            if (fabContainer) fabContainer.style.display = 'block';
            
            // Keep main navigation visible but make it more compact
            const mainNav = document.querySelector('.main-nav');
            if (mainNav) mainNav.style.display = 'flex';
            
            // Show swipe indicator after a delay
            setTimeout(() => {
                if (swipeIndicator) {
                    swipeIndicator.classList.add('show');
                    setTimeout(() => {
                        if (swipeIndicator) swipeIndicator.classList.remove('show');
                    }, 3000);
                }
            }, 2000);
            
        } else {
            // Show desktop navigation on larger screens
            if (bottomNav) bottomNav.classList.remove('show');
            if (fabContainer) fabContainer.style.display = 'none';
            
            const mainNav = document.querySelector('.main-nav');
            if (mainNav) mainNav.style.display = 'flex';
        }
        
        // Update touch targets for accessibility
        if (mobileNav.isMobile !== wasMobile) {
            updateTouchTargets();
        }
    }
    
    // Initialize bottom navigation
    function initBottomNavigation() {
        const navItems = document.querySelectorAll('.mobile-nav-item');
        
        navItems.forEach(item => {
            item.addEventListener('click', handleMobileNavClick);
            item.addEventListener('touchstart', handleTouchStart, { passive: true });
            item.addEventListener('touchend', handleTouchEnd);
        });
    }
    
    // Handle mobile navigation clicks
    function handleMobileNavClick(event) {
        const button = event.currentTarget;
        const section = button.dataset.section;
        const action = button.dataset.action;
        
        // Haptic feedback if supported
        if (navigator.vibrate) {
            navigator.vibrate(10);
        }
        
        if (section) {
            // Navigate to section
            navigateToSection(section);
            updateActiveNavItem(button);
            
        } else if (action === 'contact') {
            // Open contact popup
            openContactPopup();
            updateActiveNavItem(button);
        }
        
        // Visual feedback
        button.style.transform = 'scale(0.95)';
        setTimeout(() => {
            button.style.transform = '';
        }, 150);
    }
    
    // Navigate to section with smooth scrolling
    function navigateToSection(sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
            section.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            
            // Update current section
            mobileNav.currentSection = sectionId;
            
            // Update URL without page jump
            history.pushState(null, null, `#${sectionId}`);
        }
    }
    
    // Update active navigation item
    function updateActiveNavItem(activeItem) {
        document.querySelectorAll('.mobile-nav-item').forEach(item => {
            item.classList.remove('active');
        });
        activeItem.classList.add('active');
    }
    
    // Initialize floating action button
    function initFloatingActionButton() {
        const fab = document.getElementById('mobile-fab');
        const fabMenu = document.getElementById('mobile-fab-menu');
        
        if (fab && fabMenu) {
            fab.addEventListener('click', toggleFabMenu);
            
            // Show FAB after a delay on mobile
            setTimeout(() => {
                if (mobileNav.isMobile) {
                    fab.classList.add('show');
                }
            }, 3000);
            
            // Handle FAB action clicks
            const fabActions = fabMenu.querySelectorAll('.fab-action');
            fabActions.forEach(action => {
                action.addEventListener('click', handleFabAction);
            });
            
            // Close FAB menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!fab.contains(e.target) && !fabMenu.contains(e.target)) {
                    closeFabMenu();
                }
            });
        }
    }
    
    // Toggle FAB menu
    function toggleFabMenu() {
        const fab = document.getElementById('mobile-fab');
        const fabMenu = document.getElementById('mobile-fab-menu');
        
        if (fab && fabMenu) {
            mobileNav.fabMenuOpen = !mobileNav.fabMenuOpen;
            
            if (mobileNav.fabMenuOpen) {
                fab.classList.add('active');
                fabMenu.classList.add('show');
                
                // Haptic feedback
                if (navigator.vibrate) {
                    navigator.vibrate([10, 50, 10]);
                }
                
            } else {
                fab.classList.remove('active');
                fabMenu.classList.remove('show');
            }
        }
    }
    
    // Close FAB menu
    function closeFabMenu() {
        const fab = document.getElementById('mobile-fab');
        const fabMenu = document.getElementById('mobile-fab-menu');
        
        if (fab && fabMenu) {
            mobileNav.fabMenuOpen = false;
            fab.classList.remove('active');
            fabMenu.classList.remove('show');
        }
    }
    
    // Handle FAB actions
    function handleFabAction(event) {
        const action = event.currentTarget.dataset.action;
        
        // Haptic feedback
        if (navigator.vibrate) {
            navigator.vibrate(5);
        }
        
        switch (action) {
            case 'share':
                handleShareAction();
                break;
            case 'print':
                handlePrintAction();
                break;
            case 'theme':
                handleThemeAction();
                break;
            case 'languages':
                handleLanguageAction();
                break;
        }
        
        closeFabMenu();
    }
    
    // Handle share action
    function handleShareAction() {
        if (navigator.share) {
            navigator.share({
                title: 'Sergio Uribe Guinard - CV',
                text: 'Check out this professional CV',
                url: window.location.href
            }).catch(console.error);
        } else {
            // Fallback to our sharing functionality
            const shareDropdown = document.querySelector('.share-dropdown');
            if (shareDropdown) {
                shareDropdown.setAttribute('aria-hidden', 'false');
            }
        }
    }
    
    // Handle print action
    function handlePrintAction() {
        window.print();
    }
    
    // Handle theme action
    function handleThemeAction() {
        const themeToggleBtn = document.getElementById('theme-toggle-btn');
        if (themeToggleBtn) {
            themeToggleBtn.click();
        }
    }
    
    // Handle language action
    function handleLanguageAction() {
        const languageSelect = document.getElementById('language-select');
        if (languageSelect) {
            languageSelect.click();
        }
    }
    
    // Initialize swipe gestures
    function initSwipeGestures() {
        const mainContent = document.querySelector('.container');
        
        if (mainContent) {
            let startX, startY, startTime;
            
            mainContent.addEventListener('touchstart', (e) => {
                startX = e.touches[0].clientX;
                startY = e.touches[0].clientY;
                startTime = Date.now();
                mobileNav.touchStartTime = startTime;
            }, { passive: true });
            
            mainContent.addEventListener('touchend', (e) => {
                if (!startX || !startY) return;
                
                const endX = e.changedTouches[0].clientX;
                const endY = e.changedTouches[0].clientY;
                const deltaX = endX - startX;
                const deltaY = endY - startY;
                const deltaTime = Date.now() - startTime;
                
                // Determine if it's a swipe (fast movement)
                if (deltaTime < 300 && Math.abs(deltaX) > 50 && Math.abs(deltaY) < 100) {
                    handleSwipeGesture(deltaX);
                }
                
                startX = startY = null;
            }, { passive: true });
        }
    }
    
    // Handle swipe gestures
    function handleSwipeGesture(deltaX) {
        const sections = ['profile', 'experience', 'education', 'skills', 'languages', 'resources', 'videos'];
        const currentIndex = sections.indexOf(mobileNav.currentSection);
        
        let nextIndex;
        if (deltaX > 0) {
            // Swipe right - previous section
            nextIndex = Math.max(0, currentIndex - 1);
        } else {
            // Swipe left - next section
            nextIndex = Math.min(sections.length - 1, currentIndex + 1);
        }
        
        if (nextIndex !== currentIndex) {
            const nextSection = sections[nextIndex];
            navigateToSection(nextSection);
            updateMobileNavActiveItem(nextSection);
            
            // Haptic feedback
            if (navigator.vibrate) {
                navigator.vibrate(15);
            }
        }
    }
    
    // Update mobile navigation active item
    function updateMobileNavActiveItem(sectionId) {
        document.querySelectorAll('.mobile-nav-item[data-section]').forEach(item => {
            item.classList.remove('active');
            if (item.dataset.section === sectionId) {
                item.classList.add('active');
            }
        });
    }
    
    // Initialize touch feedback
    function initTouchFeedback() {
        // Add visual feedback for all interactive elements
        const interactiveElements = document.querySelectorAll(
            'button, .nav-link, .skill, .print-button, .theme-toggle-button'
        );
        
        interactiveElements.forEach(element => {
            element.addEventListener('touchstart', (e) => {
                element.style.transform = 'scale(0.98)';
                element.style.transition = 'transform 0.1s ease';
            }, { passive: true });
            
            element.addEventListener('touchend', (e) => {
                element.style.transform = '';
            }, { passive: true });
            
            element.addEventListener('touchcancel', (e) => {
                element.style.transform = '';
            }, { passive: true });
        });
    }
    
    // Handle touch start
    function handleTouchStart(event) {
        mobileNav.touchStartTime = Date.now();
    }
    
    // Handle touch end with duration check
    function handleTouchEnd(event) {
        const touchDuration = Date.now() - mobileNav.touchStartTime;
        
        // If it's a long press, show additional options
        if (touchDuration > 500) {
            handleLongPress(event.currentTarget);
        }
    }
    
    // Handle long press
    function handleLongPress(element) {
        const section = element.dataset.section;
        if (section) {
            // Show context menu or additional options
            showSectionContextMenu(section, element);
            
            // Haptic feedback
            if (navigator.vibrate) {
                navigator.vibrate([20, 50, 20]);
            }
        }
    }
    
    // Show section context menu
    function showSectionContextMenu(section, element) {
        // Create a simple context menu
        const menu = document.createElement('div');
        menu.className = 'mobile-context-menu';
        menu.innerHTML = `
            <div class="context-menu-item" onclick="navigateToSection('${section}')">
                <i class="fas fa-eye"></i> View Details
            </div>
            <div class="context-menu-item" onclick="shareSection('${section}')">
                <i class="fas fa-share"></i> Share Section
            </div>
        `;
        
        document.body.appendChild(menu);
        
        // Position menu near the element
        const rect = element.getBoundingClientRect();
        menu.style.top = `${rect.bottom + 10}px`;
        menu.style.left = `${rect.left}px`;
        
        // Auto-hide after 3 seconds
        setTimeout(() => {
            if (menu.parentNode) {
                menu.parentNode.removeChild(menu);
            }
        }, 3000);
    }
    
    // Initialize mobile optimizations
    function initMobileOptimizations() {
        // Prevent zoom on double tap
        let lastTouchEnd = 0;
        document.addEventListener('touchend', (event) => {
            const now = Date.now();
            if (now - lastTouchEnd <= 300) {
                event.preventDefault();
            }
            lastTouchEnd = now;
        }, false);
        
        // Handle viewport changes
        window.addEventListener('orientationchange', () => {
            setTimeout(() => {
                updateMobileState();
                window.scrollTo(0, 0);
            }, 500);
        });
        
        // Optimize scroll performance
        let ticking = false;
        function updateScrollPosition() {
            updateActiveSectionOnScroll();
            ticking = false;
        }
        
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(updateScrollPosition);
                ticking = true;
            }
        });
    }
    
    // Update active section based on scroll position
    function updateActiveSectionOnScroll() {
        const sections = document.querySelectorAll('.section');
        const scrollPosition = window.scrollY + 200;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionBottom = sectionTop + section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                const sectionId = section.id;
                if (sectionId && sectionId !== mobileNav.currentSection) {
                    mobileNav.currentSection = sectionId;
                    updateMobileNavActiveItem(sectionId);
                }
            }
        });
    }
    
    // Update touch targets for better accessibility
    function updateTouchTargets() {
        const touchTargets = document.querySelectorAll('a, button, input, select, textarea');
        touchTargets.forEach(target => {
            const computedStyle = window.getComputedStyle(target);
            const minHeight = parseInt(computedStyle.minHeight) || 0;
            const minWidth = parseInt(computedStyle.minWidth) || 0;
            
            // Ensure minimum touch target size of 44px
            if (minHeight < 44) {
                target.style.minHeight = '44px';
            }
            if (minWidth < 44) {
                target.style.minWidth = '44px';
            }
        });
    }
    
    // Open contact popup (mobile optimized)
    function openContactPopup() {
        const contactPopup = document.getElementById('contact-popup');
        if (contactPopup) {
            contactPopup.classList.add('active');
            // Focus management for accessibility
            const closeBtn = contactPopup.querySelector('#contact-popup-close');
            if (closeBtn) closeBtn.focus();
        }
    }
    
    // Global functions for mobile context menu
    window.navigateToSection = navigateToSection;
    window.shareSection = function(sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
            const text = section.textContent.substring(0, 100) + '...';
            if (navigator.share) {
                navigator.share({
                    title: `CV Section: ${sectionId}`,
                    text: text,
                    url: `${window.location.href}#${sectionId}`
                });
            }
        }
    };

    // --- 1. LÓGICA DE TRADUCCIÓN (NUEVA) ---
    const languageSelect = document.getElementById('language-select');
    const translatableElements = document.querySelectorAll('[data-lang-key]');

    // --- 2. LÓGICA DEL MODO OSCURO (NUEVA) ---
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    const themeToggleIcon = document.getElementById('theme-toggle-icon');
    const body = document.body;

    // Función para actualizar el tema y el icono
    const updateTheme = (theme) => {
        if (theme === 'dark') {
            body.classList.add('dark-mode');
            themeToggleIcon.setAttribute('data-lucide', 'sun'); // Cambia a icono de sol en modo oscuro
            localStorage.setItem('theme', 'dark');
        } else {
            body.classList.remove('dark-mode');
            themeToggleIcon.setAttribute('data-lucide', 'moon'); // Cambia a icono de luna en modo claro
            localStorage.setItem('theme', 'light');
        }
        // Re-initialize Lucide icons after changing
        lucide.createIcons();
    };

    // Carga inicial del tema
    // 1. Revisa si hay una preferencia guardada en localStorage
    let currentTheme = localStorage.getItem('theme');
    
    // 2. Si no hay guardada, revisa la preferencia del sistema
    if (!currentTheme) {
        currentTheme = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    // 3. Aplica el tema al cargar la página
    updateTheme(currentTheme);

    // Event listener para el botón
    themeToggleBtn.addEventListener('click', () => {
        // Revisa cuál es el tema *actual* y cámbialo al opuesto
        const newTheme = body.classList.contains('dark-mode') ? 'light' : 'dark';
        updateTheme(newTheme);
    });
    // --- FIN DE LA LÓGICA DEL MODO OSCURO ---
    
    // Objeto para caché de traducciones
    const loadedTranslations = {};

    const switchLanguage = async (lang) => {
        // 1. Pone el atributo 'dir' (RTL/LTR)
        document.body.dir = (lang === 'ar') ? 'rtl' : 'ltr';
        
        // 2. Guarda la preferencia
        localStorage.setItem('cv-lang', lang);
        languageSelect.value = lang;

        // 3. Carga el archivo JSON si no está en caché
        if (!loadedTranslations[lang]) {
            try {
                const response = await fetch(`locales/${lang}.json`);
                if (!response.ok) {
                    throw new Error(`Could not load ${lang}.json`);
                }
                loadedTranslations[lang] = await response.json();
            } catch (error) {
                console.error(error);
                // Si falla, vuelve a cargar inglés como fallback
                if (lang !== 'en') {
                    // Solo intenta cargar inglés si el idioma fallido no era inglés
                    try {
                        const fallbackResponse = await fetch('locales/en.json');
                        if (fallbackResponse.ok) {
                            loadedTranslations['en'] = await fallbackResponse.json();
                        }
                    } catch (fallbackError) {
                        console.error('Failed to load fallback language:', fallbackError);
                    }
                }
                return;
            }
        }
        
        const langTranslations = loadedTranslations[lang];

        // 4. Aplica las traducciones
        translatableElements.forEach(el => {
            const key = el.getAttribute('data-lang-key');
            if (langTranslations && langTranslations[key]) {
                el.innerText = langTranslations[key];
            }
        });
        
        // 5. Aplica las traducciones al template de impresión
        const printTemplateElements = document.querySelectorAll('.print-template [data-lang-key]');
        printTemplateElements.forEach(el => {
            const key = el.getAttribute('data-lang-key');
            if (langTranslations && langTranslations[key]) {
                el.innerText = langTranslations[key];
            }
        });
    };

    languageSelect.addEventListener('change', (e) => {
        switchLanguage(e.target.value);
    });

    // Carga inicial
    const storedLang = localStorage.getItem('cv-lang');
    // Revisa si el idioma del navegador existe en el <select>
    const browserLang = navigator.language.split('-')[0];
    const langExists = languageSelect.querySelector(`[value="${browserLang}"]`);
    
    const initialLang = storedLang || (langExists ? browserLang : 'en');
    
    // Inicia la carga del idioma
    switchLanguage(initialLang);

    
    // --- 2. FUNCIONALIDAD DEL BOTÓN DE IMPRIMIR (ORIGINAL) ---
    const printButton = document.getElementById('print-btn');
    if (printButton) {
        printButton.addEventListener('click', () => {
            window.print();
        });
    }

    // --- 3. ENHANCED ANIMATIONS & MICRO-INTERACTIONS ---
    const animatedSections = document.querySelectorAll('.section');
    const animationObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');

                // Timeline animations
                if (entry.target.id === 'experience') {
                    const timelineItems = entry.target.querySelectorAll('.timeline-item');
                    timelineItems.forEach((item, index) => {
                        setTimeout(() => {
                            item.classList.add('visible');
                        }, index * 200);
                    });
                }

                // Add staggered animation for skill tags
                if (entry.target.id === 'skills') {
                    const skillTags = entry.target.querySelectorAll('.skill-tag');
                    skillTags.forEach((tag, index) => {
                        setTimeout(() => {
                            tag.style.transform = 'translateY(0) scale(1)';
                            tag.style.opacity = '1';
                        }, index * 50);
                    });
                }
            }
        });
    }, { threshold: 0.1, rootMargin: '-50px 0px' });

    animatedSections.forEach(section => {
        animationObserver.observe(section);
    });

    // Enhanced skill tags animation
    const skillTags = document.querySelectorAll('.skill');
    skillTags.forEach(tag => {
        tag.style.transform = 'translateY(-3px) scale(1)';
        tag.style.opacity = '0.8';
        tag.style.transition = 'all 0.3s ease';
    });

    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start',
                    inline: 'nearest'
                });
                
                // Update active state
                navLinks.forEach(nav => nav.classList.remove('active'));
                link.classList.add('active');
            }
        });
    });

    // --- 4. ENHANCED NAVIGATION & INTERSECTION OBSERVER ---
    const allNavLinks = document.querySelectorAll('.nav-link');
    const sectionsForNav = document.querySelectorAll('section[id]');
    const navObserverOptions = {
        rootMargin: '-40% 0px -60% 0px'
    };

    const navObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                allNavLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, navObserverOptions);

    sectionsForNav.forEach(section => {
        navObserver.observe(section);
    });

    

    // --- PROTECCIÓN AVANZADA DE LA IMAGEN DE PERFIL ---
    const profileImg = document.querySelector('.profile-img-bg');
    const profileContainer = document.querySelector('.profile-img-container');
    
    // Prevenir clic derecho en toda la página cuando está sobre la imagen
    document.addEventListener('contextmenu', function(e) {
        if (e.target === profileImg || profileContainer.contains(e.target)) {
            e.preventDefault();
            return false;
        }
    });
    
    // Prevenir arrastrar la imagen
    document.addEventListener('dragstart', function(e) {
        if (e.target === profileImg || profileContainer.contains(e.target)) {
            e.preventDefault();
            return false;
        }
    });
    
    // Prevenir selección de la imagen
    document.addEventListener('selectstart', function(e) {
        if (e.target === profileImg || profileContainer.contains(e.target)) {
            e.preventDefault();
            return false;
    

    // Keyboard Shortcuts
    document.addEventListener('keydown', (e) => {
        // Only trigger shortcuts when not typing in input fields
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable) {
            return;
        }

        // Ctrl/Cmd + P for print
        if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
            e.preventDefault();
            window.print();
        }

        // Ctrl/Cmd + T for theme toggle
        if ((e.ctrlKey || e.metaKey) && e.key === 't') {
            e.preventDefault();
            const themeToggleBtn = document.getElementById('theme-toggle-btn');
            if (themeToggleBtn) {
                themeToggleBtn.click();
            }
        }

        // Number keys for navigation
        if (!e.ctrlKey && !e.metaKey && !e.altKey) {
            const navLinks = [
                { key: '1', id: 'profile' },
                { key: '2', id: 'experience' },
                { key: '3', id: 'education' },
                { key: '4', id: 'skills' },
                { key: '5', id: 'languages' },
                { key: '6', id: 'resources' },
                { key: '7', id: 'videos' }
            ];

            const navMapping = navLinks.find(nav => nav.key === e.key);
            if (navMapping) {
                const targetElement = document.getElementById(navMapping.id);
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        }
    });

    // ESC key to close any active modals
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            // Handle any escape key functionality here if needed
        }
    });
        }
    });
    
    // Prevenir atajos de teclado cuando está enfocada la imagen
    document.addEventListener('keydown', function(e) {
        if ((e.ctrlKey || e.metaKey) && (e.key === 'c' || e.key === 'x' || e.key === 's' || e.key === 'a')) {
            if (e.target === profileImg || profileContainer.contains(e.target)) {
                e.preventDefault();
                return false;
            }
        }
    });
    
    // Marcar intentos sospechosos
    let rightClickAttempts = 0;
    if (profileContainer) {
        profileContainer.addEventListener('mousedown', function(e) {
            if (e.button === 2) { // Clic derecho
                rightClickAttempts++;
                if (rightClickAttempts > 2) {
                    console.log('⚠️ Múltiples intentos de acceso no autorizado detectados');
                }
            }
        });
    }

});
