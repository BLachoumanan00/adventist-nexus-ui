
import React, { useState } from 'react';
import { Calendar, Search, Check, X, Filter, Save } from 'lucide-react';
import { useToast } from '../hooks/use-toast';
import { useActivityLogger } from '../hooks/useActivityLogger';

interface Student {
  id: string;
  name: string;
  grade: string;
  section: string;
  absences: number;
}

const StudentAttendance: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('All');
  const [selectedSection, setSelectedSection] = useState('All');
  const [editingStudent, setEditingStudent] = useState<string | null>(null);
  const [bulkEditMode, setBulkEditMode] = useState(false);
  const { toast } = useToast();
  const { logActivity } = useActivityLogger();
  
  // Sample student data
  const [students, setStudents] = useState<Student[]>([
    { id: "STD0001", name: "John Smith", grade: "10", section: "A", absences: 3 },
    { id: "STD0002", name: "Emily Davis", grade: "10", section: "A", absences: 1 },
    { id: "STD0003", name: "Michael Brown", grade: "10", section: "B", absences: 5 },
    { id: "STD0004", name: "Sarah Johnson", grade: "10", section: "B", absences: 0 },
    { id: "STD0005", name: "Robert Wilson", grade: "10", section: "C", absences: 2 },
    { id: "STD0006", name: "Jessica Lee", grade: "11", section: "A", absences: 4 },
    { id: "STD0007", name: "William Taylor", grade: "11", section: "A", absences: 1 },
    { id: "STD0008", name: "Olivia Martin", grade: "11", section: "B", absences: 0 },
  ]);
  
  const [editValues, setEditValues] = useState<{[key: string]: number}>({});
  
  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         student.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesGrade = selectedGrade === 'All' || student.grade === selectedGrade;
    const matchesSection = selectedSection === 'All' || student.section === selectedSection;
    
    return matchesSearch && matchesGrade && matchesSection;
  });
  
  const handleEdit = (student: Student) => {
    setEditingStudent(student.id);
    setEditValues({
      ...editValues,
      [student.id]: student.absences
    });
  };
  
  const handleSave = (student: Student) => {
    const newAbsencesValue = editValues[student.id] || 0;
    
    setStudents(students.map(s => 
      s.id === student.id ? { ...s, absences: newAbsencesValue } : s
    ));
    
    setEditingStudent(null);
    
    toast({
      title: "Attendance Updated",
      description: `Updated absences for ${student.name}`,
    });
    
    logActivity("Updated Attendance", `Set absences to ${newAbsencesValue} for ${student.name}`);
  };
  
  const handleAbsenceChange = (studentId: string, value: string) => {
    const absences = Math.max(0, parseInt(value) || 0); // Ensure non-negative number
    
    setEditValues({
      ...editValues,
      [studentId]: absences
    });
  };
  
  // New bulk edit functionality
  const handleBulkEditToggle = () => {
    setBulkEditMode(!bulkEditMode);
    
    // Initialize edit values for all students
    if (!bulkEditMode) {
      const initialValues: {[key: string]: number} = {};
      students.forEach(student => {
        initialValues[student.id] = student.absences;
      });
      setEditValues(initialValues);
    }
  };
  
  const handleBulkSave = () => {
    // Apply all changes at once
    const updatedStudents = students.map(student => ({
      ...student,
      absences: editValues[student.id] || student.absences
    }));
    
    setStudents(updatedStudents);
    setBulkEditMode(false);
    
    toast({
      title: "Bulk Update Complete",
      description: `Updated absences for ${filteredStudents.length} students`,
    });
    
    logActivity("Bulk Updated Attendance", `Updated absences for ${selectedGrade} ${selectedSection} class`);
  };
  
  const getAbsenceStyle = (absences: number): string => {
    if (absences === 0) return "text-green-600 dark:text-green-400";
    if (absences <= 2) return "text-blue-600 dark:text-blue-400";
    if (absences <= 4) return "text-orange-600 dark:text-orange-400";
    return "text-red-600 dark:text-red-400";
  };

  return (
    <div className="glass-card mb-6">
      <div className="flex items-center gap-3 mb-6">
        <Calendar size={24} className="text-primary" />
        <h2 className="text-xl font-semibold">Student Attendance</h2>
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
                <option value="All">All Grades</option>
                <option value="7">Grade 7</option>
                <option value="8">Grade 8</option>
                <option value="9">Grade 9</option>
                <option value="10">Grade 10</option>
                <option value="11">Grade 11</option>
                <option value="12">Grade 12</option>
              </select>
            </div>
            
            <div className="flex-1 min-w-0">
              <select
                value={selectedSection}
                onChange={(e) => setSelectedSection(e.target.value)}
                className="w-full rounded-lg glass border-none px-4 py-3 text-base touch-manipulation"
              >
                <option value="All">All Sections</option>
                <option value="A">Section A</option>
                <option value="B">Section B</option>
                <option value="C">Section C</option>
              </select>
            </div>
            
            <button 
              className="flex items-center justify-center gap-2 glass px-4 py-3 rounded-lg touch-manipulation hover:bg-white/10 transition-colors min-h-[48px]"
              onClick={handleBulkEditToggle}
            >
              <span className="text-sm sm:text-base">{bulkEditMode ? "Single Edit" : "Bulk Edit"}</span>
            </button>
          </div>
        </div>
        
        <div className="text-sm text-foreground/60">
          Showing {filteredStudents.length} students
        </div>
      </div>
      
      {!bulkEditMode ? (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="pb-3 text-left font-medium text-foreground/70 text-sm">Student ID</th>
                  <th className="pb-3 text-left font-medium text-foreground/70 text-sm">Name</th>
                  <th className="pb-3 text-left font-medium text-foreground/70 text-sm">Grade</th>
                  <th className="pb-3 text-left font-medium text-foreground/70 text-sm">Section</th>
                  <th className="pb-3 text-center font-medium text-foreground/70 text-sm">Absences</th>
                  <th className="pb-3 text-center font-medium text-foreground/70 text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((student) => (
                  <tr key={student.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="py-3">{student.id}</td>
                    <td className="py-3">{student.name}</td>
                    <td className="py-3">Grade {student.grade}</td>
                    <td className="py-3">Section {student.section}</td>
                    <td className="py-3 text-center">
                      {editingStudent === student.id ? (
                        <input
                          type="number"
                          min="0"
                          value={editValues[student.id] || 0}
                          onChange={(e) => handleAbsenceChange(student.id, e.target.value)}
                          className="w-16 text-center glass rounded px-2 py-1"
                        />
                      ) : (
                        <span className={getAbsenceStyle(student.absences)}>
                          {student.absences}
                        </span>
                      )}
                    </td>
                    <td className="py-3 text-center">
                      {editingStudent === student.id ? (
                        <button 
                          onClick={() => handleSave(student)}
                          className="p-2 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors touch-manipulation"
                        >
                          <Save size={16} className="text-primary" />
                        </button>
                      ) : (
                        <button 
                          onClick={() => handleEdit(student)}
                          className="p-2 rounded-full hover:bg-white/10 transition-colors touch-manipulation"
                        >
                          <Check size={16} className="text-foreground/70" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Mobile Card Layout */}
          <div className="block md:hidden space-y-4">
            {filteredStudents.map((student) => (
              <div key={student.id} className="glass rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-lg">{student.name}</h3>
                    <p className="text-sm text-foreground/60">{student.id}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-sm text-foreground/60">Grade {student.grade} - Section {student.section}</span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center pt-2 border-t border-white/10">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium">Absences:</span>
                    {editingStudent === student.id ? (
                      <input
                        type="number"
                        min="0"
                        value={editValues[student.id] || 0}
                        onChange={(e) => handleAbsenceChange(student.id, e.target.value)}
                        className="w-20 text-center glass rounded px-2 py-2 text-base"
                      />
                    ) : (
                      <span className={`text-lg font-semibold ${getAbsenceStyle(student.absences)}`}>
                        {student.absences}
                      </span>
                    )}
                  </div>
                  
                  <div>
                    {editingStudent === student.id ? (
                      <button 
                        onClick={() => handleSave(student)}
                        className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg touch-manipulation min-h-[44px]"
                      >
                        <Save size={18} />
                        <span>Save</span>
                      </button>
                    ) : (
                      <button 
                        onClick={() => handleEdit(student)}
                        className="flex items-center gap-2 glass px-4 py-2 rounded-lg hover:bg-white/10 transition-colors touch-manipulation min-h-[44px]"
                      >
                        <Check size={18} />
                        <span>Edit</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        // Bulk edit mode
        <>
          {/* Desktop Bulk Edit Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="pb-3 text-left font-medium text-foreground/70 text-sm">Student ID</th>
                  <th className="pb-3 text-left font-medium text-foreground/70 text-sm">Name</th>
                  <th className="pb-3 text-left font-medium text-foreground/70 text-sm">Grade</th>
                  <th className="pb-3 text-left font-medium text-foreground/70 text-sm">Section</th>
                  <th className="pb-3 text-center font-medium text-foreground/70 text-sm">Absences</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((student) => (
                  <tr key={student.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="py-3">{student.id}</td>
                    <td className="py-3">{student.name}</td>
                    <td className="py-3">Grade {student.grade}</td>
                    <td className="py-3">Section {student.section}</td>
                    <td className="py-3 text-center">
                      <input
                        type="number"
                        min="0"
                        value={editValues[student.id] || 0}
                        onChange={(e) => handleAbsenceChange(student.id, e.target.value)}
                        className="w-16 text-center glass rounded px-2 py-1"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Mobile Bulk Edit Cards */}
          <div className="block md:hidden space-y-4">
            {filteredStudents.map((student) => (
              <div key={student.id} className="glass rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold text-lg">{student.name}</h3>
                    <p className="text-sm text-foreground/60">{student.id}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-sm text-foreground/60">Grade {student.grade} - Section {student.section}</span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center pt-2 border-t border-white/10">
                  <span className="text-sm font-medium">Absences:</span>
                  <input
                    type="number"
                    min="0"
                    value={editValues[student.id] || 0}
                    onChange={(e) => handleAbsenceChange(student.id, e.target.value)}
                    className="w-24 text-center glass rounded px-3 py-2 text-base touch-manipulation"
                  />
                </div>
              </div>
            ))}
          </div>
        </>
      )}
      
      <div className="mt-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="text-sm text-foreground/60">
          <span className="hidden sm:inline">Tip:</span> {bulkEditMode ? "Enter absences for all students at once" : "Tap Edit to update individual absences"}
        </div>
        {bulkEditMode ? (
          <button 
            className="bg-primary text-primary-foreground px-6 py-3 rounded-lg flex items-center gap-2 touch-manipulation hover:opacity-90 transition-opacity min-h-[48px] w-full sm:w-auto justify-center"
            onClick={handleBulkSave}
          >
            <Save size={20} />
            <span>Save All Changes</span>
          </button>
        ) : (
          <button className="bg-secondary text-secondary-foreground px-6 py-3 rounded-lg flex items-center gap-2 touch-manipulation hover:opacity-90 transition-opacity min-h-[48px] w-full sm:w-auto justify-center">
            <Save size={20} />
            <span>Export Attendance</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default StudentAttendance;
