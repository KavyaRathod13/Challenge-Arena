import React from 'react';
import { Bookmark, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { mockChallenges } from '../data/mockData';
import { ChallengeCard } from '../components/ChallengeCard';
import { Button } from '../components/ui/Button';

export const Saved: React.FC = () => {
  const { savedChallengeIds } = useAppContext();
  
  const savedChallenges = mockChallenges.filter(c => savedChallengeIds.includes(c.id));

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center gap-3">
        <div className="bg-gitclub/10 p-2.5 rounded-xl">
          <Bookmark className="w-6 h-6 text-gitclub fill-gitclub/20" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Saved Challenges</h1>
          <p className="text-slate-600">Challenges you've bookmarked for later.</p>
        </div>
      </div>

      {savedChallenges.length === 0 ? (
        <div className="text-center py-24 bg-white rounded-2xl border border-dashed border-slate-300">
          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
            <Bookmark className="w-8 h-8 text-slate-300" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">No saved challenges</h3>
          <p className="text-slate-500 mb-6 max-w-md mx-auto">
            You haven't saved any challenges yet. Explore the arena and bookmark interesting projects.
          </p>
          <Link to="/challenges">
            <Button>
              <Search className="w-4 h-4 mr-2" /> Explore Challenges
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedChallenges.map(challenge => (
            <ChallengeCard key={challenge.id} challenge={challenge} />
          ))}
        </div>
      )}
    </div>
  );
};
