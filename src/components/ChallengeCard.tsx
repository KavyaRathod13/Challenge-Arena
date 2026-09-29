import React from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, Clock, Award, ChevronRight } from 'lucide-react';
import type { Challenge } from '../data/mockData';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from './ui/Card';
import { Badge } from './ui/Badge';
import { Progress } from './ui/Progress';
import { useAppContext } from '../context/AppContext';
import { formatDistanceToNow } from 'date-fns';

interface ChallengeCardProps {
  challenge: Challenge;
  compact?: boolean;
}

export const ChallengeCard: React.FC<ChallengeCardProps> = ({ challenge, compact = false }) => {
  const { userChallenges, savedChallengeIds, toggleSaveChallenge } = useAppContext();
  const isSaved      = savedChallengeIds.includes(challenge.id);
  const userStatus   = userChallenges[challenge.id];
  const isDeadlinePast = new Date(challenge.deadline) < new Date();

  const difficultyVariant = (diff: string) => {
    if (diff === 'Easy')   return 'success'  as const;
    if (diff === 'Medium') return 'warning'  as const;
    if (diff === 'Hard')   return 'default'  as const;
    return 'outline' as const;
  };

  const progressColor = () => {
    if (!userStatus) return 'bg-gitclub';
    if (userStatus.status === 'Completed') return 'bg-emerald-500';
    if (userStatus.status === 'Submitted' || userStatus.status === 'Under Review') return 'bg-blue-500';
    return 'bg-gitclub';
  };

  const statusColor = () => {
    if (!userStatus) return '';
    if (userStatus.status === 'Completed') return 'text-emerald-600';
    if (userStatus.status === 'Submitted' || userStatus.status === 'Under Review') return 'text-blue-600';
    return 'text-gitclub';
  };

  return (
    <Card className="flex flex-col hover:border-gitclub/30 hover:shadow-md transition-all group h-full">
      <CardHeader className={compact ? 'p-4 pb-2' : 'p-6 pb-3'}>
        <div className="flex justify-between items-start mb-2">
          <Badge variant={difficultyVariant(challenge.difficulty)} className="font-medium">
            {challenge.difficulty}
          </Badge>
          <button
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleSaveChallenge(challenge.id); }}
            className="text-slate-400 hover:text-gitclub transition-colors"
            aria-label={isSaved ? 'Unsave challenge' : 'Save challenge'}
          >
            <Bookmark className={`w-5 h-5 ${isSaved ? 'fill-gitclub text-gitclub' : ''}`} />
          </button>
        </div>
        <CardTitle className="text-lg group-hover:text-gitclub transition-colors line-clamp-1">
          {challenge.title}
        </CardTitle>
        <p className="text-sm text-slate-500 font-medium">{challenge.category}</p>
      </CardHeader>

      <CardContent className={`${compact ? 'p-4 pt-0' : 'p-6 pt-0'} flex-grow`}>
        {!compact && (
          <p className="text-sm text-slate-600 mb-4 line-clamp-2">{challenge.shortDescription}</p>
        )}

        <div className="flex flex-wrap gap-3 text-sm text-slate-500">
          <div className="flex items-center gap-1.5">
            <Award className="w-4 h-4 text-amber-500" />
            <span className="font-semibold text-slate-700">{challenge.points} XP</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4" />
            <span className={isDeadlinePast ? 'text-red-500 font-medium' : ''}>
              {isDeadlinePast
                ? 'Ended'
                : formatDistanceToNow(new Date(challenge.deadline), { addSuffix: true })}
            </span>
          </div>
        </div>

        {userStatus && (
          <div className="mt-4 space-y-1.5">
            <div className="flex justify-between text-xs font-medium">
              <span className={statusColor()}>{userStatus.status}</span>
              <span className="text-slate-500">{userStatus.progress}%</span>
            </div>
            <Progress value={userStatus.progress} indicatorColor={progressColor()} />
          </div>
        )}
      </CardContent>

      <CardFooter className={compact ? 'p-4 pt-0' : 'p-6 pt-0'}>
        <Link
          to={`/challenge/${challenge.id}`}
          className="w-full flex items-center justify-center gap-2 py-2 text-sm font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 rounded-md transition-colors border border-slate-200"
        >
          {userStatus ? 'View Progress' : 'View Challenge'}
          <ChevronRight className="w-4 h-4" />
        </Link>
      </CardFooter>
    </Card>
  );
};
