import React, { useMemo, useState } from 'react';
import { Trophy, Medal, Award } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { Card } from '../components/ui/Card';
import { cn } from '../utils/cn';

type FilterOption = 'All Time' | 'This Month' | 'This Week';

const leaderboardByFilter: Record<FilterOption, Array<{ id: string; name: string; avatar: string; xp: number; completed: number; streak: number; level: number }>> = {
  'All Time': [
    { id: 'u1', name: 'Aarav Patel', avatar: '/src/assets/avatars/aarav.svg', xp: 1750, completed: 8, streak: 11, level: 4 },
    { id: 'u2', name: 'Priya Sharma', avatar: '/src/assets/avatars/priya.svg', xp: 1620, completed: 7, streak: 15, level: 4 },
    { id: 'u3', name: 'Rahul Desai', avatar: '/src/assets/avatars/rahul.svg', xp: 1480, completed: 6, streak: 5, level: 3 },
    { id: 'u4', name: 'Neha Gupta', avatar: '/src/assets/avatars/neha.svg', xp: 1320, completed: 5, streak: 8, level: 3 },
    { id: 'u6', name: 'Vikram Singh', avatar: '/src/assets/avatars/vikram.svg', xp: 1180, completed: 4, streak: 2, level: 3 },
    { id: 'u7', name: 'Anjali Verma', avatar: '/src/assets/avatars/anjali.svg', xp: 1040, completed: 4, streak: 1, level: 3 },
    { id: 'u8', name: 'Rohan Mehta', avatar: '/src/assets/avatars/rohan.svg', xp: 920, completed: 3, streak: 0, level: 2 },
  ],
  'This Month': [
    { id: 'u1', name: 'Aarav Patel', avatar: '/src/assets/avatars/aarav.svg', xp: 790, completed: 4, streak: 11, level: 4 },
    { id: 'u2', name: 'Priya Sharma', avatar: '/src/assets/avatars/priya.svg', xp: 745, completed: 4, streak: 15, level: 4 },
    { id: 'u3', name: 'Rahul Desai', avatar: '/src/assets/avatars/rahul.svg', xp: 690, completed: 3, streak: 5, level: 3 },
    { id: 'u4', name: 'Neha Gupta', avatar: '/src/assets/avatars/neha.svg', xp: 610, completed: 2, streak: 8, level: 3 },
    { id: 'u6', name: 'Vikram Singh', avatar: '/src/assets/avatars/vikram.svg', xp: 540, completed: 2, streak: 2, level: 3 },
    { id: 'u7', name: 'Anjali Verma', avatar: '/src/assets/avatars/anjali.svg', xp: 470, completed: 2, streak: 1, level: 3 },
    { id: 'u8', name: 'Rohan Mehta', avatar: '/src/assets/avatars/rohan.svg', xp: 410, completed: 1, streak: 0, level: 2 },
  ],
  'This Week': [
    { id: 'u1', name: 'Aarav Patel', avatar: '/src/assets/avatars/aarav.svg', xp: 315, completed: 2, streak: 11, level: 4 },
    { id: 'u2', name: 'Priya Sharma', avatar: '/src/assets/avatars/priya.svg', xp: 280, completed: 1, streak: 15, level: 4 },
    { id: 'u3', name: 'Rahul Desai', avatar: '/src/assets/avatars/rahul.svg', xp: 260, completed: 1, streak: 5, level: 3 },
    { id: 'u4', name: 'Neha Gupta', avatar: '/src/assets/avatars/neha.svg', xp: 225, completed: 1, streak: 8, level: 3 },
    { id: 'u6', name: 'Vikram Singh', avatar: '/src/assets/avatars/vikram.svg', xp: 190, completed: 1, streak: 2, level: 3 },
    { id: 'u7', name: 'Anjali Verma', avatar: '/src/assets/avatars/anjali.svg', xp: 165, completed: 1, streak: 1, level: 3 },
    { id: 'u8', name: 'Rohan Mehta', avatar: '/src/assets/avatars/rohan.svg', xp: 120, completed: 0, streak: 0, level: 2 },
  ],
};

