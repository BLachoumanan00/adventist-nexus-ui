
import React, { useState, useEffect, useRef, ChangeEvent } from "react";
import { BookOpen, Check, ChevronDown, Edit, Filter, Save, Settings, CheckCheck, MessageSquare, Upload, Download } from "lucide-react";
import { useToast } from '../hooks/use-toast';
import { useActivityLogger } from '../hooks/useActivityLogger';

interface Student {
  id: number;
  name: string;
  marks: number | null;
  grade: string;
  remarks: string;
  hasSpellingErrors?: boolean;
}

// Grade conversion chart
const gradeConversion = [
  { min: 90, max: 100, grade: 'A', remarks: ['Excellent performance', 'Outstanding work', 'Exceptional understanding'] },
  { min: 80, max: 89, grade: 'B+', remarks: ['Very good progress', 'Strong understanding', 'Above average work'] },
  { min: 70, max: 79, grade: 'B', remarks: ['Good performance', 'Consistent work', 'Shows potential'] },
  { min: 60, max: 69, grade: 'C+', remarks: ['Satisfactory work', 'Fair understanding', 'Average performance'] },
  { min: 50, max: 59, grade: 'C', remarks: ['Basic understanding', 'Needs more practice', 'Passing, but needs improvement'] },
  { min: 40, max: 49, grade: 'D', remarks: ['Needs improvement', 'Minimum passing grade', 'Requires additional support'] },
  { min: 0, max: 39, grade: 'F', remarks: ['Below passing standards', 'Significant improvement needed', 'Requires remedial work'] }
];

