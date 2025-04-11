
import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Download, FileText } from "lucide-react";

interface SubjectPerformanceProps {
  subjectPassFailData: any[];
  selectedClass: string;
  editMode: boolean;
  theme: string;
  chartRefs: React.MutableRefObject<{[key: string]: HTMLDivElement | null}>;
  downloadChart: (chartId: string, chartName: string) => void;
  exportAsCSV: (data: any[], filename: string) => void;
}

const SubjectPerformance: React.FC<SubjectPerformanceProps> = ({
  subjectPassFailData,
  selectedClass,
  editMode,
  theme,
  chartRefs,
  downloadChart,
  exportAsCSV
}) => {
  // Filter subject data based on selected class
  const filteredSubjectData = subjectPassFailData.filter(
    item => selectedClass === "All" || item.class === selectedClass
  );

  // Prepare data for the stacked bar chart
  const stackedData = filteredSubjectData.map(item => ({
    subject: item.subject,
    passed: item.passed,
    failed: item.failed,
    total: item.passed + item.failed,
    passPercentage: Math.round((item.passed / (item.passed + item.failed)) * 100)
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Subject Pass/Fail Chart */}
      <div className="glass rounded-xl p-4">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-medium">Subject-wise Pass/Fail Distribution</h3>
          <button
            onClick={() => downloadChart('subjectPassFail', 'Subject-PassFail')}
            className="text-sm flex items-center gap-1 glass px-2 py-1 rounded"
            disabled={editMode}
          >
            <Download size={14} />
            <span>Download</span>
          </button>
        </div>
        
        <div className="h-80" ref={el => chartRefs.current['subjectPassFail'] = el}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
              data={stackedData} 
              margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="subject" stroke="rgba(255,255,255,0.5)" />
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
              <Bar dataKey="passed" name="Passed" stackId="a" fill="#4ade80" radius={[4, 4, 0, 0]} />
              <Bar dataKey="failed" name="Failed" stackId="a" fill="#f87171" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        <div className="flex justify-end mt-2">
          <button
            onClick={() => exportAsCSV(filteredSubjectData, 'subject-pass-fail')}
            className="text-sm flex items-center gap-1 glass px-2 py-1 rounded"
            disabled={editMode}
          >
            <FileText size={14} />
            <span>Export CSV</span>
          </button>
        </div>
      </div>
      
      {/* Subject Pass Percentage Chart */}
      <div className="glass rounded-xl p-4">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-medium">Subject Pass Percentage</h3>
          <button
            onClick={() => downloadChart('subjectPassPercentage', 'Subject-Pass-Percentage')}
            className="text-sm flex items-center gap-1 glass px-2 py-1 rounded"
            disabled={editMode}
          >
            <Download size={14} />
            <span>Download</span>
          </button>
        </div>
        
        <div className="h-80" ref={el => chartRefs.current['subjectPassPercentage'] = el}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
              data={stackedData} 
              margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="subject" stroke="rgba(255,255,255,0.5)" />
              <YAxis stroke="rgba(255,255,255,0.5)" domain={[0, 100]} />
              <Tooltip 
                formatter={(value) => [`${value}%`, 'Pass Percentage']}
                contentStyle={{ 
                  backgroundColor: theme === 'dark' ? 'rgba(30,30,30,0.8)' : 'rgba(255,255,255,0.8)', 
                  color: theme === 'dark' ? '#fff' : '#000',
                  borderRadius: '8px', 
                  border: 'none',
                  boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' 
                }}
              />
              <Legend />
              <Bar 
                dataKey="passPercentage" 
                name="Pass Percentage" 
                fill="#60a5fa"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        <div className="flex justify-end mt-2">
          <button
            onClick={() => exportAsCSV(stackedData, 'subject-pass-percentage')}
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

export default SubjectPerformance;
