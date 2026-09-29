import type { Challenge } from '../data/mockData';


export const createChallengeCalendarFile = (challenge: Challenge) => {
  const deadline = new Date(challenge.deadline);
  // Open a pre-filled Google Calendar event directly in a new tab.
  // The student only needs to review it and press Save.
  const start = new Date(deadline.getTime() - 60 * 60 * 1000);
  const siteUrl = typeof window !== 'undefined' ? window.location.origin : '';

  const formatGoogleDate = (date: Date) =>
    date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');

  const title = `Git Club Challenge Deadline: ${challenge.title}`;
  const details = [
    challenge.shortDescription,
    '',
    `${challenge.points} XP • ${challenge.difficulty} • ${challenge.estimatedTime}`,
    siteUrl ? `Open Challenge Arena: ${siteUrl}/challenge/${challenge.id}` : '',
  ].filter(Boolean).join('\n');

  const googleCalendarUrl = new URL('https://calendar.google.com/calendar/render');
  googleCalendarUrl.searchParams.set('action', 'TEMPLATE');
  googleCalendarUrl.searchParams.set('text', title);
  googleCalendarUrl.searchParams.set('dates', `${formatGoogleDate(start)}/${formatGoogleDate(deadline)}`);
  googleCalendarUrl.searchParams.set('details', details);
  googleCalendarUrl.searchParams.set('location', 'Git Club Challenge Arena');

  window.open(googleCalendarUrl.toString(), '_blank', 'noopener,noreferrer');
};
