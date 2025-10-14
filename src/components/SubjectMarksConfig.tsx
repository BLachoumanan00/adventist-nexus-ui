import React, { useState, useEffect } from 'react';
import { BookOpen, Save, Plus, X } from 'lucide-react';
import { useToast } from '../hooks/use-toast';
import { Button } from './ui/button';
import { Input } from './ui/input';

export interface SubjectMarksConfig {
  [subjectName: string]: {
    totalMarks: 50 | 100;
    isActive: boolean;
  };
}

const defaultSubjects = [
  'Mathematics',
  'English',
  'Science',
  'Social Studies',
  'French',
  'History',
  'Geography',
  'Physics',
  'Chemistry',
  'Biology',
  'Computer Science',
  'Physical Education',
];

const SubjectMarksConfig: React.FC = () => {
  const { toast } = useToast();
  const [config, setConfig] = useState<SubjectMarksConfig>({});
  const [newSubjectName, setNewSubjectName] = useState('');

  // Load config from localStorage
  useEffect(() => {
    const savedConfig = localStorage.getItem('subjectMarksConfig');
    if (savedConfig) {
      try {
        setConfig(JSON.parse(savedConfig));
      } catch (error) {
        console.error('Failed to parse subject marks config:', error);
      }
    } else {
      // Initialize with default subjects (all set to 100)
      const initialConfig: SubjectMarksConfig = {};
      defaultSubjects.forEach(subject => {
        initialConfig[subject] = { totalMarks: 100, isActive: true };
      });
      setConfig(initialConfig);
    }
  }, []);

  const handleTotalMarksChange = (subjectName: string, totalMarks: 50 | 100) => {
    setConfig(prev => ({
      ...prev,
      [subjectName]: {
        ...prev[subjectName],
        totalMarks
      }
    }));
  };

  const handleToggleActive = (subjectName: string) => {
    setConfig(prev => ({
      ...prev,
      [subjectName]: {
        ...prev[subjectName],
        isActive: !prev[subjectName]?.isActive
      }
    }));
  };

  const handleAddSubject = () => {
    if (!newSubjectName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a subject name",
        variant: "destructive"
      });
      return;
    }

    if (config[newSubjectName]) {
      toast({
        title: "Error",
        description: "Subject already exists",
        variant: "destructive"
      });
      return;
    }

    setConfig(prev => ({
      ...prev,
      [newSubjectName]: { totalMarks: 100, isActive: true }
    }));
    setNewSubjectName('');
    
    toast({
      title: "Subject Added",
      description: `${newSubjectName} has been added`
    });
  };

  const handleRemoveSubject = (subjectName: string) => {
    const newConfig = { ...config };
    delete newConfig[subjectName];
    setConfig(newConfig);
    
    toast({
      title: "Subject Removed",
      description: `${subjectName} has been removed`
    });
  };

  const handleSave = () => {
    localStorage.setItem('subjectMarksConfig', JSON.stringify(config));
    
    toast({
      title: "Configuration Saved",
      description: "Subject marks configuration has been updated"
    });
  };

  const activeSubjects = Object.entries(config).filter(([_, conf]) => conf.isActive);
  const inactiveSubjects = Object.entries(config).filter(([_, conf]) => !conf.isActive);

  return (
    <div className="glass rounded-xl p-6">
      <div className="flex items-center gap-3 mb-6">
        <BookOpen size={20} className="text-primary" />
        <h3 className="font-semibold text-lg">Subject Marks Configuration</h3>
      </div>
      
      <p className="text-sm text-muted-foreground mb-6">
        Configure whether each subject is graded out of 50 or 100 marks
      </p>

      {/* Add New Subject */}
      <div className="mb-6 p-4 glass rounded-lg">
        <h4 className="text-sm font-medium mb-3">Add New Subject</h4>
        <div className="flex gap-2">
          <Input
            type="text"
            placeholder="Subject name"
            value={newSubjectName}
            onChange={(e) => setNewSubjectName(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddSubject()}
            className="flex-1"
          />
          <Button onClick={handleAddSubject} size="sm" className="gap-2">
            <Plus size={16} />
            Add
          </Button>
        </div>
      </div>

      {/* Active Subjects */}
      {activeSubjects.length > 0 && (
        <div className="mb-6">
          <h4 className="text-sm font-medium mb-3 text-muted-foreground">Active Subjects</h4>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="text-left py-3 px-4 text-sm font-medium">Subject</th>
                  <th className="text-left py-3 px-4 text-sm font-medium">Total Marks</th>
                  <th className="text-right py-3 px-4 text-sm font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {activeSubjects.map(([subjectName, subjectConfig]) => (
                  <tr key={subjectName} className="border-b border-border/30 hover:bg-white/5 transition-colors">
                    <td className="py-3 px-4">
                      <span className="font-medium">{subjectName}</span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleTotalMarksChange(subjectName, 50)}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                            subjectConfig.totalMarks === 50
                              ? 'bg-primary text-primary-foreground shadow-lg'
                              : 'glass hover:bg-white/10'
                          }`}
                        >
                          50 Marks
                        </button>
                        <button
                          onClick={() => handleTotalMarksChange(subjectName, 100)}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                            subjectConfig.totalMarks === 100
                              ? 'bg-primary text-primary-foreground shadow-lg'
                              : 'glass hover:bg-white/10'
                          }`}
                        >
                          100 Marks
                        </button>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleToggleActive(subjectName)}
                          className="text-xs"
                        >
                          Deactivate
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveSubject(subjectName)}
                          className="text-destructive hover:text-destructive text-xs"
                        >
                          <X size={14} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Inactive Subjects */}
      {inactiveSubjects.length > 0 && (
        <div className="mb-6">
          <h4 className="text-sm font-medium mb-3 text-muted-foreground">Inactive Subjects</h4>
          <div className="space-y-2">
            {inactiveSubjects.map(([subjectName]) => (
              <div key={subjectName} className="flex items-center justify-between p-3 glass rounded-lg opacity-60">
                <span className="font-medium">{subjectName}</span>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleToggleActive(subjectName)}
                    className="text-xs"
                  >
                    Activate
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveSubject(subjectName)}
                    className="text-destructive hover:text-destructive text-xs"
                  >
                    <X size={14} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Save Button */}
      <div className="flex justify-end pt-4 border-t border-border/30">
        <Button onClick={handleSave} className="gap-2">
          <Save size={16} />
          Save Configuration
        </Button>
      </div>
    </div>
  );
};

export default SubjectMarksConfig;
