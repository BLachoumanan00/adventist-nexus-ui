import React, { useState, useEffect, useCallback } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface GradeThreshold {
  min: number;
  max: number;
  grade: string;
}

interface Subject {
  id: string;
  name: string;
  code?: string;
}

interface SubjectGradeCriteriaProps {
  onChange: (subjectId: string, criteria: GradeThreshold[], totalMarks: number) => void;
  initialCriteria: {
    [subjectId: string]: {
      criteria: GradeThreshold[];
      totalMarks: number;
    };
  };
}

const defaultCriteria: GradeThreshold[] = [
  { min: 90, max: 100, grade: "A+" },
  { min: 80, max: 89, grade: "A" },
  { min: 70, max: 79, grade: "B" },
  { min: 60, max: 69, grade: "C" },
  { min: 50, max: 59, grade: "D" },
  { min: 0, max: 49, grade: "F" },
];

const SubjectGradeCriteriaTab: React.FC<SubjectGradeCriteriaProps> = ({ onChange, initialCriteria }) => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [activeSubject, setActiveSubject] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  
  // Fetch subjects from database
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const { data, error } = await supabase
          .from('subjects')
          .select('id, name, code')
          .eq('is_active', true)
          .order('name');
        
        if (error) throw error;
        
        if (data && data.length > 0) {
          setSubjects(data);
          setActiveSubject(data[0].id);
        }
      } catch (error) {
        console.error('Error fetching subjects:', error);
        toast({
          title: "Error",
          description: "Failed to load subjects",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchSubjects();
  }, [toast]);
  
  // Get criteria for a specific subject - always fresh from props
  const getCriteriaForSubject = useCallback((subjectId: string): GradeThreshold[] => {
    if (!initialCriteria[subjectId]?.criteria) {
      return JSON.parse(JSON.stringify(defaultCriteria));
    }
    return initialCriteria[subjectId].criteria;
  }, [initialCriteria]);
  
  // Get total marks for a specific subject - always fresh from props
  const getTotalMarksForSubject = useCallback((subjectId: string): number => {
    return initialCriteria[subjectId]?.totalMarks || 100;
  }, [initialCriteria]);

  if (loading) {
    return <div className="glass p-4 rounded-lg">Loading subjects...</div>;
  }
  
  if (subjects.length === 0) {
    return (
      <div className="glass p-4 rounded-lg">
        <p className="text-foreground/60">No subjects found. Please add subjects first.</p>
      </div>
    );
  }
  
  return (
    <div className="glass p-4 rounded-lg">
      <Tabs value={activeSubject} onValueChange={setActiveSubject}>
        <TabsList className="w-full flex overflow-x-auto mb-4 bg-secondary/50 p-1 rounded-lg flex-wrap">
          {subjects.map(subject => (
            <TabsTrigger 
              key={subject.id} 
              value={subject.id}
              className="flex-shrink-0"
            >
              {subject.code || subject.name}
            </TabsTrigger>
          ))}
        </TabsList>
        
        {subjects.map(subject => {
          const subjectCriteria = getCriteriaForSubject(subject.id);
          const subjectTotalMarks = getTotalMarksForSubject(subject.id);
          
          return (
            <TabsContent key={subject.id} value={subject.id}>
              <div className="mb-4 glass rounded-lg p-4">
                <h3 className="font-medium mb-2">{subject.name}</h3>
                <label className="block text-sm font-medium mb-2">Total Marks for {subject.name}</label>
                <input
                  type="number"
                  min="1"
                  max="1000"
                  value={subjectTotalMarks}
                  onChange={(e) => {
                    const newTotalMarks = parseInt(e.target.value) || 100;
                    onChange(subject.id, subjectCriteria, newTotalMarks);
                  }}
                  className="glass px-4 py-2 rounded-lg w-full max-w-xs"
                  placeholder="Enter total marks (e.g., 50, 100)"
                />
                <p className="text-xs text-foreground/60 mt-1">
                  Set the maximum marks for {subject.name} assessments (e.g., 50, 100, 200)
                </p>
              </div>
              
              <GradeCriteriaEditor 
                subjectId={subject.id}
                criteria={subjectCriteria}
                totalMarks={subjectTotalMarks}
                onChange={(index, field, value) => {
                  const currentCriteria = getCriteriaForSubject(subject.id);
                  const currentTotalMarks = getTotalMarksForSubject(subject.id);
                  const newCriteria = [...currentCriteria];
                  newCriteria[index] = { 
                    ...newCriteria[index], 
                    [field]: typeof value === 'string' ? value : Number(value) 
                  };
                  onChange(subject.id, newCriteria, currentTotalMarks);
                }}
                onAdd={() => {
                  const currentCriteria = getCriteriaForSubject(subject.id);
                  const currentTotalMarks = getTotalMarksForSubject(subject.id);
                  const newCriteria = [...currentCriteria, {
                    min: 0,
                    max: 10,
                    grade: "New"
                  }];
                  onChange(subject.id, newCriteria, currentTotalMarks);
                }}
                onRemove={(index) => {
                  const currentCriteria = getCriteriaForSubject(subject.id);
                  const currentTotalMarks = getTotalMarksForSubject(subject.id);
                  
                  if (currentCriteria.length <= 1) {
                    toast({
                      title: "Cannot Remove",
                      description: "At least one grade threshold is required",
                      variant: "destructive"
                    });
                    return;
                  }
                  
                  const newCriteria = [...currentCriteria];
                  newCriteria.splice(index, 1);
                  onChange(subject.id, newCriteria, currentTotalMarks);
                }}
              />
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
};

interface GradeCriteriaEditorProps {
  subjectId: string;
  criteria: GradeThreshold[];
  totalMarks: number;
  onChange: (index: number, field: keyof GradeThreshold, value: string | number) => void;
  onAdd: () => void;
  onRemove: (index: number) => void;
}

const GradeCriteriaEditor: React.FC<GradeCriteriaEditorProps> = ({ 
  subjectId,
  criteria, 
  totalMarks,
  onChange, 
  onAdd, 
  onRemove 
}) => {
  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full mb-4">
          <thead>
            <tr className="bg-secondary/30">
              <th className="p-2 text-left">Grade</th>
              <th className="p-2 text-left">Min Marks</th>
              <th className="p-2 text-left">Max Marks</th>
              <th className="p-2 text-left">Min %</th>
              <th className="p-2 text-left">Max %</th>
              <th className="p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {criteria.map((threshold, index) => {
              const minPercent = totalMarks > 0 ? ((threshold.min / totalMarks) * 100).toFixed(1) : 0;
              const maxPercent = totalMarks > 0 ? ((threshold.max / totalMarks) * 100).toFixed(1) : 0;
              
              return (
                <tr key={`${subjectId}-${index}`} className="border-b border-white/10">
                  <td className="p-2">
                    <input
                      type="text"
                      value={threshold.grade}
                      onChange={(e) => onChange(index, "grade", e.target.value)}
                      className="glass px-2 py-1 rounded w-20"
                    />
                  </td>
                  <td className="p-2">
                    <input
                      type="number"
                      min="0"
                      max={totalMarks}
                      value={threshold.min}
                      onChange={(e) => onChange(index, "min", parseInt(e.target.value) || 0)}
                      className="glass px-2 py-1 rounded w-20"
                    />
                  </td>
                  <td className="p-2">
                    <input
                      type="number"
                      min="0"
                      max={totalMarks}
                      value={threshold.max}
                      onChange={(e) => onChange(index, "max", parseInt(e.target.value) || 0)}
                      className="glass px-2 py-1 rounded w-20"
                    />
                  </td>
                  <td className="p-2 text-foreground/60 text-sm">
                    {minPercent}%
                  </td>
                  <td className="p-2 text-foreground/60 text-sm">
                    {maxPercent}%
                  </td>
                  <td className="p-2">
                    <button
                      onClick={() => onRemove(index)}
                      className="text-red-500 hover:text-red-400 px-2 py-1 rounded-lg glass disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={criteria.length <= 1}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      
      <button
        onClick={onAdd}
        className="btn-primary px-3 py-1.5 rounded-lg text-sm"
      >
        Add Threshold
      </button>
    </>
  );
};

export default SubjectGradeCriteriaTab;
