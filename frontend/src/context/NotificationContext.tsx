// src/context/NotificationContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Notification {
  message: string;
  date: string;
}

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (message: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = (message: string) => {
    setNotifications((prev) => [
      { message, date: new Date().toLocaleString() },
      ...prev,
    ]);
  };

  return (
    <NotificationContext.Provider value={{ notifications, addNotification }}>
      {children}
    </NotificationContext.Provider>
  );
};
