#!/usr/bin/env node

/**
 * GitHub CV Update Script
 * Facilita la actualización del CV desde línea de comandos
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class GitHubCVUpdater {
    constructor() {
        this.dataPath = path.join(__dirname, '../data/cv.json');
        this.localesPath = path.join(__dirname, '../locales');
    }

    // Leer datos del CV
    loadData() {
        try {
            return JSON.parse(fs.readFileSync(this.dataPath, 'utf8'));
        } catch (error) {
            console.error('❌ Error loading CV data:', error.message);
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
            console.error('❌ Error saving CV data:', error.message);
            return false;
        }
    }

    // Actualizar información personal
    updatePersonal(personalData) {
        const data = this.loadData();
        if (!data) return false;

        data.personal = { ...data.personal, ...personalData };
        data.metadata.lastUpdated = new Date().toISOString().split('T')[0];
        
        if (this.saveData(data)) {
            this.commitChanges(`Update personal information: ${personalData.name || 'CV'}`);
            return true;
        }
        return false;
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
        
        data.experience.unshift(newExperience);
        data.metadata.lastUpdated = new Date().toISOString().split('T')[0];
        
        if (this.saveData(data)) {
            this.commitChanges(`Add experience: ${experienceData.title || 'New position'}`);
            return true;
        }
        return false;
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
        
        if (this.saveData(data)) {
            this.commitChanges(`Add education: ${educationData.title || 'New degree'}`);
            return true;
        }
        return false;
    }

    // Actualizar habilidades
    updateSkills(skillsData) {
        const data = this.loadData();
        if (!data) return false;

        data.skills = { ...data.skills, ...skillsData };
        data.metadata.lastUpdated = new Date().toISOString().split('T')[0];
        
        if (this.saveData(data)) {
            this.commitChanges('Update skills');
            return true;
        }
        return false;
    }

    // Hacer commit de cambios
    commitChanges(message) {
        try {
            execSync('git add data/cv.json', { stdio: 'inherit' });
            execSync(`git commit -m "${message}"`, { stdio: 'inherit' });
            console.log('📝 Changes committed to Git');
            
            // Preguntar si hacer push
            const readline = require('readline');
            const rl = readline.createInterface({
                input: process.stdin,
                output: process.stdout
            });
            
            rl.question('🚀 Push changes to GitHub? (y/N): ', (answer) => {
                if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
                    try {
                        execSync('git push origin main', { stdio: 'inherit' });
                        console.log('✅ Changes pushed to GitHub');
                        console.log('🌐 Your CV will be updated at: https://tu-usuario.github.io/cv');
                    } catch (error) {
                        console.error('❌ Error pushing to GitHub:', error.message);
                    }
                } else {
                    console.log('💡 To push later, run: git push origin main');
                }
                rl.close();
            });
            
        } catch (error) {
            console.error('❌ Error committing changes:', error.message);
        }
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
            lastUpdated: data.metadata?.lastUpdated || 'Unknown',
            repository: this.getRepositoryInfo()
        };
    }

    // Obtener información del repositorio
    getRepositoryInfo() {
        try {
            const remote = execSync('git remote get-url origin', { encoding: 'utf8' }).trim();
            const match = remote.match(/github\.com[:/]([^/]+)\/([^/]+)/);
            if (match) {
                const [, owner, repo] = match;
                return {
                    owner,
                    repo: repo.replace('.git', ''),
                    url: remote,
                    pages: `https://${owner}.github.io/${repo.replace('.git', '')}`
                };
            }
        } catch (error) {
            console.log('⚠️  Not a Git repository or no remote origin');
        }
        return null;
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

    // Abrir editor web
    openWebEditor() {
        const editorPath = path.join(__dirname, '../github-editor.html');
        const { exec } = require('child_process');
        
        // Detectar sistema operativo
        const platform = process.platform;
        let command;
        
        if (platform === 'darwin') {
            command = `open ${editorPath}`;
        } else if (platform === 'win32') {
            command = `start ${editorPath}`;
        } else {
            command = `xdg-open ${editorPath}`;
        }
        
        exec(command, (error) => {
            if (error) {
                console.log('🌐 Open manually: file://' + editorPath);
            } else {
                console.log('🌐 Web editor opened');
            }
        });
    }
}

// CLI Interface
if (require.main === module) {
    const updater = new GitHubCVUpdater();
    const command = process.argv[2];
    
    switch (command) {
        case 'summary':
            const summary = updater.generateSummary();
            console.log('📊 CV Summary:');
            console.log(`  Name: ${summary.personal}`);
            console.log(`  Experience entries: ${summary.experience}`);
            console.log(`  Education entries: ${summary.education}`);
            console.log(`  Skills: ${summary.skills.soft} soft, ${summary.skills.technical} technical`);
            console.log(`  Languages: ${summary.languages}`);
            console.log(`  Last updated: ${summary.lastUpdated}`);
            if (summary.repository) {
                console.log(`  Repository: ${summary.repository.url}`);
                console.log(`  GitHub Pages: ${summary.repository.pages}`);
            }
            break;
            
        case 'validate':
            const validation = updater.validateData();
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
            updater.updatePersonal(personalData);
            break;
            
        case 'editor':
            updater.openWebEditor();
            break;
            
        case 'push':
            try {
                execSync('git push origin main', { stdio: 'inherit' });
                console.log('✅ Changes pushed to GitHub');
            } catch (error) {
                console.error('❌ Error pushing to GitHub:', error.message);
            }
            break;
            
        default:
            console.log('🚀 GitHub CV Update Tool');
            console.log('Usage:');
            console.log('  node scripts/github-update.js summary          - Show CV summary');
            console.log('  node scripts/github-update.js validate         - Validate CV data');
            console.log('  node scripts/github-update.js update-personal  - Update personal info');
            console.log('  node scripts/github-update.js editor           - Open web editor');
            console.log('  node scripts/github-update.js push             - Push changes to GitHub');
    }
}

module.exports = GitHubCVUpdater;
