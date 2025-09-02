'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Facebook, Linkedin, Twitter, Instagram, Phone, Mail, MapPin } from 'lucide-react';

interface FooterProps {
  language: 'en' | 'ny';
}

const translations = {
  en: {
    description: 'Your trusted healthcare partner, providing quality medical services to our community.',
    quickLinks: 'Quick Links',
    contactUs: 'Contact Us',
    operatingHours: 'Operating Hours',
    about: 'About Us',
    services: 'Our Services',
    doctors: 'Our Doctors',
    appointment: 'Book Appointment',
    phone: '+265 999 999 999',
    email: 'info@weziclinic.com',
    address: '123 Hospital Road, Lilongwe, Malawi',
    hours: {
      weekday: 'Monday - Friday: 8:00 AM - 8:00 PM',
      saturday: 'Saturday: 9:00 AM - 6:00 PM',
      sunday: 'Sunday: 10:00 AM - 4:00 PM',
      emergency: '24/7 Emergency Services',
    },
    copyright: `© ${new Date().getFullYear()} Wezi Clinic. All rights reserved.`,
    privacy: 'Privacy Policy',
    terms: 'Terms of Service',
    sitemap: 'Sitemap',
  },
  ny: {
    description: 'Mnzanu wodalirika wazachipatala, wopereka ntchito zamankhwala zabwino kwa anthu ammudzi.',
    quickLinks: 'Malumikizidwe Achangu',
    contactUs: 'Lumikizanani nafe',
    operatingHours: 'Maola Ogwirira Ntchito',
    about: 'Za Ife',
    services: 'Ntchito Zathu',
    doctors: 'Madokotala Athu',
    appointment: 'Bukani Nthawi',
    phone: '+265 999 999 999',
    email: 'info@weziclinic.com',
    address: '123 Hospital Road, Lilongwe, Malawi',
    hours: {
      weekday: 'Lolemba - Lachisanu: 8:00 AM - 8:00 PM',
      saturday: 'Loweruka: 9:00 AM - 6:00 PM',
      sunday: 'Lamlungu: 10:00 AM - 4:00 PM',
      emergency: 'Chithandizo Cha Emergency 24/7',
    },
    copyright: `© ${new Date().getFullYear()} Wezi Clinic. Zonse zili ndi ufulu.`,
    privacy: 'Mfundo Zazinsinsi',
    terms: 'Migwirizano ya Ntchito',
    sitemap: 'Mapu a Tsamba',
  },
};

export default function Footer({ language }: FooterProps) {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="mb-4">
              <Image
                src="/logo.png"
                alt="Wezi Clinic Logo"
                width={120}
                height={40}
                className="invert"
              />
            </div>
            <p className="text-sm mb-4">{translations[language].description}</p>
            <div className="flex space-x-4">
              <Link href="https://facebook.com" className="hover:text-blue-400 transition-colors">
                <Facebook size={20} />
              </Link>
              <Link href="https://linkedin.com" className="hover:text-blue-400 transition-colors">
                <Linkedin size={20} />
              </Link>
              <Link href="https://twitter.com" className="hover:text-blue-400 transition-colors">
                <Twitter size={20} />
              </Link>
              <Link href="https://instagram.com" className="hover:text-blue-400 transition-colors">
                <Instagram size={20} />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">{translations[language].quickLinks}</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  {translations[language].about}
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-white transition-colors">
                  {translations[language].services}
                </Link>
              </li>
              <li>
                <Link href="/doctors" className="hover:text-white transition-colors">
                  {translations[language].doctors}
                </Link>
              </li>
              <li>
                <Link href="/appointments" className="hover:text-white transition-colors">
                  {translations[language].appointment}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-semibold mb-4">{translations[language].contactUs}</h3>
            <ul className="space-y-3">
              <li className="flex items-center">
                <Phone size={16} className="mr-2" />
                <span>{translations[language].phone}</span>
              </li>
              <li className="flex items-center">
                <Mail size={16} className="mr-2" />
                <span>{translations[language].email}</span>
              </li>
              <li className="flex items-start">
                <MapPin size={16} className="mr-2 mt-1" />
                <span>{translations[language].address}</span>
              </li>
            </ul>
          </div>

          {/* Operating Hours */}
          <div>
            <h3 className="text-white font-semibold mb-4">{translations[language].operatingHours}</h3>
            <ul className="space-y-2">
              <li>{translations[language].hours.weekday}</li>
              <li>{translations[language].hours.saturday}</li>
              <li>{translations[language].hours.sunday}</li>
              <li className="text-blue-400 font-semibold mt-4">
                {translations[language].hours.emergency}
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm">{translations[language].copyright}</p>
            <div className="flex space-x-6 mt-4 md:mt-0 text-sm">
              <Link href="/privacy" className="hover:text-white transition-colors">
                {translations[language].privacy}
              </Link>
              <Link href="/terms" className="hover:text-white transition-colors">
                {translations[language].terms}
              </Link>
              <Link href="/sitemap" className="hover:text-white transition-colors">
                {translations[language].sitemap}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}