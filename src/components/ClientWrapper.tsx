"use client";

import { useEffect, useState } from "react";
import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import Projects from "@/components/Projects";
import About from "@/components/About";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function ClientWrapper() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    
    // Remove browser extension attributes immediately and continuously
    const removeExtensionAttributes = () => {
      const elements = document.querySelectorAll('[bis_skin_checked]');
      elements.forEach(el => el.removeAttribute('bis_skin_checked'));
    };

    // Initial cleanup
    removeExtensionAttributes();

    // Set up observer for future changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'bis_skin_checked') {
          mutation.target.removeAttribute('bis_skin_checked');
        }
      });
    });

    observer.observe(document.body, { 
      attributes: true, 
      subtree: true, 
      attributeFilter: ['bis_skin_checked'] 
    });

    // Periodic cleanup as backup
    const interval = setInterval(removeExtensionAttributes, 100);

    return () => {
      observer.disconnect();
      clearInterval(interval);
    };
  }, []);

  if (!isClient) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Navigation />
      <main>
        <Hero />
        <Projects />
        <About />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
