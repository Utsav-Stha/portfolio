"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
// import { Checkbox } from "@/components/ui/checkbox";
import { useExperience } from "@/hooks/useExperience";
import { supabase, type Experience } from "@/lib/supabase";
import { Loader2, Plus, Save, Trash2, Briefcase, Edit } from "lucide-react";

const ExperienceManager = () => {
  const { experience, loading, refetch } = useExperience();
  const [isUpdating, setIsUpdating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    start_date: "",
    end_date: "",
    is_current: false,
    description: "",
    order_index: 1
  });

  const resetForm = () => {
    setFormData({
      title: "",
      company: "",
      start_date: "",
      end_date: "",
      is_current: false,
      description: "",
      order_index: (experience?.length || 0) + 1
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

  const handleEdit = (exp: Experience) => {
    console.log('Editing experience:', exp);
    setFormData({
      title: exp.title,
      company: exp.company,
      start_date: exp.start_date,
      end_date: exp.end_date || "",
      is_current: exp.is_current,
      description: exp.description || "",
      order_index: exp.order_index
    });
    setEditingId(exp.id);
    setShowAddForm(true);
  };

  const handleSave = async () => {
    setIsUpdating(true);
    try {
      const data = {
        title: formData.title,
        company: formData.company,
        start_date: formData.start_date,
        end_date: formData.is_current ? null : formData.end_date || null,
        is_current: formData.is_current,
        description: formData.description,
        order_index: formData.order_index,
        updated_at: new Date().toISOString()
      };

      let error;
      if (editingId) {
        // Update existing
        ({ error } = await supabase
          .from('experience')
          .update(data)
          .eq('id', editingId));
      } else {
        // Create new
        ({ error } = await supabase
          .from('experience')
          .insert([data]));
      }

      if (error) {
        throw error;
      }

      await refetch();
      resetForm();
      alert(`Experience ${editingId ? 'updated' : 'added'} successfully!`);
    } catch (error) {
      console.error('Error saving experience:', error);
      alert('Failed to save experience. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async (id: string, company: string) => {
    console.log('Delete clicked for:', company, id);
    if (!confirm(`Are you sure you want to delete the experience at ${company}?`)) {
      return;
    }

    try {
      console.log('Deleting experience with id:', id);
      const { error } = await supabase
        .from('experience')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Delete error:', error);
        throw error;
      }

      console.log('Delete successful, refreshing...');
      await refetch();
      alert('Experience deleted successfully!');
    } catch (error) {
      console.error('Error deleting experience:', error);
      alert('Failed to delete experience. Please try again.');
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short' 
    });
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin mr-2" />
          Loading experience...
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
              <Briefcase className="h-5 w-5" />
              Experience Management
            </div>
            <Button
              onClick={() => {
                console.log('Add Experience clicked');
                setShowAddForm(true);
              }}
              size="sm"
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Experience
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Experience List */}
          <div className="space-y-4">
            {experience?.map((exp) => (
              <div key={exp.id} className="border rounded-lg p-4 space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-lg">{exp.title}</h3>
                    <p className="text-muted-foreground">{exp.company}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(exp.start_date)} - {exp.is_current ? 'Present' : exp.end_date ? formatDate(exp.end_date) : 'N/A'}
                    </p>
                  </div>
                  <div className="flex gap-2 z-10">
                    <Button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleEdit(exp);
                      }}
                      size="sm"
                      variant="outline"
                      className="cursor-pointer"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleDelete(exp.id, exp.company);
                      }}
                      size="sm"
                      variant="destructive"
                      className="cursor-pointer"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                {exp.description && (
                  <div className="text-sm text-muted-foreground mt-2">
                    {exp.description.split('\n').map((line, index) => (
                      <div key={index} className={line.trim().startsWith('•') ? 'ml-2' : ''}>
                        {line.trim() || <br />}
                      </div>
                    ))}
                  </div>
                )}
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
              {editingId ? 'Edit Experience' : 'Add New Experience'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Job Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="e.g., Senior Flutter Developer"
                />
              </div>
              
              <div>
                <Label htmlFor="company">Company</Label>
                <Input
                  id="company"
                  value={formData.company}
                  onChange={(e) => handleInputChange('company', e.target.value)}
                  placeholder="Company name"
                />
              </div>
              
              <div>
                <Label htmlFor="start_date">Start Date</Label>
                <Input
                  id="start_date"
                  type="date"
                  value={formData.start_date}
                  onChange={(e) => handleInputChange('start_date', e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="end_date">End Date</Label>
                <Input
                  id="end_date"
                  type="date"
                  value={formData.end_date}
                  onChange={(e) => handleInputChange('end_date', e.target.value)}
                  disabled={formData.is_current}
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
                <input
                  type="checkbox"
                  id="is_current"
                  checked={formData.is_current}
                  onChange={(e) => handleInputChange('is_current', e.target.checked)}
                  className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                />
                <Label htmlFor="is_current">Current Position</Label>
              </div>
            </div>
            
            <div>
              <Label htmlFor="description">Job Description</Label>
              <div className="space-y-2">
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Describe your role, responsibilities, and achievements...&#10;&#10;Tips:&#10;• Use bullet points with • symbol&#10;• Press Enter for new lines&#10;• Keep each point concise"
                  rows={6}
                  className="font-mono text-sm"
                />
                <div className="flex flex-wrap gap-2">
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      const currentText = formData.description;
                      const newText = currentText + (currentText ? '\n• ' : '• ');
                      handleInputChange('description', newText);
                    }}
                  >
                    + Bullet Point
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      const currentText = formData.description;
                      const newText = currentText + (currentText ? '\n\n' : '');
                      handleInputChange('description', newText);
                    }}
                  >
                    + New Line
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      const template = `• Developed and maintained mobile applications using Flutter framework
• Collaborated with cross-functional teams to deliver high-quality solutions
• Implemented clean architecture patterns and best practices
• Participated in code reviews and mentored junior developers
• Contributed to project planning and estimation processes`;
                      handleInputChange('description', template);
                    }}
                  >
                    Use Template
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => handleInputChange('description', '')}
                  >
                    Clear
                  </Button>
                </div>
                <div className="text-xs text-muted-foreground">
                  <strong>Formatting Tips:</strong>
                  <ul className="list-disc list-inside mt-1 space-y-1">
                    <li>Use • for bullet points (click "Bullet Point" button)</li>
                    <li>Press Enter twice for paragraph breaks</li>
                    <li>Keep each bullet point to one line for better readability</li>
                    <li>Start with action verbs (Developed, Implemented, Led, etc.)</li>
                  </ul>
                </div>
              </div>
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
                    {editingId ? 'Update' : 'Add'} Experience
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

export default ExperienceManager;
