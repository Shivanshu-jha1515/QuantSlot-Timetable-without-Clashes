import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { LandingPage } from './pages/LandingPage';
import { DemoPage } from './pages/DemoPage';
import { HowItWorksPage } from './pages/HowItWorksPage';
import { AboutPage } from './pages/AboutPage';

export default function App() {
  const [currentPage, setCurrentPage] = useState<string>('landing');
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('quant_slot_theme');
      if (saved) return saved === 'dark';
      return true; // Default dark theme for quantum tech aesthetic
    }
    return true;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      localStorage.setItem('quant_slot_theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('quant_slot_theme', 'light');
    }
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 transition-colors duration-200">
      <Navbar
        currentPage={currentPage}
        onNavigate={handleNavigate}
        isDark={isDark}
        onToggleTheme={toggleTheme}
      />

      <main className="flex-1">
        {currentPage === 'landing' && (
          <LandingPage
            onNavigateToDemo={() => handleNavigate('demo')}
            onNavigateToHowItWorks={() => handleNavigate('how-it-works')}
          />
        )}
        {currentPage === 'demo' && <DemoPage />}
        {currentPage === 'how-it-works' && <HowItWorksPage />}
        {currentPage === 'about' && <AboutPage />}
      </main>

      <Footer onNavigate={handleNavigate} />
    </div>
  );
}
