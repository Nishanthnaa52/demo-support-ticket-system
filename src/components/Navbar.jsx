import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotifs } from '../context/NotifContext';
import { timeAgo } from '../utils/sla';

// Bell icon SVG
const BellIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
  </svg>
);

const ROLE_LABELS = { ceo: 'CEO', manager: 'Manager', employee: 'Employee' };
const ROLE_COLORS = { ceo: 'bg-yellow-600', manager: 'bg-blue-600', employee: 'bg-green-700' };

export default function Navbar({ onToggleDark, isDark }) {
  const { user, logout } = useAuth();
  const { notifications, unreadCount, readAll } = useNotifs();
  const navigate = useNavigate();
  const location = useLocation();

  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const notifRef = useRef(null);
  const profileRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const roleLabel = ROLE_LABELS[user?.role] || '';
  const roleColor = ROLE_COLORS[user?.role] || 'bg-gray-700';

  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-800 bg-gray-950/90 backdrop-blur-md">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">

        {/* Logo */}
        <div
          className="flex items-center gap-2.5 cursor-pointer select-none"
          onClick={() => navigate(user ? `/${user.role}-dashboard` : '/login')}
        >
          <div className="w-9 h-9 brand-gradient rounded-xl flex items-center justify-center orange-glow">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <span className="font-bold text-lg text-white hidden sm:block">
            Support<span className="text-orange-500">Desk</span>
          </span>
        </div>

        {/* Current page breadcrumb */}
        <div className="flex-1 hidden md:block">
          <p className="text-xs text-gray-500 capitalize">
            {location.pathname.replace('/', '').replace('-', ' ') || 'Home'}
          </p>
        </div>

        {/* Right controls */}
        <div className="flex items-center gap-2">

          {/* Dark mode toggle */}
          <button
            id="dark-mode-toggle"
            onClick={onToggleDark}
            className="p-2 rounded-xl text-gray-400 hover:text-orange-400 hover:bg-white/5 transition-all"
            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDark ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M17.657 17.657l-.707-.707M6.343 6.343l-.707-.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>

          {/* Notification bell */}
          {user && (
            <div className="relative" ref={notifRef}>
              <button
                id="notification-bell"
                onClick={() => { setNotifOpen(o => !o); setProfileOpen(false); }}
                className="relative p-2 rounded-xl text-gray-400 hover:text-orange-400 hover:bg-white/5 transition-all"
              >
                <BellIcon />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-orange-500 rounded-full text-[10px] font-bold text-white flex items-center justify-center ping-dot">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>

              {/* Notification dropdown */}
              {notifOpen && (
                <div className="absolute right-0 top-12 w-80 card animate-slide-down z-50 overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
                    <h3 className="font-semibold text-sm text-white">Notifications</h3>
                    <button onClick={readAll} className="text-xs text-orange-400 hover:text-orange-300 transition-colors">
                      Mark all read
                    </button>
                  </div>
                  <ul className="max-h-72 overflow-y-auto divide-y divide-gray-800/60">
                    {notifications.length === 0 ? (
                      <li className="px-4 py-6 text-center text-gray-500 text-sm">No notifications</li>
                    ) : (
                      notifications.slice(0, 8).map(n => (
                        <li key={n.id} className={`px-4 py-3 flex gap-3 ${n.read ? 'opacity-50' : 'bg-orange-600/5'}`}>
                          <div className={`mt-0.5 w-2 h-2 rounded-full flex-shrink-0 ${n.read ? 'bg-gray-600' : 'bg-orange-500'}`} />
                          <div>
                            <p className="text-xs text-gray-300 leading-snug">{n.message}</p>
                            <p className="text-[10px] text-gray-500 mt-1">{timeAgo(n.time)}</p>
                          </div>
                        </li>
                      ))
                    )}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Profile dropdown */}
          {user && (
            <div className="relative" ref={profileRef}>
              <button
                id="profile-menu"
                onClick={() => { setProfileOpen(o => !o); setNotifOpen(false); }}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-white/5 transition-all"
              >
                <div className={`w-8 h-8 ${roleColor} rounded-xl flex items-center justify-center text-xs font-bold text-white`}>
                  {user.avatar || user.name?.slice(0, 2).toUpperCase()}
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-medium text-white leading-none">{user.name}</p>
                  <p className="text-[10px] text-orange-400 mt-0.5">{roleLabel}</p>
                </div>
                <svg className="w-4 h-4 text-gray-500 hidden sm:block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {profileOpen && (
                <div className="absolute right-0 top-12 w-52 card animate-slide-down z-50 overflow-hidden">
                  <div className="px-4 py-3 border-b border-gray-800">
                    <p className="text-sm font-semibold text-white">{user.name}</p>
                    <p className="text-xs text-gray-400">{user.email || `${user.role}@company.com`}</p>
                  </div>
                  <div className="p-2">
                    <button
                      id="logout-btn"
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-red-400 hover:bg-red-900/20 transition-all"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
