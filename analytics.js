/**
 * 🚀 Sistema de Analytics Propio para GitHub Pages
 * Recolecta datos de forma privada y los almacena en GitHub
 */

class CustomAnalytics {
    constructor() {
        this.sessionId = this.generateSessionId();
        this.startTime = Date.now();
        this.events = [];
        this.config = {
            // Configuración para GitHub Pages
            githubRepo: 'uguinard/cv', // Cambiar por tu repo
            githubToken: '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', // Token personal de GitHub (opcional)
            apiEndpoint: 'https://api.github.com',
            dataFile: 'analytics-data.json',
            // Configuración de privacidad
            anonymizeIP: true,
            respectDNT: true, // Respetar Do Not Track
            cookieConsent: true
        };
        
        this.init();
    }

    init() {
        // Verificar si el usuario ha dado consentimiento
        if (this.hasConsent()) {
            this.startTracking();
        } else {
            this.showConsentBanner();
        }
    }

    generateSessionId() {
        return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    hasConsent() {
        return localStorage.getItem('analytics-consent') === 'true';
    }

    showConsentBanner() {
        // Crear banner de consentimiento
        const banner = document.createElement('div');
        banner.id = 'analytics-consent-banner';
        banner.innerHTML = `
            <div style="
                position: fixed;
                bottom: 0;
                left: 0;
                right: 0;
                background: #2c3e50;
                color: white;
                padding: 15px;
                z-index: 10000;
                font-family: Arial, sans-serif;
                box-shadow: 0 -2px 10px rgba(0,0,0,0.3);
            ">
                <div style="max-width: 800px; margin: 0 auto; display: flex; align-items: center; justify-content: space-between;">
                    <div>
                        <strong>🍪 Privacidad y Analytics</strong><br>
                        <small>Usamos analytics propios para mejorar tu experiencia. No compartimos datos con terceros.</small>
                    </div>
                    <div>
                        <button onclick="analytics.acceptConsent()" style="
                            background: #27ae60;
                            color: white;
                            border: none;
                            padding: 8px 16px;
                            border-radius: 4px;
                            cursor: pointer;
                            margin-right: 10px;
                        ">Aceptar</button>
                        <button onclick="analytics.rejectConsent()" style="
                            background: #e74c3c;
                            color: white;
                            border: none;
                            padding: 8px 16px;
                            border-radius: 4px;
                            cursor: pointer;
                        ">Rechazar</button>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(banner);
    }

    acceptConsent() {
        localStorage.setItem('analytics-consent', 'true');
        document.getElementById('analytics-consent-banner').remove();
        this.startTracking();
    }

    rejectConsent() {
        localStorage.setItem('analytics-consent', 'false');
        document.getElementById('analytics-consent-banner').remove();
    }

    startTracking() {
        // Trackear página inicial
        this.track('page_view', {
            url: window.location.href,
            referrer: document.referrer,
            userAgent: navigator.userAgent,
            language: navigator.language,
            screen: `${screen.width}x${screen.height}`,
            viewport: `${window.innerWidth}x${window.innerHeight}`
        });

        // Trackear eventos de navegación
        this.trackNavigation();
        
        // Trackear interacciones
        this.trackInteractions();
        
        // Trackear performance
        this.trackPerformance();
        
        // Enviar datos periódicamente
        setInterval(() => this.sendData(), 30000); // Cada 30 segundos
    }

    track(eventName, data = {}) {
        const event = {
            id: this.generateEventId(),
            sessionId: this.sessionId,
            event: eventName,
            timestamp: new Date().toISOString(),
            url: window.location.href,
            data: data
        };

        this.events.push(event);
        console.log('📊 Analytics Event:', event);
        
        // Enviar inmediatamente si es importante
        if (['page_view', 'print_cv', 'contact_click'].includes(eventName)) {
            this.sendData();
        }
    }

    generateEventId() {
        return 'event_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);
    }

    trackNavigation() {
        // Trackear cambios de sección
        const sections = document.querySelectorAll('section[id]');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.track('section_view', {
                        section: entry.target.id,
                        timeOnPage: Date.now() - this.startTime
                    });
                }
            });
        }, { threshold: 0.5 });

        sections.forEach(section => observer.observe(section));
    }

    trackInteractions() {
        // Trackear clics en enlaces
        document.addEventListener('click', (e) => {
            if (e.target.tagName === 'A') {
                this.track('link_click', {
                    href: e.target.href,
                    text: e.target.textContent.trim()
                });
            }
        });

        // Trackear botón de imprimir
        const printBtn = document.getElementById('print-btn');
        if (printBtn) {
            printBtn.addEventListener('click', () => {
                this.track('print_cv', {
                    timestamp: new Date().toISOString()
                });
            });
        }

        // Trackear cambios de idioma
        const langSelect = document.getElementById('language-select');
        if (langSelect) {
            langSelect.addEventListener('change', (e) => {
                this.track('language_change', {
                    language: e.target.value
                });
            });
        }

        // Trackear toggle de tema
        const themeBtn = document.getElementById('theme-toggle-btn');
        if (themeBtn) {
            themeBtn.addEventListener('click', () => {
                this.track('theme_toggle', {
                    theme: document.body.classList.contains('dark-mode') ? 'light' : 'dark'
                });
            });
        }
    }

    trackPerformance() {
        // Trackear Core Web Vitals
        if ('PerformanceObserver' in window) {
            // LCP
            new PerformanceObserver((list) => {
                const entries = list.getEntries();
                const lastEntry = entries[entries.length - 1];
                this.track('performance_metric', {
                    metric: 'LCP',
                    value: lastEntry.startTime,
                    element: lastEntry.element?.tagName
                });
            }).observe({entryTypes: ['largest-contentful-paint']});

            // FID
            new PerformanceObserver((list) => {
                const entries = list.getEntries();
                entries.forEach(entry => {
                    this.track('performance_metric', {
                        metric: 'FID',
                        value: entry.processingStart - entry.startTime
                    });
                });
            }).observe({entryTypes: ['first-input']});

            // CLS
            let clsValue = 0;
            new PerformanceObserver((list) => {
                const entries = list.getEntries();
                entries.forEach(entry => {
                    if (!entry.hadRecentInput) {
                        clsValue += entry.value;
                        this.track('performance_metric', {
                            metric: 'CLS',
                            value: clsValue
                        });
                    }
                });
            }).observe({entryTypes: ['layout-shift']});
        }
    }

    async sendData() {
        if (this.events.length === 0) return;

        try {
            // Para GitHub Pages, usamos un enfoque simple con JSON
            const data = {
                timestamp: new Date().toISOString(),
                sessionId: this.sessionId,
                events: [...this.events]
            };

            // Enviar a un endpoint personalizado o almacenar localmente
            await this.storeData(data);
            
            // Limpiar eventos enviados
            this.events = [];
            
        } catch (error) {
            console.error('Error enviando datos de analytics:', error);
        }
    }

    async storeData(data) {
        // Opción 1: Almacenar en localStorage (para desarrollo)
        const existingData = JSON.parse(localStorage.getItem('analytics-data') || '[]');
        existingData.push(data);
        localStorage.setItem('analytics-data', JSON.stringify(existingData));

        // Opción 2: Enviar a un servicio externo (como Formspree, Netlify Forms, etc.)
        // await this.sendToExternalService(data);
    }

    async sendToExternalService(data) {
        // Ejemplo usando Formspree (gratuito)
        const formData = new FormData();
        formData.append('data', JSON.stringify(data));
        formData.append('_subject', 'Analytics Data - Sergio Uribe CV');
        
        try {
            await fetch('https://formspree.io/f/YOUR_FORM_ID', {
                method: 'POST',
                body: formData
            });
        } catch (error) {
            console.error('Error enviando a servicio externo:', error);
        }
    }

    // Métodos públicos para uso manual
    trackCustomEvent(eventName, data) {
        this.track(eventName, data);
    }

    getSessionData() {
        return {
            sessionId: this.sessionId,
            startTime: this.startTime,
            events: this.events
        };
    }
}

// Inicializar analytics
const analytics = new CustomAnalytics();

// Hacer disponible globalmente
window.analytics = analytics;