const TeacherPanel: React.FC = () => {
  const [selectedClass, setSelectedClass] = useState("Grade 8");
  const [selectedSection, setSelectedSection] = useState("A");
  const [selectedSubject, setSelectedSubject] = useState("Mathematics");
  const [editingStudent, setEditingStudent] = useState<number | null>(null);
  const [useAutoRemarks, setUseAutoRemarks] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [checkGrammar, setCheckGrammar] = useState(true);
  const [customPassingCriteria, setCustomPassingCriteria] = useState(35);
  const [bulkEditMode, setBulkEditMode] = useState(false);
  const remarksRef = useRef<HTMLInputElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { toast } = useToast();
  const { logActivity } = useActivityLogger();
  
  const [students, setStudents] = useState<Student[]>([
    { id: 1, name: "John Smith", marks: 78, grade: "B+", remarks: "Good performance" },
    { id: 2, name: "Sarah Johnson", marks: 92, grade: "A", remarks: "Excellent work" },
    { id: 3, name: "Michael Brown", marks: 65, grade: "C", remarks: "Needs improvement" },
    { id: 4, name: "Emily Davis", marks: 88, grade: "B+", remarks: "Very good progress" },
    { id: 5, name: "Robert Wilson", marks: 75, grade: "B", remarks: "Consistent work" },
    { id: 6, name: "Jessica Lee", marks: null, grade: "", remarks: "" },
    { id: 7, name: "William Taylor", marks: 81, grade: "B+", remarks: "Good participation" },
    { id: 8, name: "Olivia Martin", marks: 94, grade: "A", remarks: "Outstanding work" },
  ]);

  // Focus on the remarks field when editing
  useEffect(() => {
    if (editingStudent !== null && remarksRef.current) {
      remarksRef.current.focus();
    }
  }, [editingStudent]);

  // Generate auto remarks based on marks
  const getAutoRemark = (marks: number | null): string => {
    if (marks === null) return "";
    
    const gradeInfo = gradeConversion.find(g => marks >= g.min && marks <= g.max);
    if (!gradeInfo) return "";
    
    // Randomly select one of the remarks for this grade
    const randomIndex = Math.floor(Math.random() * gradeInfo.remarks.length);
    return gradeInfo.remarks[randomIndex];
  };

  const handleMarksChange = (id: number, value: string) => {
    const numValue = value === "" ? null : Math.min(100, Math.max(0, parseInt(value) || 0));
    
    setStudents(
      students.map(student => 
        student.id === id 
          ? { 
              ...student, 
              marks: numValue,
              grade: calculateGrade(numValue),
              // Auto-generate remarks if feature is enabled
              remarks: useAutoRemarks ? getAutoRemark(numValue) : student.remarks
            } 
          : student
      )
    );
  };

  const handleBulkMarksChange = (value: string, index: number) => {
    const updatedStudents = [...students];
    const numValue = value === "" ? null : Math.min(100, Math.max(0, parseInt(value) || 0));
    
    if (updatedStudents[index]) {
      updatedStudents[index].marks = numValue;
      updatedStudents[index].grade = calculateGrade(numValue);
      if (useAutoRemarks) {
        updatedStudents[index].remarks = getAutoRemark(numValue);
      }
    }
    
    setStudents(updatedStudents);
  };

  const handleRemarksChange = (id: number, value: string) => {
    let hasErrors = false;
    
    // Simple grammar check
    if (checkGrammar && value) {
      // Check for capitalization of first letter
      if (value.length > 0 && value[0] !== value[0].toUpperCase()) {
        value = value.charAt(0).toUpperCase() + value.slice(1);
        hasErrors = true;
      }
      
      // Check for common spelling errors (simplified example)
      const commonMisspellings: Record<string, string> = {
        'improvment': 'improvement',
        'excelent': 'excellent',
        'gud': 'good',
        'grate': 'great',
        'verry': 'very',
        'requiers': 'requires'
      };
      
      Object.keys(commonMisspellings).forEach(misspelled => {
        if (value.toLowerCase().includes(misspelled)) {
          hasErrors = true;
        }
      });
    }
    
    setStudents(
      students.map(student => 
        student.id === id ? { 
          ...student, 
          remarks: value,
          hasSpellingErrors: hasErrors
        } : student
      )
    );
  };

  const calculateGrade = (marks: number | null): string => {
    if (marks === null) return "";
    
    const gradeInfo = gradeConversion.find(g => marks >= g.min && marks <= g.max);
    return gradeInfo?.grade || "";
  };

  const handleSave = (id: number) => {
    setEditingStudent(null);
    toast({
      title: "Marks Saved",
      description: `Updated marks for ${students.find(s => s.id === id)?.name}`
    });
    logActivity("Updated Marks", `Changed marks for student ID ${id}`);
  };

  const handleApplyAutoRemarks = () => {
    setStudents(
      students.map(student => ({
        ...student,
        remarks: student.marks !== null ? getAutoRemark(student.marks) : student.remarks,
        hasSpellingErrors: false
      }))
    );
  };

  const getMarkStyle = (marks: number | null): string => {
    if (marks === null) return "";
    if (marks >= 80) return "text-green-600 dark:text-green-400";
    if (marks >= 60) return "text-blue-600 dark:text-blue-400";
    if (marks >= customPassingCriteria) return "text-orange-600 dark:text-orange-400";
    return "text-red-600 dark:text-red-400";
  };

  const handleBulkSave = () => {
    setBulkEditMode(false);
    toast({
      title: "Bulk Update Complete",
      description: "Successfully updated marks for all students"
    });
    logActivity("Bulk Updated Marks", `Updated marks for ${selectedClass} ${selectedSection} - ${selectedSubject}`);
  };

  const handleImportMarks = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const rows = content.split('\n').filter(row => row.trim());
        
        // Skip header row
        if (rows.length > 1) {
          const newStudents = [...students];
          
          // Process each row (skip header)
          for (let i = 1; i < rows.length; i++) {
            const columns = rows[i].split(',');
            if (columns.length >= 4) {
              const id = parseInt(columns[0]);
              const marks = parseInt(columns[2]);
              const remarks = columns[3].trim();
              
              // Find and update the student
              const studentIndex = newStudents.findIndex(s => s.id === id);
              if (studentIndex !== -1) {
                newStudents[studentIndex].marks = isNaN(marks) ? null : marks;
                newStudents[studentIndex].grade = calculateGrade(marks);
                newStudents[studentIndex].remarks = remarks || (useAutoRemarks ? getAutoRemark(marks) : '');
              }
            }
          }
          
          setStudents(newStudents);
          toast({
            title: "Import Successful",
            description: "Student marks have been imported"
          });
          logActivity("Imported Marks", `Imported CSV data for ${selectedSubject}`);
        }
      } catch (error) {
        toast({
          title: "Import Failed",
          description: "There was an error processing the file",
          variant: "destructive"
        });
      }
      
      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    };
    
    reader.readAsText(file);
  };

  const handleExportMarks = () => {
    // Generate CSV content
    const headers = "ID,Name,Marks,Grade,Remarks\n";
    const rows = students.map(student => 
      `${student.id},"${student.name}",${student.marks || ""},${student.grade},"${student.remarks}"`
    ).join('\n');
    
    const content = headers + rows;
    const blob = new Blob([content], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${selectedClass}_${selectedSection}_${selectedSubject}_Marks.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Export Complete",
      description: "Marks have been exported to CSV"
    });
    logActivity("Exported Marks", `Downloaded marks for ${selectedClass} ${selectedSection} - ${selectedSubject}`);
  };

  const handleSubmitGrades = () => {
    toast({
      title: "Grades Submitted",
      description: "All grades have been submitted successfully"
    });
    logActivity("Submitted Grades", `Finalized grades for ${selectedClass} ${selectedSection} - ${selectedSubject}`);
  };

  return (
    <div className="animate-fade-in">
      <div className="glass-card mb-6">
        <div className="flex items-center gap-3 mb-6">
          <BookOpen size={24} className="text-theme-purple" />
          <h2 className="text-xl font-semibold">Teacher Panel</h2>
          
          <div className="ml-auto">
            <button 
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 rounded-full hover:bg-white/10 transition-colors"
              title="Mark Entry Settings"
            >
              <Settings size={20} className="text-foreground/70" />
            </button>
          </div>
        </div>
        
        {showSettings && (
          <div className="glass rounded-xl p-4 mb-6 animate-fade-in">
            <h3 className="font-medium mb-4">Mark Entry Settings</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={useAutoRemarks}
                      onChange={() => setUseAutoRemarks(!useAutoRemarks)}
                      className="rounded text-primary focus:ring-primary/30"
                    />
                    <span>Use Auto Remarks</span>
                  </label>
                  
                  {!useAutoRemarks && (
                    <button 
                      onClick={handleApplyAutoRemarks}
                      className="text-xs text-primary hover:underline"
                    >
                      Apply to All
                    </button>
                  )}
                </div>
                
                <div className="flex items-center mb-3">
                  <input
                    type="checkbox"
                    checked={checkGrammar}
                    onChange={() => setCheckGrammar(!checkGrammar)}
                    className="rounded text-primary focus:ring-primary/30 mr-2"
                  />
                  <span>Check Grammar and Spelling</span>
                </div>
                
                <div className="mb-3">
                  <label className="block text-sm text-foreground/70 mb-1">Passing Criteria</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="range"
                      min="0"
                      max="50"
                      value={customPassingCriteria}
                      onChange={(e) => setCustomPassingCriteria(parseInt(e.target.value))}
                      className="w-full"
                    />
                    <span className="text-sm font-medium">{customPassingCriteria}%</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-2">Grade Conversion Sheet</h4>
                <div className="bg-white/5 dark:bg-black/20 rounded-lg p-3 h-40 overflow-y-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="px-2 py-1 text-left">Range</th>
                        <th className="px-2 py-1 text-left">Grade</th>
                        <th className="px-2 py-1 text-left">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {gradeConversion.map((item, index) => (
                        <tr key={index} className="border-b border-white/5 last:border-b-0">
                          <td className="px-2 py-1">{item.min}-{item.max}%</td>
                          <td className="px-2 py-1">{item.grade}</td>
                          <td className="px-2 py-1">
                            {item.min >= customPassingCriteria ? "Pass" : "Fail"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div className="glass rounded-xl p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4 mb-2">
            <div className="flex-1">
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
            
            <div className="flex-1">
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
            
            <div className="flex-1">
              <label className="block text-sm text-foreground/70 mb-1">Subject</label>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="w-full glass rounded-lg border-none px-4 py-2"
              >
                <option>Mathematics</option>
                <option>Science</option>
                <option>English</option>
                <option>History</option>
                <option>Geography</option>
                <option>Computer Science</option>
              </select>
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="text-sm text-foreground/60">
              Showing {students.length} students in {selectedClass} {selectedSection} for {selectedSubject}
            </div>
            
            <div className="flex items-center gap-2">
              <button 
                className="flex items-center gap-1 glass px-3 py-1.5 rounded-lg text-sm"
                onClick={handleImportMarks}
              >
                <Upload size={14} />
                <span>Import</span>
              </button>
              <input 
                type="file" 
                ref={fileInputRef} 
                accept=".csv" 
                style={{ display: 'none' }}
                onChange={handleFileUpload}
              />
              
              <button 
                className="flex items-center gap-1 glass px-3 py-1.5 rounded-lg text-sm"
                onClick={handleExportMarks}
              >
                <Download size={14} />
                <span>Export</span>
              </button>
              
              <button 
                className="flex items-center gap-1 glass px-3 py-1.5 rounded-lg text-sm"
                onClick={() => setBulkEditMode(!bulkEditMode)}
              >
                {bulkEditMode ? (
                  <>
                    <Edit size={14} />
                    <span>Single Edit</span>
                  </>
                ) : (
                  <>
                    <Edit size={14} />
                    <span>Bulk Edit</span>
                  </>
                )}
              </button>
              
              <button className="flex items-center gap-2 glass px-3 py-1.5 rounded-lg text-sm">
                <Filter size={14} />
                <span>Filter</span>
                <ChevronDown size={14} />
              </button>
            </div>
          </div>
        </div>
        
        {bulkEditMode ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="pb-3 text-left font-medium text-foreground/70 text-sm">Student Name</th>
                  <th className="pb-3 text-left font-medium text-foreground/70 text-sm">Marks</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student, index) => (
                  <tr key={student.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="py-3">{student.name}</td>
                    <td className="py-3">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={student.marks === null ? "" : student.marks}
                        onChange={(e) => handleBulkMarksChange(e.target.value, index)}
                        className="glass rounded p-1 w-16 border-none"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            <div className="mt-6 flex justify-end">
              <button 
                className="btn-primary flex items-center gap-2"
                onClick={handleBulkSave}
              >
                <Save size={18} />
                <span>Save All Marks</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="pb-3 text-left font-medium text-foreground/70 text-sm">Student Name</th>
                  <th className="pb-3 text-left font-medium text-foreground/70 text-sm">Marks</th>
                  <th className="pb-3 text-left font-medium text-foreground/70 text-sm">Grade</th>
                  <th className="pb-3 text-left font-medium text-foreground/70 text-sm w-2/5">Remarks</th>
                  <th className="pb-3 text-left font-medium text-foreground/70 text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="py-3">{student.name}</td>
                    <td className="py-3">
                      {editingStudent === student.id ? (
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={student.marks === null ? "" : student.marks}
                          onChange={(e) => handleMarksChange(student.id, e.target.value)}
                          className="glass rounded p-1 w-16 border-none"
                        />
                      ) : (
                        <span className={getMarkStyle(student.marks)}>
                          {student.marks === null ? "—" : student.marks}
                        </span>
                      )}
                    </td>
                    <td className="py-3">
                      <span className={getMarkStyle(student.marks)}>
                        {student.grade || "—"}
                      </span>
                    </td>
                    <td className="py-3 relative">
                      {editingStudent === student.id ? (
                        <input
                          ref={remarksRef}
                          type="text"
                          value={student.remarks}
                          onChange={(e) => handleRemarksChange(student.id, e.target.value)}
                          className={`glass rounded p-1 w-full border ${
                            student.hasSpellingErrors ? 'border-red-400 dark:border-red-600' : 'border-transparent'
                          }`}
                        />
                      ) : (
                        <span className="text-foreground/80 text-sm">
                          {student.remarks || "No remarks"}
                        </span>
                      )}
                      {student.hasSpellingErrors && editingStudent === student.id && (
                        <div className="absolute right-2 top-1/2 -translate-y-1/2 text-red-500" title="Spelling or grammar issues detected">
                          <MessageSquare size={16} />
                        </div>
                      )}
                    </td>
                    <td className="py-3">
                      {editingStudent === student.id ? (
                        <button
                          onClick={() => handleSave(student.id)}
                          className="p-2 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                        >
                          <Save size={16} />
                        </button>
                      ) : (
                        <button
                          onClick={() => setEditingStudent(student.id)}
                          className="p-2 rounded-full hover:bg-white/10 transition-colors"
                        >
                          <Edit size={16} className="text-foreground/70" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        <div className="mt-6 flex justify-end">
          <button className="btn-primary flex items-center gap-2" onClick={handleSubmitGrades}>
            <CheckCheck size={18} />
            <span>Submit All Grades</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TeacherPanel;
