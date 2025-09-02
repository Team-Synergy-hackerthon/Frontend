'use client';

interface AboutUsProps {
  language: 'en' | 'ny';
}

const translations = {
  en: {
    title: 'About Us',
    description: 'Wezi Clinic is dedicated to improving healthcare accessibility. Established in 2020, we provide services including surgery, obstetrics, gynecology, vaccinations, and routine check-ups, supported by expert clinicians.',
  },
  ny: {
    title: 'Za Ife',
    description: 'Wezi Clinic yadzipereka kupititsa patsogolo chithandizo chamankhwala. Yakhazikitsidwa mu 2020, timapereka ntchito monga opareshoni, kubereka, gynecology, katemera, ndi kuyezetsa kwanthawi zonse, mothandizidwa ndi akatswiri azachipatala.',
  },
};

export default function AboutUs({ language }: AboutUsProps) {
  return (
    <section id="about" className="py-16 bg-white text-center">
      <h3 className="text-3xl font-semibold text-blue-700 mb-4">{translations[language].title}</h3>
      <p className="max-w-3xl mx-auto text-gray-600 text-lg">
        {translations[language].description}
      </p>
    </section>
  );
}