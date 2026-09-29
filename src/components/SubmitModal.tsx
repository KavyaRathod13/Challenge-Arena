import React, { useState } from 'react';
import { X, CheckCircle, GitBranch, Globe } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { useToast } from '../context/ToastContext';
import { Button } from './ui/Button';

interface Props {
  challengeId: string;
  onClose: () => void;
}

export const SubmitModal: React.FC<Props> = ({ challengeId, onClose }) => {
  const { submitChallenge } = useAppContext();
  const { addToast } = useToast();
  const [repo,  setRepo]  = useState('');
  const [demo,  setDemo]  = useState('');
  const [notes, setNotes] = useState('');
  const [checks, setChecks] = useState({ reqs: false, ready: false });
  const [submitted, setSubmitted] = useState(false);

  const isValid = repo.trim().length > 8 && demo.trim().length > 8 && checks.reqs && checks.ready;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;
    submitChallenge(challengeId, repo, demo, notes);
    setSubmitted(true);
    addToast('Submission received! Great work 🎉', 'success');
  };

  const handleClose = () => onClose();

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="submit-modal-title"
    >
      <div className="bg-white rounded-2xl shadow-modal w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh] animate-slide-up">

        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100">
          <h2 id="submit-modal-title" className="text-lg font-bold text-slate-900">
            {submitted ? 'Submission Received' : 'Submit Your Work'}
          </h2>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Confirmation state */}
        {submitted ? (
          <div className="p-8 text-center flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center">
              <CheckCircle className="w-9 h-9 text-emerald-500" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">You're all set!</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Your challenge submission has been received.<br />
                It's now <span className="font-semibold text-blue-600">Under Review</span>.
                We'll update your status soon.
              </p>
            </div>
            <div className="bg-slate-50 rounded-xl p-4 w-full text-left text-sm space-y-2 border border-slate-100">
              <div className="flex justify-between">
                <span className="text-slate-500">Repository</span>
                <a href={repo} className="text-gitclub font-medium truncate max-w-[60%] hover:underline" target="_blank" rel="noreferrer">{repo}</a>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Live Demo</span>
                <a href={demo} className="text-gitclub font-medium truncate max-w-[60%] hover:underline" target="_blank" rel="noreferrer">{demo}</a>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Status</span>
                <span className="font-semibold text-blue-600">Under Review</span>
              </div>
            </div>
            <Button onClick={handleClose} className="w-full">Done</Button>
          </div>
        ) : (
          <>
            {/* Form */}
            <div className="overflow-y-auto flex-1">
              <form id="submit-form" onSubmit={handleSubmit} className="p-6 space-y-5">
                <div>
                  <label htmlFor="repo-url" className="block text-sm font-semibold text-slate-700 mb-1.5">
                    Repository URL <span className="text-gitclub">*</span>
                  </label>
                  <div className="relative">
                    <GitBranch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      id="repo-url"
                      type="url"
                      required
                      placeholder="https://github.com/username/repo"
                      value={repo}
                      onChange={e => setRepo(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-gitclub/40 focus:border-gitclub transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="demo-url" className="block text-sm font-semibold text-slate-700 mb-1.5">
                    Live Demo URL <span className="text-gitclub">*</span>
                  </label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      id="demo-url"
                      type="url"
                      required
                      placeholder="https://your-project.vercel.app"
                      value={demo}
                      onChange={e => setDemo(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-gitclub/40 focus:border-gitclub transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="notes" className="block text-sm font-semibold text-slate-700 mb-1.5">
                    Submission Notes <span className="text-slate-400 font-normal">(optional)</span>
                  </label>
                  <textarea
                    id="notes"
                    placeholder="What did you build? Any key features, challenges overcome, or notes for the reviewer?"
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    rows={3}
                    className="w-full p-3 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-gitclub/40 focus:border-gitclub resize-y transition-colors"
                  />
                </div>

                {/* Checklist */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <h3 className="font-semibold text-xs text-slate-700 mb-3 uppercase tracking-wider">Pre-submission Checklist</h3>
                  <div className="space-y-2.5 text-sm">
                    {[
                      { label: 'Repository link added',  checked: repo.trim().length > 8, readOnly: true  },
                      { label: 'Live demo URL added',    checked: demo.trim().length > 8, readOnly: true  },
                      { label: 'I have met all challenge requirements',   checked: checks.reqs,  readOnly: false, key: 'reqs'  },
                      { label: 'My final submission is ready for review', checked: checks.ready, readOnly: false, key: 'ready' },
                    ].map(item => (
                      <label key={item.label} className={`flex items-center gap-3 ${item.readOnly ? '' : 'cursor-pointer'}`}>
                        <input
                          type="checkbox"
                          checked={item.checked}
                          readOnly={item.readOnly}
                          onChange={item.readOnly ? undefined : e => {
                            if (item.key) setChecks(c => ({ ...c, [item.key]: e.target.checked }));
                          }}
                          className="w-4 h-4 rounded text-gitclub border-slate-300 focus:ring-gitclub"
                        />
                        <span className={item.checked ? 'text-slate-700' : 'text-slate-500'}>{item.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </form>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/80 flex justify-end gap-3">
              <Button type="button" variant="ghost" onClick={handleClose}>Cancel</Button>
              <Button type="submit" form="submit-form" disabled={!isValid}>
                <CheckCircle className="w-4 h-4 mr-2" /> Submit Challenge
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
