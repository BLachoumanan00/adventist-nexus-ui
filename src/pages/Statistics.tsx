
import React, { useState, useEffect, useRef } from "react";
import { BarChart as BarChartIcon, ChevronDown, Edit, PieChart as PieChartIcon, Save, Download, FileText, GraduationCap } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import { useActivityLogger } from "../hooks/useActivityLogger";
import { useToast } from "../hooks/use-toast";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../components/ui/tabs";
import { useTheme } from "../hooks/useTheme";

const Statistics: React.FC = () => {
  const [selectedGrade, setSelectedGrade] = useState("All Grades");
  const [selectedTerm, setSelectedTerm] = useState("Term 1");
  const [editMode, setEditMode] = useState(false);
  const [viewMode, setViewMode] = useState<'overall' | 'class' | 'subject'>('overall');
  const { logActivity } = useActivityLogger();
  const { toast } = useToast();
  const { theme } = useTheme();
  const chartRefs = useRef<{[key: string]: HTMLDivElement | null}>({});
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [hasChanges, setHasChanges] = useState(false);
  
  const [subjectPerformanceData, setSubjectPerformanceData] = useState([
    { subject: "Math", average: 76, passing: 88 },
    { subject: "Science", average: 72, passing: 84 },
    { subject: "English", average: 82, passing: 92 },
    { subject: "History", average: 68, passing: 78 },
    { subject: "Geography", average: 75, passing: 86 },
    { subject: "Computer", average: 88, passing: 95 },
  ]);
  
  const [classPerformanceData, setClassPerformanceData] = useState([
    { class: "8A", average: 82, passing: 94, topSubject: "Math" },
    { class: "8B", average: 78, passing: 88, topSubject: "English" },
    { class: "9A", average: 75, passing: 86, topSubject: "Science" },
    { class: "9B", average: 80, passing: 90, topSubject: "Computer" },
    { class: "10A", average: 72, passing: 82, topSubject: "Geography" },
    { class: "10B", average: 74, passing: 84, topSubject: "History" },
  ]);
  
  const [subjectWiseData, setSubjectWiseData] = useState([
    { subject: "Math", "8A": 82, "8B": 74, "9A": 78, "9B": 72, "10A": 68, "10B": 76 },
    { subject: "Science", "8A": 78, "8B": 72, "9A": 80, "9B": 76, "10A": 70, "10B": 74 },
    { subject: "English", "8A": 84, "8B": 80, "9A": 76, "9B": 78, "10A": 72, "10B": 70 },
    { subject: "History", "8A": 72, "8B": 68, "9A": 74, "9B": 70, "10A": 66, "10B": 72 },
  ]);
  
  const [gradeDistributionData, setGradeDistributionData] = useState([
    { name: "A", value: 32, color: "#4ade80" },
    { name: "B", value: 45, color: "#60a5fa" },
    { name: "C", value: 18, color: "#facc15" },
    { name: "D", value: 4, color: "#f87171" },
    { name: "F", value: 1, color: "#ef4444" },
  ]);
  
  const [attendanceData, setAttendanceData] = useState([
    { name: "Present", value: 92, color: "#4ade80" },
    { name: "Absent", value: 5, color: "#f87171" },
    { name: "Late", value: 3, color: "#facc15" },
  ]);
  
  const [classComparisonData, setClassComparisonData] = useState([
    { class: "8A", math: 78, science: 74, english: 84 },
    { class: "8B", math: 72, science: 70, english: 80 },
    { class: "8C", math: 80, science: 76, english: 82 },
    { class: "9A", math: 76, science: 72, english: 88 },
    { class: "9B", math: 74, science: 68, english: 86 },
  ]);
  
  const [editableSubjectData, setEditableSubjectData] = useState([...subjectPerformanceData]);
  const [editableGradeData, setEditableGradeData] = useState([...gradeDistributionData]);
  const [editableAttendanceData, setEditableAttendanceData] = useState([...attendanceData]);
  const [editableClassData, setEditableClassData] = useState([...classComparisonData]);
  const [editableClassPerformanceData, setEditableClassPerformanceData] = useState([...classPerformanceData]);
  const [editableSubjectWiseData, setEditableSubjectWiseData] = useState([...subjectWiseData]);

  useEffect(() => {
    if (editMode) {
      setEditableSubjectData([...subjectPerformanceData]);
      setEditableGradeData([...gradeDistributionData]);
      setEditableAttendanceData([...attendanceData]);
      setEditableClassData([...classComparisonData]);
      setEditableClassPerformanceData([...classPerformanceData]);
      setEditableSubjectWiseData([...subjectWiseData]);
    }
  }, [editMode]);
  
  // Load data from localStorage
  useEffect(() => {
    const savedStatisticsData = localStorage.getItem('statisticsData');
    if (savedStatisticsData) {
      try {
        const parsedData = JSON.parse(savedStatisticsData);
        if (parsedData.subjectPerformanceData) setSubjectPerformanceData(parsedData.subjectPerformanceData);
        if (parsedData.classPerformanceData) setClassPerformanceData(parsedData.classPerformanceData);
        if (parsedData.subjectWiseData) setSubjectWiseData(parsedData.subjectWiseData);
        if (parsedData.gradeDistributionData) setGradeDistributionData(parsedData.gradeDistributionData);
        if (parsedData.attendanceData) setAttendanceData(parsedData.attendanceData);
        if (parsedData.classComparisonData) setClassComparisonData(parsedData.classComparisonData);
      } catch (error) {
        console.error('Error loading saved statistics data:', error);
      }
    }
  }, []);
  
  // Autosave functionality
  useEffect(() => {
    if (!autoSaveEnabled || !hasChanges) return;
    
    const timer = setTimeout(() => {
      saveDataToLocalStorage();
      setLastSaved(new Date());
      setHasChanges(false);
      
      toast({
        title: "Statistics Autosaved",
        description: `All statistics data has been automatically saved at ${new Date().toLocaleTimeString()}`
      });
    }, 60000); // Autosave after 1 minute of inactivity
    
    return () => clearTimeout(timer);
  }, [
    subjectPerformanceData, classPerformanceData, subjectWiseData, 
    gradeDistributionData, attendanceData, classComparisonData, 
    hasChanges, autoSaveEnabled
  ]);
  
  // Mark changes when data is modified
  useEffect(() => {
    setHasChanges(true);
  }, [
    subjectPerformanceData, classPerformanceData, subjectWiseData, 
    gradeDistributionData, attendanceData, classComparisonData
  ]);
  
  const handleSaveChanges = () => {
    setSubjectPerformanceData([...editableSubjectData]);
    setGradeDistributionData([...editableGradeData]);
    setAttendanceData([...editableAttendanceData]);
    setClassComparisonData([...editableClassData]);
    setClassPerformanceData([...editableClassPerformanceData]);
    setSubjectWiseData([...editableSubjectWiseData]);
    setEditMode(false);
    setHasChanges(true);
    
    logActivity("Updated Statistics Data", `Updated ${viewMode} data for ${selectedGrade} - ${selectedTerm}`);
    
    toast({
      title: "Statistics Saved",
      description: "Your changes to the statistics data have been saved.",
    });
  };
  
  // Save data to localStorage
  const saveDataToLocalStorage = () => {
    const dataToSave = {
      subjectPerformanceData,
      classPerformanceData,
      subjectWiseData,
      gradeDistributionData,
      attendanceData,
      classComparisonData,
      savedAt: new Date().toISOString()
    };
    
    localStorage.setItem('statisticsData', JSON.stringify(dataToSave));
    setLastSaved(new Date());
    setHasChanges(false);
    
    toast({
      title: "Statistics Saved",
      description: "All statistics data has been saved."
    });
  };
  
  // Backup data
  const backupData = () => {
    const dataToBackup = {
      subjectPerformanceData,
      classPerformanceData,
      subjectWiseData,
      gradeDistributionData,
      attendanceData,
      classComparisonData,
      savedAt: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(dataToBackup);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `statistics-backup-${new Date().toISOString().slice(0,10)}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    toast({
      title: "Backup Created",
      description: "All statistics data has been backed up to a local file."
    });
    logActivity("Created Statistics Backup", `Backup file: ${exportFileDefaultName}`);
  };
  
  // Restore from backup
  const restoreFromBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsedData = JSON.parse(event.target?.result as string);
        
        // Validate and update data
        if (parsedData.subjectPerformanceData) setSubjectPerformanceData(parsedData.subjectPerformanceData);
        if (parsedData.classPerformanceData) setClassPerformanceData(parsedData.classPerformanceData);
        if (parsedData.subjectWiseData) setSubjectWiseData(parsedData.subjectWiseData);
        if (parsedData.gradeDistributionData) setGradeDistributionData(parsedData.gradeDistributionData);
        if (parsedData.attendanceData) setAttendanceData(parsedData.attendanceData);
        if (parsedData.classComparisonData) setClassComparisonData(parsedData.classComparisonData);
        
        toast({
          title: "Backup Restored",
          description: `Statistics data restored from backup created on ${new Date(parsedData.savedAt).toLocaleString()}`
        });
        logActivity("Restored Statistics From Backup", `Backup date: ${new Date(parsedData.savedAt).toLocaleString()}`);
      } catch (error) {
        console.error('Error restoring from backup:', error);
        toast({
          title: "Restore Failed",
          description: "The backup file format is invalid or corrupted.",
          variant: "destructive"
        });
      }
    };
    reader.readAsText(file);
  };
  
  // Convert SVG chart to image and download
  const downloadChart = (chartId: string, chartName: string) => {
    const chartElement = chartRefs.current[chartId];
    if (!chartElement) return;
    
    const svgElement = chartElement.querySelector('svg');
    if (!svgElement) return;
    
    // Create a clone of the SVG to modify
    const svgClone = svgElement.cloneNode(true) as SVGElement;
    
    // Set background to white for better visibility
    svgClone.style.backgroundColor = theme === 'dark' ? '#1f2937' : '#ffffff';
    
    // Convert SVG to string
    const svgData = new XMLSerializer().serializeToString(svgClone);
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const svgUrl = URL.createObjectURL(svgBlob);
    
    // Create canvas
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = function() {
      // Set canvas dimensions
      canvas.width = img.width;
      canvas.height = img.height;
      
      // Draw image to canvas
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        
        // Get image data and download
        canvas.toBlob(function(blob) {
          if (blob) {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${chartName}-${selectedGrade}-${selectedTerm}.png`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
          }
        });
      }
    };
    
    img.src = svgUrl;
    
    toast({
      title: "Chart Downloaded",
      description: `${chartName} chart has been downloaded as an image.`
    });
    logActivity("Downloaded Chart", `Downloaded ${chartName} chart for ${selectedGrade}, ${selectedTerm}`);
  };
  
  // Export statistics data as CSV
  const exportAsCSV = (data: any[], filename: string) => {
    if (!data || !data.length) return;
    
    // Get headers from first object
    const headers = Object.keys(data[0]);
    
    // Create CSV content
    const csvRows = [
      headers.join(','), // Header row
      ...data.map(row => 
        headers.map(header => {
          // Handle commas in data by wrapping in quotes
          const cell = row[header]?.toString() || '';
          return cell.includes(',') ? `"${cell}"` : cell;
        }).join(',')
      )
    ];
    
    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}-${new Date().toISOString().slice(0,10)}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Data Exported",
      description: `${filename} has been exported as a CSV file.`
    });
    logActivity("Exported Data", `Exported ${filename} as CSV`);
  };
  
  // Export all statistics data to Excel-friendly format
  const exportAllData = () => {
    // Create workbook-like structure with multiple sheets
    const dataPackage = {
      subjectPerformance: subjectPerformanceData,
      classPerformance: classPerformanceData,
      subjectWise: subjectWiseData,
      gradeDistribution: gradeDistributionData,
      attendance: attendanceData,
      classComparison: classComparisonData
    };
    
    // Convert to JSON
    const jsonString = JSON.stringify(dataPackage, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `all-statistics-data-${selectedGrade}-${selectedTerm}-${new Date().toISOString().slice(0,10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "All Data Exported",
      description: "Complete statistics dataset exported as JSON file."
    });
    logActivity("Exported All Statistics", `Exported complete statistics for ${selectedGrade}, ${selectedTerm}`);
  };
  
  const handleSubjectDataChange = (index: number, field: 'average' | 'passing', value: number) => {
    const newData = [...editableSubjectData];
    newData[index][field] = Math.min(100, Math.max(0, value));
    setEditableSubjectData(newData);
  };
  
  const handleClassPerformanceChange = (index: number, field: 'average' | 'passing', value: number) => {
    const newData = [...editableClassPerformanceData];
    newData[index][field] = Math.min(100, Math.max(0, value));
    setEditableClassPerformanceData(newData);
  };
  
  const handleSubjectWiseChange = (index: number, classKey: string, value: number) => {
    const newData = [...editableSubjectWiseData];
    newData[index][classKey] = Math.min(100, Math.max(0, value));
    setEditableSubjectWiseData(newData);
  };
  
  const handleGradeDataChange = (index: number, value: number) => {
    const newData = [...editableGradeData];
    newData[index].value = Math.max(0, value);
    setEditableGradeData(newData);
  };
  
  const handleAttendanceDataChange = (index: number, value: number) => {
    const newData = [...editableAttendanceData];
    newData[index].value = Math.max(0, value);
    setEditableAttendanceData(newData);
  };
  
  const handleClassDataChange = (index: number, field: 'math' | 'science' | 'english', value: number) => {
    const newData = [...editableClassData];
    newData[index][field] = Math.min(100, Math.max(0, value));
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
          
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2">
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
            </div>
            
            <div className="flex items-center gap-2">
              {/* Edit Button */}
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
              
              {/* Save Button */}
              <button 
                onClick={saveDataToLocalStorage}
                className="flex items-center gap-1 glass px-3 py-1.5 rounded-lg text-sm"
                disabled={editMode}
              >
                <Save size={14} />
                <span>Save</span>
              </button>
              
              {/* Export Button */}
              <button 
                onClick={exportAllData}
                className="flex items-center gap-1 glass px-3 py-1.5 rounded-lg text-sm"
                disabled={editMode}
              >
                <FileText size={14} />
                <span>Export All</span>
              </button>
              
              {/* Backup Button */}
              <button 
                onClick={backupData}
                className="flex items-center gap-1 glass px-3 py-1.5 rounded-lg text-sm"
                disabled={editMode}
              >
                <Download size={14} />
                <span>Backup</span>
              </button>
              
              {/* Restore Button */}
              <label className="flex items-center gap-1 glass px-3 py-1.5 rounded-lg text-sm cursor-pointer">
                <Upload size={14} />
                <span>Restore</span>
                <input
                  type="file"
                  accept=".json"
                  className="hidden"
                  disabled={editMode}
                  onChange={restoreFromBackup}
                />
              </label>
              
              {/* Auto Save Toggle */}
              <div className="flex items-center gap-2 glass px-3 py-1.5 rounded-lg">
                <input
                  type="checkbox"
                  id="stats-autosave"
                  checked={autoSaveEnabled}
                  onChange={() => setAutoSaveEnabled(!autoSaveEnabled)}
                  className="rounded"
                />
                <label htmlFor="stats-autosave" className="text-sm">Autosave</label>
              </div>
            </div>
          </div>
        </div>
        
        {/* View Mode Tabs */}
        <Tabs defaultValue="overall" className="mb-6" onValueChange={(value) => setViewMode(value as any)}>
          <TabsList className="grid w-full md:w-auto grid-cols-3">
            <TabsTrigger value="overall">Overall</TabsTrigger>
            <TabsTrigger value="class">Class-wise</TabsTrigger>
            <TabsTrigger value="subject">Subject-wise</TabsTrigger>
          </TabsList>
          
          {/* Overall Statistics Tab */}
          <TabsContent value="overall">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* Subject Performance Chart */}
              <div className="glass rounded-xl p-4">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-medium">Subject Performance</h3>
                  <button
                    onClick={() => downloadChart('subjectPerformance', 'Subject-Performance')}
                    className="text-sm flex items-center gap-1 glass px-2 py-1 rounded"
                    disabled={editMode}
                  >
                    <Download size={14} />
                    <span>Download</span>
                  </button>
                </div>
                
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
                  <div className="h-80" ref={el => chartRefs.current['subjectPerformance'] = el}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={subjectPerformanceData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
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
                        <Bar dataKey="average" name="Average Score" fill="#9b87f5" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="passing" name="Passing Rate %" fill="#60a5fa" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}
                
                <div className="flex justify-end mt-2">
                  <button
                    onClick={() => exportAsCSV(subjectPerformanceData, 'subject-performance')}
                    className="text-sm flex items-center gap-1 glass px-2 py-1 rounded"
                    disabled={editMode}
                  >
                    <FileText size={14} />
                    <span>Export CSV</span>
                  </button>
                </div>
              </div>
              
              {/* Grade Distribution Chart */}
              <div className="glass rounded-xl p-4">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-medium">Grade Distribution</h3>
                  <button
                    onClick={() => downloadChart('gradeDistribution', 'Grade-Distribution')}
                    className="text-sm flex items-center gap-1 glass px-2 py-1 rounded"
                    disabled={editMode}
                  >
                    <Download size={14} />
                    <span>Download</span>
                  </button>
                </div>
                
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
                  <div className="h-80" ref={el => chartRefs.current['gradeDistribution'] = el}>
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
                            backgroundColor: theme === 'dark' ? 'rgba(30,30,30,0.8)' : 'rgba(255,255,255,0.8)', 
                            color: theme === 'dark' ? '#fff' : '#000',
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
                
                <div className="flex justify-end mt-2">
                  <button
                    onClick={() => exportAsCSV(gradeDistributionData, 'grade-distribution')}
                    className="text-sm flex items-center gap-1 glass px-2 py-1 rounded"
                    disabled={editMode}
                  >
                    <FileText size={14} />
                    <span>Export CSV</span>
                  </button>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Class Comparison Chart */}
              <div className="glass rounded-xl p-4">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-medium">Class Comparison</h3>
                  <button
                    onClick={() => downloadChart('classComparison', 'Class-Comparison')}
                    className="text-sm flex items-center gap-1 glass px-2 py-1 rounded"
                    disabled={editMode}
                  >
                    <Download size={14} />
                    <span>Download</span>
                  </button>
                </div>
                
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
                  <div className="h-80" ref={el => chartRefs.current['classComparison'] = el}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={classComparisonData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
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
                        <Bar dataKey="math" name="Mathematics" fill="#9b87f5" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="science" name="Science" fill="#60a5fa" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="english" name="English" fill="#4ade80" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}
                
                <div className="flex justify-end mt-2">
                  <button
                    onClick={() => exportAsCSV(classComparisonData, 'class-comparison')}
                    className="text-sm flex items-center gap-1 glass px-2 py-1 rounded"
                    disabled={editMode}
                  >
                    <FileText size={14} />
                    <span>Export CSV</span>
                  </button>
                </div>
              </div>
              
              {/* Attendance Overview Chart */}
              <div className="glass rounded-xl p-4">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-medium">Attendance Overview</h3>
                  <button
                    onClick={() => downloadChart('attendanceOverview', 'Attendance-Overview')}
                    className="text-sm flex items-center gap-1 glass px-2 py-1 rounded"
                    disabled={editMode}
                  >
                    <Download size={14} />
                    <span>Download</span>
                  </button>
                </div>
                
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
                  <div className="h-80" ref={el => chartRefs.current['attendanceOverview'] = el}>
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
                            backgroundColor: theme === 'dark' ? 'rgba(30,30,30,0.8)' : 'rgba(255,255,255,0.8)', 
                            color: theme === 'dark' ? '#fff' : '#000',
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
                
                <div className="flex justify-end mt-2">
                  <button
                    onClick={() => exportAsCSV(attendanceData, 'attendance-overview')}
                    className="text-sm flex items-center gap-1 glass px-2 py-1 rounded"
                    disabled={editMode}
                  >
                    <FileText size={14} />
                    <span>Export CSV</span>
                  </button>
                </div>
              </div>
            </div>
          </TabsContent>
          
          {/* Class-wise Statistics Tab */}
          <TabsContent value="class">
            <div className="glass rounded-xl p-4">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-medium">Class-wise Performance</h3>
                <button
                  onClick={() => downloadChart('classPerformance', 'Class-wise-Performance')}
                  className="text-sm flex items-center gap-1 glass px-2 py-1 rounded"
                  disabled={editMode}
                >
                  <Download size={14} />
                  <span>Download</span>
                </button>
              </div>
              
              {editMode ? (
                <div className="mb-4 overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="pb-2 text-left text-sm">Class</th>
                        <th className="pb-2 text-left text-sm">Average Score</th>
                        <th className="pb-2 text-left text-sm">Passing Rate %</th>
                        <th className="pb-2 text-left text-sm">Top Subject</th>
                      </tr>
                    </thead>
                    <tbody>
                      {editableClassPerformanceData.map((item, index) => (
                        <tr key={index} className="border-b border-white/5">
                          <td className="py-2">{item.class}</td>
                          <td className="py-2">
                            <input 
                              type="number"
                              value={item.average}
                              min={0}
                              max={100}
                              onChange={(e) => handleClassPerformanceChange(index, 'average', parseInt(e.target.value) || 0)}
                              className="w-20 glass rounded px-2 py-1"
                            />
                          </td>
                          <td className="py-2">
                            <input 
                              type="number"
                              value={item.passing}
                              min={0}
                              max={100}
                              onChange={(e) => handleClassPerformanceChange(index, 'passing', parseInt(e.target.value) || 0)}
                              className="w-20 glass rounded px-2 py-1"
                            />
                          </td>
                          <td className="py-2">{item.topSubject}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="h-80" ref={el => chartRefs.current['classPerformance'] = el}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={classPerformanceData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
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
              )}
              
              <div className="flex justify-end mt-2">
                <button
                  onClick={() => exportAsCSV(classPerformanceData, 'class-wise-performance')}
                  className="text-sm flex items-center gap-1 glass px-2 py-1 rounded"
                  disabled={editMode}
                >
                  <FileText size={14} />
                  <span>Export CSV</span>
                </button>
              </div>
            </div>
          </TabsContent>
          
          {/* Subject-wise Statistics Tab */}
          <TabsContent value="subject">
            <div className="glass rounded-xl p-4">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-medium">Subject-wise Performance Across Classes</h3>
                <button
                  onClick={() => downloadChart('subjectWisePerformance', 'Subject-wise-Performance')}
                  className="text-sm flex items-center gap-1 glass px-2 py-1 rounded"
                  disabled={editMode}
                >
                  <Download size={14} />
                  <span>Download</span>
                </button>
              </div>
              
              {editMode ? (
                <div className="mb-4 overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="pb-2 text-left text-sm">Subject</th>
                        <th className="pb-2 text-left text-sm">8A</th>
                        <th className="pb-2 text-left text-sm">8B</th>
                        <th className="pb-2 text-left text-sm">9A</th>
                        <th className="pb-2 text-left text-sm">9B</th>
                        <th className="pb-2 text-left text-sm">10A</th>
                        <th className="pb-2 text-left text-sm">10B</th>
                      </tr>
                    </thead>
                    <tbody>
                      {editableSubjectWiseData.map((item, index) => (
                        <tr key={index} className="border-b border-white/5">
                          <td className="py-2">{item.subject}</td>
                          {["8A", "8B", "9A", "9B", "10A", "10B"].map((classKey) => (
                            <td className="py-2" key={classKey}>
                              <input 
                                type="number"
                                value={item[classKey]}
                                min={0}
                                max={100}
                                onChange={(e) => handleSubjectWiseChange(index, classKey, parseInt(e.target.value) || 0)}
                                className="w-20 glass rounded px-2 py-1"
                              />
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="h-80" ref={el => chartRefs.current['subjectWisePerformance'] = el}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={subjectWiseData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
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
                      {["8A", "8B", "9A", "9B", "10A", "10B"].map((classKey, index) => (
                        <Line 
                          key={classKey}
                          type="monotone"
                          dataKey={classKey}
                          name={`Class ${classKey}`}
                          stroke={["#9b87f5", "#60a5fa", "#4ade80", "#facc15", "#f87171", "#ef4444"][index % 6]}
                          strokeWidth={2}
                          dot={{ r: 4 }}
                        />
                      ))}
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}
              
              <div className="flex justify-end mt-2">
                <button
                  onClick={() => exportAsCSV(subjectWiseData, 'subject-wise-across-classes')}
                  className="text-sm flex items-center gap-1 glass px-2 py-1 rounded"
                  disabled={editMode}
                >
                  <FileText size={14} />
                  <span>Export CSV</span>
                </button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        {autoSaveEnabled && lastSaved && !hasChanges && (
          <p className="text-sm text-foreground/60 mt-2">Last auto-saved at {lastSaved.toLocaleTimeString()}</p>
        )}
        
        {autoSaveEnabled && hasChanges && (
          <p className="text-sm text-foreground/60 mt-2">Changes will be auto-saved after 1 minute of inactivity</p>
        )}
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
