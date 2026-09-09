import { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { recordVisit } from './lib/visitors';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import PageLoader from './components/PageLoader';
import SplashScreen from './components/SplashScreen';
import FloatingActions from './components/FloatingActions';
import { useSystemTheme } from './lib/useTheme';
import {
  detectLocalLocale,
  detectLocale,
  KNOWN_TOP,
  parseLocalePath,
} from './lib/locale';

const Home = lazy(() => import('./pages/Home'));
const Projects = lazy(() => import('./pages/Projects'));
const ProjectDetail = lazy(() => import('./pages/ProjectDetail'));
const Suggest = lazy(() => import('./pages/Suggest'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const Privacy = lazy(() => import('./pages/Privacy'));
const Plan = lazy(() => import('./pages/Plan'));
const Profile = lazy(() => import('./pages/Profile'));
const NotFound = lazy(() => import('./pages/NotFound'));

function RouteFallback() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center pt-16">
      <Loader2 className="h-8 w-8 animate-spin text-brand" />
    </div>
  );
}

export default function App() {
  useSystemTheme();
  useEffect(() => {
    recordVisit();
  }, []);

  return (
    <BrowserRouter>
      <LocalePrefixer />
      <SplashScreen />
      <PageLoader />
      <ScrollToTop />
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1">
          <Suspense fallback={<RouteFallback />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/projects/:id" element={<ProjectDetail />} />
              <Route path="/suggest" element={<Suggest />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/plan" element={<Plan />} />
              <Route path="/profile" element={<Profile />} />
              {/* Locale-prefixed mirrors: acetix.xyz/bd/projects … */}
              <Route path="/:locale" element={<LocalizedRoot />} />
              <Route path="/:locale/projects" element={<Projects />} />
              <Route path="/:locale/projects/:id" element={<ProjectDetail />} />
              <Route path="/:locale/suggest" element={<Suggest />} />
              <Route path="/:locale/about" element={<About />} />
              <Route path="/:locale/contact" element={<Contact />} />
              <Route path="/:locale/privacy" element={<Privacy />} />
              <Route path="/:locale/plan" element={<Plan />} />
              <Route path="/:locale/profile" element={<Profile />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </main>
        <Footer />
      </div>
      <FloatingActions />
    </BrowserRouter>
  );
}

const RECHECK_MS = 5 * 60 * 1000;

/**
 * While the splash covers the first paint, detect the visitor's location
 * and rewrite the URL to acetix.xyz/<location>/* — e.g. a visitor from
 * Dhaka lands on acetix.xyz/bd-dhaka/. Nothing is cached, and the location
 * is re-checked every few minutes, so a traveller's URL tracks their
 * current location. In-app links keep working; direct /<code>/* URLs
 * render the same page without redirect.
 */
function LocalePrefixer() {
  const { pathname, search, hash } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | undefined;

    const current = () => parseLocalePath(window.location.pathname).locale;

    const go = (code: string | null) => {
      if (cancelled || !code) return;
      if (current() === code) return;
      const { effectivePath } = parseLocalePath(window.location.pathname);
      const tail = effectivePath === '/' ? '/' : effectivePath;
      navigate(`/${code}${tail === '/' ? '/' : tail}${search}${hash}`, {
        replace: true,
      });
    };

    const recheck = () => {
      if (cancelled) return;
      const ctrl = new AbortController();
      const timeout = setTimeout(() => ctrl.abort(), 4000);
      void detectLocale(ctrl.signal)
        .then((info) => {
          clearTimeout(timeout);
          go(info?.code ?? null);
        })
        .catch(() => clearTimeout(timeout))
        .finally(() => {
          if (!cancelled) timer = setTimeout(recheck, RECHECK_MS);
        });
    };

    // First paint: instant on-device guess, then the detailed pass.
    const sync = detectLocalLocale();
    if (sync && !current()) {
      const t = setTimeout(() => go(sync), 900);
      timer = setTimeout(recheck, RECHECK_MS);
      return () => {
        cancelled = true;
        clearTimeout(t);
        if (timer) clearTimeout(timer);
      };
    }
    recheck();
    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
  }, [pathname, search, hash, navigate]);

  return null;
}

/** Renders the home page when /<code> maps to a known or unknown tail. */
function LocalizedRoot() {
  const { pathname } = useLocation();
  const { locale, effectivePath } = parseLocalePath(pathname);
  if (!locale) return <NotFound />;
  const tail = effectivePath === '/' ? '' : effectivePath.slice(1).split('/')[0];
  if (tail && !KNOWN_TOP.includes(tail)) return <NotFound />;
  return <Home />;
}
