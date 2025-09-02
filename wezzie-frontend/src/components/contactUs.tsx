'use client';

import Link from 'next/link';

interface ContactUsProps {
  language: 'en' | 'ny';
}

const translations = {
  en: {
    title: 'Contact Us',
    description: 'Reach us for appointments or inquiries.',
    cta: 'Book Appointment',
  },
  ny: {
    title: 'Lumikizanani nafe',
    description: 'Tifikeni kuti mupange nthawi kapena kufunsa mafunso.',
    cta: 'Bukani Nthawi',
  },
};

export default function ContactUs({ language }: ContactUsProps) {
  return (
    <section id="contact" className="py-16 bg-blue-50 text-center">
      <h3 className="text-3xl font-semibold text-blue-700 mb-4">{translations[language].title}</h3>
      <p className="text-gray-600 mb-6 text-lg">{translations[language].description}</p>
      <Link href="/appointments">
        <button className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition-colors">
          {translations[language].cta}
        </button>
      </Link>
    </section>
  );
}