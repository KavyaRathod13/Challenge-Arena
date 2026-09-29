import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Clock, Award, Bookmark, Play, CheckCircle, Upload, Check, Zap, ChevronRight, Calendar } from 'lucide-react';
import { mockChallenges } from '../data/mockData';
import { useAppContext } from '../context/AppContext';
import { useToast } from '../context/ToastContext';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Card, CardContent } from '../components/ui/Card';
import { Progress } from '../components/ui/Progress';
import { SubmitModal } from '../components/SubmitModal';
import { cn } from '../utils/cn';
import { createChallengeCalendarFile } from '../utils/calendar';

export const ChallengeDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { userChallenges, savedChallengeIds, toggleSaveChallenge, startChallenge } = useAppContext();
  const { addToast } = useToast();
  const [submitModalOpen, setSubmitModalOpen] = useState(false);

  const challenge = mockChallenges.find(c => c.id === id);

  if (!challenge) {
    return (
      <div className="text-center py-24 max-w-md mx-auto">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-3xl">🔍</span>
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Challenge not found</h2>
        <p className="text-slate-500 mb-6">The challenge you're looking for doesn't exist or has been removed.</p>
        <Button onClick={() => navigate('/challenges')}>
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Challenges
        </Button>
      </div>
    );
  }

  const isSaved    = savedChallengeIds.includes(challenge.id);
  const userStatus = userChallenges[challenge.id];
  const isDeadlinePast = new Date(challenge.deadline) < new Date();
  const daysLeft = Math.ceil((new Date(challenge.deadline).getTime() - Date.now()) / 86400000);

  const handleStart = () => {
    startChallenge(challenge.id);
    addToast(`Started "${challenge.title}". Good luck!`, 'success');
  };

  const handleToggleSave = () => {
    toggleSaveChallenge(challenge.id);
    addToast(isSaved ? 'Removed from saved challenges' : 'Challenge saved to bookmarks', 'info');
  };

  const ctaButton = () => {
    if (!userStatus) {
      return (
        <Button size="lg" className="w-full" onClick={handleStart}>
          <Play className="w-4 h-4 mr-2" /> Start Challenge
        </Button>
      );
    }
    if (userStatus.status === 'In Progress') {
      return (
        <Button size="lg" className="w-full" onClick={() => setSubmitModalOpen(true)}>
          <Upload className="w-4 h-4 mr-2" /> Submit Your Work
        </Button>
      );
    }
    return (
      <div className={cn(
        'w-full h-11 flex items-center justify-center gap-2 rounded-md text-sm font-semibold border',
        userStatus.status === 'Completed'
          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
          : 'bg-blue-50 text-blue-700 border-blue-200'
      )}>
        <Check className="w-4 h-4" /> {userStatus.status}
      </div>
    );
  };

  const diffColor = challenge.difficulty === 'Easy' ? 'success' : challenge.difficulty === 'Medium' ? 'warning' : 'default';

  return (
    <div className="max-w-5xl mx-auto space-y-6">

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-slate-500">
        <Link to="/challenges" className="hover:text-gitclub transition-colors font-medium">Challenges</Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-slate-900 font-medium truncate">{challenge.title}</span>
      </div>

      {/* Hero Header */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-card overflow-hidden">
        {/* Accent top bar */}
        <div className="h-1.5 bg-gradient-to-r from-gitclub to-gitclub-dark" />

        <div className="p-7 md:p-10">
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-8">
            {/* Info */}
            <div className="space-y-4 flex-1 max-w-2xl">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="text-xs font-bold uppercase tracking-wider text-gitclub bg-gitclub/8 px-2.5 py-1 rounded-full">
                  {challenge.category}
                </span>
                <Badge variant={diffColor}>{challenge.difficulty}</Badge>
                {challenge.status === 'Upcoming' && (
                  <Badge variant="purple">Upcoming</Badge>
                )}
                {challenge.status === 'Completed' && (
                  <Badge variant="outline">Ended</Badge>
                )}
              </div>

              <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 leading-tight">
                {challenge.title}
              </h1>
              <p className="text-lg text-slate-600 leading-relaxed">{challenge.shortDescription}</p>

              <div className="flex flex-wrap items-center gap-5 pt-1 text-sm">
                <div className="flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-amber-500" />
                  <span className="font-bold text-slate-900">{challenge.points} XP</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-slate-400" />
                  <span className={cn('font-medium', isDeadlinePast ? 'text-red-500' : daysLeft <= 2 ? 'text-amber-600' : 'text-slate-700')}>
                    {isDeadlinePast
                      ? 'Deadline passed'
                      : daysLeft <= 1
                        ? daysLeft === 0 ? 'Due today' : 'Due tomorrow'
                        : `${daysLeft} days left`}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-slate-400" />
                  <span className="font-medium text-slate-700">{challenge.estimatedTime}</span>
                </div>
              </div>
            </div>

            {/* CTA sidebar */}
            <div className="flex flex-col gap-3 w-full lg:w-56 shrink-0">
              {ctaButton()}
              <Button
                variant="outline"
                className={cn('w-full', isSaved ? 'text-gitclub border-gitclub/40 bg-gitclub/5' : '')}
                onClick={handleToggleSave}
              >
                <Bookmark className={cn('w-4 h-4 mr-2', isSaved ? 'fill-gitclub' : '')} />
                {isSaved ? 'Saved' : 'Save for Later'}
              </Button>
              {!isDeadlinePast && (
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    createChallengeCalendarFile(challenge);
                    addToast('Challenge deadline added to your calendar.', 'success');
                  }}
                >
                  <Calendar className="w-4 h-4 mr-2" /> Add to Calendar
                </Button>
              )}

              {/* Quick info card */}
              <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 text-sm space-y-3 mt-1">
                <div className="flex justify-between">
                  <span className="text-slate-500">Deadline</span>
                  <span className="font-medium text-slate-900">{new Date(challenge.deadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Est. Time</span>
                  <span className="font-medium text-slate-900">{challenge.estimatedTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Reward</span>
                  <span className="font-bold text-amber-600">{challenge.points} XP</span>
                </div>
              </div>
            </div>
          </div>

          {/* Progress bar */}
          {userStatus && (
            <div className="mt-8 pt-6 border-t border-slate-100">
              <div className="flex justify-between text-sm font-medium mb-2">
                <span className="text-slate-700">Your Progress</span>
                <span className="text-gitclub">{userStatus.progress}%</span>
              </div>
              <Progress value={userStatus.progress} className="h-2" />
            </div>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardContent className="p-7">
              <h2 className="text-xl font-bold text-slate-900 mb-4">Problem Statement</h2>
              <p className="text-slate-600 leading-relaxed">{challenge.problemDescription}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-7">
              <h2 className="text-xl font-bold text-slate-900 mb-4">Objective</h2>
              <p className="text-slate-600 leading-relaxed">{challenge.objective}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-7">
              <h2 className="text-xl font-bold text-slate-900 mb-5">Requirements</h2>
              <ul className="space-y-3.5">
                {challenge.requirements.map((req, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                    <span className="text-slate-700">{req}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          <Card>
            <CardContent className="p-5">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Technologies</h3>
              <div className="flex flex-wrap gap-2">
                {challenge.technologies.map(tech => (
                  <Badge key={tech} variant="outline" className="bg-slate-50 font-medium">{tech}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-5">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Rules</h3>
              <ol className="space-y-2 text-sm text-slate-600 list-decimal list-inside">
                {challenge.rules.map((rule, i) => (
                  <li key={i} className="leading-relaxed">{rule}</li>
                ))}
              </ol>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-5">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Evaluation Criteria</h3>
              <ul className="space-y-2 text-sm text-slate-600">
                {challenge.evaluationCriteria.map((crit, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-gitclub mt-1.5 shrink-0" />
                    <span>{crit}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="border-gitclub/20 bg-gitclub/3">
            <CardContent className="p-5">
              <h3 className="text-xs font-bold text-gitclub uppercase tracking-wider mb-2">Submission Details</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{challenge.submissionInstructions}</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {submitModalOpen && (
        <SubmitModal challengeId={challenge.id} onClose={() => setSubmitModalOpen(false)} />
      )}
    </div>
  );
};
