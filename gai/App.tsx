
import React, { useState, useEffect, createContext, useContext, useCallback, useRef } from 'react';
import { translations } from './data';
import type { AppContextType } from './types';
import { 
    Header, 
    ProfileSection, 
    ExperienceSection, 
    EducationSection, 
    SkillsSection, 
    LanguagesSection, 
    Footer, 
    ContactModal,
    ScrollProgressBar,
    BackToTopButton,
    MobileNav
} from './components';

export const AppContext = createContext<AppContextType | null>(null);

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

const App: React.FC = () => {
    const [language, setLanguage] = useState<string>('es');
    const [theme, setTheme] = useState<'light' | 'dark'>('light');
    const [isContactModalOpen, setContactModalOpen] = useState<boolean>(false);
    const [isHighContrast, setHighContrast] = useState<boolean>(false);

    useEffect(() => {
        const savedLang = localStorage.getItem('cv-language') || 'es';
        setLanguage(savedLang);

        const savedTheme = localStorage.getItem('cv-theme') as 'light' | 'dark' || 'light';
        setTheme(savedTheme);
        
        const savedContrast = localStorage.getItem('cv-high-contrast') === 'true';
        setHighContrast(savedContrast);

    }, []);

    useEffect(() => {
        document.documentElement.lang = language;
        localStorage.setItem('cv-language', language);
    }, [language]);

    useEffect(() => {
        const root = window.document.documentElement;
        root.classList.remove('dark', 'light');
        root.classList.add(theme);
        localStorage.setItem('cv-theme', theme);

        if(isHighContrast) {
             root.classList.add('high-contrast');
        } else {
             root.classList.remove('high-contrast');
        }
        localStorage.setItem('cv-high-contrast', String(isHighContrast));
    }, [theme, isHighContrast]);

    const t = useCallback((key: string): string => {
        return translations[language]?.[key] || translations['en']?.[key] || key;
    }, [language]);

    const changeLanguage = (lang: string) => {
        setLanguage(lang);
    };

    const toggleTheme = () => {
        setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
    };
    
    const toggleHighContrast = () => {
        setHighContrast(prev => !prev);
    };

    const contextValue: AppContextType = {
        language,
        t,
        changeLanguage,
        theme,
        toggleTheme,
        isContactModalOpen,
        setContactModalOpen,
        isHighContrast,
        toggleHighContrast
    };

    return (
        <AppContext.Provider value={contextValue}>
            <div className={`bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 transition-colors duration-300`}>
                <ScrollProgressBar />
                <Header />
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16">
                    <main id="main-content" className="flex flex-col gap-16 md:gap-24">
                        <ProfileSection />
                        <ExperienceSection />
                        <EducationSection />
                        <SkillsSection />
                        <LanguagesSection />
                    </main>
                </div>
                <Footer />
                <ContactModal />
                <BackToTopButton />
                <MobileNav />
            </div>
        </AppContext.Provider>
    );
};

export default App;
