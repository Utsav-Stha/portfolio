"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Code, Palette, Database, Globe } from "lucide-react";
import { downloadCV } from "@/lib/downloadCV";
import { useState } from "react";
import { useProfile } from "@/hooks/useProfile";
import { useExperience } from "@/hooks/useExperience";

const About = () => {
  const [isDownloading, setIsDownloading] = useState(false);
  const { profile, loading: profileLoading } = useProfile();
  const { experience, loading: experienceLoading } = useExperience();

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

  const skills = [
    {
      category: "Mobile Development",
      icon: <Code className="h-6 w-6" />,
      technologies: ["Dart", "Flutter", "Provider", "Riverpod", "GetX", "GoRoute"],
    },
    {
      category: "Backend & Database",
      icon: <Database className="h-6 w-6" />,
      technologies: ["Firebase", "Hive", "SQLite", "REST APIs", "Push Notifications"],
    },
    {
      category: "Tools & Version Control",
      icon: <Globe className="h-6 w-6" />,
      technologies: ["Git", "GitLab", "Google Play Console", "App Store Connect"],
    },
    {
      category: "Design & Project Management",
      icon: <Palette className="h-6 w-6" />,
      technologies: ["Figma", "Jira", "Trello", "Slack", "UI/UX Design"],
    },
  ];

  // Helper function to format experience dates
  const formatExperienceDate = (startDate: string, endDate?: string, isCurrent?: boolean) => {
    const formatDate = (dateStr: string) => {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', { month: '2-digit', year: 'numeric' });
    };
    
    const start = formatDate(startDate);
    if (isCurrent) {
      return `${start} - Present`;
    }
    return endDate ? `${start} - ${formatDate(endDate)}` : start;
  };

  return (
    <section id="about" className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" suppressHydrationWarning>
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            About Me
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Dedicated Flutter Developer with expertise in mobile app development and clean architecture.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Bio Section */}
          <div>
            <h3 className="text-2xl font-semibold text-foreground mb-6">My Story</h3>
            <div className="space-y-4 text-muted-foreground">
              <p>
                I'm a dedicated Flutter Developer from Nepal with a strong foundation in mobile app development 
                and a passion for crafting user-centric applications. My journey in software development 
                is driven by the desire to create innovative and efficient solutions for user and business needs.
              </p>
              <p>
                I specialize in designing and building cross-platform solutions using the Flutter framework, 
                with expertise in state management tools like Riverpod and Provider. I have experience 
                in collaborating with teams, meeting project deadlines, and implementing clean architecture patterns.
              </p>
              <p>
                I'm committed to delivering high-quality mobile applications and continuously enhancing my skills 
                to stay ahead in the dynamic tech landscape. I actively engage in continuous learning 
                and knowledge-sharing to stay updated with emerging technologies and practices.
              </p>
            </div>
            
            {/* Download CV Button */}
            <div className="mt-8">
              <Button 
                onClick={handleDownloadCV}
                disabled={isDownloading}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
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
            </div>
          </div>

          {/* Experience Timeline */}
          <div>
            <h3 className="text-2xl font-semibold text-foreground mb-6">Experience</h3>
            {experienceLoading ? (
              <div className="text-center text-muted-foreground">Loading experience...</div>
            ) : (
              <div className="space-y-6">
                {experience.map((item, index) => (
                  <div key={item.id} className="relative pl-8 border-l-2 border-muted">
                    <div className="absolute -left-2 top-0 w-4 h-4 bg-primary rounded-full"></div>
                    <div className="text-sm text-primary font-medium mb-1">
                      {formatExperienceDate(item.start_date, item.end_date, item.is_current)}
                    </div>
                    <h4 className="text-lg font-semibold text-foreground">{item.title}</h4>
                    <div className="text-muted-foreground font-medium mb-2">{item.company}</div>
                    <div className="text-muted-foreground text-sm">
                      {item.description?.split('\n').map((line, index) => (
                        <div key={index} className={line.trim().startsWith('•') ? 'ml-2' : ''}>
                          {line.trim() || <br />}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Education Section */}
        <div className="mb-16">
          <h3 className="text-2xl font-semibold text-foreground mb-8 text-center">Education</h3>
          <div className="max-w-2xl mx-auto">
            <div className="relative pl-8 border-l-2 border-muted">
              <div className="absolute -left-2 top-0 w-4 h-4 bg-primary rounded-full"></div>
              <div className="text-sm text-primary font-medium mb-1">Oct 2019 - Nov 2024</div>
              <h4 className="text-lg font-semibold text-foreground">Bachelor of Science in Computer Science and Information Technology</h4>
              <div className="text-muted-foreground font-medium mb-2">St. Xavier's College</div>
              <p className="text-muted-foreground text-sm">Maitighar, Kathmandu</p>
            </div>
          </div>
        </div>

        {/* Skills Section */}
        <div>
          <h3 className="text-2xl font-semibold text-foreground mb-8 text-center">Skills & Technologies</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {skills.map((skill, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="text-primary mr-3">{skill.icon}</div>
                    <h4 className="text-lg font-semibold text-foreground">{skill.category}</h4>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {skill.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-1 bg-muted text-muted-foreground rounded-md text-xs font-medium"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
