
import React, { useState } from "react";
import { Download, Printer, X } from "lucide-react";
import SignatureSelector from "./result-preview/SignatureSelector";
import StudentInfoSection from "./result-preview/StudentInfoSection";
import ResultsTable from "./result-preview/ResultsTable";
import SignatureSection from "./result-preview/SignatureSection";
import ResultStatusFooter from "./result-preview/ResultStatusFooter";

interface ResultPreviewProps {
  student: {
    name: string;
    id: string;
    grade: string;
    section: string;
  };
  results: {
    subject: string;
    marks: number;
    grade: string;
    remarks: string;
    isMainSubject?: boolean;
  }[];
  daysAbsent?: number;
  onClose: () => void;
}

const ResultPreview: React.FC<ResultPreviewProps> = ({ 
  student, 
  results, 
  daysAbsent = 0, 
  onClose 
}) => {
  const [leftSignatory, setLeftSignatory] = useState("Class Teacher");
  const [rightSignatory, setRightSignatory] = useState("Rector");
  
  const totalMarks = results.reduce((sum, subject) => sum + subject.marks, 0);
  const average = totalMarks / results.length;
  const overallGrade = calculateOverallGrade(average);
  const isPassing = average >= 40;
  
  function calculateOverallGrade(avg: number): string {
    if (avg >= 90) return "A";
    if (avg >= 80) return "B+";
    if (avg >= 70) return "B";
    if (avg >= 60) return "C+";
    if (avg >= 50) return "C";
    if (avg >= 40) return "D";
    return "F";
  }

  // Handle printing the result
  const handlePrint = () => {
    const printContent = document.getElementById('resultToPrint');
    if (!printContent) return;
    
    const originalDisplay = document.body.style.display;
    const printWindow = window.open('', '_blank');
    
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Result - ${student.name}</title>
            <style>
              body { font-family: Arial, sans-serif; color: #000; background: #fff; }
              table { width: 100%; border-collapse: collapse; margin: 20px 0; }
              th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
              th { background-color: #f2f2f2; }
              .header { text-align: center; margin-bottom: 20px; }
              .student-info { display: flex; justify-content: space-between; margin-bottom: 20px; }
              .student-info > div { width: 48%; }
              .footer { display: flex; justify-content: space-between; margin-top: 20px; border-top: 1px solid #ddd; padding-top: 20px; }
            </style>
          </head>
          <body>
            ${printContent.innerHTML}
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
      printWindow.close();
    }
  };

  // Handle download as PDF
  const handleDownload = () => {
    // This is a placeholder for PDF download functionality
    // In a real implementation, you'd use a library like jsPDF
    alert("PDF download functionality would be implemented here");
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl w-[95%] max-w-6xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center p-4 z-10">
          <h2 className="text-lg font-semibold">Result Preview</h2>
          <div className="flex gap-2">
            <button 
              onClick={handlePrint}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Print result"
            >
              <Printer size={20} />
            </button>
            <button 
              onClick={handleDownload}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Download result as PDF"
            >
              <Download size={20} />
            </button>
            <button 
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Close preview"
            >
              <X size={20} />
            </button>
          </div>
        </div>
        
        <SignatureSelector
          leftSignatory={leftSignatory}
          rightSignatory={rightSignatory}
          setLeftSignatory={setLeftSignatory}
          setRightSignatory={setRightSignatory}
        />
        
        <div className="p-6" id="resultToPrint">
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold mb-1">Adventist College Mauritius</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">Term Results</p>
          </div>
          
          <StudentInfoSection student={student} daysAbsent={daysAbsent} />
          
          <ResultsTable 
            results={results} 
            totalMarks={totalMarks} 
            average={average} 
            overallGrade={overallGrade} 
          />
          
          <ResultStatusFooter isPassing={isPassing} />
          
          <SignatureSection leftSignatory={leftSignatory} rightSignatory={rightSignatory} />
        </div>
      </div>
    </div>
  );
};

export default ResultPreview;
