
import React from "react";
import { Check, Download, Printer, X } from "lucide-react";

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
  }[];
  onClose: () => void;
}

const ResultPreview: React.FC<ResultPreviewProps> = ({ student, results, onClose }) => {
  const totalMarks = results.reduce((sum, subject) => sum + subject.marks, 0);
  const average = totalMarks / results.length;
  const overallGrade = calculateOverallGrade(average);
  
  function calculateOverallGrade(avg: number): string {
    if (avg >= 90) return "A";
    if (avg >= 80) return "B+";
    if (avg >= 70) return "B";
    if (avg >= 60) return "C+";
    if (avg >= 50) return "C";
    if (avg >= 40) return "D";
    return "F";
  }
  
  const isPassing = average >= 40;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center p-4 z-10">
          <h2 className="text-lg font-semibold">Result Preview</h2>
          <div className="flex gap-2">
            <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              <Printer size={20} />
            </button>
            <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              <Download size={20} />
            </button>
            <button 
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>
        
        <div className="p-6">
          <div className="mb-8 text-center">
            <h1 className="text-xl font-bold mb-1">Adventist College Mauritius</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">Term Results</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <p><span className="font-semibold">Student Name:</span> {student.name}</p>
              <p><span className="font-semibold">Student ID:</span> {student.id}</p>
            </div>
            <div>
              <p><span className="font-semibold">Grade:</span> {student.grade}</p>
              <p><span className="font-semibold">Section:</span> {student.section}</p>
            </div>
          </div>
          
          <div className="border rounded-lg overflow-hidden mb-6">
            <table className="w-full">
              <thead className="bg-gray-100 dark:bg-gray-800">
                <tr>
                  <th className="text-left py-3 px-4 font-medium">Subject</th>
                  <th className="text-center py-3 px-4 font-medium">Marks</th>
                  <th className="text-center py-3 px-4 font-medium">Grade</th>
                  <th className="text-left py-3 px-4 font-medium">Remarks</th>
                </tr>
              </thead>
              <tbody>
                {results.map((result, index) => (
                  <tr key={index} className="border-t border-gray-200 dark:border-gray-700">
                    <td className="py-3 px-4">{result.subject}</td>
                    <td className="py-3 px-4 text-center">{result.marks}</td>
                    <td className="py-3 px-4 text-center">{result.grade}</td>
                    <td className="py-3 px-4">{result.remarks}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-gray-50 dark:bg-gray-800/50 font-medium">
                <tr>
                  <td className="py-3 px-4">Total</td>
                  <td className="py-3 px-4 text-center">{totalMarks}</td>
                  <td className="py-3 px-4 text-center">{overallGrade}</td>
                  <td className="py-3 px-4"></td>
                </tr>
                <tr>
                  <td className="py-3 px-4">Average</td>
                  <td className="py-3 px-4 text-center">{average.toFixed(2)}</td>
                  <td colSpan={2} className="py-3 px-4"></td>
                </tr>
              </tfoot>
            </table>
          </div>
          
          <div className="flex justify-between items-center border-t border-gray-200 dark:border-gray-700 pt-4">
            <div className="flex items-center gap-2">
              <div className={`p-1 rounded-full ${isPassing ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30'}`}>
                {isPassing ? (
                  <Check size={18} className="text-green-600 dark:text-green-400" />
                ) : (
                  <X size={18} className="text-red-600 dark:text-red-400" />
                )}
              </div>
              <span className="font-medium">
                {isPassing ? 'Passed' : 'Failed'}
              </span>
            </div>
            
            <div>
              <p className="text-sm text-right text-gray-600 dark:text-gray-400">
                Generated on {new Date().toLocaleDateString('en-GB')}
              </p>
              <p className="text-sm text-right text-gray-600 dark:text-gray-400">
                Adventist College Management System
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultPreview;
