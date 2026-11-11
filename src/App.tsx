import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import Sidebar from './components/layout/Sidebar';
import MobileNavigation from './components/layout/MobileNavigation';
import Exams from './pages/Exams';
import ExamDetail from './pages/ExamDetail';
import Chapters from './pages/Chapters';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';
import { Spinner } from './components/ui/Spinner';

// The PDF engine is heavy: load it only when a paper is opened.
const ExamReader = lazy(() => import('./pages/ExamReader'));

export default function App() {
  const location = useLocation();
  const reading = location.pathname.startsWith('/archives/') && location.pathname.split('/').length > 2;
  const detail = location.pathname.startsWith('/epreuve/');

  if (reading) {
    return (
      <Suspense fallback={<div className="grid h-dvh place-items-center"><Spinner label="Chargement du lecteur…" /></div>}>
        <Routes>
          <Route path="/archives/:examId" element={<ExamReader />} />
        </Routes>
      </Suspense>
    );
  }

  return (
    <div className="min-h-dvh lg:flex">
      <Sidebar />
      {/* The exam page has its own action bar on phones instead of the tab bar. */}
      {!detail && <MobileNavigation />}
      <main className="min-w-0 flex-1 pb-24 lg:pb-0">
        <div className="mx-auto w-full max-w-6xl px-4 pt-5 pb-6 sm:px-10 sm:pt-12 sm:pb-16">
          <Routes>
            <Route path="/" element={<Navigate to="/archives" replace />} />
            <Route path="/archives" element={<Exams />} />
            <Route path="/epreuve/:examId" element={<ExamDetail />} />
            <Route path="/chapitres" element={<Chapters />} />
            <Route path="/parametres" element={<Settings />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}
