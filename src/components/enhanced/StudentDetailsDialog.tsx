import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, Plus, Trash2, Edit, Save, X } from 'lucide-react';
import { Student } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';

interface DisciplinaryRecord {
  id: string;
  date: string;
  type: 'warning' | 'detention' | 'suspension' | 'other';
  description: string;
  action_taken: string;
  resolved: boolean;
}

interface ResponsibleParty {
  id: string;
  name: string;
  relationship: string;
  phone?: string;
  email?: string;
  is_primary: boolean;
}

interface StudentDetailsDialogProps {
  student: Student | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (student: Student) => void;
}

const StudentDetailsDialog: React.FC<StudentDetailsDialogProps> = ({
  student,
  isOpen,
  onClose,
  onSave
}) => {
  const { toast } = useToast();
  const [editMode, setEditMode] = useState(false);
  const [editedStudent, setEditedStudent] = useState<Student | null>(null);
  const [disciplinaryRecords, setDisciplinaryRecords] = useState<DisciplinaryRecord[]>([]);
  const [responsibleParties, setResponsibleParties] = useState<ResponsibleParty[]>([]);
  const [newRecord, setNewRecord] = useState<Partial<DisciplinaryRecord>>({});
  const [newParty, setNewParty] = useState<Partial<ResponsibleParty>>({});
  const [showAddRecord, setShowAddRecord] = useState(false);
  const [showAddParty, setShowAddParty] = useState(false);

  React.useEffect(() => {
    if (student) {
      setEditedStudent({ ...student });
      // Load disciplinary records and responsible parties
      // In a real app, these would come from the database
      setDisciplinaryRecords([
        {
          id: '1',
          date: '2024-01-15',
          type: 'warning',
          description: 'Late to class multiple times',
          action_taken: 'Verbal warning given, parent contacted',
          resolved: true
        }
      ]);
      setResponsibleParties([
        {
          id: '1',
          name: student.parent_name || 'Unknown',
          relationship: 'Parent',
          phone: student.parent_phone,
          email: student.parent_email,
          is_primary: true
        }
      ]);
    }
  }, [student]);

  const handleSave = () => {
    if (editedStudent) {
      onSave(editedStudent);
      setEditMode(false);
      toast({
        title: "Student updated",
        description: "Student information has been saved successfully.",
      });
    }
  };

  const addDisciplinaryRecord = () => {
    if (!newRecord.description || !newRecord.type) {
      toast({
        variant: "destructive",
        title: "Missing information",
        description: "Please fill in all required fields.",
      });
      return;
    }

    const record: DisciplinaryRecord = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      type: newRecord.type as DisciplinaryRecord['type'],
      description: newRecord.description,
      action_taken: newRecord.action_taken || '',
      resolved: false
    };

    setDisciplinaryRecords([...disciplinaryRecords, record]);
    setNewRecord({});
    setShowAddRecord(false);
  };

  const addResponsibleParty = () => {
    if (!newParty.name || !newParty.relationship) {
      toast({
        variant: "destructive",
        title: "Missing information",
        description: "Please fill in all required fields.",
      });
      return;
    }

    const party: ResponsibleParty = {
      id: Date.now().toString(),
      name: newParty.name,
      relationship: newParty.relationship,
      phone: newParty.phone,
      email: newParty.email,
      is_primary: responsibleParties.length === 0
    };

    setResponsibleParties([...responsibleParties, party]);
    setNewParty({});
    setShowAddParty(false);
  };

  const exportStudentReport = () => {
    // Generate PDF report (simplified implementation)
    const reportData = {
      student: editedStudent,
      disciplinaryRecords,
      responsibleParties,
      generatedAt: new Date().toISOString()
    };

    const dataStr = JSON.stringify(reportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${editedStudent?.full_name?.replace(/\s+/g, '_')}_report.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: "Report exported",
      description: "Student report has been downloaded successfully.",
    });
  };

  if (!student || !editedStudent) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Student Details - {student.full_name}</DialogTitle>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={exportStudentReport}
                className="gap-2"
              >
                <Download className="h-4 w-4" />
                Export PDF
              </Button>
              {editMode ? (
                <div className="flex gap-2">
                  <Button size="sm" onClick={handleSave} className="gap-2">
                    <Save className="h-4 w-4" />
                    Save
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditMode(false)}
                    className="gap-2"
                  >
                    <X className="h-4 w-4" />
                    Cancel
                  </Button>
                </div>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setEditMode(true)}
                  className="gap-2"
                >
                  <Edit className="h-4 w-4" />
                  Edit
                </Button>
              )}
            </div>
          </div>
        </DialogHeader>

        <Tabs defaultValue="basic" className="flex-1 overflow-hidden">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="contacts">Responsible Parties</TabsTrigger>
            <TabsTrigger value="disciplinary">Disciplinary Records</TabsTrigger>
          </TabsList>

          <div className="overflow-y-auto max-h-[calc(90vh-8rem)] mt-4">
            <TabsContent value="basic" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input
                        id="fullName"
                        value={editedStudent.full_name}
                        onChange={(e) => setEditedStudent({ ...editedStudent, full_name: e.target.value })}
                        disabled={!editMode}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="studentId">Student ID</Label>
                      <Input
                        id="studentId"
                        value={editedStudent.student_id}
                        onChange={(e) => setEditedStudent({ ...editedStudent, student_id: e.target.value })}
                        disabled={!editMode}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dateOfBirth">Date of Birth</Label>
                      <Input
                        id="dateOfBirth"
                        type="date"
                        value={editedStudent.date_of_birth || ''}
                        onChange={(e) => setEditedStudent({ ...editedStudent, date_of_birth: e.target.value })}
                        disabled={!editMode}
                      />
                    </div>
                     <div className="space-y-2">
                       <Label htmlFor="emergency_contact">Emergency Contact</Label>
                       <Input
                         id="emergency_contact"
                         value={editedStudent.emergency_contact || ''}
                         onChange={(e) => setEditedStudent({ ...editedStudent, emergency_contact: e.target.value })}
                         disabled={!editMode}
                       />
                     </div>
                     <div className="space-y-2">
                       <Label htmlFor="emergency_phone">Emergency Phone</Label>
                       <Input
                         id="emergency_phone"
                         value={editedStudent.emergency_phone || ''}
                         onChange={(e) => setEditedStudent({ ...editedStudent, emergency_phone: e.target.value })}
                         disabled={!editMode}
                       />
                     </div>
                    <div className="space-y-2">
                      <Label htmlFor="classId">Class</Label>
                      <Input
                        id="classId"
                        value={editedStudent.class_id || ''}
                        onChange={(e) => setEditedStudent({ ...editedStudent, class_id: e.target.value })}
                        disabled={!editMode}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Textarea
                      id="address"
                      value={editedStudent.address || ''}
                      onChange={(e) => setEditedStudent({ ...editedStudent, address: e.target.value })}
                      disabled={!editMode}
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="contacts" className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Responsible Parties</CardTitle>
                    <Button
                      size="sm"
                      onClick={() => setShowAddParty(true)}
                      className="gap-2"
                      disabled={!editMode}
                    >
                      <Plus className="h-4 w-4" />
                      Add Contact
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {responsibleParties.map((party) => (
                    <div key={party.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">{party.name}</h4>
                          {party.is_primary && (
                            <Badge variant="secondary">Primary</Badge>
                          )}
                        </div>
                        {editMode && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setResponsibleParties(responsibleParties.filter(p => p.id !== party.id))}
                            className="gap-2"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                      <div className="space-y-1 text-sm text-muted-foreground">
                        <div>Relationship: {party.relationship}</div>
                        {party.phone && <div>Phone: {party.phone}</div>}
                        {party.email && <div>Email: {party.email}</div>}
                      </div>
                    </div>
                  ))}

                  {showAddParty && (
                    <div className="p-4 border rounded-lg bg-muted/20">
                      <h4 className="font-medium mb-3">Add New Contact</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <Input
                          placeholder="Name *"
                          value={newParty.name || ''}
                          onChange={(e) => setNewParty({ ...newParty, name: e.target.value })}
                        />
                        <Input
                          placeholder="Relationship *"
                          value={newParty.relationship || ''}
                          onChange={(e) => setNewParty({ ...newParty, relationship: e.target.value })}
                        />
                        <Input
                          placeholder="Phone"
                          value={newParty.phone || ''}
                          onChange={(e) => setNewParty({ ...newParty, phone: e.target.value })}
                        />
                        <Input
                          placeholder="Email"
                          type="email"
                          value={newParty.email || ''}
                          onChange={(e) => setNewParty({ ...newParty, email: e.target.value })}
                        />
                      </div>
                      <div className="flex gap-2 mt-3">
                        <Button size="sm" onClick={addResponsibleParty}>
                          Add Contact
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setShowAddParty(false);
                            setNewParty({});
                          }}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="disciplinary" className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Disciplinary Records</CardTitle>
                    <Button
                      size="sm"
                      onClick={() => setShowAddRecord(true)}
                      className="gap-2"
                      disabled={!editMode}
                    >
                      <Plus className="h-4 w-4" />
                      Add Record
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {disciplinaryRecords.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      No disciplinary records found
                    </div>
                  ) : (
                    disciplinaryRecords.map((record) => (
                      <div key={record.id} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Badge
                              variant={record.resolved ? "secondary" : "destructive"}
                            >
                              {record.type.charAt(0).toUpperCase() + record.type.slice(1)}
                            </Badge>
                            <span className="text-sm text-muted-foreground">
                              {new Date(record.date).toLocaleDateString()}
                            </span>
                          </div>
                          {editMode && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setDisciplinaryRecords(disciplinaryRecords.filter(r => r.id !== record.id))}
                              className="gap-2"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                        <div className="space-y-2">
                          <div>
                            <strong>Description:</strong> {record.description}
                          </div>
                          {record.action_taken && (
                            <div>
                              <strong>Action Taken:</strong> {record.action_taken}
                            </div>
                          )}
                          <div className="flex items-center gap-2">
                            <strong>Status:</strong>
                            <Badge variant={record.resolved ? "secondary" : "destructive"}>
                              {record.resolved ? "Resolved" : "Open"}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))
                  )}

                  {showAddRecord && (
                    <div className="p-4 border rounded-lg bg-muted/20">
                      <h4 className="font-medium mb-3">Add New Disciplinary Record</h4>
                      <div className="space-y-3">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div className="space-y-2">
                            <Label>Type *</Label>
                            <select
                              className="w-full p-2 border rounded"
                              value={newRecord.type || ''}
                              onChange={(e) => setNewRecord({ ...newRecord, type: e.target.value as DisciplinaryRecord['type'] })}
                            >
                              <option value="">Select type</option>
                              <option value="warning">Warning</option>
                              <option value="detention">Detention</option>
                              <option value="suspension">Suspension</option>
                              <option value="other">Other</option>
                            </select>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>Description *</Label>
                          <Textarea
                            rows={3}
                            placeholder="Describe the incident..."
                            value={newRecord.description || ''}
                            onChange={(e) => setNewRecord({ ...newRecord, description: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Action Taken</Label>
                          <Textarea
                            rows={2}
                            placeholder="Describe the action taken..."
                            value={newRecord.action_taken || ''}
                            onChange={(e) => setNewRecord({ ...newRecord, action_taken: e.target.value })}
                          />
                        </div>
                      </div>
                      <div className="flex gap-2 mt-3">
                        <Button size="sm" onClick={addDisciplinaryRecord}>
                          Add Record
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setShowAddRecord(false);
                            setNewRecord({});
                          }}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default StudentDetailsDialog;