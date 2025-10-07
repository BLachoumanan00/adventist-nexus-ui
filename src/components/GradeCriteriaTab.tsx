
import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./ui/tabs";

interface GradeThreshold {
  min: number;
  max: number;
  grade: string;
}

interface GradeCriteriaProps {
  onChange: (gradeNumber: number, criteria: GradeThreshold[], isMain?: boolean, totalMarks?: number) => void;
  initialCriteria: {
    [key: number]: {
      main?: GradeThreshold[];
      sub?: GradeThreshold[];
      default?: GradeThreshold[];
      totalMarks?: number;
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

const GradeCriteriaTab: React.FC<GradeCriteriaProps> = ({ onChange, initialCriteria }) => {
  const [activeGrade, setActiveGrade] = useState<number>(7);
  const [activeType, setActiveType] = useState<"main" | "sub" | "default">("default");
  const [totalMarks, setTotalMarks] = useState<{ [key: number]: number }>({});
  
  // Prepare grade levels array (7-13)
  const gradeLevels = Array.from({ length: 7 }, (_, i) => i + 7);
  
  // Initialize total marks from initialCriteria
  React.useEffect(() => {
    const marks: { [key: number]: number } = {};
    gradeLevels.forEach(grade => {
      marks[grade] = initialCriteria[grade]?.totalMarks || 100;
    });
    setTotalMarks(marks);
  }, []);
  
  // Get criteria for the current grade and type
  const getCurrentCriteria = (grade: number, type: "main" | "sub" | "default"): GradeThreshold[] => {
    const gradeCriteria = initialCriteria[grade] || {};
    
    if (type === "main" && gradeCriteria.main) {
      return gradeCriteria.main;
    } else if (type === "sub" && gradeCriteria.sub) {
      return gradeCriteria.sub;
    } else {
      return gradeCriteria.default || defaultCriteria;
    }
  };
  
  const currentCriteria = getCurrentCriteria(activeGrade, activeType);
  
  // Handle criteria changes
  const handleCriteriaChange = (index: number, field: keyof GradeThreshold, value: string | number) => {
    const newCriteria = [...currentCriteria];
    newCriteria[index] = { ...newCriteria[index], [field]: typeof value === 'string' ? value : Number(value) };
    
    // Don't auto-sort, let users control the order
    
    // Call the onChange callback based on active type
    if (activeGrade >= 12 && (activeType === "main" || activeType === "sub")) {
      onChange(activeGrade, newCriteria, activeType === "main", totalMarks[activeGrade]);
    } else {
      onChange(activeGrade, newCriteria, undefined, totalMarks[activeGrade]);
    }
  };
  
  // Handle total marks change
  const handleTotalMarksChange = (grade: number, value: number) => {
    const newTotalMarks = { ...totalMarks, [grade]: value };
    setTotalMarks(newTotalMarks);
    
    // Notify parent of the change
    const criteria = getCurrentCriteria(grade, activeType);
    if (grade >= 12 && (activeType === "main" || activeType === "sub")) {
      onChange(grade, criteria, activeType === "main", value);
    } else {
      onChange(grade, criteria, undefined, value);
    }
  };
  
  // Add a new threshold
  const addThreshold = () => {
    const newCriteria = [...currentCriteria];
    
    // Add a new threshold with default values
    newCriteria.push({
      min: 0,
      max: 10,
      grade: "New"
    });
    
    if (activeGrade >= 12 && (activeType === "main" || activeType === "sub")) {
      onChange(activeGrade, newCriteria, activeType === "main", totalMarks[activeGrade]);
    } else {
      onChange(activeGrade, newCriteria, undefined, totalMarks[activeGrade]);
    }
  };
  
  // Remove a threshold
  const removeThreshold = (index: number) => {
    if (currentCriteria.length <= 1) return; // Prevent removing if only 1 threshold
    
    const newCriteria = [...currentCriteria];
    newCriteria.splice(index, 1);
    
    if (activeGrade >= 12 && (activeType === "main" || activeType === "sub")) {
      onChange(activeGrade, newCriteria, activeType === "main", totalMarks[activeGrade]);
    } else {
      onChange(activeGrade, newCriteria, undefined, totalMarks[activeGrade]);
    }
  };
  
  return (
    <div className="glass p-4 rounded-lg">
      <Tabs defaultValue="7">
        <TabsList className="w-full flex overflow-x-auto mb-4 bg-secondary/50 p-1 rounded-lg">
          {gradeLevels.map(grade => (
            <TabsTrigger 
              key={grade} 
              value={grade.toString()} 
              onClick={() => setActiveGrade(grade)}
              className="flex-1"
            >
              Grade {grade}
            </TabsTrigger>
          ))}
        </TabsList>
        
        {gradeLevels.map(grade => (
          <TabsContent key={grade} value={grade.toString()}>
            <div className="mb-4 glass rounded-lg p-4">
              <label className="block text-sm font-medium mb-2">Total Marks for Grade {grade}</label>
              <input
                type="number"
                min="1"
                max="1000"
                value={totalMarks[grade] || 100}
                onChange={(e) => handleTotalMarksChange(grade, parseInt(e.target.value) || 100)}
                className="glass px-4 py-2 rounded-lg w-full max-w-xs"
                placeholder="Enter total marks (e.g., 50, 100)"
              />
              <p className="text-xs text-foreground/60 mt-1">
                Set the maximum marks for assessments in Grade {grade} (e.g., 50, 100, 200)
              </p>
            </div>
            
            {grade >= 12 ? (
              <div className="mb-4">
                <Tabs defaultValue="default" className="w-full">
                  <TabsList className="mb-4">
                    <TabsTrigger 
                      value="default" 
                      onClick={() => setActiveType("default")}
                    >
                      Default
                    </TabsTrigger>
                    <TabsTrigger 
                      value="main" 
                      onClick={() => setActiveType("main")}
                    >
                      Main Subjects
                    </TabsTrigger>
                    <TabsTrigger 
                      value="sub" 
                      onClick={() => setActiveType("sub")}
                    >
                      Subsidiary Subjects
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="default">
                    <GradeCriteriaEditor 
                      criteria={getCurrentCriteria(grade, "default")}
                      onChange={(index, field, value) => {
                        setActiveType("default");
                        handleCriteriaChange(index, field, value);
                      }}
                      onAdd={addThreshold}
                      onRemove={removeThreshold}
                    />
                  </TabsContent>
                  
                  <TabsContent value="main">
                    <GradeCriteriaEditor 
                      criteria={getCurrentCriteria(grade, "main")}
                      onChange={(index, field, value) => {
                        setActiveType("main");
                        handleCriteriaChange(index, field, value);
                      }}
                      onAdd={addThreshold}
                      onRemove={removeThreshold}
                    />
                  </TabsContent>
                  
                  <TabsContent value="sub">
                    <GradeCriteriaEditor 
                      criteria={getCurrentCriteria(grade, "sub")}
                      onChange={(index, field, value) => {
                        setActiveType("sub");
                        handleCriteriaChange(index, field, value);
                      }}
                      onAdd={addThreshold}
                      onRemove={removeThreshold}
                    />
                  </TabsContent>
                </Tabs>
              </div>
            ) : (
              <GradeCriteriaEditor 
                criteria={getCurrentCriteria(grade, "default")}
                onChange={(index, field, value) => {
                  setActiveType("default");
                  handleCriteriaChange(index, field, value);
                }}
                onAdd={addThreshold}
                onRemove={removeThreshold}
              />
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

interface GradeCriteriaEditorProps {
  criteria: GradeThreshold[];
  onChange: (index: number, field: keyof GradeThreshold, value: string | number) => void;
  onAdd: () => void;
  onRemove: (index: number) => void;
}

const GradeCriteriaEditor: React.FC<GradeCriteriaEditorProps> = ({ 
  criteria, 
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
              <th className="p-2 text-left">Min %</th>
              <th className="p-2 text-left">Max %</th>
              <th className="p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {criteria.map((threshold, index) => (
              <tr key={index} className="border-b border-white/10">
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
                    max={threshold.max - 1}
                    value={threshold.min}
                    onChange={(e) => onChange(index, "min", parseInt(e.target.value))}
                    className="glass px-2 py-1 rounded w-20"
                  />
                </td>
                <td className="p-2">
                  <input
                    type="number"
                    min={threshold.min + 1}
                    max="100"
                    value={threshold.max}
                    onChange={(e) => onChange(index, "max", parseInt(e.target.value))}
                    className="glass px-2 py-1 rounded w-20"
                  />
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
            ))}
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

export default GradeCriteriaTab;
