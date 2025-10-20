import React, { useState, useEffect, useRef } from 'react';
import { useAppContext } from './App';
import { cvData, languageOptions } from './data';
import type { Skill } from './types';

// Custom Hook for detecting when an element is on screen
const useOnScreen = (options: IntersectionObserverInit) => {
    const ref = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setIsVisible(true);
                observer.unobserve(entry.target);
            }
        }, options);

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => {
            if (ref.current) {
                // eslint-disable-next-line react-hooks/exhaustive-deps
                observer.unobserve(ref.current);
            }
        };
    }, [options]);

    return [ref, isVisible] as const;
};


// Generic Section Component with Animation
const Section: React.FC<{ id: string; titleKey: string; children: React.ReactNode; className?: string }> = ({ id, titleKey, children, className = '' }) => {
    const { t } = useAppContext();
    // FIX: Removed `triggerOnce` as it's not a valid property for IntersectionObserverInit.
    // The hook already unobserves the target, effectively making it trigger once.
    const [ref, isVisible] = useOnScreen({ threshold: 0.1 });

    return (
        <section
            id={id}
            ref={ref}
            className={`transition-all duration-700 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'} ${className}`}
        >
            <h2 className="text-3xl font-bold mb-8 text-blue-600 dark:text-blue-400 border-b-2 border-blue-200 dark:border-blue-800 pb-2">
                {t(titleKey)}
            </h2>
            {children}
        </section>
    );
};

