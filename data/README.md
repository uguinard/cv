# Sistema de Datos JSON para CV

## Estructura de Archivos

```
data/
├── cv.json          # Datos principales del CV
├── config.json      # Configuración del sitio
└── README.md        # Esta documentación
```

## Archivos JSON

### `cv.json`
Contiene toda la información personal y profesional:

- **personal**: Datos personales (nombre, contacto, foto)
- **experience**: Experiencia laboral con referencias a claves de traducción
- **education**: Formación académica
- **skills**: Habilidades técnicas y blandas
- **languages**: Idiomas con niveles de competencia
- **metadata**: Información de versión y idiomas soportados

### `config.json`
Configuración del sitio web:

- **site**: Metadatos SEO
- **social**: Enlaces a redes sociales
- **features**: Funcionalidades habilitadas
- **languages**: Configuración de idiomas
- **performance**: Optimizaciones

## Ventajas del Sistema JSON

✅ **Centralización**: Todos los datos en un lugar
✅ **Versionado**: Control de cambios con Git
✅ **Flexibilidad**: Fácil agregar nuevos campos
✅ **Reutilización**: Mismo JSON para web, PDF, API
✅ **Validación**: Esquemas JSON para validar estructura
✅ **Mantenimiento**: Edición más fácil para no-programadores

## Cómo Actualizar el CV

1. **Datos Personales**: Editar `data/cv.json` → sección `personal`
2. **Experiencia**: Agregar/editar en `data/cv.json` → sección `experience`
3. **Traducciones**: Editar archivos en `locales/` (sistema existente)
4. **Configuración**: Modificar `data/config.json` para ajustes del sitio

## Ejemplo de Uso

```javascript
// El script.js carga automáticamente los datos
const cvData = await loadCVData();
console.log(cvData.personal.name); // "SERGIO URIBE GUINARD"
```

## Migración Futura

Este sistema híbrido permite migrar gradualmente a JSON completo:

1. **Fase 1** (Actual): Datos personales en JSON ✅
2. **Fase 2**: Experiencia y educación en JSON
3. **Fase 3**: Generación completa desde JSON
4. **Fase 4**: Integración con CMS/API
