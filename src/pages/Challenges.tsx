import React, { useState, useMemo } from 'react';
import { Search, Filter, LayoutGrid, List as ListIcon } from 'lucide-react';
import { mockChallenges } from '../data/mockData';
import { ChallengeCard } from '../components/ChallengeCard';
import { Button } from '../components/ui/Button';

export const Challenges: React.FC = () => {
  const [searchTerm,      setSearchTerm]      = useState('');
  const [categoryFilter,  setCategoryFilter]  = useState('All');
  const [difficultyFilter,setDifficultyFilter]= useState('All');
  const [statusFilter,    setStatusFilter]    = useState('All');
  const [viewMode,        setViewMode]        = useState<'grid' | 'list'>('grid');

  const categories  = ['All', ...Array.from(new Set(mockChallenges.map(c => c.category)))];
  const difficulties= ['All', 'Easy', 'Medium', 'Hard'];
  const statuses    = ['All', 'Active', 'Upcoming', 'Completed'];

  const filteredChallenges = useMemo(() => {
    return mockChallenges.filter(c => {
      const q  = searchTerm.toLowerCase();
      const ms = c.title.toLowerCase().includes(q) || c.shortDescription.toLowerCase().includes(q);
      const mc = categoryFilter   === 'All' || c.category   === categoryFilter;
      const md = difficultyFilter === 'All' || c.difficulty === difficultyFilter;
      const mx = statusFilter     === 'All' || c.status     === statusFilter;
      return ms && mc && md && mx;
    });
  }, [searchTerm, categoryFilter, difficultyFilter, statusFilter]);

  const resetFilters = () => {
    setSearchTerm('');
    setCategoryFilter('All');
    setDifficultyFilter('All');
    setStatusFilter('All');
  };

  const hasActiveFilters = searchTerm || categoryFilter !== 'All' || difficultyFilter !== 'All' || statusFilter !== 'All';

  const gridBtnClass = (active: boolean) =>
    `p-1.5 rounded-md transition-colors ${active ? 'bg-white shadow-sm text-gitclub' : 'text-slate-500 hover:text-slate-900'}`;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Explore Challenges</h1>
        <p className="text-slate-600 mt-2">Find your next project to build and learn from.</p>
      </div>

      {/* Search & Filters */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-4">
        <div className="flex gap-4 items-center">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search challenges by name or tech..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-gitclub/50 focus:border-gitclub"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="hidden sm:flex gap-1 border border-slate-200 rounded-lg p-1 bg-slate-50">
            <button onClick={() => setViewMode('grid')} className={gridBtnClass(viewMode === 'grid')} aria-label="Grid view">
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button onClick={() => setViewMode('list')} className={gridBtnClass(viewMode === 'list')} aria-label="List view">
              <ListIcon className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 text-sm">
            <Filter className="w-4 h-4 text-slate-400" />
            <span className="font-medium text-slate-700">Filters:</span>
          </div>

          {[
            { label: 'All Categories', options: categories,   value: categoryFilter,   set: setCategoryFilter  },
            { label: 'All Difficulties',options: difficulties, value: difficultyFilter, set: setDifficultyFilter },
            { label: 'All Status',      options: statuses,     value: statusFilter,     set: setStatusFilter    },
          ].map(({ label, options, value, set }) => (
            <select
              key={label}
              value={value}
              onChange={e => set(e.target.value)}
              className="text-sm bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-gitclub/50"
            >
              {options.map(o => (
                <option key={o} value={o}>{o === 'All' ? label : o}</option>
              ))}
            </select>
          ))}

          {hasActiveFilters && (
            <button onClick={resetFilters} className="text-sm text-gitclub hover:underline ml-auto">
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* Results */}
      <div>
        <p className="text-sm text-slate-500 mb-4">{filteredChallenges.length} challenges available</p>

        {filteredChallenges.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-dashed border-slate-300">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">No challenges found</h3>
            <p className="text-slate-500 mb-6 max-w-md mx-auto">
              We couldn't find any challenges matching your filters. Try adjusting your search criteria.
            </p>
            <Button onClick={resetFilters} variant="outline">Clear all filters</Button>
          </div>
        ) : (
          <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
            {filteredChallenges.map(c => (
              <ChallengeCard key={c.id} challenge={c} compact={viewMode === 'list'} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
