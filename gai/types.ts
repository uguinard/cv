
export interface Translation {
  [key: string]: string;
}

export interface Translations {
  [lang: string]: Translation;
}

export interface Experience {
  titleKey: string;
  companyKey: string;
  dateKey: string;
  locationKey: string;
  descriptionKeys: string[];
  icon: string;
  current?: boolean;
}

export interface Education {
  degreeKey: string;
  institutionKey: string;
  dateKey: string;
  locationKey: string;
  icon: string;
  current?: boolean;
}

export interface Skill {
  nameKey: string;
  percentage: number;
}

export interface SkillCategory {
  titleKey: string;
  icon: string;
  skills: Skill[];
}

export interface Language {
  nameKey: string;
  levelKey: string;
  levelClass: string;
  flag: string;
}

export interface CVData {
  experience: Experience[];
  education: Education[];
  skills: SkillCategory[];
  languages: Language[];
}

export interface LanguageOption {
    code: string;
    name: string;
    flag: string;
}

export interface AppContextType {
    language: string;
    t: (key: string) => string;
    changeLanguage: (lang: string) => void;
    theme: 'light' | 'dark';
    toggleTheme: () => void;
    isContactModalOpen: boolean;
    setContactModalOpen: (isOpen: boolean) => void;
    isHighContrast: boolean;
    toggleHighContrast: () => void;
}
