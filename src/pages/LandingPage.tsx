import React from 'react';
import { ArrowRight, Cpu, Layers, CheckCircle, Zap, ShieldAlert, Sparkles, Clock, Calendar } from 'lucide-react';
import { ClashCounter } from '../components/ClashCounter';

interface LandingPageProps {
  onNavigateToDemo: () => void;
  onNavigateToHowItWorks: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onNavigateToDemo,
  onNavigateToHowItWorks,
}) => {
  return (
    <div className="space-y-24 py-8 sm:py-16">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-teal-600 dark:text-teal-400">
              <span>Next-Gen Academic Scheduling</span>
              <span aria-hidden="true">&middot;</span>
              <span>QUBO Optimization</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.1]">
              From 18 clashes to zero,{' '}
              <span className="text-teal-600 dark:text-teal-400">in seconds.</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
              Academic timetables suffer from combinatorial explosion. QuantSlot maps complex teacher, classroom, and student cohort constraints into quantum-inspired Hamiltonians to achieve zero-conflict schedules at microsecond velocity.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={onNavigateToDemo}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold bg-teal-600 hover:bg-teal-500 text-white dark:bg-teal-500 dark:text-slate-950 dark:hover:bg-teal-400 transition-colors shadow-sm"
              >
                <span>Try the Demo</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onNavigateToHowItWorks}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-medium border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-850 text-slate-700 dark:text-slate-200 transition-colors"
              >
                <span>Explore the QUBO Math</span>
              </button>
            </div>

            <div className="pt-4 flex items-center gap-6 text-xs text-slate-500 dark:text-slate-400 font-mono">
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-teal-500" />
                <span>&lt; 15ms Solve Time</span>
              </div>
              <span aria-hidden="true">&middot;</span>
              <div className="flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-teal-500" />
                <span>0 Hard Conflicts</span>
              </div>
              <span aria-hidden="true">&middot;</span>
              <div className="flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-teal-500" />
                <span>D-Wave Ready</span>
              </div>
            </div>
          </div>

          {/* Hero Visual Card with Animated Clash Counter */}
          <div className="lg:col-span-5 space-y-4">
            <ClashCounter initialCount={18} targetCount={0} durationMs={2000} autoStart={true} />

            <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs space-y-3 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                <span className="font-semibold text-slate-700 dark:text-slate-300">Live Benchmark Scenario</span>
                <span className="font-mono">College Science Dept</span>
              </div>
              <div className="grid grid-cols-3 gap-2 py-1 font-mono text-center">
                <div className="p-2 rounded bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800">
                  <div className="text-[10px] text-slate-400">CLASSES</div>
                  <div className="font-bold text-slate-800 dark:text-slate-200 text-sm">30</div>
                </div>
                <div className="p-2 rounded bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800">
                  <div className="text-[10px] text-slate-400">SLOTS</div>
                  <div className="font-bold text-slate-800 dark:text-slate-200 text-sm">12</div>
                </div>
                <div className="p-2 rounded bg-teal-500/10 border border-teal-500/20 text-teal-600 dark:text-teal-400">
                  <div className="text-[10px]">ENERGY</div>
                  <div className="font-bold text-sm">0.0 (Ground)</div>
                </div>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal">
                Naive greedy assignment creates 18 teacher & room collisions. Quantum annealing samples the global ground state with 0 clashes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Problem, Solution, Why Quantum */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="text-xs font-semibold uppercase tracking-wider text-teal-600 dark:text-teal-400 mb-2">
            The Algorithmic Paradigm Shift
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Why Classical Timetabling Fails
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3 shadow-xs">
            <div className="w-10 h-10 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              The Classical Problem
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Timetabling is NP-hard. As schools add sections and specialized labs, the search space explodes exponentially ($S^N$). Traditional backtracking algorithms timeout or freeze under overlapping teacher and room constraints.
            </p>
          </div>

          <div className="p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3 shadow-xs">
            <div className="w-10 h-10 rounded-lg bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              The QUBO Solution
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              We translate every schedule rule into an unconstrained binary quadratic formula. Hard constraints become energy barriers, converting a messy combinatorial search into a smooth topological optimization surface.
            </p>
          </div>

          <div className="p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3 shadow-xs">
            <div className="w-10 h-10 rounded-lg bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              Why Quantum
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Unlike classical simulated annealing which must climb over tall energy barriers, quantum annealing can tunnel directly through high conflict barriers to reach the true zero-conflict ground state in milliseconds.
            </p>
          </div>
        </div>
      </section>

      {/* 3-Step How It Works Strip */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 space-y-8">
          <div className="text-center max-w-xl mx-auto">
            <div className="text-xs font-semibold uppercase tracking-wider text-teal-600 dark:text-teal-400 mb-2">
              Three-Step Optimization Pipeline
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              From Raw CSV to Conflict-Free Grid
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-3">
              <div className="text-2xl font-black font-mono text-teal-600 dark:text-teal-400">
                01.
              </div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white">
                Ingest & Model
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Upload your course catalog or CSV. QuantSlot maps each class-slot pair to binary decision variable x(i, s) &isin; &#123;0, 1&#125;.
              </p>
            </div>

            <div className="space-y-3">
              <div className="text-2xl font-black font-mono text-teal-600 dark:text-teal-400">
                02.
              </div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white">
                Construct Hamiltonian
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Assembles $H_1$ (single slot assignment), $H_2$ (clash penalty matrix), and $H_3$ (spread preference) into the upper-triangular QUBO matrix $Q$.
              </p>
            </div>

            <div className="space-y-3">
              <div className="text-2xl font-black font-mono text-teal-600 dark:text-teal-400">
                03.
              </div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white">
                Anneal & Schedule
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Executes simulated quantum annealing sweeps. Low-energy ground states are decoded into a color-coded timetable ready for CSV export.
              </p>
            </div>
          </div>

          <div className="pt-4 flex justify-center">
            <button
              onClick={onNavigateToDemo}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg text-xs font-semibold bg-slate-900 text-white hover:bg-slate-800 dark:bg-teal-500 dark:text-slate-950 dark:hover:bg-teal-400 transition-colors"
            >
              <span>Test with Your Own Classes</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