export const Header: React.FC = () => {
    const { t, language, changeLanguage, theme, toggleTheme, isHighContrast, toggleHighContrast, setContactModalOpen } = useAppContext();
    const [isMenuOpen, setMenuOpen] = useState(false);
    const [isScrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = ['profile', 'experience', 'education', 'skills', 'languages'];

    return (
        <header className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm shadow-md' : 'bg-transparent'}`}>
            <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    <div className="text-xl font-bold text-gray-800 dark:text-white">
                        <a href="#main-content">SERGIO URIBE</a>
                    </div>
                    <div className="hidden md:flex items-center space-x-4">
                        {navLinks.map(link => (
                            <a key={link} href={`#${link}`} className="px-3 py-2 rounded-md text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700">{t(`nav_${link}`)}</a>
                        ))}
                    </div>
                    <div className="hidden md:flex items-center space-x-2">
                        <select
                            value={language}
                            onChange={(e) => changeLanguage(e.target.value)}
                            className="bg-gray-200 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md py-1 px-2 text-sm"
                            aria-label="Language Selector"
                        >
                            {languageOptions.map(opt => <option key={opt.code} value={opt.code}>{opt.flag} {opt.name}</option>)}
                        </select>
                        <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700" aria-label="Toggle Theme">
                            <i className={theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon'}></i>
                        </button>
                        <button onClick={toggleHighContrast} className={`p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 ${isHighContrast ? 'text-blue-500' : ''}`} aria-label="Toggle High Contrast">
                             <i className="fas fa-adjust"></i>
                        </button>
                         <button onClick={() => window.print()} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700" aria-label="Print CV">
                             <i className="fas fa-print"></i>
                        </button>
                    </div>
                    <div className="md:hidden">
                        <button onClick={() => setMenuOpen(!isMenuOpen)} className="p-2 rounded-md" aria-label="Open Menu">
                            <i className="fas fa-bars"></i>
                        </button>
                    </div>
                </div>
                {isMenuOpen && (
                    <div className="md:hidden bg-white dark:bg-gray-800 py-4">
                        {navLinks.map(link => (
                            <a key={link} href={`#${link}`} onClick={() => setMenuOpen(false)} className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">{t(`nav_${link}`)}</a>
                        ))}
                    </div>
                )}
            </nav>
        </header>
    );
};

export const ProfileSection: React.FC = () => {
    const { t, setContactModalOpen } = useAppContext();
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <Section id="profile" titleKey="profile_title">
             <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12 bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg">
                <img src="https://picsum.photos/seed/sergioprofile/200/200" alt="Sergio Uribe Guinard" className="w-40 h-40 rounded-full object-cover border-4 border-blue-500 shadow-md"/>
                <div className="flex-1 text-center md:text-left">
                     <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-2">Sergio Uribe Guinard</h1>
                     <h3 className="text-xl font-semibold text-blue-600 dark:text-blue-400 mb-4">{t('profile_approach_title')}</h3>
                     <p className={`text-gray-600 dark:text-gray-300 mb-4 ${!isExpanded ? 'line-clamp-3' : ''}`}>
                         {t('profile_text')}
                     </p>
                     <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                         <button onClick={() => setIsExpanded(!isExpanded)} className="text-blue-500 hover:underline">
                             {isExpanded ? t('read_less') : t('read_more')}
                         </button>
                         <button onClick={() => setContactModalOpen(true)} className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors">
                            <i className="fas fa-address-card mr-2"></i>{t('contact_btn_text')}
                         </button>
                         <a href="https://www.linkedin.com/in/sergio-ug/" target="_blank" rel="noopener noreferrer" className="px-6 py-3 bg-gray-700 text-white font-semibold rounded-lg shadow-md hover:bg-gray-800 transition-colors flex items-center justify-center">
                            <i className="fab fa-linkedin mr-2"></i>LinkedIn
                         </a>
                     </div>
                </div>
            </div>
        </Section>
    );
};

export const ExperienceSection: React.FC = () => {
    const { t } = useAppContext();

    return (
        <Section id="experience" titleKey="experience_title">
            <div className="relative border-l-2 border-blue-200 dark:border-blue-800 pl-8 space-y-12">
                {cvData.experience.map((job, index) => (
                    <div key={index} className="relative">
                        <div className={`absolute -left-[42px] top-1 w-8 h-8 rounded-full flex items-center justify-center ${job.current ? 'bg-blue-600 text-white animate-pulse' : 'bg-white dark:bg-gray-800 text-blue-600'}`}>
                            <i className={job.icon}></i>
                        </div>
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
                            <p className="text-sm text-gray-500 dark:text-gray-400">{job.dateKey}</p>
                            <h3 className="text-xl font-bold mt-1">{t(job.titleKey)}</h3>
                            <p className="font-semibold text-blue-500">{t(job.companyKey)} - {t(job.locationKey)}</p>
                            <ul className="mt-4 list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2">
                                {job.descriptionKeys.map((descKey, i) => (
                                    <li key={i}>{t(descKey)}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                ))}
            </div>
        </Section>
    );
};

export const EducationSection: React.FC = () => {
    const { t } = useAppContext();

    return (
        <Section id="education" titleKey="education_title">
            <div className="grid md:grid-cols-2 gap-8">
                {cvData.education.map((edu, index) => (
                    <div key={index} className={`bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md flex items-start gap-4 ${edu.current ? 'border-2 border-blue-500' : ''}`}>
                         <div className={`text-2xl text-white rounded-full w-12 h-12 flex-shrink-0 flex items-center justify-center ${edu.current ? 'bg-blue-600' : 'bg-blue-500'}`}>
                            <i className={edu.icon}></i>
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">{t(edu.dateKey)}</p>
                            <h3 className="text-lg font-bold">{t(edu.degreeKey)}</h3>
                            <p className="text-gray-600 dark:text-gray-300">{t(edu.institutionKey)} - {t(edu.locationKey)}</p>
                        </div>
                    </div>
                ))}
            </div>
        </Section>
    );
};

const SkillBar: React.FC<{ skill: Skill }> = ({ skill }) => {
    const { t } = useAppContext();
    const [ref, isVisible] = useOnScreen({ threshold: 0.5 });
    return (
         <div ref={ref} className="mb-4">
            <div className="flex justify-between mb-1">
                <span className="text-base font-medium text-gray-700 dark:text-gray-200">{t(skill.nameKey)}</span>
                <span className="text-sm font-medium text-blue-700 dark:text-blue-400">{skill.percentage}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                <div 
                    className="bg-blue-600 h-2.5 rounded-full transition-all duration-1000 ease-out" 
                    style={{ width: isVisible ? `${skill.percentage}%` : '0%' }}
                ></div>
            </div>
        </div>
    );
};

export const SkillsSection: React.FC = () => {
    const { t } = useAppContext();

    return (
        <Section id="skills" titleKey="skills_title">
            <div className="grid md:grid-cols-2 gap-12">
                {cvData.skills.map((category, index) => (
                    <div key={index} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                        <div className="flex items-center gap-4 mb-4">
                            <i className={`${category.icon} text-2xl text-blue-600 dark:text-blue-400`}></i>
                            <h3 className="text-2xl font-semibold">{t(category.titleKey)}</h3>
                        </div>
                        <div>
                            {category.skills.map((skill, i) => (
                                <SkillBar key={i} skill={skill} />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </Section>
    );
};

export const LanguagesSection: React.FC = () => {
    const { t } = useAppContext();
    const levelColorClasses = {
        native: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
        advanced: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
        intermediate: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
        beginner: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    };
    
    return (
        <Section id="languages" titleKey="languages_title">
            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
                {cvData.languages.map((lang, index) => (
                     <div key={index} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md text-center hover:scale-105 transition-transform">
                        <span className="text-4xl">{lang.flag}</span>
                        <h3 className="text-xl font-bold mt-3">{t(lang.nameKey)}</h3>
                        <p className={`mt-1 text-sm font-semibold px-3 py-1 rounded-full inline-block ${levelColorClasses[lang.levelClass as keyof typeof levelColorClasses]}`}>{t(lang.levelKey)}</p>
                    </div>
                ))}
            </div>
        </Section>
    );
};

export const Footer: React.FC = () => {
    const { t } = useAppContext();
    return (
        <footer className="text-center py-6 bg-gray-100 dark:bg-gray-800 text-sm text-gray-500 dark:text-gray-400">
            <p>&copy; {new Date().getFullYear()} Sergio Uribe Guinard. All rights reserved.</p>
            <p>{t('last_updated')} <time dateTime="2025-01-20">January 20, 2025</time></p>
        </footer>
    );
};

export const ContactModal: React.FC = () => {
    const { t, isContactModalOpen, setContactModalOpen } = useAppContext();

    if (!isContactModalOpen) return null;

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        // Maybe show a toast notification here
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={() => setContactModalOpen(false)}>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl w-full max-w-md p-6 relative" onClick={(e) => e.stopPropagation()}>
                <button onClick={() => setContactModalOpen(false)} className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 dark:hover:text-white">
                    <i className="fas fa-times text-xl"></i>
                </button>
                <h3 className="text-2xl font-bold mb-6 text-center">{t('contact_title')}</h3>
                <div className="space-y-4">
                     <div className="flex items-center justify-between p-3 bg-gray-100 dark:bg-gray-700 rounded-md">
                        <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{t('contact_email_label')}</p>
                            <a href="mailto:uguinard@gmail.com" className="font-semibold text-blue-600">uguinard@gmail.com</a>
                        </div>
                        <button onClick={() => copyToClipboard('uguinard@gmail.com')} className="p-2 text-gray-500 hover:text-blue-600"><i className="fas fa-copy"></i></button>
                    </div>
                     <div className="flex items-center justify-between p-3 bg-gray-100 dark:bg-gray-700 rounded-md">
                        <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{t('contact_phone_spain_label')}</p>
                            <a href="tel:+34666209033" className="font-semibold">(+34) 666 209 033</a>
                        </div>
                         <button onClick={() => copyToClipboard('+34666209033')} className="p-2 text-gray-500 hover:text-blue-600"><i className="fas fa-copy"></i></button>
                    </div>
                     <div className="flex items-center justify-between p-3 bg-gray-100 dark:bg-gray-700 rounded-md">
                        <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{t('contact_phone_thailand_label')}</p>
                            <a href="tel:+660928106277" className="font-semibold">(+66) 092 810 6277</a>
                        </div>
                         <button onClick={() => copyToClipboard('+660928106277')} className="p-2 text-gray-500 hover:text-blue-600"><i className="fas fa-copy"></i></button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export const ScrollProgressBar: React.FC = () => {
    const [width, setWidth] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const totalHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            setWidth((window.scrollY / totalHeight) * 100);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="fixed top-0 left-0 w-full h-1 bg-gray-200 dark:bg-gray-700 z-50">
            <div className="h-1 bg-blue-600" style={{ width: `${width}%` }}></div>
        </div>
    );
};

export const BackToTopButton: React.FC = () => {
    const [isVisible, setIsVisible] = useState(false);
    
    useEffect(() => {
        const toggleVisibility = () => {
            if (window.pageYOffset > 300) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener('scroll', toggleVisibility);
        return () => window.removeEventListener('scroll', toggleVisibility);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    return (
        <button
            onClick={scrollToTop}
            className={`fixed bottom-5 right-5 w-12 h-12 bg-blue-600 text-white rounded-full shadow-lg flex items-center justify-center transition-opacity duration-300 hover:bg-blue-700 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
            aria-label="Back to top"
        >
            <i className="fas fa-arrow-up"></i>
        </button>
    );
};

export const MobileNav: React.FC = () => {
    const { t } = useAppContext();
    const navLinks = ['profile', 'experience', 'education', 'skills', 'languages'];
    const [activeSection, setActiveSection] = useState('profile');

    useEffect(() => {
        const sections = navLinks.map(id => document.getElementById(id));
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setActiveSection(entry.target.id);
                }
            });
        }, { rootMargin: "-50% 0px -50% 0px", threshold: 0 });

        sections.forEach(section => section && observer.observe(section));
        
        return () => sections.forEach(section => section && observer.unobserve(section));
    }, [navLinks]);


    return (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm shadow-[0_-2px_10px_rgba(0,0,0,0.1)] z-40">
            <div className="flex justify-around items-center h-16">
                {navLinks.map((link) => {
                    const icons: { [key: string]: string } = {
                        profile: 'fas fa-user',
                        experience: 'fas fa-briefcase',
                        education: 'fas fa-graduation-cap',
                        skills: 'fas fa-cogs',
                        languages: 'fas fa-language',
                    };

                    return (
                        <a 
                            key={link} 
                            href={`#${link}`} 
                            className={`flex flex-col items-center transition-colors duration-200 ${activeSection === link ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'}`}
                        >
                            <i className={`${icons[link]} text-xl`}></i>
                            <span className="text-xs mt-1">{t(`nav_${link}`)}</span>
                        </a>
                    );
                })}
            </div>
        </nav>
    );
};