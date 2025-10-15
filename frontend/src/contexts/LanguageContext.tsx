import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'hi' | 'es';

interface Translations {
  [key: string]: {
    [key: string]: string;
  };
}

const translations: Translations = {
  en: {
    'nav.home': 'Home',
    'nav.assessment': 'Assessment',
    'nav.about': 'About',
    'nav.contact': 'Contact',
    'nav.login': 'Login',
    'nav.register': 'Register',
    'nav.logout': 'Logout',
    'nav.dashboard': 'Dashboard',
    'hero.title': 'Cognitive & Speech Screening',
    'hero.subtitle': 'AI-powered interactive assessments for early detection of cognitive changes. Simple, accessible, and scientifically designed.',
    'hero.start': 'Start Assessment',
    'hero.learn': 'Learn More',
    'features.title': 'How It Works',
    'features.memory': 'Memory & Attention Tests',
    'features.memory.desc': 'Interactive cognitive exercises designed by healthcare professionals to assess memory recall, attention span, and problem-solving abilities.',
    'features.speech': 'Speech Analysis',
    'features.speech.desc': 'Voice recording with AI-powered analysis of speech patterns, tone, hesitation, and coherence for comprehensive evaluation.',
    'features.results': 'Personalized Results',
    'features.results.desc': 'Receive detailed cognitive performance summaries with risk assessment and recommendations for next steps.',
    'login.title': 'Welcome Back',
    'login.subtitle': 'Sign in to continue your cognitive health journey',
    'login.email': 'Email',
    'login.password': 'Password',
    'login.button': 'Sign In',
    'login.noAccount': "Don't have an account?",
    'login.signUp': 'Sign up',
    'register.title': 'Create Account',
    'register.subtitle': 'Start your cognitive health screening journey',
    'register.name': 'Full Name',
    'register.email': 'Email',
    'register.password': 'Password',
    'register.language': 'Preferred Language',
    'register.button': 'Create Account',
    'register.hasAccount': 'Already have an account?',
    'register.signIn': 'Sign in',
  },
  hi: {
    'nav.home': 'होम',
    'nav.assessment': 'मूल्यांकन',
    'nav.about': 'के बारे में',
    'nav.contact': 'संपर्क करें',
    'nav.login': 'लॉगिन',
    'nav.register': 'रजिस्टर',
    'nav.logout': 'लॉगआउट',
    'nav.dashboard': 'डैशबोर्ड',
    'hero.title': 'संज्ञानात्मक और वाणी जांच',
    'hero.subtitle': 'संज्ञानात्मक परिवर्तनों की शुरुआती पहचान के लिए एआई-संचालित इंटरैक्टिव मूल्यांकन। सरल, सुलभ और वैज्ञानिक रूप से डिज़ाइन किया गया।',
    'hero.start': 'मूल्यांकन शुरू करें',
    'hero.learn': 'अधिक जानें',
    'features.title': 'यह कैसे काम करता है',
    'features.memory': 'स्मृति और ध्यान परीक्षण',
    'features.memory.desc': 'स्वास्थ्य पेशेवरों द्वारा डिज़ाइन किए गए इंटरैक्टिव संज्ञानात्मक अभ्यास जो स्मृति, ध्यान अवधि और समस्या-समाधान क्षमताओं का मूल्यांकन करते हैं।',
    'features.speech': 'वाणी विश्लेषण',
    'features.speech.desc': 'व्यापक मूल्यांकन के लिए वाणी पैटर्न, स्वर, संकोच और सुसंगतता के एआई-संचालित विश्लेषण के साथ वॉयस रिकॉर्डिंग।',
    'features.results': 'व्यक्तिगत परिणाम',
    'features.results.desc': 'जोखिम मूल्यांकन और अगले कदमों की सिफारिशों के साथ विस्तृत संज्ञानात्मक प्रदर्शन सारांश प्राप्त करें।',
    'login.title': 'वापसी पर स्वागत है',
    'login.subtitle': 'अपनी संज्ञानात्मक स्वास्थ्य यात्रा जारी रखने के लिए साइन इन करें',
    'login.email': 'ईमेल',
    'login.password': 'पासवर्ड',
    'login.button': 'साइन इन करें',
    'login.noAccount': 'खाता नहीं है?',
    'login.signUp': 'साइन अप करें',
    'register.title': 'खाता बनाएं',
    'register.subtitle': 'अपनी संज्ञानात्मक स्वास्थ्य जांच यात्रा शुरू करें',
    'register.name': 'पूरा नाम',
    'register.email': 'ईमेल',
    'register.password': 'पासवर्ड',
    'register.language': 'पसंदीदा भाषा',
    'register.button': 'खाता बनाएं',
    'register.hasAccount': 'पहले से एक खाता है?',
    'register.signIn': 'साइन इन करें',
  },
  es: {
    'nav.home': 'Inicio',
    'nav.assessment': 'Evaluación',
    'nav.about': 'Acerca de',
    'nav.contact': 'Contacto',
    'nav.login': 'Iniciar sesión',
    'nav.register': 'Registrarse',
    'nav.logout': 'Cerrar sesión',
    'nav.dashboard': 'Panel',
    'hero.title': 'Evaluación Cognitiva y del Habla',
    'hero.subtitle': 'Evaluaciones interactivas impulsadas por IA para la detección temprana de cambios cognitivos. Simple, accesible y científicamente diseñado.',
    'hero.start': 'Iniciar Evaluación',
    'hero.learn': 'Más información',
    'features.title': 'Cómo Funciona',
    'features.memory': 'Pruebas de Memoria y Atención',
    'features.memory.desc': 'Ejercicios cognitivos interactivos diseñados por profesionales de la salud para evaluar la memoria, el lapso de atención y las habilidades de resolución de problemas.',
    'features.speech': 'Análisis del Habla',
    'features.speech.desc': 'Grabación de voz con análisis impulsado por IA de patrones de habla, tono, hesitación y coherencia para una evaluación integral.',
    'features.results': 'Resultados Personalizados',
    'features.results.desc': 'Reciba resúmenes detallados del rendimiento cognitivo con evaluación de riesgos y recomendaciones para los próximos pasos.',
    'login.title': 'Bienvenido de nuevo',
    'login.subtitle': 'Inicie sesión para continuar su viaje de salud cognitiva',
    'login.email': 'Correo electrónico',
    'login.password': 'Contraseña',
    'login.button': 'Iniciar sesión',
    'login.noAccount': '¿No tienes una cuenta?',
    'login.signUp': 'Regístrate',
    'register.title': 'Crear Cuenta',
    'register.subtitle': 'Comienza tu viaje de evaluación de salud cognitiva',
    'register.name': 'Nombre completo',
    'register.email': 'Correo electrónico',
    'register.password': 'Contraseña',
    'register.language': 'Idioma preferido',
    'register.button': 'Crear cuenta',
    'register.hasAccount': '¿Ya tienes una cuenta?',
    'register.signIn': 'Iniciar sesión',
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    const storedLang = localStorage.getItem('language') as Language;
    if (storedLang && ['en', 'hi', 'es'].includes(storedLang)) {
      setLanguageState(storedLang);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};