
import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./ui/tabs";

interface GradeThreshold {
  min: number;
  max: number;
  grade: string;
}

interface GradeCriteriaProps {
  onChange: (gradeNumber: number, criteria: GradeThreshold[], isMain?: boolean) => void;
  initialCriteria: {
    [key: number]: {
      main?: GradeThreshold[];
      sub?: GradeThreshold[];
      default?: GradeThreshold[];
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
  
  // Prepare grade levels array (7-13)
  const gradeLevels = Array.from({ length: 7 }, (_, i) => i + 7);
  
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
    
    // Sort criteria by max value in descending order
    newCriteria.sort((a, b) => b.max - a.max);
    
    // Update min values to ensure there are no gaps
    for (let i = 1; i < newCriteria.length; i++) {
      newCriteria[i].max = newCriteria[i-1].min - 1;
    }
    
    // Call the onChange callback based on active type
    if (activeGrade >= 12 && (activeType === "main" || activeType === "sub")) {
      onChange(activeGrade, newCriteria, activeType === "main");
    } else {
      onChange(activeGrade, newCriteria);
    }
  };
  
  // Add a new threshold
  const addThreshold = () => {
    const newCriteria = [...currentCriteria];
    const lastItem = newCriteria[newCriteria.length - 1];
    const middleValue = Math.floor(lastItem.min / 2);
    
    newCriteria.push({
      min: 0,
      max: lastItem.min - 1,
      grade: "F-"
    });
    
    // Update the previous last item
    newCriteria[newCriteria.length - 2].min = middleValue + 1;
    
    if (activeGrade >= 12 && (activeType === "main" || activeType === "sub")) {
      onChange(activeGrade, newCriteria, activeType === "main");
    } else {
      onChange(activeGrade, newCriteria);
    }
  };
  
  // Remove a threshold
  const removeThreshold = (index: number) => {
    if (currentCriteria.length <= 2) return; // Prevent removing if only 2 or fewer thresholds
    
    const newCriteria = [...currentCriteria];
    newCriteria.splice(index, 1);
    
    // Update min values to ensure there are no gaps
    for (let i = 1; i < newCriteria.length; i++) {
      newCriteria[i].max = newCriteria[i-1].min - 1;
    }
    
    if (activeGrade >= 12 && (activeType === "main" || activeType === "sub")) {
      onChange(activeGrade, newCriteria, activeType === "main");
    } else {
      onChange(activeGrade, newCriteria);
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
                    disabled={index === 0} // First threshold max is always 100
                  />
                </td>
                <td className="p-2">
                  <button
                    onClick={() => onRemove(index)}
                    className="text-red-500 hover:text-red-400 px-2 py-1 rounded-lg glass"
                    disabled={criteria.length <= 2}
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
