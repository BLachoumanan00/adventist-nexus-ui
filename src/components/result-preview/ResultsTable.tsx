
import React from "react";

interface ResultsTableProps {
  results: {
    subject: string;
    marks: number;
    grade: string;
    remarks: string;
    isMainSubject?: boolean;
  }[];
  totalMarks: number;
  average: number;
  overallGrade: string;
  filteredSubjects?: string[];
}

const ResultsTable: React.FC<ResultsTableProps> = ({ 
  results, 
  totalMarks, 
  average, 
  overallGrade,
  filteredSubjects
}) => {
  // Filter the results if filteredSubjects is provided
  const displayedResults = filteredSubjects && filteredSubjects.length > 0
    ? results.filter(result => filteredSubjects.includes(result.subject))
    : results;
  
  // Recalculate totals if we're filtering
  const displayedTotalMarks = filteredSubjects && filteredSubjects.length > 0
    ? displayedResults.reduce((total, result) => total + result.marks, 0)
    : totalMarks;
  
  const displayedAverage = displayedResults.length > 0
    ? displayedTotalMarks / displayedResults.length
    : 0;

  return (
    <div className="border rounded-lg overflow-hidden mb-6">
      <table className="w-full">
        <thead className="bg-gray-100 dark:bg-gray-800">
          <tr>
            <th className="text-left py-3 px-4 font-medium">Subject</th>
            <th className="text-center py-3 px-4 font-medium">Type</th>
            <th className="text-center py-3 px-4 font-medium">Marks</th>
            <th className="text-center py-3 px-4 font-medium">Grade</th>
            <th className="text-left py-3 px-4 font-medium">Remarks</th>
          </tr>
        </thead>
        <tbody>
          {displayedResults.length > 0 ? (
            displayedResults.map((result, index) => (
              <tr key={index} className="border-t border-gray-200 dark:border-gray-700">
                <td className="py-3 px-4">{result.subject}</td>
                <td className="py-3 px-4 text-center">
                  {result.isMainSubject !== undefined ? 
                    (result.isMainSubject ? "Main" : "Sub") : "-"}
                </td>
                <td className="py-3 px-4 text-center">{result.marks}</td>
                <td className="py-3 px-4 text-center">{result.grade}</td>
                <td className="py-3 px-4">{result.remarks}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} className="py-6 px-4 text-center text-gray-500">
                No subjects selected. Please select subjects to view results.
              </td>
            </tr>
          )}
        </tbody>
        <tfoot className="bg-gray-50 dark:bg-gray-800/50 font-medium">
          <tr>
            <td className="py-3 px-4">Total</td>
            <td className="py-3 px-4"></td>
            <td className="py-3 px-4 text-center">{displayedTotalMarks}</td>
            <td className="py-3 px-4 text-center">{overallGrade}</td>
            <td className="py-3 px-4"></td>
          </tr>
          <tr>
            <td className="py-3 px-4">Average</td>
            <td className="py-3 px-4"></td>
            <td className="py-3 px-4 text-center">{displayedAverage.toFixed(2)}</td>
            <td colSpan={2} className="py-3 px-4"></td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default ResultsTable;
