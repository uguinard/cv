document.addEventListener('DOMContentLoaded', function () {
    // 🚀 Performance optimization: Use requestAnimationFrame for smooth animations
    let animationFrameId;
    
    // Performance: Debounce scroll events
    let scrollTimeout;
    const debounce = (func, wait) => {
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(scrollTimeout);
                func(...args);
            };
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(later, wait);
        };
    };
    
    // 📱 Mobile Touch Optimization
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    // Touch event optimization
    if (isTouch) {
        document.body.classList.add('touch-device');
        
        // Prevent zoom on double tap
        let lastTouchEnd = 0;
        document.addEventListener('touchend', function (event) {
            const now = (new Date()).getTime();
            if (now - lastTouchEnd <= 300) {
                event.preventDefault();
            }
            lastTouchEnd = now;
        }, false);
        
        // Optimize touch interactions
        const touchElements = document.querySelectorAll('a, button, .skill, .nav-link');
        touchElements.forEach(element => {
            element.addEventListener('touchstart', function() {
                this.classList.add('touch-active');
            });
            
            element.addEventListener('touchend', function() {
                setTimeout(() => {
                    this.classList.remove('touch-active');
                }, 150);
            });
        });
    }
    
    // --- 1. LÓGICA DE TRADUCCIÓN (NUEVA) ---
    const languageSelect = document.getElementById('language-select');
    const translatableElements = document.querySelectorAll('[data-lang-key]');

    // --- 2. LÓGICA DEL MODO OSCURO (NUEVA) ---
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    const themeToggleIcon = document.getElementById('theme-toggle-icon');
    const body = document.body;
    
    // Add loading state management
    const showLoading = () => {
        document.body.classList.add('loading');
    };
    
    const hideLoading = () => {
        document.body.classList.remove('loading');
    };

    // Función para actualizar el tema y el icono
    const updateTheme = (theme) => {
        if (theme === 'dark') {
            body.classList.add('dark-mode');
            themeToggleIcon.classList.remove('fa-sun'); // Cambia a icono de luna
            themeToggleIcon.classList.add('fa-moon');
            localStorage.setItem('theme', 'dark');
        } else {
            body.classList.remove('dark-mode');
            themeToggleIcon.classList.remove('fa-moon'); // Cambia a icono de sol
            themeToggleIcon.classList.add('fa-sun');
            localStorage.setItem('theme', 'light');
        }
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
    
    // --- 📱 MOBILE MENU FUNCTIONALITY ---
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Toggle mobile menu
    if (mobileMenuToggle && navMenu) {
        mobileMenuToggle.addEventListener('click', () => {
            const isActive = navMenu.classList.contains('active');
            
            if (isActive) {
                navMenu.classList.remove('active');
                mobileMenuToggle.classList.remove('active');
                mobileMenuToggle.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            } else {
                navMenu.classList.add('active');
                mobileMenuToggle.classList.add('active');
                mobileMenuToggle.setAttribute('aria-expanded', 'true');
                document.body.style.overflow = 'hidden';
            }
        });
        
        // Close menu when clicking on nav links
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                mobileMenuToggle.classList.remove('active');
                mobileMenuToggle.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navMenu.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
                navMenu.classList.remove('active');
                mobileMenuToggle.classList.remove('active');
                mobileMenuToggle.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            }
        });
        
        // Close menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                mobileMenuToggle.classList.remove('active');
                mobileMenuToggle.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            }
        });
    }
    
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
                    await switchLanguage('en');
                }
                return;
            }
        }
        
        const langTranslations = loadedTranslations[lang];

        // 4. Aplica las traducciones
        translatableElements.forEach(el => {
            const key = el.getAttribute('data-lang-key');
            if (langTranslations[key]) {
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

    // --- 3. ANIMACIÓN FADE-IN AL HACER SCROLL (OPTIMIZADA) ---
    const animatedSections = document.querySelectorAll('.section');
    const animationObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Use requestAnimationFrame for smooth animations
                animationFrameId = requestAnimationFrame(() => {
                    entry.target.classList.add('visible');
                    // Performance: Unobserve after animation to reduce overhead
                    animationObserver.unobserve(entry.target);
                });
            }
        });
    }, { 
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    animatedSections.forEach(section => {
        animationObserver.observe(section);
    });
    
    // Add smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // --- 4. RESALTADO DEL LINK DE NAVEGACIÓN ACTIVO (ORIGINAL) ---
    const sectionsForNav = document.querySelectorAll('section[id]'); // Asegúrate que las secciones tengan ID
    const navObserverOptions = {
        rootMargin: '-40% 0px -60% 0px'
    };

    const navObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
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

});
