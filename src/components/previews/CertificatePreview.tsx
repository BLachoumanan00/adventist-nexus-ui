
import React from "react";
import { X } from "lucide-react";

interface CertificatePreviewProps {
  student: {
    id: string;
    name: string;
    grade: string;
    section: string;
  };
  schoolLogo?: string | null;
  signature?: string | null;
  schoolName?: string;
  schoolAddress?: string;
  certificateType?: string;
  certificateTitle?: string;
  certificateDescription?: string;
  date?: string;
  onClose: () => void;
}

const CertificatePreview: React.FC<CertificatePreviewProps> = ({
  student,
  schoolLogo,
  signature,
  schoolName = "Adventist College",
  schoolAddress = "Royal Road, Rose Hill, Mauritius",
  certificateType = "Achievement Certificate",
  certificateTitle = "Certificate of Academic Excellence",
  certificateDescription = "has demonstrated outstanding academic achievement and commitment to excellence in all subjects",
  date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
  onClose
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm overflow-y-auto py-10">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full mx-4 my-auto relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-full bg-gray-200 dark:bg-gray-700"
        >
          <X size={20} />
        </button>
        
        {/* Print button */}
        <button 
          onClick={() => window.print()} 
          className="absolute top-4 right-16 px-4 py-1 bg-primary text-white rounded-md"
        >
          Print
        </button>
        
        <div className="p-8 print:p-0" id="printable-certificate">
          {/* Certificate Content */}
          <div className="border-8 border-double border-gray-300 dark:border-gray-600 p-8 text-center">
            {/* Header */}
            <div className="flex justify-center items-center mb-6">
              {schoolLogo && (
                <div className="w-20 h-20 mr-4">
                  <img src={schoolLogo} alt="School Logo" className="w-full h-full object-contain" />
                </div>
              )}
              <div>
                <h1 className="text-2xl font-bold">{schoolName}</h1>
                <p className="text-gray-600 dark:text-gray-400">{schoolAddress}</p>
              </div>
            </div>
            
            <div className="my-8">
              <p className="text-sm uppercase tracking-widest text-gray-600 dark:text-gray-400">{certificateType}</p>
              <h2 className="text-3xl font-bold mt-2 mb-8">{certificateTitle}</h2>
              
              <p className="text-lg mb-4">This is to certify that</p>
              <p className="text-2xl font-bold mb-4">{student.name}</p>
              <p className="text-lg mb-8">of Grade {student.grade}-{student.section} {certificateDescription}</p>
              
              <p className="text-lg">Issued on: {date}</p>
            </div>
            
            {/* Signature */}
            <div className="flex justify-center mt-16">
              <div className="text-center px-8">
                {signature && (
                  <div className="mb-2 h-20">
                    <img src={signature} alt="Principal Signature" className="h-full object-contain mx-auto" />
                  </div>
                )}
                <div className="border-t border-gray-400 dark:border-gray-500 pt-2 w-48">
                  <p>Principal</p>
                </div>
              </div>
              
              {/* School Seal - Placeholder */}
              <div className="mx-8 flex items-end">
                <div className="w-24 h-24 border-2 border-dashed border-gray-400 dark:border-gray-500 rounded-full flex items-center justify-center text-gray-400 dark:text-gray-500">
                  School Seal
                </div>
              </div>
              
              <div className="text-center px-8">
                <div className="h-20 mb-2">
                  {/* Class Teacher Signature Placeholder */}
                </div>
                <div className="border-t border-gray-400 dark:border-gray-500 pt-2 w-48">
                  <p>Class Teacher</p>
                </div>
              </div>
            </div>
            
            {/* Certificate ID */}
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-12">
              Certificate ID: CERT-{student.id}-{new Date().getFullYear()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CertificatePreview;
