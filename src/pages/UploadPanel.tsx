
import React, { useState } from "react";
import { AlertCircle, Download, FileSpreadsheet, Upload, X } from "lucide-react";

interface TableData {
  id: number;
  name: string;
  grade: string;
  section: string;
  dob: string;
  gender: string;
  parentName: string;
  contactNumber: string;
  errors?: string[];
}

const UploadPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'students' | 'teachers'>('students');
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  
  // Sample data for preview
  const [previewData, setPreviewData] = useState<TableData[]>([
    { 
      id: 1, 
      name: 'John Smith', 
      grade: '8', 
      section: 'A', 
      dob: '2009-05-15', 
      gender: 'Male', 
      parentName: 'Robert Smith', 
      contactNumber: '555-123-4567',
      errors: ['Invalid contact number format']
    },
    { 
      id: 2, 
      name: 'Sarah Johnson', 
      grade: '8', 
      section: 'A', 
      dob: '2009-03-22', 
      gender: 'Female', 
      parentName: 'Laura Johnson', 
      contactNumber: '555-987-6543' 
    },
    { 
      id: 3, 
      name: 'Michael Brown', 
      grade: '8', 
      section: 'B', 
      dob: '2009-07-10', 
      gender: 'Male', 
      parentName: 'David Brown', 
      contactNumber: '555-456-7890' 
    },
    { 
      id: 4, 
      name: '', 
      grade: '8', 
      section: 'B', 
      dob: '2009-01-30', 
      gender: 'Female', 
      parentName: 'James Davis', 
      contactNumber: '555-789-0123',
      errors: ['Name is required']
    },
    { 
      id: 5, 
      name: 'Robert Wilson', 
      grade: '8', 
      section: 'C', 
      dob: '2009-11-05', 
      gender: 'Male', 
      parentName: 'Thomas Wilson', 
      contactNumber: '555-234-5678' 
    },
  ]);

  // Simulate file upload handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      // In a real app, you would parse the CSV here
      setShowPreview(true);
    }
  };

  // Simulate file drop handler
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files?.[0];
    if (file && file.name.endsWith('.csv')) {
      setFileName(file.name);
      // In a real app, you would parse the CSV here
      setShowPreview(true);
    }
  };
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDownloadTemplate = () => {
    // In a real app, this would download a CSV template
    alert('Downloading template...');
  };

  return (
    <div className="animate-fade-in">
      <div className="glass-card mb-6">
        <div className="flex items-center gap-3 mb-6">
          <FileSpreadsheet size={24} className="text-theme-purple" />
          <h2 className="text-xl font-semibold">Upload Data</h2>
        </div>
        
        <div className="flex border-b border-white/10 mb-6">
          <button
            className={`px-4 py-2 border-b-2 transition-colors ${
              activeTab === 'students'
                ? 'border-primary text-primary font-medium'
                : 'border-transparent hover:border-white/20'
            }`}
            onClick={() => setActiveTab('students')}
          >
            Students
          </button>
          <button
            className={`px-4 py-2 border-b-2 transition-colors ${
              activeTab === 'teachers'
                ? 'border-primary text-primary font-medium'
                : 'border-transparent hover:border-white/20'
            }`}
            onClick={() => setActiveTab('teachers')}
          >
            Teachers
          </button>
        </div>
        
        <div 
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            isDragging 
              ? 'border-primary bg-primary/5' 
              : 'border-white/20 hover:border-white/40 dark:hover:border-white/30'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <Upload size={36} className="mx-auto text-foreground/50 mb-4" />
          
          <h3 className="text-lg font-medium mb-2">
            {fileName ? 'File selected:' : 'Drop your CSV file here'}
          </h3>
          
          {fileName ? (
            <div className="flex items-center justify-center gap-2 text-foreground/80">
              <FileSpreadsheet size={18} />
              <span>{fileName}</span>
              <button 
                className="p-1 rounded-full hover:bg-white/10"
                onClick={() => {
                  setFileName(null);
                  setShowPreview(false);
                }}
              >
                <X size={14} />
              </button>
            </div>
          ) : (
            <>
              <p className="text-foreground/60 mb-6">
                Supports .CSV files only
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <label className="btn-primary cursor-pointer flex items-center gap-2">
                  <Upload size={16} />
                  <span>Select File</span>
                  <input 
                    type="file" 
                    accept=".csv" 
                    className="hidden" 
                    onChange={handleFileUpload}
                  />
                </label>
                
                <button 
                  onClick={handleDownloadTemplate}
                  className="text-primary flex items-center gap-2 hover:underline"
                >
                  <Download size={16} />
                  <span>Download Template</span>
                </button>
              </div>
            </>
          )}
        </div>
        
        {showPreview && (
          <div className="mt-8 animate-fade-in">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium text-lg">Data Preview</h3>
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-100/50 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400 text-sm">
                <AlertCircle size={14} />
                <span>2 validation issues found</span>
              </div>
            </div>
            
            <div className="glass rounded-xl p-4 overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="pb-2 text-left font-medium text-foreground/70 text-sm">ID</th>
                    <th className="pb-2 text-left font-medium text-foreground/70 text-sm">Name</th>
                    <th className="pb-2 text-left font-medium text-foreground/70 text-sm">Grade</th>
                    <th className="pb-2 text-left font-medium text-foreground/70 text-sm">Section</th>
                    <th className="pb-2 text-left font-medium text-foreground/70 text-sm">Date of Birth</th>
                    <th className="pb-2 text-left font-medium text-foreground/70 text-sm">Gender</th>
                    <th className="pb-2 text-left font-medium text-foreground/70 text-sm">Parent Name</th>
                    <th className="pb-2 text-left font-medium text-foreground/70 text-sm">Contact</th>
                  </tr>
                </thead>
                <tbody>
                  {previewData.map(row => (
                    <tr 
                      key={row.id} 
                      className={`border-b border-white/5 hover:bg-white/5 transition-colors ${
                        row.errors ? 'bg-red-50/10 dark:bg-red-900/10' : ''
                      }`}
                    >
                      <td className="py-3">{row.id}</td>
                      <td className={`py-3 ${row.errors?.includes('Name is required') ? 'text-red-500' : ''}`}>
                        {row.name || <span className="text-red-500 italic text-sm">Empty</span>}
                      </td>
                      <td className="py-3">{row.grade}</td>
                      <td className="py-3">{row.section}</td>
                      <td className="py-3">{row.dob}</td>
                      <td className="py-3">{row.gender}</td>
                      <td className="py-3">{row.parentName}</td>
                      <td className={`py-3 ${row.errors?.includes('Invalid contact number format') ? 'text-red-500' : ''}`}>
                        {row.contactNumber}
                        {row.errors?.includes('Invalid contact number format') && (
                          <div className="text-xs text-red-500">Invalid format</div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="mt-6 flex justify-end gap-4">
              <button className="px-4 py-2 rounded-lg glass">
                Cancel
              </button>
              <button className="btn-primary">
                Upload Data
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadPanel;
