
import React, { useState, useEffect, useCallback } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader,
  TableRow
} from './ui/table';
import { X, Plus, Save, Edit3, AlertCircle, Loader2 } from 'lucide-react';
import { useToast } from "../hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { Alert, AlertDescription } from "./ui/alert";

export interface StudentSubject {
  id: string;
  name: string;
  grade?: string; // Add grade property to subjects
}

export interface StudentWithSubjects {
  id: number;
  name: string;
  grade: string;
  section: string;
  rollNo: string;
  parentName: string;
  contactNo: string;
  addedOn: string;
  subjects: StudentSubject[];
}

interface StudentSubjectsManagerProps {
  student: StudentWithSubjects;
  availableSubjects: StudentSubject[];
  onSave: (studentId: number, subjects: StudentSubject[]) => void;
}

const StudentSubjectsManager: React.FC<StudentSubjectsManagerProps> = ({
  student,
  availableSubjects,
  onSave
}) => {
  const [selectedSubjects, setSelectedSubjects] = useState<StudentSubject[]>(student.subjects || []);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedGradeFilter, setSelectedGradeFilter] = useState<string>('All');
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Reset selected subjects when student changes
  useEffect(() => {
    try {
      setSelectedSubjects(student.subjects || []);
      setIsEditing(false);
      setError(null);
    } catch (err) {
      setError('Failed to load student subjects');
      console.error('Error loading student subjects:', err);
    }
  }, [student]);

  // Validate subject data
  const validateSubject = useCallback((subject: StudentSubject): boolean => {
    return !!(subject?.id && subject?.name);
  }, []);

  const handleAddSubject = useCallback((subject: StudentSubject) => {
    try {
      if (!validateSubject(subject)) {
        throw new Error('Invalid subject data');
      }
      
      if (!selectedSubjects.some(s => s.id === subject.id)) {
        setSelectedSubjects(prev => [...prev, subject]);
        toast({
          title: "Subject Added",
          description: `${subject.name} added to ${student.name}'s subjects`,
        });
      }
    } catch (err) {
      setError('Failed to add subject');
      console.error('Error adding subject:', err);
    }
  }, [selectedSubjects, validateSubject, student.name, toast]);

  const handleRemoveSubject = useCallback((subjectId: string) => {
    try {
      const subject = selectedSubjects.find(s => s.id === subjectId);
      setSelectedSubjects(prev => prev.filter(s => s.id !== subjectId));
      
      if (subject) {
        toast({
          title: "Subject Removed",
          description: `${subject.name} removed from ${student.name}'s subjects`,
        });
      }
    } catch (err) {
      setError('Failed to remove subject');
      console.error('Error removing subject:', err);
    }
  }, [selectedSubjects, student.name, toast]);

  const handleSave = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Validate all selected subjects
      const invalidSubjects = selectedSubjects.filter(s => !validateSubject(s));
      if (invalidSubjects.length > 0) {
        throw new Error(`Invalid subjects detected: ${invalidSubjects.map(s => s.name || 'Unknown').join(', ')}`);
      }
      
      await onSave(student.id, selectedSubjects);
      setIsEditing(false);
      
      toast({
        title: "Subjects Updated Successfully",
        description: `Updated ${selectedSubjects.length} subjects for ${student.name}`,
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to save subjects';
      setError(errorMessage);
      toast({
        title: "Save Failed",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [selectedSubjects, validateSubject, onSave, student.id, student.name, toast]);

  // Group available subjects by grade with filtering
  const getFilteredSubjectsByGrade = useCallback(() => {
    const grades = ['7', '8', '9', '10', '11', '12', '13'];
    const subjectsByGrade: Record<string, StudentSubject[]> = {
      'All': availableSubjects.filter(s => !s.grade || s.grade === 'All')
    };
    
    grades.forEach(grade => {
      subjectsByGrade[grade] = availableSubjects.filter(s => s.grade === grade);
    });
    
    // Apply grade filter
    if (selectedGradeFilter === 'All') {
      return subjectsByGrade;
    } else {
      return {
        [selectedGradeFilter]: subjectsByGrade[selectedGradeFilter] || []
      };
    }
  }, [availableSubjects, selectedGradeFilter]);

  const filteredSubjectsByGrade = getFilteredSubjectsByGrade();

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-lg font-semibold text-foreground">{student.name}'s Subjects</h3>
          <p className="text-sm text-muted-foreground">
            {selectedSubjects.length} subject{selectedSubjects.length !== 1 ? 's' : ''} assigned
          </p>
        </div>
        
        {!isEditing ? (
          <Button 
            onClick={() => setIsEditing(true)}
            variant="outline"
            size="sm"
            className="gap-2"
          >
            <Edit3 size={16} />
            Edit Subjects
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button 
              onClick={() => {
                setIsEditing(false);
                setSelectedSubjects(student.subjects || []);
                setError(null);
              }}
              variant="outline"
              size="sm"
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSave}
              size="sm"
              disabled={isLoading}
              className="gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={16} />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        )}
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive" className="animate-fade-in">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {isEditing ? (
        <div className="space-y-6">
          {/* Current Subjects Section */}
          <div className="glass-card">
            <h4 className="text-sm font-semibold mb-3 text-foreground">Current Subjects</h4>
            {selectedSubjects.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {selectedSubjects.map(subject => (
                  <div 
                    key={subject.id}
                    className="group flex items-center gap-2 bg-primary/10 text-primary px-3 py-2 rounded-lg text-sm border border-primary/20 transition-all hover:bg-primary/20"
                  >
                    <span className="font-medium">{subject.name}</span>
                    {subject.grade && subject.grade !== 'All' && (
                      <span className="text-xs bg-primary/20 px-1.5 py-0.5 rounded">
                        Grade {subject.grade}
                      </span>
                    )}
                    <button 
                      onClick={() => handleRemoveSubject(subject.id)}
                      className="text-primary hover:text-destructive transition-colors ml-1"
                      disabled={isLoading}
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Plus size={24} className="mx-auto mb-2 opacity-50" />
                <p className="text-sm">No subjects added yet</p>
                <p className="text-xs">Select subjects below to get started</p>
              </div>
            )}
          </div>
          
          {/* Available Subjects Section */}
          <div className="glass-card">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-semibold text-foreground">Available Subjects</h4>
              <span className="text-xs text-muted-foreground">
                {availableSubjects.length} total subjects
              </span>
            </div>
            
            {/* Grade Filter */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="w-full sm:w-auto mb-4 justify-between">
                  {selectedGradeFilter === 'All' ? 'All Grades' : `Grade ${selectedGradeFilter}`}
                  <span className="ml-2">▼</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuItem 
                  onSelect={() => setSelectedGradeFilter('All')}
                  className="cursor-pointer"
                >
                  All Grades
                </DropdownMenuItem>
                {['7', '8', '9', '10', '11', '12', '13'].map(grade => (
                  <DropdownMenuItem 
                    key={grade} 
                    onSelect={() => setSelectedGradeFilter(grade)}
                    className="cursor-pointer"
                  >
                    Grade {grade}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            
            {/* Subjects List */}
            <div className="space-y-4">
              {Object.entries(filteredSubjectsByGrade).map(([grade, subjects]) => {
                const availableSubjectsForGrade = subjects.filter(subject => 
                  !selectedSubjects.some(s => s.id === subject.id)
                );
                
                return availableSubjectsForGrade.length > 0 && (
                  <div key={grade} className="space-y-2">
                    <h5 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      {grade === 'All' ? 'General Subjects' : `Grade ${grade}`}
                    </h5>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                      {availableSubjectsForGrade.map(subject => (
                        <button
                          key={subject.id}
                          onClick={() => handleAddSubject(subject)}
                          disabled={isLoading}
                          className="flex items-center gap-2 p-3 text-left bg-secondary/30 hover:bg-secondary/60 text-secondary-foreground rounded-lg text-sm transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed border border-secondary/20"
                        >
                          <Plus size={16} className="text-muted-foreground" />
                          <span className="font-medium">{subject.name}</span>
                          {subject.grade && subject.grade !== 'All' && (
                            <span className="text-xs bg-muted px-1.5 py-0.5 rounded ml-auto">
                              Grade {subject.grade}
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
              
              {Object.values(filteredSubjectsByGrade).every(subjects => 
                subjects.filter(subject => !selectedSubjects.some(s => s.id === subject.id)).length === 0
              ) && (
                <div className="text-center py-8 text-muted-foreground">
                  <AlertCircle size={24} className="mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No available subjects for the selected grade</p>
                  <p className="text-xs">Try selecting a different grade level</p>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* View Mode */
        <div className="glass-card">
          {selectedSubjects.length > 0 ? (
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2">
                {selectedSubjects.map(subject => (
                  <div 
                    key={subject.id}
                    className="flex items-center gap-2 bg-muted px-3 py-2 rounded-lg text-sm border"
                  >
                    <span className="font-medium text-foreground">{subject.name}</span>
                    {subject.grade && subject.grade !== 'All' && (
                      <span className="text-xs bg-primary/20 text-primary px-1.5 py-0.5 rounded">
                        Grade {subject.grade}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <AlertCircle size={24} className="mx-auto mb-2 opacity-50" />
              <p className="text-sm">No subjects assigned to this student</p>
              <p className="text-xs">Click "Edit Subjects" to add some subjects</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default StudentSubjectsManager;
