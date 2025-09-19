import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Upload,
  Download,
  FileSpreadsheet,
  Users,
  CheckCircle,
  AlertCircle,
  Play,
  Pause,
  RotateCcw,
  FileDown,
  Calculator,
  GraduationCap
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useStudents } from '@/hooks/useStudents';
import { supabase } from '@/integrations/supabase/client';
import * as XLSX from 'xlsx';

interface BulkResult {
  student_id: string;
  student_name: string;
  subject_id: string;
  subject_name: string;
  exam_type: string;
  exam_date: string;
  marks_obtained: number;
  total_marks: number;
  grade: string;
  academic_year: string;
  term: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
  error_message?: string;
}

interface Subject {
  id: string;
  name: string;
  code: string;
  grade_levels: number[];
}

const EnhancedBulkResultGenerator: React.FC = () => {
  const { toast } = useToast();
  const { students } = useStudents();
  
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selectedGrade, setSelectedGrade] = useState<string>('');
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [examType, setExamType] = useState<string>('');
  const [examDate, setExamDate] = useState<string>('');
  const [academicYear, setAcademicYear] = useState<string>('2024');
  const [term, setTerm] = useState<string>('');
  const [totalMarks, setTotalMarks] = useState<number>(100);
  
  const [bulkResults, setBulkResults] = useState<BulkResult[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [processProgress, setProcessProgress] = useState(0);
  
  const [csvData, setCsvData] = useState<any[]>([]);
  const [csvHeaders, setCsvHeaders] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState('manual');

  const examTypes = [
    'Mid-Term Exam',
    'Final Exam',
    'Quiz',
    'Assignment',
    'Project',
    'Class Test',
    'Practical',
    'Oral Exam'
  ];

  const terms = [
    'Term 1',
    'Term 2', 
    'Term 3',
    'Semester 1',
    'Semester 2'
  ];

  const gradeRanges = [
    { min: 90, max: 100, grade: 'A+' },
    { min: 85, max: 89, grade: 'A' },
    { min: 80, max: 84, grade: 'A-' },
    { min: 75, max: 79, grade: 'B+' },
    { min: 70, max: 74, grade: 'B' },
    { min: 65, max: 69, grade: 'B-' },
    { min: 60, max: 64, grade: 'C+' },
    { min: 55, max: 59, grade: 'C' },
    { min: 50, max: 54, grade: 'C-' },
    { min: 40, max: 49, grade: 'D' },
    { min: 0, max: 39, grade: 'F' }
  ];

  useEffect(() => {
    loadSubjects();
    setExamDate(new Date().toISOString().split('T')[0]);
  }, []);

  const loadSubjects = async () => {
    try {
      const { data, error } = await supabase
        .from('subjects')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      setSubjects(data || []);
    } catch (error) {
      console.error('Error loading subjects:', error);
    }
  };

  const calculateGrade = (percentage: number): string => {
    for (const range of gradeRanges) {
      if (percentage >= range.min && percentage <= range.max) {
        return range.grade;
      }
    }
    return 'F';
  };

  const getAvailableSubjects = () => {
    if (!selectedGrade) return subjects;
    const gradeNumber = parseInt(selectedGrade);
    return subjects.filter(subject => 
      subject.grade_levels.includes(gradeNumber)
    );
  };

  const getStudentsByGrade = () => {
    if (!selectedGrade) return students;
    const gradeNumber = parseInt(selectedGrade);
    return students.filter(student => parseInt(student.grade?.replace('Grade ', '') || '0') === gradeNumber);
  };

  const generateManualResults = () => {
    if (!selectedGrade || !selectedSubject || !examType || !examDate) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please fill in all required fields",
      });
      return;
    }

    const gradeStudents = getStudentsByGrade();
    const selectedSubjectData = subjects.find(s => s.id === selectedSubject);

    if (!selectedSubjectData) {
      toast({
        variant: "destructive",
        title: "Subject Not Found",
        description: "Please select a valid subject",
      });
      return;
    }

    const results: BulkResult[] = gradeStudents.map(student => ({
      student_id: student.id,
      student_name: student.full_name,
      subject_id: selectedSubject,
      subject_name: selectedSubjectData.name,
      exam_type: examType,
      exam_date: examDate,
      marks_obtained: 0, // Will be filled manually
      total_marks: totalMarks,
      grade: 'F',
      academic_year: academicYear,
      term: term,
      status: 'pending' as const
    }));

    setBulkResults(results);
    toast({
      title: "Results Generated",
      description: `Generated ${results.length} result entries for ${selectedSubjectData.name}`,
    });
  };

  const handleCsvUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        
        if (jsonData.length > 0) {
          const headers = jsonData[0] as string[];
          const rows = jsonData.slice(1) as any[][];
          
          setCsvHeaders(headers);
          setCsvData(rows.map(row => {
            const obj: any = {};
            headers.forEach((header, index) => {
              obj[header] = row[index];
            });
            return obj;
          }));

          toast({
            title: "CSV Uploaded",
            description: `Loaded ${rows.length} rows from CSV file`,
          });
        }
      } catch (error) {
        console.error('Error reading CSV:', error);
        toast({
          variant: "destructive",
          title: "CSV Error",
          description: "Failed to read CSV file. Please check the format.",
        });
      }
    };
    reader.readAsBinaryString(file);
  };

  const processCsvData = () => {
    if (csvData.length === 0) {
      toast({
        variant: "destructive",
        title: "No CSV Data",
        description: "Please upload a CSV file first",
      });
      return;
    }

    const results: BulkResult[] = csvData.map((row, index) => {
      const marksObtained = parseFloat(row['Marks Obtained'] || row['marks'] || 0);
      const totalMarks = parseFloat(row['Total Marks'] || row['total'] || 100);
      const percentage = totalMarks > 0 ? (marksObtained / totalMarks) * 100 : 0;
      const grade = calculateGrade(percentage);

      return {
        student_id: row['Student ID'] || row['student_id'] || `STU${index + 1}`,
        student_name: row['Student Name'] || row['name'] || `Student ${index + 1}`,
        subject_id: selectedSubject || 'unknown',
        subject_name: subjects.find(s => s.id === selectedSubject)?.name || 'Unknown Subject',
        exam_type: row['Exam Type'] || examType || 'Assignment',
        exam_date: row['Exam Date'] || examDate || new Date().toISOString().split('T')[0],
        marks_obtained: marksObtained,
        total_marks: totalMarks,
        grade,
        academic_year: row['Academic Year'] || academicYear || '2024',
        term: row['Term'] || term || 'Term 1',
        status: 'pending' as const
      };
    });

    setBulkResults(results);
    toast({
      title: "CSV Data Processed",
      description: `Processed ${results.length} result entries from CSV`,
    });
  };

  const updateResultMarks = (index: number, marks: number) => {
    const updated = [...bulkResults];
    const result = updated[index];
    result.marks_obtained = marks;
    const percentage = result.total_marks > 0 ? (marks / result.total_marks) * 100 : 0;
    result.grade = calculateGrade(percentage);
    setBulkResults(updated);
  };

  const processResults = async () => {
    if (bulkResults.length === 0) {
      toast({
        variant: "destructive",
        title: "No Results",
        description: "Please generate or upload results first",
      });
      return;
    }

    setIsProcessing(true);
    setIsPaused(false);
    setProcessProgress(0);

    const batchSize = 5; // Process 5 results at a time
    let processed = 0;

    try {
      for (let i = 0; i < bulkResults.length; i += batchSize) {
        if (isPaused) {
          break;
        }

        const batch = bulkResults.slice(i, i + batchSize);
        const updates = [...bulkResults];

        // Mark batch as processing
        for (let j = i; j < Math.min(i + batchSize, bulkResults.length); j++) {
          updates[j].status = 'processing';
        }
        setBulkResults([...updates]);

        // Process batch
        const { data: { user } } = await supabase.auth.getUser();
        const resultsToInsert = batch.map(result => ({
          student_id: result.student_id,
          subject_id: result.subject_id,
          exam_type: result.exam_type,
          exam_date: result.exam_date,
          marks_obtained: result.marks_obtained,
          total_marks: result.total_marks,
          grade: result.grade,
          academic_year: result.academic_year,
          term: result.term,
          created_by: user?.id
        }));

        const { error } = await supabase
          .from('results')
          .insert(resultsToInsert);

        // Update status
        for (let j = i; j < Math.min(i + batchSize, bulkResults.length); j++) {
          if (error) {
            updates[j].status = 'error';
            updates[j].error_message = error.message;
          } else {
            updates[j].status = 'completed';
          }
        }

        setBulkResults([...updates]);
        processed += batch.length;
        setProcessProgress((processed / bulkResults.length) * 100);

        // Small delay to show progress
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      if (!isPaused) {
        toast({
          title: "Processing Complete",
          description: `Successfully processed ${processed} results`,
        });
      }
    } catch (error) {
      console.error('Error processing results:', error);
      toast({
        variant: "destructive",
        title: "Processing Error",
        description: "Failed to process some results. Check the logs.",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const pauseProcessing = () => {
    setIsPaused(true);
    setIsProcessing(false);
  };

  const resetResults = () => {
    setBulkResults([]);
    setProcessProgress(0);
    setIsProcessing(false);
    setIsPaused(false);
    setCsvData([]);
  };

  const exportResults = () => {
    const exportData = bulkResults.map(result => ({
      'Student ID': result.student_id,
      'Student Name': result.student_name,
      'Subject': result.subject_name,
      'Exam Type': result.exam_type,
      'Exam Date': result.exam_date,
      'Marks Obtained': result.marks_obtained,
      'Total Marks': result.total_marks,
      'Percentage': ((result.marks_obtained / result.total_marks) * 100).toFixed(2) + '%',
      'Grade': result.grade,
      'Academic Year': result.academic_year,
      'Term': result.term,
      'Status': result.status,
      'Error': result.error_message || ''
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Results');
    XLSX.writeFile(workbook, `bulk_results_${new Date().toISOString().split('T')[0]}.xlsx`);

    toast({
      title: "Export Complete",
      description: "Results exported to Excel file",
    });
  };

  const downloadTemplate = () => {
    const templateData = [{
      'Student ID': 'STU001',
      'Student Name': 'John Doe',
      'Marks Obtained': 85,
      'Total Marks': 100,
      'Exam Type': 'Mid-Term Exam',
      'Exam Date': '2024-01-15',
      'Academic Year': '2024',
      'Term': 'Term 1'
    }];

    const worksheet = XLSX.utils.json_to_sheet(templateData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Template');
    XLSX.writeFile(workbook, 'bulk_results_template.xlsx');

    toast({
      title: "Template Downloaded",
      description: "Use this template to upload your results",
    });
  };

  const getStatusColor = (status: BulkResult['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'processing': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'error': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto p-4">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold flex items-center justify-center gap-2">
          <Calculator className="h-6 w-6" />
          Bulk Result Generator
        </h1>
        <p className="text-muted-foreground">
          Generate and process exam results for multiple students efficiently
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="manual">Manual Entry</TabsTrigger>
          <TabsTrigger value="csv">CSV Upload</TabsTrigger>
        </TabsList>

        <TabsContent value="manual" className="space-y-6">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5" />
                Manual Result Generation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Grade Level *</Label>
                  <Select value={selectedGrade} onValueChange={setSelectedGrade}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select grade" />
                    </SelectTrigger>
                    <SelectContent>
                      {[7, 8, 9, 10, 11, 12, 13].map(grade => (
                        <SelectItem key={grade} value={grade.toString()}>
                          Grade {grade}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Subject *</Label>
                  <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select subject" />
                    </SelectTrigger>
                    <SelectContent>
                      {getAvailableSubjects().map(subject => (
                        <SelectItem key={subject.id} value={subject.id}>
                          {subject.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Exam Type *</Label>
                  <Select value={examType} onValueChange={setExamType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select exam type" />
                    </SelectTrigger>
                    <SelectContent>
                      {examTypes.map(type => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Exam Date *</Label>
                  <Input
                    type="date"
                    value={examDate}
                    onChange={(e) => setExamDate(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Total Marks</Label>
                  <Input
                    type="number"
                    value={totalMarks}
                    onChange={(e) => setTotalMarks(parseInt(e.target.value))}
                    min="1"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Term *</Label>
                  <Select value={term} onValueChange={setTerm}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select term" />
                    </SelectTrigger>
                    <SelectContent>
                      {terms.map(termItem => (
                        <SelectItem key={termItem} value={termItem}>
                          {termItem}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex gap-2">
                <Button onClick={generateManualResults} className="gap-2">
                  <Users className="h-4 w-4" />
                  Generate Results for Grade {selectedGrade}
                </Button>
                {selectedGrade && (
                  <div className="text-sm text-muted-foreground flex items-center">
                    ({getStudentsByGrade().length} students)
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="csv" className="space-y-6">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileSpreadsheet className="h-5 w-5" />
                CSV Upload
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <Upload className="h-4 w-4" />
                <AlertDescription>
                  Upload a CSV file with columns: Student ID, Student Name, Marks Obtained, Total Marks, etc.
                  <Button 
                    variant="link" 
                    onClick={downloadTemplate}
                    className="p-0 h-auto ml-2"
                  >
                    Download Template
                  </Button>
                </AlertDescription>
              </Alert>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Upload CSV File</Label>
                  <Input
                    type="file"
                    accept=".csv,.xlsx,.xls"
                    onChange={handleCsvUpload}
                    className="file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Subject for CSV Data</Label>
                  <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select subject" />
                    </SelectTrigger>
                    <SelectContent>
                      {subjects.map(subject => (
                        <SelectItem key={subject.id} value={subject.id}>
                          {subject.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {csvData.length > 0 && (
                <div className="space-y-2">
                  <Label>CSV Preview ({csvData.length} rows)</Label>
                  <div className="border rounded-lg p-3 bg-muted/30 max-h-48 overflow-auto">
                    <div className="text-sm">
                      <div className="font-medium text-muted-foreground mb-2">
                        Columns: {csvHeaders.join(', ')}
                      </div>
                      <div className="space-y-1">
                        {csvData.slice(0, 3).map((row, index) => (
                          <div key={index} className="text-xs">
                            Row {index + 1}: {Object.values(row).slice(0, 3).join(' | ')}...
                          </div>
                        ))}
                        {csvData.length > 3 && (
                          <div className="text-xs text-muted-foreground">
                            ... and {csvData.length - 3} more rows
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <Button 
                onClick={processCsvData} 
                disabled={csvData.length === 0}
                className="gap-2"
              >
                <FileSpreadsheet className="h-4 w-4" />
                Process CSV Data
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Results Table */}
      {bulkResults.length > 0 && (
        <Card className="glass-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                Bulk Results ({bulkResults.length} entries)
              </CardTitle>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={exportResults}
                  size="sm"
                  className="gap-2"
                >
                  <FileDown className="h-4 w-4" />
                  Export
                </Button>
                <Button
                  variant="outline"
                  onClick={resetResults}
                  size="sm"
                  className="gap-2"
                >
                  <RotateCcw className="h-4 w-4" />
                  Reset
                </Button>
                {!isProcessing ? (
                  <Button
                    onClick={processResults}
                    size="sm"
                    className="gap-2"
                  >
                    <Play className="h-4 w-4" />
                    Process Results
                  </Button>
                ) : (
                  <Button
                    variant="destructive"
                    onClick={pauseProcessing}
                    size="sm"
                    className="gap-2"
                  >
                    <Pause className="h-4 w-4" />
                    Pause
                  </Button>
                )}
              </div>
            </div>
            
            {isProcessing && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Processing results...</span>
                  <span>{Math.round(processProgress)}%</span>
                </div>
                <Progress value={processProgress} className="h-2" />
              </div>
            )}
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {['pending', 'processing', 'completed', 'error'].map(status => (
                  <div key={status} className="text-center">
                    <div className="text-2xl font-bold">
                      {bulkResults.filter(r => r.status === status).length}
                    </div>
                    <div className="text-sm text-muted-foreground capitalize">
                      {status}
                    </div>
                  </div>
                ))}
              </div>

              {/* Results Grid */}
              <div className="max-h-96 overflow-auto border rounded-lg">
                <div className="grid grid-cols-1 gap-2 p-4">
                  {bulkResults.map((result, index) => (
                    <div key={index} className="border rounded-lg p-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">{result.student_name}</div>
                          <div className="text-sm text-muted-foreground">
                            {result.subject_name} • {result.exam_type}
                          </div>
                        </div>
                        <Badge className={getStatusColor(result.status)}>
                          {result.status}
                        </Badge>
                      </div>
                      
                      {result.status === 'pending' && activeTab === 'manual' && (
                        <div className="flex gap-2 items-center">
                          <Input
                            type="number"
                            placeholder="Marks"
                            value={result.marks_obtained || ''}
                            onChange={(e) => updateResultMarks(index, parseFloat(e.target.value) || 0)}
                            min="0"
                            max={result.total_marks}
                            className="w-24"
                          />
                          <span className="text-sm text-muted-foreground">
                            / {result.total_marks} = {result.grade}
                          </span>
                        </div>
                      )}

                      {result.status !== 'pending' && (
                        <div className="text-sm">
                          <span className="font-medium">{result.marks_obtained}</span>
                          <span className="text-muted-foreground">
                            /{result.total_marks} ({((result.marks_obtained / result.total_marks) * 100).toFixed(1)}%) - Grade: {result.grade}
                          </span>
                        </div>
                      )}

                      {result.error_message && (
                        <div className="text-xs text-destructive bg-destructive/10 p-2 rounded">
                          <AlertCircle className="h-3 w-3 inline mr-1" />
                          {result.error_message}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default EnhancedBulkResultGenerator;