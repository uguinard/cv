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
    
    // Objeto para caché de traducciones
    const loadedTranslations = {};

// Función para obtener traducciones embebidas como fallback
function getEmbeddedTranslations(lang) {
    const translations = {
        'en': {
            "nav_profile": "Profile",
            "nav_experience": "Experience", 
            "nav_education": "Education",
            "nav_skills": "Skills",
            "nav_languages": "Languages",
            "profile_title": "Profile",
            "profile_text": "With an international background in language education, I am guided by a holistic approach to design lessons that integrate the social, emotional, cognitive, and cultural dimensions of learning. Inspired by the values of respect, compassion, and integrity, I strive to create inclusive and culturally responsive learning environments that celebrate multicultural connections and foster a sense of global citizenship."
        },
        'es': {
            "nav_profile": "Perfil",
            "nav_experience": "Experiencia",
            "nav_education": "Educación", 
            "nav_skills": "Habilidades",
            "nav_languages": "Idiomas",
            "profile_title": "Perfil",
            "profile_text": "Con una formación internacional en educación de idiomas, me guío por un enfoque holístico para diseñar lecciones que integren las dimensiones sociales, emocionales, cognitivas y culturales del aprendizaje. Inspirado por los valores de respeto, compasión e integridad, me esfuerzo por crear entornos de aprendizaje inclusivos y culturalmente receptivos que celebren las conexiones multiculturales y fomenten un sentido de ciudadanía global."
        }
    };
    
    return translations[lang] || translations['en'];
}

    const switchLanguage = async (lang) => {
        // 1. Pone el atributo 'dir' (RTL/LTR)
        document.body.dir = (lang === 'ar') ? 'rtl' : 'ltr';
        
        // 2. Guarda la preferencia
        localStorage.setItem('cv-lang', lang);
        languageSelect.value = lang;

    // 3. Carga las traducciones desde datos embebidos
    if (!loadedTranslations[lang]) {
        try {
            // Intentar cargar desde archivo JSON primero
            const response = await fetch(`locales/${lang}.json`);
            if (response.ok) {
                loadedTranslations[lang] = await response.json();
            } else {
                throw new Error(`Could not load ${lang}.json`);
            }
        } catch (error) {
            console.error('Error loading JSON, using embedded translations:', error);
            // Usar traducciones embebidas como fallback
            loadedTranslations[lang] = getEmbeddedTranslations(lang);
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

    // --- 2.1. FUNCIONALIDAD DE IMPRIMIR AL HACER CLIC EN LA IMAGEN ---
    const profileImg = document.getElementById('profile-img');
    if (profileImg) {
        profileImg.addEventListener('click', () => {
            window.print();
        });
        
        // Deshabilitar clic derecho en la imagen
        profileImg.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            return false;
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
