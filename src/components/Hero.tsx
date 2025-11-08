"use client";

import { Button } from "@/components/ui/button";
import { ArrowDown, Github, Linkedin, Mail, Download } from "lucide-react";
import { motion } from "framer-motion";
import { downloadCV } from "@/lib/downloadCV";
import { useState } from "react";
import { useProfile } from "@/hooks/useProfile";

const Hero = () => {
  const [isDownloading, setIsDownloading] = useState(false);
  const { profile, loading: profileLoading } = useProfile();

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleDownloadCV = async () => {
    setIsDownloading(true);
    
    // Add a small delay to show the loading state for better UX
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const success = await downloadCV();
    if (!success) {
      alert('Failed to download CV. Please try again.');
    }
    setIsDownloading(false);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <section id="hero" className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div 
          className="text-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Main Heading */}
          <motion.h1 
            className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6"
            variants={itemVariants}
          >
            Hi, I'm{" "}
            <span className="text-primary bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              {profileLoading ? "Loading..." : profile?.name || "Utsav Shrestha"}
            </span>
          </motion.h1>
          
          {/* Subheading */}
          <motion.h2 
            className="text-xl md:text-2xl lg:text-3xl text-muted-foreground mb-8 max-w-3xl mx-auto"
            variants={itemVariants}
          >
            {profileLoading ? "Loading..." : profile?.title || "Flutter Developer"}
          </motion.h2>
          
          {/* Description */}
          <motion.p 
            className="text-lg md:text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed"
            variants={itemVariants}
          >
            {profileLoading ? "Loading..." : profile?.summary || "Dedicated Flutter Developer with a strong foundation in mobile app development and a passion for crafting user-centric applications. Proficient in designing and building cross-platform solutions using the Flutter framework."}
          </motion.p>
          
          {/* CTA Buttons */}
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
            variants={itemVariants}
          >
            <Button
              size="lg"
              onClick={() => scrollToSection("projects")}
              className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-3 text-lg"
            >
              View My Work
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={handleDownloadCV}
              disabled={isDownloading}
              className="px-8 py-3 text-lg"
            >
              {isDownloading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                  Downloading...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  Download CV
                </>
              )}
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => scrollToSection("contact")}
              className="px-8 py-3 text-lg"
            >
              Get In Touch
            </Button>
          </motion.div>
          
          {/* Social Links */}
          <motion.div 
            className="flex justify-center space-x-6 mb-16"
            variants={itemVariants}
          >
            <a
              href="https://github.com/Utsav-Stha"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <Github className="h-6 w-6" />
              <span className="sr-only">GitHub</span>
            </a>
            <a
              href="https://www.linkedin.com/in/utsav-shrestha-0a3343375/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <Linkedin className="h-6 w-6" />
              <span className="sr-only">LinkedIn</span>
            </a>
          </motion.div>
          
          {/* Scroll Indicator */}
          <motion.button
            onClick={() => scrollToSection("projects")}
            className="animate-bounce text-muted-foreground hover:text-primary transition-colors"
            variants={itemVariants}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowDown className="h-6 w-6 mx-auto" />
            <span className="sr-only">Scroll to projects</span>
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
