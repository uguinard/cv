/* 
© 2024 Sergio Uribe Guinard. All rights reserved.
SUG2024-AB7C9D2E-F8A1B3C5
*/

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
                // Add staggered animation for skill tags
                if (entry.target.id === 'skills') {
                    const skillTags = entry.target.querySelectorAll('.skill');
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

    // --- 5. FUNCIONALIDAD DEL POPUP DE CONTACTO ---
    const contactBtn = document.getElementById('contact-btn');
    const contactPopup = document.getElementById('contact-popup');
    const contactPopupClose = document.getElementById('contact-popup-close');

    // Abrir popup
    contactBtn.addEventListener('click', () => {
        contactPopup.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevenir scroll del body
    });

    // Cerrar popup con botón X
    contactPopupClose.addEventListener('click', () => {
        contactPopup.classList.remove('active');
        document.body.style.overflow = 'auto';
    });

    // Cerrar popup haciendo clic fuera del contenido
    contactPopup.addEventListener('click', (e) => {
        if (e.target === contactPopup) {
            contactPopup.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });

    // Cerrar popup con tecla ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && contactPopup.classList.contains('active')) {
            contactPopup.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
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
    // --- SOCIAL SHARING & KEYBOARD SHORTCUTS ---
    
    // Social Sharing Functionality
    const shareBtn = document.getElementById('share-btn');
    const shareDropdown = document.getElementById('share-dropdown');
    const shareLinkedin = document.getElementById('share-linkedin');
    const shareTwitter = document.getElementById('share-twitter');
    const shareEmail = document.getElementById('share-email');
    const copyLink = document.getElementById('copy-link');

    if (shareBtn) {
        shareBtn.addEventListener('click', () => {
            const isOpen = shareDropdown.getAttribute('aria-hidden') === 'false';
            shareDropdown.setAttribute('aria-hidden', !isOpen);
        });
    }

    // Share functionality
    const currentUrl = window.location.href;
    const shareData = {
        title: 'Sergio Uribe Guinard - International Education Professional',
        text: 'Check out Sergio Uribe Guinard\'s CV - International Educator with IB & ELE experience',
        url: currentUrl
    };

    if (shareLinkedin) {
        shareLinkedin.href = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`;
    }

    if (shareTwitter) {
        shareTwitter.href = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareData.text)}&url=${encodeURIComponent(currentUrl)}`;
    }

    if (shareEmail) {
        shareEmail.href = `mailto:?subject=${encodeURIComponent(shareData.title)}&body=${encodeURIComponent(shareData.text + '\n\n' + currentUrl)}`;
    }

    if (copyLink) {
        copyLink.addEventListener('click', async () => {
            try {
                await navigator.clipboard.writeText(currentUrl);
                copyLink.innerHTML = '<i class="fas fa-check"></i> Copied!';
                setTimeout(() => {
                    copyLink.innerHTML = '<i class="fas fa-link"></i> Copy Link';
                }, 2000);
            } catch (err) {
                console.error('Failed to copy: ', err);
            }
        });
    }

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

        // Ctrl/Cmd + S for share
        if ((e.ctrlKey || e.metaKey) && e.key === 's') {
            e.preventDefault();
            if (shareBtn) {
                shareBtn.click();
            }
        }

        // Number keys for navigation
        if (!e.ctrlKey && !e.metaKey && !e.altKey) {
            const navLinks = [
                { key: '1', id: 'profile' },
                { key: '2', id: 'experience' },
                { key: '3', id: 'education' },
                { key: '4', id: 'skills' },
                { key: '5', id: 'languages' }
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

    // Close share dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!shareBtn.contains(e.target) && !shareDropdown.contains(e.target)) {
            shareDropdown.setAttribute('aria-hidden', 'true');
        }
    });

    // ESC key to close dropdowns
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (shareDropdown.getAttribute('aria-hidden') === 'false') {
                shareDropdown.setAttribute('aria-hidden', 'true');
            }
            if (contactPopup.classList.contains('active')) {
                contactPopup.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
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
