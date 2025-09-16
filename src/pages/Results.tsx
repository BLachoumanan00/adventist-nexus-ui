import React, { useState, useEffect } from "react";
import { Download, FileText, Search, Eye, Filter, FileBarChart } from "lucide-react";
import ResultPreview from "../components/ResultPreview";
import { useToast } from "../hooks/use-toast";
import ResultSlipPreview from "../components/previews/ResultSlipPreview";
import TermReportPreview from "../components/previews/TermReportPreview";

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
  rank?: number; // Added rank property
  selectedSubjects?: string[]; // New property to track selected subjects
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
  const [showResultSlip, setShowResultSlip] = useState(false);
  const [showTermReport, setShowTermReport] = useState(false);
  const [allSubjects, setAllSubjects] = useState<string[]>([]);
  const { toast } = useToast();
  
  // Extract all unique subjects on component mount
  useEffect(() => {
    const subjects = new Set<string>();
    sampleStudents.forEach(student => {
      student.subjects.forEach(subject => {
        subjects.add(subject.subject);
      });
    });
    setAllSubjects(Array.from(subjects));
    
    // Initialize selectedSubjects for each student if not already present
    const updatedStudents = sampleStudents.map(student => {
      if (!student.selectedSubjects) {
        return {
          ...student,
          selectedSubjects: student.subjects.map(s => s.subject)
        };
      }
      return student;
    });
    
    // Update the students
    // Note: We're not actually modifying sampleStudents since it's a constant,
    // but in a real app you would update your state or database
  }, []);
  
  // Calculate ranks for each grade and section
  useEffect(() => {
    // Group students by grade and section
    const gradeSectionGroups: {[key: string]: StudentResult[]} = {};
    
    sampleStudents.forEach(student => {
      const key = `${student.grade}-${student.section}`;
      if (!gradeSectionGroups[key]) {
        gradeSectionGroups[key] = [];
      }
      gradeSectionGroups[key].push(student);
    });
    
    // Sort each group by average and assign ranks
    Object.values(gradeSectionGroups).forEach(students => {
      // Sort by average in descending order
      students.sort((a, b) => b.average - a.average);
      
      // Assign ranks
      students.forEach((student, index) => {
        student.rank = index + 1;
      });
    });
  }, []);
  
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

  const openResultSlip = (student: StudentResult) => {
    setSelectedStudent(student);
    setShowResultSlip(true);
  };

  const closeResultSlip = () => {
    setShowResultSlip(false);
  };

  const openTermReport = (student: StudentResult) => {
    setSelectedStudent(student);
    setShowTermReport(true);
  };

  const closeTermReport = () => {
    setShowTermReport(false);
  };

  // Function to handle subject selection changes
  const handleSubjectsChange = (studentId: string, subjects: string[]) => {
    const updatedStudent = sampleStudents.find(s => s.id === studentId);
    if (updatedStudent) {
      updatedStudent.selectedSubjects = subjects;
      
      // Force re-render by updating the selected student if it's the one being edited
      if (selectedStudent && selectedStudent.id === studentId) {
        setSelectedStudent({...updatedStudent});
      }
      
      // In a real app, you would save this to your database
      toast({
        title: "Subjects Updated",
        description: `Updated subject selection for ${updatedStudent.name}`
      });
    }
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
          <div className="flex flex-col gap-4 mb-4">
            <div className="w-full">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by name or ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 text-base rounded-lg glass border-none focus:ring-2 ring-primary/30 outline-none touch-manipulation"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/50" size={18} />
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 min-w-0">
                <select
                  value={selectedGrade}
                  onChange={(e) => setSelectedGrade(e.target.value)}
                  className="w-full rounded-lg glass border-none px-4 py-3 text-base touch-manipulation"
                >
                  {uniqueGrades.map(grade => (
                    <option key={grade} value={grade}>{grade === 'All' ? 'All Grades' : `Grade ${grade}`}</option>
                  ))}
                </select>
              </div>
              
              <div className="flex-1 min-w-0">
                <select
                  value={selectedSection}
                  onChange={(e) => setSelectedSection(e.target.value)}
                  className="w-full rounded-lg glass border-none px-4 py-3 text-base touch-manipulation"
                >
                  {uniqueSections.map(section => (
                    <option key={section} value={section}>{section === 'All' ? 'All Sections' : `Section ${section}`}</option>
                  ))}
                </select>
              </div>
              
              <button className="flex items-center justify-center gap-2 glass px-4 py-3 rounded-lg touch-manipulation hover:bg-white/10 transition-colors min-h-[48px]">
                <Filter size={18} />
                <span className="hidden sm:inline">More Filters</span>
                <span className="sm:hidden">Filters</span>
              </button>
            </div>
          </div>
          
          <div className="text-sm text-foreground/60">
            Showing {filteredStudents.length} students
          </div>
        </div>
        
        {/* Desktop Table */}
        <div className="hidden lg:block overflow-x-auto">
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
                <th className="pb-3 text-center font-medium text-foreground/70 text-sm">Rank</th>
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
                  <td className="py-3 text-center">
                    {student.rank && (
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400">
                        {student.rank}
                      </span>
                    )}
                  </td>
                  <td className="py-3">
                    <div className="flex justify-center gap-2">
                      <button 
                        className="p-2 rounded-lg hover:bg-white/20 transition-colors touch-manipulation"
                        onClick={() => openPreview(student)}
                        title="View details"
                      >
                        <Eye size={16} className="text-foreground/70" />
                      </button>
                      <button 
                        className="p-2 rounded-lg hover:bg-white/20 transition-colors touch-manipulation"
                        onClick={() => openResultSlip(student)}
                        title="Result slip"
                      >
                        <FileText size={16} className="text-foreground/70" />
                      </button>
                      <button 
                        className="p-2 rounded-lg hover:bg-white/20 transition-colors touch-manipulation"
                        onClick={() => openTermReport(student)}
                        title="Term report"
                      >
                        <FileBarChart size={16} className="text-foreground/70" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Mobile/Tablet Card Layout */}
        <div className="block lg:hidden space-y-4">
          {filteredStudents.map((student) => (
            <div key={student.id} className="glass rounded-lg p-4">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{student.name}</h3>
                  <p className="text-sm text-foreground/60">{student.id}</p>
                  <p className="text-sm text-foreground/60">Grade {student.grade} - Section {student.section}</p>
                </div>
                <div className="text-right">
                  {student.rank && (
                    <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 mb-2">
                      Rank {student.rank}
                    </span>
                  )}
                  <div>
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                      student.overallGrade === "A" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" :
                      student.overallGrade.includes("B") ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" :
                      student.overallGrade.includes("C") ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400" :
                      student.overallGrade === "D" ? "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400" :
                      "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                    }`}>
                      {student.overallGrade}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4 p-3 bg-white/5 dark:bg-black/20 rounded-lg">
                <div className="text-center">
                  <div className="text-sm text-foreground/60">Total</div>
                  <div className="text-lg font-semibold">{student.total}</div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-foreground/60">Average</div>
                  <div className="text-lg font-semibold">{student.average.toFixed(1)}</div>
                </div>
              </div>
              
              <div className="flex gap-2">
                <button 
                  className="flex-1 flex items-center justify-center gap-2 glass px-3 py-3 rounded-lg hover:bg-white/10 transition-colors touch-manipulation"
                  onClick={() => openPreview(student)}
                >
                  <Eye size={18} />
                  <span>View</span>
                </button>
                <button 
                  className="flex-1 flex items-center justify-center gap-2 glass px-3 py-3 rounded-lg hover:bg-white/10 transition-colors touch-manipulation"
                  onClick={() => openResultSlip(student)}
                >
                  <FileText size={18} />
                  <span>Result</span>
                </button>
                <button 
                  className="flex-1 flex items-center justify-center gap-2 glass px-3 py-3 rounded-lg hover:bg-white/10 transition-colors touch-manipulation"
                  onClick={() => openTermReport(student)}
                >
                  <FileBarChart size={18} />
                  <span>Report</span>
                </button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 flex flex-col sm:flex-row gap-4">
          <button 
            className="bg-primary text-primary-foreground px-6 py-3 rounded-lg flex items-center justify-center gap-2 touch-manipulation hover:opacity-90 transition-opacity min-h-[48px] flex-1 sm:flex-initial"
            onClick={generateBulkResults}
          >
            <Download size={20} />
            <span>Generate Result Slips</span>
          </button>
          
          <button 
            className="glass hover:bg-white/10 transition-colors px-6 py-3 rounded-lg flex items-center justify-center gap-2 touch-manipulation min-h-[48px] flex-1 sm:flex-initial"
            onClick={generateBulkReports}
          >
            <FileBarChart size={20} />
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
          availableSubjects={allSubjects}
          selectedSubjects={selectedStudent.selectedSubjects || selectedStudent.subjects.map(s => s.subject)}
          onSubjectsChange={(subjects) => handleSubjectsChange(selectedStudent.id, subjects)}
          onClose={closePreview}
        />
      )}
      
      {showResultSlip && selectedStudent && (
        <ResultSlipPreview 
          student={{
            id: selectedStudent.id,
            name: selectedStudent.name,
            grade: selectedStudent.grade,
            section: selectedStudent.section,
            totalMarks: selectedStudent.total,
            percentage: selectedStudent.average,
            rank: selectedStudent.rank || 0,
            overallGrade: selectedStudent.overallGrade,
            generalRemarks: selectedStudent.average > 80 
              ? "Excellent performance overall. Keep up the good work!" 
              : selectedStudent.average > 70 
              ? "Good performance. Continue to work on improvement."
              : selectedStudent.average > 60
              ? "Satisfactory performance. More focus needed in weaker subjects."
              : "Needs improvement. Extra attention and guidance required."
          }}
          subjects={selectedStudent.selectedSubjects 
            ? selectedStudent.subjects
                .filter(subject => selectedStudent.selectedSubjects?.includes(subject.subject))
                .map(subject => ({
                  subject: subject.subject,
                  marks: subject.marks,
                  totalMarks: 100,
                  grade: subject.grade,
                  remarks: subject.remarks
                }))
            : selectedStudent.subjects.map(subject => ({
                subject: subject.subject,
                marks: subject.marks,
                totalMarks: 100,
                grade: subject.grade,
                remarks: subject.remarks
              }))
          }
          examName="Term 1 Examination 2025"
          daysAbsent={Math.floor(Math.random() * 5)}
          onClose={closeResultSlip}
        />
      )}
      
      {showTermReport && selectedStudent && (
        <TermReportPreview 
          student={{
            id: selectedStudent.id,
            name: selectedStudent.name,
            grade: selectedStudent.grade,
            section: selectedStudent.section,
            totalMarks: selectedStudent.total,
            percentage: selectedStudent.average,
            rank: selectedStudent.rank || 0,
            overallGrade: selectedStudent.overallGrade,
            generalRemarks: selectedStudent.average > 80 
              ? "Excellent performance overall. Keep up the good work!" 
              : selectedStudent.average > 70 
              ? "Good performance. Continue to work on improvement."
              : selectedStudent.average > 60
              ? "Satisfactory performance. More focus needed in weaker subjects."
              : "Needs improvement. Extra attention and guidance required."
          }}
          subjects={selectedStudent.selectedSubjects 
            ? selectedStudent.subjects
                .filter(subject => selectedStudent.selectedSubjects?.includes(subject.subject))
                .map(subject => ({
                  subject: subject.subject,
                  marks: subject.marks,
                  totalMarks: 100,
                  grade: subject.grade,
                  remarks: subject.remarks
                }))
            : selectedStudent.subjects.map(subject => ({
                subject: subject.subject,
                marks: subject.marks,
                totalMarks: 100,
                grade: subject.grade,
                remarks: subject.remarks
              }))
          }
          examName="Term 1 Examination 2025"
          daysAbsent={Math.floor(Math.random() * 5)}
          onClose={closeTermReport}
        />
      )}
    </div>
  );
};

export default Results;
