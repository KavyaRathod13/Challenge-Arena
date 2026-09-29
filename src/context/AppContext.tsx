import React from 'react';
import { createContext, useContext, useState, useEffect } from 'react';
import { mockChallenges } from '../data/mockData';

export type UserChallengeStatus = 'Not Started' | 'In Progress' | 'Submitted' | 'Under Review' | 'Completed';

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedAt?: string;
}

export const ALL_BADGES: Badge[] = [
  { id: 'b1', name: 'First Build',           description: 'Started your first challenge',            icon: 'Hammer'      },
  { id: 'b2', name: 'First Submission',       description: 'Submitted your first challenge',          icon: 'Send'        },
  { id: 'b3', name: 'Challenge Starter',      description: 'Started 3 challenges',                   icon: 'Rocket'      },
  { id: 'b4', name: '3 Challenges Completed', description: 'Completed 3 challenges successfully',     icon: 'Trophy'      },
  { id: 'b5', name: '7 Day Streak',           description: 'Logged in for 7 consecutive days',        icon: 'Flame'       },
  { id: 'b6', name: 'Web Builder',            description: 'Completed a Web Development challenge',   icon: 'Globe'       },
  { id: 'b7', name: 'Problem Solver',         description: 'Completed a Medium or Hard challenge',    icon: 'Brain'       },
  { id: 'b8', name: 'Consistency',            description: 'Earned XP 5 days in a row',              icon: 'CalendarCheck'},
  { id: 'b9', name: 'Arena Veteran',          description: 'Reached Level 10',                       icon: 'Shield'      },
];

export interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'info' | 'success' | 'warning';
}

interface UserChallengeRecord {
  status: UserChallengeStatus;
  progress: number;
  submittedAt?: string;
}

interface AppState {
  user: {
    name: string;
    avatar: string;
    branch: string;
    level: number;
    xp: number;
    streak: number;
    longestStreak: number;
  };
  userChallenges: Record<string, UserChallengeRecord>;
  savedChallengeIds: string[];
  badges: Badge[];
  notifications: Notification[];
}

const initialState: AppState = {
  user: {
    name: 'Kavya Patel',
    avatar: `${import.meta.env.BASE_URL}avatars/kavya.svg`,
    branch: 'Computer Engineering, CHARUSAT',
    level: 7,
    xp: 1840,
    streak: 6,
    longestStreak: 12,
  },
  userChallenges: {
    'c1':  { status: 'In Progress',   progress: 65  },
    'c2':  { status: 'Under Review',  progress: 100, submittedAt: new Date(Date.now() - 24*60*60*1000).toISOString()     },
    'c4':  { status: 'Completed',     progress: 100, submittedAt: new Date(Date.now() - 10*24*60*60*1000).toISOString()  },
    'c10': { status: 'Completed',     progress: 100, submittedAt: new Date(Date.now() - 15*24*60*60*1000).toISOString()  },
  },
  savedChallengeIds: ['c1', 'c5'],
  badges: ALL_BADGES.map(b =>
    ['b1', 'b2', 'b6', 'b7'].includes(b.id)
      ? { ...b, earnedAt: new Date().toISOString() }
      : b
  ),
  notifications: [
    {
      id: 'n1', title: 'Challenge Deadline',
      message: 'Campus Event Finder is due in 3 days.',
      timestamp: new Date().toISOString(), read: false, type: 'warning',
    },
    {
      id: 'n2', title: 'Submission Reviewed',
      message: 'Your AI Resume Reviewer submission is under review.',
      timestamp: new Date(Date.now() - 3_600_000).toISOString(), read: true, type: 'info',
    },
  ],
};

