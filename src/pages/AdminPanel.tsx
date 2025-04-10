import React, { useState, useEffect } from "react";
import { CheckCircle, Edit, PlusCircle, Search, Shield, Trash, UserCog, AlertCircle, UserPlus, UserMinus, School, GraduationCap, BookOpenCheck, Save, Plus, Minus, Check } from "lucide-react";
import { useToast } from "../hooks/use-toast";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../components/ui/tabs";
import GradeCriteriaTab from "../components/GradeCriteriaTab";

interface User {
  id: number;
  name: string;
  email: string;
  role: 'Teacher' | 'Admin' | 'Clerk' | 'Student';
  department?: string;
  addedOn: string;
  isSuperUser?: boolean;
}

interface Student {
  id: number;
  name: string;
  grade: string;
  section: string;
  rollNo: string;
  parentName: string;
  contactNo: string;
  addedOn: string;
}

interface Teacher {
  id: number;
  name: string;
  email: string;
  department: string;
  qualification: string;
  joinDate: string;
  contactNo: string;
}

interface GradeRange {
  grade: string;
  minPercentage: number;
  maxPercentage: number;
}

interface GradeCriteria {
  grade: string;
  passingPercentage: number;
  gradeRanges: GradeRange[];
  hasAdvancedCriteria?: boolean;
  mainSubjectsRanges?: GradeRange[];
  subSubjectsRanges?: GradeRange[];
  mainPassingPercentage?: number;
  subPassingPercentage?: number;
}

interface CurrentUser {
  email: string;
  name: string;
  role: string;
  isSuperUser: boolean;
}

// Define grade threshold interface for the new component
interface GradeThreshold {
  min: number;
  max: number;
  grade: string;
}

// Define interface for the criteria structure the new component uses
interface GradeCriteriaStructure {
  [key: number]: {
    main?: GradeThreshold[];
    sub?: GradeThreshold[];
    default?: GradeThreshold[];
  };
}

