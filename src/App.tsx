import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { ToastProvider } from './context/ToastContext';
import { AppLayout } from './layouts/AppLayout';
import { Home } from './pages/Home';
import { Challenges } from './pages/Challenges';
import { ChallengeDetail } from './pages/ChallengeDetail';
import { ProgressPage } from './pages/Progress';
import { Leaderboard } from './pages/Leaderboard';
import { Saved } from './pages/Saved';
import { Profile } from './pages/Profile';

function App() {
  return (
    <AppProvider>
      <ToastProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<AppLayout />}>
              <Route index element={<Home />} />
              <Route path="challenges" element={<Challenges />} />
              <Route path="challenge/:id" element={<ChallengeDetail />} />
              <Route path="progress" element={<ProgressPage />} />
              <Route path="leaderboard" element={<Leaderboard />} />
              <Route path="saved" element={<Saved />} />
              <Route path="profile" element={<Profile />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </AppProvider>
  );
}

export default App;
