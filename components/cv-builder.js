/**
 * CV Builder - Sistema de Componentes Modulares
 * Permite construir el CV dinámicamente desde JSON
 */

class CVBuilder {
    constructor() {
        this.data = null;
        this.translations = {};
    }

    // Cargar datos del CV
    async loadData() {
        try {
            const response = await fetch('data/cv.json');
            this.data = await response.json();
            return this.data;
        } catch (error) {
            console.error('Error loading CV data:', error);
            return null;
        }
    }

    // Cargar traducciones
    async loadTranslations(lang) {
        try {
            const response = await fetch(`locales/${lang}.json`);
            this.translations[lang] = await response.json();
            return this.translations[lang];
        } catch (error) {
            console.error(`Error loading translations for ${lang}:`, error);
            return null;
        }
    }

    // Generar sección personal
    generatePersonalSection() {
        if (!this.data?.personal) return '';
        
        const { name, title, location, email, phones, linkedin, photo } = this.data.personal;
        
        return `
            <header>
                <div class="profile-img-container">
                    <a href="${linkedin}" target="_blank" rel="noopener noreferrer" class="profile-img-link">
                        <img src="${photo}" alt="Photo of ${name}" class="profile-img" width="150" height="150">
                    </a>
                </div>
                <h1>${name}</h1>
                <ul class="contact-info">
                    <li><i class="fas fa-map-marker-alt"></i> ${location}</li>
                    <li><i class="fas fa-envelope"></i> <a href="mailto:${email}">${email}</a></li>
                    ${phones.map(phone => `<li><i class="fas fa-phone"></i> <a href="tel:${phone.replace(/[^\d+]/g, '')}">${phone}</a></li>`).join('')}
                </ul>
            </header>
        `;
    }

    // Generar sección de experiencia
    generateExperienceSection(lang = 'en') {
        if (!this.data?.experience) return '';
        
        const translations = this.translations[lang] || {};
        
        return `
            <section id="experience" class="section">
                <h2 data-lang-key="experience_title">${translations.experience_title || 'Work Experience'}</h2>
                ${this.data.experience.map(job => `
                    <div class="job">
                        <h3 data-lang-key="${job.title_key}">${translations[job.title_key] || job.title}</h3>
                        <div class="job-details">
                            <span>${job.company} | ${job.location}</span>
                            <span class="date">${job.period}</span>
                        </div>
                        <ul>
                            ${job.descriptions.map(descKey => 
                                `<li data-lang-key="${descKey}">${translations[descKey] || descKey}</li>`
                            ).join('')}
                        </ul>
                    </div>
                `).join('')}
            </section>
        `;
    }

    // Generar sección de educación
    generateEducationSection(lang = 'en') {
        if (!this.data?.education) return '';
        
        const translations = this.translations[lang] || {};
        
        return `
            <section id="education" class="section">
                <h2 data-lang-key="education_title">${translations.education_title || 'Education'}</h2>
                ${this.data.education.map(edu => `
                    <div class="education-item">
                        <h3 data-lang-key="${edu.title_key}">${translations[edu.title_key] || edu.title}</h3>
                        <div class="education-details">
                            <span>${edu.institution} | ${edu.location}</span>
                            <span>${edu.period}</span>
                        </div>
                    </div>
                `).join('')}
            </section>
        `;
    }

    // Generar sección de habilidades
    generateSkillsSection(lang = 'en') {
        if (!this.data?.skills) return '';
        
        const translations = this.translations[lang] || {};
        
        return `
            <section id="skills" class="section">
                <h2 data-lang-key="skills_title">${translations.skills_title || 'Key Skills'}</h2>
                <h3 data-lang-key="skills_soft_title">${translations.skills_soft_title || 'Soft Skills'}</h3>
                <div class="skills-container">
                    ${this.data.skills.soft.map(skillKey => 
                        `<span class="skill" data-lang-key="${skillKey}">${translations[skillKey] || skillKey}</span>`
                    ).join('')}
                </div>
                <h3 data-lang-key="skills_tech_title">${translations.skills_tech_title || 'Technologies & Platforms'}</h3>
                <div class="skills-container">
                    ${this.data.skills.technical.map(skill => 
                        `<span class="skill">${skill}</span>`
                    ).join('')}
                </div>
            </section>
        `;
    }

    // Generar sección de idiomas
    generateLanguagesSection(lang = 'en') {
        if (!this.data?.languages) return '';
        
        const translations = this.translations[lang] || {};
        
        return `
            <section id="languages" class="section">
                <h2 data-lang-key="languages_title">${translations.languages_title || 'Languages'}</h2>
                <div class="languages">
                    ${this.data.languages.map(langItem => `
                        <div class="language">
                            <p>
                                <strong data-lang-key="${langItem.name_key}">${translations[langItem.name_key] || langItem.name_key}:</strong>
                                <span data-lang-key="${langItem.level_key}">${translations[langItem.level_key] || langItem.level_key}</span>
                            </p>
                            <div class="progress-bar" 
                                 role="progressbar" 
                                 aria-label="${langItem.name_key} proficiency" 
                                 aria-valuenow="${langItem.proficiency}" 
                                 aria-valuemin="0" 
                                 aria-valuemax="100">
                                <div class="progress" style="width: ${langItem.proficiency}%;"></div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </section>
        `;
    }

    // Generar CV completo
    async generateFullCV(lang = 'en') {
        await this.loadData();
        await this.loadTranslations(lang);
        
        const personal = this.generatePersonalSection();
        const experience = this.generateExperienceSection(lang);
        const education = this.generateEducationSection(lang);
        const skills = this.generateSkillsSection(lang);
        const languages = this.generateLanguagesSection(lang);
        
        return `
            <div class="container">
                ${personal}
                <main>
                    <section id="profile" class="section">
                        <h2 data-lang-key="profile_title">${this.translations[lang]?.profile_title || 'Profile'}</h2>
                        <p data-lang-key="profile_text">${this.translations[lang]?.profile_text || ''}</p>
                    </section>
                    ${experience}
                    ${education}
                    ${skills}
                    ${languages}
                </main>
            </div>
        `;
    }

    // Actualizar CV dinámicamente
    async updateCV(lang = 'en') {
        const cvHTML = await this.generateFullCV(lang);
        const mainContainer = document.querySelector('.container');
        if (mainContainer) {
            mainContainer.innerHTML = cvHTML;
        }
    }
}

// Exportar para uso global
window.CVBuilder = CVBuilder;
