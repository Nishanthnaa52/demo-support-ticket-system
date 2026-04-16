import { createContext, useContext, useState, useCallback } from 'react';
import {
  loadNotifications, saveNotifications, addNotification as storageAdd, markAllRead,
} from '../utils/storage';

const NotifContext = createContext(null);

export function NotifProvider({ children }) {
  const [notifications, setNotifications] = useState(() => loadNotifications());

  const refresh = useCallback(() => setNotifications(loadNotifications()), []);

  const add = useCallback((notif) => {
    storageAdd(notif);
    setNotifications(loadNotifications());
  }, []);

  const readAll = useCallback(() => {
    markAllRead();
    setNotifications(loadNotifications());
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <NotifContext.Provider value={{ notifications, unreadCount, add, readAll, refresh }}>
      {children}
    </NotifContext.Provider>
  );
}

export function useNotifs() {
  const ctx = useContext(NotifContext);
  if (!ctx) throw new Error('useNotifs must be inside NotifProvider');
  return ctx;
}
