"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Code, Palette, Database, Globe } from "lucide-react";

const About = () => {
  const skills = [
    {
      category: "Frontend",
      icon: <Code className="h-6 w-6" />,
      technologies: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Vue.js", "HTML5", "CSS3"],
    },
    {
      category: "Backend",
      icon: <Database className="h-6 w-6" />,
      technologies: ["Node.js", "Python", "PostgreSQL", "MongoDB", "Supabase", "REST APIs"],
    },
    {
      category: "Design",
      icon: <Palette className="h-6 w-6" />,
      technologies: ["Figma", "Adobe XD", "UI/UX Design", "Responsive Design", "Prototyping"],
    },
    {
      category: "Tools & Others",
      icon: <Globe className="h-6 w-6" />,
      technologies: ["Git", "Docker", "AWS", "Vercel", "Jest", "Cypress", "Agile"],
    },
  ];

  const experience = [
    {
      year: "2023 - Present",
      title: "Senior Full Stack Developer",
      company: "Tech Company",
      description: "Leading development of modern web applications using React, Node.js, and cloud technologies.",
    },
    {
      year: "2021 - 2023",
      title: "Frontend Developer",
      company: "Digital Agency",
      description: "Built responsive web applications and collaborated with design teams to create exceptional user experiences.",
    },
    {
      year: "2020 - 2021",
      title: "Junior Developer",
      company: "Startup Inc.",
      description: "Developed features for web applications and gained experience in full-stack development.",
    },
  ];

  return (
    <section id="about" className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" suppressHydrationWarning>
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            About Me
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Passionate developer with a love for creating digital experiences that make a difference.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Bio Section */}
          <div>
            <h3 className="text-2xl font-semibold text-foreground mb-6">My Story</h3>
            <div className="space-y-4 text-muted-foreground">
              <p>
                I'm a passionate full-stack developer with over 3 years of experience creating 
                digital solutions that combine beautiful design with robust functionality. 
                My journey began with a curiosity about how websites work, which quickly evolved 
                into a deep love for coding and problem-solving.
              </p>
              <p>
                I specialize in modern web technologies like React, Next.js, and Node.js, 
                and I'm always eager to learn new tools and frameworks. When I'm not coding, 
                you can find me exploring new design trends, contributing to open-source projects, 
                or sharing knowledge with the developer community.
              </p>
              <p>
                I believe in writing clean, maintainable code and creating user experiences 
                that are not just functional, but delightful. Every project is an opportunity 
                to learn something new and push the boundaries of what's possible on the web.
              </p>
            </div>
            
            {/* Download CV Button */}
            <div className="mt-8">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                <Download className="h-4 w-4 mr-2" />
                Download CV
              </Button>
            </div>
          </div>

          {/* Experience Timeline */}
          <div>
            <h3 className="text-2xl font-semibold text-foreground mb-6">Experience</h3>
            <div className="space-y-6">
              {experience.map((item, index) => (
                <div key={index} className="relative pl-8 border-l-2 border-muted">
                  <div className="absolute -left-2 top-0 w-4 h-4 bg-primary rounded-full"></div>
                  <div className="text-sm text-primary font-medium mb-1">{item.year}</div>
                  <h4 className="text-lg font-semibold text-foreground">{item.title}</h4>
                  <div className="text-muted-foreground font-medium mb-2">{item.company}</div>
                  <p className="text-muted-foreground text-sm">{item.description}</p>
                </div>
              ))}
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
