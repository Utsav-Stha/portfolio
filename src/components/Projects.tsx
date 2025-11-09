"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Smartphone, Loader2 } from "lucide-react";
import { supabase, type Project } from "@/lib/supabase";
import { motion } from "framer-motion";

const Projects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      console.log('Fetching projects...'); // Debug log
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('order_index', { ascending: true });

      if (error) {
        throw error;
      }

      setProjects(data || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
      setError('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const cardVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  if (loading) {
    return (
      <section id="projects" className="py-20 bg-muted/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
            <p className="mt-4 text-muted-foreground">Loading projects...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="projects" className="py-20 bg-muted/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-red-500 mb-4">{error}</p>
            <Button onClick={fetchProjects} variant="outline">
              Try Again
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="projects" className="py-20 bg-muted/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" suppressHydrationWarning={true}>
        {/* Section Header */}
        <div className="text-center mb-16" suppressHydrationWarning={true}>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Professional Projects
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Here are some key projects I've contributed to during my professional experience, 
            showcasing my skills in Flutter development and mobile app architecture.
          </p>
        </div>

        {/* Projects Grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" 
          suppressHydrationWarning
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {projects.map((project) => (
            <motion.div key={project.id} variants={cardVariants}>
              <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden h-full">
              {/* Project Image */}
              <div className="relative overflow-hidden">
                {project.image_url ? (
                  <img
                    src={project.image_url}
                    alt={project.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      // Show fallback
                      const parent = target.parentElement;
                      if (parent) {
                        const fallback = parent.querySelector('.image-fallback') as HTMLElement;
                        if (fallback) fallback.style.display = 'flex';
                      }
                    }}
                  />
                ) : null}
                
                {/* Fallback for missing or failed images */}
                <div 
                  className={`image-fallback w-full h-48 bg-muted flex items-center justify-center ${project.image_url ? 'hidden' : 'flex'}`}
                >
                  <div className="text-center">
                    <div className="text-muted-foreground text-sm mb-1">No image available</div>
                    <div className="text-xs text-muted-foreground/70">{project.title}</div>
                  </div>
                </div>
                
                {project.is_featured && (
                  <div className="absolute top-4 left-4 bg-primary text-primary-foreground px-2 py-1 rounded-full text-xs font-medium">
                    Featured
                  </div>
                )}
              </div>

              <CardHeader>
                <CardTitle className="text-xl font-semibold group-hover:text-primary transition-colors">
                  {project.title}
                </CardTitle>
                {project.company && (
                  <div className="text-sm font-medium text-primary mb-1">
                    Developed at {project.company}
                  </div>
                )}
                <CardDescription className="text-muted-foreground">
                  {project.short_description}
                </CardDescription>
              </CardHeader>

              <CardContent>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                  {project.description}
                </p>

                {/* Tech Stack */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tech_stack.map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-1 bg-muted text-muted-foreground rounded-md text-xs font-medium"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Play Store Link */}
                {project.playstore_link && (
                  <div className="flex">
                    <Button
                      size="sm"
                      asChild
                      className="w-full"
                    >
                      <a
                        href={project.playstore_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2"
                      >
                        <Smartphone className="h-4 w-4" />
                        Get on Play Store
                      </a>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
};

export default Projects;
