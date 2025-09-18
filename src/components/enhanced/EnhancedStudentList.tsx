import React, { useState } from 'react';
import { Plus, MoreHorizontal, Edit, Trash2, User, BookOpen, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import SearchAndFilter from '@/components/SearchAndFilter';
import { EmptyState, CardSkeleton } from '@/components/LoadingStates';
import StudentDetailsDialog from './StudentDetailsDialog';
import { useStudents } from '@/hooks/useStudents';
import { useSupabaseAutoSave } from '@/hooks/useSupabaseAutoSave';
import { Student } from '@/lib/supabase';

interface EnhancedStudentListProps {
  onAddStudent: () => void;
  onEditStudent: (student: Student) => void;
  onViewResults: (student: Student) => void;
}

const EnhancedStudentList: React.FC<EnhancedStudentListProps> = ({
  onAddStudent,
  onEditStudent,
  onViewResults
}) => {
  const {
    students,
    loading,
    searchTerm,
    setSearchTerm,
    gradeFilter,
    setGradeFilter,
    deleteStudent
  } = useStudents();

  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [detailsStudent, setDetailsStudent] = useState<Student | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);

  // Auto-save functionality
  useSupabaseAutoSave({
    data: students,
    table: 'students',
    enabled: true
  });

  const grades = [
    { value: 'Grade 1', label: 'Grade 1' },
    { value: 'Grade 2', label: 'Grade 2' },
    { value: 'Grade 3', label: 'Grade 3' },
    { value: 'Grade 4', label: 'Grade 4' },
    { value: 'Grade 5', label: 'Grade 5' },
    { value: 'Grade 6', label: 'Grade 6' },
    { value: 'Grade 7', label: 'Grade 7' },
    { value: 'Grade 8', label: 'Grade 8' },
    { value: 'Grade 9', label: 'Grade 9' },
    { value: 'Grade 10', label: 'Grade 10' },
    { value: 'Grade 11', label: 'Grade 11' },
    { value: 'Grade 12', label: 'Grade 12' },
  ];

  const handleDeleteStudent = async (student: Student) => {
    if (window.confirm(`Are you sure you want to remove ${student.full_name}?`)) {
      await deleteStudent(student.id);
    }
  };

  const handleViewDetails = (student: Student) => {
    setDetailsStudent(student);
    setShowDetailsDialog(true);
  };

  const handleSaveStudent = (updatedStudent: Student) => {
    // Update the student in the list
    onEditStudent(updatedStudent);
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  if (loading) {
    return <CardSkeleton count={6} />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Students</h2>
          <p className="text-muted-foreground">
            Manage student records and information
          </p>
        </div>
        <Button onClick={onAddStudent} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Student
        </Button>
      </div>

      {/* Search and Filters */}
      <SearchAndFilter
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        filters={[
          {
            label: 'Grade',
            value: gradeFilter,
            options: grades,
            onChange: setGradeFilter
          }
        ]}
      />

      {/* Student Grid */}
      {students.length === 0 ? (
        <EmptyState
          title="No students found"
          description="Get started by adding your first student to the system."
          action={
            <Button onClick={onAddStudent} className="gap-2">
              <Plus className="h-4 w-4" />
              Add First Student
            </Button>
          }
          icon={<User className="h-12 w-12 text-muted-foreground" />}
        />
      ) : (
        <div className="mobile-responsive-grid">
          {students.map((student) => (
            <Card key={student.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {getInitials(student.full_name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-sm font-medium">
                        {student.full_name}
                      </CardTitle>
                      <p className="text-xs text-muted-foreground">
                        ID: {student.student_id}
                      </p>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleViewDetails(student)}>
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onEditStudent(student)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Student
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onViewResults(student)}>
                        <BookOpen className="mr-2 h-4 w-4" />
                        View Results
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => handleDeleteStudent(student)}
                        className="text-destructive"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Remove Student
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
                <CardContent className="pt-0">
                <div className="space-y-2">
                  {student.parent_name && (
                    <div className="text-xs">
                      <span className="text-muted-foreground">Responsible Party:</span>{' '}
                      {student.parent_name}
                    </div>
                  )}
                  {student.parent_phone && (
                    <div className="text-xs">
                      <span className="text-muted-foreground">Phone:</span>{' '}
                      {student.parent_phone}
                    </div>
                  )}
                  <div className="flex items-center justify-between pt-2">
                    <Badge variant="secondary" className="text-xs">
                      Active
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      Enrolled: {new Date(student.enrollment_date).toLocaleDateString()}
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
        Showing {students.length} student{students.length !== 1 ? 's' : ''}
        {(searchTerm || gradeFilter) && (
          <span> (filtered from total)</span>
        )}
      </div>

      {/* Student Details Dialog */}
      <StudentDetailsDialog
        student={detailsStudent}
        isOpen={showDetailsDialog}
        onClose={() => {
          setShowDetailsDialog(false);
          setDetailsStudent(null);
        }}
        onSave={handleSaveStudent}
      />
    </div>
  );
};

export default EnhancedStudentList;