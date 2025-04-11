
import React from "react";
import { Download, Upload, Save, BarChart, PieChart, FileText } from "lucide-react";
import { useToast } from "../../hooks/use-toast";
import { useActivityLogger } from "../../hooks/useActivityLogger";

interface BackupRestoreProps {
  backupData: () => void;
  restoreFromBackup: (e: React.ChangeEvent<HTMLInputElement>) => void;
  saveDataToLocalStorage: () => void;
  exportAllData: () => void;
  lastSaved: Date | null;
  fileInputRef: React.RefObject<HTMLInputElement>;
  editMode: boolean;
}

const BackupRestore: React.FC<BackupRestoreProps> = ({
  backupData,
  restoreFromBackup,
  saveDataToLocalStorage,
  exportAllData,
  lastSaved,
  fileInputRef,
  editMode
}) => {
  const { toast } = useToast();
  const { logActivity } = useActivityLogger();
  
  const handleExportImage = () => {
    toast({
      title: "Feature coming soon",
      description: "Export as image feature will be available in the next update."
    });
    logActivity("Attempted Feature", "Tried to use Export as Image feature");
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="glass rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <Save size={24} className="text-blue-500" />
          <h3 className="text-xl font-medium">Backup & Restore</h3>
        </div>
        
        <div className="space-y-6">
          <div>
            <h4 className="font-medium mb-2">Last Saved</h4>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {lastSaved ? 
                `Data was last saved on ${lastSaved.toLocaleDateString()} at ${lastSaved.toLocaleTimeString()}` : 
                "No recent save detected"
              }
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button 
              onClick={saveDataToLocalStorage}
              className="flex items-center gap-2 justify-center bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors"
              disabled={editMode}
            >
              <Save size={18} />
              <span>Save Statistics</span>
            </button>
            
            <button 
              onClick={backupData}
              className="flex items-center gap-2 justify-center bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition-colors"
              disabled={editMode}
            >
              <Download size={18} />
              <span>Backup Data</span>
            </button>
            
            <label className="flex items-center gap-2 justify-center bg-orange-600 hover:bg-orange-700 text-white py-2 px-4 rounded-lg transition-colors cursor-pointer">
              <Upload size={18} />
              <span>Restore Backup</span>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                className="hidden"
                disabled={editMode}
                onChange={restoreFromBackup}
              />
            </label>
          </div>
        </div>
      </div>
      
      <div className="glass rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <FileText size={24} className="text-green-500" />
          <h3 className="text-xl font-medium">Export Options</h3>
        </div>
        
        <div className="space-y-6">
          <div>
            <h4 className="font-medium mb-2">Available Formats</h4>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Export your statistics data in different formats for external use
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button 
              onClick={exportAllData}
              className="flex items-center gap-2 justify-center bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg transition-colors"
              disabled={editMode}
            >
              <FileText size={18} />
              <span>Export as JSON</span>
            </button>
            
            <button 
              onClick={handleExportImage}
              className="flex items-center gap-2 justify-center glass py-2 px-4 rounded-lg transition-colors"
              disabled={editMode}
            >
              <BarChart size={18} />
              <span>Export as Image</span>
            </button>
            
            <button 
              onClick={handleExportImage}
              className="flex items-center gap-2 justify-center glass py-2 px-4 rounded-lg transition-colors"
              disabled={editMode}
            >
              <PieChart size={18} />
              <span>Export as PDF</span>
            </button>
          </div>
        </div>
      </div>
      
      <div className="glass rounded-xl p-6 md:col-span-2">
        <div className="flex items-center gap-3 mb-4">
          <FileText size={24} className="text-yellow-500" />
          <h3 className="text-xl font-medium">Instructions</h3>
        </div>
        
        <div className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">Using Backup & Restore</h4>
            <ul className="list-disc list-inside space-y-2 text-sm">
              <li><strong>Save Statistics:</strong> Manually save current statistics to browser storage</li>
              <li><strong>Backup Data:</strong> Download a complete backup file of all statistics</li>
              <li><strong>Restore Backup:</strong> Load statistics from a previously downloaded backup file</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium mb-2">Data Security</h4>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Always keep backup files in a secure location. Statistics data contains important information about student performance.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BackupRestore;
