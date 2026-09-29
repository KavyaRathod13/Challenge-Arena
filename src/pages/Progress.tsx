import React from 'react';
import { Link } from 'react-router-dom';
import { PlayCircle, CheckCircle, Star, Flame, Trophy } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { mockChallenges } from '../data/mockData';
import { Card, CardContent } from '../components/ui/Card';
import { Progress as ProgressBar } from '../components/ui/Progress';
import { ChallengeCard } from '../components/ChallengeCard';
import type { UserChallengeStatus } from '../context/AppContext';

export const ProgressPage: React.FC = () => {
  const { user, userChallenges, badges } = useAppContext();

  const getChallengesByStatus = (statuses: UserChallengeStatus[]) =>
    Object.entries(userChallenges)
      .filter(([, data]) => statuses.includes(data.status))
      .map(([id]) => mockChallenges.find(c => c.id === id))
      .filter(Boolean) as (typeof mockChallenges)[number][];

  const inProgress = getChallengesByStatus(['In Progress']);
  const submitted  = getChallengesByStatus(['Submitted', 'Under Review']);
  const completed  = getChallengesByStatus(['Completed']);

  const earnedBadges = badges.filter(b => b.earnedAt);
  const xpToNextLevel = 500 - (user.xp % 500);

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Your Progress</h1>
        <p className="text-slate-600 mt-2">Track your learning journey and achievements.</p>
      </div>

      {/* Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* XP Card */}
        <Card className="bg-gitclub text-white border-0 col-span-2 md:col-span-1">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium opacity-80 mb-1">Level {user.level}</p>
                <h3 className="text-3xl font-bold">
                  {user.xp} <span className="text-lg font-normal opacity-80">XP</span>
                </h3>
              </div>
              <Trophy className="w-8 h-8 opacity-40" />
            </div>
            <div className="mt-4">
              <div className="flex justify-between text-xs font-medium mb-1 opacity-80">
                <span>Next level</span>
                <span>{xpToNextLevel} XP away</span>
              </div>
              <ProgressBar value={(user.xp % 500) / 5} indicatorColor="bg-white" className="bg-white/20 h-1.5" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-3">
              <div className="p-2 bg-orange-100 text-orange-600 rounded-lg">
                <Flame className="w-5 h-5" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-slate-900">{user.streak} <span className="text-sm font-normal text-slate-500">days</span></h3>
            <p className="text-sm text-slate-500 font-medium mt-1">Current Streak</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-3">
              <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg">
                <CheckCircle className="w-5 h-5" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-slate-900">
              {completed.length + submitted.length} <span className="text-sm font-normal text-slate-500">done</span>
            </h3>
            <p className="text-sm text-slate-500 font-medium mt-1">Completed</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-3">
              <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
                <Star className="w-5 h-5" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-slate-900">
              {earnedBadges.length} <span className="text-sm font-normal text-slate-500">earned</span>
            </h3>
            <p className="text-sm text-slate-500 font-medium mt-1">Badges</p>
          </CardContent>
        </Card>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">

          {/* In Progress */}
          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <PlayCircle className="w-5 h-5 text-gitclub" /> In Progress ({inProgress.length})
            </h2>
            {inProgress.length === 0 ? (
              <Card className="bg-slate-50 border-dashed">
                <CardContent className="p-8 text-center text-slate-500 text-sm">
                  No active challenges.{' '}
                  <Link to="/challenges" className="text-gitclub font-medium hover:underline">
                    Start one now.
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {inProgress.map(c => <ChallengeCard key={c.id} challenge={c} compact />)}
              </div>
            )}
          </section>

          {/* Submitted / Completed */}
          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-500" />
              Completed &amp; Under Review ({submitted.length + completed.length})
            </h2>
            {submitted.length + completed.length === 0 ? (
              <Card className="bg-slate-50 border-dashed">
                <CardContent className="p-8 text-center text-slate-500 text-sm">
                  No completed challenges yet. Keep building!
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {[...submitted, ...completed].map(c => <ChallengeCard key={c.id} challenge={c} compact />)}
              </div>
            )}
          </section>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-4">Recent Badges</h2>
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {earnedBadges.slice(0, 4).map(badge => (
                    <div key={badge.id} className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 shrink-0">
                        <Star className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-semibold text-sm text-slate-900">{badge.name}</p>
                        <p className="text-xs text-slate-500">{badge.description}</p>
                      </div>
                    </div>
                  ))}
                  {earnedBadges.length === 0 && (
                    <p className="text-sm text-slate-500 text-center py-4">No badges earned yet. Start building!</p>
                  )}
                  {earnedBadges.length > 0 && (
                    <Link to="/profile" className="text-xs font-semibold text-gitclub hover:underline block text-center pt-2 border-t border-slate-100">
                      View all badges →
                    </Link>
                  )}
                </div>
              </CardContent>
            </Card>
          </section>
        </div>
      </div>
    </div>
  );
};
