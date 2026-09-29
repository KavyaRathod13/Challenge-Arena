import React, { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Bell, Menu, X, Check, Target, BookOpen, BarChart2, Trophy, Bookmark, Home } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { cn } from '../utils/cn';

export const AppLayout: React.FC = () => {
  const [mobileMenuOpen,    setMobileMenuOpen]    = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const location = useLocation();
  const { user, notifications, markAllNotificationsRead, markNotificationRead } = useAppContext();

  const unreadCount = notifications.filter(n => !n.read).length;

  const navLinks = [
    { name: 'Dashboard',   path: '/',            icon: Home      },
    { name: 'Challenges',  path: '/challenges',  icon: Target    },
    { name: 'Progress',    path: '/progress',    icon: BarChart2 },
    { name: 'Leaderboard', path: '/leaderboard', icon: Trophy    },
    { name: 'Saved',       path: '/saved',       icon: Bookmark  },
  ];

  const isActive = (path: string) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      {/* ── Navbar ─────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/80 backdrop-blur-md">
        <div className="mx-auto px-4 h-16 flex items-center justify-between max-w-7xl">

          {/* Logo + Desktop Nav */}
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2.5 shrink-0">
              <img src="/src/assets/logo.png" alt="Git Club" className="h-10 w-auto object-contain" />
              <span className="font-extrabold text-base tracking-tight hidden sm:inline text-slate-900">
                Challenge Arena
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-0.5" aria-label="Main navigation">
              {navLinks.map(({ name, path }) => (
                <Link
                  key={name}
                  to={path}
                  className={cn(
                    'px-3 py-2 rounded-md text-sm font-medium transition-colors',
                    isActive(path)
                      ? 'text-gitclub bg-gitclub/8 font-semibold'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  )}
                >
                  {name}
                </Link>
              ))}
            </nav>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => { setNotificationsOpen(o => !o); setMobileMenuOpen(false); }}
                className="relative p-2 rounded-full hover:bg-slate-100 text-slate-600 transition-colors"
                aria-label={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ''}`}
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-gitclub border-2 border-white" />
                )}
              </button>

              {notificationsOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setNotificationsOpen(false)} />
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-modal border border-slate-200 overflow-hidden z-50">
                    <div className="p-3 border-b border-slate-100 flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-sm text-slate-900">Notifications</h3>
                        {unreadCount > 0 && (
                          <span className="text-xs bg-gitclub text-white px-1.5 py-0.5 rounded-full font-bold">{unreadCount}</span>
                        )}
                      </div>
                      {unreadCount > 0 && (
                        <button
                          onClick={markAllNotificationsRead}
                          className="text-xs text-gitclub hover:underline font-medium"
                        >
                          Mark all read
                        </button>
                      )}
                    </div>
                    <div className="max-h-80 overflow-y-auto divide-y divide-slate-50">
                      {notifications.length === 0 ? (
                        <div className="p-6 text-center">
                          <Bell className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                          <p className="text-sm text-slate-500">No notifications yet.</p>
                        </div>
                      ) : (
                        notifications.map(notif => (
                          <button
                            key={notif.id}
                            className={cn(
                              'w-full text-left p-3 flex gap-3 hover:bg-slate-50 transition-colors',
                              !notif.read && 'bg-blue-50/50'
                            )}
                            onClick={() => markNotificationRead(notif.id)}
                          >
                            <div className={cn(
                              'mt-0.5 rounded-full p-1.5 h-fit shrink-0',
                              notif.type === 'success' ? 'bg-emerald-100 text-emerald-600' :
                              notif.type === 'warning' ? 'bg-amber-100 text-amber-600' :
                              'bg-blue-100 text-blue-600'
                            )}>
                              {notif.type === 'success'
                                ? <Check className="w-3 h-3" />
                                : <Target className="w-3 h-3" />}
                            </div>
                            <div className="min-w-0">
                              <p className={cn(
                                'text-sm leading-snug',
                                !notif.read ? 'font-semibold text-slate-900' : 'font-medium text-slate-600'
                              )}>
                                {notif.title}
                              </p>
                              <p className="text-xs text-slate-500 mt-0.5 leading-snug">{notif.message}</p>
                            </div>
                          </button>
                        ))
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Profile */}
            <Link
              to="/profile"
              className="hidden sm:flex items-center gap-2.5 hover:bg-slate-100 p-1 pr-3 rounded-full transition-colors border border-slate-200/80"
            >
              <img src={user.avatar} alt="Profile" className="w-8 h-8 rounded-full bg-slate-200" />
              <div className="flex flex-col leading-none">
                <span className="text-xs font-bold text-slate-900">{user.name.split(' ')[0]}</span>
                <span className="text-[10px] text-slate-500 mt-0.5">Lvl {user.level} · {user.xp} XP</span>
              </div>
            </Link>

            {/* Mobile toggle */}
            <button
              className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-md transition-colors"
              onClick={() => { setMobileMenuOpen(o => !o); setNotificationsOpen(false); }}
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* ── Mobile Nav ─────────────────────────────────────────────── */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed top-16 inset-x-0 z-30 bg-white border-b border-slate-200 shadow-lg">
          <div className="p-4 flex flex-col gap-1 max-h-[calc(100vh-4rem)] overflow-y-auto">
            {/* User card */}
            <div className="flex items-center gap-3 px-3 py-3 mb-2 border-b border-slate-100">
              <img src={user.avatar} alt="Profile" className="w-10 h-10 rounded-full bg-slate-200" />
              <div>
                <p className="font-bold text-sm text-slate-900">{user.name}</p>
                <p className="text-xs text-slate-500">{user.branch}</p>
                <p className="text-xs text-gitclub font-semibold mt-0.5">Level {user.level} · {user.xp} XP</p>
              </div>
            </div>

            {navLinks.map(({ name, path, icon: Icon }) => (
              <Link
                key={name}
                to={path}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors',
                  isActive(path)
                    ? 'text-gitclub bg-gitclub/8 font-semibold'
                    : 'text-slate-600 hover:bg-slate-50'
                )}
              >
                <Icon className="w-4 h-4" />
                {name}
              </Link>
            ))}
            <Link
              to="/profile"
              onClick={() => setMobileMenuOpen(false)}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors',
                location.pathname === '/profile'
                  ? 'text-gitclub bg-gitclub/8 font-semibold'
                  : 'text-slate-600 hover:bg-slate-50'
              )}
            >
              <BookOpen className="w-4 h-4" />
              My Profile
            </Link>
          </div>
        </div>
      )}

      {/* ── Main Content ───────────────────────────────────────────── */}
      <main className="flex-grow w-full max-w-7xl mx-auto px-4 py-6 md:px-6 md:py-8 lg:px-8 lg:py-10">
        <Outlet />
      </main>

      {/* ── Footer ─────────────────────────────────────────────────── */}
      <footer className="border-t border-slate-200 bg-white py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2.5 opacity-70">
            <img src="/src/assets/logo.png" alt="Git Club" className="h-7 w-auto grayscale" />
            <span className="font-bold text-slate-500 text-sm">Challenge Arena</span>
          </div>
          <p className="text-xs text-slate-400">
            Git Club CHARUSAT &copy; {new Date().getFullYear()} &mdash; Learn by Building.
          </p>
        </div>
      </footer>
    </div>
  );
};
