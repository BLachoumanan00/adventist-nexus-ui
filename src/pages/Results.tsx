
import React, { useState } from "react";
import { BookOpen, ChevronDown, Download, FileSpreadsheet, FileText, Printer } from "lucide-react";

const Results: React.FC = () => {
  const [selectedClass, setSelectedClass] = useState("Grade 8");
  const [selectedSection, setSelectedSection] = useState("A");
  const [selectedTerm, setSelectedTerm] = useState("Term 1");
  const [selectedFormat, setSelectedFormat] = useState("pdf");
  const [selectedStudents, setSelectedStudents] = useState<number[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  
  // Sample students data
  const students = [
    { id: 1, name: "John Smith", roll: "8A01", average: 78 },
    { id: 2, name: "Sarah Johnson", roll: "8A02", average: 92 },
    { id: 3, name: "Michael Brown", roll: "8A03", average: 65 },
    { id: 4, name: "Emily Davis", roll: "8A04", average: 88 },
    { id: 5, name: "Robert Wilson", roll: "8A05", average: 75 },
    { id: 6, name: "Jessica Lee", roll: "8A06", average: 81 },
    { id: 7, name: "William Taylor", roll: "8A07", average: 79 },
    { id: 8, name: "Olivia Martin", roll: "8A08", average: 94 },
  ];
  
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents(students.map(student => student.id));
    }
    setSelectAll(!selectAll);
  };
  
  const handleSelectStudent = (id: number) => {
    if (selectedStudents.includes(id)) {
      setSelectedStudents(selectedStudents.filter(studentId => studentId !== id));
      setSelectAll(false);
    } else {
      setSelectedStudents([...selectedStudents, id]);
      if (selectedStudents.length + 1 === students.length) {
        setSelectAll(true);
      }
    }
  };
  
  const handleGenerateResults = () => {
    // In a real app, this would generate and download the results
    alert(`Generating ${selectedFormat.toUpperCase()} results for ${selectedStudents.length} students`);
  };

  return (
    <div className="animate-fade-in">
      <div className="glass-card mb-6">
        <div className="flex items-center gap-3 mb-6">
          <FileText size={24} className="text-theme-purple" />
          <h2 className="text-xl font-semibold">Results Generator</h2>
        </div>
        
        <div className="glass rounded-xl p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div>
              <label className="block text-sm text-foreground/70 mb-1">Class</label>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-full glass rounded-lg border-none px-4 py-2"
              >
                <option>Grade 7</option>
                <option>Grade 8</option>
                <option>Grade 9</option>
                <option>Grade 10</option>
                <option>Grade 11</option>
                <option>Grade 12</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm text-foreground/70 mb-1">Section</label>
              <select
                value={selectedSection}
                onChange={(e) => setSelectedSection(e.target.value)}
                className="w-full glass rounded-lg border-none px-4 py-2"
              >
                <option>A</option>
                <option>B</option>
                <option>C</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm text-foreground/70 mb-1">Term</label>
              <select
                value={selectedTerm}
                onChange={(e) => setSelectedTerm(e.target.value)}
                className="w-full glass rounded-lg border-none px-4 py-2"
              >
                <option>Term 1</option>
                <option>Term 2</option>
                <option>Term 3</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm text-foreground/70 mb-1">Format</label>
              <select
                value={selectedFormat}
                onChange={(e) => setSelectedFormat(e.target.value)}
                className="w-full glass rounded-lg border-none px-4 py-2"
              >
                <option value="pdf">PDF</option>
                <option value="excel">Excel</option>
                <option value="print">Print</option>
              </select>
            </div>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="pb-3 text-left">
                  <div className="flex items-center gap-2">
                    <input 
                      type="checkbox" 
                      checked={selectAll}
                      onChange={handleSelectAll}
                      className="rounded text-primary focus:ring-primary/30"
                    />
                    <span className="font-medium text-foreground/70 text-sm">Select All</span>
                  </div>
                </th>
                <th className="pb-3 text-left font-medium text-foreground/70 text-sm">Roll No.</th>
                <th className="pb-3 text-left font-medium text-foreground/70 text-sm">Student Name</th>
                <th className="pb-3 text-left font-medium text-foreground/70 text-sm">Average Score</th>
                <th className="pb-3 text-left font-medium text-foreground/70 text-sm">Preview</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="py-3">
                    <input 
                      type="checkbox" 
                      checked={selectedStudents.includes(student.id)}
                      onChange={() => handleSelectStudent(student.id)}
                      className="rounded text-primary focus:ring-primary/30"
                    />
                  </td>
                  <td className="py-3">{student.roll}</td>
                  <td className="py-3">{student.name}</td>
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                      <span className={`${
                        student.average >= 80 ? 'text-green-600 dark:text-green-400' :
                        student.average >= 60 ? 'text-blue-600 dark:text-blue-400' :
                        student.average >= 40 ? 'text-yellow-600 dark:text-yellow-400' :
                        'text-red-600 dark:text-red-400'
                      } font-medium`}>
                        {student.average}%
                      </span>
                    </div>
                  </td>
                  <td className="py-3">
                    <button className="text-primary hover:underline text-sm">
                      View Card
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="mt-6 flex justify-between">
          <div className="text-sm text-foreground/60">
            {selectedStudents.length} student{selectedStudents.length !== 1 ? 's' : ''} selected
          </div>
          
          <div className="flex gap-3">
            <button 
              onClick={handleGenerateResults}
              disabled={selectedStudents.length === 0}
              className={`btn-primary flex items-center gap-2 ${
                selectedStudents.length === 0 ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {selectedFormat === 'pdf' && <FileText size={18} />}
              {selectedFormat === 'excel' && <FileSpreadsheet size={18} />}
              {selectedFormat === 'print' && <Printer size={18} />}
              <span>Generate Results</span>
            </button>
          </div>
        </div>
      </div>
      
      <div className="glass-card">
        <div className="flex items-center gap-3 mb-6">
          <Download size={24} className="text-theme-purple" />
          <h2 className="text-xl font-semibold">Templates & Reports</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { title: "Report Cards", description: "Individual student report card", icon: FileText },
            { title: "Class Results", description: "Consolidated class results", icon: FileSpreadsheet },
            { title: "Certificates", description: "Merit and achievement certificates", icon: BookOpen },
          ].map((item, index) => (
            <div key={index} className="glass rounded-xl p-4 hover:shadow-md hover:-translate-y-1 transition-all cursor-pointer">
              <div className="flex items-start gap-3 mb-2">
                <div className="p-2 rounded-full bg-primary/10">
                  <item.icon size={20} className="text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">{item.title}</h3>
                  <p className="text-sm text-foreground/60">{item.description}</p>
                </div>
              </div>
              <div className="flex justify-end mt-4">
                <button className="flex items-center gap-1 text-sm text-primary hover:underline">
                  <span>Download</span>
                  <ChevronDown size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Results;
