import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Users, FileText, Download, Play, Pause, RotateCcw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useStudents } from '@/hooks/useStudents';
import { useResults } from '@/hooks/useResults';

interface BulkResultData {
  grade: string;
  section: string;
  subject: string;
  examType: string;
  examName: string;
  examDate: string;
  maxMarks: number;
  academicYear: string;
}

interface StudentResult {
  studentId: string;
  studentName: string;
  marks: number;
  grade: string;
  remarks: string;
  selected: boolean;
}

const BulkResultGenerator: React.FC = () => {
  const { toast } = useToast();
  const { students } = useStudents();
  const { addResult } = useResults();

  const [bulkData, setBulkData] = useState<BulkResultData>({
    grade: '',
    section: '',
    subject: '',
    examType: 'midterm',
    examName: '',
    examDate: new Date().toISOString().split('T')[0],
    maxMarks: 100,
    academicYear: new Date().getFullYear().toString()
  });

  const [studentResults, setStudentResults] = useState<StudentResult[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [step, setStep] = useState<'setup' | 'marks' | 'review'>('setup');

  const grades = ['Grade 7', 'Grade 8', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12', 'Grade 13'];
  const sections = ['A', 'B', 'C', 'D'];
  const subjects = ['Mathematics', 'English', 'Science', 'Social Studies', 'Computer Science', 'Art', 'Music', 'Physical Education'];

  const getGradeFromPercentage = (percentage: number): string => {
    if (percentage >= 90) return 'A+';
    if (percentage >= 80) return 'A';
    if (percentage >= 70) return 'B';
    if (percentage >= 60) return 'C';
    if (percentage >= 50) return 'D';
    return 'F';
  };

  const getRemarksFromGrade = (grade: string): string => {
    switch (grade) {
      case 'A+': return 'Outstanding performance';
      case 'A': return 'Excellent work';
      case 'B': return 'Good performance';
      case 'C': return 'Satisfactory work';
      case 'D': return 'Needs improvement';
      default: return 'Requires significant improvement';
    }
  };

  const loadStudentsForBulk = () => {
    if (!bulkData.grade || !bulkData.section) {
      toast({
        variant: "destructive",
        title: "Missing information",
        description: "Please select grade and section first.",
      });
      return;
    }

    // Filter students by grade and section
    const filteredStudents = students.filter(student => 
      student.class_id?.includes(bulkData.grade) || student.class_id?.includes(bulkData.section)
    );

    const newStudentResults: StudentResult[] = filteredStudents.map(student => ({
      studentId: student.id,
      studentName: student.full_name,
      marks: 0,
      grade: '',
      remarks: '',
      selected: true
    }));

    setStudentResults(newStudentResults);
    setStep('marks');

    toast({
      title: "Students loaded",
      description: `Loaded ${newStudentResults.length} students for bulk result entry.`,
    });
  };

  const updateStudentMarks = (index: number, marks: number) => {
    const updatedResults = [...studentResults];
    const percentage = (marks / bulkData.maxMarks) * 100;
    const grade = getGradeFromPercentage(percentage);
    
    updatedResults[index] = {
      ...updatedResults[index],
      marks,
      grade,
      remarks: getRemarksFromGrade(grade)
    };

    setStudentResults(updatedResults);
  };

  const toggleStudentSelection = (index: number) => {
    const updatedResults = [...studentResults];
    updatedResults[index].selected = !updatedResults[index].selected;
    setStudentResults(updatedResults);
  };

  const selectAllStudents = (selected: boolean) => {
    const updatedResults = studentResults.map(result => ({
      ...result,
      selected
    }));
    setStudentResults(updatedResults);
  };

  const generateBulkResults = async () => {
    const selectedResults = studentResults.filter(result => result.selected);
    
    if (selectedResults.length === 0) {
      toast({
        variant: "destructive",
        title: "No students selected",
        description: "Please select at least one student.",
      });
      return;
    }

    if (!bulkData.subject || !bulkData.examName) {
      toast({
        variant: "destructive",
        title: "Missing information",
        description: "Please fill in all required fields.",
      });
      return;
    }

    setIsGenerating(true);
    setGenerationProgress(0);

    try {
      const total = selectedResults.length;
      
      for (let i = 0; i < selectedResults.length; i++) {
        const result = selectedResults[i];
        
        await addResult({
          student_id: result.studentId,
          subject_id: bulkData.subject, // In real app, this would be the subject ID
          exam_type: bulkData.examType,
          marks_obtained: result.marks,
          total_marks: bulkData.maxMarks,
          grade: result.grade,
          remarks: result.remarks,
          exam_date: bulkData.examDate,
          academic_year: bulkData.academicYear
        });

        setGenerationProgress(((i + 1) / total) * 100);
        
        // Small delay to show progress
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      toast({
        title: "Bulk results generated",
        description: `Successfully generated ${selectedResults.length} results.`,
      });

      setStep('review');
    } catch (error) {
      console.error('Error generating bulk results:', error);
      toast({
        variant: "destructive",
        title: "Generation failed",
        description: "There was an error generating the results.",
      });
    } finally {
      setIsGenerating(false);
      setGenerationProgress(0);
    }
  };

  const exportResults = () => {
    const csvContent = [
      ['Student ID', 'Student Name', 'Subject', 'Exam', 'Marks', 'Max Marks', 'Grade', 'Remarks'],
      ...studentResults
        .filter(result => result.selected)
        .map(result => [
          result.studentId,
          result.studentName,
          bulkData.subject,
          bulkData.examName,
          result.marks.toString(),
          bulkData.maxMarks.toString(),
          result.grade,
          result.remarks
        ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${bulkData.grade}_${bulkData.section}_${bulkData.subject}_Results.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: "Results exported",
      description: "Results have been exported to CSV file.",
    });
  };

  const resetBulkGeneration = () => {
    setStep('setup');
    setStudentResults([]);
    setBulkData({
      ...bulkData,
      examName: ''
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Bulk Result Generator
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Generate results for multiple students at once
              </p>
            </div>
            <div className="flex gap-2">
              {step !== 'setup' && (
                <Button
                  variant="outline"
                  onClick={resetBulkGeneration}
                  className="gap-2"
                >
                  <RotateCcw className="h-4 w-4" />
                  Reset
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {step === 'setup' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Grade *</Label>
                  <Select
                    value={bulkData.grade}
                    onValueChange={(value) => setBulkData({ ...bulkData, grade: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select grade" />
                    </SelectTrigger>
                    <SelectContent>
                      {grades.map(grade => (
                        <SelectItem key={grade} value={grade}>{grade}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Section *</Label>
                  <Select
                    value={bulkData.section}
                    onValueChange={(value) => setBulkData({ ...bulkData, section: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select section" />
                    </SelectTrigger>
                    <SelectContent>
                      {sections.map(section => (
                        <SelectItem key={section} value={section}>{section}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Subject *</Label>
                  <Select
                    value={bulkData.subject}
                    onValueChange={(value) => setBulkData({ ...bulkData, subject: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select subject" />
                    </SelectTrigger>
                    <SelectContent>
                      {subjects.map(subject => (
                        <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Exam Type</Label>
                  <Select
                    value={bulkData.examType}
                    onValueChange={(value) => setBulkData({ ...bulkData, examType: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="midterm">Midterm</SelectItem>
                      <SelectItem value="final">Final</SelectItem>
                      <SelectItem value="quiz">Quiz</SelectItem>
                      <SelectItem value="assignment">Assignment</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Exam Name *</Label>
                  <Input
                    value={bulkData.examName}
                    onChange={(e) => setBulkData({ ...bulkData, examName: e.target.value })}
                    placeholder="e.g., Midterm Exam 2024"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Max Marks</Label>
                  <Input
                    type="number"
                    value={bulkData.maxMarks}
                    onChange={(e) => setBulkData({ ...bulkData, maxMarks: parseInt(e.target.value) || 100 })}
                    min="1"
                    max="1000"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Exam Date</Label>
                  <Input
                    type="date"
                    value={bulkData.examDate}
                    onChange={(e) => setBulkData({ ...bulkData, examDate: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Academic Year</Label>
                  <Input
                    value={bulkData.academicYear}
                    onChange={(e) => setBulkData({ ...bulkData, academicYear: e.target.value })}
                    placeholder="2024"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={loadStudentsForBulk} className="gap-2">
                  <Users className="h-4 w-4" />
                  Load Students
                </Button>
              </div>
            </div>
          )}

          {step === 'marks' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium">Enter Marks</h3>
                  <p className="text-sm text-muted-foreground">
                    {bulkData.grade} {bulkData.section} - {bulkData.subject} ({bulkData.examName})
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="selectAll"
                    checked={studentResults.every(result => result.selected)}
                    onCheckedChange={(checked) => selectAllStudents(checked as boolean)}
                  />
                  <Label htmlFor="selectAll">Select All</Label>
                </div>
              </div>

              <div className="max-h-96 overflow-y-auto border rounded-lg">
                <div className="grid grid-cols-1 gap-2 p-4">
                  {studentResults.map((result, index) => (
                    <div key={result.studentId} 
                         className={`flex items-center gap-4 p-3 rounded-lg border ${
                           result.selected ? 'bg-primary/5 border-primary/20' : 'bg-muted/20'
                         }`}>
                      <Checkbox
                        checked={result.selected}
                        onCheckedChange={() => toggleStudentSelection(index)}
                      />
                      <div className="flex-1">
                        <div className="font-medium">{result.studentName}</div>
                        <div className="text-sm text-muted-foreground">{result.studentId}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          value={result.marks}
                          onChange={(e) => updateStudentMarks(index, parseInt(e.target.value) || 0)}
                          min="0"
                          max={bulkData.maxMarks}
                          placeholder="Marks"
                          className="w-20"
                          disabled={!result.selected}
                        />
                        <span className="text-muted-foreground">/ {bulkData.maxMarks}</span>
                        {result.grade && (
                          <Badge variant={result.grade.includes('A') ? 'default' : 
                                        result.grade.includes('B') ? 'secondary' :
                                        result.grade.includes('C') ? 'outline' : 'destructive'}>
                            {result.grade}
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setStep('setup')}>
                  Back to Setup
                </Button>
                <Button onClick={generateBulkResults} disabled={isGenerating} className="gap-2">
                  {isGenerating ? (
                    <>
                      <Pause className="h-4 w-4" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4" />
                      Generate Results
                    </>
                  )}
                </Button>
              </div>

              {isGenerating && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Generating results...</span>
                    <span>{Math.round(generationProgress)}%</span>
                  </div>
                  <Progress value={generationProgress} />
                </div>
              )}
            </div>
          )}

          {step === 'review' && (
            <div className="space-y-4">
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-lg font-medium mb-2">Results Generated Successfully!</h3>
                <p className="text-muted-foreground">
                  Generated results for {studentResults.filter(r => r.selected).length} students
                </p>
              </div>

              <div className="flex justify-center gap-4">
                <Button onClick={exportResults} className="gap-2">
                  <Download className="h-4 w-4" />
                  Export Results
                </Button>
                <Button variant="outline" onClick={resetBulkGeneration} className="gap-2">
                  <RotateCcw className="h-4 w-4" />
                  Generate More
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BulkResultGenerator;