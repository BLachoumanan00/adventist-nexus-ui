
import React, { useState } from "react";
import { Download, FileText, Search, Eye, Filter, FileBarChart } from "lucide-react";
import ResultPreview from "../components/ResultPreview";
import { useToast } from "../hooks/use-toast";

interface StudentResult {
  id: string;
  name: string;
  grade: string;
  section: string;
  subjects: {
    subject: string;
    marks: number;
    grade: string;
    remarks: string;
  }[];
  total: number;
  average: number;
  overallGrade: string;
}

const sampleStudents: StudentResult[] = [
  {
    id: "ACM23001",
    name: "John Smith",
    grade: "10",
    section: "A",
    subjects: [
      { subject: "Mathematics", marks: 85, grade: "B+", remarks: "Good performance" },
      { subject: "English", marks: 78, grade: "B", remarks: "Improving" },
      { subject: "Science", marks: 92, grade: "A", remarks: "Excellent work" },
      { subject: "History", marks: 70, grade: "C+", remarks: "Needs to focus more" },
      { subject: "Computer Science", marks: 88, grade: "B+", remarks: "Strong practical skills" },
    ],
    total: 413,
    average: 82.6,
    overallGrade: "B+"
  },
  {
    id: "ACM23015",
    name: "Emily Davis",
    grade: "10",
    section: "A",
    subjects: [
      { subject: "Mathematics", marks: 90, grade: "A", remarks: "Excellent" },
      { subject: "English", marks: 95, grade: "A", remarks: "Outstanding" },
      { subject: "Science", marks: 88, grade: "B+", remarks: "Very good" },
      { subject: "History", marks: 75, grade: "B", remarks: "Good effort" },
      { subject: "Computer Science", marks: 92, grade: "A", remarks: "Exceptional work" },
    ],
    total: 440,
    average: 88,
    overallGrade: "B+"
  },
  {
    id: "ACM23022",
    name: "Michael Brown",
    grade: "10",
    section: "B",
    subjects: [
      { subject: "Mathematics", marks: 65, grade: "C", remarks: "Needs improvement" },
      { subject: "English", marks: 70, grade: "C+", remarks: "Satisfactory" },
      { subject: "Science", marks: 72, grade: "C+", remarks: "Can do better" },
      { subject: "History", marks: 80, grade: "B", remarks: "Good knowledge" },
      { subject: "Computer Science", marks: 75, grade: "B", remarks: "Shows interest" },
    ],
    total: 362,
    average: 72.4,
    overallGrade: "C+"
  },
  {
    id: "ACM23036",
    name: "Sarah Johnson",
    grade: "10",
    section: "B",
    subjects: [
      { subject: "Mathematics", marks: 95, grade: "A", remarks: "Outstanding" },
      { subject: "English", marks: 88, grade: "B+", remarks: "Excellent writing skills" },
      { subject: "Science", marks: 93, grade: "A", remarks: "Top performer" },
      { subject: "History", marks: 85, grade: "B+", remarks: "Very good analysis" },
      { subject: "Computer Science", marks: 90, grade: "A", remarks: "Talented" },
    ],
    total: 451,
    average: 90.2,
    overallGrade: "A"
  },
  {
    id: "ACM23044",
    name: "Robert Wilson",
    grade: "10",
    section: "C",
    subjects: [
      { subject: "Mathematics", marks: 35, grade: "F", remarks: "Needs significant improvement" },
      { subject: "English", marks: 50, grade: "D", remarks: "More practice needed" },
      { subject: "Science", marks: 45, grade: "D", remarks: "Struggling with concepts" },
      { subject: "History", marks: 60, grade: "C", remarks: "Average performance" },
      { subject: "Computer Science", marks: 55, grade: "D", remarks: "Requires assistance" },
    ],
    total: 245,
    average: 49,
    overallGrade: "D"
  },
  // Adding Grade 7 students
  {
    id: "ACM23101",
    name: "Emma Thompson",
    grade: "7",
    section: "A",
    subjects: [
      { subject: "Mathematics", marks: 88, grade: "B+", remarks: "Shows good aptitude" },
      { subject: "English", marks: 92, grade: "A", remarks: "Excellent communication" },
      { subject: "Science", marks: 85, grade: "B+", remarks: "Good understanding" },
      { subject: "History", marks: 78, grade: "B", remarks: "Strong historical knowledge" },
      { subject: "Computer Science", marks: 90, grade: "A", remarks: "Naturally talented" },
    ],
    total: 433,
    average: 86.6,
    overallGrade: "B+"
  },
  {
    id: "ACM23102",
    name: "James Wilson",
    grade: "7",
    section: "A",
    subjects: [
      { subject: "Mathematics", marks: 75, grade: "B", remarks: "Good progress" },
      { subject: "English", marks: 80, grade: "B", remarks: "Consistent effort" },
      { subject: "Science", marks: 82, grade: "B", remarks: "Shows interest" },
      { subject: "History", marks: 70, grade: "C+", remarks: "More focus needed" },
      { subject: "Computer Science", marks: 85, grade: "B+", remarks: "Good practical skills" },
    ],
    total: 392,
    average: 78.4,
    overallGrade: "B"
  }
];

