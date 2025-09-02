'use client';

interface HeroSectionProps {
  language: 'en' | 'ny';
}

const translations = {
  en: {
    title: 'Welcome to Wezi Clinic',
    description: 'Your trusted partner in providing accessible, quality medical care for the community.',
    cta: 'Get Started',
  },
  ny: {
    title: 'Takulandilani ku Wezi Clinic',
    description: 'Mnzanu wodalirika popereka chithandizo chamankhwala choyenera komanso chabwino kwa anthu ammudzi.',
    cta: 'Yambani',
  },
};

export default function HeroSection({ language }: HeroSectionProps) {
  return (
    <section className="bg-blue-100 py-20 text-center">
      <h2 className="text-5xl font-bold text-blue-700 mb-4">{translations[language].title}</h2>
      <p className="text-lg text-gray-700 max-w-2xl mx-auto mb-6">
        {translations[language].description}
      </p>
      <button className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition-colors">
        {translations[language].cta}
      </button>
    </section>
  );
}