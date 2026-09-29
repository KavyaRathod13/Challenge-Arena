export type Difficulty = 'Easy' | 'Medium' | 'Hard';
export type ChallengeStatus = 'Active' | 'Upcoming' | 'Completed';
export type UserChallengeStatus = 'Not Started' | 'In Progress' | 'Submitted' | 'Under Review' | 'Completed';

export interface Challenge {
  id: string;
  title: string;
  shortDescription: string;
  category: string;
  difficulty: Difficulty;
  points: number;
  deadline: string; // ISO date string
  estimatedTime: string;
  problemDescription: string;
  objective: string;
  requirements: string[];
  rules: string[];
  evaluationCriteria: string[];
  technologies: string[];
  submissionInstructions: string;
  status: ChallengeStatus;
}

export const mockChallenges: Challenge[] = [
  {
    id: 'c1',
    title: 'Campus Event Finder',
    shortDescription: 'Build a responsive web app to find and filter campus events.',
    category: 'Web Development',
    difficulty: 'Medium',
    points: 500,
    deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days from now
    estimatedTime: '4-6 hours',
    problemDescription: 'Students often miss out on campus events because information is scattered across different notice boards and social media groups.',
    objective: 'Create a centralized platform where students can easily discover, search, and filter upcoming campus events.',
    requirements: [
      'Responsive interface for mobile and desktop',
      'Search functionality by event name',
      'Event filtering by category and date',
      'Detailed event page with time, location, and description'
    ],
    rules: [
      'Must be built from scratch for this challenge',
      'All UI components must be accessible',
      'Use mock data for events (no real backend required)'
    ],
    evaluationCriteria: [
      'Functionality: Does it meet all requirements?',
      'UI/UX: Is the interface clean and intuitive?',
      'Code Quality: Is the code well-organized and commented?',
      'Responsiveness: Does it work well on all screen sizes?'
    ],
    technologies: ['React', 'Tailwind CSS', 'Vite'],
    submissionInstructions: 'Submit a GitHub repository URL and a live demo link (Vercel, Netlify, or GitHub Pages).',
    status: 'Active'
  },
  {
    id: 'c2',
    title: 'AI Resume Reviewer',
    shortDescription: 'Create a tool that simulates AI feedback on student resumes.',
    category: 'AI/ML',
    difficulty: 'Hard',
    points: 800,
    deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    estimatedTime: '8-10 hours',
    problemDescription: 'Students struggle to format their resumes effectively for ATS (Applicant Tracking Systems) and recruiter reviews.',
    objective: 'Build an interface where users can paste their resume text and receive simulated actionable feedback.',
    requirements: [
      'Text input area for resume content',
      'Simulated "analysis" loading state',
      'Categorized feedback (Impact, Brevity, Style)',
      'Overall score out of 100'
    ],
    rules: [
      'Feedback generation can be mocked with pre-defined rules based on keywords',
      'Focus heavily on the user experience of receiving feedback'
    ],
    evaluationCriteria: [
      'UI/UX: How clear is the feedback presentation?',
      'Problem Solving: How creative is the simulated feedback logic?',
      'Completeness: Are all edge cases handled?'
    ],
    technologies: ['JavaScript', 'CSS', 'HTML'],
    submissionInstructions: 'Submit a repository link and live demo URL.',
    status: 'Active'
  },
  {
    id: 'c3',
    title: 'Student Productivity Dashboard',
    shortDescription: 'Design a dashboard to track study hours and tasks.',
    category: 'UI/UX',
    difficulty: 'Easy',
    points: 300,
    deadline: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
    estimatedTime: '2-3 hours',
    problemDescription: 'Managing time across different courses, assignments, and clubs is overwhelming.',
    objective: 'Design a single-page dashboard that gives students a clear overview of their week.',
    requirements: [
      'Task list with check-off functionality',
      'Study time tracker (visual only, e.g., a chart)',
      'Upcoming deadlines section',
      'Clean, distraction-free visual design'
    ],
    rules: [
      'Use a consistent color palette',
      'Prioritize typography and spacing over complex graphics'
    ],
    evaluationCriteria: [
      'Visual Design: Is it aesthetically pleasing?',
      'Usability: Can a user understand it in 5 seconds?',
      'Accessibility: Are contrast ratios sufficient?'
    ],
    technologies: ['Figma', 'React', 'CSS'],
    submissionInstructions: 'Submit Figma link or live code demo.',
    status: 'Active'
  },
  {
    id: 'c4',
    title: 'Accessibility Checker',
    shortDescription: 'Build a small script to audit basic web accessibility.',
    category: 'Web Development',
    difficulty: 'Medium',
    points: 400,
    deadline: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // Past deadline
    estimatedTime: '4 hours',
    problemDescription: 'Many student projects ignore accessibility, making them unusable for some people.',
    objective: 'Write a script that takes a DOM node and checks for missing alt tags and aria labels.',
    requirements: [
      'Check for missing alt attributes on images',
      'Check for buttons without text or aria-labels',
      'Generate a summary report in the console or UI'
    ],
    rules: [
      'No third-party accessibility libraries allowed'
    ],
    evaluationCriteria: [
      'Accuracy: Does it correctly identify issues?',
      'Code Quality: Is the logic sound?'
    ],
    technologies: ['JavaScript', 'DOM API'],
    submissionInstructions: 'Submit a CodeSandbox or GitHub repo link.',
    status: 'Completed'
  },
  {
    id: 'c5',
    title: 'Campus Navigation App',
    shortDescription: 'Create a mobile-first interface for campus maps.',
    category: 'App Development',
    difficulty: 'Medium',
    points: 600,
    deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    estimatedTime: '6-8 hours',
    problemDescription: 'Freshers often get lost finding specific labs or lecture halls.',
    objective: 'Build a mobile-friendly web app that displays a campus map with search functionality for rooms.',
    requirements: [
      'Mobile-first responsive design',
      'Search bar with autocomplete for room names',
      'Interactive map area (can be static image with overlay markers)'
    ],
    rules: [
      'Must work well on small screens (320px width)'
    ],
    evaluationCriteria: [
      'Mobile UX: Are tap targets large enough?',
      'Performance: Does the map load quickly?'
    ],
    technologies: ['React Native', 'Flutter', 'PWA'],
    submissionInstructions: 'Provide repository and Expo/live link.',
    status: 'Active'
  },
  {
    id: 'c6',
    title: 'Smart Campus IoT Challenge',
    shortDescription: 'Design a dashboard for smart campus sensor data.',
    category: 'IoT',
    difficulty: 'Medium',
    points: 500,
    deadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(),
    estimatedTime: '5 hours',
    problemDescription: 'The campus is installing sensors for temperature, occupancy, and air quality, but needs a way to view the data.',
    objective: 'Create a frontend dashboard that visualizes mock IoT sensor data.',
    requirements: [
      'Real-time data visualization simulation',
      'Status indicators for different campus zones',
      'Alerts for unusual readings'
    ],
    rules: [
      'Use mock JSON data that updates periodically on the frontend'
    ],
    evaluationCriteria: [
      'Data Visualization: Are charts readable?',
      'State Management: Is the mock real-time update handled well?'
    ],
    technologies: ['React', 'Chart.js', 'Recharts'],
    submissionInstructions: 'Submit a live demo URL.',
    status: 'Upcoming'
  },
  {
    id: 'c7',
    title: 'GitHub Profile Analyzer',
    shortDescription: 'Fetch and display GitHub stats beautifully.',
    category: 'Web Development',
    difficulty: 'Easy',
    points: 250,
    deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    estimatedTime: '3 hours',
    problemDescription: 'Developers want a quick way to generate a summary of their GitHub activity.',
    objective: 'Build an app that takes a GitHub username and displays their public repositories, followers, and top languages.',
    requirements: [
      'Input for GitHub username',
      'Fetch data from public GitHub API',
      'Display stats in a clean card layout',
      'Handle errors (e.g., user not found)'
    ],
    rules: [
      'Handle rate limits gracefully'
    ],
    evaluationCriteria: [
      'API Integration: Is data fetched correctly?',
      'Error Handling: What happens on 404?'
    ],
    technologies: ['REST API', 'JavaScript', 'CSS'],
    submissionInstructions: 'Submit repo and live demo.',
    status: 'Active'
  },
  {
    id: 'c8',
    title: 'Smart Attendance Dashboard',
    shortDescription: 'Interface for faculty to manage and view student attendance.',
    category: 'UI/UX',
    difficulty: 'Medium',
    points: 450,
    deadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
    estimatedTime: '5 hours',
    problemDescription: 'Current attendance systems are clunky and hard to read at a glance.',
    objective: 'Redesign the attendance dashboard for better clarity and speed.',
    requirements: [
      'List of students with quick toggle for Present/Absent',
      'Summary statistics for the class',
      'Export to CSV button (UI only)'
    ],
    rules: [
      'Focus on the faculty user persona'
    ],
    evaluationCriteria: [
      'Efficiency: How many clicks does it take to mark a class?'
    ],
    technologies: ['React', 'Tailwind CSS'],
    submissionInstructions: 'Submit live demo.',
    status: 'Active'
  },
  {
    id: 'c9',
    title: 'Community Skill Matcher',
    shortDescription: 'Platform to match students with complementary skills for projects.',
    category: 'Full Stack',
    difficulty: 'Hard',
    points: 900,
    deadline: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toISOString(),
    estimatedTime: '12 hours',
    problemDescription: 'Students looking for co-founders or teammates struggle to find people with the right technical skills.',
    objective: 'Build a matching interface based on user skill tags.',
    requirements: [
      'Profile creation with skill tags',
      'Search and filter by skills',
      '"Connect" button to request collaboration'
    ],
    rules: [
      'Can use mock backend or local storage for data'
    ],
    evaluationCriteria: [
      'Completeness: Does the core flow work?',
      'Architecture: Is the state managed well?'
    ],
    technologies: ['React', 'Node.js (Optional)'],
    submissionInstructions: 'Submit repo and demo.',
    status: 'Upcoming'
  },
  {
    id: 'c10',
    title: 'Sustainable Campus Tracker',
    shortDescription: 'App to track personal carbon footprint on campus.',
    category: 'App Development',
    difficulty: 'Medium',
    points: 500,
    deadline: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    estimatedTime: '6 hours',
    problemDescription: 'We need to encourage sustainable habits among students.',
    objective: 'Create a daily logger for eco-friendly actions (e.g., used reusable cup, took bus).',
    requirements: [
      'Daily checklist of actions',
      'Points calculation based on actions',
      'Weekly summary view'
    ],
    rules: [
      'Focus on positive reinforcement in UI'
    ],
    evaluationCriteria: [
      'Engagement: Is the app fun to use?'
    ],
    technologies: ['React Native', 'Flutter'],
    submissionInstructions: 'Submit repo.',
    status: 'Completed'
  },
  {
    id: 'c11',
    title: 'Developer Portfolio Challenge',
    shortDescription: 'Build a personal portfolio using a static site generator.',
    category: 'Web Development',
    difficulty: 'Easy',
    points: 300,
    deadline: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000).toISOString(),
    estimatedTime: '3 hours',
    problemDescription: 'Every developer needs a portfolio, but starting from scratch is hard.',
    objective: 'Build a clean, accessible portfolio site.',
    requirements: [
      'About section',
      'Projects section with links',
      'Contact form (UI only)',
      'Fully responsive'
    ],
    rules: [
      'Do not use generic templates; build the layout yourself'
    ],
    evaluationCriteria: [
      'Design: Is it professional?',
      'Code Quality: Semantic HTML used?'
    ],
    technologies: ['HTML', 'CSS', 'Astro or Next.js'],
    submissionInstructions: 'Submit live demo.',
    status: 'Active'
  },
  {
    id: 'c12',
    title: 'Open Source Issue Explorer',
    shortDescription: 'App to find beginner-friendly open source issues.',
    category: 'Programming',
    difficulty: 'Medium',
    points: 600,
    deadline: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000).toISOString(),
    estimatedTime: '5 hours',
    problemDescription: 'Finding good first issues on GitHub is tedious.',
    objective: 'Fetch issues with "good first issue" labels across popular repos and present them cleanly.',
    requirements: [
      'Fetch from GitHub Search API',
      'Filter by language',
      'Clean issue card with link to original'
    ],
    rules: [
      'Cache results to avoid API limits (mock data acceptable)'
    ],
    evaluationCriteria: [
      'API Integration: Correct usage of search queries',
      'UI/UX: Easy to read and filter'
    ],
    technologies: ['React', 'API'],
    submissionInstructions: 'Submit repo and demo.',
    status: 'Active'
  }
];
