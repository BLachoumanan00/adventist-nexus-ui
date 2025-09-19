import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  MessageSquare, 
  Phone, 
  Mail, 
  Send, 
  Users, 
  AlertCircle,
  CheckCircle,
  Clock,
  Zap
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useStudents } from '@/hooks/useStudents';
import { supabase } from '@/integrations/supabase/client';

interface CommunicationRecord {
  id: string;
  student_id: string;
  student_name: string;
  recipient_name: string;
  recipient_phone?: string;
  recipient_email?: string;
  message_type: 'attendance' | 'behavior' | 'academic' | 'general';
  subject: string;
  message: string;
  method: 'sms' | 'email' | 'call';
  status: 'pending' | 'sent' | 'delivered' | 'failed';
  sent_at?: string;
  created_at: string;
}

const MobileParentContact: React.FC = () => {
  const { toast } = useToast();
  const { students } = useStudents();
  
  const [selectedStudent, setSelectedStudent] = useState<string>('');
  const [messageType, setMessageType] = useState<'attendance' | 'behavior' | 'academic' | 'general'>('attendance');
  const [contactMethod, setContactMethod] = useState<'sms' | 'email' | 'call'>('sms');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [communications, setCommunications] = useState<CommunicationRecord[]>([]);
  
  const messageTemplates = {
    attendance: {
      absent: "Your child {studentName} was absent today ({date}). Please ensure they attend school regularly. Contact us if there are any concerns.",
      late: "Your child {studentName} arrived late to school today ({date}). Please help them arrive on time.",
      multiple_absences: "Your child {studentName} has been absent multiple times recently. Please contact the school to discuss."
    },
    behavior: {
      positive: "Great news! {studentName} showed excellent behavior today. We're proud of their positive attitude.",
      concern: "We need to discuss {studentName}'s behavior. Please contact the school at your earliest convenience.",
      improvement: "{studentName} has shown improvement in behavior. Thank you for your support at home."
    },
    academic: {
      achievement: "Congratulations! {studentName} has shown excellent academic progress in their studies.",
      concern: "{studentName}'s academic performance needs attention. Let's work together to support their learning.",
      missing_work: "{studentName} has missing assignments. Please help ensure homework is completed on time."
    },
    general: {
      reminder: "Reminder: {eventName} is scheduled for {date}. Please ensure {studentName} is prepared.",
      meeting: "We would like to schedule a parent meeting to discuss {studentName}'s progress.",
      information: "Important school information: Please check your email or contact the school office for more details."
    }
  };

  useEffect(() => {
    loadCommunications();
  }, []);

  const loadCommunications = async () => {
    try {
      const { data, error } = await supabase
        .from('communications')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setCommunications((data || []).map(item => ({
        ...item,
        student_name: item.student_name || 'Unknown Student'
      })));
    } catch (error) {
      console.error('Error loading communications:', error);
    }
  };

  const getSelectedStudent = () => {
    return students.find(s => s.id === selectedStudent);
  };

  const generateMessage = (templateKey: string, subTemplateKey: string) => {
    const student = getSelectedStudent();
    if (!student) return '';

    const template = messageTemplates[templateKey as keyof typeof messageTemplates]?.[subTemplateKey as keyof any];
    if (!template) return '';

    return template
      .replace('{studentName}', student.full_name)
      .replace('{date}', new Date().toLocaleDateString())
      .replace('{eventName}', 'School Event')
      .replace('{parentName}', student.parent_name || 'Parent');
  };

  const handleQuickTemplate = (templateKey: string, subTemplateKey: string) => {
    const student = getSelectedStudent();
    if (!student) {
      toast({
        variant: "destructive",
        title: "No Student Selected",
        description: "Please select a student first.",
      });
      return;
    }

    const generatedMessage = generateMessage(templateKey, subTemplateKey);
    setMessage(generatedMessage);
    setSubject(subTemplateKey.replace('_', ' ').toUpperCase());
    setMessageType(templateKey as any);
  };

  const sendMessage = async () => {
    const student = getSelectedStudent();
    if (!student || !message.trim()) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please select a student and enter a message.",
      });
      return;
    }

    // Validate contact method availability
    if (contactMethod === 'sms' && !student.parent_phone) {
      toast({
        variant: "destructive",
        title: "No Phone Number",
        description: "Parent phone number is not available for SMS.",
      });
      return;
    }

    if (contactMethod === 'email' && !student.parent_email) {
      toast({
        variant: "destructive",
        title: "No Email Address",
        description: "Parent email address is not available.",
      });
      return;
    }

    setIsSending(true);

    try {
      // In a real implementation, this would integrate with SMS/Email service
      const communicationRecord: Omit<CommunicationRecord, 'id' | 'created_at'> = {
        student_id: student.id,
        student_name: student.full_name,
        recipient_name: student.parent_name || 'Unknown',
        recipient_phone: student.parent_phone,
        recipient_email: student.parent_email,
        message_type: messageType,
        subject: subject || messageType.toUpperCase(),
        message,
        method: contactMethod,
        status: 'pending',
      };

      const { data, error } = await supabase
        .from('communications')
        .insert([communicationRecord])
        .select()
        .single();

      if (error) throw error;

      // Simulate sending (in production, integrate with actual SMS/Email service)
      setTimeout(async () => {
        const success = Math.random() > 0.1; // 90% success rate
        
        const { error: updateError } = await supabase
          .from('communications')
          .update({
            status: success ? 'sent' : 'failed',
            sent_at: success ? new Date().toISOString() : undefined
          })
          .eq('id', data.id);

        if (!updateError) {
          loadCommunications();
          
          if (success) {
            toast({
              title: "Message Sent Successfully",
              description: `${contactMethod.toUpperCase()} sent to ${student.parent_name || 'parent'}.`,
            });
            // Reset form
            setMessage('');
            setSubject('');
            setSelectedStudent('');
          } else {
            toast({
              variant: "destructive",
              title: "Failed to Send",
              description: "There was an error sending the message. Please try again.",
            });
          }
        }
      }, 2000);

      setIsSending(false);

    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to send message. Please try again.",
      });
      setIsSending(false);
    }
  };

  const getStatusIcon = (status: CommunicationRecord['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'sent':
      case 'delivered':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getMethodIcon = (method: CommunicationRecord['method']) => {
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
    <div className="space-y-6 max-w-4xl mx-auto p-4">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold flex items-center justify-center gap-2">
          <MessageSquare className="h-6 w-6" />
          Parent Communication
        </h1>
        <p className="text-muted-foreground">
          Send messages to parents about their child's attendance, behavior, or academic progress
        </p>
      </div>

      {/* Quick Start Alert for Non-Tech Users */}
      <Alert className="border-blue-200 bg-blue-50 dark:bg-blue-950">
        <Zap className="h-4 w-4" />
        <AlertDescription>
          <strong>Quick Start:</strong> Select a student, choose a message template, and tap Send. 
          It's that simple! Templates are pre-written for common situations.
        </AlertDescription>
      </Alert>

      {/* Send Message Card */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Send className="h-5 w-5" />
            Send Message to Parent
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Student Selection */}
          <div className="space-y-3">
            <Label className="text-base font-medium">Select Student</Label>
            <Select value={selectedStudent} onValueChange={setSelectedStudent}>
              <SelectTrigger className="mobile-select">
                <SelectValue placeholder="Choose a student..." />
              </SelectTrigger>
              <SelectContent>
                {students.map(student => (
                  <SelectItem key={student.id} value={student.id}>
                    <div className="flex flex-col">
                      <span className="font-medium">{student.full_name}</span>
                      <span className="text-sm text-muted-foreground">
                        {student.grade} • ID: {student.student_id}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Parent Info Display */}
          {selectedStudent && getSelectedStudent() && (
            <div className="bg-muted/30 p-4 rounded-lg space-y-2">
              <h4 className="font-medium flex items-center gap-2">
                <Users className="h-4 w-4" />
                Parent Information
              </h4>
              <div className="text-sm space-y-1">
                <div><strong>Name:</strong> {getSelectedStudent()?.parent_name || 'Not provided'}</div>
                {getSelectedStudent()?.parent_phone && (
                  <div><strong>Phone:</strong> {getSelectedStudent()?.parent_phone}</div>
                )}
                {getSelectedStudent()?.parent_email && (
                  <div><strong>Email:</strong> {getSelectedStudent()?.parent_email}</div>
                )}
              </div>
            </div>
          )}

          {/* Message Type and Method */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-3">
              <Label className="text-base font-medium">Message Type</Label>
              <Select value={messageType} onValueChange={(value: any) => setMessageType(value)}>
                <SelectTrigger className="mobile-select">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="attendance">📚 Attendance</SelectItem>
                  <SelectItem value="behavior">😊 Behavior</SelectItem>
                  <SelectItem value="academic">📖 Academic</SelectItem>
                  <SelectItem value="general">📝 General</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label className="text-base font-medium">Contact Method</Label>
              <Select value={contactMethod} onValueChange={(value: any) => setContactMethod(value)}>
                <SelectTrigger className="mobile-select">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sms">📱 SMS Text</SelectItem>
                  <SelectItem value="email">📧 Email</SelectItem>
                  <SelectItem value="call">☎️ Phone Call</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Quick Templates */}
          <div className="space-y-3">
            <Label className="text-base font-medium">Quick Message Templates</Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {Object.entries(messageTemplates[messageType]).map(([key, template]) => (
                <Button
                  key={key}
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickTemplate(messageType, key)}
                  className="h-auto p-3 text-left justify-start whitespace-normal touch-button"
                >
                  <div>
                    <div className="font-medium text-xs uppercase tracking-wide">
                      {key.replace('_', ' ')}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1 line-clamp-2">
                      {template.substring(0, 60)}...
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          </div>

          {/* Subject */}
          <div className="space-y-3">
            <Label className="text-base font-medium">Subject</Label>
            <Input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Brief subject line..."
              className="mobile-input"
            />
          </div>

          {/* Message */}
          <div className="space-y-3">
            <Label className="text-base font-medium">Message</Label>
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message here..."
              className="mobile-textarea"
              rows={4}
            />
            <div className="text-xs text-muted-foreground">
              Characters: {message.length}/160 
              {contactMethod === 'sms' && message.length > 160 && (
                <span className="text-warning"> (Multiple SMS charges may apply)</span>
              )}
            </div>
          </div>

          {/* Send Button */}
          <div className="pt-4">
            <Button 
              onClick={sendMessage} 
              disabled={isSending || !selectedStudent || !message.trim()}
              className="w-full h-12 text-base font-medium touch-button"
              size="lg"
            >
              {isSending ? (
                <>
                  <Clock className="mr-2 h-5 w-5 animate-spin" />
                  Sending {contactMethod.toUpperCase()}...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-5 w-5" />
                  Send {contactMethod.toUpperCase()}
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Messages */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Recent Messages</CardTitle>
        </CardHeader>
        <CardContent>
          {communications.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <MessageSquare className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p className="text-base">No messages sent yet</p>
              <p className="text-sm">Your sent messages will appear here</p>
            </div>
          ) : (
            <div className="space-y-4">
              {communications.slice(0, 10).map(comm => (
                <div key={comm.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-medium">{comm.student_name}</div>
                      <div className="text-sm text-muted-foreground">
                        To: {comm.recipient_name}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getMethodIcon(comm.method)}
                      {getStatusIcon(comm.status)}
                      <Badge 
                        className={
                          comm.status === 'sent' || comm.status === 'delivered' 
                            ? 'status-active' 
                            : comm.status === 'pending' 
                            ? 'status-warning' 
                            : 'status-error'
                        }
                      >
                        {comm.status}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Badge variant="outline" className="text-xs">
                      {comm.message_type}
                    </Badge>
                    <div className="text-sm font-medium">{comm.subject}</div>
                    <div className="text-sm bg-muted/30 p-3 rounded border-l-4 border-primary/20">
                      {comm.message}
                    </div>
                  </div>
                  
                  <div className="text-xs text-muted-foreground">
                    {comm.sent_at 
                      ? `Sent ${new Date(comm.sent_at).toLocaleString()}`
                      : `Created ${new Date(comm.created_at).toLocaleString()}`
                    }
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

export default MobileParentContact;