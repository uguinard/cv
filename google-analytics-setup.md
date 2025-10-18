# 🚀 Google Analytics Setup Completo

## 📋 Pasos para Configurar Google Analytics

### 1. Crear Cuenta de Google Analytics

1. Ve a [Google Analytics](https://analytics.google.com/)
2. Haz clic en "Empezar a medir"
3. Crea una cuenta con el nombre "Sergio Uribe CV"
4. Configura una propiedad web con:
   - **Nombre**: Sergio Uribe Guinard CV
   - **URL**: https://www.sergiouribe.co
   - **Industria**: Educación
   - **Zona horaria**: Asia/Bangkok

### 2. Obtener el Measurement ID

1. En Google Analytics, ve a **Administración** → **Flujos de datos**
2. Haz clic en **Agregar flujo de datos** → **Web**
3. Configura:
   - **URL del sitio web**: https://www.sergiouribe.co
   - **Nombre del flujo de datos**: Sergio Uribe CV
4. Copia el **Measurement ID** (formato: G-XXXXXXXXXX)

### 3. Reemplazar en el Código

En `index.html`, línea 29 y 34, reemplaza `G-XXXXXXXXXX` con tu Measurement ID real:

```html
<script async src="https://www.googletagmanager.com/gtag/js?id=TU_MEASUREMENT_ID_AQUI"></script>
<script>
    gtag('config', 'TU_MEASUREMENT_ID_AQUI', {
        // ... resto de la configuración
    });
</script>
```

## 📊 Eventos que se Trackean

### Eventos Automáticos:
- **page_view**: Cada vez que alguien visita el sitio
- **Core Web Vitals**: LCP, FID, CLS automáticamente

### Eventos Personalizados:
- **language_change**: Cuando cambian el idioma
- **theme_toggle**: Cuando cambian entre modo claro/oscuro
- **print_cv**: Cuando imprimen el CV
- **section_view**: Cuando ven cada sección del CV

## 🔍 Cómo Verificar que Funciona

### Método 1: Google Analytics Debugger
1. Instala la extensión "Google Analytics Debugger" en Chrome
2. Visita tu sitio web
3. Abre las herramientas de desarrollador
4. Ve a la pestaña "Console"
5. Deberías ver eventos como: `gtag('event', 'page_view', ...)`

### Método 2: Google Tag Assistant
1. Instala "Tag Assistant Legacy" de Google
2. Visita tu sitio web
3. Haz clic en el icono de Tag Assistant
4. Debería mostrar "Google Analytics" con estado "Connected"

### Método 3: Tiempo Real en Google Analytics
1. Ve a Google Analytics → **Informes** → **Tiempo real**
2. Visita tu sitio web
3. Deberías aparecer como "1 usuario activo"

## 📈 Métricas Importantes a Monitorear

### 1. **Audiencia**
- Usuarios únicos por día/semana
- Sesiones y duración promedio
- Páginas por sesión

### 2. **Comportamiento**
- Tiempo en página
- Tasa de rebote
- Secciones más visitadas

### 3. **Conversiones**
- Impresiones del CV (botón print)
- Cambios de idioma (engagement)
- Toggle de tema (interacción)

### 4. **Core Web Vitals**
- **LCP** (Largest Contentful Paint): < 2.5s
- **FID** (First Input Delay): < 100ms
- **CLS** (Cumulative Layout Shift): < 0.1

## 🛠️ Configuraciones Avanzadas

### Eventos Personalizados en Google Analytics:
1. Ve a **Configurar** → **Eventos**
2. Crea eventos personalizados para:
   - `language_change`
   - `theme_toggle`
   - `print_cv`
   - `section_view`

### Objetivos (Goals):
1. Ve a **Configurar** → **Objetivos**
2. Crea objetivos para:
   - **Impresión de CV**: Evento `print_cv`
   - **Engagement**: Múltiples `section_view`
   - **Interacción**: Cambios de `theme_toggle`

## 🚨 Solución de Problemas

### Si no aparecen datos:
1. Verifica que el Measurement ID sea correcto
2. Espera 24-48 horas para que aparezcan los datos
3. Usa Google Analytics Debugger para verificar eventos

### Si los eventos no se trackean:
1. Abre las herramientas de desarrollador
2. Ve a la pestaña "Network"
3. Busca requests a `google-analytics.com`
4. Deberías ver requests con tus eventos

## 📱 Configuración Móvil

Para optimizar en móviles, añade estos parámetros adicionales:

```javascript
gtag('config', 'TU_MEASUREMENT_ID', {
    // ... configuración existente
    custom_map: {
        'custom_parameter_1': 'language',
        'custom_parameter_2': 'theme',
        'custom_parameter_3': 'device_type'
    },
    send_page_view: true,
    anonymize_ip: true, // Para GDPR
    allow_google_signals: true
});
```

## 🎯 Próximos Pasos

1. **Configura alertas** para métricas importantes
2. **Crea informes personalizados** para CV específicos
3. **Configura Google Search Console** para SEO
4. **Implementa Google Tag Manager** para más flexibilidad

---

**¡Listo!** Tu sitio web ahora tiene Google Analytics completamente configurado con tracking avanzado de eventos personalizados.
