import React, { useState, useEffect } from 'react';
import { FileText, Download, Search, Filter, CheckCircle, Upload, Printer, FileBarChart, Award, Save, Eye } from 'lucide-react';
import { useToast } from '../hooks/use-toast';
import { useActivityLogger } from '../hooks/useActivityLogger';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './ui/tabs';
import ResultSlipPreview from './previews/ResultSlipPreview';
import TermReportPreview from './previews/TermReportPreview';
import CertificatePreview from './previews/CertificatePreview';

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
  const [schoolName, setSchoolName] = useState('Adventist College');
  const [schoolAddress, setSchoolAddress] = useState('Royal Road, Rose Hill, Mauritius');
  const [activeTab, setActiveTab] = useState<'results' | 'certificates' | 'reports'>('results');
  const [bulkRemarks, setBulkRemarks] = useState('');
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);
  const [previewType, setPreviewType] = useState<'resultSlip' | 'termReport' | 'certificate' | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);
  const { toast } = useToast();
  const { logActivity } = useActivityLogger();
  
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [hasChanges, setHasChanges] = useState(false);

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

  useEffect(() => {
    const savedData = localStorage.getItem('studentResultsData');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        setStudents(parsedData.students || students);
        setSchoolLogo(parsedData.schoolLogo || null);
        setSignature(parsedData.signature || null);
        setSchoolName(parsedData.schoolName || 'Adventist College');
        setSchoolAddress(parsedData.schoolAddress || 'Royal Road, Rose Hill, Mauritius');
      } catch (error) {
        console.error('Error loading saved data:', error);
      }
    }
  }, []);

  useEffect(() => {
    if (!autoSaveEnabled || !hasChanges) return;
    
    const timer = setTimeout(() => {
      saveDataToLocalStorage();
      setLastSaved(new Date());
      setHasChanges(false);
      
      toast({
        title: "Data Autosaved",
        description: `All changes have been automatically saved at ${new Date().toLocaleTimeString()}`
      });
    }, 60000);
    
    return () => clearTimeout(timer);
  }, [students, schoolLogo, signature, schoolName, schoolAddress, hasChanges, autoSaveEnabled]);

  useEffect(() => {
    setHasChanges(true);
  }, [students, schoolLogo, signature, schoolName, schoolAddress]);

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
        setHasChanges(true);
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
        setHasChanges(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const generateResultSlip = (student: Student) => {
    setSelectedStudent(student);
    setPreviewType('resultSlip');
    
    toast({
      title: "Result Slip Generated",
      description: `Generated result slip for ${student.name}`
    });
    logActivity("Generated Result Slip", `For ${student.name} (${student.id})`);
  };

  const generateCertificate = (student: Student) => {
    setSelectedStudent(student);
    setPreviewType('certificate');
    
    toast({
      title: "Certificate Generated",
      description: `Generated certificate for ${student.name}`
    });
    logActivity("Generated Certificate", `For ${student.name} (${student.id})`);
  };

  const generateTermReport = (student: Student) => {
    setSelectedStudent(student);
    setPreviewType('termReport');
    
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

  const saveDataToLocalStorage = () => {
    const dataToSave = {
      students,
      schoolLogo,
      signature,
      schoolName,
      schoolAddress,
      savedAt: new Date().toISOString()
    };
    
    localStorage.setItem('studentResultsData', JSON.stringify(dataToSave));
    setLastSaved(new Date());
    setHasChanges(false);
  };

  const backupData = () => {
    const dataToBackup = {
      students,
      schoolLogo,
      signature,
      schoolName,
      schoolAddress,
      savedAt: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(dataToBackup);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `student-results-backup-${new Date().toISOString().slice(0,10)}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    toast({
      title: "Backup Created",
      description: "All data has been backed up to a local file."
    });
    logActivity("Created Data Backup", `Backup file: ${exportFileDefaultName}`);
  };

  const restoreFromBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsedData = JSON.parse(event.target?.result as string);
        
        if (parsedData.students && Array.isArray(parsedData.students)) {
          setStudents(parsedData.students);
          setSchoolLogo(parsedData.schoolLogo || null);
          setSignature(parsedData.signature || null);
          setSchoolName(parsedData.schoolName || 'Adventist College');
          setSchoolAddress(parsedData.schoolAddress || 'Royal Road, Rose Hill, Mauritius');
          
          toast({
            title: "Backup Restored",
            description: `Data restored from backup created on ${new Date(parsedData.savedAt).toLocaleString()}`
          });
          logActivity("Restored From Backup", `Backup date: ${new Date(parsedData.savedAt).toLocaleString()}`);
        } else {
          throw new Error("Invalid backup file format");
        }
      } catch (error) {
        console.error('Error restoring from backup:', error);
        toast({
          title: "Restore Failed",
          description: "The backup file format is invalid or corrupted.",
          variant: "destructive"
        });
      }
    };
    reader.readAsText(file);
  };

  const handleApplyBulkRemarks = () => {
    if (bulkRemarks.trim() === '' || selectedStudentIds.length === 0) return;
    
    const updatedStudents = students.map(student => 
      selectedStudentIds.includes(student.id) 
        ? {...student, generalRemarks: bulkRemarks} 
        : student
    );
    
    setStudents(updatedStudents);
    setHasChanges(true);
    
    toast({
      title: "Remarks Updated",
      description: `Updated general remarks for ${selectedStudentIds.length} students`
    });
    logActivity("Updated General Remarks", `For ${selectedStudentIds.length} students`);
    
    setBulkRemarks('');
    setSelectedStudentIds([]);
  };

  const toggleStudentSelection = (studentId: string) => {
    setSelectedStudentIds(prevIds => 
      prevIds.includes(studentId)
        ? prevIds.filter(id => id !== studentId)
        : [...prevIds, studentId]
    );
  };

  const selectAllFilteredStudents = () => {
    if (selectedStudentIds.length === filteredStudents.length) {
      setSelectedStudentIds([]);
    } else {
      setSelectedStudentIds(filteredStudents.map(student => student.id));
    }
  };

  const updateGeneralRemarks = (studentId: string, remarks: string) => {
    setStudents(students.map(student => 
      student.id === studentId 
        ? {...student, generalRemarks: remarks} 
        : student
    ));
    setHasChanges(true);
    
    toast({
      title: "Remarks Updated",
      description: `Updated general remarks for student ${studentId}`
    });
  };

  const getGradeColor = (grade: string) => {
    if (grade.includes('A')) return "text-green-600 dark:text-green-400";
    if (grade.includes('B')) return "text-blue-600 dark:text-blue-400";
    if (grade.includes('C')) return "text-yellow-600 dark:text-yellow-400";
    if (grade.includes('D')) return "text-orange-600 dark:text-orange-400";
    return "text-red-600 dark:text-red-400";
  };

  const closePreview = () => {
    setPreviewType(null);
    setSelectedStudent(null);
  };

  return (
    <div className="glass-card mb-6">
      <div className="flex items-center gap-3 mb-6">
        <FileText size={24} className="text-theme-purple" />
        <h2 className="text-xl font-semibold">Academic Reports Center</h2>
        
        <div className="ml-auto flex items-center gap-2">
          <button 
            onClick={saveDataToLocalStorage}
            className="flex items-center gap-1 glass px-3 py-1.5 rounded-lg"
            title="Save all data"
          >
            <Save size={16} />
            <span>Save</span>
          </button>
          
          <button 
            onClick={backupData}
            className="flex items-center gap-1 glass px-3 py-1.5 rounded-lg"
            title="Download backup file"
          >
            <Download size={16} />
            <span>Backup</span>
          </button>
          
          <label className="flex items-center gap-1 glass px-3 py-1.5 rounded-lg cursor-pointer">
            <Upload size={16} />
            <span>Restore</span>
            <input
              type="file"
              accept=".json"
              className="hidden"
              onChange={restoreFromBackup}
            />
          </label>
          
          <div className="flex items-center gap-2 glass px-3 py-1.5 rounded-lg">
            <input
              type="checkbox"
              id="autosave"
              checked={autoSaveEnabled}
              onChange={() => setAutoSaveEnabled(!autoSaveEnabled)}
              className="rounded"
            />
            <label htmlFor="autosave" className="text-sm">Autosave</label>
          </div>
        </div>
      </div>
      
      <div className="glass rounded-xl p-4 mb-6">
        <h3 className="text-lg font-medium mb-2">School Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm text-foreground/70 mb-1">School Name</label>
            <input
              type="text"
              value={schoolName}
              onChange={(e) => setSchoolName(e.target.value)}
              className="w-full rounded-lg glass border-none px-4 py-2"
            />
          </div>
          
          <div>
            <label className="block text-sm text-foreground/70 mb-1">School Address</label>
            <input
              type="text"
              value={schoolAddress}
              onChange={(e) => setSchoolAddress(e.target.value)}
              className="w-full rounded-lg glass border-none px-4 py-2"
            />
          </div>
          
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm text-foreground/70 mb-1">School Logo</label>
              <input 
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className="w-full text-sm text-foreground file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:glass file:text-sm hover:file:bg-primary/10"
              />
            </div>
            
            <div className="flex-1">
              <label className="block text-sm text-foreground/70 mb-1">Rector's Signature</label>
              <input 
                type="file"
                accept="image/*"
                onChange={handleSignatureUpload}
                className="w-full text-sm text-foreground file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:glass file:text-sm hover:file:bg-primary/10"
              />
            </div>
          </div>
        </div>
      </div>
      
      <Tabs defaultValue="results" className="mb-6" onValueChange={(value) => setActiveTab(value as any)}>
        <TabsList className="grid grid-cols-3">
          <TabsTrigger value="results" className="flex items-center gap-2">
            <FileBarChart size={18} />
            <span>Result Slips</span>
          </TabsTrigger>
          <TabsTrigger value="reports" className="flex items-center gap-2">
            <FileText size={18} />
            <span>Term Reports</span>
          </TabsTrigger>
          <TabsTrigger value="certificates" className="flex items-center gap-2">
            <Award size={18} />
            <span>Certificates</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="results" className="pt-4">
          <div className="glass rounded-xl p-4">
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
            
            <div className="mt-4 flex flex-col md:flex-row gap-4 items-start md:items-end">
              <div className="flex-grow">
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
              
              <div className="flex gap-2 flex-wrap">
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
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="reports" className="pt-4">
          <div className="glass rounded-xl p-4">
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
            
            <div className="mt-4 flex gap-4 items-end">
              <div className="flex-grow">
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
              
              <button
                onClick={generateAllTermReports}
                className="flex items-center gap-1 glass px-3 py-1.5 rounded-lg"
              >
                <CheckCircle size={16} />
                <span>Generate All Reports</span>
              </button>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="certificates" className="pt-4">
          <div className="glass rounded-xl p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm text-foreground/70 mb-1">Certificate Type</label>
                <select
                  className="w-full rounded-lg glass border-none px-4 py-2"
                >
                  <option>Academic Excellence</option>
                  <option>Outstanding Achievement</option>
                  <option>Appreciation</option>
                  <option>Completion</option>
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
            
            <div className="mt-4 flex gap-4 items-end">
              <div className="flex-grow">
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
              
              <button
                onClick={generateAllCertificates}
                className="flex items-center gap-1 glass px-3 py-1.5 rounded-lg"
              >
                <CheckCircle size={16} />
                <span>Generate All Certificates</span>
              </button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
      
      <div className="glass rounded-xl p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-end">
          <div className="flex-grow">
            <label className="block text-sm text-foreground/70 mb-1">Bulk Edit General Remarks</label>
            <textarea
              value={bulkRemarks}
              onChange={(e) => setBulkRemarks(e.target.value)}
              placeholder="Enter general remarks to apply to selected students..."
              className="w-full glass rounded-lg border-none p-2 min-h-[80px]"
            />
          </div>
          
          <div className="flex flex-col gap-2">
            <button
              onClick={handleApplyBulkRemarks}
              disabled={selectedStudentIds.length === 0 || bulkRemarks.trim() === ''}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg ${selectedStudentIds.length === 0 || bulkRemarks.trim() === '' ? 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed' : 'bg-primary text-white'}`}
            >
              <Save size={16} />
              <span>Apply to {selectedStudentIds.length} Selected</span>
            </button>
            
            <button
              onClick={selectAllFilteredStudents}
              className="flex items-center gap-1 glass px-3 py-1.5 rounded-lg"
            >
              <CheckCircle size={16} />
              <span>
                {selectedStudentIds.length === filteredStudents.length ? 'Unselect All' : 'Select All'}
              </span>
            </button>
          </div>
        </div>
        
        <div className="mt-2 text-sm text-foreground/60">
          {selectedStudentIds.length > 0 ? 
            `${selectedStudentIds.length} student(s) selected` : 
            "Select students from the table below to apply bulk remarks"}
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10">
              <th className="pb-3 text-left font-medium text-foreground/70 text-sm w-10">
                <input 
                  type="checkbox" 
                  checked={filteredStudents.length > 0 && selectedStudentIds.length === filteredStudents.length}
                  onChange={selectAllFilteredStudents}
                  className="rounded" 
                />
              </th>
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
              <th className="pb-3 text-left font-medium text-foreground/70 text-sm">General Remarks</th>
              <th className="pb-3 text-center font-medium text-foreground/70 text-sm">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map((student) => (
              <tr key={student.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                <td className="py-3">
                  <input 
                    type="checkbox" 
                    checked={selectedStudentIds.includes(student.id)}
                    onChange={() => toggleStudentSelection(student.id)}
                    className="rounded" 
                  />
                </td>
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
                
                <td className="py-3 max-w-xs">
                  <textarea
                    className="w-full glass rounded p-2 text-sm"
                    value={student.generalRemarks}
                    onChange={(e) => updateGeneralRemarks(student.id, e.target.value)}
                    rows={2}
                  />
                </td>
                
                <td className="py-3">
                  <div className="flex justify-center gap-2">
                    <button 
                      className="p-1.5 rounded-lg hover:bg-white/20 transition-colors"
                      title="View Preview"
                      onClick={() => {
                        setSelectedStudent(student);
                        if (activeTab === 'results') setPreviewType('resultSlip');
                        else if (activeTab === 'reports') setPreviewType('termReport');
                        else if (activeTab === 'certificates') setPreviewType('certificate');
                      }}
                    >
                      <Eye size={16} className="text-foreground/70" />
                    </button>
                    
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
        
        {autoSaveEnabled && lastSaved && !hasChanges && (
          <p className="mt-1">Last auto-saved at {lastSaved.toLocaleTimeString()}</p>
        )}
        
        {autoSaveEnabled && hasChanges && (
          <p className="mt-1">Changes will be auto-saved after 1 minute of inactivity</p>
        )}
      </div>
      
      {selectedStudent && previewType === 'resultSlip' && (
        <ResultSlipPreview
          student={selectedStudent}
          subjects={selectedStudent.subjects}
          schoolLogo={schoolLogo}
          signature={signature}
          schoolName={schoolName}
          schoolAddress={schoolAddress}
          examName={selectedExam}
          onClose={closePreview}
        />
      )}
      
      {selectedStudent && previewType === 'termReport' && (
        <TermReportPreview
          student={selectedStudent}
          subjects={selectedStudent.subjects}
          schoolLogo={schoolLogo}
          signature={signature}
          schoolName={schoolName}
          schoolAddress={schoolAddress}
          examName={selectedExam}
          onClose={closePreview}
        />
      )}
      
      {selectedStudent && previewType === 'certificate' && (
        <CertificatePreview
          student={selectedStudent}
          schoolLogo={schoolLogo}
          signature={signature}
          schoolName={schoolName}
          schoolAddress={schoolAddress}
          onClose={closePreview}
        />
      )}
    </div>
  );
};

export default ResultGenerator;