const AdminPanel: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState<'Teacher' | 'Admin' | 'Clerk'>('Teacher');
  const [newUserName, setNewUserName] = useState('');
  const [newUserDepartment, setNewUserDepartment] = useState('');
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('users');
  const [editingGradeId, setEditingGradeId] = useState<string | null>(null);
  const [editingRangeType, setEditingRangeType] = useState<'standard' | 'main' | 'sub'>('standard');

  // Student management state
  const [students, setStudents] = useState<Student[]>([
    { id: 1, name: 'John Carter', grade: 'Grade 3', section: 'A', rollNo: 'S1001', parentName: 'David Carter', contactNo: '555-123-4567', addedOn: '2023-07-15' },
    { id: 2, name: 'Emma Wilson', grade: 'Grade 5', section: 'B', rollNo: 'S1002', parentName: 'Mary Wilson', contactNo: '555-234-5678', addedOn: '2023-08-10' },
    { id: 3, name: 'Michael Chen', grade: 'Grade 8', section: 'A', rollNo: 'S1003', parentName: 'James Chen', contactNo: '555-345-6789', addedOn: '2023-06-22' },
    { id: 4, name: 'Sophia Kumar', grade: 'Grade 10', section: 'C', rollNo: 'S1004', parentName: 'Rahul Kumar', contactNo: '555-456-7890', addedOn: '2023-09-01' },
  ]);
  const [newStudent, setNewStudent] = useState<Omit<Student, 'id' | 'addedOn'>>({
    name: '',
    grade: '',
    section: '',
    rollNo: '',
    parentName: '',
    contactNo: '',
  });

  // Teacher management state
  const [teachers, setTeachers] = useState<Teacher[]>([
    { id: 1, name: 'Dr. Sarah Johnson', email: 'sjohnson@adventistcollege.mu', department: 'Science', qualification: 'PhD, Chemistry', joinDate: '2020-05-10', contactNo: '555-987-6543' },
    { id: 2, name: 'Prof. Michael Brown', email: 'mbrown@adventistcollege.mu', department: 'Mathematics', qualification: 'MSc, Applied Mathematics', joinDate: '2018-08-15', contactNo: '555-876-5432' },
    { id: 3, name: 'Ms. Emily Davis', email: 'edavis@adventistcollege.mu', department: 'English', qualification: 'BA, English Literature', joinDate: '2021-01-20', contactNo: '555-765-4321' },
  ]);
  const [newTeacher, setNewTeacher] = useState<Omit<Teacher, 'id'>>({
    name: '',
    email: '',
    department: '',
    qualification: '',
    joinDate: new Date().toISOString().split('T')[0],
    contactNo: '',
  });

  // Grade criteria management state - default criteria for each grade
  const [gradeCriteria, setGradeCriteria] = useState<GradeCriteria[]>([
    {
      grade: 'Grade 7',
      passingPercentage: 50,
      gradeRanges: [
        { grade: 'A+', minPercentage: 90, maxPercentage: 100 },
        { grade: 'A', minPercentage: 80, maxPercentage: 89 },
        { grade: 'B', minPercentage: 70, maxPercentage: 79 },
        { grade: 'C', minPercentage: 60, maxPercentage: 69 },
        { grade: 'D', minPercentage: 50, maxPercentage: 59 },
        { grade: 'F', minPercentage: 0, maxPercentage: 49 },
      ]
    },
    {
      grade: 'Grade 8',
      passingPercentage: 50,
      gradeRanges: [
        { grade: 'A+', minPercentage: 90, maxPercentage: 100 },
        { grade: 'A', minPercentage: 80, maxPercentage: 89 },
        { grade: 'B', minPercentage: 70, maxPercentage: 79 },
        { grade: 'C', minPercentage: 60, maxPercentage: 69 },
        { grade: 'D', minPercentage: 50, maxPercentage: 59 },
        { grade: 'F', minPercentage: 0, maxPercentage: 49 },
      ]
    },
    {
      grade: 'Grade 9',
      passingPercentage: 50,
      gradeRanges: [
        { grade: 'A+', minPercentage: 90, maxPercentage: 100 },
        { grade: 'A', minPercentage: 80, maxPercentage: 89 },
        { grade: 'B', minPercentage: 70, maxPercentage: 79 },
        { grade: 'C', minPercentage: 60, maxPercentage: 69 },
        { grade: 'D', minPercentage: 50, maxPercentage: 59 },
        { grade: 'F', minPercentage: 0, maxPercentage: 49 },
      ]
    },
    {
      grade: 'Grade 10',
      passingPercentage: 50,
      gradeRanges: [
        { grade: 'A+', minPercentage: 90, maxPercentage: 100 },
        { grade: 'A', minPercentage: 80, maxPercentage: 89 },
        { grade: 'B', minPercentage: 70, maxPercentage: 79 },
        { grade: 'C', minPercentage: 60, maxPercentage: 69 },
        { grade: 'D', minPercentage: 50, maxPercentage: 59 },
        { grade: 'F', minPercentage: 0, maxPercentage: 49 },
      ]
    },
    {
      grade: 'Grade 11',
      passingPercentage: 55,
      gradeRanges: [
        { grade: 'A+', minPercentage: 90, maxPercentage: 100 },
        { grade: 'A', minPercentage: 80, maxPercentage: 89 },
        { grade: 'B+', minPercentage: 75, maxPercentage: 79 },
        { grade: 'B', minPercentage: 70, maxPercentage: 74 },
        { grade: 'C+', minPercentage: 65, maxPercentage: 69 },
        { grade: 'C', minPercentage: 60, maxPercentage: 64 },
        { grade: 'D', minPercentage: 55, maxPercentage: 59 },
        { grade: 'F', minPercentage: 0, maxPercentage: 54 },
      ]
    },
    {
      grade: 'Grade 12',
      passingPercentage: 60,
      gradeRanges: [
        { grade: 'A+', minPercentage: 90, maxPercentage: 100 },
        { grade: 'A', minPercentage: 80, maxPercentage: 89 },
        { grade: 'B+', minPercentage: 75, maxPercentage: 79 },
        { grade: 'B', minPercentage: 70, maxPercentage: 74 },
        { grade: 'C+', minPercentage: 65, maxPercentage: 69 },
        { grade: 'C', minPercentage: 60, maxPercentage: 64 },
        { grade: 'D', minPercentage: 55, maxPercentage: 59 },
        { grade: 'F', minPercentage: 0, maxPercentage: 54 },
      ],
      hasAdvancedCriteria: true,
      mainPassingPercentage: 65,
      subPassingPercentage: 55,
      mainSubjectsRanges: [
        { grade: 'A+', minPercentage: 90, maxPercentage: 100 },
        { grade: 'A', minPercentage: 85, maxPercentage: 89 },
        { grade: 'B+', minPercentage: 80, maxPercentage: 84 },
        { grade: 'B', minPercentage: 75, maxPercentage: 79 },
        { grade: 'C+', minPercentage: 70, maxPercentage: 74 },
        { grade: 'C', minPercentage: 65, maxPercentage: 69 },
        { grade: 'F', minPercentage: 0, maxPercentage: 64 },
      ],
      subSubjectsRanges: [
        { grade: 'A+', minPercentage: 90, maxPercentage: 100 },
        { grade: 'A', minPercentage: 80, maxPercentage: 89 },
        { grade: 'B+', minPercentage: 70, maxPercentage: 79 },
        { grade: 'B', minPercentage: 65, maxPercentage: 69 },
        { grade: 'C', minPercentage: 55, maxPercentage: 64 },
        { grade: 'F', minPercentage: 0, maxPercentage: 54 },
      ]
    },
    {
      grade: 'Grade 13',
      passingPercentage: 60,
      gradeRanges: [
        { grade: 'A+', minPercentage: 90, maxPercentage: 100 },
        { grade: 'A', minPercentage: 80, maxPercentage: 89 },
        { grade: 'B+', minPercentage: 75, maxPercentage: 79 },
        { grade: 'B', minPercentage: 70, maxPercentage: 74 },
        { grade: 'C+', minPercentage: 65, maxPercentage: 69 },
        { grade: 'C', minPercentage: 60, maxPercentage: 64 },
        { grade: 'D', minPercentage: 55, maxPercentage: 59 },
        { grade: 'F', minPercentage: 0, maxPercentage: 54 },
      ],
      hasAdvancedCriteria: true,
      mainPassingPercentage: 65,
      subPassingPercentage: 55,
      mainSubjectsRanges: [
        { grade: 'A+', minPercentage: 90, maxPercentage: 100 },
        { grade: 'A', minPercentage: 85, maxPercentage: 89 },
        { grade: 'B+', minPercentage: 80, maxPercentage: 84 },
        { grade: 'B', minPercentage: 75, maxPercentage: 79 },
        { grade: 'C+', minPercentage: 70, maxPercentage: 74 },
        { grade: 'C', minPercentage: 65, maxPercentage: 69 },
        { grade: 'F', minPercentage: 0, maxPercentage: 64 },
      ],
      subSubjectsRanges: [
        { grade: 'A+', minPercentage: 90, maxPercentage: 100 },
        { grade: 'A', minPercentage: 80, maxPercentage: 89 },
        { grade: 'B+', minPercentage: 70, maxPercentage: 79 },
        { grade: 'B', minPercentage: 65, maxPercentage: 69 },
        { grade: 'C', minPercentage: 55, maxPercentage: 64 },
        { grade: 'F', minPercentage: 0, maxPercentage: 54 },
      ]
    }
  ]);

  // State for the GradeCriteriaTab component
  const [gradeCriteriaByGrade, setGradeCriteriaByGrade] = useState<GradeCriteriaStructure>({});

  // Convert the old format to the new format for GradeCriteriaTab
  useEffect(() => {
    // Initialize the structure
    const newCriteria: GradeCriteriaStructure = {};

    // Convert each grade's criteria to the new format
    gradeCriteria.forEach(criteria => {
      const gradeNumber = parseInt(criteria.grade.replace('Grade ', ''));
      
      if (!isNaN(gradeNumber)) {
        newCriteria[gradeNumber] = {
          default: criteria.gradeRanges.map(range => ({
            min: range.minPercentage,
            max: range.maxPercentage,
            grade: range.grade
          }))
        };

        // Add main and sub criteria for grades 12 and 13
        if (criteria.hasAdvancedCriteria && criteria.mainSubjectsRanges && criteria.subSubjectsRanges) {
          newCriteria[gradeNumber].main = criteria.mainSubjectsRanges.map(range => ({
            min: range.minPercentage,
            max: range.maxPercentage,
            grade: range.grade
          }));

          newCriteria[gradeNumber].sub = criteria.subSubjectsRanges.map(range => ({
            min: range.minPercentage,
            max: range.maxPercentage,
            grade: range.grade
          }));
        }
      }
    });

    setGradeCriteriaByGrade(newCriteria);
  }, [gradeCriteria]);

  const [newGradeRange, setNewGradeRange] = useState<GradeRange>({
    grade: '',
    minPercentage: 0,
    maxPercentage: 0
  });

  // Load current user on component mount
  useEffect(() => {
    const userStr = localStorage.getItem('currentUser');
    if (userStr) {
      const user = JSON.parse(userStr);
      setCurrentUser(user as CurrentUser);
    }

    // Load existing students and teachers from localStorage
    const savedStudents = localStorage.getItem('students');
    if (savedStudents) {
      setStudents(JSON.parse(savedStudents));
    }

    const savedTeachers = localStorage.getItem('teachers');
    if (savedTeachers) {
      setTeachers(JSON.parse(savedTeachers));
    }

    const savedGradeCriteria = localStorage.getItem('gradeCriteria');
    if (savedGradeCriteria) {
      try {
        const parsedCriteria = JSON.parse(savedGradeCriteria);
        // Make sure gradeCriteria is an array before setting it
        if (Array.isArray(parsedCriteria)) {
          setGradeCriteria(parsedCriteria);
        } else {
          console.error('Stored gradeCriteria is not an array:', parsedCriteria);
          // If not an array, keep the default state (which is an array)
        }
      } catch (error) {
        console.error('Error parsing gradeCriteria from localStorage:', error);
        // On error, keep the default state
      }
    }
  }, []);

  // Save to localStorage when data changes
  useEffect(() => {
    localStorage.setItem('students', JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem('teachers', JSON.stringify(teachers));
  }, [teachers]);

  useEffect(() => {
    localStorage.setItem('gradeCriteria', JSON.stringify(gradeCriteria));
  }, [gradeCriteria]);

  // Handle grade criteria changes from the GradeCriteriaTab component
  const handleGradeCriteriaChange = (gradeNumber: number, criteria: GradeThreshold[], isMain?: boolean) => {
    // Update the gradeCriteriaByGrade state
    setGradeCriteriaByGrade(prev => {
      const newState = { ...prev };
      
      if (!newState[gradeNumber]) {
        newState[gradeNumber] = {};
      }
      
      if (gradeNumber >= 12 && isMain !== undefined) {
        // For Grade 12 & 13 with main/sub subjects
        if (isMain) {
          newState[gradeNumber].main = criteria;
        } else {
          newState[gradeNumber].sub = criteria;
        }
      } else {
        // For other grades
        newState[gradeNumber].default = criteria;
      }
      
      return newState;
    });
    
    // Also update the original gradeCriteria state to keep both formats in sync
    setGradeCriteria(prev => {
      const newCriteria = [...prev];
      const criteriaIndex = newCriteria.findIndex(c => c.grade === `Grade ${gradeNumber}`);
      
      if (criteriaIndex >= 0) {
        if (gradeNumber >= 12 && isMain !== undefined) {
          // For Grade 12 & 13 with main/sub subjects
          const rangeType = isMain ? 'mainSubjectsRanges' : 'subSubjectsRanges';
          newCriteria[criteriaIndex][rangeType] = criteria.map(c => ({
            grade: c.grade,
            minPercentage: c.min,
            maxPercentage: c.max
          }));
        } else {
          // For other grades
          newCriteria[criteriaIndex].gradeRanges = criteria.map(c => ({
            grade: c.grade,
            minPercentage: c.min,
            maxPercentage: c.max
          }));
        }
      }
      
      return newCriteria;
    });
  };

  // Update email domain
  const formatEmail = (email: string) => {
    if (!email.includes('@')) return `${email}@adventistcollege.mu`;
    return email;
  };

  // Sample users data
  const [users, setUsers] = useState<User[]>([
    { id: 1, name: 'John Smith', email: 'johnsmith@adventistcollege.mu', role: 'Teacher', department: 'Mathematics', addedOn: '2023-05-15' },
    { id: 2, name: 'Sarah Johnson', email: 'sarahjohnson@adventistcollege.mu', role: 'Admin', addedOn: '2023-04-20' },
    { id: 3, name: 'Michael Brown', email: 'michaelbrown@adventistcollege.mu', role: 'Clerk', department: 'Administration', addedOn: '2023-06-10' },
    { id: 4, name: 'Emily Davis', email: 'emilydavis@adventistcollege.mu', role: 'Teacher', department: 'Science', addedOn: '2023-05-22' },
    { id: 5, name: 'Robert Wilson', email: 'robertwilson@adventistcollege.mu', role: 'Teacher', department: 'History', addedOn: '2023-07-01' },
    { id: 6, name: 'Billy Lachoumanan', email: 'blachoumanan@adventistcollege.mu', role: 'Admin', department: 'Superuser', addedOn: '2023-03-01', isSuperUser: true },
  ]);

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.department && user.department.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const filteredStudents = students.filter(student => 
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    student.grade.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.section.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.parentName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredTeachers = teachers.filter(teacher => 
    teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    teacher.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.qualification.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddUser = () => {
    if (!newUserEmail) {
      toast({
        title: "Email Required",
        description: "Please enter an email address for the new user.",
        variant: "destructive",
      });
      return;
    }
    
    const formattedEmail = formatEmail(newUserEmail);
    
    // Check if email already exists
    if (users.some(user => user.email.toLowerCase() === formattedEmail.toLowerCase())) {
      toast({
        title: "User Already Exists",
        description: "A user with this email already exists.",
        variant: "destructive",
      });
      return;
    }
    
    // Only superuser can add admin users
    if (newUserRole === 'Admin' && (!currentUser?.isSuperUser)) {
      toast({
        title: "Permission Denied",
        description: "Only the superuser can add administrators.",
        variant: "destructive",
      });
      return;
    }
    
    const newUser: User = {
      id: users.length + 1,
      name: newUserName || 'New User', // Use provided name or default
      email: formattedEmail,
      role: newUserRole,
      department: newUserDepartment || undefined,
      addedOn: new Date().toISOString().split('T')[0],
      isSuperUser: false // Regular users cannot be superusers
    };
    
    setUsers([...users, newUser]);
    setNewUserEmail('');
    setNewUserName('');
    setNewUserDepartment('');
    
    toast({
      title: "User Added Successfully",
      description: `${newUser.name} has been added as ${newUser.role}.`,
    });
  };

  const handleDeleteUser = (id: number) => {
    const userToDelete = users.find(user => user.id === id);
    
    // Prevent deleting the superuser
    if (userToDelete?.email.toLowerCase() === 'blachoumanan@adventistcollege.mu') {
      toast({
        title: "Cannot Delete Superuser",
        description: "This superuser account cannot be deleted.",
        variant: "destructive",
      });
      return;
    }
    
    // Only superuser can delete admin users
    if (userToDelete?.role === 'Admin' && !currentUser?.isSuperUser) {
      toast({
        title: "Permission Denied", 
        description: "Only the superuser can delete administrators.",
        variant: "destructive",
      });
      return;
    }
    
    setUsers(users.filter(user => user.id !== id));
    
    toast({
      title: "User Deleted",
      description: `${userToDelete?.name} has been removed.`,
    });
  };

  const handleAddStudent = () => {
    if (!newStudent.name || !newStudent.grade || !newStudent.rollNo) {
      toast({
        title: "Missing Information",
        description: "Please fill all required fields (Name, Grade, and Roll No).",
        variant: "destructive",
      });
      return;
    }

    const studentId = students.length > 0 ? Math.max(...students.map(s => s.id)) + 1 : 1;
    
    const student: Student = {
      ...newStudent,
      id: studentId,
      addedOn: new Date().toISOString().split('T')[0]
    };
    
    setStudents([...students, student]);
    setNewStudent({
      name: '',
      grade: '',
      section: '',
      rollNo: '',
      parentName: '',
      contactNo: '',
    });
    
    toast({
      title: "Student Added Successfully",
      description: `${student.name} has been added to ${student.grade}.`,
    });
  };

  const handleDeleteStudent = (id: number) => {
    const studentToDelete = students.find(student => student.id === id);
    
    setStudents(students.filter(student => student.id !== id));
    
    toast({
      title: "Student Deleted",
      description: `${studentToDelete?.name} has been removed.`,
    });
  };

  const handleAddTeacher = () => {
    if (!newTeacher.name || !newTeacher.email || !newTeacher.department) {
      toast({
        title: "Missing Information",
        description: "Please fill all required fields (Name, Email, and Department).",
        variant: "destructive",
      });
      return;
    }

    const teacherId = teachers.length > 0 ? Math.max(...teachers.map(t => t.id)) + 1 : 1;
    const formattedEmail = formatEmail(newTeacher.email);
    
    const teacher: Teacher = {
      ...newTeacher,
      id: teacherId,
      email: formattedEmail
    };
    
    setTeachers([...teachers, teacher]);
    setNewTeacher({
      name: '',
      email: '',
      department: '',
      qualification: '',
      joinDate: new Date().toISOString().split('T')[0],
      contactNo: '',
    });
    
    toast({
      title: "Teacher Added Successfully",
      description: `${teacher.name} has been added to the ${teacher.department} department.`,
    });
  };

  const handleDeleteTeacher = (id: number) => {
    const teacherToDelete = teachers.find(teacher => teacher.id === id);
    
    setTeachers(teachers.filter(teacher => teacher.id !== id));
    
    toast({
      title: "Teacher Deleted",
      description: `${teacherToDelete?.name} has been removed.`,
    });
  };

  const updateGradeCriteria = (index: number, field: string, value: number) => {
    const updatedCriteria = [...gradeCriteria];
    if (field === 'passingPercentage') {
      updatedCriteria[index].passingPercentage = value;
    } else if (field === 'mainPassingPercentage') {
      updatedCriteria[index].mainPassingPercentage = value;
    } else if (field === 'subPassingPercentage') {
      updatedCriteria[index].subPassingPercentage = value;
    }
    setGradeCriteria(updatedCriteria);
    saveGradeCriteria(updatedCriteria);
  };

  const updateGradeRange = (criteriaIndex: number, rangeIndex: number, field: string, value: number, rangeType: 'standard' | 'main' | 'sub' = 'standard') => {
    const updatedCriteria = [...gradeCriteria];
    
    if (rangeType === 'standard') {
      updatedCriteria[criteriaIndex].gradeRanges[rangeIndex][field as 'minPercentage' | 'maxPercentage'] = value;
    } else if (rangeType === 'main' && updatedCriteria[criteriaIndex].mainSubjectsRanges) {
      updatedCriteria[criteriaIndex].mainSubjectsRanges[rangeIndex][field as 'minPercentage' | 'maxPercentage'] = value;
    } else if (rangeType === 'sub' && updatedCriteria[criteriaIndex].subSubjectsRanges) {
      updatedCriteria[criteriaIndex].subSubjectsRanges[rangeIndex][field as 'minPercentage' | 'maxPercentage'] = value;
    }
    
    setGradeCriteria(updatedCriteria);
    saveGradeCriteria(updatedCriteria);
  };

  const addGradeRange = (criteriaIndex: number, rangeType: 'standard' | 'main' | 'sub' = 'standard') => {
    if (!newGradeRange.grade) {
      toast({
        title: "Missing Grade Label",
        description: "Please enter a grade label (e.g., A+, B, etc.)",
        variant: "destructive",
      });
      return;
    }

    const updatedCriteria = [...gradeCriteria];
    const newRange = { ...newGradeRange };

    if (rangeType === 'standard') {
      updatedCriteria[criteriaIndex].gradeRanges.push(newRange);
      // Sort by maxPercentage descending
      updatedCriteria[criteriaIndex].gradeRanges.sort((a, b) => b.maxPercentage - a.maxPercentage);
    } else if (rangeType === 'main' && updatedCriteria[criteriaIndex].mainSubjectsRanges) {
      updatedCriteria[criteriaIndex].mainSubjectsRanges.push(newRange);
      updatedCriteria[criteriaIndex].mainSubjectsRanges.sort((a, b) => b.maxPercentage - a.maxPercentage);
    } else if (rangeType === 'sub' && updatedCriteria[criteriaIndex].subSubjectsRanges) {
      updatedCriteria[criteriaIndex].subSubjectsRanges.push(newRange);
      updatedCriteria[criteriaIndex].subSubjectsRanges.sort((a, b) => b.maxPercentage - a.maxPercentage);
    }

    setGradeCriteria(updatedCriteria);
    setNewGradeRange({
      grade: '',
      minPercentage: 0,
      maxPercentage: 0
    });
    saveGradeCriteria(updatedCriteria);
    
    toast({
      title: "Grade Range Added",
      description: `New grade "${newRange.grade}" added successfully.`,
    });
  };

  const removeGradeRange = (criteriaIndex: number, rangeIndex: number, rangeType: 'standard' | 'main' | 'sub' = 'standard') => {
    const updatedCriteria = [...gradeCriteria];

    if (rangeType === 'standard') {
      // Don't allow removing if it's the last grade range
      if (updatedCriteria[criteriaIndex].gradeRanges.length <= 1) {
        toast({
          title: "Cannot Remove Last Grade",
          description: "There must be at least one grade range.",
          variant: "destructive",
        });
        return;
      }
      updatedCriteria[criteriaIndex].gradeRanges.splice(rangeIndex, 1);
    } else if (rangeType === 'main' && updatedCriteria[criteriaIndex].mainSubjectsRanges) {
      if (updatedCriteria[criteriaIndex].mainSubjectsRanges.length <= 1) {
        toast({
          title: "Cannot Remove Last Grade",
          description: "There must be at least one grade range for main subjects.",
          variant: "destructive",
        });
        return;
      }
      updatedCriteria[criteriaIndex].mainSubjectsRanges.splice(rangeIndex, 1);
    } else if (rangeType === 'sub' && updatedCriteria[criteriaIndex].subSubjectsRanges) {
      if (updatedCriteria[criteriaIndex].subSubjectsRanges.length <= 1) {
        toast({
          title: "Cannot Remove Last Grade",
          description: "There must be at least one grade range for sub subjects.",
          variant: "destructive",
        });
        return;
      }
      updatedCriteria[criteriaIndex].subSubjectsRanges.splice(rangeIndex, 1);
    }

    setGradeCriteria(updatedCriteria);
    saveGradeCriteria(updatedCriteria);
    
    toast({
      title: "Grade Range Removed",
      description: "Grade range has been removed successfully.",
    });
  };

  const saveGradeCriteria = (criteria: GradeCriteria[]) => {
    localStorage.setItem('gradeCriteria', JSON.stringify(criteria));
  };

  const getRoleBadgeClass = (role: string) => {
    switch(role) {
      case 'Admin': 
        return 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400';
      case 'Teacher': 
        return 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400';
      case 'Clerk': 
        return 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400';
      default: 
        return 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400';
    }
  };

  const isSuperUser = (email: string) => {
    return email.toLowerCase() === 'blachoumanan@adventistcollege.mu';
  };

  return (
    <div className="animate-fade-in">
      <div className="glass-card mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
          <div className="flex items-center gap-3">
            <UserCog size={24} className="text-theme-purple" />
            <h2 className="text-xl font-semibold">Administration</h2>
          </div>
          
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 rounded-full glass border-none focus:ring-2 ring-primary/30 outline-none w-full md:w-64"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/50" size={16} />
          </div>
        </div>
        
        <Tabs defaultValue="users" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="glass mb-6 w-full flex justify-start overflow-x-auto">
            <TabsTrigger value="users" className="px-4 py-2">
              <UserCog size={16} className="mr-2" />
              Users & Permissions
            </TabsTrigger>
            <TabsTrigger value="students" className="px-4 py-2">
              <UserPlus size={16} className="mr-2" />
              Students
            </TabsTrigger>
            <TabsTrigger value="teachers" className="px-4 py-2">
              <GraduationCap size={16} className="mr-2" />
              Teachers
            </TabsTrigger>
            <TabsTrigger value="grades" className="px-4 py-2">
              <BookOpenCheck size={16} className="mr-2" />
              Grade Criteria
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="users">
            <div className="glass rounded-xl p-4 mb-6">
              <h3 className="text-sm font-medium mb-3">Assign New User</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
                <div>
                  <label className="text-xs text-foreground/70 mb-1 block">Email Address</label>
                  <input
                    type="email"
                    placeholder="Email"
                    value={newUserEmail}
                    onChange={(e) => setNewUserEmail(e.target.value)}
                    className="w-full rounded-lg glass border-none px-4 py-2"
                  />
                  <p className="text-xs text-foreground/50 mt-1">
                    Domain @adventistcollege.mu will be added if not specified
                  </p>
                </div>
                
                <div>
                  <label className="text-xs text-foreground/70 mb-1 block">Name (Optional)</label>
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={newUserName}
                    onChange={(e) => setNewUserName(e.target.value)}
                    className="w-full rounded-lg glass border-none px-4 py-2"
                  />
                </div>
                
                <div>
                  <label className="text-xs text-foreground/70 mb-1 block">Department (Optional)</label>
                  <input
                    type="text"
                    placeholder="Department"
                    value={newUserDepartment}
                    onChange={(e) => setNewUserDepartment(e.target.value)}
                    className="w-full rounded-lg glass border-none px-4 py-2"
                  />
                </div>
                
                <div>
                  <label className="text-xs text-foreground/70 mb-1 block">Role</label>
                  <select 
                    value={newUserRole} 
                    onChange={(e) => setNewUserRole(e.target.value as 'Teacher' | 'Admin' | 'Clerk')}
                    className="w-full rounded-lg glass border-none px-4 py-2"
                  >
                    <option value="Teacher">Teacher</option>
                    {currentUser?.isSuperUser && <option value="Admin">Admin</option>}
                    <option value="Clerk">Clerk</option>
                  </select>
                  {newUserRole === 'Admin' && !currentUser?.isSuperUser && (
                    <p className="text-xs text-red-500 mt-1 flex items-center">
                      <AlertCircle size={12} className="mr-1" />
                      Only superuser can assign admin role
                    </p>
                  )}
                </div>
              </div>
              
              <div className="flex justify-end">
                <button
                  onClick={handleAddUser}
                  className="btn-primary flex items-center gap-2"
                >
                  <PlusCircle size={18} />
                  <span>Add User</span>
                </button>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="text-left">
                  <tr className="border-b border-white/10">
                    <th className="pb-2 font-medium text-foreground/70 text-sm">Name</th>
                    <th className="pb-2 font-medium text-foreground/70 text-sm">Email</th>
                    <th className="pb-2 font-medium text-foreground/70 text-sm">Role</th>
                    <th className="pb-2 font-medium text-foreground/70 text-sm">Department</th>
                    <th className="pb-2 font-medium text-foreground/70 text-sm">Added On</th>
                    <th className="pb-2 font-medium text-foreground/70 text-sm">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map(user => (
                    <tr key={user.id} className={`border-b border-white/5 hover:bg-white/5 dark:hover:bg-white/5 transition-colors ${
                      isSuperUser(user.email) ? 'bg-blue-50/10 dark:bg-blue-900/10' : ''
                    }`}>
                      <td className="py-3">
                        {user.name}
                        {isSuperUser(user.email) && (
                          <span className="ml-2 px-1.5 py-0.5 bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300 text-xs rounded-full">
                            Superuser
                          </span>
                        )}
                      </td>
                      <td className="py-3">{user.email}</td>
                      <td className="py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleBadgeClass(user.role)}`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="py-3">{user.department || '-'}</td>
                      <td className="py-3 text-foreground/70 text-sm">{user.addedOn}</td>
                      <td className="py-3">
                        <div className="flex gap-2">
                          <button className="p-1 rounded hover:bg-white/10 transition-colors">
                            <Edit size={16} className="text-foreground/70" />
                          </button>
                          <button 
                            className="p-1 rounded hover:bg-white/10 transition-colors"
                            onClick={() => handleDeleteUser(user.id)}
                            disabled={isSuperUser(user.email) || (user.role === 'Admin' && !currentUser?.isSuperUser)}
                          >
                            <Trash size={16} className={
                              (isSuperUser(user.email) || (user.role === 'Admin' && !currentUser?.isSuperUser)) 
                                ? "text-foreground/30" 
                                : "text-foreground/70"
                            } />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>
          
          <TabsContent value="students">
            <div className="glass rounded-xl p-4 mb-6">
              <h3 className="text-sm font-medium mb-3">Add New Student</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                <div>
                  <label className="text-xs text-foreground/70 mb-1 block">Student Name*</label>
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={newStudent.name}
                    onChange={(e) => setNewStudent({...newStudent, name: e.target.value})}
                    className="w-full rounded-lg glass border-none px-4 py-2"
                  />
                </div>
                
                <div>
                  <label className="text-xs text-foreground/70 mb-1 block">Grade/Class*</label>
                  <select
                    value={newStudent.grade}
                    onChange={(e) => setNewStudent({...newStudent, grade: e.target.value})}
                    className="w-full rounded-lg glass border-none px-4 py-2"
                  >
                    <option value="">Select Grade</option>
                    <option value="Grade 7">Grade 7</option>
                    <option value="Grade 8">Grade 8</option>
                    <option value="Grade 9">Grade 9</option>
                    <option value="Grade 10">Grade 10</option>
                    <option value="Grade 11">Grade 11</option>
                    <option value="Grade 12">Grade 12</option>
                    <option value="Grade 13">Grade 13</option>
                  </select>
                </div>
                
                <div>
                  <label className="text-xs text-foreground/70 mb-1 block">Section</label>
                  <select
                    value={newStudent.section}
                    onChange={(e) => setNewStudent({...newStudent, section: e.target.value})}
                    className="w-full rounded-lg glass border-none px-4 py-2"
                  >
                    <option value="">Select Section</option>
                    <option value="A">Section A</option>
                    <option value="B">Section B</option>
                    <option value="C">Section C</option>
                    <option value="D">Section D</option>
                  </select>
                </div>
                
                <div>
                  <label className="text-xs text-foreground/70 mb-1 block">Roll Number*</label>
                  <input
                    type="text"
                    placeholder="Roll No/Student ID"
                    value={newStudent.rollNo}
                    onChange={(e) => setNewStudent({...newStudent, rollNo: e.target.value})}
                    className="w-full rounded-lg glass border-none px-4 py-2"
                  />
                </div>
                
                <div>
                  <label className="text-xs text-foreground/70 mb-1 block">Parent/Guardian Name</label>
                  <input
                    type="text"
                    placeholder="Parent's Name"
                    value={newStudent.parentName}
                    onChange={(e) => setNewStudent({...newStudent, parentName: e.target.value})}
                    className="w-full rounded-lg glass border-none px-4 py-2"
                  />
                </div>
                
                <div>
                  <label className="text-xs text-foreground/70 mb-1 block">Contact Number</label>
                  <input
                    type="text"
                    placeholder="Contact Number"
                    value={newStudent.contactNo}
                    onChange={(e) => setNewStudent({...newStudent, contactNo: e.target.value})}
                    className="w-full rounded-lg glass border-none px-4 py-2"
                  />
                </div>
              </div>
              
              <div className="flex justify-end">
                <button
                  onClick={handleAddStudent}
                  className="btn-primary flex items-center gap-2"
                >
                  <UserPlus size={18} />
                  <span>Add Student</span>
                </button>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="text-left">
                  <tr className="border-b border-white/10">
                    <th className="pb-2 font-medium text-foreground/70 text-sm">Roll No</th>
                    <th className="pb-2 font-medium text-foreground/70 text-sm">Name</th>
                    <th className="pb-2 font-medium text-foreground/70 text-sm">Grade</th>
                    <th className="pb-2 font-medium text-foreground/70 text-sm">Section</th>
                    <th className="pb-2 font-medium text-foreground/70 text-sm">Parent/Guardian</th>
                    <th className="pb-2 font-medium text-foreground/70 text-sm">Contact</th>
                    <th className="pb-2 font-medium text-foreground/70 text-sm">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map(student => (
                    <tr key={student.id} className="border-b border-white/5 hover:bg-white/5 dark:hover:bg-white/5 transition-colors">
                      <td className="py-3">{student.rollNo}</td>
                      <td className="py-3">{student.name}</td>
                      <td className="py-3">{student.grade}</td>
                      <td className="py-3">{student.section}</td>
                      <td className="py-3">{student.parentName || '-'}</td>
                      <td className="py-3">{student.contactNo || '-'}</td>
                      <td className="py-3">
                        <div className="flex gap-2">
                          <button className="p-1 rounded hover:bg-white/10 transition-colors">
                            <Edit size={16} className="text-foreground/70" />
                          </button>
                          <button 
                            className="p-1 rounded hover:bg-white/10 transition-colors"
                            onClick={() => handleDeleteStudent(student.id)}
                          >
                            <Trash size={16} className="text-foreground/70" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>
          
          <TabsContent value="teachers">
            <div className="glass rounded-xl p-4 mb-6">
              <h3 className="text-sm font-medium mb-3">Add New Teacher</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                <div>
                  <label className="text-xs text-foreground/70 mb-1 block">Teacher Name*</label>
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={newTeacher.name}
                    onChange={(e) => setNewTeacher({...newTeacher, name: e.target.value})}
                    className="w-full rounded-lg glass border-none px-4 py-2"
                  />
                </div>
                
                <div>
                  <label className="text-xs text-foreground/70 mb-1 block">Email Address*</label>
                  <input
                    type="email"
                    placeholder="Email"
                    value={newTeacher.email}
                    onChange={(e) => setNewTeacher({...newTeacher, email: e.target.value})}
                    className="w-full rounded-lg glass border-none px-4 py-2"
                  />
                  <p className="text-xs text-foreground/50 mt-1">
                    Domain @adventistcollege.mu will be added if not specified
                  </p>
                </div>
                
                <div>
                  <label className="text-xs text-foreground/70 mb-1 block">Department*</label>
                  <input
                    type="text"
                    placeholder="Department"
                    value={newTeacher.department}
                    onChange={(e) => setNewTeacher({...newTeacher, department: e.target.value})}
                    className="w-full rounded-lg glass border-none px-4 py-2"
                  />
                </div>
                
                <div>
                  <label className="text-xs text-foreground/70 mb-1 block">Qualification</label>
                  <input
                    type="text"
                    placeholder="Qualification"
                    value={newTeacher.qualification}
                    onChange={(e) => setNewTeacher({...newTeacher, qualification: e.target.value})}
                    className="w-full rounded-lg glass border-none px-4 py-2"
                  />
                </div>
                
                <div>
                  <label className="text-xs text-foreground/70 mb-1 block">Join Date</label>
                  <input
                    type="date"
                    value={newTeacher.joinDate}
                    onChange={(e) => setNewTeacher({...newTeacher, joinDate: e.target.value})}
                    className="w-full rounded-lg glass border-none px-4 py-2"
                  />
                </div>
                
                <div>
                  <label className="text-xs text-foreground/70 mb-1 block">Contact Number</label>
                  <input
                    type="text"
                    placeholder="Contact Number"
                    value={newTeacher.contactNo}
                    onChange={(e) => setNewTeacher({...newTeacher, contactNo: e.target.value})}
                    className="w-full rounded-lg glass border-none px-4 py-2"
                  />
                </div>
              </div>
              
              <div className="flex justify-end">
                <button
                  onClick={handleAddTeacher}
                  className="btn-primary flex items-center gap-2"
                >
                  <UserPlus size={18} />
                  <span>Add Teacher</span>
                </button>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="text-left">
                  <tr className="border-b border-white/10">
                    <th className="pb-2 font-medium text-foreground/70 text-sm">Name</th>
                    <th className="pb-2 font-medium text-foreground/70 text-sm">Email</th>
                    <th className="pb-2 font-medium text-foreground/70 text-sm">Department</th>
                    <th className="pb-2 font-medium text-foreground/70 text-sm">Qualification</th>
                    <th className="pb-2 font-medium text-foreground/70 text-sm">Join Date</th>
                    <th className="pb-2 font-medium text-foreground/70 text-sm">Contact</th>
                    <th className="pb-2 font-medium text-foreground/70 text-sm">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTeachers.map(teacher => (
                    <tr key={teacher.id} className="border-b border-white/5 hover:bg-white/5 dark:hover:bg-white/5 transition-colors">
                      <td className="py-3">{teacher.name}</td>
                      <td className="py-3">{teacher.email}</td>
                      <td className="py-3">{teacher.department}</td>
                      <td className="py-3">{teacher.qualification || '-'}</td>
                      <td className="py-3">{teacher.joinDate}</td>
                      <td className="py-3">{teacher.contactNo || '-'}</td>
                      <td className="py-3">
                        <div className="flex gap-2">
                          <button className="p-1 rounded hover:bg-white/10 transition-colors">
                            <Edit size={16} className="text-foreground/70" />
                          </button>
                          <button 
                            className="p-1 rounded hover:bg-white/10 transition-colors"
                            onClick={() => handleDeleteTeacher(teacher.id)}
                          >
                            <Trash size={16} className="text-foreground/70" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>
          
          <TabsContent value="grades">
            <div className="glass rounded-xl p-4 mb-6">
              <h3 className="text-sm font-medium mb-3">Grade Criteria Settings</h3>
              <p className="text-xs text-foreground/70 mb-4">
                Define passing percentage and grade ranges for different grade levels. Grades 12-13 have separate criteria for main and sub subjects.
              </p>
              
              {/* Use the GradeCriteriaTab component here */}
              <GradeCriteriaTab 
                onChange={handleGradeCriteriaChange}
                initialCriteria={gradeCriteriaByGrade}
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      <div className="glass-card">
        <div className="flex items-center gap-3 mb-6">
          <Shield size={24} className="text-theme-purple" />
          <h2 className="text-xl font-semibold">Role Permissions</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {['Admin', 'Teacher', 'Clerk'].map(role => (
            <div key={role} className="glass rounded-xl p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-medium">{role}</h3>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleBadgeClass(role)}`}>
                  {role}
                </span>
              </div>
              
              {[
                'View Dashboard',
                'Manage Users', 
                'Upload Data', 
                'Enter Marks', 
                'Generate Reports',
                'View Reports'
              ].map(permission => (
                <div key={permission} className="flex items-center justify-between py-2 border-b border-white/5 last:border-b-0">
                  <span className="text-sm">{permission}</span>
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                    // Different permissions for different roles
                    (role === 'Admin') || 
                    (role === 'Teacher' && ['View Dashboard', 'Enter Marks', 'View Reports'].includes(permission)) || 
                    (role === 'Clerk' && ['View Dashboard', 'Upload Data', 'View Reports'].includes(permission))
                      ? 'bg-green-100 dark:bg-green-900/30' 
                      : 'bg-gray-100 dark:bg-gray-800'
                  }`}>
                    {((role === 'Admin') || 
                      (role === 'Teacher' && ['View Dashboard', 'Enter Marks', 'View Reports'].includes(permission)) || 
                      (role === 'Clerk' && ['View Dashboard', 'Upload Data', 'View Reports'].includes(permission))) && 
                      <CheckCircle size={14} className="text-green-600 dark:text-green-400" />
                    }
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
