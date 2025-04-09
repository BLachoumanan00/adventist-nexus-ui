
import React, { useState } from 'react';
import { FileText, Download, Search, Filter, CheckCircle, Upload, Printer, FileBarChart, Award } from 'lucide-react';
import { useToast } from '../hooks/use-toast';
import { useActivityLogger } from '../hooks/useActivityLogger';

interface Student {
  id: string;
  name: string;
  grade: string;
  section: string;
  totalMarks: number;
  percentage: number;
  rank: number;
  overallGrade: string;
  generalRemarks: string;
  subjects: {
    name: string;
    marks: number;
    totalMarks: number;
    grade: string;
    remarks: string;
  }[];
}

const ResultGenerator: React.FC = () => {
  const [selectedGrade, setSelectedGrade] = useState('All');
  const [selectedSection, setSelectedSection] = useState('All');
  const [selectedExam, setSelectedExam] = useState('Term 1');
  const [searchTerm, setSearchTerm] = useState('');
  const [schoolLogo, setSchoolLogo] = useState<string | null>(null);
  const [signature, setSignature] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'results' | 'certificates' | 'reports'>('results');
  const { toast } = useToast();
  const { logActivity } = useActivityLogger();

  // Sample student data with general remarks added
  const [students, setStudents] = useState<Student[]>([
    {
      id: "ACM23001",
      name: "John Smith",
      grade: "10",
      section: "A",
      totalMarks: 420,
      percentage: 84,
      rank: 3,
      overallGrade: "B+",
      generalRemarks: "A good student who shows dedication in most subjects. Can improve with more focus.",
      subjects: [
        { name: "Mathematics", marks: 85, totalMarks: 100, grade: "B+", remarks: "Good problem-solving skills" },
        { name: "English", marks: 78, totalMarks: 100, grade: "B", remarks: "Writing needs improvement" },
        { name: "Science", marks: 92, totalMarks: 100, grade: "A", remarks: "Excellent understanding of concepts" },
        { name: "History", marks: 75, totalMarks: 100, grade: "B", remarks: "Average performance" },
        { name: "Computer Science", marks: 90, totalMarks: 100, grade: "A", remarks: "Shows great aptitude" }
      ]
    },
    {
      id: "ACM23015",
      name: "Emily Davis",
      grade: "10",
      section: "A",
      totalMarks: 441,
      percentage: 88.2,
      rank: 2,
      overallGrade: "A",
      generalRemarks: "An outstanding student with excellent academic performance. Continue the good work.",
      subjects: [
        { name: "Mathematics", marks: 90, totalMarks: 100, grade: "A", remarks: "Excellent analytical skills" },
        { name: "English", marks: 95, totalMarks: 100, grade: "A", remarks: "Exceptional writing and comprehension" },
        { name: "Science", marks: 88, totalMarks: 100, grade: "B+", remarks: "Good practical work" },
        { name: "History", marks: 78, totalMarks: 100, grade: "B", remarks: "Needs to improve on analysis" },
        { name: "Computer Science", marks: 90, totalMarks: 100, grade: "A", remarks: "Strong programming skills" }
      ]
    },
    {
      id: "ACM23022",
      name: "Michael Brown",
      grade: "10",
      section: "B",
      totalMarks: 362,
      percentage: 72.4,
      rank: 5,
      overallGrade: "B",
      generalRemarks: "Shows improvement but needs to work harder in weaker subjects. Participation in class is commendable.",
      subjects: [
        { name: "Mathematics", marks: 65, totalMarks: 100, grade: "C", remarks: "Needs more practice" },
        { name: "English", marks: 70, totalMarks: 100, grade: "C+", remarks: "Grammar needs improvement" },
        { name: "Science", marks: 72, totalMarks: 100, grade: "C+", remarks: "Should focus on theoretical concepts" },
        { name: "History", marks: 80, totalMarks: 100, grade: "B", remarks: "Good knowledge of events" },
        { name: "Computer Science", marks: 75, totalMarks: 100, grade: "B", remarks: "Average coding skills" }
      ]
    }
  ]);

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         student.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesGrade = selectedGrade === 'All' || student.grade === selectedGrade;
    const matchesSection = selectedSection === 'All' || student.section === selectedSection;
    
    return matchesSearch && matchesGrade && matchesSection;
  });

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setSchoolLogo(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSignatureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setSignature(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const generateResultSlip = (student: Student) => {
    toast({
      title: "Result Slip Generated",
      description: `Generated result slip for ${student.name}`
    });
    logActivity("Generated Result Slip", `For ${student.name} (${student.id})`);
  };

  const generateCertificate = (student: Student) => {
    toast({
      title: "Certificate Generated",
      description: `Generated certificate for ${student.name}`
    });
    logActivity("Generated Certificate", `For ${student.name} (${student.id})`);
  };

  const generateTermReport = (student: Student) => {
    toast({
      title: "Term Report Generated",
      description: `Generated term report for ${student.name}`
    });
    logActivity("Generated Term Report", `For ${student.name} (${student.id})`);
  };

  const generateAllResults = () => {
    toast({
      title: "Generating Results",
      description: `Generating result slips for ${filteredStudents.length} students`
    });
    logActivity("Generated All Results", `For ${selectedGrade === 'All' ? 'all grades' : 'Grade ' + selectedGrade}, ${selectedExam}`);
  };

  const generateAllCertificates = () => {
    toast({
      title: "Generating Certificates",
      description: `Generating certificates for ${filteredStudents.length} students`
    });
    logActivity("Generated All Certificates", `For ${selectedGrade === 'All' ? 'all grades' : 'Grade ' + selectedGrade}`);
  };

  const generateAllTermReports = () => {
    toast({
      title: "Generating Term Reports",
      description: `Generating term reports for ${filteredStudents.length} students`
    });
    logActivity("Generated All Term Reports", `For ${selectedGrade === 'All' ? 'all grades' : 'Grade ' + selectedGrade}, ${selectedExam}`);
  };

  const generateResultSheet = () => {
    toast({
      title: "Result Sheet Generated",
      description: `Generated consolidated result sheet for ${selectedGrade === 'All' ? 'all grades' : 'Grade ' + selectedGrade}, ${selectedExam}`
    });
    logActivity("Generated Result Sheet", `For ${selectedGrade === 'All' ? 'all grades' : 'Grade ' + selectedGrade}, ${selectedExam}`);
  };

  const getGradeColor = (grade: string) => {
    if (grade.includes('A')) return "text-green-600 dark:text-green-400";
    if (grade.includes('B')) return "text-blue-600 dark:text-blue-400";
    if (grade.includes('C')) return "text-yellow-600 dark:text-yellow-400";
    if (grade.includes('D')) return "text-orange-600 dark:text-orange-400";
    return "text-red-600 dark:text-red-400";
  };

  // Update student general remarks
  const updateGeneralRemarks = (studentId: string, remarks: string) => {
    setStudents(students.map(student => 
      student.id === studentId 
        ? {...student, generalRemarks: remarks} 
        : student
    ));
    
    toast({
      title: "Remarks Updated",
      description: `Updated general remarks for student ${studentId}`
    });
  };

  return (
    <div className="glass-card mb-6">
      <div className="flex items-center gap-3 mb-6">
        <FileText size={24} className="text-theme-purple" />
        <h2 className="text-xl font-semibold">Academic Reports Center</h2>
      </div>
      
      {/* Tabs for different document types */}
      <div className="flex border-b border-white/10 mb-4">
        <button
          onClick={() => setActiveTab('results')}
          className={`px-4 py-2 ${activeTab === 'results' 
            ? 'border-b-2 border-primary font-medium text-primary' 
            : 'text-foreground/70'}`}
        >
          <div className="flex items-center gap-2">
            <FileBarChart size={18} />
            <span>Result Slips</span>
          </div>
        </button>
        <button
          onClick={() => setActiveTab('reports')}
          className={`px-4 py-2 ${activeTab === 'reports' 
            ? 'border-b-2 border-primary font-medium text-primary' 
            : 'text-foreground/70'}`}
        >
          <div className="flex items-center gap-2">
            <FileText size={18} />
            <span>Term Reports</span>
          </div>
        </button>
        <button
          onClick={() => setActiveTab('certificates')}
          className={`px-4 py-2 ${activeTab === 'certificates' 
            ? 'border-b-2 border-primary font-medium text-primary' 
            : 'text-foreground/70'}`}
        >
          <div className="flex items-center gap-2">
            <Award size={18} />
            <span>Certificates</span>
          </div>
        </button>
      </div>
      
      <div className="glass rounded-xl p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm text-foreground/70 mb-1">Exam</label>
            <select
              value={selectedExam}
              onChange={(e) => setSelectedExam(e.target.value)}
              className="w-full rounded-lg glass border-none px-4 py-2"
            >
              <option>Term 1</option>
              <option>Term 2</option>
              <option>Term 3</option>
              <option>Final Exam</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm text-foreground/70 mb-1">Grade</label>
            <select
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(e.target.value)}
              className="w-full rounded-lg glass border-none px-4 py-2"
            >
              <option value="All">All Grades</option>
              <option value="7">Grade 7</option>
              <option value="8">Grade 8</option>
              <option value="9">Grade 9</option>
              <option value="10">Grade 10</option>
              <option value="11">Grade 11</option>
              <option value="12">Grade 12</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm text-foreground/70 mb-1">Section</label>
            <select
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
              className="w-full rounded-lg glass border-none px-4 py-2"
            >
              <option value="All">All Sections</option>
              <option value="A">Section A</option>
              <option value="B">Section B</option>
              <option value="C">Section C</option>
            </select>
          </div>
        </div>
        
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm text-foreground/70 mb-1">Search Student</label>
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
          
          <div>
            <label className="block text-sm text-foreground/70 mb-1">School Logo</label>
            <input 
              type="file"
              accept="image/*"
              onChange={handleLogoUpload}
              className="w-full text-sm text-foreground file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:glass file:text-sm hover:file:bg-primary/10"
            />
          </div>
          
          <div>
            <label className="block text-sm text-foreground/70 mb-1">Rector's Signature</label>
            <input 
              type="file"
              accept="image/*"
              onChange={handleSignatureUpload}
              className="w-full text-sm text-foreground file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:glass file:text-sm hover:file:bg-primary/10"
            />
          </div>
        </div>
        
        <div className="mt-4 flex justify-between items-center">
          <div className="text-sm text-foreground/60">
            Showing {filteredStudents.length} students
          </div>
          
          <div className="flex gap-2">
            {activeTab === 'results' && (
              <>
                <button 
                  onClick={generateResultSheet}
                  className="flex items-center gap-1 glass px-3 py-1.5 rounded-lg"
                >
                  <Download size={16} />
                  <span>Result Sheet</span>
                </button>
                
                <button
                  onClick={generateAllResults}
                  className="flex items-center gap-1 glass px-3 py-1.5 rounded-lg"
                >
                  <CheckCircle size={16} />
                  <span>Generate All</span>
                </button>
              </>
            )}
            
            {activeTab === 'reports' && (
              <button
                onClick={generateAllTermReports}
                className="flex items-center gap-1 glass px-3 py-1.5 rounded-lg"
              >
                <CheckCircle size={16} />
                <span>Generate All Reports</span>
              </button>
            )}
            
            {activeTab === 'certificates' && (
              <button
                onClick={generateAllCertificates}
                className="flex items-center gap-1 glass px-3 py-1.5 rounded-lg"
              >
                <CheckCircle size={16} />
                <span>Generate All Certificates</span>
              </button>
            )}
          </div>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10">
              <th className="pb-3 text-left font-medium text-foreground/70 text-sm">Student ID</th>
              <th className="pb-3 text-left font-medium text-foreground/70 text-sm">Name</th>
              <th className="pb-3 text-left font-medium text-foreground/70 text-sm">Grade & Section</th>
              {activeTab === 'results' && (
                <>
                  <th className="pb-3 text-center font-medium text-foreground/70 text-sm">Total Marks</th>
                  <th className="pb-3 text-center font-medium text-foreground/70 text-sm">Percentage</th>
                  <th className="pb-3 text-center font-medium text-foreground/70 text-sm">Rank</th>
                  <th className="pb-3 text-center font-medium text-foreground/70 text-sm">Grade</th>
                </>
              )}
              {activeTab !== 'results' && (
                <th className="pb-3 text-left font-medium text-foreground/70 text-sm">General Remarks</th>
              )}
              <th className="pb-3 text-center font-medium text-foreground/70 text-sm">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map((student) => (
              <tr key={student.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                <td className="py-3">{student.id}</td>
                <td className="py-3">{student.name}</td>
                <td className="py-3">Grade {student.grade} - {student.section}</td>
                
                {activeTab === 'results' && (
                  <>
                    <td className="py-3 text-center">{student.totalMarks}</td>
                    <td className="py-3 text-center">{student.percentage.toFixed(1)}%</td>
                    <td className="py-3 text-center">{student.rank}</td>
                    <td className="py-3 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getGradeColor(student.overallGrade)}`}>
                        {student.overallGrade}
                      </span>
                    </td>
                  </>
                )}
                
                {activeTab !== 'results' && (
                  <td className="py-3 max-w-xs">
                    <textarea
                      className="w-full glass rounded p-2 text-sm"
                      value={student.generalRemarks}
                      onChange={(e) => updateGeneralRemarks(student.id, e.target.value)}
                      rows={2}
                    />
                  </td>
                )}
                
                <td className="py-3">
                  <div className="flex justify-center gap-2">
                    {activeTab === 'results' && (
                      <button 
                        className="p-1.5 rounded-lg hover:bg-white/20 transition-colors"
                        onClick={() => generateResultSlip(student)}
                        title="Generate Result Slip"
                      >
                        <Printer size={16} className="text-foreground/70" />
                      </button>
                    )}
                    
                    {activeTab === 'reports' && (
                      <button 
                        className="p-1.5 rounded-lg hover:bg-white/20 transition-colors"
                        onClick={() => generateTermReport(student)}
                        title="Generate Term Report"
                      >
                        <FileText size={16} className="text-foreground/70" />
                      </button>
                    )}
                    
                    {activeTab === 'certificates' && (
                      <button 
                        className="p-1.5 rounded-lg hover:bg-white/20 transition-colors"
                        onClick={() => generateCertificate(student)}
                        title="Generate Certificate"
                      >
                        <Award size={16} className="text-foreground/70" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="mt-6 text-sm text-foreground/60">
        {activeTab === 'results' && "Note: Result slips will include school logo and rector's signature if uploaded."}
        {activeTab === 'reports' && "Note: Term reports include detailed academic performance and teacher's remarks."}
        {activeTab === 'certificates' && "Note: Certificates will include school logo, rector's signature and official school seal if uploaded."}
      </div>
    </div>
  );
};

export default ResultGenerator;