export const Leaderboard: React.FC = () => {
  const { user } = useAppContext();
  const [filter, setFilter] = useState<FilterOption>('All Time');

  const finalLeaderboard = useMemo(() => {
    const periodValues: Record<FilterOption, { xp: number; completed: number }> = {
      'All Time': { xp: user.xp, completed: 8 },
      'This Month': { xp: 860, completed: 4 },
      'This Week': { xp: 340, completed: 2 },
    };
    const currentUser = {
      id: 'current-user',
      name: user.name,
      avatar: user.avatar,
      xp: periodValues[filter].xp,
      completed: periodValues[filter].completed,
      streak: user.streak,
      level: user.level,
    };

    return [currentUser, ...leaderboardByFilter[filter]].sort((a, b) => b.xp - a.xp);
  }, [user, filter]);

  const top3 = finalLeaderboard.slice(0, 3);
  const rest = finalLeaderboard.slice(3);
  const filterOptions: FilterOption[] = ['All Time', 'This Month', 'This Week'];

  return (
    <div className="space-y-10 animate-in fade-in duration-500 max-w-5xl mx-auto">
      <div className="text-center space-y-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-gitclub">Community standings</p>
          <h1 className="mt-2 text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">Challenge Leaderboard</h1>
          <p className="mt-2 text-slate-600">See how you rank against other Git Club members.</p>
        </div>

        <div className="inline-flex bg-slate-100 p-1 rounded-lg">
          {filterOptions.map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                'px-4 py-1.5 rounded-md text-sm font-medium transition-colors',
                filter === f ? 'bg-white shadow-sm text-gitclub' : 'text-slate-600 hover:text-slate-900'
              )}
            >
              {f}
            </button>
          ))}
        </div>
        <p className="text-xs text-slate-400">Showing XP earned during {filter.toLowerCase()}.</p>
      </div>

      {/* Podium */}
      <div className="flex flex-col md:flex-row items-end justify-center gap-4 pt-4 pb-2">
        {top3[1] && (
          <div className="w-full md:w-1/4 flex flex-col items-center">
            <div className="relative mb-4">
              <div className="absolute -top-4 -right-4 w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center border-2 border-white shadow-sm z-10"><span className="font-bold text-slate-500 text-xs">2</span></div>
              <img src={top3[1].avatar} className="w-20 h-20 rounded-full border-4 border-white shadow-md bg-slate-100" alt={top3[1].name} />
            </div>
            <h3 className="font-bold text-slate-900 text-center">{top3[1].name}</h3>
            <p className="text-gitclub font-semibold text-sm mb-4">{top3[1].xp} XP</p>
            <div className="w-full h-32 bg-slate-100 rounded-t-2xl border-t-4 border-slate-300 flex items-end justify-center pb-4"><Medal className="w-8 h-8 text-slate-400" /></div>
          </div>
        )}

        {top3[0] && (
          <div className="w-full md:w-1/3 flex flex-col items-center z-10">
            <div className="relative mb-4">
              <div className="absolute -top-5 -right-4 w-10 h-10 bg-amber-400 rounded-full flex items-center justify-center border-2 border-white shadow-sm z-10"><span className="font-bold text-amber-900 text-sm">1</span></div>
              <img src={top3[0].avatar} className="w-28 h-28 rounded-full border-4 border-amber-400 shadow-xl bg-white" alt={top3[0].name} />
            </div>
            <h3 className="font-bold text-xl text-slate-900">{top3[0].name}</h3>
            <p className="text-gitclub font-bold mb-4">{top3[0].xp} XP</p>
            <div className="w-full h-40 bg-amber-50 rounded-t-2xl border-t-4 border-amber-400 flex items-end justify-center pb-4 shadow-lg shadow-amber-500/10"><Trophy className="w-12 h-12 text-amber-500" /></div>
          </div>
        )}

        {top3[2] && (
          <div className="w-full md:w-1/4 flex flex-col items-center">
            <div className="relative mb-4">
              <div className="absolute -top-4 -right-4 w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center border-2 border-white shadow-sm z-10"><span className="font-bold text-amber-800 text-xs">3</span></div>
              <img src={top3[2].avatar} className="w-20 h-20 rounded-full border-4 border-white shadow-md bg-slate-100" alt={top3[2].name} />
            </div>
            <h3 className="font-bold text-slate-900 text-center">{top3[2].name}</h3>
            <p className="text-gitclub font-semibold text-sm mb-4">{top3[2].xp} XP</p>
            <div className="w-full h-24 bg-orange-50 rounded-t-2xl border-t-4 border-orange-200 flex items-end justify-center pb-4"><Award className="w-8 h-8 text-orange-400" /></div>
          </div>
        )}
      </div>

      <Card className="overflow-hidden border-slate-200 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-semibold border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">Rank</th>
                <th className="px-6 py-4">Participant</th>
                <th className="px-6 py-4 text-right">Level</th>
                <th className="px-6 py-4 text-right">Streak</th>
                <th className="px-6 py-4 text-right text-gitclub">XP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rest.map((member, i) => {
                const rank = i + 4;
                const isCurrentUser = member.id === 'current-user';
                return (
                  <tr key={member.id} className={cn('hover:bg-slate-50 transition-colors', isCurrentUser && 'bg-gitclub/5 hover:bg-gitclub/10')}>
                    <td className="px-6 py-4 font-medium text-slate-500">#{rank}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img src={member.avatar} className="w-9 h-9 rounded-full bg-slate-100" alt="" />
                        <div className="flex items-center gap-2">
                          <span className={cn('font-semibold', isCurrentUser ? 'text-gitclub' : 'text-slate-900')}>{member.name}</span>
                          {isCurrentUser && <span className="text-[10px] bg-gitclub text-white px-2 py-0.5 rounded-full uppercase tracking-wider font-bold">You</span>}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right font-medium text-slate-700">Lvl {member.level}</td>
                    <td className="px-6 py-4 text-right font-medium text-orange-600">{member.streak} <span className="text-slate-400 text-xs">days</span></td>
                    <td className="px-6 py-4 text-right font-bold text-slate-900">{member.xp}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
