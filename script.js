document.addEventListener('DOMContentLoaded', function () {
    // Performance optimization: Use requestIdleCallback for non-critical tasks
    const runWhenIdle = (callback) => {
        if ('requestIdleCallback' in window) {
            requestIdleCallback(callback);
        } else {
            setTimeout(callback, 1);
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
        
        // Analytics: Track theme toggle
        gtag('event', 'theme_toggle', {
            event_category: 'User Interaction',
            event_label: newTheme,
            value: 1
        });
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

        // 3. Carga el archivo JSON si no está en caché (con optimización de performance)
        if (!loadedTranslations[lang]) {
            try {
                // Use AbortController for timeout
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 5000); // 5s timeout
                
                const response = await fetch(`locales/${lang}.json`, {
                    signal: controller.signal,
                    cache: 'force-cache' // Use browser cache when available
                });
                clearTimeout(timeoutId);
                
                if (!response.ok) {
                    throw new Error(`Could not load ${lang}.json`);
                }
                loadedTranslations[lang] = await response.json();
            } catch (error) {
                console.error('Translation loading error:', error);
                // Si falla, vuelve a cargar inglés como fallback
                if (lang !== 'en') {
                    await switchLanguage('en');
                }
                return;
            }
        }
        
        const langTranslations = loadedTranslations[lang];

        // 4. Aplica las traducciones (optimizado con DocumentFragment)
        const fragment = document.createDocumentFragment();
        const tempDiv = document.createElement('div');
        
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

    // Analytics: Track language changes
    languageSelect.addEventListener('change', (e) => {
        gtag('event', 'language_change', {
            event_category: 'User Interaction',
            event_label: e.target.value,
            value: 1
        });
    });

    
    // --- 2. FUNCIONALIDAD DEL BOTÓN DE IMPRIMIR (ORIGINAL) ---
    const printButton = document.getElementById('print-btn');
    if (printButton) {
        printButton.addEventListener('click', () => {
            // Analytics: Track print action
            gtag('event', 'print_cv', {
                event_category: 'User Action',
                event_label: 'Print CV',
                value: 1
            });
            window.print();
        });
    }

    // --- 3. ANIMACIÓN FADE-IN AL HACER SCROLL (OPTIMIZADO) ---
    const animatedSections = document.querySelectorAll('.section');
    const animationObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Stop observing once animated to improve performance
                animationObserver.unobserve(entry.target);
            }
        });
    }, { 
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px' // Trigger slightly before element is fully visible
    });

    // Use requestIdleCallback for non-critical animations
    runWhenIdle(() => {
        animatedSections.forEach(section => {
            animationObserver.observe(section);
        });
    });

    // --- 4. RESALTADO DEL LINK DE NAVEGACIÓN ACTIVO (ORIGINAL) ---
    const navLinks = document.querySelectorAll('.nav-link');
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
                        
                        // Analytics: Track section views
                        gtag('event', 'section_view', {
                            event_category: 'Navigation',
                            event_label: id,
                            value: 1
                        });
                    }
                });
            }
        });
    }, navObserverOptions);

    sectionsForNav.forEach(section => {
        navObserver.observe(section);
    });

});
