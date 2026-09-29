import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Calendar,
  ChevronRight,
  Clock,
  Flame,
  Sparkles,
  Target,
  Trophy,
  TrendingUp,
  Users,
  Zap,
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { mockChallenges } from '../data/mockData';
import { ChallengeCard } from '../components/ChallengeCard';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Progress } from '../components/ui/Progress';
import { formatDistanceToNow } from 'date-fns';
import { createChallengeCalendarFile } from '../utils/calendar';

const CountdownTimer: React.FC<{ deadline: string }> = ({ deadline }) => {
  const getRemaining = () => Math.max(0, new Date(deadline).getTime() - Date.now());
  const [remaining, setRemaining] = useState(getRemaining);

  useEffect(() => {
    const interval = window.setInterval(() => setRemaining(getRemaining()), 1000);
    return () => window.clearInterval(interval);
  }, [deadline]);

  if (remaining <= 0) {
    return (
      <span className="text-[11px] font-bold text-slate-500" role="status">
        Deadline reached
      </span>
    );
  }

  const totalSeconds = Math.floor(remaining / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const pad = (value: number) => String(value).padStart(2, '0');

  return (
    <div
      className="mt-2 inline-flex items-center gap-1.5 rounded-lg border border-gitclub/15 bg-gitclub/5 px-2.5 py-1.5 text-gitclub"
      role="timer"
      aria-label={`${days} days, ${hours} hours, ${minutes} minutes and ${seconds} seconds remaining`}
    >
      <Clock className="h-3.5 w-3.5 shrink-0" />
      <span className="font-mono text-xs font-extrabold tracking-tight">
        {pad(days)}:{pad(hours)}:{pad(minutes)}:{pad(seconds)}
      </span>
      <span className="text-[9px] font-bold uppercase tracking-wide text-gitclub/70">D H M S</span>
    </div>
  );
};

export const Home: React.FC = () => {
  const { user, userChallenges, badges } = useAppContext();

  const activeChallenges = mockChallenges.filter(c => userChallenges[c.id]?.status === 'In Progress');
  const earnedBadges = badges.filter(b => b.earnedAt);

  const upcomingDeadlines = mockChallenges
    .filter(c => new Date(c.deadline) > new Date() && c.status === 'Active')
    .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
    .slice(0, 3);

  const recommendedChallenges = mockChallenges
    .filter(c => !userChallenges[c.id] && c.status === 'Active')
    .slice(0, 3);

  const featuredChallenge = mockChallenges.find(c => c.id === 'c12');
  const xpProgress = ((user.xp % 500) / 500) * 100;
  const xpToNextLevel = 500 - (user.xp % 500);
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      {/* Hero / first impression */}
      <section className="relative overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-card">
        <div className="absolute inset-y-0 right-0 w-[42%] bg-[radial-gradient(circle_at_70%_30%,rgba(232,67,26,0.14),transparent_58%)] pointer-events-none" />
        <div className="absolute right-8 top-8 hidden lg:block h-40 w-40 rounded-full border border-gitclub/10" />
        <div className="absolute right-20 top-20 hidden lg:block h-24 w-24 rounded-full border border-gitclub/10" />

        <div className="relative grid lg:grid-cols-[1.35fr_0.65fr] gap-8 p-7 md:p-10 lg:p-11">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-gitclub-light px-3 py-1.5 text-xs font-bold uppercase tracking-[0.12em] text-gitclub">
              <Sparkles className="h-3.5 w-3.5" /> Challenge Arena
            </div>
            <p className="mt-5 text-sm font-medium text-slate-500">
              {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
            </p>
            <h1 className="mt-1.5 text-4xl md:text-5xl font-extrabold tracking-[-0.035em] text-slate-950">
              {greeting}, {user.name.split(' ')[0]}.
            </h1>
            <p className="mt-4 max-w-xl text-base md:text-lg leading-7 text-slate-600">
              Turn your ideas into working projects. Pick a challenge, build it, and show what you can do.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link to="/challenges">
                <Button className="h-11 px-5 font-bold shadow-sm">
                  Explore Challenges <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              {activeChallenges[0] && (
                <Link to={`/challenge/${activeChallenges[0].id}`}>
                  <Button variant="outline" className="h-11 px-5 font-semibold bg-white">
                    Continue Building
                  </Button>
                </Link>
              )}
            </div>
          </div>

          <div className="flex items-end lg:justify-end">
            <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-slate-50/90 p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500">Your Arena Status</p>
                  <p className="mt-1 text-lg font-extrabold text-slate-900">Level {user.level}</p>
                </div>
                <div className="h-10 w-10 rounded-xl bg-gitclub-light flex items-center justify-center text-gitclub">
                  <Zap className="h-5 w-5" />
                </div>
              </div>
              <div className="mt-5">
                <div className="flex justify-between text-xs font-semibold text-slate-500">
                  <span>{user.xp} XP</span>
                  <span>{xpToNextLevel} XP to next</span>
                </div>
                <Progress value={xpProgress} className="mt-2 h-2.5" />
              </div>
              <div className="mt-5 grid grid-cols-3 gap-2 border-t border-slate-200 pt-4">
                <div>
                  <p className="text-lg font-extrabold text-slate-900">{activeChallenges.length}</p>
                  <p className="text-[11px] text-slate-500">Active</p>
                </div>
                <div>
                  <p className="text-lg font-extrabold text-slate-900">{earnedBadges.length}</p>
                  <p className="text-[11px] text-slate-500">Badges</p>
                </div>
                <div>
                  <p className="text-lg font-extrabold text-slate-900">{user.streak}</p>
                  <p className="text-[11px] text-slate-500">Day streak</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick overview */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-slate-200 shadow-card">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="h-11 w-11 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center"><Flame className="h-5 w-5" /></div>
            <div><p className="text-xs font-bold uppercase tracking-wider text-slate-400">Streak</p><p className="text-xl font-extrabold text-slate-900">{user.streak} days</p></div>
          </CardContent>
        </Card>
        <Card className="border-slate-200 shadow-card">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="h-11 w-11 rounded-xl bg-gitclub-light text-gitclub flex items-center justify-center"><Target className="h-5 w-5" /></div>
            <div><p className="text-xs font-bold uppercase tracking-wider text-slate-400">Challenges</p><p className="text-xl font-extrabold text-slate-900">{activeChallenges.length} active</p></div>
          </CardContent>
        </Card>
        <Card className="border-slate-200 shadow-card">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="h-11 w-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center"><Trophy className="h-5 w-5" /></div>
            <div><p className="text-xs font-bold uppercase tracking-wider text-slate-400">Experience</p><p className="text-xl font-extrabold text-slate-900">{user.xp} XP</p></div>
          </CardContent>
        </Card>
      </section>

      {/* Continue + deadlines */}
      <div className="grid grid-cols-1 xl:grid-cols-[1.55fr_0.75fr] gap-8">
        <section>
          <div className="flex items-end justify-between mb-4">
            <div><p className="text-xs font-bold uppercase tracking-[0.14em] text-gitclub">Keep building</p><h2 className="mt-1 text-2xl font-extrabold text-slate-900">Continue Your Challenges</h2></div>
            <Link to="/progress" className="hidden sm:flex text-sm font-semibold text-gitclub hover:underline items-center gap-0.5">View progress <ChevronRight className="w-4 h-4" /></Link>
          </div>
          {activeChallenges.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {activeChallenges.slice(0, 2).map(c => <ChallengeCard key={c.id} challenge={c} compact />)}
            </div>
          ) : (
            <Card><CardContent className="p-8 text-center"><Target className="mx-auto h-8 w-8 text-slate-300" /><p className="mt-3 font-bold text-slate-900">No active challenges</p><p className="mt-1 text-sm text-slate-500">Choose something new and start building.</p></CardContent></Card>
          )}
        </section>

        <section>
          <div className="flex items-end justify-between mb-4">
            <div><p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">Stay on track</p><h2 className="mt-1 text-2xl font-extrabold text-slate-900">Upcoming</h2></div>
          </div>
          <Card className="h-full">
            <CardContent className="p-5">
              <div className="space-y-1">
                {upcomingDeadlines.map((challenge) => (
                  <div key={challenge.id} className="group flex gap-3 p-3 -mx-2 rounded-xl hover:bg-slate-50 transition-colors">
                    <Link to={`/challenge/${challenge.id}`} className="mt-0.5 h-9 w-9 rounded-lg bg-slate-100 text-slate-500 flex items-center justify-center shrink-0" aria-label={`Open ${challenge.title}`}>
                      <Calendar className="h-4 w-4" />
                    </Link>
                    <div className="min-w-0 flex-1">
                      <Link to={`/challenge/${challenge.id}`} className="block">
                        <p className="font-bold text-sm text-slate-900 truncate group-hover:text-gitclub">{challenge.title}</p>
                        <p className="mt-1 text-xs text-slate-500 flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> Deadline {new Date(challenge.deadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</p>
                        <CountdownTimer deadline={challenge.deadline} />
                      </Link>
                    </div>
                    <div className="flex flex-col items-end gap-1.5 shrink-0">
                      <span className="text-xs font-bold text-slate-400">{challenge.points} XP</span>
                      <button
                        type="button"
                        onClick={() => createChallengeCalendarFile(challenge)}
                        className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white px-2 py-1 text-[11px] font-semibold text-slate-600 hover:border-gitclub/30 hover:text-gitclub hover:bg-gitclub/5 transition-colors"
                        title="Add deadline to your calendar"
                      >
                        <Calendar className="h-3.5 w-3.5" /> Add to calendar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <Link to="/challenges" className="mt-3 pt-4 border-t border-slate-100 flex items-center justify-between text-sm font-semibold text-gitclub">See all challenges <ArrowRight className="h-4 w-4" /></Link>
            </CardContent>
          </Card>
        </section>
      </div>

      {/* Featured */}
      {featuredChallenge && (
        <section>
          <div className="flex items-end justify-between mb-4">
            <div><p className="text-xs font-bold uppercase tracking-[0.14em] text-gitclub">Featured this week</p><h2 className="mt-1 text-2xl font-extrabold text-slate-900">A challenge worth building</h2></div>
            <Link to="/challenges" className="hidden sm:flex text-sm font-semibold text-gitclub hover:underline items-center gap-0.5">Explore all <ChevronRight className="w-4 h-4" /></Link>
          </div>
          <Card className="overflow-hidden border-slate-800 bg-slate-950 text-white shadow-lg">
            <CardContent className="p-0">
              <div className="grid lg:grid-cols-[1.4fr_0.6fr]">
                <div className="p-7 md:p-9">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-white bg-gitclub px-2.5 py-1 rounded">{featuredChallenge.category}</span>
                    <span className="text-xs font-semibold text-slate-400">{featuredChallenge.difficulty}</span>
                  </div>
                  <h3 className="mt-4 text-2xl md:text-3xl font-extrabold tracking-tight">{featuredChallenge.title}</h3>
                  <p className="mt-3 max-w-2xl text-sm md:text-base leading-6 text-slate-300">{featuredChallenge.shortDescription}</p>
                  <div className="mt-6 flex flex-wrap gap-4 text-sm">
                    <span className="flex items-center gap-1.5 text-amber-400 font-bold"><Trophy className="h-4 w-4" /> {featuredChallenge.points} XP</span>
                    <span className="flex items-center gap-1.5 text-slate-400"><Clock className="h-4 w-4" /> {featuredChallenge.estimatedTime}</span>
                    <span className="flex items-center gap-1.5 text-slate-400"><Calendar className="h-4 w-4" /> {formatDistanceToNow(new Date(featuredChallenge.deadline), { addSuffix: true })}</span>
                  </div>
                </div>
                <div className="border-t lg:border-t-0 lg:border-l border-white/10 p-7 md:p-9 flex items-end">
                  <Link to={`/challenge/${featuredChallenge.id}`} className="w-full">
                    <Button className="w-full h-12 bg-white text-slate-950 hover:bg-slate-100 font-bold">View Challenge <ArrowRight className="ml-2 h-4 w-4" /></Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      )}

      {/* Recommended + community */}
      <div className="grid grid-cols-1 xl:grid-cols-[1.6fr_0.7fr] gap-8">
        {recommendedChallenges.length > 0 && (
          <section>
            <div className="flex items-end justify-between mb-4">
              <div><p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">Picked for you</p><h2 className="mt-1 text-2xl font-extrabold text-slate-900">Recommended Challenges</h2></div>
              <Link to="/challenges" className="text-sm font-semibold text-gitclub hover:underline flex items-center gap-0.5">See all <ChevronRight className="w-4 h-4" /></Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {recommendedChallenges.map(c => <ChallengeCard key={c.id} challenge={c} compact />)}
            </div>
          </section>
        )}

        <Card className="self-start">
          <CardContent className="p-6">
            <div className="flex items-center gap-3"><div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600"><Users className="h-5 w-5" /></div><div><p className="text-xs font-bold uppercase tracking-wider text-slate-400">Community</p><h3 className="font-extrabold text-slate-900">Build with the club</h3></div></div>
            <p className="mt-4 text-sm leading-6 text-slate-600">See where you stand, learn from other builders, and keep your streak moving.</p>
            <Link to="/leaderboard" className="mt-5 flex items-center justify-between text-sm font-bold text-gitclub">Open leaderboard <ArrowRight className="h-4 w-4" /></Link>
            <div className="mt-5 border-t border-slate-100 pt-4 flex items-center gap-2 text-xs text-slate-500"><TrendingUp className="h-4 w-4 text-gitclub" /> Your next milestone is {xpToNextLevel} XP away.</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
