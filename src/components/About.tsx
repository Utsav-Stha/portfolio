"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Code, Palette, Database, Globe } from "lucide-react";

const About = () => {
  const skills = [
    {
      category: "Frontend",
      icon: <Code className="h-6 w-6" />,
      technologies: ["React", "Next.js", "TypeScript", "JavaScript", "Tailwind CSS", "HTML5", "CSS3"],
    },
    {
      category: "Backend",
      icon: <Database className="h-6 w-6" />,
      technologies: ["Node.js", "Express.js", "PostgreSQL", "MongoDB", "Supabase", "REST APIs", "GraphQL"],
    },
    {
      category: "Tools & DevOps",
      icon: <Globe className="h-6 w-6" />,
      technologies: ["Git", "GitHub", "Vercel", "Netlify", "Docker", "AWS", "Firebase"],
    },
    {
      category: "Design & UI",
      icon: <Palette className="h-6 w-6" />,
      technologies: ["Figma", "Responsive Design", "UI/UX Principles", "Framer Motion", "shadcn/ui"],
    },
  ];

  const experience = [
    {
      year: "2024 - Present",
      title: "Full Stack Developer",
      company: "Freelance",
      description: "Building modern web applications for clients using Next.js, React, and Node.js. Specializing in e-commerce platforms and SaaS applications.",
    },
    {
      year: "2023 - 2024",
      title: "Frontend Developer",
      company: "Tech Startup",
      description: "Developed responsive user interfaces and implemented modern design systems. Collaborated with backend teams to integrate APIs and optimize performance.",
    },
    {
      year: "2022 - 2023",
      title: "Junior Web Developer",
      company: "Digital Agency",
      description: "Started my professional journey building websites and learning modern development practices. Gained experience in React, JavaScript, and responsive design.",
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
                I'm a passionate full-stack developer from Nepal with expertise in modern web technologies. 
                My journey in software development started with curiosity about how digital products work, 
                which evolved into a deep passion for creating innovative solutions that make a real impact.
              </p>
              <p>
                I specialize in the JavaScript ecosystem, particularly React, Next.js, and Node.js, 
                with strong experience in TypeScript, database design, and cloud technologies. 
                I enjoy building scalable applications that solve real-world problems while 
                maintaining excellent user experience and code quality.
              </p>
              <p>
                When I'm not coding, I love exploring new technologies, contributing to open-source projects, 
                and sharing knowledge with the developer community. I believe in continuous learning 
                and staying updated with the latest industry trends and best practices.
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
