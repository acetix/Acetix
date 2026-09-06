import { Link } from 'react-router-dom';
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  Code2,
  Gift,
  HeartHandshake,
  ShieldCheck,
  Sparkles,
  Zap,
} from 'lucide-react';
import Marquee from '../components/Marquee';
import ProjectCard from '../components/ProjectCard';
import Reveal from '../components/Reveal';
import { useProjects } from '../lib/useProjects';

const DEV_POINTS = [
  'Regex, API and snippet tools — no heavyweight setup',
  'Keyboard-first interfaces with zero friction',
  'Shareable state: send a link, not a screenshot',
];

const HUMAN_POINTS = [
  'No sign-up and no install — open it and get it done',
  'Files are processed on your device, never uploaded',
  'Works beautifully on phone, tablet and desktop',
];

const PRINCIPLES = [
  {
    icon: ShieldCheck,
    title: 'Privacy-first',
    copy: 'The sharpest privacy policy is the data that never leaves your machine. Most tools run fully client-side.',
  },
  {
    icon: Zap,
    title: 'Fast by default',
    copy: 'Small bundles, static hosting and instant interactions. A tool that opens slowly stops being a tool.',
  },
  {
    icon: Gift,
    title: 'Free forever',
    copy: 'No paywalls, no “pro” tiers hiding the good parts. Side projects should lower barriers, not raise them.',
  },
  {
    icon: Sparkles,
    title: 'Crafted with care',
    copy: 'Each app gets the same obsession with detail I would give a flagship — because daily tools deserve it.',
  },
];

