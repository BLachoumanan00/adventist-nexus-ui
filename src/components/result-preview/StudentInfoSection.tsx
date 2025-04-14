
import React from "react";

interface StudentInfoProps {
  student: {
    name: string;
    id: string;
    grade: string;
    section: string;
  };
  daysAbsent: number;
}

const StudentInfoSection: React.FC<StudentInfoProps> = ({ student, daysAbsent }) => {
  return (
    <div className="grid grid-cols-2 gap-4 mb-6">
      <div>
        <p><span className="font-semibold">Student Name:</span> {student.name}</p>
        <p><span className="font-semibold">Student ID:</span> {student.id}</p>
      </div>
      <div>
        <p><span className="font-semibold">Grade:</span> {student.grade}</p>
        <p><span className="font-semibold">Section:</span> {student.section}</p>
        <p><span className="font-semibold">Days Absent:</span> {daysAbsent}</p>
      </div>
    </div>
  );
};

export default StudentInfoSection;