interface AppContextType extends AppState {
  startChallenge:           (id: string) => void;
  submitChallenge:          (id: string, repo: string, demo: string, notes: string) => void;
  toggleSaveChallenge:      (id: string) => void;
  markNotificationRead:     (id: string) => void;
  markAllNotificationsRead: ()           => void;
  addNotification:          (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  earnXP:                   (amount: number, reason: string) => void;
  updateUserProfile:        (updates: { name: string; branch: string }) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem('gitclub_arena_state');
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as AppState;
        return {
          ...parsed,
          user: {
  ...parsed.user,
  avatar: `${import.meta.env.BASE_URL}avatars/kavya.svg`,
},
        };
      } catch { return initialState; }
    }
    return initialState;
  });

  useEffect(() => {
    localStorage.setItem('gitclub_arena_state', JSON.stringify(state));
  }, [state]);

  /* ── helpers ─────────────────────────────────────────────────── */

  const addNotification = (notif: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    setState(prev => ({
      ...prev,
      notifications: [
        {
          ...notif,
          id: Math.random().toString(36).slice(2, 9),
          timestamp: new Date().toISOString(),
          read: false,
        },
        ...prev.notifications,
      ],
    }));
  };

  /** Returns updated badges array (may unlock new ones). */
  const tryUnlockBadges = (newState: AppState, notify: (n: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void): Badge[] => {
    const newBadges = [...newState.badges];

    const unlock = (id: string) => {
      const idx = newBadges.findIndex(b => b.id === id);
      if (idx !== -1 && !newBadges[idx].earnedAt) {
        newBadges[idx] = { ...newBadges[idx], earnedAt: new Date().toISOString() };
        notify({ title: 'Badge Unlocked!', message: `You earned the '${newBadges[idx].name}' badge.`, type: 'success' });
      }
    };

    const doneCount = Object.values(newState.userChallenges).filter(
      c => c.status === 'Completed' || c.status === 'Under Review' || c.status === 'Submitted'
    ).length;
    const startedCount = Object.keys(newState.userChallenges).length;

    if (startedCount >= 1)  unlock('b1');
    if (startedCount >= 3)  unlock('b3');
    if (doneCount   >= 1)   unlock('b2');
    if (doneCount   >= 3)   unlock('b4');
    if (newState.user.streak >= 7) unlock('b5');
    if (newState.user.level  >= 10) unlock('b9');

    return newBadges;
  };

  const earnXP = (amount: number, reason: string) => {
    setState(prev => {
      const newXp    = prev.user.xp + amount;
      const newLevel = Math.floor(newXp / 500) + 1;

      const levelUpNotifications: Notification[] = newLevel > prev.user.level
        ? [{
            id: Math.random().toString(36).slice(2),
            title: 'Level Up!',
            message: `You reached Level ${newLevel}!`,
            timestamp: new Date().toISOString(),
            read: false,
            type: 'success' as const,
          }]
        : [];

      return {
        ...prev,
        user: { ...prev.user, xp: newXp, level: newLevel },
        notifications: [
          ...levelUpNotifications,
          {
            id: Math.random().toString(36).slice(2),
            title: 'XP Earned',
            message: `+${amount} XP: ${reason}`,
            timestamp: new Date().toISOString(),
            read: false,
            type: 'info' as const,
          },
          ...prev.notifications,
        ],
      };
    });
  };

  /* ── public actions ─────────────────────────────────────────── */

  const startChallenge = (id: string) => {
    setState(prev => {
      const nextState: AppState = {
        ...prev,
        userChallenges: {
          ...prev.userChallenges,
          [id]: { status: 'In Progress', progress: 10 },
        },
      };
      const updatedBadges = tryUnlockBadges(nextState, addNotification);
      return { ...nextState, badges: updatedBadges };
    });
    earnXP(50, 'Started a new challenge');
  };

  const submitChallenge = (id: string, _repo: string, _demo: string, _notes: string) => {
    setState(prev => {
      const nextState: AppState = {
        ...prev,
        userChallenges: {
          ...prev.userChallenges,
          [id]: { status: 'Submitted', progress: 100, submittedAt: new Date().toISOString() },
        },
      };
      const updatedBadges = tryUnlockBadges(nextState, addNotification);
      return { ...nextState, badges: updatedBadges };
    });

    const challenge = mockChallenges.find(c => c.id === id);
    if (challenge) earnXP(challenge.points, `Submitted ${challenge.title}`);
    addNotification({ title: 'Submission Received', message: 'Your challenge has been submitted successfully.', type: 'success' });
  };

  const updateUserProfile = (updates: { name: string; branch: string }) => {
    setState(prev => ({
      ...prev,
      user: { ...prev.user, name: updates.name.trim() || prev.user.name, branch: updates.branch.trim() || prev.user.branch },
    }));
  };

  const toggleSaveChallenge = (id: string) => {
    setState(prev => ({
      ...prev,
      savedChallengeIds: prev.savedChallengeIds.includes(id)
        ? prev.savedChallengeIds.filter(sid => sid !== id)
        : [...prev.savedChallengeIds, id],
    }));
  };

  const markNotificationRead = (id: string) => {
    setState(prev => ({
      ...prev,
      notifications: prev.notifications.map(n => n.id === id ? { ...n, read: true } : n),
    }));
  };

  const markAllNotificationsRead = () => {
    setState(prev => ({
      ...prev,
      notifications: prev.notifications.map(n => ({ ...n, read: true })),
    }));
  };

  return (
    <AppContext.Provider value={{
      ...state,
      startChallenge,
      submitChallenge,
      toggleSaveChallenge,
      markNotificationRead,
      markAllNotificationsRead,
      addNotification,
      earnXP,
      updateUserProfile,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppContext must be used within AppProvider');
  return ctx;
};
