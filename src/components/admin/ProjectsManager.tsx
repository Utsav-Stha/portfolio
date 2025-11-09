"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase, type Project } from "@/lib/supabase";
import { Loader2, Plus, Save, Trash2, FolderOpen, Edit, ExternalLink } from "lucide-react";
import ImageUpload from "@/components/ui/ImageUpload";

const ProjectsManager = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    short_description: "",
    image_url: "",
    tech_stack: "",
    github_link: "",
    live_demo_link: "",
    playstore_link: "",
    company: "",
    project_type: "company",
    role_in_project: "",
    order_index: 1,
    is_featured: false
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      short_description: "",
      image_url: "",
      tech_stack: "",
      github_link: "",
      live_demo_link: "",
      playstore_link: "",
      company: "",
      project_type: "company",
      role_in_project: "",
      order_index: (projects?.length || 0) + 1,
      is_featured: false
    });
    setEditingId(null);
    setShowAddForm(false);
  };

  const handleInputChange = (field: string, value: string | boolean | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleEdit = (project: Project) => {
    setFormData({
      title: project.title,
      description: project.description,
      short_description: project.short_description,
      image_url: project.image_url,
      tech_stack: project.tech_stack.join(', '),
      github_link: project.github_link || "",
      live_demo_link: project.live_demo_link || "",
      playstore_link: project.playstore_link || "",
      company: project.company || "",
      project_type: project.project_type || "company",
      role_in_project: project.role_in_project || "",
      order_index: project.order_index,
      is_featured: project.is_featured
    });
    setEditingId(project.id);
    setShowAddForm(true);
  };

  const handleSave = async () => {
    setIsUpdating(true);
    try {
      const techStackArray = formData.tech_stack
        .split(',')
        .map(tech => tech.trim())
        .filter(tech => tech.length > 0);

      const data = {
        title: formData.title,
        description: formData.description,
        short_description: formData.short_description,
        image_url: formData.image_url,
        tech_stack: techStackArray,
        github_link: formData.github_link || null,
        live_demo_link: formData.live_demo_link || null,
        playstore_link: formData.playstore_link || null,
        company: formData.company || null,
        project_type: formData.project_type,
        role_in_project: formData.role_in_project || null,
        order_index: formData.order_index,
        is_featured: formData.is_featured,
        updated_at: new Date().toISOString()
      };

      let error;
      if (editingId) {
        // Update existing
        ({ error } = await supabase
          .from('projects')
          .update(data)
          .eq('id', editingId));
      } else {
        // Create new
        ({ error } = await supabase
          .from('projects')
          .insert([data]));
      }

      if (error) {
        throw error;
      }

      await fetchProjects();
      resetForm();
      alert(`Project ${editingId ? 'updated' : 'added'} successfully!`);
    } catch (error) {
      console.error('Error saving project:', error);
      alert('Failed to save project. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete the project "${title}"?`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      await fetchProjects();
      alert('Project deleted successfully!');
    } catch (error) {
      console.error('Error deleting project:', error);
      alert('Failed to delete project. Please try again.');
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin mr-2" />
          Loading projects...
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FolderOpen className="h-5 w-5" />
              Projects Management
            </div>
            <Button
              onClick={() => setShowAddForm(true)}
              size="sm"
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Project
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Projects List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {projects?.map((project) => (
              <div key={project.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-lg">{project.title}</h3>
                      {project.is_featured && (
                        <span className="bg-primary text-primary-foreground px-2 py-1 rounded-full text-xs">
                          Featured
                        </span>
                      )}
                    </div>
                    {project.company && (
                      <p className="text-sm font-medium text-primary">
                        Developed at {project.company}
                      </p>
                    )}
                    <p className="text-sm text-muted-foreground mt-1">
                      {project.short_description}
                    </p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {project.tech_stack.slice(0, 3).map((tech) => (
                        <span
                          key={tech}
                          className="px-2 py-1 bg-muted text-muted-foreground rounded-md text-xs"
                        >
                          {tech}
                        </span>
                      ))}
                      {project.tech_stack.length > 3 && (
                        <span className="px-2 py-1 bg-muted text-muted-foreground rounded-md text-xs">
                          +{project.tech_stack.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2 ml-2">
                    <Button
                      onClick={() => handleEdit(project)}
                      size="sm"
                      variant="outline"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      onClick={() => handleDelete(project.id, project.title)}
                      size="sm"
                      variant="destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="flex gap-2 text-xs">
                  {project.playstore_link && (
                    <a
                      href={project.playstore_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline flex items-center gap-1"
                    >
                      <ExternalLink className="h-3 w-3" />
                      Play Store
                    </a>
                  )}
                  {project.github_link && (
                    <a
                      href={project.github_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline flex items-center gap-1"
                    >
                      <ExternalLink className="h-3 w-3" />
                      GitHub
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Add/Edit Form */}
      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingId ? 'Edit Project' : 'Add New Project'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Project Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Project name"
                />
              </div>
              
              <div>
                <Label htmlFor="company">Company</Label>
                <Input
                  id="company"
                  value={formData.company}
                  onChange={(e) => handleInputChange('company', e.target.value)}
                  placeholder="e.g., Code Himalaya, Neo Software Pvt. Ltd"
                />
              </div>
              
              <div className="md:col-span-2">
                <ImageUpload
                  currentImageUrl={formData.image_url}
                  onImageChange={(url) => handleInputChange('image_url', url)}
                  label="Project Image"
                  placeholder="Enter image URL or upload from your computer"
                  disabled={isUpdating}
                />
              </div>
              
              <div>
                <Label htmlFor="playstore_link">Play Store Link</Label>
                <Input
                  id="playstore_link"
                  value={formData.playstore_link}
                  onChange={(e) => handleInputChange('playstore_link', e.target.value)}
                  placeholder="https://play.google.com/store/apps/details?id=..."
                />
              </div>
              
              <div>
                <Label htmlFor="github_link">GitHub Link</Label>
                <Input
                  id="github_link"
                  value={formData.github_link}
                  onChange={(e) => handleInputChange('github_link', e.target.value)}
                  placeholder="https://github.com/username/repo"
                />
              </div>
              
              <div>
                <Label htmlFor="order_index">Display Order</Label>
                <Input
                  id="order_index"
                  type="number"
                  value={formData.order_index}
                  onChange={(e) => handleInputChange('order_index', parseInt(e.target.value))}
                  placeholder="1"
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="is_featured"
                  checked={formData.is_featured}
                  onCheckedChange={(checked: boolean) => handleInputChange('is_featured', checked)}
                />
                <Label htmlFor="is_featured">Featured Project</Label>
              </div>
            </div>
            
            <div>
              <Label htmlFor="short_description">Short Description</Label>
              <Input
                id="short_description"
                value={formData.short_description}
                onChange={(e) => handleInputChange('short_description', e.target.value)}
                placeholder="Brief one-line description"
              />
            </div>
            
            <div>
              <Label htmlFor="tech_stack">Tech Stack (comma-separated)</Label>
              <Input
                id="tech_stack"
                value={formData.tech_stack}
                onChange={(e) => handleInputChange('tech_stack', e.target.value)}
                placeholder="Flutter, Dart, Firebase, etc."
              />
            </div>
            
            <div>
              <Label htmlFor="role_in_project">Your Role & Contributions</Label>
              <Textarea
                id="role_in_project"
                value={formData.role_in_project}
                onChange={(e) => handleInputChange('role_in_project', e.target.value)}
                placeholder="e.g., Flutter Developer - Led UI development and implemented clean architecture patterns"
                rows={2}
              />
            </div>
            
            <div>
              <Label htmlFor="description">Full Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Detailed project description..."
                rows={4}
              />
            </div>
            
            <div className="flex gap-2">
              <Button
                onClick={handleSave}
                disabled={isUpdating}
              >
                {isUpdating ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    {editingId ? 'Update' : 'Add'} Project
                  </>
                )}
              </Button>
              
              <Button
                onClick={resetForm}
                variant="outline"
                disabled={isUpdating}
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ProjectsManager;
