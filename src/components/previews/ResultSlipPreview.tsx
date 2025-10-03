
import React from "react";
import { X } from "lucide-react";

interface Subject {
  subject: string;
  marks: number;
  totalMarks: number;
  grade: string;
  remarks: string;
}

interface ResultSlipPreviewProps {
  student: {
    id: string;
    name: string;
    grade: string;
    section: string;
    totalMarks: number;
    percentage: number;
    rank: number;
    overallGrade: string;
    generalRemarks: string;
  };
  subjects: Subject[];
  schoolLogo?: string | null;
  signature?: string | null;
  schoolName?: string;
  schoolAddress?: string;
  examName?: string;
  daysAbsent?: number;
  onClose: () => void;
}

const ResultSlipPreview: React.FC<ResultSlipPreviewProps> = ({
  student,
  subjects,
  schoolLogo,
  signature,
  schoolName = "Adventist College",
  schoolAddress = "Royal Road, Rose Hill, Mauritius",
  examName = "Term 1 Examination",
  daysAbsent = 0,
  onClose
}) => {
  const getGradeColor = (grade: string) => {
    if (grade.includes('A')) return "text-green-600 dark:text-green-400";
    if (grade.includes('B')) return "text-blue-600 dark:text-blue-400";
    if (grade.includes('C')) return "text-yellow-600 dark:text-yellow-400";
    if (grade.includes('D')) return "text-orange-600 dark:text-orange-400";
    return "text-red-600 dark:text-red-400";
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm overflow-y-auto py-10">
      <div className="bg-card rounded-lg shadow-xl max-w-4xl w-full mx-4 my-auto relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-full bg-gray-200 dark:bg-gray-700"
        >
          <X size={20} />
        </button>
        
        {/* Print button */}
        <button 
          onClick={() => window.print()} 
          className="absolute top-4 right-16 px-4 py-1 bg-primary text-white rounded-md"
        >
          Print
        </button>
        
        <div className="p-8 print:p-0" id="printable-result">
          {/* Header */}
          <div className="flex justify-between items-center mb-6 border-b pb-4">
            {schoolLogo && (
              <div className="w-20 h-20">
                <img src={schoolLogo} alt="School Logo" className="w-full h-full object-contain" />
              </div>
            )}
            <div className="text-center flex-1">
              <h1 className="text-2xl font-bold">{schoolName}</h1>
              <p className="text-gray-600 dark:text-gray-400">{schoolAddress}</p>
              <h2 className="text-xl mt-2 font-semibold">{examName}</h2>
              <h3 className="text-lg font-medium">Result Slip</h3>
            </div>
            <div className="w-20 h-20">
              {/* Empty div for alignment */}
            </div>
          </div>
          
          {/* Student Details */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <p><strong>Student Name:</strong> {student.name}</p>
              <p><strong>Student ID:</strong> {student.id}</p>
            </div>
            <div>
              <p><strong>Class:</strong> Grade {student.grade}-{student.section}</p>
              <p><strong>Rank:</strong> {student.rank}</p>
              <p><strong>Days Absent:</strong> {daysAbsent}</p>
            </div>
          </div>
          
          {/* Marks Table - Removed the Total column */}
          <table className="w-full mb-6 border-collapse">
            <thead className="bg-gray-100 dark:bg-gray-700">
              <tr>
                <th className="border border-gray-300 dark:border-gray-600 p-2 text-left">Subject</th>
                <th className="border border-gray-300 dark:border-gray-600 p-2 text-center">Marks</th>
                <th className="border border-gray-300 dark:border-gray-600 p-2 text-center">Grade</th>
                <th className="border border-gray-300 dark:border-gray-600 p-2 text-left">Remarks</th>
              </tr>
            </thead>
            <tbody>
              {subjects.map((subject, index) => (
                <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="border border-gray-300 dark:border-gray-600 p-2">{subject.subject}</td>
                  <td className="border border-gray-300 dark:border-gray-600 p-2 text-center">{subject.marks}/{subject.totalMarks}</td>
                  <td className="border border-gray-300 dark:border-gray-600 p-2 text-center">
                    <span className={`${getGradeColor(subject.grade)} font-medium`}>
                      {subject.grade}
                    </span>
                  </td>
                  <td className="border border-gray-300 dark:border-gray-600 p-2">{subject.remarks}</td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-gray-100 dark:bg-gray-700 font-medium">
              <tr>
                <td className="border border-gray-300 dark:border-gray-600 p-2">Overall</td>
                <td className="border border-gray-300 dark:border-gray-600 p-2 text-center">
                  {student.percentage.toFixed(1)}%
                </td>
                <td className="border border-gray-300 dark:border-gray-600 p-2 text-center">
                  <span className={`${getGradeColor(student.overallGrade)} font-medium`}>
                    {student.overallGrade}
                  </span>
                </td>
                <td className="border border-gray-300 dark:border-gray-600 p-2">
                  Rank: {student.rank}
                </td>
              </tr>
            </tfoot>
          </table>
          
          {/* General Remarks */}
          <div className="mb-8">
            <h4 className="font-semibold mb-2">General Remarks:</h4>
            <p className="p-2 border border-gray-300 dark:border-gray-600 rounded">{student.generalRemarks}</p>
          </div>
          
          {/* Signature */}
          <div className="flex justify-between items-end mt-12">
            <div>
              <p className="mb-8">Date: {new Date().toLocaleDateString()}</p>
              <p>Class Teacher</p>
            </div>
            <div className="text-center">
              {signature && (
                <div className="mb-2 h-20">
                  <img src={signature} alt="Rector Signature" className="h-full object-contain mx-auto" />
                </div>
              )}
              <p>Rector</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultSlipPreview;
