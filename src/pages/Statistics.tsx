
import React, { useState } from "react";
import { BarChart as BarChartIcon, BookOpen, ChevronDown, PieChart as PieChartIcon } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const Statistics: React.FC = () => {
  const [selectedGrade, setSelectedGrade] = useState("All Grades");
  const [selectedTerm, setSelectedTerm] = useState("Term 1");
  
  // Sample data for the bar chart
  const subjectPerformanceData = [
    { subject: "Math", average: 76, passing: 88 },
    { subject: "Science", average: 72, passing: 84 },
    { subject: "English", average: 82, passing: 92 },
    { subject: "History", average: 68, passing: 78 },
    { subject: "Geography", average: 75, passing: 86 },
    { subject: "Computer", average: 88, passing: 95 },
  ];
  
  // Sample data for the pie chart
  const gradeDistributionData = [
    { name: "A", value: 32, color: "#4ade80" },
    { name: "B", value: 45, color: "#60a5fa" },
    { name: "C", value: 18, color: "#facc15" },
    { name: "D", value: 4, color: "#f87171" },
    { name: "F", value: 1, color: "#ef4444" },
  ];
  
  // Sample data for attendance pie chart
  const attendanceData = [
    { name: "Present", value: 92, color: "#4ade80" },
    { name: "Absent", value: 5, color: "#f87171" },
    { name: "Late", value: 3, color: "#facc15" },
  ];
  
  // Sample data for class comparison
  const classComparisonData = [
    { class: "8A", math: 78, science: 74, english: 84 },
    { class: "8B", math: 72, science: 70, english: 80 },
    { class: "8C", math: 80, science: 76, english: 82 },
    { class: "9A", math: 76, science: 72, english: 88 },
    { class: "9B", math: 74, science: 68, english: 86 },
  ];

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
            >
              <option>Term 1</option>
              <option>Term 2</option>
              <option>Term 3</option>
            </select>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="glass rounded-xl p-4">
            <h3 className="font-medium mb-3">Subject Performance</h3>
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
          </div>
          
          <div className="glass rounded-xl p-4">
            <h3 className="font-medium mb-3">Grade Distribution</h3>
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
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="glass rounded-xl p-4">
            <h3 className="font-medium mb-3">Class Comparison</h3>
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
          </div>
          
          <div className="glass rounded-xl p-4">
            <h3 className="font-medium mb-3">Attendance Overview</h3>
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
