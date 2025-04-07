
import React, { useState } from "react";
import { CheckCircle, Edit, PlusCircle, Search, Shield, Trash, UserCog } from "lucide-react";
import { useToast } from "../hooks/use-toast";

interface User {
  id: number;
  name: string;
  email: string;
  role: 'Teacher' | 'Admin' | 'Clerk' | 'Student';
  department?: string;
  addedOn: string;
}

const AdminPanel: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState<'Teacher' | 'Admin' | 'Clerk'>('Teacher');
  const [newUserName, setNewUserName] = useState('');
  const [newUserDepartment, setNewUserDepartment] = useState('');
  const { toast } = useToast();

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
    { id: 6, name: 'Black Houmanan', email: 'blackhoumanan@adventistcollege.mu', role: 'Admin', department: 'Superuser', addedOn: '2023-03-01' },
  ]);

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.department && user.department.toLowerCase().includes(searchTerm.toLowerCase()))
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
    
    const newUser: User = {
      id: users.length + 1,
      name: newUserName || 'New User', // Use provided name or default
      email: formattedEmail,
      role: newUserRole,
      department: newUserDepartment || undefined,
      addedOn: new Date().toISOString().split('T')[0]
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
    if (userToDelete?.email.toLowerCase() === 'blackhoumanan@adventistcollege.mu') {
      toast({
        title: "Cannot Delete Superuser",
        description: "This superuser account cannot be deleted.",
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
    return email.toLowerCase() === 'blackhoumanan@adventistcollege.mu';
  };

  return (
    <div className="animate-fade-in">
      <div className="glass-card mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
          <div className="flex items-center gap-3">
            <UserCog size={24} className="text-theme-purple" />
            <h2 className="text-xl font-semibold">User Management</h2>
          </div>
          
          <div className="relative">
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 rounded-full glass border-none focus:ring-2 ring-primary/30 outline-none w-full md:w-64"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/50" size={16} />
          </div>
        </div>
        
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
                <option value="Admin">Admin</option>
                <option value="Clerk">Clerk</option>
              </select>
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
                        disabled={isSuperUser(user.email)}
                      >
                        <Trash size={16} className={isSuperUser(user.email) ? "text-foreground/30" : "text-foreground/70"} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
