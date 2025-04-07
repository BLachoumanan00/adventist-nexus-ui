
import React, { useState } from "react";
import { BookOpen, Check, ChevronDown, Edit, Filter, Save } from "lucide-react";

interface Student {
  id: number;
  name: string;
  marks: number | null;
  grade: string;
  remarks: string;
}

const TeacherPanel: React.FC = () => {
  const [selectedClass, setSelectedClass] = useState("Grade 8");
  const [selectedSection, setSelectedSection] = useState("A");
  const [selectedSubject, setSelectedSubject] = useState("Mathematics");
  const [editingStudent, setEditingStudent] = useState<number | null>(null);
  
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

  const handleMarksChange = (id: number, value: string) => {
    setStudents(
      students.map(student => 
        student.id === id 
          ? { 
              ...student, 
              marks: value === "" ? null : Math.min(100, Math.max(0, parseInt(value) || 0)),
              grade: calculateGrade(value === "" ? null : parseInt(value) || 0)
            } 
          : student
      )
    );
  };

  const handleRemarksChange = (id: number, value: string) => {
    setStudents(
      students.map(student => 
        student.id === id ? { ...student, remarks: value } : student
      )
    );
  };

  const calculateGrade = (marks: number | null): string => {
    if (marks === null) return "";
    if (marks >= 90) return "A";
    if (marks >= 80) return "B+";
    if (marks >= 70) return "B";
    if (marks >= 60) return "C+";
    if (marks >= 50) return "C";
    if (marks >= 40) return "D";
    return "F";
  };

  const handleSave = (id: number) => {
    setEditingStudent(null);
    // In a real app, you would save the changes to the server here
  };

  const getMarkStyle = (marks: number | null): string => {
    if (marks === null) return "";
    if (marks >= 80) return "text-green-600 dark:text-green-400";
    if (marks >= 60) return "text-blue-600 dark:text-blue-400";
    if (marks >= 40) return "text-orange-600 dark:text-orange-400";
    return "text-red-600 dark:text-red-400";
  };

  return (
    <div className="animate-fade-in">
      <div className="glass-card mb-6">
        <div className="flex items-center gap-3 mb-6">
          <BookOpen size={24} className="text-theme-purple" />
          <h2 className="text-xl font-semibold">Teacher Panel</h2>
        </div>
        
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
            
            <button className="flex items-center gap-2 glass px-3 py-1.5 rounded-lg text-sm">
              <Filter size={14} />
              <span>Filter</span>
              <ChevronDown size={14} />
            </button>
          </div>
        </div>
        
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
                  <td className="py-3">
                    {editingStudent === student.id ? (
                      <input
                        type="text"
                        value={student.remarks}
                        onChange={(e) => handleRemarksChange(student.id, e.target.value)}
                        className="glass rounded p-1 w-full border-none"
                      />
                    ) : (
                      <span className="text-foreground/80 text-sm">
                        {student.remarks || "No remarks"}
                      </span>
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
        
        <div className="mt-6 flex justify-end">
          <button className="btn-primary flex items-center gap-2">
            <Check size={18} />
            <span>Submit All Grades</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TeacherPanel;
