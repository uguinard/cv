#!/usr/bin/env node
/**
 * 🚀 Script de Optimización de Recursos
 * Elimina recursos que bloquean el renderizado
 */

const fs = require('fs');
const path = require('path');

// Configuración de optimización
const config = {
    input: 'index.html',
    output: 'index-optimized.html',
    criticalCSS: 'critical.css',
    nonCriticalCSS: 'non-critical.css'
};

// Extraer CSS crítico
function extractCriticalCSS() {
    const criticalCSS = `
/* Critical CSS - Above the fold */
body {
    font-family: 'Lato', sans-serif;
    background-color: #f4f7f9;
    color: #2c3e50;
    margin: 0;
    padding: 0;
}

.container {
    max-width: 900px;
    margin: 40px auto;
    padding: 50px;
    background-color: #fff;
    border-radius: 10px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.profile-img-container {
    width: 150px;
    height: 150px;
    border-radius: 50%;
    border: 5px solid #fff;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
    margin: 0 auto 20px;
    overflow: hidden;
}

.profile-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transform: scale(1.45);
}

h1 {
    font-size: 32px;
    margin: 15px 0 8px 0;
    font-weight: 700;
    text-align: center;
}

.contact-info {
    display: flex;
    flex-wrap: wrap;
    gap: 15px;
    justify-content: center;
    list-style: none;
    padding: 0;
    color: #7f8c8d;
}

.main-nav {
    position: sticky;
    top: 0;
    background-color: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(8px);
    z-index: 100;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
    padding: 10px 30px;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}

.main-nav ul {
    list-style: none;
    display: flex;
    justify-content: center;
    gap: 15px;
    flex-grow: 1;
}

.main-nav a {
    text-decoration: none;
    color: #7f8c8d;
    font-weight: 700;
    padding: 10px 15px;
    border-radius: 5px;
    transition: color 0.3s;
}

.main-nav a:hover {
    color: #3498db;
}

@media (max-width: 800px) {
    .container {
        margin: 0;
        border-radius: 0;
        padding: 25px;
    }
    
    h1 {
        font-size: 28px;
    }
    
    .contact-info {
        flex-direction: column;
        align-items: center;
        gap: 10px;
    }
}
`;

    fs.writeFileSync(config.criticalCSS, criticalCSS);
    console.log('✅ Critical CSS extraído');
}

// Optimizar HTML
function optimizeHTML() {
    let html = fs.readFileSync(config.input, 'utf8');
    
    // Reemplazar FontAwesome con carga asíncrona
    html = html.replace(
        '<script src="https://kit.fontawesome.com/15d28c0573.js" crossorigin="anonymous"></script>',
        '<script src="https://kit.fontawesome.com/15d28c0573.js" crossorigin="anonymous" async></script>'
    );
    
    // Optimizar Google Fonts
    html = html.replace(
        '<link href="https://fonts.googleapis.com/css2?family=Lato:wght@300;400;700&display=swap" rel="stylesheet">',
        '<link href="https://fonts.googleapis.com/css2?family=Lato:wght@300;400;700&display=swap" rel="stylesheet" media="print" onload="this.media=\'all\'">\n    <noscript><link href="https://fonts.googleapis.com/css2?family=Lato:wght@300;400;700&display=swap" rel="stylesheet"></noscript>'
    );
    
    // Optimizar CSS
    html = html.replace(
        '<link rel="stylesheet" href="style.css">',
        '<link rel="stylesheet" href="style.css" media="print" onload="this.media=\'all\'">\n    <noscript><link rel="stylesheet" href="style.css"></noscript>'
    );
    
    // Optimizar JavaScript
    html = html.replace(
        '<script src="script.js" defer></script>',
        '<script src="script.js" async></script>'
    );
    
    fs.writeFileSync(config.output, html);
    console.log('✅ HTML optimizado');
}

// Función principal
function optimize() {
    console.log('🚀 Iniciando optimización de recursos...');
    
    try {
        extractCriticalCSS();
        optimizeHTML();
        
        console.log('✨ Optimización completada!');
        console.log('📁 Archivos generados:');
        console.log(`   - ${config.criticalCSS}`);
        console.log(`   - ${config.output}`);
        
    } catch (error) {
        console.error('❌ Error durante la optimización:', error);
    }
}

// Ejecutar optimización
optimize();
