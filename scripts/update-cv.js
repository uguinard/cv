#!/usr/bin/env node

/**
 * Script de Automatización para CV
 * Permite actualizar el CV desde línea de comandos
 */

const fs = require('fs');
const path = require('path');

class CVAutomation {
    constructor() {
        this.dataPath = path.join(__dirname, '../data/cv.json');
        this.localesPath = path.join(__dirname, '../locales');
    }

    // Leer datos del CV
    loadData() {
        try {
            return JSON.parse(fs.readFileSync(this.dataPath, 'utf8'));
        } catch (error) {
            console.error('Error loading CV data:', error);
            return null;
        }
    }

    // Guardar datos del CV
    saveData(data) {
        try {
            fs.writeFileSync(this.dataPath, JSON.stringify(data, null, 2));
            console.log('✅ CV data saved successfully');
            return true;
        } catch (error) {
            console.error('Error saving CV data:', error);
            return false;
        }
    }

    // Actualizar información personal
    updatePersonal(personalData) {
        const data = this.loadData();
        if (!data) return false;

        data.personal = { ...data.personal, ...personalData };
        data.metadata.lastUpdated = new Date().toISOString().split('T')[0];
        
        return this.saveData(data);
    }

    // Agregar experiencia
    addExperience(experienceData) {
        const data = this.loadData();
        if (!data) return false;

        if (!data.experience) data.experience = [];
        
        const newExperience = {
            id: `job${data.experience.length + 1}`,
            ...experienceData
        };
        
        data.experience.unshift(newExperience); // Agregar al inicio
        data.metadata.lastUpdated = new Date().toISOString().split('T')[0];
        
        return this.saveData(data);
    }

    // Agregar educación
    addEducation(educationData) {
        const data = this.loadData();
        if (!data) return false;

        if (!data.education) data.education = [];
        
        const newEducation = {
            id: `edu${data.education.length + 1}`,
            ...educationData
        };
        
        data.education.unshift(newEducation);
        data.metadata.lastUpdated = new Date().toISOString().split('T')[0];
        
        return this.saveData(data);
    }

    // Actualizar habilidades
    updateSkills(skillsData) {
        const data = this.loadData();
        if (!data) return false;

        data.skills = { ...data.skills, ...skillsData };
        data.metadata.lastUpdated = new Date().toISOString().split('T')[0];
        
        return this.saveData(data);
    }

    // Generar resumen
    generateSummary() {
        const data = this.loadData();
        if (!data) return null;

        return {
            personal: data.personal?.name || 'No name',
            experience: data.experience?.length || 0,
            education: data.education?.length || 0,
            skills: {
                soft: data.skills?.soft?.length || 0,
                technical: data.skills?.technical?.length || 0
            },
            languages: data.languages?.length || 0,
            lastUpdated: data.metadata?.lastUpdated || 'Unknown'
        };
    }

    // Validar datos
    validateData() {
        const data = this.loadData();
        if (!data) return { valid: false, errors: ['No data loaded'] };

        const errors = [];
        
        if (!data.personal?.name) errors.push('Missing personal name');
        if (!data.personal?.email) errors.push('Missing personal email');
        if (!data.experience?.length) errors.push('No experience entries');
        if (!data.education?.length) errors.push('No education entries');
        
        return {
            valid: errors.length === 0,
            errors
        };
    }
}

// CLI Interface
if (require.main === module) {
    const automation = new CVAutomation();
    const command = process.argv[2];
    
    switch (command) {
        case 'summary':
            const summary = automation.generateSummary();
            console.log('📊 CV Summary:');
            console.log(`Name: ${summary.personal}`);
            console.log(`Experience entries: ${summary.experience}`);
            console.log(`Education entries: ${summary.education}`);
            console.log(`Skills: ${summary.skills.soft} soft, ${summary.skills.technical} technical`);
            console.log(`Languages: ${summary.languages}`);
            console.log(`Last updated: ${summary.lastUpdated}`);
            break;
            
        case 'validate':
            const validation = automation.validateData();
            if (validation.valid) {
                console.log('✅ CV data is valid');
            } else {
                console.log('❌ CV data has errors:');
                validation.errors.forEach(error => console.log(`  - ${error}`));
            }
            break;
            
        case 'update-personal':
            const personalData = {
                name: process.argv[3] || 'SERGIO URIBE GUINARD',
                email: process.argv[4] || 'uguinard@gmail.com'
            };
            automation.updatePersonal(personalData);
            break;
            
        default:
            console.log('📝 CV Automation Tool');
            console.log('Usage:');
            console.log('  node update-cv.js summary          - Show CV summary');
            console.log('  node update-cv.js validate         - Validate CV data');
            console.log('  node update-cv.js update-personal  - Update personal info');
    }
}

module.exports = CVAutomation;
