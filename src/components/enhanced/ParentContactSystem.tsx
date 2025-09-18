import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { MessageSquare, Phone, Mail, Send, Clock, Check, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useStudents } from '@/hooks/useStudents';

interface ContactMessage {
  id: string;
  studentId: string;
  studentName: string;
  parentName: string;
  parentPhone?: string;
  parentEmail?: string;
  messageType: 'attendance' | 'behavior' | 'academic' | 'general';
  reason: string;
  message: string;
  method: 'sms' | 'email' | 'call';
  status: 'pending' | 'sent' | 'delivered' | 'failed';
  sentAt?: string;
  createdBy: string;
  createdAt: string;
}

const ParentContactSystem: React.FC = () => {
  const { toast } = useToast();
  const { students } = useStudents();
  
  const [selectedStudent, setSelectedStudent] = useState<string>('');
  const [messageType, setMessageType] = useState<ContactMessage['messageType']>('attendance');
  const [contactMethod, setContactMethod] = useState<ContactMessage['method']>('sms');
  const [reason, setReason] = useState('');
  const [customMessage, setCustomMessage] = useState('');
  const [contacts, setContacts] = useState<ContactMessage[]>([]);
  const [isSending, setIsSending] = useState(false);

  const messageTemplates = {
    attendance: {
      absent: "Your child {studentName} was marked absent today ({date}). Please contact the school if this is excused.",
      late: "Your child {studentName} was late to school today ({date}). Please ensure punctual arrival.",
      multiple_absences: "Your child {studentName} has been absent for {count} days. Please contact us to discuss."
    },
    behavior: {
      misconduct: "We need to discuss {studentName}'s behavior today. Please contact the school at your earliest convenience.",
      achievement: "Great news! {studentName} showed excellent behavior today. We're proud of their progress.",
      improvement_needed: "{studentName} needs to work on their behavior. Let's work together to support them."
    },
    academic: {
      poor_performance: "{studentName}'s recent academic performance needs attention. Please schedule a meeting to discuss.",
      excellent_work: "Congratulations! {studentName} has shown excellent academic progress this week.",
      missing_assignment: "{studentName} has missing assignments in {subject}. Please help them catch up."
    },
    general: {
      event_reminder: "Reminder: {eventName} is scheduled for {date}. Please ensure {studentName} is prepared.",
      fee_reminder: "School fees for {studentName} are due by {dueDate}. Please make payment to avoid late fees.",
      meeting_request: "We would like to schedule a meeting to discuss {studentName}'s progress. Please contact us."
    }
  };

  const getSelectedStudent = () => {
    return students.find(s => s.id === selectedStudent);
  };

  const generateMessage = (template: string, student: any, additionalData?: any) => {
    let message = template
      .replace('{studentName}', student?.full_name || 'your child')
      .replace('{date}', new Date().toLocaleDateString())
      .replace('{parentName}', student?.parent_name || 'Parent');

    if (additionalData) {
      Object.keys(additionalData).forEach(key => {
        message = message.replace(`{${key}}`, additionalData[key]);
      });
    }

    return message;
  };

  const handleQuickMessage = (templateKey: string, subTemplateKey: string) => {
    const student = getSelectedStudent();
    if (!student) {
      toast({
        variant: "destructive",
        title: "No student selected",
        description: "Please select a student first.",
      });
      return;
    }

    const template = messageTemplates[templateKey as keyof typeof messageTemplates]?.[subTemplateKey as keyof any];
    if (template) {
      const message = generateMessage(template, student);
      setCustomMessage(message);
      setReason(subTemplateKey.replace('_', ' ').toUpperCase());
    }
  };

  const sendMessage = async () => {
    const student = getSelectedStudent();
    if (!student || !customMessage.trim()) {
      toast({
        variant: "destructive",
        title: "Missing information",
        description: "Please select a student and enter a message.",
      });
      return;
    }

    if (contactMethod === 'sms' && !student.parent_phone) {
      toast({
        variant: "destructive",
        title: "No phone number",
        description: "Parent phone number is not available for SMS.",
      });
      return;
    }

    if (contactMethod === 'email' && !student.parent_email) {
      toast({
        variant: "destructive",
        title: "No email address",
        description: "Parent email address is not available.",
      });
      return;
    }

    setIsSending(true);

    try {
      // Simulate sending message (in real app, this would integrate with SMS/Email service)
      const newContact: ContactMessage = {
        id: Date.now().toString(),
        studentId: student.id,
        studentName: student.full_name,
        parentName: student.parent_name || 'Unknown',
        parentPhone: student.parent_phone,
        parentEmail: student.parent_email,
        messageType,
        reason,
        message: customMessage,
        method: contactMethod,
        status: 'pending',
        createdBy: 'Current User', // In real app, get from auth context
        createdAt: new Date().toISOString()
      };

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Simulate success/failure
      const success = Math.random() > 0.1; // 90% success rate
      newContact.status = success ? 'sent' : 'failed';
      newContact.sentAt = success ? new Date().toISOString() : undefined;

      setContacts([newContact, ...contacts]);

      if (success) {
        toast({
          title: "Message sent",
          description: `${contactMethod.toUpperCase()} sent to ${student.parent_name || 'parent'} successfully.`,
        });
      } else {
        toast({
          variant: "destructive",
          title: "Failed to send",
          description: "There was an error sending the message. Please try again.",
        });
      }

      // Reset form on success
      if (success) {
        setCustomMessage('');
        setReason('');
        setSelectedStudent('');
      }

    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to send message. Please try again.",
      });
    } finally {
      setIsSending(false);
    }
  };

  const getStatusIcon = (status: ContactMessage['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'sent':
      case 'delivered':
        return <Check className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getMethodIcon = (method: ContactMessage['method']) => {
    switch (method) {
      case 'sms':
        return <MessageSquare className="h-4 w-4" />;
      case 'email':
        return <Mail className="h-4 w-4" />;
      case 'call':
        return <Phone className="h-4 w-4" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Send Message Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Contact Parents
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Select Student *</Label>
              <Select value={selectedStudent} onValueChange={setSelectedStudent}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose student" />
                </SelectTrigger>
                <SelectContent>
                  {students.map(student => (
                    <SelectItem key={student.id} value={student.id}>
                      {student.full_name} ({student.student_id})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Message Type</Label>
              <Select value={messageType} onValueChange={(value: ContactMessage['messageType']) => setMessageType(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="attendance">Attendance</SelectItem>
                  <SelectItem value="behavior">Behavior</SelectItem>
                  <SelectItem value="academic">Academic</SelectItem>
                  <SelectItem value="general">General</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Contact Method</Label>
              <Select value={contactMethod} onValueChange={(value: ContactMessage['method']) => setContactMethod(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sms">SMS</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="call">Phone Call</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {selectedStudent && getSelectedStudent() && (
            <div className="bg-muted/20 p-3 rounded-lg">
              <div className="text-sm">
                <div><strong>Parent:</strong> {getSelectedStudent()?.parent_name || 'Not specified'}</div>
                {getSelectedStudent()?.parent_phone && (
                  <div><strong>Phone:</strong> {getSelectedStudent()?.parent_phone}</div>
                )}
                {getSelectedStudent()?.parent_email && (
                  <div><strong>Email:</strong> {getSelectedStudent()?.parent_email}</div>
                )}
              </div>
            </div>
          )}

          {/* Quick Message Templates */}
          <div className="space-y-3">
            <Label>Quick Templates</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {Object.entries(messageTemplates[messageType]).map(([key, template]) => (
                <Button
                  key={key}
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickMessage(messageType, key)}
                  className="text-xs h-auto p-2 whitespace-normal"
                >
                  {key.replace('_', ' ')}
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Reason</Label>
            <Input
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Brief reason for contact"
            />
          </div>

          <div className="space-y-2">
            <Label>Message *</Label>
            <Textarea
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              placeholder="Type your message here..."
              rows={4}
            />
            <div className="text-xs text-muted-foreground">
              Characters: {customMessage.length}/160 {contactMethod === 'sms' && customMessage.length > 160 && '(Multiple SMS)'}
            </div>
          </div>

          <div className="flex justify-end">
            <Button 
              onClick={sendMessage} 
              disabled={isSending || !selectedStudent || !customMessage.trim()}
              className="gap-2"
            >
              <Send className="h-4 w-4" />
              {isSending ? 'Sending...' : `Send ${contactMethod.toUpperCase()}`}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Contact History */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Contacts</CardTitle>
        </CardHeader>
        <CardContent>
          {contacts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No contacts sent yet
            </div>
          ) : (
            <div className="space-y-4">
              {contacts.map(contact => (
                <div key={contact.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="font-medium">{contact.studentName}</div>
                      <div className="text-sm text-muted-foreground">
                        To: {contact.parentName}
                        {contact.method === 'sms' && contact.parentPhone && ` (${contact.parentPhone})`}
                        {contact.method === 'email' && contact.parentEmail && ` (${contact.parentEmail})`}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getMethodIcon(contact.method)}
                      {getStatusIcon(contact.status)}
                      <Badge variant={contact.status === 'sent' || contact.status === 'delivered' ? 'default' : 
                                   contact.status === 'pending' ? 'secondary' : 'destructive'}>
                        {contact.status}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Badge variant="outline">{contact.messageType}</Badge>
                      {contact.reason && <span className="text-muted-foreground">• {contact.reason}</span>}
                    </div>
                    
                    <div className="text-sm bg-muted/20 p-2 rounded">
                      {contact.message}
                    </div>
                    
                    <div className="text-xs text-muted-foreground">
                      Sent {new Date(contact.createdAt).toLocaleString()} by {contact.createdBy}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ParentContactSystem;