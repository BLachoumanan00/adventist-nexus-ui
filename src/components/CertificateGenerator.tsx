
import React, { useState, useRef } from 'react';
import { Award, Download, Upload, Settings, CheckCircle, Image, Edit2, X } from 'lucide-react';
import { useToast } from '../hooks/use-toast';
import { useActivityLogger } from '../hooks/useActivityLogger';

interface Certificate {
  type: 'achievement' | 'completion' | 'excellence' | 'participation';
  studentName: string;
  achievement: string;
  date: string;
  signedBy: string;
  customFields: Record<string, string>;
}

const CertificateGenerator: React.FC = () => {
  const [certificateType, setCertificateType] = useState<'achievement' | 'completion' | 'excellence' | 'participation'>('achievement');
  const [studentName, setStudentName] = useState('');
  const [achievement, setAchievement] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [signedBy, setSignedBy] = useState('Billy Lachoumanan');
  const [customFields, setCustomFields] = useState<{key: string, value: string}[]>([]);
  const [schoolLogo, setSchoolLogo] = useState<string | null>(null);
  const [signature, setSignature] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  
  const logoInputRef = useRef<HTMLInputElement>(null);
  const signatureInputRef = useRef<HTMLInputElement>(null);
  
  const { toast } = useToast();
  const { logActivity } = useActivityLogger();

  const handleSchoolLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setSchoolLogo(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSignatureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setSignature(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const addCustomField = () => {
    setCustomFields([...customFields, { key: '', value: '' }]);
  };

  const updateCustomField = (index: number, field: 'key' | 'value', value: string) => {
    const updatedFields = [...customFields];
    updatedFields[index][field] = value;
    setCustomFields(updatedFields);
  };

  const removeCustomField = (index: number) => {
    const updatedFields = [...customFields];
    updatedFields.splice(index, 1);
    setCustomFields(updatedFields);
  };

  const generateCertificate = () => {
    if (!studentName || !achievement) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }
    
    // In a real implementation, this would generate a PDF or image
    toast({
      title: "Certificate Generated",
      description: `Certificate for ${studentName} has been generated.`
    });
    
    logActivity("Generated Certificate", `${certificateType} certificate for ${studentName}`);
    
    // Show preview
    setShowPreview(true);
  };

  const certificateTemplates = {
    achievement: "has achieved outstanding results in",
    completion: "has successfully completed",
    excellence: "has demonstrated excellence in",
    participation: "has participated in"
  };

  return (
    <div className="glass-card mb-6">
      <div className="flex items-center gap-3 mb-6">
        <Award size={24} className="text-theme-purple" />
        <h2 className="text-xl font-semibold">Certificate Generator</h2>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass rounded-xl p-4">
          <h3 className="font-medium mb-4">Certificate Settings</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm text-foreground/70 mb-1">Certificate Type</label>
              <select
                value={certificateType}
                onChange={(e) => setCertificateType(e.target.value as any)}
                className="w-full glass px-4 py-2 rounded-lg border-none"
              >
                <option value="achievement">Achievement</option>
                <option value="completion">Completion</option>
                <option value="excellence">Excellence</option>
                <option value="participation">Participation</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm text-foreground/70 mb-1">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full glass px-4 py-2 rounded-lg border-none"
              />
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm text-foreground/70 mb-1">Student Name</label>
            <input
              type="text"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              placeholder="Enter student name"
              className="w-full glass px-4 py-2 rounded-lg border-none"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm text-foreground/70 mb-1">Achievement/Course</label>
            <input
              type="text"
              value={achievement}
              onChange={(e) => setAchievement(e.target.value)}
              placeholder="e.g. Mathematics Competition, Computer Science Course"
              className="w-full glass px-4 py-2 rounded-lg border-none"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm text-foreground/70 mb-1">Signed By</label>
            <input
              type="text"
              value={signedBy}
              onChange={(e) => setSignedBy(e.target.value)}
              placeholder="Name of signatory"
              className="w-full glass px-4 py-2 rounded-lg border-none"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm text-foreground/70 mb-1">School Logo</label>
              <div className="flex items-center gap-2">
                <input
                  type="file"
                  ref={logoInputRef}
                  accept="image/*"
                  onChange={handleSchoolLogoUpload}
                  style={{ display: 'none' }}
                />
                <button
                  onClick={() => logoInputRef.current?.click()}
                  className="glass px-4 py-2 rounded-lg flex items-center gap-2"
                >
                  <Upload size={16} />
                  <span>Upload Logo</span>
                </button>
                {schoolLogo && (
                  <button
                    onClick={() => setSchoolLogo(null)}
                    className="p-2 rounded-lg text-red-500 hover:bg-red-500/10"
                    title="Remove Logo"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
              {schoolLogo && (
                <div className="mt-2 p-2 bg-white/10 rounded-lg">
                  <img src={schoolLogo} alt="School Logo" className="h-12 object-contain" />
                </div>
              )}
            </div>
            
            <div>
              <label className="block text-sm text-foreground/70 mb-1">Signature</label>
              <div className="flex items-center gap-2">
                <input
                  type="file"
                  ref={signatureInputRef}
                  accept="image/*"
                  onChange={handleSignatureUpload}
                  style={{ display: 'none' }}
                />
                <button
                  onClick={() => signatureInputRef.current?.click()}
                  className="glass px-4 py-2 rounded-lg flex items-center gap-2"
                >
                  <Upload size={16} />
                  <span>Upload Signature</span>
                </button>
                {signature && (
                  <button
                    onClick={() => setSignature(null)}
                    className="p-2 rounded-lg text-red-500 hover:bg-red-500/10"
                    title="Remove Signature"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
              {signature && (
                <div className="mt-2 p-2 bg-white/10 rounded-lg">
                  <img src={signature} alt="Signature" className="h-12 object-contain" />
                </div>
              )}
            </div>
          </div>
          
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm text-foreground/70">Custom Fields</label>
              <button
                onClick={addCustomField}
                className="text-primary text-sm flex items-center gap-1"
              >
                <Edit2 size={14} />
                <span>Add Field</span>
              </button>
            </div>
            
            {customFields.map((field, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={field.key}
                  onChange={(e) => updateCustomField(index, 'key', e.target.value)}
                  placeholder="Field name"
                  className="flex-1 glass px-3 py-1.5 rounded-lg border-none"
                />
                <input
                  type="text"
                  value={field.value}
                  onChange={(e) => updateCustomField(index, 'value', e.target.value)}
                  placeholder="Field value"
                  className="flex-1 glass px-3 py-1.5 rounded-lg border-none"
                />
                <button
                  onClick={() => removeCustomField(index)}
                  className="p-1.5 rounded-lg text-red-500 hover:bg-red-500/10"
                  title="Remove Field"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
          
          <div className="flex justify-end">
            <button
              onClick={generateCertificate}
              className="btn-primary flex items-center gap-2"
            >
              <CheckCircle size={18} />
              <span>Generate Certificate</span>
            </button>
          </div>
        </div>
        
        <div className="glass rounded-xl p-4">
          <h3 className="font-medium mb-4">Certificate Preview</h3>
          
          {showPreview ? (
            <div className="bg-white text-black p-6 rounded-lg shadow-lg">
              <div className="flex justify-between items-center mb-6">
                {schoolLogo && (
                  <div>
                    <img src={schoolLogo} alt="School Logo" className="h-16 object-contain" />
                  </div>
                )}
                <div className="text-right text-gray-600 text-sm">
                  <div>Adventist College</div>
                  <div>Certificate of {certificateType.charAt(0).toUpperCase() + certificateType.slice(1)}</div>
                </div>
              </div>
              
              <div className="text-center mb-6">
                <h1 className="text-xl font-serif mb-2">Certificate of {certificateType.charAt(0).toUpperCase() + certificateType.slice(1)}</h1>
                <div className="text-gray-600">This certifies that</div>
                <div className="text-xl my-3 font-bold text-blue-800">{studentName}</div>
                <div className="text-gray-600 my-3">
                  {certificateTemplates[certificateType]} <span className="font-semibold">{achievement}</span>
                </div>
                
                {customFields.map((field, index) => (
                  <div key={index} className="text-sm my-1">
                    <span className="font-semibold">{field.key}:</span> {field.value}
                  </div>
                ))}
                
                <div className="text-gray-600 mt-3">Awarded on {new Date(date).toLocaleDateString()}</div>
              </div>
              
              <div className="flex justify-center mt-8">
                <div className="flex flex-col items-center">
                  {signature ? (
                    <img src={signature} alt="Signature" className="h-12 mb-1" />
                  ) : (
                    <div className="border-b border-black w-36"></div>
                  )}
                  <div className="text-gray-800">{signedBy}</div>
                  <div className="text-gray-600 text-sm">School Rector</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-96 flex flex-col items-center justify-center text-foreground/60">
              <Award size={64} className="mb-4 text-foreground/30" />
              <p>Complete the details and generate a certificate to see a preview</p>
            </div>
          )}
          
          {showPreview && (
            <div className="mt-4">
              <button
                className="w-full glass px-4 py-2 rounded-lg flex items-center justify-center gap-2 text-primary"
              >
                <Download size={18} />
                <span>Download as PDF</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CertificateGenerator;
