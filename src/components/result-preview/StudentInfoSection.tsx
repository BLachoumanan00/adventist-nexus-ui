
import React, { useState } from "react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuCheckboxItem, 
  DropdownMenuTrigger 
} from "../ui/dropdown-menu";
import { ChevronDown } from "lucide-react";

interface StudentInfoProps {
  student: {
    name: string;
    id: string;
    grade: string;
    section: string;
  };
  daysAbsent: number;
  availableSubjects?: string[];
  selectedSubjects?: string[];
  onSubjectsChange?: (subjects: string[]) => void;
}

const StudentInfoSection: React.FC<StudentInfoProps> = ({ 
  student, 
  daysAbsent,
  availableSubjects = [],
  selectedSubjects = [],
  onSubjectsChange
}) => {
  const [open, setOpen] = useState(false);

  const handleSubjectToggle = (subject: string) => {
    if (!onSubjectsChange) return;
    
    const isSelected = selectedSubjects.includes(subject);
    let newSelectedSubjects: string[];
    
    if (isSelected) {
      newSelectedSubjects = selectedSubjects.filter(s => s !== subject);
    } else {
      newSelectedSubjects = [...selectedSubjects, subject];
    }
    
    onSubjectsChange(newSelectedSubjects);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
      <div>
        <p><span className="font-semibold">Student Name:</span> {student.name}</p>
        <p><span className="font-semibold">Student ID:</span> {student.id}</p>
      </div>
      <div>
        <p><span className="font-semibold">Grade:</span> {student.grade}</p>
        <p><span className="font-semibold">Section:</span> {student.section}</p>
        <p><span className="font-semibold">Days Absent:</span> {daysAbsent}</p>
      </div>
      
      {availableSubjects.length > 0 && onSubjectsChange && (
        <div className="col-span-1 sm:col-span-2 mt-2">
          <div className="flex items-center gap-2">
            <span className="font-semibold">Subjects:</span>
            <DropdownMenu open={open} onOpenChange={setOpen}>
              <DropdownMenuTrigger className="flex items-center px-3 py-1 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 text-sm shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700">
                {selectedSubjects.length > 0 
                  ? `${selectedSubjects.length} selected`
                  : "Select subjects"}
                <ChevronDown className="ml-2 h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded shadow-md">
                {availableSubjects.map((subject) => (
                  <DropdownMenuCheckboxItem
                    key={subject}
                    checked={selectedSubjects.includes(subject)}
                    onCheckedChange={() => handleSubjectToggle(subject)}
                  >
                    {subject}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          {selectedSubjects.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {selectedSubjects.map(subject => (
                <span 
                  key={subject}
                  className="inline-block bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 text-xs px-2 py-1 rounded-full"
                >
                  {subject}
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default StudentInfoSection;
