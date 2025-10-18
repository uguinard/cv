/**
 * 🚀 Sistema de Analytics para GitHub Pages
 * Almacena datos usando GitHub API
 */

class GitHubAnalytics {
    constructor() {
        this.config = {
            // Configuración de tu repositorio
            owner: 'tu-usuario', // Cambiar por tu usuario de GitHub
            repo: 'tu-repo', // Cambiar por el nombre de tu repo
            token: '', // Token personal de GitHub (opcional)
            branch: 'main', // Rama donde guardar los datos
            dataFile: 'analytics-data.json'
        };
        
        this.apiUrl = `https://api.github.com/repos/${this.config.owner}/${this.config.repo}`;
    }

    async saveAnalyticsData(data) {
        try {
            // Si no hay token, usar localStorage como fallback
            if (!this.config.token) {
                return this.saveToLocalStorage(data);
            }

            // Obtener el archivo actual
            const currentData = await this.getCurrentData();
            
            // Agregar nuevos datos
            const updatedData = [...currentData, data];
            
            // Subir al repositorio
            await this.updateFile(updatedData);
            
            return true;
        } catch (error) {
            console.error('Error guardando en GitHub:', error);
            // Fallback a localStorage
            return this.saveToLocalStorage(data);
        }
    }

    async getCurrentData() {
        try {
            const response = await fetch(`${this.apiUrl}/contents/${this.config.dataFile}`, {
                headers: {
                    'Authorization': `token ${this.config.token}`,
                    'Accept': 'application/vnd.github.v3+json'
                }
            });

            if (response.ok) {
                const fileData = await response.json();
                const content = atob(fileData.content);
                return JSON.parse(content);
            }
        } catch (error) {
            console.log('No hay datos previos, empezando desde cero');
        }
        
        return [];
    }

    async updateFile(data) {
        const content = btoa(JSON.stringify(data, null, 2));
        
        const response = await fetch(`${this.apiUrl}/contents/${this.config.dataFile}`, {
            method: 'PUT',
            headers: {
                'Authorization': `token ${this.config.token}`,
                'Accept': 'application/vnd.github.v3+json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message: `Update analytics data - ${new Date().toISOString()}`,
                content: content,
                branch: this.config.branch
            })
        });

        if (!response.ok) {
            throw new Error(`Error actualizando archivo: ${response.statusText}`);
        }
    }

    saveToLocalStorage(data) {
        try {
            const existingData = JSON.parse(localStorage.getItem('analytics-data') || '[]');
            existingData.push(data);
            localStorage.setItem('analytics-data', JSON.stringify(existingData));
            return true;
        } catch (error) {
            console.error('Error guardando en localStorage:', error);
            return false;
        }
    }

    async getAnalyticsData() {
        try {
            if (this.config.token) {
                return await this.getCurrentData();
            } else {
                return JSON.parse(localStorage.getItem('analytics-data') || '[]');
            }
        } catch (error) {
            console.error('Error obteniendo datos:', error);
            return [];
        }
    }
}

// Exportar para uso global
window.GitHubAnalytics = GitHubAnalytics;
