import React, { useState, useEffect } from "react";
import { Users, BookOpen, GraduationCap, MessageSquare, Settings, BarChart3, Upload } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import EnhancedStudentList from "@/components/enhanced/EnhancedStudentList";
import StudentDetailsDialog from "@/components/enhanced/StudentDetailsDialog";
import TeacherManagement from "@/components/enhanced/TeacherManagement";
import EnhancedBulkResultGenerator from "@/components/enhanced/EnhancedBulkResultGenerator";
import MobileParentContact from "@/components/enhanced/MobileParentContact";
import SubjectManagement from "@/components/SubjectManagement";
import GradeCriteriaTab from "@/components/GradeCriteriaTab";
import { useStudents } from "@/hooks/useStudents";
import { useSupabaseAutoSave } from "@/hooks/useSupabaseAutoSave";
import { Student, TablesInsert } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

const AdminPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState('students');
  const [showStudentDialog, setShowStudentDialog] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const { students, updateStudent, addStudent } = useStudents();
  const { toast } = useToast();

  // Auto-save functionality for admin settings (disabled for non-existent table)
  useSupabaseAutoSave({
    data: { activeTab },
    table: 'profiles', // Use an existing table instead
    enabled: false // Disable for now
  });

  const handleAddStudent = () => {
    setEditingStudent(null);
    setShowStudentDialog(true);
  };

  const handleEditStudent = (student: Student) => {
    setEditingStudent(student);
    setShowStudentDialog(true);
  };

  const handleSaveStudent = async (studentData: Partial<Student>) => {
    if (editingStudent) {
      await updateStudent(editingStudent.id, studentData);
    } else {
      await addStudent(studentData as TablesInsert<'students'>);
    }
    setShowStudentDialog(false);
    setEditingStudent(null);
  };

  const handleViewResults = (student: Student) => {
    // Navigate to results view for this student
    toast({
      title: "Results View",
      description: `Viewing results for ${student.full_name}`,
    });
  };

  return (
    <div className="container-responsive py-4 sm:py-6 lg:py-8">
      <div className="space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-bold">Administration Panel</h1>
          <p className="text-muted-foreground">
            Manage students, teachers, subjects, and school operations
          </p>
        </div>

        {/* Main Navigation Tabs */}
        <Tabs 
          value={activeTab} 
          onValueChange={setActiveTab} 
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-1 h-auto p-1">
            <TabsTrigger value="students" className="flex items-center gap-2 py-3 px-2 text-xs sm:text-sm">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Students</span>
            </TabsTrigger>
            <TabsTrigger value="teachers" className="flex items-center gap-2 py-3 px-2 text-xs sm:text-sm">
              <GraduationCap className="h-4 w-4" />
              <span className="hidden sm:inline">Teachers</span>
            </TabsTrigger>
            <TabsTrigger value="subjects" className="flex items-center gap-2 py-3 px-2 text-xs sm:text-sm">
              <BookOpen className="h-4 w-4" />
              <span className="hidden sm:inline">Subjects</span>
            </TabsTrigger>
            <TabsTrigger value="results" className="flex items-center gap-2 py-3 px-2 text-xs sm:text-sm">
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Results</span>
            </TabsTrigger>
            <TabsTrigger value="communication" className="flex items-center gap-2 py-3 px-2 text-xs sm:text-sm">
              <MessageSquare className="h-4 w-4" />
              <span className="hidden sm:inline">Contact</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2 py-3 px-2 text-xs sm:text-sm">
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Settings</span>
            </TabsTrigger>
          </TabsList>

          {/* Tab Contents */}
          <div className="mt-6">
            <TabsContent value="students" className="mt-0">
              <EnhancedStudentList
                onAddStudent={handleAddStudent}
                onEditStudent={handleEditStudent}
                onViewResults={handleViewResults}
              />
            </TabsContent>

            <TabsContent value="teachers" className="mt-0">
              <TeacherManagement />
            </TabsContent>

            <TabsContent value="subjects" className="mt-0">
              <SubjectManagement />
            </TabsContent>

            <TabsContent value="results" className="mt-0">
              <EnhancedBulkResultGenerator />
            </TabsContent>

            <TabsContent value="communication" className="mt-0">
              <MobileParentContact />
            </TabsContent>

            <TabsContent value="settings" className="mt-0">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Grade Criteria Settings</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <GradeCriteriaTab 
                      onChange={() => {}}
                      initialCriteria={{}}
                    />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </div>
        </Tabs>

        {/* Student Details Dialog */}
        <StudentDetailsDialog
          student={editingStudent}
          isOpen={showStudentDialog}
          onClose={() => {
            setShowStudentDialog(false);
            setEditingStudent(null);
          }}
          onSave={handleSaveStudent}
        />
      </div>
    </div>
  );
};

export default AdminPanel;