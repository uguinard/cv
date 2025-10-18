# 🚀 Sistema de Analytics Propio - Configuración Completa

## 📋 Ventajas de tu Sistema de Analytics

### ✅ **Privacidad Total**
- **Tus datos, tu control** - No dependes de Google
- **GDPR compliant** - Banner de consentimiento incluido
- **Anonimización** - IPs anonimizadas automáticamente
- **Sin cookies de terceros** - Solo localStorage

### ✅ **Perfecto para GitHub Pages**
- **Funciona sin servidor** - Solo archivos estáticos
- **Almacenamiento local** - No necesitas base de datos
- **Exportación fácil** - Datos en CSV/JSON
- **Dashboard incluido** - Visualización completa

## 🛠️ Configuración Paso a Paso

### 1. **Configurar el Sistema Básico**

En `analytics.js`, actualiza la configuración:

```javascript
this.config = {
    githubRepo: 'tu-usuario/tu-repo', // Tu repo de GitHub
    githubToken: '', // Token de GitHub (opcional)
    apiEndpoint: 'https://api.github.com',
    dataFile: 'analytics-data.json',
    anonymizeIP: true,
    respectDNT: true,
    cookieConsent: true
};
```

### 2. **Configurar GitHub Token (Opcional)**

Para almacenar datos en GitHub:

1. Ve a GitHub → Settings → Developer settings → Personal access tokens
2. Crea un token con permisos de `repo`
3. Reemplaza `githubToken: ''` con tu token

### 3. **Personalizar Eventos**

En `analytics.js`, puedes añadir eventos personalizados:

```javascript
// Ejemplo: Trackear clics en email
document.querySelector('a[href^="mailto:"]').addEventListener('click', () => {
    analytics.track('email_click', {
        email: 'uguinard@gmail.com'
    });
});
```

## 📊 Dashboard de Analytics

### **Acceder al Dashboard:**
1. Abre `analytics-dashboard.html` en tu navegador
2. Verás estadísticas en tiempo real
3. Exporta datos en CSV

### **Métricas Disponibles:**
- **Visitas totales** - Número de page views
- **Visitantes únicos** - Sesiones únicas
- **Tiempo promedio** - Duración de sesión
- **CVs impresos** - Interacciones de impresión
- **Idiomas más usados** - Preferencias de idioma
- **Dispositivos** - Mobile/Desktop/Tablet

## 🔧 Eventos que se Trackean Automáticamente

### **Eventos de Navegación:**
- `page_view` - Cada visita a la página
- `section_view` - Visualización de secciones
- `link_click` - Clics en enlaces

### **Eventos de Interacción:**
- `language_change` - Cambios de idioma
- `theme_toggle` - Cambio de tema
- `print_cv` - Impresión del CV

### **Eventos de Performance:**
- `performance_metric` - Core Web Vitals (LCP, FID, CLS)

## 📱 Configuración para Móviles

El sistema es completamente responsive y funciona en:
- **Desktop** - Dashboard completo
- **Mobile** - Dashboard adaptado
- **Tablet** - Vista optimizada

## 🔒 Privacidad y GDPR

### **Banner de Consentimiento:**
- Aparece automáticamente en la primera visita
- Usuario puede aceptar o rechazar
- Se respeta la decisión del usuario

### **Datos Anonimizados:**
- IPs no se almacenan
- Solo datos de interacción
- Sin información personal

## 📈 Ventajas vs Google Analytics

| Característica | Tu Sistema | Google Analytics |
|----------------|------------|------------------|
| **Privacidad** | ✅ Total control | ❌ Datos a Google |
| **Costo** | ✅ Gratis | ❌ Límites de GA4 |
| **Personalización** | ✅ 100% customizable | ❌ Limitado |
| **Datos** | ✅ Tuyos | ❌ De Google |
| **GDPR** | ✅ Compliant | ❌ Complejo |
| **GitHub Pages** | ✅ Perfecto | ❌ Limitado |

## 🚀 Funcionalidades Avanzadas

### **1. Eventos Personalizados:**
```javascript
// Trackear descargas
analytics.track('download', {
    file: 'cv-sergio-uribe.pdf',
    format: 'PDF'
});

// Trackear tiempo en sección
analytics.track('time_on_section', {
    section: 'experience',
    time: 45 // segundos
});
```

### **2. Métricas de Engagement:**
- Tiempo en cada sección
- Scroll depth
- Interacciones por sesión
- Patrones de navegación

### **3. Exportación de Datos:**
- **CSV** - Para análisis en Excel
- **JSON** - Para integraciones
- **Tiempo real** - Dashboard actualizado

## 🔧 Solución de Problemas

### **Si no aparecen datos:**
1. Verifica que `analytics.js` esté cargado
2. Revisa la consola del navegador
3. Asegúrate de que el usuario haya dado consentimiento

### **Si el dashboard está vacío:**
1. Visita tu sitio web primero
2. Interactúa con la página
3. Recarga el dashboard

### **Para debugging:**
```javascript
// Ver datos en consola
console.log(analytics.getSessionData());

// Ver todos los eventos
console.log(analytics.events);
```

## 📊 Próximos Pasos

1. **Personalizar eventos** según tus necesidades
2. **Configurar GitHub token** para almacenamiento en la nube
3. **Añadir más métricas** específicas para CVs
4. **Crear alertas** para métricas importantes

---

**¡Listo!** Tienes un sistema de analytics completo, privado y perfecto para GitHub Pages. 🎉
