
import React from "react";
import { X } from "lucide-react";
import ResultsTable from "./result-preview/ResultsTable";
import StudentInfoSection from "./result-preview/StudentInfoSection";
import SignatureSection from "./result-preview/SignatureSection";

interface ResultPreviewProps {
  student: {
    name: string;
    id: string;
    grade: string;
    section: string;
  };
  results: Array<{
    subject: string;
    marks: number;
    grade: string;
    remarks: string;
  }>;
  onClose: () => void;
  availableSubjects?: string[];
  selectedSubjects?: string[];
  onSubjectsChange?: (subjects: string[]) => void;
}

const ResultPreview: React.FC<ResultPreviewProps> = ({ 
  student, 
  results, 
  onClose,
  availableSubjects = [],
  selectedSubjects = [],
  onSubjectsChange
}) => {
  // Calculate total marks and average
  const totalMarks = results.reduce((acc, result) => acc + result.marks, 0);
  const average = totalMarks / results.length;

  // Determine overall grade based on average
  let overallGrade = "";
  if (average >= 90) overallGrade = "A";
  else if (average >= 80) overallGrade = "B+";
  else if (average >= 70) overallGrade = "B";
  else if (average >= 60) overallGrade = "C+";
  else if (average >= 50) overallGrade = "C";
  else overallGrade = "D";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm overflow-y-auto p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full mx-auto relative p-6">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 transition-colors"
        >
          <X size={20} />
        </button>

        <h2 className="text-xl font-semibold mb-6">Student Result Preview</h2>
        
        <StudentInfoSection 
          student={student} 
          daysAbsent={0} 
          availableSubjects={availableSubjects}
          selectedSubjects={selectedSubjects}
          onSubjectsChange={onSubjectsChange}
        />
        
        <ResultsTable 
          results={results} 
          totalMarks={totalMarks} 
          average={average} 
          overallGrade={overallGrade}
          filteredSubjects={selectedSubjects}
        />
        
        <SignatureSection 
          leftSignatory="Class Teacher" 
          rightSignatory="Principal" 
        />
      </div>
    </div>
  );
};

export default ResultPreview;
