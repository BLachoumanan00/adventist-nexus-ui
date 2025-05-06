
import React, { useState, useEffect } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader,
  TableRow
} from './ui/table';
import { X, Plus, Save, Check } from 'lucide-react';
import { useToast } from "../hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

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
  const { toast } = useToast();

  // Reset selected subjects when student changes
  useEffect(() => {
    setSelectedSubjects(student.subjects || []);
    setIsEditing(false);
  }, [student]);

  const handleAddSubject = (subject: StudentSubject) => {
    if (!selectedSubjects.some(s => s.id === subject.id)) {
      setSelectedSubjects([...selectedSubjects, subject]);
    }
  };

  const handleRemoveSubject = (subjectId: string) => {
    setSelectedSubjects(selectedSubjects.filter(s => s.id !== subjectId));
  };

  const handleSave = () => {
    onSave(student.id, selectedSubjects);
    setIsEditing(false);
    toast({
      title: "Subjects Updated",
      description: `Updated subjects for ${student.name}`,
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">{student.name}'s Subjects</h3>
        {!isEditing ? (
          <button 
            onClick={() => setIsEditing(true)}
            className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          >
            Edit Subjects
          </button>
        ) : (
          <button 
            onClick={handleSave}
            className="flex items-center gap-1 px-3 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600 transition"
          >
            <Save size={14} />
            Save Changes
          </button>
        )}
      </div>
      
      {isEditing ? (
        <div className="glass p-4 rounded-lg space-y-4">
          <div>
            <h4 className="text-sm font-medium mb-2">Current Subjects</h4>
            {selectedSubjects.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {selectedSubjects.map(subject => (
                  <div 
                    key={subject.id}
                    className="flex items-center gap-1 bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 px-2 py-1 rounded-full text-sm"
                  >
                    {subject.name}
                    <button 
                      onClick={() => handleRemoveSubject(subject.id)}
                      className="text-blue-600 dark:text-blue-400 hover:text-blue-800"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-foreground/60">No subjects added yet</p>
            )}
          </div>
          
          <div>
            <h4 className="text-sm font-medium mb-2">Available Subjects</h4>
            <div className="flex flex-wrap gap-2">
              {availableSubjects
                .filter(subject => !selectedSubjects.some(s => s.id === subject.id))
                .map(subject => (
                  <div 
                    key={subject.id}
                    onClick={() => handleAddSubject(subject)}
                    className="flex items-center gap-1 bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300 px-2 py-1 rounded-full text-sm cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700"
                  >
                    <Plus size={14} />
                    {subject.name} {subject.grade && `(Grade ${subject.grade})`}
                  </div>
                ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="glass p-4 rounded-lg">
          {selectedSubjects.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {selectedSubjects.map(subject => (
                <div 
                  key={subject.id}
                  className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 px-2 py-1 rounded-full text-sm"
                >
                  {subject.name} {subject.grade && `(Grade ${subject.grade})`}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-foreground/60">No subjects assigned</p>
          )}
        </div>
      )}
    </div>
  );
};

export default StudentSubjectsManager;
