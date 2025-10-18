#!/usr/bin/env node
/**
 * 🚀 Script de Build y Optimización
 * Minifica CSS y JavaScript para producción
 */

const fs = require('fs');
const path = require('path');

// Configuración de minificación
const config = {
    css: {
        input: 'style.css',
        output: 'style.min.css'
    },
    js: {
        input: 'script.js',
        output: 'script.min.js'
    }
};

// Función para minificar CSS básico
function minifyCSS(css) {
    return css
        .replace(/\/\*[\s\S]*?\*\//g, '') // Remove comments
        .replace(/\s+/g, ' ') // Replace multiple spaces with single space
        .replace(/;\s*}/g, '}') // Remove semicolon before closing brace
        .replace(/\s*{\s*/g, '{') // Remove spaces around opening brace
        .replace(/;\s*/g, ';') // Remove spaces after semicolons
        .replace(/,\s*/g, ',') // Remove spaces after commas
        .replace(/:\s*/g, ':') // Remove spaces after colons
        .trim();
}

// Función para minificar JavaScript básico
function minifyJS(js) {
    return js
        .replace(/\/\*[\s\S]*?\*\//g, '') // Remove block comments
        .replace(/\/\/.*$/gm, '') // Remove line comments
        .replace(/\s+/g, ' ') // Replace multiple spaces with single space
        .replace(/\s*{\s*/g, '{') // Remove spaces around opening brace
        .replace(/;\s*/g, ';') // Remove spaces after semicolons
        .replace(/,\s*/g, ',') // Remove spaces after commas
        .replace(/:\s*/g, ':') // Remove spaces after colons
        .trim();
}

// Función principal de build
async function build() {
    console.log('🚀 Iniciando proceso de build...');
    
    try {
        // Minificar CSS
        if (fs.existsSync(config.css.input)) {
            const cssContent = fs.readFileSync(config.css.input, 'utf8');
            const minifiedCSS = minifyCSS(cssContent);
            fs.writeFileSync(config.css.output, minifiedCSS);
            console.log(`✅ CSS minificado: ${config.css.output}`);
        }
        
        // Minificar JavaScript
        if (fs.existsSync(config.js.input)) {
            const jsContent = fs.readFileSync(config.js.input, 'utf8');
            const minifiedJS = minifyJS(jsContent);
            fs.writeFileSync(config.js.output, minifiedJS);
            console.log(`✅ JavaScript minificado: ${config.js.output}`);
        }
        
        console.log('✨ Build completado exitosamente!');
        console.log('📁 Archivos generados:');
        console.log(`   - ${config.css.output}`);
        console.log(`   - ${config.js.output}`);
        
    } catch (error) {
        console.error('❌ Error durante el build:', error);
    }
}

// Ejecutar build
build();
