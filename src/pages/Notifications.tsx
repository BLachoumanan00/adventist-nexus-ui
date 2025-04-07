
import React, { useState, useEffect } from 'react';
import { Bell, Filter, Send, Trash, Check, AlertCircle, Info, CheckCircle } from 'lucide-react';
import { useNotifications } from '../context/NotificationContext';
import { useToast } from '../hooks/use-toast';
import { useActivityLogger } from '../hooks/useActivityLogger';

const Notifications: React.FC = () => {
  const { notifications, markAsRead, markAllAsRead, clearNotification } = useNotifications();
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [recipientType, setRecipientType] = useState<'all' | 'teachers' | 'students' | 'parents' | 'admins'>('all');
  const [notificationType, setNotificationType] = useState<'all' | 'info' | 'warning' | 'success' | 'error'>('all');
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [priority, setPriority] = useState<'normal' | 'high'>('normal');
  const { toast } = useToast();
  const { logActivity } = useActivityLogger();

  const filteredNotifications = notifications.filter(notif => {
    const matchesFilter = filter === 'all' || 
                          (filter === 'unread' && !notif.isRead) || 
                          (filter === 'read' && notif.isRead);
                          
    const matchesType = notificationType === 'all' || notif.type === notificationType;
    
    return matchesFilter && matchesType;
  });

  const handleSendNotification = () => {
    if (!title || !message) {
      toast({
        title: "Error",
        description: "Title and message are required.",
        variant: "destructive"
      });
      return;
    }

    const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!) : null;
    
    const options = { 
      title: title, 
      message: message, 
      type: notificationType === 'all' ? 'info' : notificationType,
      createdBy: user ? `${user.name} (${user.email})` : 'Billy Lachoumanan (blachoumanan@adventistcollege.mu)'
    };
    
    try {
      // @ts-ignore - We know the type is valid since we mapped 'all' to 'info'
      addNotification(options);
      
      setTitle('');
      setMessage('');
      setPriority('normal');
      
      toast({
        title: "Notification Sent",
        description: `Sent to ${recipientType === 'all' ? 'everyone' : recipientType}`
      });
      
      logActivity("Sent Notification", `${title} - to ${recipientType}`);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send notification.",
        variant: "destructive"
      });
    }
  };

  const handleClearAll = () => {
    const shouldClear = window.confirm("Are you sure you want to clear all notifications?");
    if (shouldClear) {
      filteredNotifications.forEach(notif => {
        clearNotification(notif.id);
      });
      
      toast({
        title: "Notifications Cleared",
        description: "All matching notifications have been cleared."
      });
      
      logActivity("Cleared Notifications", `Cleared ${filteredNotifications.length} notifications`);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch(type) {
      case 'info':
        return <Info size={18} className="text-blue-500" />;
      case 'warning':
        return <AlertCircle size={18} className="text-yellow-500" />;
      case 'error':
        return <AlertCircle size={18} className="text-red-500" />;
      case 'success':
        return <CheckCircle size={18} className="text-green-500" />;
      default:
        return <Bell size={18} className="text-primary" />;
    }
  };

  const capitalizeFirstLetter = (text: string) => {
    return text.replace(/(^|[.!?]\s+)([a-z])/g, (match, p1, p2) => {
      return p1 + p2.toUpperCase();
    });
  };

  return (
    <div className="animate-fade-in">
      <div className="glass-card mb-6">
        <div className="flex items-center gap-3 mb-6">
          <Bell size={24} className="text-theme-purple" />
          <h2 className="text-xl font-semibold">Notifications</h2>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="glass rounded-xl p-4 lg:col-span-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div className="flex gap-2">
                <button 
                  onClick={() => setFilter('all')} 
                  className={`px-3 py-1.5 rounded-full text-sm ${filter === 'all' ? 'bg-primary text-background' : 'bg-white/10'}`}
                >
                  All
                </button>
                <button 
                  onClick={() => setFilter('unread')} 
                  className={`px-3 py-1.5 rounded-full text-sm ${filter === 'unread' ? 'bg-primary text-background' : 'bg-white/10'}`}
                >
                  Unread
                </button>
                <button 
                  onClick={() => setFilter('read')} 
                  className={`px-3 py-1.5 rounded-full text-sm ${filter === 'read' ? 'bg-primary text-background' : 'bg-white/10'}`}
                >
                  Read
                </button>
              </div>
              
              <div className="flex items-center gap-2">
                <select 
                  value={notificationType}
                  onChange={(e) => setNotificationType(e.target.value as any)}
                  className="glass border-none rounded-lg px-3 py-1.5 text-sm"
                >
                  <option value="all">All Types</option>
                  <option value="info">Info</option>
                  <option value="warning">Warning</option>
                  <option value="success">Success</option>
                  <option value="error">Error</option>
                </select>
                
                <button 
                  onClick={markAllAsRead}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg glass text-sm"
                >
                  <Check size={14} />
                  <span>Mark All Read</span>
                </button>
                
                <button 
                  onClick={handleClearAll}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg glass text-sm"
                >
                  <Trash size={14} />
                  <span>Clear</span>
                </button>
              </div>
            </div>
            
            <div className="h-[calc(100vh-20rem)] overflow-y-auto">
              {filteredNotifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-foreground/60">
                  <Bell size={36} className="mb-3 text-foreground/40" />
                  <p>No notifications matching the current filters</p>
                </div>
              ) : (
                <div className="divide-y divide-white/5">
                  {filteredNotifications.map((notification) => (
                    <div 
                      key={notification.id} 
                      className={`p-4 hover:bg-white/5 transition-colors ${!notification.isRead ? 'bg-primary/5' : ''}`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex gap-3">
                          {getNotificationIcon(notification.type)}
                          <div>
                            <h3 className="font-medium">{capitalizeFirstLetter(notification.title)}</h3>
                            <p className="text-sm text-foreground/70 mt-1">
                              {capitalizeFirstLetter(notification.message)}
                            </p>
                            <div className="flex justify-between items-center mt-2 text-xs text-foreground/50">
                              <span>
                                {new Date(notification.createdAt).toLocaleString()}
                              </span>
                              {notification.createdBy && (
                                <span>From: {notification.createdBy}</span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          {!notification.isRead && (
                            <button 
                              onClick={() => markAsRead(notification.id)}
                              className="p-1.5 rounded-full hover:bg-white/10 text-primary"
                              title="Mark as read"
                            >
                              <Check size={16} />
                            </button>
                          )}
                          <button 
                            onClick={() => clearNotification(notification.id)}
                            className="p-1.5 rounded-full hover:bg-white/10 text-red-400"
                            title="Delete"
                          >
                            <Trash size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          <div className="glass rounded-xl p-4">
            <h3 className="font-medium mb-4">Send New Notification</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-foreground/70 mb-1">Recipient</label>
                <select
                  value={recipientType}
                  onChange={(e) => setRecipientType(e.target.value as any)}
                  className="w-full glass px-4 py-2 rounded-lg border-none"
                >
                  <option value="all">Everyone</option>
                  <option value="teachers">All Teachers</option>
                  <option value="students">All Students</option>
                  <option value="parents">All Parents</option>
                  <option value="admins">Admins Only</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm text-foreground/70 mb-1">Type</label>
                <select
                  value={notificationType === 'all' ? 'info' : notificationType}
                  onChange={(e) => setNotificationType(e.target.value as any)}
                  className="w-full glass px-4 py-2 rounded-lg border-none"
                >
                  <option value="info">Information</option>
                  <option value="warning">Warning</option>
                  <option value="success">Success</option>
                  <option value="error">Alert</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm text-foreground/70 mb-1">Priority</label>
                <div className="flex">
                  <button
                    className={`flex-1 py-2 rounded-l-lg ${priority === 'normal' ? 'bg-primary text-background' : 'bg-white/10'}`}
                    onClick={() => setPriority('normal')}
                  >
                    Normal
                  </button>
                  <button
                    className={`flex-1 py-2 rounded-r-lg ${priority === 'high' ? 'bg-primary text-background' : 'bg-white/10'}`}
                    onClick={() => setPriority('high')}
                  >
                    High
                  </button>
                </div>
              </div>
              
              <div>
                <label className="block text-sm text-foreground/70 mb-1">Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Notification title"
                  className="w-full glass px-4 py-2 rounded-lg border-none"
                />
              </div>
              
              <div>
                <label className="block text-sm text-foreground/70 mb-1">Message</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Write your notification message here..."
                  rows={4}
                  className="w-full glass px-4 py-2 rounded-lg border-none resize-none"
                />
              </div>
              
              <button 
                onClick={handleSendNotification}
                className="btn-primary w-full flex items-center justify-center gap-2"
              >
                <Send size={16} />
                <span>Send Notification</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notifications;
