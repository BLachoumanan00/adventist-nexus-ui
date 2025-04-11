import React, { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Download, FileText, ChevronDown } from "lucide-react";

interface SubjectPerformanceProps {
  subjectPassFailData: Array<{
    subject: string;
    passed: number;
    failed: number;
    class: string;
  }>;
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
  const [showDetails, setShowDetails] = useState(false);
  
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

  // Group data by subject for the overview chart
  const subjectGroups = subjectPassFailData.reduce((groups: Record<string, {
    subject: string;
    students: number;
    passed: number;
    failed: number;
  }>, item) => {
    if (!groups[item.subject]) {
      groups[item.subject] = {
        subject: item.subject,
        students: 0,
        passed: 0,
        failed: 0
      };
    }
    groups[item.subject].students += (item.passed + item.failed);
    groups[item.subject].passed += item.passed;
    groups[item.subject].failed += item.failed;
    return groups;
  }, {});

  const overviewData = Object.values(subjectGroups);

  // Calculate overall pass/fail statistics
  const totalPassed = overviewData.reduce((sum: number, item: any) => sum + item.passed, 0);
  const totalFailed = overviewData.reduce((sum: number, item: any) => sum + item.failed, 0);
  const passRate = Math.round((totalPassed / (totalPassed + totalFailed)) * 100);
  const failRate = 100 - passRate;

  // Prepare the pie chart data
  const pieChartData = [
    { name: "Pass", value: passRate, color: "#0f5ea2" },
    { name: "Fail", value: failRate, color: "#f17831" }
  ];

  return (
    <div className="grid grid-cols-1 gap-6">
      {/* Overall Statistics Chart (Similar to uploaded image) */}
      <div className="glass rounded-xl p-4">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-medium">Subject-wise Pass/Fail Overview</h3>
          <div className="flex gap-2">
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="text-sm flex items-center gap-1 glass px-2 py-1 rounded"
            >
              <span>{showDetails ? 'Hide Details' : 'Show Details'}</span>
              <ChevronDown size={14} className={`transform transition-transform ${showDetails ? 'rotate-180' : ''}`} />
            </button>
            <button
              onClick={() => downloadChart('subjectOverview', 'Subject-Overview')}
              className="text-sm flex items-center gap-1 glass px-2 py-1 rounded"
              disabled={editMode}
            >
              <Download size={14} />
              <span>Download</span>
            </button>
          </div>
        </div>

        <div className="h-96" ref={el => chartRefs.current['subjectOverview'] = el}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
              data={overviewData} 
              margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
              barSize={20}
              barGap={10}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis 
                dataKey="subject" 
                stroke="rgba(255,255,255,0.5)"
                angle={-45}
                textAnchor="end"
                tick={{fontSize: 12}}
                height={60}
              />
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
              <Bar dataKey="students" name="No. of Students" fill="#0f5ea2" radius={[4, 4, 0, 0]} />
              <Bar dataKey="passed" name="No. of Pass" fill="#4ade80" radius={[4, 4, 0, 0]} />
              <Bar dataKey="failed" name="No. of Fail" fill="#f17831" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {showDetails && (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full">
              <thead className="text-xs">
                <tr className="border-b border-white/10">
                  <th className="pb-2 text-left">Subject</th>
                  <th className="pb-2 text-right">No. of Students</th>
                  <th className="pb-2 text-right">No. of Pass</th>
                  <th className="pb-2 text-right">No. of Fail</th>
                  <th className="pb-2 text-right">Pass Rate</th>
                  <th className="pb-2 text-right">Fail Rate</th>
                </tr>
              </thead>
              <tbody className="text-xs">
                {overviewData.map((item: any, index: number) => {
                  const total = item.passed + item.failed;
                  const passRate = Math.round((item.passed / total) * 100);
                  const failRate = 100 - passRate;
                  
                  return (
                    <tr key={index} className="border-b border-white/5">
                      <td className="py-2">{item.subject}</td>
                      <td className="py-2 text-right">{total}</td>
                      <td className="py-2 text-right">{item.passed}</td>
                      <td className="py-2 text-right">{item.failed}</td>
                      <td className="py-2 text-right">{passRate}%</td>
                      <td className="py-2 text-right">{failRate}%</td>
                    </tr>
                  );
                })}
                <tr className="font-medium bg-white/5">
                  <td className="py-2">OVERALL</td>
                  <td className="py-2 text-right">{totalPassed + totalFailed}</td>
                  <td className="py-2 text-right">{totalPassed}</td>
                  <td className="py-2 text-right">{totalFailed}</td>
                  <td className="py-2 text-right">{passRate}%</td>
                  <td className="py-2 text-right">{failRate}%</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
        
        <div className="flex justify-end mt-2">
          <button
            onClick={() => exportAsCSV(overviewData, 'subject-overview')}
            className="text-sm flex items-center gap-1 glass px-2 py-1 rounded"
            disabled={editMode}
          >
            <FileText size={14} />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* We keep the original stacked bar charts for pass/fail distribution and pass percentage */}
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

      {/* OVERALL PASS-FAIL Pie Chart */}
      <div className="glass rounded-xl p-4">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-medium">OVERALL PASS - FAIL</h3>
          <button
            onClick={() => downloadChart('overallPassFail', 'Overall-PassFail')}
            className="text-sm flex items-center gap-1 glass px-2 py-1 rounded"
            disabled={editMode}
          >
            <Download size={14} />
            <span>Download</span>
          </button>
        </div>
        
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/2 h-64" ref={el => chartRefs.current['overallPassFail'] = el}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                data={pieChartData} 
                margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="name" stroke="rgba(255,255,255,0.5)" />
                <YAxis stroke="rgba(255,255,255,0.5)" domain={[0, 100]} />
                <Tooltip 
                  formatter={(value) => [`${value}%`, '']}
                  contentStyle={{ 
                    backgroundColor: theme === 'dark' ? 'rgba(30,30,30,0.8)' : 'rgba(255,255,255,0.8)', 
                    color: theme === 'dark' ? '#fff' : '#000',
                    borderRadius: '8px', 
                    border: 'none',
                    boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' 
                  }}
                />
                <Legend />
                {pieChartData.map((entry, index) => (
                  <Bar 
                    key={`bar-${index}`}
                    dataKey="value"
                    name={entry.name}
                    fill={entry.color}
                    radius={[4, 4, 0, 0]}
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          <div className="md:w-1/2 flex items-center justify-center">
            <div className="text-center">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col items-center p-4 glass rounded-lg">
                  <div className="text-4xl font-bold text-[#0f5ea2]">{passRate}%</div>
                  <div className="text-sm mt-1">Pass Rate</div>
                </div>
                <div className="flex flex-col items-center p-4 glass rounded-lg">
                  <div className="text-4xl font-bold text-[#f17831]">{failRate}%</div>
                  <div className="text-sm mt-1">Fail Rate</div>
                </div>
              </div>
              <div className="mt-4 text-sm">
                Total Students: <span className="font-medium">{totalPassed + totalFailed}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubjectPerformance;
