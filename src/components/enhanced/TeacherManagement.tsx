import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { 
  Plus, 
  Edit, 
  Trash2, 
  MoreHorizontal,
  GraduationCap,
  Users,
  Building,
  Phone,
  Mail,
  Calendar,
  UserPlus,
  X,
  Save
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useSupabaseAutoSave } from '@/hooks/useSupabaseAutoSave';
import { supabase } from '@/integrations/supabase/client';
import SearchAndFilter from '@/components/SearchAndFilter';

interface Teacher {
  id: string;
  teacher_id: string;
  full_name: string;
  email?: string;
  phone?: string;
  department?: string;
  qualification?: string;
  hire_date?: string;
  salary?: number;
  address?: string;
  custom_fields: Record<string, any>;
  status: string;
  created_at: string;
  updated_at: string;
}

interface CustomField {
  id: string;
  label: string;
  type: 'text' | 'number' | 'date' | 'email' | 'phone' | 'select';
  required: boolean;
  options?: string[]; // for select type
}

const TeacherManagement: React.FC = () => {
  const { toast } = useToast();
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [isAddingTeacher, setIsAddingTeacher] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
  const [customFieldsConfig, setCustomFieldsConfig] = useState<CustomField[]>([]);
  const [isManagingFields, setIsManagingFields] = useState(false);

  // Auto-save functionality
  useSupabaseAutoSave({
    data: teachers,
    table: 'teachers',
    enabled: true
  });

  useEffect(() => {
    loadTeachers();
    loadCustomFieldsConfig();
  }, []);

  const loadTeachers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('teachers')
        .select('*')
        .order('full_name');

      if (error) throw error;
      setTeachers((data || []).map(teacher => ({
        ...teacher,
        custom_fields: (teacher.custom_fields as any) || {}
      })));
    } catch (error) {
      console.error('Error loading teachers:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load teachers",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadCustomFieldsConfig = () => {
    // Load custom fields configuration from localStorage
    const saved = localStorage.getItem('teacher_custom_fields_config');
    if (saved) {
      setCustomFieldsConfig(JSON.parse(saved));
    }
  };

  const saveCustomFieldsConfig = (config: CustomField[]) => {
    setCustomFieldsConfig(config);
    localStorage.setItem('teacher_custom_fields_config', JSON.stringify(config));
  };

  const departments = [
    { value: 'Mathematics', label: 'Mathematics' },
    { value: 'Science', label: 'Science' },
    { value: 'English', label: 'English' },
    { value: 'History', label: 'History' },
    { value: 'Geography', label: 'Geography' },
    { value: 'Physical Education', label: 'Physical Education' },
    { value: 'Art', label: 'Art' },
    { value: 'Music', label: 'Music' },
    { value: 'Computer Science', label: 'Computer Science' },
    { value: 'French', label: 'French' },
    { value: 'Administration', label: 'Administration' }
  ];

  const filteredTeachers = teachers.filter(teacher => {
    const matchesSearch = !searchTerm || 
      teacher.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.teacher_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDepartment = !departmentFilter || teacher.department === departmentFilter;
    
    return matchesSearch && matchesDepartment;
  });

  const addCustomField = () => {
    const newField: CustomField = {
      id: crypto.randomUUID(),
      label: 'New Field',
      type: 'text',
      required: false
    };
    saveCustomFieldsConfig([...customFieldsConfig, newField]);
  };

  const updateCustomField = (id: string, updates: Partial<CustomField>) => {
    const updated = customFieldsConfig.map(field => 
      field.id === id ? { ...field, ...updates } : field
    );
    saveCustomFieldsConfig(updated);
  };

  const removeCustomField = (id: string) => {
    const updated = customFieldsConfig.filter(field => field.id !== id);
    saveCustomFieldsConfig(updated);
  };

  const renderCustomFieldInput = (field: CustomField, value: any, onChange: (value: any) => void) => {
    const commonProps = {
      value: value || '',
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => onChange(e.target.value),
      className: "mobile-input"
    };

    switch (field.type) {
      case 'number':
        return <Input {...commonProps} type="number" />;
      case 'date':
        return <Input {...commonProps} type="date" />;
      case 'email':
        return <Input {...commonProps} type="email" />;
      case 'phone':
        return <Input {...commonProps} type="tel" />;
      case 'select':
        return (
          <select {...commonProps}>
            <option value="">Select...</option>
            {field.options?.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        );
      default:
        return <Input {...commonProps} type="text" />;
    }
  };

  const TeacherForm = ({ teacher, onSave, onCancel }: {
    teacher?: Teacher;
    onSave: (teacher: Omit<Teacher, 'id' | 'created_at' | 'updated_at'>) => void;
    onCancel: () => void;
  }) => {
    const [formData, setFormData] = useState<Partial<Teacher>>({
      teacher_id: teacher?.teacher_id || '',
      full_name: teacher?.full_name || '',
      email: teacher?.email || '',
      phone: teacher?.phone || '',
      department: teacher?.department || '',
      qualification: teacher?.qualification || '',
      hire_date: teacher?.hire_date || '',
      salary: teacher?.salary || 0,
      address: teacher?.address || '',
      custom_fields: teacher?.custom_fields || {},
      status: teacher?.status || 'active'
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (!formData.full_name || !formData.teacher_id) {
        toast({
          variant: "destructive",
          title: "Missing Information",
          description: "Please fill in all required fields",
        });
        return;
      }
      onSave(formData as Omit<Teacher, 'id' | 'created_at' | 'updated_at'>);
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Teacher ID *</Label>
            <Input
              value={formData.teacher_id}
              onChange={(e) => setFormData({ ...formData, teacher_id: e.target.value })}
              placeholder="T001"
              required
              className="mobile-input"
            />
          </div>
          <div className="space-y-2">
            <Label>Full Name *</Label>
            <Input
              value={formData.full_name}
              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
              placeholder="Enter full name"
              required
              className="mobile-input"
            />
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="teacher@school.com"
              className="mobile-input"
            />
          </div>
          <div className="space-y-2">
            <Label>Phone</Label>
            <Input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="+230 12345678"
              className="mobile-input"
            />
          </div>
          <div className="space-y-2">
            <Label>Department</Label>
            <select
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              className="mobile-select"
            >
              <option value="">Select Department</option>
              {departments.map(dept => (
                <option key={dept.value} value={dept.value}>{dept.label}</option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label>Hire Date</Label>
            <Input
              type="date"
              value={formData.hire_date}
              onChange={(e) => setFormData({ ...formData, hire_date: e.target.value })}
              className="mobile-input"
            />
          </div>
          <div className="space-y-2">
            <Label>Qualification</Label>
            <Input
              value={formData.qualification}
              onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
              placeholder="MSc, BSc, etc."
              className="mobile-input"
            />
          </div>
          <div className="space-y-2">
            <Label>Monthly Salary (MUR)</Label>
            <Input
              type="number"
              value={formData.salary}
              onChange={(e) => setFormData({ ...formData, salary: parseFloat(e.target.value) })}
              placeholder="50000"
              className="mobile-input"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Address</Label>
          <Input
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            placeholder="Complete address"
            className="mobile-input"
          />
        </div>

        {/* Custom Fields */}
        {customFieldsConfig.length > 0 && (
          <>
            <Separator />
            <h4 className="font-medium">Additional Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {customFieldsConfig.map(field => (
                <div key={field.id} className="space-y-2">
                  <Label>
                    {field.label} {field.required && '*'}
                  </Label>
                  {renderCustomFieldInput(
                    field,
                    formData.custom_fields?.[field.id],
                    (value) => setFormData({
                      ...formData,
                      custom_fields: {
                        ...formData.custom_fields,
                        [field.id]: value
                      }
                    })
                  )}
                </div>
              ))}
            </div>
          </>
        )}

        <div className="flex gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
            Cancel
          </Button>
          <Button type="submit" className="flex-1">
            <Save className="h-4 w-4 mr-2" />
            Save Teacher
          </Button>
        </div>
      </form>
    );
  };

  const CustomFieldManager = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Manage Custom Fields</h3>
        <Button onClick={addCustomField} size="sm" className="gap-2">
          <Plus className="h-4 w-4" />
          Add Field
        </Button>
      </div>
      
      <div className="space-y-3">
        {customFieldsConfig.map(field => (
          <div key={field.id} className="border rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <Input
                value={field.label}
                onChange={(e) => updateCustomField(field.id, { label: e.target.value })}
                className="flex-1 mr-2"
                placeholder="Field Label"
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeCustomField(field.id)}
                className="text-destructive hover:text-destructive"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-xs">Type</Label>
                <select
                  value={field.type}
                  onChange={(e) => updateCustomField(field.id, { type: e.target.value as any })}
                  className="mobile-select"
                >
                  <option value="text">Text</option>
                  <option value="number">Number</option>
                  <option value="date">Date</option>
                  <option value="email">Email</option>
                  <option value="phone">Phone</option>
                  <option value="select">Select</option>
                </select>
              </div>
              
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={field.required}
                  onChange={(e) => updateCustomField(field.id, { required: e.target.checked })}
                />
                <Label className="text-xs">Required</Label>
              </div>
            </div>

            {field.type === 'select' && (
              <div>
                <Label className="text-xs">Options (comma-separated)</Label>
                <Input
                  value={field.options?.join(', ') || ''}
                  onChange={(e) => updateCustomField(field.id, { 
                    options: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                  })}
                  placeholder="Option 1, Option 2, Option 3"
                />
              </div>
            )}
          </div>
        ))}
        
        {customFieldsConfig.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <UserPlus className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>No custom fields configured</p>
            <p className="text-sm">Add custom fields to collect additional teacher information</p>
          </div>
        )}
      </div>
    </div>
  );

  const saveTeacher = async (teacherData: Omit<Teacher, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      if (editingTeacher) {
        const { error } = await supabase
          .from('teachers')
          .update(teacherData)
          .eq('id', editingTeacher.id);

        if (error) throw error;
        
        toast({
          title: "Teacher Updated",
          description: `${teacherData.full_name} has been updated successfully.`,
        });
      } else {
        const { error } = await supabase
          .from('teachers')
          .insert([teacherData]);

        if (error) throw error;

        toast({
          title: "Teacher Added",
          description: `${teacherData.full_name} has been added successfully.`,
        });
      }

      loadTeachers();
      setIsAddingTeacher(false);
      setEditingTeacher(null);
    } catch (error) {
      console.error('Error saving teacher:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save teacher information",
      });
    }
  };

  const deleteTeacher = async (teacher: Teacher) => {
    if (!confirm(`Are you sure you want to remove ${teacher.full_name}?`)) return;

    try {
      const { error } = await supabase
        .from('teachers')
        .delete()
        .eq('id', teacher.id);

      if (error) throw error;

      toast({
        title: "Teacher Removed",
        description: `${teacher.full_name} has been removed from the system.`,
      });

      loadTeachers();
    } catch (error) {
      console.error('Error deleting teacher:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to remove teacher",
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mobile-responsive-flex">
        <div>
          <h2 className="text-2xl font-bold">Teacher Management</h2>
          <p className="text-muted-foreground">
            Manage teaching staff information and custom fields
          </p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isManagingFields} onOpenChange={setIsManagingFields}>
            <DialogTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Building className="h-4 w-4" />
                Custom Fields
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Custom Fields Management</DialogTitle>
              </DialogHeader>
              <CustomFieldManager />
            </DialogContent>
          </Dialog>
          
          <Dialog open={isAddingTeacher} onOpenChange={setIsAddingTeacher}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Add Teacher
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Teacher</DialogTitle>
              </DialogHeader>
              <TeacherForm
                onSave={saveTeacher}
                onCancel={() => setIsAddingTeacher(false)}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Search and Filters */}
      <SearchAndFilter
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        filters={[
          {
            label: 'Department',
            value: departmentFilter,
            options: departments,
            onChange: setDepartmentFilter
          }
        ]}
      />

      {/* Teachers Grid */}
      {loading ? (
        <div className="mobile-responsive-grid">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="space-y-3">
                  <div className="h-4 bg-muted rounded w-3/4" />
                  <div className="h-3 bg-muted rounded w-1/2" />
                  <div className="h-3 bg-muted rounded w-2/3" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredTeachers.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <GraduationCap className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-lg font-medium mb-2">No Teachers Found</h3>
            <p className="text-muted-foreground mb-6">
              {searchTerm || departmentFilter 
                ? 'No teachers match your current filters'
                : 'Get started by adding your first teacher'
              }
            </p>
            <Button onClick={() => setIsAddingTeacher(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Add First Teacher
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="mobile-responsive-grid">
          {filteredTeachers.map((teacher) => (
            <Card key={teacher.id} className="glass-card hover:shadow-lg transition-all">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-base">{teacher.full_name}</CardTitle>
                    <p className="text-sm text-muted-foreground">ID: {teacher.teacher_id}</p>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setEditingTeacher(teacher)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => deleteTeacher(teacher)}
                        className="text-destructive"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Remove
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2">
                  {teacher.department && (
                    <Badge variant="secondary">{teacher.department}</Badge>
                  )}
                  {teacher.email && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Mail className="h-3 w-3" />
                      {teacher.email}
                    </div>
                  )}
                  {teacher.phone && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Phone className="h-3 w-3" />
                      {teacher.phone}
                    </div>
                  )}
                  {teacher.hire_date && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      Hired: {new Date(teacher.hire_date).toLocaleDateString()}
                    </div>
                  )}
                  
                  {/* Custom Fields Display */}
                  {Object.keys(teacher.custom_fields || {}).length > 0 && (
                    <div className="pt-2 border-t">
                      <div className="space-y-1">
                        {customFieldsConfig
                          .filter(field => teacher.custom_fields?.[field.id])
                          .slice(0, 2)
                          .map(field => (
                            <div key={field.id} className="text-xs text-muted-foreground">
                              <span className="font-medium">{field.label}:</span> {teacher.custom_fields[field.id]}
                            </div>
                          ))
                        }
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Edit Teacher Dialog */}
      <Dialog open={!!editingTeacher} onOpenChange={() => setEditingTeacher(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Teacher - {editingTeacher?.full_name}</DialogTitle>
          </DialogHeader>
          {editingTeacher && (
            <TeacherForm
              teacher={editingTeacher}
              onSave={saveTeacher}
              onCancel={() => setEditingTeacher(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TeacherManagement;