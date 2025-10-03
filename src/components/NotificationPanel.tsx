
import React, { useState } from 'react';
import { Bell, Check, Trash, X } from 'lucide-react';
import { useNotifications } from '../context/NotificationContext';
import { formatDistanceToNow } from 'date-fns';

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const NotificationPanel: React.FC<NotificationPanelProps> = ({ isOpen, onClose }) => {
  const { notifications, markAsRead, markAllAsRead, clearNotification } = useNotifications();
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const displayedNotifications = filter === 'all' 
    ? notifications 
    : notifications.filter(notif => !notif.isRead);

  // Ensure capitalization for all notification messages
  const capitalizeFirstLetter = (text: string) => {
    return text.replace(/(^|[.!?]\s+)([a-z])/g, (match, p1, p2) => {
      return p1 + p2.toUpperCase();
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-background/60 backdrop-blur-sm" 
        onClick={onClose}
      />
      
      {/* Panel */}
      <div className="relative w-full max-w-md glass-card animate-in slide-in-from-right">
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Bell size={18} />
            <span>Notifications</span>
          </h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-secondary">
            <X size={20} />
          </button>
        </div>
        
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <div className="flex gap-2">
            <button 
              onClick={() => setFilter('all')} 
              className={`px-3 py-1 rounded-full text-sm ${filter === 'all' ? 'bg-primary text-primary-foreground' : 'bg-secondary'}`}
            >
              All
            </button>
            <button 
              onClick={() => setFilter('unread')} 
              className={`px-3 py-1 rounded-full text-sm ${filter === 'unread' ? 'bg-primary text-primary-foreground' : 'bg-secondary'}`}
            >
              Unread ({notifications.filter(n => !n.isRead).length})
            </button>
          </div>
          
          <button 
            onClick={markAllAsRead}
            className="flex items-center gap-1 text-sm text-primary"
          >
            <Check size={14} />
            <span>Mark all as read</span>
          </button>
        </div>
        
        <div className="h-[calc(100vh-8rem)] overflow-y-auto">
          {displayedNotifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-foreground/60">
              <Bell size={36} className="mb-3 text-foreground/40" />
              <p>No notifications to display</p>
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {displayedNotifications.map((notification) => (
                <div 
                  key={notification.id} 
                  className={`p-4 hover:bg-secondary/50 transition-colors ${!notification.isRead ? 'bg-primary/5' : ''}`}
                >
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium">{capitalizeFirstLetter(notification.title)}</h3>
                    <div className="flex items-center gap-1">
                      {!notification.isRead && (
                        <button 
                          onClick={() => markAsRead(notification.id)}
                          className="p-1 rounded-full hover:bg-secondary text-primary"
                          title="Mark as read"
                        >
                          <Check size={14} />
                        </button>
                      )}
                      <button 
                        onClick={() => clearNotification(notification.id)}
                        className="p-1 rounded-full hover:bg-secondary text-destructive"
                        title="Delete"
                      >
                        <Trash size={14} />
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-foreground/70 mt-1">
                    {capitalizeFirstLetter(notification.message)}
                  </p>
                  <div className="flex justify-between items-center mt-2 text-xs text-foreground/50">
                    <span>
                      {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                    </span>
                    {notification.createdBy && (
                      <span>From: {notification.createdBy}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationPanel;
