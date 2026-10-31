import React from 'react';
import { Sparkles, Github, BookOpen } from 'lucide-react';

interface FooterProps {
  onNavigate: (page: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-950 py-12 text-sm text-slate-500 dark:text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-600 dark:text-teal-400">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <span className="font-bold text-slate-900 dark:text-white tracking-tight">QuantSlot</span>
            </div>
            <p className="max-w-md text-xs leading-relaxed text-slate-500 dark:text-slate-400">
              Quantum-inspired timetable optimization engine for academic institutions.
              Converts scheduling conflict graphs into Quadratic Unconstrained Binary Optimization (QUBO) models solved via simulated annealing.
            </p>
            <div className="text-xs text-slate-400 dark:text-slate-500 font-mono">
              From 18 clashes to zero, in seconds.
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-slate-200 mb-3">
              Platform
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigate('landing')}
                  className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
                >
                  Overview & Methodology
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('demo')}
                  className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
                >
                  Optimizer Studio (Demo)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('how-it-works')}
                  className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
                >
                  QUBO Formulations & Math
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('about')}
                  className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
                >
                  Project Story & Tech Stack
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-slate-200 mb-3">
              Academic Resources
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a
                  href="/sample_classes.csv"
                  download="sample_classes.csv"
                  className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
                >
                  Download Sample CSV (30 Classes)
                </a>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('how-it-works')}
                  className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
                >
                  Ising Spin & QUBO Formulation
                </button>
              </li>
              <li>
                <a
                  href="https://docs.ocean.dwavesys.com"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
                >
                  D-Wave Ocean Suite Reference
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-200 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div>
            &copy; {new Date().getFullYear()} QuantSlot Project. Built with FastAPI, D-Wave Neal, and React.
          </div>
          <div className="flex items-center gap-4">
            <span>FastAPI Backend</span>
            <span aria-hidden="true">&middot;</span>
            <span>QUBO Solver</span>
            <span aria-hidden="true">&middot;</span>
            <span>Tailwind CSS</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
