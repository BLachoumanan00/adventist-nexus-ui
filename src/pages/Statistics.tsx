
import React, { useState, useEffect } from "react";
import { BarChart as BarChartIcon, BookOpen, ChevronDown, Edit, PieChart as PieChartIcon, Save } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { useActivityLogger } from "../hooks/useActivityLogger";
import { useToast } from "../hooks/use-toast";

const Statistics: React.FC = () => {
  const [selectedGrade, setSelectedGrade] = useState("All Grades");
  const [selectedTerm, setSelectedTerm] = useState("Term 1");
  const [editMode, setEditMode] = useState(false);
  const { logActivity } = useActivityLogger();
  const { toast } = useToast();
  
  // Sample data for the bar chart - now with state to allow editing
  const [subjectPerformanceData, setSubjectPerformanceData] = useState([
    { subject: "Math", average: 76, passing: 88 },
    { subject: "Science", average: 72, passing: 84 },
    { subject: "English", average: 82, passing: 92 },
    { subject: "History", average: 68, passing: 78 },
    { subject: "Geography", average: 75, passing: 86 },
    { subject: "Computer", average: 88, passing: 95 },
  ]);
  
  // Sample data for the pie chart - now with state for editing
  const [gradeDistributionData, setGradeDistributionData] = useState([
    { name: "A", value: 32, color: "#4ade80" },
    { name: "B", value: 45, color: "#60a5fa" },
    { name: "C", value: 18, color: "#facc15" },
    { name: "D", value: 4, color: "#f87171" },
    { name: "F", value: 1, color: "#ef4444" },
  ]);
  
  // Sample data for attendance pie chart - now with state
  const [attendanceData, setAttendanceData] = useState([
    { name: "Present", value: 92, color: "#4ade80" },
    { name: "Absent", value: 5, color: "#f87171" },
    { name: "Late", value: 3, color: "#facc15" },
  ]);
  
  // Sample data for class comparison - now with state
  const [classComparisonData, setClassComparisonData] = useState([
    { class: "8A", math: 78, science: 74, english: 84 },
    { class: "8B", math: 72, science: 70, english: 80 },
    { class: "8C", math: 80, science: 76, english: 82 },
    { class: "9A", math: 76, science: 72, english: 88 },
    { class: "9B", math: 74, science: 68, english: 86 },
  ]);
  
  // Create copies of data for editing
  const [editableSubjectData, setEditableSubjectData] = useState([...subjectPerformanceData]);
  const [editableGradeData, setEditableGradeData] = useState([...gradeDistributionData]);
  const [editableAttendanceData, setEditableAttendanceData] = useState([...attendanceData]);
  const [editableClassData, setEditableClassData] = useState([...classComparisonData]);

  // Reset editable data when switching to edit mode
  useEffect(() => {
    if (editMode) {
      setEditableSubjectData([...subjectPerformanceData]);
      setEditableGradeData([...gradeDistributionData]);
      setEditableAttendanceData([...attendanceData]);
      setEditableClassData([...classComparisonData]);
    }
  }, [editMode]);
  
  // Handle saving changes
  const handleSaveChanges = () => {
    setSubjectPerformanceData([...editableSubjectData]);
    setGradeDistributionData([...editableGradeData]);
    setAttendanceData([...editableAttendanceData]);
    setClassComparisonData([...editableClassData]);
    setEditMode(false);
    
    logActivity("Updated Statistics Data", `Updated data for ${selectedGrade} - ${selectedTerm}`);
    
    toast({
      title: "Statistics Saved",
      description: "Your changes to the statistics data have been saved.",
    });
  };
  
  // Handle subject data changes
  const handleSubjectDataChange = (index: number, field: 'average' | 'passing', value: number) => {
    const newData = [...editableSubjectData];
    newData[index][field] = Math.min(100, Math.max(0, value)); // Ensure value is between 0-100
    setEditableSubjectData(newData);
  };
  
  // Handle grade distribution changes
  const handleGradeDataChange = (index: number, value: number) => {
    const newData = [...editableGradeData];
    newData[index].value = Math.max(0, value);
    setEditableGradeData(newData);
  };
  
  // Handle attendance data changes
  const handleAttendanceDataChange = (index: number, value: number) => {
    const newData = [...editableAttendanceData];
    newData[index].value = Math.max(0, value);
    setEditableAttendanceData(newData);
  };
  
  // Handle class comparison data changes
  const handleClassDataChange = (index: number, field: 'math' | 'science' | 'english', value: number) => {
    const newData = [...editableClassData];
    newData[index][field] = Math.min(100, Math.max(0, value)); // Ensure value is between 0-100
    setEditableClassData(newData);
  };

  return (
    <div className="animate-fade-in">
      <div className="glass-card mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
          <div className="flex items-center gap-3">
            <BarChartIcon size={24} className="text-theme-purple" />
            <h2 className="text-xl font-semibold">Performance Statistics</h2>
          </div>
          
          <div className="flex gap-3">
            <select
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(e.target.value)}
              className="glass rounded-lg border-none px-4 py-1.5 text-sm"
              disabled={editMode}
            >
              <option>All Grades</option>
              <option>Grade 8</option>
              <option>Grade 9</option>
              <option>Grade 10</option>
              <option>Grade 11</option>
              <option>Grade 12</option>
            </select>
            
            <select
              value={selectedTerm}
              onChange={(e) => setSelectedTerm(e.target.value)}
              className="glass rounded-lg border-none px-4 py-1.5 text-sm"
              disabled={editMode}
            >
              <option>Term 1</option>
              <option>Term 2</option>
              <option>Term 3</option>
            </select>
            
            <button 
              onClick={() => editMode ? handleSaveChanges() : setEditMode(true)}
              className="btn-primary flex items-center gap-1 text-sm"
            >
              {editMode ? (
                <>
                  <Save size={14} />
                  <span>Save</span>
                </>
              ) : (
                <>
                  <Edit size={14} />
                  <span>Edit</span>
                </>
              )}
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="glass rounded-xl p-4">
            <h3 className="font-medium mb-3">Subject Performance</h3>
            {editMode ? (
              <div className="mb-4 overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="pb-2 text-left text-sm">Subject</th>
                      <th className="pb-2 text-left text-sm">Average Score</th>
                      <th className="pb-2 text-left text-sm">Passing Rate %</th>
                    </tr>
                  </thead>
                  <tbody>
                    {editableSubjectData.map((item, index) => (
                      <tr key={index} className="border-b border-white/5">
                        <td className="py-2">{item.subject}</td>
                        <td className="py-2">
                          <input 
                            type="number"
                            value={item.average}
                            min={0}
                            max={100}
                            onChange={(e) => handleSubjectDataChange(index, 'average', parseInt(e.target.value) || 0)}
                            className="w-20 glass rounded px-2 py-1"
                          />
                        </td>
                        <td className="py-2">
                          <input 
                            type="number"
                            value={item.passing}
                            min={0}
                            max={100}
                            onChange={(e) => handleSubjectDataChange(index, 'passing', parseInt(e.target.value) || 0)}
                            className="w-20 glass rounded px-2 py-1"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={subjectPerformanceData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="subject" stroke="rgba(255,255,255,0.5)" />
                    <YAxis stroke="rgba(255,255,255,0.5)" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(255,255,255,0.8)', 
                        borderRadius: '8px', 
                        border: 'none',
                        boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' 
                      }}
                    />
                    <Legend />
                    <Bar dataKey="average" name="Average Score" fill="#9b87f5" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="passing" name="Passing Rate %" fill="#60a5fa" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
          
          <div className="glass rounded-xl p-4">
            <h3 className="font-medium mb-3">Grade Distribution</h3>
            {editMode ? (
              <div className="mb-4 overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="pb-2 text-left text-sm">Grade</th>
                      <th className="pb-2 text-left text-sm">Number of Students</th>
                    </tr>
                  </thead>
                  <tbody>
                    {editableGradeData.map((item, index) => (
                      <tr key={index} className="border-b border-white/5">
                        <td className="py-2">
                          <span className="px-2 py-0.5 rounded" style={{ backgroundColor: item.color + '40', color: item.color }}>
                            {item.name}
                          </span>
                        </td>
                        <td className="py-2">
                          <input 
                            type="number"
                            value={item.value}
                            min={0}
                            onChange={(e) => handleGradeDataChange(index, parseInt(e.target.value) || 0)}
                            className="w-20 glass rounded px-2 py-1"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={gradeDistributionData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {gradeDistributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value) => [`${value} Students`, 'Count']}
                      contentStyle={{ 
                        backgroundColor: 'rgba(255,255,255,0.8)', 
                        borderRadius: '8px', 
                        border: 'none',
                        boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' 
                      }}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="glass rounded-xl p-4">
            <h3 className="font-medium mb-3">Class Comparison</h3>
            {editMode ? (
              <div className="mb-4 overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="pb-2 text-left text-sm">Class</th>
                      <th className="pb-2 text-left text-sm">Mathematics</th>
                      <th className="pb-2 text-left text-sm">Science</th>
                      <th className="pb-2 text-left text-sm">English</th>
                    </tr>
                  </thead>
                  <tbody>
                    {editableClassData.map((item, index) => (
                      <tr key={index} className="border-b border-white/5">
                        <td className="py-2">{item.class}</td>
                        <td className="py-2">
                          <input 
                            type="number"
                            value={item.math}
                            min={0}
                            max={100}
                            onChange={(e) => handleClassDataChange(index, 'math', parseInt(e.target.value) || 0)}
                            className="w-20 glass rounded px-2 py-1"
                          />
                        </td>
                        <td className="py-2">
                          <input 
                            type="number"
                            value={item.science}
                            min={0}
                            max={100}
                            onChange={(e) => handleClassDataChange(index, 'science', parseInt(e.target.value) || 0)}
                            className="w-20 glass rounded px-2 py-1"
                          />
                        </td>
                        <td className="py-2">
                          <input 
                            type="number"
                            value={item.english}
                            min={0}
                            max={100}
                            onChange={(e) => handleClassDataChange(index, 'english', parseInt(e.target.value) || 0)}
                            className="w-20 glass rounded px-2 py-1"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={classComparisonData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="class" stroke="rgba(255,255,255,0.5)" />
                    <YAxis stroke="rgba(255,255,255,0.5)" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(255,255,255,0.8)', 
                        borderRadius: '8px', 
                        border: 'none',
                        boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' 
                      }}
                    />
                    <Legend />
                    <Bar dataKey="math" name="Mathematics" fill="#9b87f5" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="science" name="Science" fill="#60a5fa" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="english" name="English" fill="#4ade80" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
          
          <div className="glass rounded-xl p-4">
            <h3 className="font-medium mb-3">Attendance Overview</h3>
            {editMode ? (
              <div className="mb-4 overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="pb-2 text-left text-sm">Status</th>
                      <th className="pb-2 text-left text-sm">Value (%)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {editableAttendanceData.map((item, index) => (
                      <tr key={index} className="border-b border-white/5">
                        <td className="py-2">
                          <span className="px-2 py-0.5 rounded" style={{ backgroundColor: item.color + '40', color: item.color }}>
                            {item.name}
                          </span>
                        </td>
                        <td className="py-2">
                          <input 
                            type="number"
                            value={item.value}
                            min={0}
                            onChange={(e) => handleAttendanceDataChange(index, parseInt(e.target.value) || 0)}
                            className="w-20 glass rounded px-2 py-1"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={attendanceData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {attendanceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(255,255,255,0.8)', 
                        borderRadius: '8px', 
                        border: 'none',
                        boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' 
                      }}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="glass-card">
        <div className="flex items-center gap-3 mb-6">
          <PieChartIcon size={24} className="text-theme-purple" />
          <h2 className="text-xl font-semibold">Performance Metrics</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {[
            { title: "Overall Average", value: "76.5%", change: "+2.3%", positive: true },
            { title: "Attendance Rate", value: "92%", change: "-1.5%", positive: false },
            { title: "Pass Rate", value: "87%", change: "+4.2%", positive: true }
          ].map((metric, index) => (
            <div key={index} className="glass rounded-xl p-4">
              <h3 className="text-foreground/70 text-sm">{metric.title}</h3>
              <div className="flex items-end justify-between mt-2">
                <div className="text-2xl font-bold">{metric.value}</div>
                <div className={`text-sm ${metric.positive ? 'text-green-500' : 'text-red-500'}`}>
                  {metric.change} from last term
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="glass rounded-xl p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium">Top Performing Students</h3>
            <button className="flex items-center gap-1 text-sm text-primary">
              <span>View All</span>
              <ChevronDown size={14} />
            </button>
          </div>
          
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="pb-2 text-left font-medium text-foreground/70 text-sm">Rank</th>
                <th className="pb-2 text-left font-medium text-foreground/70 text-sm">Student Name</th>
                <th className="pb-2 text-left font-medium text-foreground/70 text-sm">Class</th>
                <th className="pb-2 text-left font-medium text-foreground/70 text-sm">Average Score</th>
                <th className="pb-2 text-left font-medium text-foreground/70 text-sm">Trend</th>
              </tr>
            </thead>
            <tbody>
              {[
                { rank: 1, name: "Sarah Johnson", class: "11A", score: "97.8%" },
                { rank: 2, name: "Michael Brown", class: "10B", score: "96.3%" },
                { rank: 3, name: "Emily Davis", class: "12A", score: "95.7%" },
                { rank: 4, name: "Robert Wilson", class: "11A", score: "94.2%" },
                { rank: 5, name: "Olivia Martin", class: "10A", score: "93.8%" }
              ].map((student) => (
                <tr key={student.rank} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="py-3 font-medium">{student.rank}</td>
                  <td className="py-3">{student.name}</td>
                  <td className="py-3">{student.class}</td>
                  <td className="py-3 text-green-600 dark:text-green-400 font-medium">{student.score}</td>
                  <td className="py-3">
                    <div className="w-24 h-6 flex items-center">
                      <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-green-500" 
                          style={{ width: `${Math.floor(Math.random() * 30) + 70}%` }}
                        />
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Statistics;
