#!/usr/bin/env node
/**
 * 🚀 Script de Optimización de Imágenes
 * Convierte imágenes a WebP y genera diferentes tamaños
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const inputDir = './';
const outputDir = './optimized/';

// Crear directorio de salida si no existe
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

// Configuración de optimización
const imageConfigs = [
    { name: 'xer', sizes: [150, 300, 600], quality: 85 },
];

async function optimizeImage(filename, sizes, quality) {
    const inputPath = path.join(inputDir, filename);
    const baseName = path.parse(filename).name;
    
    console.log(`🔄 Optimizando ${filename}...`);
    
    for (const size of sizes) {
        try {
            // WebP
            await sharp(inputPath)
                .resize(size, size, { fit: 'cover' })
                .webp({ quality })
                .toFile(path.join(outputDir, `${baseName}-${size}w.webp`));
            
            // JPEG fallback
            await sharp(inputPath)
                .resize(size, size, { fit: 'cover' })
                .jpeg({ quality: quality - 10 })
                .toFile(path.join(outputDir, `${baseName}-${size}w.jpg`));
                
            console.log(`✅ Generado ${baseName}-${size}w.webp y ${baseName}-${size}w.jpg`);
        } catch (error) {
            console.error(`❌ Error procesando ${filename} en tamaño ${size}:`, error);
        }
    }
}

// Ejecutar optimización
async function runOptimization() {
    console.log('🚀 Iniciando optimización de imágenes...');
    
    for (const config of imageConfigs) {
        const filename = `${config.name}.jpeg`;
        if (fs.existsSync(path.join(inputDir, filename))) {
            await optimizeImage(filename, config.sizes, config.quality);
        } else {
            console.log(`⚠️  Archivo ${filename} no encontrado`);
        }
    }
    
    console.log('✨ Optimización completada!');
}

// Verificar si sharp está instalado
try {
    require('sharp');
    runOptimization();
} catch (error) {
    console.log('📦 Instalando dependencias necesarias...');
    console.log('Ejecuta: npm install sharp');
    console.log('Luego ejecuta: node optimize-images.js');
}
