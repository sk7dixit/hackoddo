import React, { createContext, useContext, useState, useEffect } from 'react';
import { Employee, Notification, UserRole } from '../../../server/src/types';
import api from '../services/api';

interface AppContextProps {
  currentUser: Employee | null;
  activeRole: UserRole;
  activeTab: string;
  notifications: Notification[];
  refreshTrigger: number;
  login: (user: Employee) => void;
  logout: () => void;
  setActiveRole: (role: UserRole) => void;
  setActiveTab: (tab: string) => void;
  triggerRefresh: () => void;
  fetchNotifications: () => Promise<void>;
  markNotificationsRead: () => Promise<void>;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<Employee | null>(null);
  const [activeRole, setActiveRoleState] = useState<UserRole>('employee');
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);

  // Initialize state from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('assetflow_user');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setCurrentUser(user);
        
        // Default role to their actual role on start
        const storedRole = localStorage.getItem('assetflow_active_role') as UserRole;
        setActiveRoleState(storedRole || user.role);
      } catch (e) {
        console.error('Error loading stored user:', e);
      }
    }
  }, []);

  // Fetch notifications periodically if logged in
  useEffect(() => {
    if (currentUser) {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 10000); // Poll every 10s
      return () => clearInterval(interval);
    }
  }, [currentUser, refreshTrigger]);

  const login = (user: Employee) => {
    setCurrentUser(user);
    setActiveRoleState(user.role);
    localStorage.setItem('assetflow_user', JSON.stringify(user));
    localStorage.setItem('assetflow_active_role', user.role);
    setActiveTab('dashboard');
    triggerRefresh();
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('assetflow_user');
    localStorage.removeItem('assetflow_active_role');
    setNotifications([]);
    setActiveTab('dashboard');
  };

  const setActiveRole = (role: UserRole) => {
    setActiveRoleState(role);
    localStorage.setItem('assetflow_active_role', role);
    triggerRefresh();
  };

  const triggerRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const fetchNotifications = async () => {
    try {
      const data = await api.get<Notification[]>('/notifications');
      // Sort newest first
      const sorted = data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setNotifications(sorted);
    } catch (e) {
      console.error('Failed to fetch notifications:', e);
    }
  };

  const markNotificationsRead = async () => {
    try {
      await api.patch('/notifications/read');
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch (e) {
      console.error('Failed to mark notifications read:', e);
    }
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        activeRole,
        activeTab,
        notifications,
        refreshTrigger,
        login,
        logout,
        setActiveRole,
        setActiveTab,
        triggerRefresh,
        fetchNotifications,
        markNotificationsRead,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
export default AppContext;
