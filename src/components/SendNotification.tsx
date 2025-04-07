
import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { useNotifications } from '../context/NotificationContext';

const SendNotification: React.FC = () => {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [type, setType] = useState<'info' | 'success' | 'warning' | 'error'>('info');
  const { addNotification } = useNotifications();

  // Capitalize first letter after period
  const capitalizeAfterPeriod = (text: string) => {
    return text.replace(/(^|[.!?]\s+)([a-z])/g, (match, p1, p2) => {
      return p1 + p2.toUpperCase();
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !message.trim()) return;
    
    const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!) : { name: 'System' };
    
    // Apply the capitalization function to both title and message
    const formattedTitle = capitalizeAfterPeriod(title);
    const formattedMessage = capitalizeAfterPeriod(message);
    
    addNotification({
      title: formattedTitle,
      message: formattedMessage,
      type,
      createdBy: user.name
    });
    
    // Reset form
    setTitle('');
    setMessage('');
    setType('info');
  };

  return (
    <div className="glass rounded-xl p-4">
      <h3 className="font-medium mb-4">Send Notification</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm mb-1 text-foreground/70">Title</label>
          <input 
            type="text" 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-lg glass border-none px-4 py-2"
            placeholder="Notification title"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm mb-1 text-foreground/70">Message</label>
          <textarea 
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full rounded-lg glass border-none px-4 py-2 min-h-[100px]"
            placeholder="Notification message"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm mb-1 text-foreground/70">Type</label>
          <select 
            value={type}
            onChange={(e) => setType(e.target.value as 'info' | 'success' | 'warning' | 'error')}
            className="w-full rounded-lg glass border-none px-4 py-2"
          >
            <option value="info">Information</option>
            <option value="success">Success</option>
            <option value="warning">Warning</option>
            <option value="error">Error</option>
          </select>
        </div>
        
        <div className="flex justify-end">
          <button type="submit" className="btn-primary flex items-center gap-2">
            <Send size={16} />
            <span>Send Notification</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default SendNotification;
