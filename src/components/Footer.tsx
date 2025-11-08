"use client";

import { Github, Linkedin, Mail, Twitter, Heart } from "lucide-react";
import { useProfile } from "@/hooks/useProfile";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { profile, loading: profileLoading } = useProfile();

  const socialLinks = [
    {
      name: "GitHub",
      href: "https://github.com/Utsav-Stha",
      icon: <Github className="h-5 w-5" />,
    },
    {
      name: "LinkedIn",
      href: "https://www.linkedin.com/in/utsav-shrestha-0a3343375/",
      icon: <Linkedin className="h-5 w-5" />,
    },
  ];

  const quickLinks = [
    { name: "Home", href: "#hero" },
    { name: "Projects", href: "#projects" },
    { name: "About", href: "#about" },
    { name: "Contact", href: "#contact" },
  ];

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId.replace("#", ""));
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer className="bg-muted/30 border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12" suppressHydrationWarning>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-foreground">{profileLoading ? "Loading..." : profile?.name || "Utsav Shrestha"}</h3>
            <p className="text-muted-foreground max-w-md">
              {profileLoading ? "Loading..." : profile?.summary || "Dedicated Flutter Developer with a strong foundation in mobile app development and a passion for crafting user-centric applications."}
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                  aria-label={link.name}
                >
                  {link.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-foreground">Quick Links</h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <button
                    onClick={() => scrollToSection(link.href)}
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-foreground">Get In Touch</h4>
            <div className="space-y-2 text-muted-foreground">
              <p>
                <a
                  href={`mailto:${profile?.email || 'shrestha8502@gmail.com'}`}
                  className="hover:text-primary transition-colors"
                >
                  {profileLoading ? "Loading..." : profile?.email || "shrestha8502@gmail.com"}
                </a>
              </p>
              <p>
                <a
                  href={`tel:${profile?.phone || '+9779840660665'}`}
                  className="hover:text-primary transition-colors"
                >
                  {profileLoading ? "Loading..." : profile?.phone || "+977 9840660665"}
                </a>
              </p>
              <p>{profileLoading ? "Loading..." : profile?.location || "Kathmandu, Nepal"}</p>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-muted-foreground text-sm">
              © {currentYear} {profileLoading ? "Loading..." : profile?.name || "Utsav Shrestha"}. All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
