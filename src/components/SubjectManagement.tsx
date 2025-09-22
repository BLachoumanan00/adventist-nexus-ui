import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, BookOpen, GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useSupabaseAutoSave } from '@/hooks/useSupabaseAutoSave';
import { EmptyState, CardSkeleton } from '@/components/LoadingStates';

interface Subject {
  id: string;
  name: string;
  code?: string;
  description?: string;
  grade_levels: number[];
  is_core_subject: boolean;
  credit_hours: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

const SubjectManagement: React.FC = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  // Auto-save functionality
  useSupabaseAutoSave({
    data: subjects,
    table: 'subjects',
    enabled: true
  });

  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: '',
    grade_levels: [] as number[],
    is_core_subject: false,
    credit_hours: 1
  });

  const availableGrades = [7, 8, 9, 10, 11, 12, 13];

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('subjects')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      setSubjects(data || []);
    } catch (error) {
      console.error('Error fetching subjects:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch subjects. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Subject name is required.",
      });
      return;
    }

    if (formData.grade_levels.length === 0) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please select at least one grade level.",
      });
      return;
    }

    try {
      if (editingSubject) {
        // Update existing subject
        const { error } = await supabase
          .from('subjects')
          .update({
            name: formData.name,
            code: formData.code || null,
            description: formData.description || null,
            grade_levels: formData.grade_levels,
            is_core_subject: formData.is_core_subject,
            credit_hours: formData.credit_hours,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingSubject.id);

        if (error) throw error;

        toast({
          title: "Subject Updated",
          description: `${formData.name} has been updated successfully.`,
        });
      } else {
        // Create new subject
        const { error } = await supabase
          .from('subjects')
          .insert([{
            name: formData.name,
            code: formData.code || null,
            description: formData.description || null,
            grade_levels: formData.grade_levels,
            is_core_subject: formData.is_core_subject,
            credit_hours: formData.credit_hours,
            is_active: true
          }]);

        if (error) throw error;

        toast({
          title: "Subject Added",
          description: `${formData.name} has been added successfully.`,
        });
      }

      // Reset form and refresh data
      resetForm();
      setShowDialog(false);
      fetchSubjects();
    } catch (error) {
      console.error('Error saving subject:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save subject. Please try again.",
      });
    }
  };

  const handleEdit = (subject: Subject) => {
    setEditingSubject(subject);
    setFormData({
      name: subject.name,
      code: subject.code || '',
      description: subject.description || '',
      grade_levels: subject.grade_levels,
      is_core_subject: subject.is_core_subject,
      credit_hours: subject.credit_hours
    });
    setShowDialog(true);
  };

  const handleDelete = async (subject: Subject) => {
    if (!window.confirm(`Are you sure you want to delete ${subject.name}?`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from('subjects')
        .update({ is_active: false })
        .eq('id', subject.id);

      if (error) throw error;

      toast({
        title: "Subject Deleted",
        description: `${subject.name} has been deleted successfully.`,
      });

      fetchSubjects();
    } catch (error) {
      console.error('Error deleting subject:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete subject. Please try again.",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      code: '',
      description: '',
      grade_levels: [],
      is_core_subject: false,
      credit_hours: 1
    });
    setEditingSubject(null);
  };

  const handleGradeLevelChange = (grade: number, checked: boolean) => {
    if (checked) {
      setFormData(prev => ({
        ...prev,
        grade_levels: [...prev.grade_levels, grade].sort()
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        grade_levels: prev.grade_levels.filter(g => g !== grade)
      }));
    }
  };

  const filteredSubjects = subjects.filter(subject =>
    subject.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (subject.code && subject.code.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) {
    return <CardSkeleton count={6} />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Subjects Management</h2>
          <p className="text-muted-foreground">
            Manage subjects and their grade level assignments
          </p>
        </div>
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogTrigger asChild>
            <Button onClick={resetForm} className="mobile-button">
              <Plus className="h-4 w-4" />
              Add Subject
            </Button>
          </DialogTrigger>
          <DialogContent className="mobile-dialog">
            <DialogHeader>
              <DialogTitle>
                {editingSubject ? 'Edit Subject' : 'Add New Subject'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="mobile-form-grid">
                <div className="space-y-2">
                  <Label htmlFor="name">Subject Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter subject name"
                    className="mobile-input"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="code">Subject Code</Label>
                  <Input
                    id="code"
                    value={formData.code}
                    onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value }))}
                    placeholder="e.g., MATH101"
                    className="mobile-input"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="credit_hours">Credit Hours</Label>
                  <Select 
                    value={formData.credit_hours.toString()} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, credit_hours: parseInt(value) }))}
                  >
                    <SelectTrigger className="mobile-select">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5, 6].map(hour => (
                        <SelectItem key={hour} value={hour.toString()}>
                          {hour} {hour === 1 ? 'Hour' : 'Hours'}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Optional subject description"
                  className="mobile-textarea"
                  rows={3}
                />
              </div>

              <div className="space-y-3">
                <Label>Grade Levels * (Select all applicable grades)</Label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {availableGrades.map(grade => (
                    <div key={grade} className="flex items-center space-x-2">
                      <Checkbox
                        id={`grade-${grade}`}
                        checked={formData.grade_levels.includes(grade)}
                        onCheckedChange={(checked) => handleGradeLevelChange(grade, checked as boolean)}
                      />
                      <Label htmlFor={`grade-${grade}`} className="text-sm font-medium">
                        Grade {grade}
                      </Label>
                    </div>
                  ))}
                </div>
                {formData.grade_levels.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {formData.grade_levels.map(grade => (
                      <Badge key={grade} variant="secondary" className="text-xs">
                        Grade {grade}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="is_core_subject"
                  checked={formData.is_core_subject}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_core_subject: checked as boolean }))}
                />
                <Label htmlFor="is_core_subject" className="text-sm font-medium">
                  Core Subject (Required for graduation)
                </Label>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button type="submit" className="mobile-button">
                  {editingSubject ? 'Update Subject' : 'Add Subject'}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setShowDialog(false)}
                  className="mobile-button"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="space-y-4">
        <Input
          placeholder="Search subjects by name or code..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mobile-input max-w-md"
        />
      </div>

      {/* Subjects Grid */}
      {filteredSubjects.length === 0 ? (
        <EmptyState
          title="No subjects found"
          description={searchTerm ? "No subjects match your search criteria." : "Get started by adding your first subject."}
          action={
            <Button onClick={() => { resetForm(); setShowDialog(true); }} className="gap-2">
              <Plus className="h-4 w-4" />
              Add First Subject
            </Button>
          }
          icon={<BookOpen className="h-12 w-12 text-muted-foreground" />}
        />
      ) : (
        <div className="mobile-responsive-grid">
          {filteredSubjects.map((subject) => (
            <Card key={subject.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <BookOpen className="h-5 w-5 text-primary" />
                    <div>
                      <CardTitle className="text-lg">{subject.name}</CardTitle>
                      {subject.code && (
                        <p className="text-sm text-muted-foreground">{subject.code}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(subject)}
                      className="h-8 w-8 p-0"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(subject)}
                      className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3">
                  {subject.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {subject.description}
                    </p>
                  )}
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <GraduationCap className="h-4 w-4" />
                      <span className="font-medium">Grade Levels:</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {subject.grade_levels.map(grade => (
                        <Badge key={grade} variant="outline" className="text-xs">
                          Grade {grade}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-2">
                      {subject.is_core_subject && (
                        <Badge variant="default" className="text-xs">
                          Core Subject
                        </Badge>
                      )}
                      <Badge variant="secondary" className="text-xs">
                        {subject.credit_hours} {subject.credit_hours === 1 ? 'Hour' : 'Hours'}
                      </Badge>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      Added: {new Date(subject.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Results Summary */}
      <div className="text-sm text-muted-foreground">
        Showing {filteredSubjects.length} subject{filteredSubjects.length !== 1 ? 's' : ''}
        {searchTerm && <span> (filtered from {subjects.length} total)</span>}
      </div>
    </div>
  );
};

export default SubjectManagement;