export default function Home() {
  const { projects } = useProjects();
  const featured = projects.filter((p) => p.featured).slice(0, 3);
  const highlight = featured[0] ?? projects[0];
  const count = String(projects.length).padStart(2, '0');

  return (
    <div>
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden pb-16 pt-32 md:pt-40">
        <div
          className="absolute inset-0 -z-10 opacity-40"
          style={{
            backgroundImage: 'radial-gradient(rgba(23,17,16,0.12) 1px, transparent 1px)',
            backgroundSize: '26px 26px',
          }}
        />
        <div className="pointer-events-none absolute -top-48 left-1/2 -z-10 h-[560px] w-[880px] -translate-x-1/2 rounded-full bg-gradient-to-br from-brand/20 via-ember/10 to-transparent blur-3xl" />

        <div className="mx-auto max-w-6xl px-6 text-center">
          <Reveal delay={0.08}>
            <h1 className="mx-auto mt-7 max-w-4xl font-display text-5xl font-bold leading-[1.04] tracking-tight md:text-7xl">
              Big problems, small tools —{' '}
              <span className="bg-gradient-to-r from-brand via-ember to-sun bg-clip-text text-transparent">
                all under one roof.
              </span>
            </h1>
          </Reveal>

          <Reveal delay={0.16}>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-smoke">
              acetix.xyz is where every project I ship lives: free, privacy-first
              web apps that make life easier for developers and for everyday
              humans. No accounts, no uploads, no noise — just tools that work.
            </p>
          </Reveal>

          <Reveal delay={0.24}>
            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                to="/projects"
                className="group inline-flex items-center gap-2 rounded-full bg-ink px-7 py-3.5 text-sm font-semibold text-paper transition hover:bg-brand"
              >
                Browse the collection
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                to="/about"
                className="inline-flex items-center gap-2 rounded-full border border-ink/20 px-7 py-3.5 text-sm font-semibold text-ink transition hover:border-ink"
              >
                Why I build
              </Link>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.3} className="relative mx-auto mt-16 max-w-5xl px-6">
          <div className="relative overflow-hidden rounded-[2rem] border border-ink/10 shadow-2xl shadow-ink/15">
            <img
              src="/images/hero-collage.png"
              alt="A collage of acetix web apps"
              className="w-full"
            />
          </div>

          {highlight && (
            <div className="absolute -left-1 top-12 hidden animate-float items-center gap-3 rounded-2xl border border-ink/10 bg-white/90 px-4 py-3 shadow-lg backdrop-blur md:flex">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
              <div className="max-w-44">
                <p className="truncate font-display text-sm font-semibold">
                  {highlight.title}
                </p>
                <p className="truncate text-xs text-smoke">
                  {highlight.shortDescription}
                </p>
              </div>
            </div>
          )}

          {projects.length > 0 && (
            <div
              className="absolute -right-1 bottom-12 hidden animate-float items-center gap-3 rounded-2xl border border-ink/10 bg-white/90 px-4 py-3 shadow-lg backdrop-blur md:flex"
              style={{ animationDelay: '1.4s' }}
            >
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand to-sun font-display text-sm font-bold text-white">
              {count}
            </span>
            <div>
              <p className="font-display text-sm font-semibold">Apps & counting</p>
              <p className="text-xs text-smoke">New tools ship regularly</p>
            </div>
            </div>
          )}
        </Reveal>
      </section>

      {/* ── Marquee ──────────────────────────────────────────── */}
      <Marquee items={projects.map((p) => p.title)} />

      {/* ── Featured projects ────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-brand">
                The collection
              </p>
              <h2 className="mt-3 font-display text-4xl font-bold tracking-tight md:text-5xl">
                Featured tools
              </h2>
            </div>
            <Link
              to="/projects"
              className="group inline-flex items-center gap-2 rounded-full border border-ink/20 px-6 py-3 text-sm font-semibold transition hover:border-ink hover:bg-ink hover:text-paper"
            >
              {projects.length > 0 ? `View all ${projects.length} projects` : 'View projects'}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </Reveal>

        {featured.length === 0 ? (
          <Reveal>
            <div className="mt-12 flex flex-col items-center gap-3 rounded-3xl border-2 border-dashed border-ink/15 px-6 py-16 text-center">
              <Sparkles className="h-8 w-8 text-smoke" />
              <p className="font-display text-xl font-bold">No projects here yet</p>
              <p className="max-w-sm text-sm text-smoke">
                Everything on this page feeds straight from Firestore — the moment
                projects are added there, they show up here. No demo data, no filler.
              </p>
            </div>
          </Reveal>
        ) : (
          <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {featured.map((project, i) => (
              <Reveal key={project.id} delay={i * 0.08}>
                <ProjectCard project={project} />
              </Reveal>
            ))}
          </div>
        )}
      </section>

      {/* ── Mission ──────────────────────────────────────────── */}
      <section className="px-6">
        <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[2.5rem] bg-ink px-6 py-16 text-paper md:px-14 md:py-20">
          <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-brand/25 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-40 -left-24 h-96 w-96 rounded-full bg-sun/15 blur-3xl" />

          <Reveal>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-sun">
              Who it is for
            </p>
            <h2 className="mt-4 max-w-2xl font-display text-4xl font-bold leading-tight tracking-tight md:text-5xl">
              Made for builders.
              <br />
              Made for humans.
            </h2>
            <p className="mt-5 max-w-xl leading-relaxed text-paper/70">
              Half of acetix is a workshop for people who write code; the other
              half is a kitchen drawer of tools for people who just want the
              thing done.
            </p>
          </Reveal>

          <div className="mt-12 grid gap-6 md:grid-cols-2">
            <Reveal delay={0.1}>
              <div className="h-full rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-brand to-ember">
                  <Code2 className="h-6 w-6 text-white" />
                </span>
                <h3 className="mt-6 font-display text-2xl font-bold">For developers</h3>
                <ul className="mt-5 space-y-3.5">
                  {DEV_POINTS.map((point) => (
                    <li key={point} className="flex items-start gap-3 text-sm leading-relaxed text-paper/80">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-sun" />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>

            <Reveal delay={0.18}>
              <div className="h-full rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-ember to-sun">
                  <HeartHandshake className="h-6 w-6 text-white" />
                </span>
                <h3 className="mt-6 font-display text-2xl font-bold">For everyday humans</h3>
                <ul className="mt-5 space-y-3.5">
                  {HUMAN_POINTS.map((point) => (
                    <li key={point} className="flex items-start gap-3 text-sm leading-relaxed text-paper/80">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-sun" />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── Principles ───────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <Reveal>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-brand">
            How things get built
          </p>
          <h2 className="mt-3 max-w-xl font-display text-4xl font-bold tracking-tight md:text-5xl">
            Principles I ship by
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {PRINCIPLES.map((principle, i) => (
            <Reveal key={principle.title} delay={i * 0.07}>
              <div className="h-full rounded-3xl border border-ink/10 bg-white p-7 transition-shadow duration-300 hover:shadow-xl hover:shadow-ink/5">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-brand to-sun">
                  <principle.icon className="h-5 w-5 text-white" />
                </span>
                <h3 className="mt-5 font-display text-lg font-bold">{principle.title}</h3>
                <p className="mt-2.5 text-sm leading-relaxed text-smoke">{principle.copy}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────── */}
      <section className="px-6 pb-24">
        <Reveal>
          <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-brand via-ember to-sun px-6 py-20 text-center text-white md:py-24">
            <div className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full bg-white/15 blur-2xl" />
            <div className="pointer-events-none absolute -bottom-24 -right-16 h-72 w-72 rounded-full bg-ink/15 blur-2xl" />

            <h2 className="relative mx-auto max-w-2xl font-display text-4xl font-bold leading-tight tracking-tight md:text-5xl">
              Missing a tool you wish existed?
            </h2>
            <p className="relative mx-auto mt-5 max-w-xl leading-relaxed text-white/85">
              The best acetix projects started as somebody's slow Tuesday. Tell
              me what keeps wasting your time — it might be the next thing I build.
            </p>
            <Link
              to="/suggest"
              className="group relative mt-9 inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-sm font-bold text-ink shadow-lg transition hover:shadow-xl"
            >
              Suggest a tool
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
