import React, { useState, useEffect, useRef } from "react";
import { BarChart as BarChartIcon, ChevronDown, Edit, PieChart as PieChartIcon, Save, Download, FileText, GraduationCap, Upload } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import { useActivityLogger } from "../hooks/useActivityLogger";
import { useToast } from "../hooks/use-toast";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../components/ui/tabs";
import { useTheme } from "../hooks/useTheme";
import { Switch } from "../components/ui/switch";
import ClassPerformance from "../components/statistics/ClassPerformance";
import SubjectPerformance from "../components/statistics/SubjectPerformance";
import BackupRestore from "../components/statistics/BackupRestore";

const Statistics: React.FC = () => {
  const [selectedGrade, setSelectedGrade] = useState("All Grades");
  const [selectedTerm, setSelectedTerm] = useState("Term 1");
  const [selectedClass, setSelectedClass] = useState("All");
  const [editMode, setEditMode] = useState(false);
  const [viewMode, setViewMode] = useState<'overall' | 'class' | 'subject' | 'backup'>('overall');
  const { logActivity } = useActivityLogger();
  const { toast } = useToast();
  const { theme } = useTheme();
  const chartRefs = useRef<{[key: string]: HTMLDivElement | null}>({});
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [hasChanges, setHasChanges] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [subjectPerformanceData, setSubjectPerformanceData] = useState([
    { subject: "Math", average: 76, passing: 88 },
    { subject: "Science", average: 72, passing: 84 },
    { subject: "English", average: 82, passing: 92 },
    { subject: "History", average: 68, passing: 78 },
    { subject: "Geography", average: 75, passing: 86 },
    { subject: "Computer", average: 88, passing: 95 },
  ]);
  
  const [classPerformanceData, setClassPerformanceData] = useState([
    { class: "7A", average: 82, passing: 94, topSubject: "Math" },
    { class: "7B", average: 78, passing: 88, topSubject: "English" },
    { class: "8A", average: 75, passing: 86, topSubject: "Science" },
    { class: "8B", average: 80, passing: 90, topSubject: "Computer" },
    { class: "9A", average: 72, passing: 82, topSubject: "Geography" },
    { class: "9B", average: 74, passing: 84, topSubject: "History" },
  ]);
  
  const [subjectWiseData, setSubjectWiseData] = useState([
    { subject: "Math", "7A": 82, "7B": 74, "8A": 78, "8B": 72, "9A": 68, "9B": 76 },
    { subject: "Science", "7A": 78, "7B": 72, "8A": 80, "8B": 76, "9A": 70, "9B": 74 },
    { subject: "English", "7A": 84, "7B": 80, "8A": 76, "8B": 78, "9A": 72, "9B": 70 },
    { subject: "History", "7A": 72, "7B": 68, "8A": 74, "8B": 70, "9A": 66, "9B": 72 },
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
    { class: "7A", math: 78, science: 74, english: 84 },
    { class: "7B", math: 72, science: 70, english: 80 },
    { class: "8A", math: 80, science: 76, english: 82 },
    { class: "8B", math: 76, science: 72, english: 88 },
    { class: "9A", math: 74, science: 68, english: 86 },
    { class: "9B", math: 70, science: 65, english: 82 },
  ]);
  
  const [subjectPassFailData, setSubjectPassFailData] = useState([
    { subject: "Math", passed: 24, failed: 6, class: "7A" },
    { subject: "Science", passed: 22, failed: 8, class: "7A" },
    { subject: "English", passed: 28, failed: 2, class: "7A" },
    { subject: "History", passed: 20, failed: 10, class: "7A" },
    { subject: "Geography", passed: 25, failed: 5, class: "7A" },
    { subject: "Computer", passed: 27, failed: 3, class: "7A" },
  ]);
  
  const [classPassFailData, setClassPassFailData] = useState([
    { name: "Passed", value: 85, color: "#4ade80", class: "7A" },
    { name: "Failed", value: 15, color: "#f87171", class: "7A" },
    { name: "Passed", value: 80, color: "#4ade80", class: "7B" },
    { name: "Failed", value: 20, color: "#f87171", class: "7B" },
    { name: "Passed", value: 75, color: "#4ade80", class: "8A" },
    { name: "Failed", value: 25, color: "#f87171", class: "8A" },
    { name: "Passed", value: 88, color: "#4ade80", class: "8B" },
    { name: "Failed", value: 12, color: "#f87171", class: "8B" },
    { name: "Passed", value: 70, color: "#4ade80", class: "9A" },
    { name: "Failed", value: 30, color: "#f87171", class: "9A" },
    { name: "Passed", value: 78, color: "#4ade80", class: "9B" },
    { name: "Failed", value: 22, color: "#f87171", class: "9B" },
  ]);

  const [editableSubjectData, setEditableSubjectData] = useState([...subjectPerformanceData]);
  const [editableGradeData, setEditableGradeData] = useState([...gradeDistributionData]);
  const [editableAttendanceData, setEditableAttendanceData] = useState([...attendanceData]);
  const [editableClassData, setEditableClassData] = useState([...classComparisonData]);
  const [editableClassPerformanceData, setEditableClassPerformanceData] = useState([...classPerformanceData]);
  const [editableSubjectWiseData, setEditableSubjectWiseData] = useState([...subjectWiseData]);
  const [editableSubjectPassFailData, setEditableSubjectPassFailData] = useState([...subjectPassFailData]);
  const [editableClassPassFailData, setEditableClassPassFailData] = useState([...classPassFailData]);

  const uniqueClasses = Array.from(
    new Set([
      ...classPerformanceData.map(item => item.class),
      ...Object.keys(subjectWiseData[0] || {}).filter(key => key !== 'subject')
    ])
  ).sort();

  const getGradeNumber = () => {
    if (selectedGrade === "All Grades") return null;
    return selectedGrade.replace("Grade ", "");
  };

  const getFilteredClasses = () => {
    const gradeNumber = getGradeNumber();
    
    if (!gradeNumber) return uniqueClasses;
    
    return uniqueClasses.filter(cls => cls.startsWith(gradeNumber));
  };
  
  useEffect(() => {
    const filteredClasses = getFilteredClasses();
    
    if (selectedClass !== "All" && !filteredClasses.includes(selectedClass)) {
      setSelectedClass("All");
    }
  }, [selectedGrade]);
  
  useEffect(() => {
    if (editMode) {
      setEditableSubjectData([...subjectPerformanceData]);
      setEditableGradeData([...gradeDistributionData]);
      setEditableAttendanceData([...attendanceData]);
      setEditableClassData([...classComparisonData]);
      setEditableClassPerformanceData([...classPerformanceData]);
      setEditableSubjectWiseData([...subjectWiseData]);
      setEditableSubjectPassFailData([...subjectPassFailData]);
      setEditableClassPassFailData([...classPassFailData]);
    }
  }, [editMode]);
  
  const filteredSubjectPassFailData = subjectPassFailData.filter(
    item => selectedClass === "All" || item.class === selectedClass
  );
  
  const filteredClassPassFailData = classPassFailData.filter(
    item => selectedClass === "All" ? 
      item.name === "Passed" : // Only show the "Passed" data for all classes in summary
      item.class === selectedClass
  );
  
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
        if (parsedData.subjectPassFailData) setSubjectPassFailData(parsedData.subjectPassFailData);
        if (parsedData.classPassFailData) setClassPassFailData(parsedData.classPassFailData);
      } catch (error) {
        console.error('Error loading saved statistics data:', error);
      }
    }
  }, []);
  
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
    subjectPassFailData, classPassFailData,
    hasChanges, autoSaveEnabled
  ]);
  
  useEffect(() => {
    setHasChanges(true);
  }, [
    subjectPerformanceData, classPerformanceData, subjectWiseData, 
    gradeDistributionData, attendanceData, classComparisonData,
    subjectPassFailData, classPassFailData
  ]);
  
  const handleSaveChanges = () => {
    setSubjectPerformanceData([...editableSubjectData]);
    setGradeDistributionData([...editableGradeData]);
    setAttendanceData([...editableAttendanceData]);
    setClassComparisonData([...editableClassData]);
    setClassPerformanceData([...editableClassPerformanceData]);
    setSubjectWiseData([...editableSubjectWiseData]);
    setSubjectPassFailData([...editableSubjectPassFailData]);
    setClassPassFailData([...editableClassPassFailData]);
    setEditMode(false);
    setHasChanges(true);
    
    logActivity("Updated Statistics Data", `Updated ${viewMode} data for ${selectedGrade} - ${selectedTerm}`);
    
    toast({
      title: "Statistics Saved",
      description: "Your changes to the statistics data have been saved.",
    });
  };
  
  const saveDataToLocalStorage = () => {
    const dataToSave = {
      subjectPerformanceData,
      classPerformanceData,
      subjectWiseData,
      gradeDistributionData,
      attendanceData,
      classComparisonData,
      subjectPassFailData,
      classPassFailData,
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
  
  const backupData = () => {
    const dataToBackup = {
      subjectPerformanceData,
      classPerformanceData,
      subjectWiseData,
      gradeDistributionData,
      attendanceData,
      classComparisonData,
      subjectPassFailData,
      classPassFailData,
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
  
  const restoreFromBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsedData = JSON.parse(event.target?.result as string);
        
        if (parsedData.subjectPerformanceData) setSubjectPerformanceData(parsedData.subjectPerformanceData);
        if (parsedData.classPerformanceData) setClassPerformanceData(parsedData.classPerformanceData);
        if (parsedData.subjectWiseData) setSubjectWiseData(parsedData.subjectWiseData);
        if (parsedData.gradeDistributionData) setGradeDistributionData(parsedData.gradeDistributionData);
        if (parsedData.attendanceData) setAttendanceData(parsedData.attendanceData);
        if (parsedData.classComparisonData) setClassComparisonData(parsedData.classComparisonData);
        if (parsedData.subjectPassFailData) setSubjectPassFailData(parsedData.subjectPassFailData || []);
        if (parsedData.classPassFailData) setClassPassFailData(parsedData.classPassFailData || []);
        
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
  
  const downloadChart = (chartId: string, chartName: string) => {
    const chartElement = chartRefs.current[chartId];
    if (!chartElement) return;
    
    const svgElement = chartElement.querySelector('svg');
    if (!svgElement) return;
    
    const svgClone = svgElement.cloneNode(true) as SVGElement;
    
    svgClone.style.backgroundColor = theme === 'dark' ? '#1f2937' : '#ffffff';
    
    const svgData = new XMLSerializer().serializeToString(svgClone);
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const svgUrl = URL.createObjectURL(svgBlob);
    
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = function() {
      canvas.width = img.width;
      canvas.height = img.height;
      
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        
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
  
  const exportAsCSV = (data: any[], filename: string) => {
    if (!data || !data.length) return;
    
    const headers = Object.keys(data[0]);
    
    const csvRows = [
      headers.join(','),
      ...data.map(row => 
        headers.map(header => {
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
  
  const exportAllData = () => {
    const dataPackage = {
      subjectPerformance: subjectPerformanceData,
      classPerformance: classPerformanceData,
      subjectWise: subjectWiseData,
      gradeDistribution: gradeDistributionData,
      attendance: attendanceData,
      classComparison: classComparisonData,
      subjectPassFail: subjectPassFailData,
      classPassFail: classPassFailData
    };
    
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
                <option>Grade 7</option>
                <option>Grade 8</option>
                <option>Grade 9</option>
                <option>Grade 10</option>
                <option>Grade 11</option>
                <option>Grade 12</option>
                <option>Grade 13</option>
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
              
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="glass rounded-lg border-none px-4 py-1.5 text-sm"
                disabled={editMode}
              >
                <option value="All">All Classes</option>
                {getFilteredClasses().map(cls => (
                  <option key={cls} value={cls}>Class {cls}</option>
                ))}
              </select>
            </div>
            
            <div className="flex items-center gap-2">
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
              
              <button 
                onClick={saveDataToLocalStorage}
                className="flex items-center gap-1 glass px-3 py-1.5 rounded-lg text-sm"
                disabled={editMode}
              >
                <Save size={14} />
                <span>Save</span>
              </button>
              
              <button 
                onClick={exportAllData}
                className="flex items-center gap-1 glass px-3 py-1.5 rounded-lg text-sm"
                disabled={editMode}
              >
                <FileText size={14} />
                <span>Export All</span>
              </button>
              
              <button 
                onClick={backupData}
                className="flex items-center gap-1 glass px-3 py-1.5 rounded-lg text-sm"
                disabled={editMode}
              >
                <Download size={14} />
                <span>Backup</span>
              </button>
              
              <label className="flex items-center gap-1 glass px-3 py-1.5 rounded-lg text-sm cursor-pointer">
                <Upload size={14} />
                <span>Restore</span>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".json"
                  className="hidden"
                  disabled={editMode}
                  onChange={restoreFromBackup}
                />
              </label>
              
              <div className="flex items-center gap-2 glass px-3 py-1.5 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={autoSaveEnabled}
                    onCheckedChange={setAutoSaveEnabled}
                    id="auto-save"
                  />
                  <label htmlFor="auto-save" className="text-sm cursor-pointer">
                    Autosave
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <Tabs defaultValue="overall" className="mb-6" onValueChange={(value) => setViewMode(value as any)}>
          <TabsList className="grid w-full md:w-auto grid-cols-4">
            <TabsTrigger value="overall">Overall</TabsTrigger>
            <TabsTrigger value="class">Class-wise</TabsTrigger>
            <TabsTrigger value="subject">Subject-wise</TabsTrigger>
            <TabsTrigger value="backup">Backup/Restore</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overall">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
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
                            <td className="py-2">{item.name}</td>
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
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {gradeDistributionData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip 
                          formatter={(value, name, entry) => [`${value} students`, `Grade ${name}`]}
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
            
            <div className="glass rounded-xl p-4">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-medium">Overall Pass/Fail Rate</h3>
                <button
                  onClick={() => downloadChart('overallPassFail', 'Overall-PassFail')}
                  className="text-sm flex items-center gap-1 glass px-2 py-1 rounded"
                  disabled={editMode}
                >
                  <Download size={14} />
                  <span>Download</span>
                </button>
              </div>
              
              <div className="h-80" ref={el => chartRefs.current['overallPassFail'] = el}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        { name: "Pass", value: 70, color: "#0f5ea2" },
                        { name: "Fail", value: 30, color: "#f17831" }
                      ]}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, value, percent }) => `${name}: ${value}% (${(percent * 100).toFixed(0)}%)`}
                    >
                      {[
                        { name: "Pass", value: 70, color: "#0f5ea2" },
                        { name: "Fail", value: 30, color: "#f17831" }
                      ].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value) => [`${value}%`, '']}
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
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="class">
            <ClassPerformance 
              classPerformanceData={classPerformanceData}
              classPassFailData={classPassFailData}
              subjectWiseData={subjectWiseData}
              selectedClass={selectedClass}
              editMode={editMode}
              theme={theme}
              chartRefs={chartRefs}
              downloadChart={downloadChart}
              exportAsCSV={exportAsCSV}
            />
          </TabsContent>
          
          <TabsContent value="subject">
            <SubjectPerformance 
              subjectPassFailData={subjectPassFailData}
              selectedClass={selectedClass}
              editMode={editMode}
              theme={theme}
              chartRefs={chartRefs}
              downloadChart={downloadChart}
              exportAsCSV={exportAsCSV}
            />
          </TabsContent>
          
          <TabsContent value="backup">
            <BackupRestore 
              backupData={backupData}
              restoreFromBackup={restoreFromBackup}
              saveDataToLocalStorage={saveDataToLocalStorage}
              exportAllData={exportAllData}
              lastSaved={lastSaved}
              fileInputRef={fileInputRef}
              editMode={editMode}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Statistics;