const Results: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('All');
  const [selectedSection, setSelectedSection] = useState('All');
  const [selectedStudent, setSelectedStudent] = useState<StudentResult | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const { toast } = useToast();
  
  const filteredStudents = sampleStudents.filter(student => {
    const matchesSearch = 
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesGrade = selectedGrade === 'All' || student.grade === selectedGrade;
    const matchesSection = selectedSection === 'All' || student.section === selectedSection;
    
    return matchesSearch && matchesGrade && matchesSection;
  });
  
  const openPreview = (student: StudentResult) => {
    setSelectedStudent(student);
    setShowPreview(true);
  };
  
  const closePreview = () => {
    setShowPreview(false);
  };

  const generateBulkResults = () => {
    // In a real application, this would generate PDFs and create a zip file
    // For now, we'll just simulate it
    const studentsToGenerate = selectedGrade === 'All' ? filteredStudents : 
      filteredStudents.filter(s => s.grade === selectedGrade);

    toast({
      title: "Results Generated",
      description: `Generated ${studentsToGenerate.length} result slips for ${selectedGrade === 'All' ? 'all grades' : 'Grade ' + selectedGrade}`
    });
  };

  const generateBulkReports = () => {
    // In a real application, this would generate PDFs and create a zip file
    // For now, we'll just simulate it
    const studentsToGenerate = selectedGrade === 'All' ? filteredStudents : 
      filteredStudents.filter(s => s.grade === selectedGrade);

    toast({
      title: "Reports Generated",
      description: `Generated ${studentsToGenerate.length} term reports for ${selectedGrade === 'All' ? 'all grades' : 'Grade ' + selectedGrade}`
    });
  };

  const uniqueGrades = ['All', ...new Set(sampleStudents.map(student => student.grade))].sort();
  const uniqueSections = ['All', ...new Set(sampleStudents.map(student => student.section))].sort();

  return (
    <div className="animate-fade-in">
      <div className="glass-card mb-6">
        <div className="flex items-center gap-3 mb-6">
          <FileText size={24} className="text-theme-purple" />
          <h2 className="text-xl font-semibold">Results Generator</h2>
        </div>
        
        <div className="glass rounded-xl p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by name or ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-lg glass border-none focus:ring-2 ring-primary/30 outline-none"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/50" size={16} />
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="w-40">
                <select
                  value={selectedGrade}
                  onChange={(e) => setSelectedGrade(e.target.value)}
                  className="w-full rounded-lg glass border-none px-4 py-2"
                >
                  {uniqueGrades.map(grade => (
                    <option key={grade} value={grade}>{grade === 'All' ? 'All Grades' : `Grade ${grade}`}</option>
                  ))}
                </select>
              </div>
              
              <div className="w-40">
                <select
                  value={selectedSection}
                  onChange={(e) => setSelectedSection(e.target.value)}
                  className="w-full rounded-lg glass border-none px-4 py-2"
                >
                  {uniqueSections.map(section => (
                    <option key={section} value={section}>{section === 'All' ? 'All Sections' : `Section ${section}`}</option>
                  ))}
                </select>
              </div>
              
              <button className="flex items-center gap-2 glass px-3 py-1.5 rounded-lg">
                <Filter size={16} />
                <span>More Filters</span>
              </button>
            </div>
          </div>
          
          <div className="text-sm text-foreground/60">
            Showing {filteredStudents.length} students
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="pb-3 text-left font-medium text-foreground/70 text-sm">Student ID</th>
                <th className="pb-3 text-left font-medium text-foreground/70 text-sm">Name</th>
                <th className="pb-3 text-left font-medium text-foreground/70 text-sm">Grade</th>
                <th className="pb-3 text-left font-medium text-foreground/70 text-sm">Section</th>
                <th className="pb-3 text-center font-medium text-foreground/70 text-sm">Total</th>
                <th className="pb-3 text-center font-medium text-foreground/70 text-sm">Average</th>
                <th className="pb-3 text-center font-medium text-foreground/70 text-sm">Grade</th>
                <th className="pb-3 text-center font-medium text-foreground/70 text-sm">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student) => (
                <tr key={student.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="py-3">{student.id}</td>
                  <td className="py-3">{student.name}</td>
                  <td className="py-3">{student.grade}</td>
                  <td className="py-3">{student.section}</td>
                  <td className="py-3 text-center">{student.total}</td>
                  <td className="py-3 text-center">{student.average.toFixed(1)}</td>
                  <td className="py-3 text-center">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      student.overallGrade === "A" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" :
                      student.overallGrade.includes("B") ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" :
                      student.overallGrade.includes("C") ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400" :
                      student.overallGrade === "D" ? "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400" :
                      "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                    }`}>
                      {student.overallGrade}
                    </span>
                  </td>
                  <td className="py-3">
                    <div className="flex justify-center gap-2">
                      <button 
                        className="p-1.5 rounded-lg hover:bg-white/20 transition-colors"
                        onClick={() => openPreview(student)}
                      >
                        <Eye size={16} className="text-foreground/70" />
                      </button>
                      <button className="p-1.5 rounded-lg hover:bg-white/20 transition-colors">
                        <Download size={16} className="text-foreground/70" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="mt-6 flex flex-wrap gap-4 justify-end">
          <button 
            className="btn-primary flex items-center gap-2"
            onClick={generateBulkResults}
          >
            <Download size={18} />
            <span>Generate Result Slips</span>
          </button>
          
          <button 
            className="glass hover:bg-white/20 transition-colors px-4 py-2 rounded-lg flex items-center gap-2"
            onClick={generateBulkReports}
          >
            <FileBarChart size={18} />
            <span>Generate Term Reports</span>
          </button>
        </div>
      </div>
      
      {showPreview && selectedStudent && (
        <ResultPreview 
          student={{
            name: selectedStudent.name,
            id: selectedStudent.id,
            grade: selectedStudent.grade,
            section: selectedStudent.section
          }}
          results={selectedStudent.subjects}
          onClose={closePreview}
        />
      )}
    </div>
  );
};

export default Results;
