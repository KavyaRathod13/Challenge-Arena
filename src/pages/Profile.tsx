import React, { useEffect, useState } from 'react';
import { Settings, Shield, Award, Calendar, BookOpen, X, Save } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { Card, CardContent } from '../components/ui/Card';

export const Profile: React.FC = () => {
  const { user, badges, userChallenges, updateUserProfile } = useAppContext();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user.name);
  const [branch, setBranch] = useState(user.branch);

  useEffect(() => {
    setName(user.name);
    setBranch(user.branch);
  }, [user.name, user.branch]);

  useEffect(() => {
    if (!isEditing) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsEditing(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isEditing]);

  const openEditProfile = () => {
    setName(user.name);
    setBranch(user.branch);
    setIsEditing(true);
  };

  const closeEditProfile = () => setIsEditing(false);

  const handleSaveProfile = (event: React.FormEvent) => {
    event.preventDefault();
    if (!name.trim() || !branch.trim()) return;
    updateUserProfile({ name, branch });
    setIsEditing(false);
  };

  const completedCount = Object.values(userChallenges).filter(c => c.status === 'Completed' || c.status === 'Submitted' || c.status === 'Under Review').length;

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      
      {/* Profile Header */}
      <Card className="overflow-hidden border-0 shadow-md">
        <div className="h-32 bg-gradient-to-r from-slate-800 to-slate-700"></div>
        <div className="px-8 pb-8 relative">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="flex items-end gap-6 -mt-12 relative z-10">
              <img 
                src={user.avatar} 
                alt={user.name} 
                className="w-28 h-28 rounded-full border-4 border-white bg-slate-100 shadow-sm"
              />
              <div className="mb-2">
                <h1 className="text-3xl font-bold text-slate-900 leading-tight">{user.name}</h1>
                <p className="text-slate-500 font-medium">{user.branch}</p>
              </div>
            </div>
            
            <button onClick={openEditProfile} className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-gitclub bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded-md transition-colors self-start sm:self-auto mt-4 sm:mt-0">
              <Settings className="w-4 h-4" /> Edit Profile
            </button>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Left Column: Stats */}
        <div className="space-y-8">
          <Card>
            <CardContent className="p-6 space-y-6">
              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Current Status</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 flex items-center gap-2"><Shield className="w-4 h-4" /> Level</span>
                    <span className="font-bold text-slate-900">{user.level}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 flex items-center gap-2"><Award className="w-4 h-4 text-amber-500" /> XP</span>
                    <span className="font-bold text-slate-900">{user.xp}</span>
                  </div>
                </div>
              </div>
              
              <div className="border-t border-slate-100 pt-6">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Activity</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 flex items-center gap-2"><Calendar className="w-4 h-4" /> Streak</span>
                    <span className="font-bold text-orange-600">{user.streak} days</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 flex items-center gap-2"><BookOpen className="w-4 h-4" /> Completed</span>
                    <span className="font-bold text-slate-900">{completedCount}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Badges */}
        <div className="md:col-span-2 space-y-8">
          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-4">Badges & Achievements</h2>
            <Card>
              <CardContent className="p-6">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {badges.map(badge => {
                    const earned = !!badge.earnedAt;
                    return (
                      <div 
                        key={badge.id} 
                        className={`flex flex-col items-center text-center p-4 rounded-xl border ${earned ? 'border-amber-200 bg-amber-50/30' : 'border-slate-100 bg-slate-50 opacity-60 grayscale'}`}
                      >
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${earned ? 'bg-amber-100 text-amber-600' : 'bg-slate-200 text-slate-400'}`}>
                          <Shield className="w-6 h-6" />
                        </div>
                        <h4 className={`font-bold text-sm mb-1 ${earned ? 'text-slate-900' : 'text-slate-500'}`}>{badge.name}</h4>
                        <p className="text-xs text-slate-500">{badge.description}</p>
                        {earned && (
                          <span className="text-[10px] text-amber-600 font-semibold mt-2 uppercase tracking-wide">Earned</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </section>
        </div>

      </div>

      {isEditing && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-[2px]"
          role="dialog"
          aria-modal="true"
          aria-labelledby="edit-profile-title"
          onMouseDown={(event) => { if (event.target === event.currentTarget) closeEditProfile(); }}
        >
          <form onSubmit={handleSaveProfile} className="w-full max-w-md rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
              <div>
                <h2 id="edit-profile-title" className="text-lg font-bold text-slate-900">Edit Profile</h2>
                <p className="text-sm text-slate-500 mt-1">Update the details shown across Challenge Arena.</p>
              </div>
              <button type="button" onClick={closeEditProfile} className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors" aria-label="Close edit profile">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              <div className="flex items-center gap-4 p-3 rounded-xl bg-slate-50 border border-slate-100">
                <img src={user.avatar} alt="Current profile avatar" className="w-14 h-14 rounded-full border-2 border-white shadow-sm bg-white" />
                <div>
                  <p className="text-sm font-semibold text-slate-900">Profile avatar</p>
                  <p className="text-xs text-slate-500 mt-0.5">Your Challenge Arena avatar is managed by the demo profile.</p>
                </div>
              </div>

              <label className="block">
                <span className="block text-sm font-semibold text-slate-700 mb-2">Full name</span>
                <input
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-gitclub focus:ring-2 focus:ring-gitclub/15"
                  placeholder="Your name"
                  autoFocus
                />
              </label>

              <label className="block">
                <span className="block text-sm font-semibold text-slate-700 mb-2">Branch / institution</span>
                <input
                  value={branch}
                  onChange={(event) => setBranch(event.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-gitclub focus:ring-2 focus:ring-gitclub/15"
                  placeholder="Computer Engineering, CHARUSAT"
                />
              </label>
            </div>

            <div className="flex justify-end gap-3 px-6 py-4 bg-slate-50 border-t border-slate-100">
              <button type="button" onClick={closeEditProfile} className="px-4 py-2.5 rounded-lg text-sm font-semibold text-slate-600 hover:bg-white border border-transparent hover:border-slate-200 transition-colors">
                Cancel
              </button>
              <button type="submit" disabled={!name.trim() || !branch.trim()} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-gitclub text-white text-sm font-semibold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity">
                <Save className="w-4 h-4" /> Save Changes
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
