document.addEventListener('DOMContentLoaded', function () {

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

    // --- 3. ANIMACIÓN FADE-IN AL HACER SCROLL (ORIGINAL) ---
    const animatedSections = document.querySelectorAll('.section');
    const animationObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    animatedSections.forEach(section => {
        animationObserver.observe(section);
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
                    }
                });
            }
        });
    }, navObserverOptions);

    sectionsForNav.forEach(section => {
        navObserver.observe(section);
    });

    // --- PROTECCIÓN DE IMAGEN ---
    // Deshabilitar clic derecho en toda la página
    document.addEventListener('contextmenu', function(e) {
        e.preventDefault();
        return false;
    });

    // Deshabilitar teclas de acceso rápido para herramientas de desarrollador
    document.addEventListener('keydown', function(e) {
        // Deshabilitar F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U
        if (e.key === 'F12' || 
            (e.ctrlKey && e.shiftKey && e.key === 'I') ||
            (e.ctrlKey && e.shiftKey && e.key === 'J') ||
            (e.ctrlKey && e.key === 'u')) {
            e.preventDefault();
            return false;
        }
    });

    // Proteger contra arrastre de imagen
    document.addEventListener('dragstart', function(e) {
        if (e.target.tagName === 'IMG') {
            e.preventDefault();
            return false;
        }
    });

    // Proteger contra selección de texto en imagen
    document.addEventListener('selectstart', function(e) {
        if (e.target.tagName === 'IMG') {
            e.preventDefault();
            return false;
        }
    });

    // Deshabilitar guardar página
    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey && (e.key === 's' || e.key === 'S')) {
            e.preventDefault();
            return false;
        }
    });

});
