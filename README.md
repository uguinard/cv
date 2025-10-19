# 📝 CV Modular - Sergio Uribe Guinard

[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-Live-blue?logo=github)](https://tu-usuario.github.io/cv)
[![GitHub Actions](https://img.shields.io/badge/GitHub%20Actions-Validated-green?logo=github-actions)](https://github.com/tu-usuario/cv/actions)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

Un CV modular y completamente editable construido con HTML, CSS, JavaScript y JSON. Optimizado para GitHub Pages con automatización completa.

## 🌐 En Vivo

- **CV Web**: [https://tu-usuario.github.io/cv](https://tu-usuario.github.io/cv)
- **Editor Web**: [https://tu-usuario.github.io/cv/github-editor.html](https://tu-usuario.github.io/cv/github-editor.html)

## ✨ Características

- 🎨 **Diseño Responsivo** - Se adapta a cualquier dispositivo
- 🌍 **Multilingüe** - Soporte para 9 idiomas
- 🌙 **Modo Oscuro** - Tema claro/oscuro automático
- 📱 **PWA Ready** - Funciona como app móvil
- ⚡ **Carga Rápida** - Optimizado para rendimiento
- 🔧 **Totalmente Modular** - Fácil de editar y mantener
- 🤖 **Automatizado** - GitHub Actions para validación
- 📊 **SEO Optimizado** - Meta tags y estructura semántica

## 🚀 Formas de Editar tu CV

### 1. 📝 Editor Web (Más Fácil)
```bash
# Abrir editor web
open github-editor.html
# o visita: https://tu-usuario.github.io/cv/github-editor.html
```

### 2. ✏️ Editor de GitHub (En el Navegador)
1. Ve a `data/cv.json` en tu repositorio
2. Haz clic en el ícono de lápiz ✏️
3. Edita el archivo JSON
4. Haz commit con un mensaje descriptivo

### 3. 💻 Línea de Comandos
```bash
# Ver resumen del CV
npm run summary

# Validar datos
npm run validate

# Actualizar información personal
node scripts/github-update.js update-personal "Nuevo Nombre" "nuevo@email.com"

# Abrir editor web
node scripts/github-update.js editor

# Subir cambios a GitHub
node scripts/github-update.js push
```

### 4. 🔧 Edición Directa de Archivos
- **Datos principales**: `data/cv.json`
- **Traducciones**: `locales/*.json`
- **Configuración**: `data/config.json`

## 📁 Estructura del Proyecto

```
cv/
├── 📄 index.html              # CV principal
├── 🎨 style.css               # Estilos
├── ⚡ script.js               # Lógica JavaScript
├── 📝 github-editor.html      # Editor web
├── 📊 data/
│   ├── cv.json               # Datos principales
│   ├── config.json            # Configuración
│   └── README.md             # Documentación
├── 🌍 locales/               # Traducciones
│   ├── en.json
│   ├── es.json
│   └── ...
├── 🧩 components/            # Componentes modulares
├── 📜 scripts/              # Scripts de automatización
├── 🤖 .github/workflows/    # GitHub Actions
└── 📋 package.json          # Configuración NPM
```

## 🛠️ Configuración Inicial

### 1. Clonar y Configurar
```bash
git clone https://github.com/tu-usuario/cv.git
cd cv
npm install
```

### 2. Activar GitHub Pages
1. Ve a **Settings** → **Pages**
2. Selecciona **Deploy from a branch**
3. Elige **main** branch y **/ (root)**
4. Haz clic en **Save**

### 3. Personalizar
```bash
# Editar información personal
node scripts/github-update.js update-personal "Tu Nombre" "tu@email.com"

# Abrir editor web
npm run editor
```

## 🔄 Flujo de Trabajo

### Edición Rápida
1. **Abre** `github-editor.html` en tu navegador
2. **Edita** la información que necesites
3. **Copia** el JSON generado
4. **Pega** en `data/cv.json` en GitHub
5. **Haz commit** con un mensaje descriptivo

### Edición Avanzada
1. **Clona** el repositorio localmente
2. **Edita** `data/cv.json` directamente
3. **Valida** con `npm run validate`
4. **Sube** con `git push origin main`

## 📊 Validación Automática

El proyecto incluye GitHub Actions que validan automáticamente:

- ✅ **Estructura JSON** - Verifica que todos los campos requeridos existan
- ✅ **Traducciones** - Comprueba que todos los idiomas tengan las claves necesarias
- ✅ **Sintaxis** - Valida que todos los archivos JSON sean válidos
- ✅ **Despliegue** - Actualiza GitHub Pages automáticamente

## 🌍 Idiomas Soportados

- 🇺🇸 English
- 🇪🇸 Español
- 🇹🇭 ภาษาไทย
- 🇨🇳 中文
- 🇹🇷 Türkçe
- 🇸🇦 العربية
- 🇫🇷 Français
- 🇮🇹 Italiano
- 🇩🇪 Deutsch

## 🎨 Personalización

### Cambiar Colores
Edita las variables CSS en `style.css`:
```css
:root {
    --accent: #3498db;        /* Color principal */
    --background: #f4f7f9;    /* Fondo */
    --text-primary: #2c3e50;  /* Texto principal */
}
```

### Agregar Nuevos Idiomas
1. Crea `locales/nuevo-idioma.json`
2. Copia la estructura de `locales/en.json`
3. Traduce todos los valores
4. Agrega el idioma a `data/cv.json` → `supportedLanguages`

### Agregar Nuevas Secciones
1. Edita `data/cv.json` para agregar la nueva sección
2. Actualiza `script.js` para renderizar la sección
3. Agrega estilos en `style.css`

## 📱 Características Técnicas

- **Framework**: Vanilla JavaScript (sin dependencias)
- **Estilos**: CSS3 con variables personalizadas
- **Datos**: JSON modular
- **Hosting**: GitHub Pages
- **CI/CD**: GitHub Actions
- **Responsive**: Mobile-first design
- **SEO**: Meta tags optimizados
- **Performance**: Lazy loading, preload crítico

## 🤝 Contribuir

1. **Fork** el repositorio
2. **Crea** una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. **Commit** tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. **Push** a la rama (`git push origin feature/AmazingFeature`)
5. **Abre** un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo [LICENSE](LICENSE) para más detalles.

## 👨‍💻 Autor

**Sergio Uribe Guinard**
- 🌐 Website: [https://tu-usuario.github.io/cv](https://tu-usuario.github.io/cv)
- 💼 LinkedIn: [https://www.linkedin.com/in/sergio-ug/](https://www.linkedin.com/in/sergio-ug/)
- 📧 Email: uguinard@gmail.com

## 🙏 Agradecimientos

- [Font Awesome](https://fontawesome.com/) - Iconos
- [Google Fonts](https://fonts.google.com/) - Tipografías
- [GitHub Pages](https://pages.github.com/) - Hosting
- [GitHub Actions](https://github.com/features/actions) - Automatización

---

⭐ **¿Te gusta este proyecto?** ¡Dale una estrella en GitHub!
