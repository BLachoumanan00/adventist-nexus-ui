
import React, { useState, useRef } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Download, FileText, ChevronDown, FileSpreadsheet, Palette } from "lucide-react";
import * as XLSX from "xlsx";
import { ChromePicker } from 'react-color';
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

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

// Default chart colors
const defaultChartColors = {
  totalStudents: "#0f5ea2",
  passedStudents: "#4ade80",
  failedStudents: "#f17831",
  passedBar: "#4ade80",
  failedBar: "#f87171",
  passPercentage: "#60a5fa",
  pass: "#0f5ea2",
  fail: "#f17831"
};

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
  const xlsxExportRef = useRef<HTMLButtonElement>(null);
  const [chartColors, setChartColors] = useState(defaultChartColors);
  const [activeColorPicker, setActiveColorPicker] = useState<string | null>(null);
  
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
  const subjectGroups: Record<string, {
    subject: string;
    students: number;
    passed: number;
    failed: number;
  }> = subjectPassFailData.reduce((groups, item) => {
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
  }, {} as Record<string, {
    subject: string;
    students: number;
    passed: number;
    failed: number;
  }>);

  const overviewData = Object.values(subjectGroups);

  // Calculate overall pass/fail statistics
  const totalPassed = overviewData.reduce((sum, item) => sum + item.passed, 0);
  const totalFailed = overviewData.reduce((sum, item) => sum + item.failed, 0);
  const totalStudents = totalPassed + totalFailed;
  const passRate = totalStudents > 0 ? Math.round((totalPassed / totalStudents) * 100) : 0;
  const failRate = 100 - passRate;

  // Prepare the pie chart data
  const pieChartData = [
    { name: "Pass", value: passRate, color: chartColors.pass },
    { name: "Fail", value: failRate, color: chartColors.fail }
  ];

  // Function to update chart colors
  const handleColorChange = (colorKey: string, color: string) => {
    setChartColors({
      ...chartColors,
      [colorKey]: color
    });
  };

  // Function to export all data to Excel with charts
  const exportToExcel = () => {
    // Create workbook and add worksheets
    const wb = XLSX.utils.book_new();
    
    // Overview data
    const overviewWs = XLSX.utils.json_to_sheet(overviewData);
    XLSX.utils.book_append_sheet(wb, overviewWs, "Subject Overview");
    
    // Pass/Fail data
    const passFailData = stackedData.map(item => ({
      Subject: item.subject,
      "Pass Count": item.passed,
      "Fail Count": item.failed,
      "Total Students": item.total,
      "Pass Percentage": `${item.passPercentage}%`
    }));
    const passFailWs = XLSX.utils.json_to_sheet(passFailData);
    XLSX.utils.book_append_sheet(wb, passFailWs, "Pass-Fail Distribution");
    
    // Overall summary
    const summaryData = [
      { Metric: "Total Students", Value: totalStudents },
      { Metric: "Students Passed", Value: totalPassed },
      { Metric: "Students Failed", Value: totalFailed },
      { Metric: "Pass Rate", Value: `${passRate}%` },
      { Metric: "Fail Rate", Value: `${failRate}%` }
    ];
    const summaryWs = XLSX.utils.json_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(wb, summaryWs, "Overall Summary");

    // Add chart data and setup for Excel to potentially render charts
    // This is a simplified approach as Excel doesn't fully support chart embedding via XLSX
    // For actual chart rendering in Excel, consider using a library like ExcelJS
    
    // Add chart metadata to help generate charts in Excel
    const chartMetadataWs = XLSX.utils.aoa_to_sheet([
      ["Chart Type", "Data Sheet", "Title", "X Axis", "Y Axis", "Series"],
      ["Bar", "Subject Overview", "Subject-wise Overview", "Subject", "Number of Students", "Total Students,Passed Students,Failed Students"],
      ["Bar", "Pass-Fail Distribution", "Pass/Fail Distribution", "Subject", "Students Count", "Pass Count,Fail Count"],
      ["Bar", "Pass-Fail Distribution", "Pass Percentage", "Subject", "Percentage", "Pass Percentage"],
      ["Pie", "Overall Summary", "Overall Pass/Fail", "Category", "Value", "Pass Rate,Fail Rate"]
    ]);
    XLSX.utils.book_append_sheet(wb, chartMetadataWs, "Chart Metadata");
    
    // Generate Excel file
    XLSX.writeFile(wb, `Subject-Performance-${selectedClass}-${new Date().toISOString().slice(0,10)}.xlsx`);
  };

  // Color picker component
  const ColorPickerPopover = ({ colorKey, label }: { colorKey: string, label: string }) => (
    <Popover open={activeColorPicker === colorKey} onOpenChange={(open) => setActiveColorPicker(open ? colorKey : null)}>
      <PopoverTrigger asChild>
        <button
          className="text-xs flex items-center gap-1 glass px-2 py-1 rounded"
          aria-label={`Change ${label} color`}
        >
          <div 
            className="w-3 h-3 rounded-full" 
            style={{ backgroundColor: chartColors[colorKey as keyof typeof chartColors] }}
          />
          <span>{label}</span>
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="end">
        <ChromePicker 
          color={chartColors[colorKey as keyof typeof chartColors]} 
          onChangeComplete={(color) => handleColorChange(colorKey, color.hex)}
        />
      </PopoverContent>
    </Popover>
  );

  return (
    <div className="grid grid-cols-1 gap-6">
      {/* Overall Statistics Chart */}
      <div className="glass rounded-xl p-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3 gap-2">
          <h3 className="font-medium">Subject-wise Pass/Fail Overview</h3>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="text-sm flex items-center gap-1 glass px-2 py-1 rounded"
            >
              <span>{showDetails ? 'Hide Details' : 'Show Details'}</span>
              <ChevronDown size={14} className={`transform transition-transform ${showDetails ? 'rotate-180' : ''}`} />
            </button>
            
            <div className="flex items-center gap-1 glass px-2 py-1 rounded">
              <Palette size={14} />
              <span className="text-xs">Colors:</span>
              <div className="flex gap-1 ml-1">
                <ColorPickerPopover colorKey="totalStudents" label="Total" />
                <ColorPickerPopover colorKey="passedStudents" label="Pass" />
                <ColorPickerPopover colorKey="failedStudents" label="Fail" />
              </div>
            </div>
            
            <button
              onClick={() => downloadChart('subjectOverview', 'Subject-Overview')}
              className="text-sm flex items-center gap-1 glass px-2 py-1 rounded"
              disabled={editMode}
            >
              <Download size={14} />
              <span>Download</span>
            </button>
            <button
              ref={xlsxExportRef}
              onClick={exportToExcel}
              className="text-sm flex items-center gap-1 glass px-2 py-1 rounded text-green-600 dark:text-green-400"
              disabled={editMode}
            >
              <FileSpreadsheet size={14} />
              <span>Excel</span>
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
                label={{ value: "Subjects", position: "insideBottom", offset: -15, fill: "rgba(255,255,255,0.5)" }}
              />
              <YAxis 
                stroke="rgba(255,255,255,0.5)"
                label={{ value: "Number of Students", angle: -90, position: "insideLeft", fill: "rgba(255,255,255,0.5)" }}
              />
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
              <Bar dataKey="students" name="Total Students" fill={chartColors.totalStudents} radius={[4, 4, 0, 0]} />
              <Bar dataKey="passed" name="Passed Students" fill={chartColors.passedStudents} radius={[4, 4, 0, 0]} />
              <Bar dataKey="failed" name="Failed Students" fill={chartColors.failedStudents} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {showDetails && (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full">
              <thead className="text-xs">
                <tr className="border-b border-white/10">
                  <th className="pb-2 text-left">Subject</th>
                  <th className="pb-2 text-right">Total Students</th>
                  <th className="pb-2 text-right">Passed</th>
                  <th className="pb-2 text-right">Failed</th>
                  <th className="pb-2 text-right">Pass Rate</th>
                  <th className="pb-2 text-right">Fail Rate</th>
                </tr>
              </thead>
              <tbody className="text-xs">
                {overviewData.map((item, index) => {
                  const total = item.passed + item.failed;
                  const passRate = total > 0 ? Math.round((item.passed / total) * 100) : 0;
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
                  <td className="py-2 text-right">{totalStudents}</td>
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

      {/* Subject Pass/Fail Distribution and Pass Percentage Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Subject Pass/Fail Chart */}
        <div className="glass rounded-xl p-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3 gap-2">
            <h3 className="font-medium">Subject-wise Pass/Fail Distribution</h3>
            <div className="flex flex-wrap gap-2">
              <div className="flex items-center gap-1 glass px-2 py-1 rounded">
                <Palette size={14} />
                <span className="text-xs">Colors:</span>
                <div className="flex gap-1 ml-1">
                  <ColorPickerPopover colorKey="passedBar" label="Pass" />
                  <ColorPickerPopover colorKey="failedBar" label="Fail" />
                </div>
              </div>
              
              <button
                onClick={() => downloadChart('subjectPassFail', 'Subject-PassFail')}
                className="text-sm flex items-center gap-1 glass px-2 py-1 rounded"
                disabled={editMode}
              >
                <Download size={14} />
                <span>Download</span>
              </button>
              <button
                onClick={() => {
                  const passFailData = stackedData.map(item => ({
                    Subject: item.subject,
                    "Pass Count": item.passed,
                    "Fail Count": item.failed,
                    "Total Students": item.total
                  }));
                  const wb = XLSX.utils.book_new();
                  const ws = XLSX.utils.json_to_sheet(passFailData);
                  XLSX.utils.book_append_sheet(wb, ws, "Pass-Fail Distribution");
                  
                  // Add chart metadata
                  const chartMetadataWs = XLSX.utils.aoa_to_sheet([
                    ["Chart Type", "Data Sheet", "Title", "X Axis", "Y Axis", "Series"],
                    ["StackedBar", "Pass-Fail Distribution", "Subject-wise Pass/Fail Distribution", "Subject", "Students Count", "Pass Count,Fail Count"]
                  ]);
                  XLSX.utils.book_append_sheet(wb, chartMetadataWs, "Chart Metadata");
                  
                  XLSX.writeFile(wb, `Pass-Fail-Distribution-${selectedClass}-${new Date().toISOString().slice(0,10)}.xlsx`);
                }}
                className="text-sm flex items-center gap-1 glass px-2 py-1 rounded text-green-600 dark:text-green-400"
                disabled={editMode}
              >
                <FileSpreadsheet size={14} />
                <span>Excel</span>
              </button>
            </div>
          </div>
          
          <div className="h-80" ref={el => chartRefs.current['subjectPassFail'] = el}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                data={stackedData} 
                margin={{ top: 5, right: 20, bottom: 30, left: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis 
                  dataKey="subject" 
                  stroke="rgba(255,255,255,0.5)" 
                  label={{ value: "Subjects", position: "insideBottom", offset: -10, fill: "rgba(255,255,255,0.5)" }}
                />
                <YAxis 
                  stroke="rgba(255,255,255,0.5)" 
                  label={{ value: "Students Count", angle: -90, position: "insideLeft", fill: "rgba(255,255,255,0.5)" }}
                />
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
                <Bar dataKey="passed" name="Passed" stackId="a" fill={chartColors.passedBar} radius={[4, 4, 0, 0]} />
                <Bar dataKey="failed" name="Failed" stackId="a" fill={chartColors.failedBar} radius={[4, 4, 0, 0]} />
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
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3 gap-2">
            <h3 className="font-medium">Subject Pass Percentage</h3>
            <div className="flex flex-wrap gap-2">
              <div className="flex items-center gap-1 glass px-2 py-1 rounded">
                <Palette size={14} />
                <span className="text-xs">Color:</span>
                <div className="flex gap-1 ml-1">
                  <ColorPickerPopover colorKey="passPercentage" label="Percentage" />
                </div>
              </div>
              
              <button
                onClick={() => downloadChart('subjectPassPercentage', 'Subject-Pass-Percentage')}
                className="text-sm flex items-center gap-1 glass px-2 py-1 rounded"
                disabled={editMode}
              >
                <Download size={14} />
                <span>Download</span>
              </button>
              <button
                onClick={() => {
                  const passPercentageData = stackedData.map(item => ({
                    Subject: item.subject,
                    "Pass Percentage": item.passPercentage
                  }));
                  const wb = XLSX.utils.book_new();
                  const ws = XLSX.utils.json_to_sheet(passPercentageData);
                  XLSX.utils.book_append_sheet(wb, ws, "Pass Percentage");
                  
                  // Add chart metadata
                  const chartMetadataWs = XLSX.utils.aoa_to_sheet([
                    ["Chart Type", "Data Sheet", "Title", "X Axis", "Y Axis", "Series"],
                    ["Column", "Pass Percentage", "Subject Pass Percentage", "Subject", "Pass Percentage (%)", "Pass Percentage"]
                  ]);
                  XLSX.utils.book_append_sheet(wb, chartMetadataWs, "Chart Metadata");
                  
                  XLSX.writeFile(wb, `Pass-Percentage-${selectedClass}-${new Date().toISOString().slice(0,10)}.xlsx`);
                }}
                className="text-sm flex items-center gap-1 glass px-2 py-1 rounded text-green-600 dark:text-green-400"
                disabled={editMode}
              >
                <FileSpreadsheet size={14} />
                <span>Excel</span>
              </button>
            </div>
          </div>
          
          <div className="h-80" ref={el => chartRefs.current['subjectPassPercentage'] = el}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                data={stackedData} 
                margin={{ top: 5, right: 20, bottom: 30, left: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis 
                  dataKey="subject" 
                  stroke="rgba(255,255,255,0.5)" 
                  label={{ value: "Subjects", position: "insideBottom", offset: -10, fill: "rgba(255,255,255,0.5)" }}
                />
                <YAxis 
                  stroke="rgba(255,255,255,0.5)" 
                  domain={[0, 100]} 
                  label={{ value: "Pass Percentage (%)", angle: -90, position: "insideLeft", fill: "rgba(255,255,255,0.5)" }}
                />
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
                  fill={chartColors.passPercentage}
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

      {/* OVERALL PASS-FAIL Chart */}
      <div className="glass rounded-xl p-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3 gap-2">
          <h3 className="font-medium">OVERALL PASS - FAIL</h3>
          <div className="flex flex-wrap gap-2">
            <div className="flex items-center gap-1 glass px-2 py-1 rounded">
              <Palette size={14} />
              <span className="text-xs">Colors:</span>
              <div className="flex gap-1 ml-1">
                <ColorPickerPopover colorKey="pass" label="Pass" />
                <ColorPickerPopover colorKey="fail" label="Fail" />
              </div>
            </div>
            
            <button
              onClick={() => downloadChart('overallPassFail', 'Overall-PassFail')}
              className="text-sm flex items-center gap-1 glass px-2 py-1 rounded"
              disabled={editMode}
            >
              <Download size={14} />
              <span>Download</span>
            </button>
            <button
              onClick={() => {
                const summaryData = [
                  { Metric: "Total Students", Value: totalStudents },
                  { Metric: "Students Passed", Value: totalPassed },
                  { Metric: "Students Failed", Value: totalFailed },
                  { Metric: "Pass Rate", Value: passRate },
                  { Metric: "Fail Rate", Value: failRate }
                ];
                const wb = XLSX.utils.book_new();
                const ws = XLSX.utils.json_to_sheet(summaryData);
                XLSX.utils.book_append_sheet(wb, ws, "Overall Summary");
                
                // Add pie chart data in a format better for Excel charts
                const pieData = [
                  { Category: "Pass", Value: passRate },
                  { Category: "Fail", Value: failRate }
                ];
                const pieWs = XLSX.utils.json_to_sheet(pieData);
                XLSX.utils.book_append_sheet(wb, pieWs, "Pass Fail Pie");
                
                // Add chart metadata
                const chartMetadataWs = XLSX.utils.aoa_to_sheet([
                  ["Chart Type", "Data Sheet", "Title", "Category Field", "Value Field"],
                  ["Pie", "Pass Fail Pie", "Overall Pass/Fail Distribution", "Category", "Value"]
                ]);
                XLSX.utils.book_append_sheet(wb, chartMetadataWs, "Chart Metadata");
                
                XLSX.writeFile(wb, `Overall-Summary-${selectedClass}-${new Date().toISOString().slice(0,10)}.xlsx`);
              }}
              className="text-sm flex items-center gap-1 glass px-2 py-1 rounded text-green-600 dark:text-green-400"
              disabled={editMode}
            >
              <FileSpreadsheet size={14} />
              <span>Excel</span>
            </button>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/2 h-64" ref={el => chartRefs.current['overallPassFail'] = el}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                data={pieChartData} 
                margin={{ top: 5, right: 20, bottom: 30, left: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis 
                  dataKey="name" 
                  stroke="rgba(255,255,255,0.5)" 
                  label={{ value: "Status", position: "insideBottom", offset: -10, fill: "rgba(255,255,255,0.5)" }}
                />
                <YAxis 
                  stroke="rgba(255,255,255,0.5)" 
                  domain={[0, 100]} 
                  label={{ value: "Percentage (%)", angle: -90, position: "insideLeft", fill: "rgba(255,255,255,0.5)" }}
                />
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
                  <div className="text-4xl font-bold" style={{ color: chartColors.pass }}>{passRate}%</div>
                  <div className="text-sm mt-1">Pass Rate</div>
                </div>
                <div className="flex flex-col items-center p-4 glass rounded-lg">
                  <div className="text-4xl font-bold" style={{ color: chartColors.fail }}>{failRate}%</div>
                  <div className="text-sm mt-1">Fail Rate</div>
                </div>
              </div>
              <div className="mt-4 text-sm">
                Total Students: <span className="font-medium">{totalStudents}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubjectPerformance;
