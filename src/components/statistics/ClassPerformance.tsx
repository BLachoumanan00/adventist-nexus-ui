
import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Download, FileText } from "lucide-react";
import { useTheme } from "../../hooks/useTheme";

interface ClassPerformanceProps {
  classPerformanceData: any[];
  classPassFailData: any[];
  subjectWiseData: any[];
  selectedClass: string;
  editMode: boolean;
  theme: string;
  chartRefs: React.MutableRefObject<{[key: string]: HTMLDivElement | null}>;
  downloadChart: (chartId: string, chartName: string) => void;
  exportAsCSV: (data: any[], filename: string) => void;
}

const ClassPerformance: React.FC<ClassPerformanceProps> = ({
  classPerformanceData,
  classPassFailData,
  selectedClass,
  editMode,
  theme,
  chartRefs,
  downloadChart,
  exportAsCSV
}) => {
  // Filter data for the selected class
  const filteredPassFailData = classPassFailData.filter(
    item => selectedClass === "All" ? true : item.class === selectedClass
  );

  // Group data by class for "All" view
  const classGroups = selectedClass === "All" 
    ? Array.from(new Set(classPassFailData.map(item => item.class)))
    : [selectedClass];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Class Performance Chart */}
      <div className="glass rounded-xl p-4">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-medium">Class Performance</h3>
          <button
            onClick={() => downloadChart('classPerformance', 'Class-Performance')}
            className="text-sm flex items-center gap-1 glass px-2 py-1 rounded"
            disabled={editMode}
          >
            <Download size={14} />
            <span>Download</span>
          </button>
        </div>
        
        <div className="h-80" ref={el => chartRefs.current['classPerformance'] = el}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={classPerformanceData.filter(item => 
              selectedClass === "All" ? true : item.class === selectedClass
            )} 
            margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="class" stroke="rgba(255,255,255,0.5)" />
              <YAxis stroke="rgba(255,255,255,0.5)" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: theme === 'dark' ? 'rgba(30,30,30,0.8)' : 'rgba(255,255,255,0.8)', 
                  color: theme === 'dark' ? '#fff' : '#000',
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
        
        <div className="flex justify-end mt-2">
          <button
            onClick={() => exportAsCSV(classPerformanceData, 'class-performance')}
            className="text-sm flex items-center gap-1 glass px-2 py-1 rounded"
            disabled={editMode}
          >
            <FileText size={14} />
            <span>Export CSV</span>
          </button>
        </div>
      </div>
      
      {/* Class Pass/Fail Chart */}
      <div className="glass rounded-xl p-4">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-medium">Pass/Fail Distribution by Class</h3>
          <button
            onClick={() => downloadChart('classPassFail', 'Class-PassFail')}
            className="text-sm flex items-center gap-1 glass px-2 py-1 rounded"
            disabled={editMode}
          >
            <Download size={14} />
            <span>Download</span>
          </button>
        </div>
        
        <div className="h-80 grid grid-cols-1" ref={el => chartRefs.current['classPassFail'] = el}>
          {selectedClass !== "All" ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={filteredPassFailData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {filteredPassFailData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value, name, entry) => [`${value}%`, `${name}`]}
                  contentStyle={{ 
                    backgroundColor: theme === 'dark' ? 'rgba(30,30,30,0.8)' : 'rgba(255,255,255,0.8)', 
                    color: theme === 'dark' ? '#fff' : '#000',
                    borderRadius: '8px', 
                    border: 'none' 
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-auto h-full">
              {classGroups.map((classItem) => (
                <div key={classItem} className="text-center">
                  <h4 className="mb-2 font-medium">Class {classItem}</h4>
                  <div className="h-40">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={classPassFailData.filter(item => item.class === classItem)}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={40}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                        >
                          {classPassFailData
                            .filter(item => item.class === classItem)
                            .map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip 
                          formatter={(value, name, entry) => [`${value}%`, `${name}`]}
                          contentStyle={{ 
                            backgroundColor: theme === 'dark' ? 'rgba(30,30,30,0.8)' : 'rgba(255,255,255,0.8)', 
                            color: theme === 'dark' ? '#fff' : '#000',
                            borderRadius: '8px', 
                            border: 'none' 
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="flex justify-end mt-2">
          <button
            onClick={() => exportAsCSV(filteredPassFailData, 'class-pass-fail')}
            className="text-sm flex items-center gap-1 glass px-2 py-1 rounded"
            disabled={editMode}
          >
            <FileText size={14} />
            <span>Export CSV</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClassPerformance;
