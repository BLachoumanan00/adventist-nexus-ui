
import React, { useState } from "react";
import { CheckCircle, Edit, PlusCircle, Search, Shield, Trash, UserCog } from "lucide-react";

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

  // Sample users data
  const [users, setUsers] = useState<User[]>([
    { id: 1, name: 'John Smith', email: 'john@example.com', role: 'Teacher', department: 'Mathematics', addedOn: '2023-05-15' },
    { id: 2, name: 'Sarah Johnson', email: 'sarah@example.com', role: 'Admin', addedOn: '2023-04-20' },
    { id: 3, name: 'Michael Brown', email: 'michael@example.com', role: 'Clerk', department: 'Administration', addedOn: '2023-06-10' },
    { id: 4, name: 'Emily Davis', email: 'emily@example.com', role: 'Teacher', department: 'Science', addedOn: '2023-05-22' },
    { id: 5, name: 'Robert Wilson', email: 'robert@example.com', role: 'Teacher', department: 'History', addedOn: '2023-07-01' },
  ]);

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.department && user.department.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleAddUser = () => {
    if (!newUserEmail) return;
    
    const newUser: User = {
      id: users.length + 1,
      name: 'New User', // Would normally be filled by the user when accepting invitation
      email: newUserEmail,
      role: newUserRole,
      addedOn: new Date().toISOString().split('T')[0]
    };
    
    setUsers([...users, newUser]);
    setNewUserEmail('');
  };

  const handleDeleteUser = (id: number) => {
    setUsers(users.filter(user => user.id !== id));
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
          
          <div className="flex flex-col md:flex-row gap-3">
            <input
              type="email"
              placeholder="Email address"
              value={newUserEmail}
              onChange={(e) => setNewUserEmail(e.target.value)}
              className="flex-grow rounded-lg glass border-none px-4 py-2"
            />
            
            <select 
              value={newUserRole} 
              onChange={(e) => setNewUserRole(e.target.value as any)}
              className="rounded-lg glass border-none px-4 py-2"
            >
              <option value="Teacher">Teacher</option>
              <option value="Admin">Admin</option>
              <option value="Clerk">Clerk</option>
            </select>
            
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
                <tr key={user.id} className="border-b border-white/5 hover:bg-white/5 dark:hover:bg-white/5 transition-colors">
                  <td className="py-3">{user.name}</td>
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
