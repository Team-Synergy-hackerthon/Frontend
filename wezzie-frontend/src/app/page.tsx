'use client';

import { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import Navbar from '@/components/navbar';
import HeroSection from '@/components/Herosection';
import AboutUs from '@/components/AboutUs';
import ContactUs from '@/components/contactUs';
import Footer from '@/components/Footer';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

// Define announcement type for better type safety
interface Announcements {
  en: string[];
  ny: string[];
}

// Define language type
type Language = 'en' | 'ny';

const announcements: Announcements = {
  en: [
    '24/7 Emergency Services Available',
    'Book Your Appointment Online',
    'Specialized Care for Every Patient',
  ],
  ny: [
    'Chithandizo Cha Emergency 24/7',
    'Bukani Nthawi Yanu Online',
    'Chisamaliro Chapadera kwa Odwala Aliyense',
  ],
};

export default function Home() {
  const [language, setLanguage] = useState<Language>('en');

  const toggleLanguage = () => {
    setLanguage(prev => (prev === 'en' ? 'ny' : 'en'));
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Navbar */}
      <Navbar 
        lang={language.toUpperCase() as 'EN' | 'NY'} 
        toggleLang={toggleLanguage}
        aria-label="Main navigation"
      />

      {/* Announcement Slider */}
      <div className="bg-blue-600 text-white py-2 shadow-md">
        <Swiper
          modules={[Autoplay, Pagination, Navigation]}
          autoplay={{ 
            delay: 3000,
            disableOnInteraction: false,
          }}
          pagination={{ 
            clickable: true,
            el: '.swiper-pagination',
          }}
          navigation={{
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
          }}
          className="announcement-slider max-w-screen-xl mx-auto"
          aria-live="polite"
        >
          {announcements[language].map((text, index) => (
            <SwiperSlide key={index}>
              <p className="text-center text-sm py-1 font-medium">{text}</p>
            </SwiperSlide>
          ))}
          <div className="swiper-pagination mt-2" />
          <div className="swiper-button-prev" />
          <div className="swiper-button-next" />
        </Swiper>
      </div>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative bg-gray-100">
          <HeroSection language={language} />
        </section>

        {/* About Section */}
        <section className="py-20 bg-gray-50" id="about">
          <AboutUs language={language} />
        </section>

        {/* Contact Section */}
        <section className="py-20" id="contact">
          <ContactUs language={language} />
        </section>
      </main>

      <Footer language={language} />
    </div>
  );
}