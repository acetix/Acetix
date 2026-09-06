import { useEffect, useSyncExternalStore } from 'react';

export type Theme = 'light' | 'dark';
export type ThemeMode = 'system' | Theme;

const STORAGE_KEY = 'acetix.theme-mode';

function readStoredMode(): ThemeMode {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    if (v === 'system' || v === 'light' || v === 'dark') return v;
  } catch {
    /* storage blocked */
  }
  return 'system';
}

function systemIsDark(): boolean {
  try {
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  } catch {
    return false;
  }
}

function resolveTheme(mode: ThemeMode): Theme {
  if (mode === 'system') {
    return typeof window !== 'undefined' && systemIsDark() ? 'dark' : 'light';
  }
  return mode;
}

/* Module-level shared store — every ThemeModeButton instance shares one mode. */
let mode: ThemeMode = typeof window !== 'undefined' ? readStoredMode() : 'system';
const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function snapshotMode(): ThemeMode {
  return mode;
}

function apply(modeValue: ThemeMode) {
  mode = modeValue;
  if (typeof document !== 'undefined') {
    document.documentElement.classList.toggle('dark', resolveTheme(modeValue) === 'dark');
  }
  try {
    localStorage.setItem(STORAGE_KEY, modeValue);
  } catch {
    /* storage blocked — mode just won't persist */
  }
  listeners.forEach((l) => l());
}

// Follow the OS while the tab is open when in "system" mode, and keep
// tabs in sync when the mode changes elsewhere.
if (typeof window !== 'undefined') {
  try {
    const query = window.matchMedia('(prefers-color-scheme: dark)');
    const onSystemChange = () => {
      if (mode === 'system') apply('system');
    };
    query.addEventListener('change', onSystemChange);
  } catch {
    /* matchMedia unavailable — stay on stored/default mode */
  }
  window.addEventListener('storage', (e) => {
    if (
      e.key === STORAGE_KEY &&
      (e.newValue === 'system' || e.newValue === 'light' || e.newValue === 'dark')
    ) {
      apply(e.newValue);
    }
  });
}

/**
 * Theme mode driven by the header button: "system" (default, follows the
 * OS live) with optional manual light/dark overrides. Run `useSystemTheme`
 * once at the app root so the correct scheme applies on load.
 */
export function useThemeMode() {
  const current = useSyncExternalStore(subscribe, snapshotMode, () => 'system' as ThemeMode);
  const theme = resolveTheme(current);
  const cycle = () => {
    const next: ThemeMode = current === 'system' ? 'light' : current === 'light' ? 'dark' : 'system';
    apply(next);
  };
  const set = (m: ThemeMode) => {
    if (m !== current) apply(m);
  };
  return { mode: current, theme, dark: theme === 'dark', cycle, set };
}

/**
 * System-following dark/bright mode — runs the initial paint and keeps
 * following the OS unless the user picked a manual override via the
 * header button. Run once at the app root.
 */
export function useSystemTheme() {
  const { mode: current } = useThemeMode();
  useEffect(() => {
    apply(current);
  }, [current]);
}
