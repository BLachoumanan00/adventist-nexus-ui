
import React, { useState, useEffect } from "react";
import {
  Download,
  FileText,
  Save,
  Printer,
  BadgeCheck,
  Plus,
  Trash2,
  FileUp,
  Settings
} from "lucide-react";
import ResultSlipPreview from "./previews/ResultSlipPreview";
import TermReportPreview from "./previews/TermReportPreview";
import { useToast } from "../hooks/use-toast";
import { useActivityLogger } from "../hooks/useActivityLogger";

interface Subject {
  subject: string;
  marks: number;
  totalMarks: number;
  grade: string;
  remarks: string;
}

interface Student {
  id: string;
  name: string;
  grade: string;
  term: string;
  year: string;
  subjects: Subject[];
  totalMarks: number;
  averagePercentage: number;
  overallGrade: string;
  position: string;
  teacherRemarks: string;
  principalRemarks: string;
  attendance: {
    present: number;
    total: number;
  };
}

interface School {
  name: string;
  logo: string | null;
  address: string;
  email: string;
  phone: string;
  website: string;
  principalName: string;
  principalSignature: string | null;
}

const ResultGenerator: React.FC = () => {
  const { toast } = useToast();
  const { logActivity } = useActivityLogger();
  
  const [editMode, setEditMode] = useState(true);
  const [previewMode, setPreviewMode] = useState<'slip' | 'report'>('slip');
  const [schoolDetails, setSchoolDetails] = useState<School>({
    name: "Sunshine International School",
    logo: null,
    address: "123 Education Lane, Academic City",
    email: "info@sunshine.edu",
    phone: "+1 (555) 123-4567",
    website: "www.sunshine.edu",
    principalName: "Dr. Jane Smith",
    principalSignature: null
  });
  
  const [viewMode, setViewMode] = useState<'single' | 'bulk'>('single');
  const [bulkRemarks, setBulkRemarks] = useState({
    teacher: "",
    principal: ""
  });
  
  // New state for available subject templates with total marks option
  const [subjectTemplates, setSubjectTemplates] = useState([
    { name: "Mathematics", totalMarks: 100 },
    { name: "English", totalMarks: 100 },
    { name: "Science", totalMarks: 100 },
    { name: "Social Studies", totalMarks: 100 },
    { name: "Art", totalMarks: 50 },
    { name: "Physical Education", totalMarks: 50 },
    { name: "Computer Science", totalMarks: 100 },
    { name: "Music", totalMarks: 50 },
  ]);
  
  // New state for managing a new subject template
  const [newSubjectTemplate, setNewSubjectTemplate] = useState({ 
    name: "", 
    totalMarks: 100 
  });
  
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedTotalMarks, setSelectedTotalMarks] = useState(100);
  
  const [student, setStudent] = useState<Student>({
    id: "STD" + Math.floor(1000 + Math.random() * 9000),
    name: "",
    grade: "",
    term: "",
    year: new Date().getFullYear().toString(),
    subjects: [],
    totalMarks: 0,
    averagePercentage: 0,
    overallGrade: "",
    position: "",
    teacherRemarks: "",
    principalRemarks: "",
    attendance: {
      present: 0,
      total: 0,
    }
  });
  
  const [students, setStudents] = useState<Student[]>([]);
  const [currentSubject, setCurrentSubject] = useState<{
    subject: string;
    marks: number;
    totalMarks: number;
  }>({ subject: "", marks: 0, totalMarks: 100 });
  
  const [schoolLogoFile, setSchoolLogoFile] = useState<File | null>(null);
  const [principalSignatureFile, setPrincipalSignatureFile] = useState<File | null>(null);
  
  // Load saved data from localStorage
  useEffect(() => {
    const savedSchoolData = localStorage.getItem('schoolDetails');
    const savedStudents = localStorage.getItem('resultStudents');
    const savedSubjectTemplates = localStorage.getItem('subjectTemplates');
    
    if (savedSchoolData) {
      setSchoolDetails(JSON.parse(savedSchoolData));
    }
    
    if (savedStudents) {
      setStudents(JSON.parse(savedStudents));
    }
    
    if (savedSubjectTemplates) {
      setSubjectTemplates(JSON.parse(savedSubjectTemplates));
    }
  }, []);
  
  // Save data to localStorage
  const saveToLocalStorage = () => {
    localStorage.setItem('schoolDetails', JSON.stringify(schoolDetails));
    localStorage.setItem('resultStudents', JSON.stringify(students));
    localStorage.setItem('subjectTemplates', JSON.stringify(subjectTemplates));
  };
  
  useEffect(() => {
    calculateTotals();
  }, [student.subjects]);
  
  const calculateGrade = (percentage: number) => {
    if (percentage >= 90) return "A+";
    if (percentage >= 80) return "A";
    if (percentage >= 70) return "B";
    if (percentage >= 60) return "C";
    if (percentage >= 50) return "D";
    return "F";
  };
  
  const calculateRemark = (grade: string) => {
    switch (grade) {
      case "A+": return "Outstanding";
      case "A": return "Excellent";
      case "B": return "Very Good";
      case "C": return "Good";
      case "D": return "Satisfactory";
      default: return "Needs Improvement";
    }
  };
  
  const calculateTotals = () => {
    if (student.subjects.length === 0) return;
    
    let totalMarks = 0;
    let totalMaxMarks = 0;
    
    student.subjects.forEach(subj => {
      totalMarks += subj.marks;
      totalMaxMarks += subj.totalMarks;
    });
    
    const averagePercentage = (totalMarks / totalMaxMarks) * 100;
    const overallGrade = calculateGrade(averagePercentage);
    
    setStudent(prev => ({
      ...prev,
      totalMarks,
      averagePercentage,
      overallGrade
    }));
  };
  
  const addSubject = () => {
    if (!currentSubject.subject) {
      toast({
        title: "Missing Information",
        description: "Please select a subject.",
        variant: "destructive"
      });
      return;
    }
    
    // Check if the subject already exists
    const exists = student.subjects.some(s => s.subject === currentSubject.subject);
    if (exists) {
      toast({
        title: "Duplicate Subject",
        description: "This subject has already been added.",
        variant: "destructive"
      });
      return;
    }
    
    // Calculate percentage based on the current subject's total marks
    const percentage = (currentSubject.marks / currentSubject.totalMarks) * 100;
    const grade = calculateGrade(percentage);
    
    const newSubject: Subject = {
      subject: currentSubject.subject,
      marks: currentSubject.marks,
      totalMarks: currentSubject.totalMarks,
      grade: grade,
      remarks: calculateRemark(grade)
    };
    
    setStudent(prev => ({
      ...prev,
      subjects: [...prev.subjects, newSubject]
    }));
    
    setCurrentSubject({ subject: "", marks: 0, totalMarks: 100 });
    setSelectedSubject("");
  };
  
  const removeSubject = (index: number) => {
    setStudent(prev => ({
      ...prev,
      subjects: prev.subjects.filter((_, i) => i !== index)
    }));
  };
  
  const saveResult = () => {
    if (!student.name || !student.grade || !student.term) {
      toast({
        title: "Missing Information",
        description: "Please fill all required fields.",
        variant: "destructive"
      });
      return;
    }
    
    if (student.subjects.length === 0) {
      toast({
        title: "No Subjects Added",
        description: "Please add at least one subject.",
        variant: "destructive"
      });
      return;
    }
    
    const updatedStudent = { ...student };
    
    // For new students
    if (!students.some(s => s.id === student.id)) {
      setStudents(prev => [...prev, updatedStudent]);
    } else {
      // For existing students
      setStudents(prev => prev.map(s => s.id === student.id ? updatedStudent : s));
    }
    
    saveToLocalStorage();
    setEditMode(false);
    
    toast({
      title: "Result Saved",
      description: `Result for ${student.name} has been saved successfully.`
    });
    
    logActivity("Result Generated", `Created/updated result for ${student.name}, Grade ${student.grade}`);
  };
  
  const clearForm = () => {
    setStudent({
      id: "STD" + Math.floor(1000 + Math.random() * 9000),
      name: "",
      grade: "",
      term: "",
      year: new Date().getFullYear().toString(),
      subjects: [],
      totalMarks: 0,
      averagePercentage: 0,
      overallGrade: "",
      position: "",
      teacherRemarks: "",
      principalRemarks: "",
      attendance: {
        present: 0,
        total: 0,
      }
    });
    setEditMode(true);
  };
  
  const loadStudent = (id: string) => {
    const selectedStudent = students.find(s => s.id === id);
    if (selectedStudent) {
      setStudent(selectedStudent);
      setEditMode(true);
    }
  };
  
  const updateSchoolLogo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Convert to base64 for storage
    const reader = new FileReader();
    reader.onload = (event) => {
      setSchoolDetails(prev => ({
        ...prev,
        logo: event.target?.result as string
      }));
      setSchoolLogoFile(file);
    };
    reader.readAsDataURL(file);
    
    toast({
      title: "Logo Updated",
      description: "School logo has been updated successfully."
    });
    
    logActivity("Updated School Logo", "Changed the school logo in Result Generator");
  };
  
  const updatePrincipalSignature = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Convert to base64 for storage
    const reader = new FileReader();
    reader.onload = (event) => {
      setSchoolDetails(prev => ({
        ...prev,
        principalSignature: event.target?.result as string
      }));
      setPrincipalSignatureFile(file);
    };
    reader.readAsDataURL(file);
    
    toast({
      title: "Signature Updated",
      description: "Principal's signature has been updated successfully."
    });
    
    logActivity("Updated Principal Signature", "Changed the principal's signature in Result Generator");
  };
  
  const applyBulkRemarks = () => {
    if (viewMode !== 'bulk') return;
    
    // Update current student
    setStudent(prev => ({
      ...prev,
      teacherRemarks: bulkRemarks.teacher || prev.teacherRemarks,
      principalRemarks: bulkRemarks.principal || prev.principalRemarks
    }));
    
    toast({
      title: "Bulk Remarks Applied",
      description: "Remarks have been applied to the current result."
    });
  };
  
  const downloadResult = () => {
    // This would be implemented to download the result as PDF
    toast({
      title: "Download Started",
      description: `Downloading result for ${student.name}.`
    });
    logActivity("Downloaded Result", `Downloaded ${previewMode === 'slip' ? 'Result Slip' : 'Term Report'} for ${student.name}`);
  };
  
  const printResult = () => {
    // This would trigger the print dialog
    window.print();
    logActivity("Printed Result", `Printed ${previewMode === 'slip' ? 'Result Slip' : 'Term Report'} for ${student.name}`);
  };
  
  const addSubjectTemplate = () => {
    if (!newSubjectTemplate.name) {
      toast({
        title: "Missing Information",
        description: "Please enter a subject name.",
        variant: "destructive"
      });
      return;
    }
    
    // Check if subject already exists
    if (subjectTemplates.some(t => t.name.toLowerCase() === newSubjectTemplate.name.toLowerCase())) {
      toast({
        title: "Duplicate Subject",
        description: "This subject already exists in the templates.",
        variant: "destructive"
      });
      return;
    }
    
    setSubjectTemplates(prev => [...prev, { ...newSubjectTemplate }]);
    setNewSubjectTemplate({ name: "", totalMarks: 100 });
    
    toast({
      title: "Subject Added",
      description: `${newSubjectTemplate.name} has been added to the templates.`
    });
    
    // Save to localStorage
    localStorage.setItem('subjectTemplates', JSON.stringify([...subjectTemplates, newSubjectTemplate]));
  };

  const handleSubjectSelection = (subject: string) => {
    setSelectedSubject(subject);
    
    // Find the total marks for this subject from templates
    const template = subjectTemplates.find(t => t.name === subject);
    const totalMarks = template ? template.totalMarks : 100;
    
    setSelectedTotalMarks(totalMarks);
    setCurrentSubject({
      subject: subject,
      marks: 0, 
      totalMarks: totalMarks
    });
  };
  
  return (
    <div className="animate-fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form Section */}
        {editMode && (
          <div className="glass-card">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-semibold flex items-center gap-3">
                <FileText className="text-theme-blue" size={24} />
                {student.id ? `Edit Result: ${student.id}` : "Create New Result"}
              </h2>
              
              <div className="flex gap-2">
                <select
                  value={viewMode}
                  onChange={(e) => setViewMode(e.target.value as 'single' | 'bulk')}
                  className="glass px-3 py-1.5 rounded-lg text-sm"
                >
                  <option value="single">Single View</option>
                  <option value="bulk">Bulk Edit</option>
                </select>
                
                <button 
                  onClick={clearForm}
                  className="flex items-center gap-1 glass px-3 py-1.5 rounded-lg text-sm"
                >
                  <Plus size={14} />
                  <span>New</span>
                </button>
              </div>
            </div>
            
            {/* School Details Section */}
            <div className="mb-6 glass p-4 rounded-lg">
              <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <Settings size={14} />
                School Details
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-1">School Name</label>
                  <input
                    type="text"
                    value={schoolDetails.name}
                    onChange={(e) => setSchoolDetails({...schoolDetails, name: e.target.value})}
                    className="w-full glass px-3 py-2 rounded-lg"
                    placeholder="School Name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm mb-1">School Logo</label>
                  <label className="flex items-center gap-2 glass px-3 py-2 rounded-lg cursor-pointer">
                    <FileUp size={14} />
                    <span>{schoolLogoFile ? schoolLogoFile.name : "Upload Logo"}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={updateSchoolLogo}
                      className="hidden"
                    />
                  </label>
                </div>
                
                <div>
                  <label className="block text-sm mb-1">Principal's Name</label>
                  <input
                    type="text"
                    value={schoolDetails.principalName}
                    onChange={(e) => setSchoolDetails({...schoolDetails, principalName: e.target.value})}
                    className="w-full glass px-3 py-2 rounded-lg"
                    placeholder="Principal's Name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm mb-1">Principal's Signature</label>
                  <label className="flex items-center gap-2 glass px-3 py-2 rounded-lg cursor-pointer">
                    <FileUp size={14} />
                    <span>{principalSignatureFile ? principalSignatureFile.name : "Upload Signature"}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={updatePrincipalSignature}
                      className="hidden"
                    />
                  </label>
                </div>
                
                <div>
                  <label className="block text-sm mb-1">School Address</label>
                  <input
                    type="text"
                    value={schoolDetails.address}
                    onChange={(e) => setSchoolDetails({...schoolDetails, address: e.target.value})}
                    className="w-full glass px-3 py-2 rounded-lg"
                    placeholder="School Address"
                  />
                </div>
                
                <div>
                  <label className="block text-sm mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={schoolDetails.phone}
                    onChange={(e) => setSchoolDetails({...schoolDetails, phone: e.target.value})}
                    className="w-full glass px-3 py-2 rounded-lg"
                    placeholder="Phone Number"
                  />
                </div>
                
                <div>
                  <label className="block text-sm mb-1">Email Address</label>
                  <input
                    type="email"
                    value={schoolDetails.email}
                    onChange={(e) => setSchoolDetails({...schoolDetails, email: e.target.value})}
                    className="w-full glass px-3 py-2 rounded-lg"
                    placeholder="Email Address"
                  />
                </div>
                
                <div>
                  <label className="block text-sm mb-1">Website</label>
                  <input
                    type="text"
                    value={schoolDetails.website}
                    onChange={(e) => setSchoolDetails({...schoolDetails, website: e.target.value})}
                    className="w-full glass px-3 py-2 rounded-lg"
                    placeholder="Website"
                  />
                </div>
              </div>
            </div>
            
            {/* Student Details */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold mb-3">Student Details</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-1">Student Name</label>
                  <input
                    type="text"
                    value={student.name}
                    onChange={(e) => setStudent({...student, name: e.target.value})}
                    className="w-full glass px-3 py-2 rounded-lg"
                    placeholder="Student Name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm mb-1">Grade/Class</label>
                  <select
                    value={student.grade}
                    onChange={(e) => setStudent({...student, grade: e.target.value})}
                    className="w-full glass px-3 py-2 rounded-lg"
                  >
                    <option value="">Select Grade</option>
                    <option value="Grade 1">Grade 1</option>
                    <option value="Grade 2">Grade 2</option>
                    <option value="Grade 3">Grade 3</option>
                    <option value="Grade 4">Grade 4</option>
                    <option value="Grade 5">Grade 5</option>
                    <option value="Grade 6">Grade 6</option>
                    <option value="Grade 7">Grade 7</option>
                    <option value="Grade 8">Grade 8</option>
                    <option value="Grade 9">Grade 9</option>
                    <option value="Grade 10">Grade 10</option>
                    <option value="Grade 11">Grade 11</option>
                    <option value="Grade 12">Grade 12</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm mb-1">Term</label>
                  <select
                    value={student.term}
                    onChange={(e) => setStudent({...student, term: e.target.value})}
                    className="w-full glass px-3 py-2 rounded-lg"
                  >
                    <option value="">Select Term</option>
                    <option value="Term 1">Term 1</option>
                    <option value="Term 2">Term 2</option>
                    <option value="Term 3">Term 3</option>
                    <option value="Final">Final</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm mb-1">Academic Year</label>
                  <input
                    type="text"
                    value={student.year}
                    onChange={(e) => setStudent({...student, year: e.target.value})}
                    className="w-full glass px-3 py-2 rounded-lg"
                    placeholder="Academic Year"
                  />
                </div>
                
                <div>
                  <label className="block text-sm mb-1">Position in Class</label>
                  <input
                    type="text"
                    value={student.position}
                    onChange={(e) => setStudent({...student, position: e.target.value})}
                    className="w-full glass px-3 py-2 rounded-lg"
                    placeholder="e.g. 1st, 2nd, 3rd"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-sm mb-1">Days Present</label>
                    <input
                      type="number"
                      value={student.attendance.present}
                      onChange={(e) => setStudent({...student, attendance: {...student.attendance, present: parseInt(e.target.value) || 0}})}
                      className="w-full glass px-3 py-2 rounded-lg"
                      placeholder="Days Present"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm mb-1">Total Days</label>
                    <input
                      type="number"
                      value={student.attendance.total}
                      onChange={(e) => setStudent({...student, attendance: {...student.attendance, total: parseInt(e.target.value) || 0}})}
                      className="w-full glass px-3 py-2 rounded-lg"
                      placeholder="Total Days"
                    />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Subject Management Section */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-sm font-semibold">Subjects & Marks</h3>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => document.getElementById('addSubjectModal')?.showModal()}
                    className="text-xs flex items-center gap-1 glass px-2 py-1 rounded"
                  >
                    <Plus size={12} />
                    <span>Add New Subject</span>
                  </button>
                </div>
              </div>
              
              {/* Subject Input Form */}
              <div className="flex flex-wrap gap-2 mb-4">
                <select
                  value={selectedSubject}
                  onChange={(e) => handleSubjectSelection(e.target.value)}
                  className="glass px-3 py-2 rounded-lg flex-grow md:flex-grow-0 md:w-1/3"
                >
                  <option value="">Select Subject</option>
                  {subjectTemplates.map((subject, idx) => (
                    <option key={idx} value={subject.name}>
                      {subject.name} (out of {subject.totalMarks})
                    </option>
                  ))}
                </select>
                
                <div className="flex items-center gap-2 glass px-3 py-2 rounded-lg">
                  <input
                    type="number"
                    value={currentSubject.marks}
                    min="0"
                    max={currentSubject.totalMarks}
                    onChange={(e) => setCurrentSubject({...currentSubject, marks: parseInt(e.target.value) || 0})}
                    className="w-20 bg-transparent border-none focus:outline-none"
                    placeholder="Marks"
                  />
                  <span className="text-sm text-foreground/70">/ {selectedTotalMarks}</span>
                </div>
                
                <button
                  onClick={addSubject}
                  className="flex items-center gap-1 btn-primary px-3 py-2 rounded-lg"
                >
                  <Plus size={14} />
                  <span>Add Subject</span>
                </button>
              </div>
              
              {/* Subject List */}
              <div className="overflow-x-auto glass rounded-lg">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="py-2 px-4 text-left">Subject</th>
                      <th className="py-2 px-4 text-left">Marks</th>
                      <th className="py-2 px-4 text-left">Grade</th>
                      <th className="py-2 px-4 text-left">Remarks</th>
                      <th className="py-2 px-4 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {student.subjects.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-4 text-center text-foreground/50">
                          No subjects added yet
                        </td>
                      </tr>
                    ) : (
                      student.subjects.map((subj, idx) => (
                        <tr key={idx} className="border-b border-white/5">
                          <td className="py-2 px-4">{subj.subject}</td>
                          <td className="py-2 px-4">{subj.marks}/{subj.totalMarks}</td>
                          <td className="py-2 px-4">{subj.grade}</td>
                          <td className="py-2 px-4">{subj.remarks}</td>
                          <td className="py-2 px-4 text-center">
                            <button 
                              onClick={() => removeSubject(idx)}
                              className="text-red-500 hover:text-red-400"
                            >
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                    
                    {student.subjects.length > 0 && (
                      <tr className="font-medium">
                        <td className="py-2 px-4">Total</td>
                        <td className="py-2 px-4">
                          {student.totalMarks}/{student.subjects.reduce((acc, subj) => acc + subj.totalMarks, 0)}
                        </td>
                        <td className="py-2 px-4">{student.overallGrade}</td>
                        <td className="py-2 px-4">
                          {student.averagePercentage.toFixed(1)}%
                        </td>
                        <td></td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            
            {/* Remarks Section */}
            {viewMode === 'single' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm mb-1">Teacher's Remarks</label>
                  <textarea
                    value={student.teacherRemarks}
                    onChange={(e) => setStudent({...student, teacherRemarks: e.target.value})}
                    className="w-full glass px-3 py-2 rounded-lg h-24 resize-none"
                    placeholder="Teacher's Remarks"
                  />
                </div>
                
                <div>
                  <label className="block text-sm mb-1">Principal's Remarks</label>
                  <textarea
                    value={student.principalRemarks}
                    onChange={(e) => setStudent({...student, principalRemarks: e.target.value})}
                    className="w-full glass px-3 py-2 rounded-lg h-24 resize-none"
                    placeholder="Principal's Remarks"
                  />
                </div>
              </div>
            ) : (
              <div className="mb-6 glass p-4 rounded-lg">
                <h3 className="text-sm font-semibold mb-3">Bulk Remarks</h3>
                <p className="text-xs text-foreground/70 mb-3">
                  Set remarks for multiple results at once. These will be applied when you save the result.
                </p>
                
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm mb-1">Teacher's Remarks Template</label>
                    <textarea
                      value={bulkRemarks.teacher}
                      onChange={(e) => setBulkRemarks({...bulkRemarks, teacher: e.target.value})}
                      className="w-full glass px-3 py-2 rounded-lg h-24 resize-none"
                      placeholder="Teacher's Remarks Template"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm mb-1">Principal's Remarks Template</label>
                    <textarea
                      value={bulkRemarks.principal}
                      onChange={(e) => setBulkRemarks({...bulkRemarks, principal: e.target.value})}
                      className="w-full glass px-3 py-2 rounded-lg h-24 resize-none"
                      placeholder="Principal's Remarks Template"
                    />
                  </div>
                  
                  <button
                    onClick={applyBulkRemarks}
                    className="btn-primary px-3 py-2 rounded-lg self-start"
                  >
                    Apply To Current Result
                  </button>
                </div>
              </div>
            )}
            
            {/* Action Buttons */}
            <div className="flex flex-wrap justify-end gap-3">
              <button
                onClick={saveResult}
                className="flex items-center gap-2 btn-primary px-4 py-2 rounded-lg"
              >
                <Save size={16} />
                <span>Save Result</span>
              </button>
            </div>
            
            {/* Add Subject Modal */}
            <dialog id="addSubjectModal" className="modal">
              <div className="glass p-6 rounded-lg w-full max-w-md">
                <h3 className="font-medium mb-4">Add New Subject Template</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm mb-1">Subject Name</label>
                    <input
                      type="text"
                      value={newSubjectTemplate.name}
                      onChange={(e) => setNewSubjectTemplate({...newSubjectTemplate, name: e.target.value})}
                      className="w-full glass px-3 py-2 rounded-lg"
                      placeholder="e.g. Physics"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm mb-1">Total Marks</label>
                    <select
                      value={newSubjectTemplate.totalMarks}
                      onChange={(e) => setNewSubjectTemplate({
                        ...newSubjectTemplate, 
                        totalMarks: parseInt(e.target.value)
                      })}
                      className="w-full glass px-3 py-2 rounded-lg"
                    >
                      <option value="100">100 Marks</option>
                      <option value="50">50 Marks</option>
                      <option value="25">25 Marks</option>
                      <option value="20">20 Marks</option>
                      <option value="10">10 Marks</option>
                    </select>
                  </div>
                  
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => (document.getElementById('addSubjectModal') as HTMLDialogElement)?.close()}
                      className="glass px-4 py-2 rounded-lg"
                    >
                      Cancel
                    </button>
                    
                    <button
                      onClick={() => {
                        addSubjectTemplate();
                        (document.getElementById('addSubjectModal') as HTMLDialogElement)?.close();
                      }}
                      className="btn-primary px-4 py-2 rounded-lg"
                    >
                      Add Subject
                    </button>
                  </div>
                </div>
              </div>
            </dialog>
          </div>
        )}
        
        {/* Preview Section */}
        <div className="glass-card">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold flex items-center gap-3">
              <BadgeCheck className="text-theme-purple" size={24} />
              Result Preview
            </h2>
            
            <div className="flex gap-2">
              {!editMode && (
                <>
                  <button
                    onClick={() => setEditMode(true)}
                    className="glass px-3 py-1.5 rounded-lg text-sm flex items-center gap-1"
                  >
                    <Edit size={14} />
                    <span>Edit</span>
                  </button>
                  
                  <button
                    onClick={downloadResult}
                    className="glass px-3 py-1.5 rounded-lg text-sm flex items-center gap-1"
                  >
                    <Download size={14} />
                    <span>Download</span>
                  </button>
                  
                  <button
                    onClick={printResult}
                    className="glass px-3 py-1.5 rounded-lg text-sm flex items-center gap-1"
                  >
                    <Printer size={14} />
                    <span>Print</span>
                  </button>
                </>
              )}
              
              <select
                value={previewMode}
                onChange={(e) => setPreviewMode(e.target.value as 'slip' | 'report')}
                className="glass px-3 py-1.5 rounded-lg text-sm"
              >
                <option value="slip">Result Slip</option>
                <option value="report">Term Report</option>
              </select>
            </div>
          </div>
          
          <div className="h-[calc(100vh-14rem)] overflow-y-auto glass p-4 rounded-lg">
            {previewMode === 'slip' ? (
              <ResultSlipPreview student={student} school={schoolDetails} />
            ) : (
              <TermReportPreview student={student} school={schoolDetails} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultGenerator;
