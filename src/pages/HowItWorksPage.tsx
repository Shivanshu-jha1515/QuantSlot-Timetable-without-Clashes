import React, { useState } from 'react';
import { Cpu, ChevronRight, Zap, Database, GitMerge, Check, Layers, ShieldCheck } from 'lucide-react';

export const HowItWorksPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'h1' | 'h2' | 'h3'>('h1');

  const steps = [
    {
      num: '01',
      title: 'Load & Parse',
      desc: 'Ingests class records, faculties, classrooms, and student cohorts into an incidence conflict graph.',
      badge: 'Input Graph',
    },
    {
      num: '02',
      title: 'Formulate QUBO',
      desc: 'Generates binary variables x(i, s) and constructs upper-triangular energy matrix Q of size (N × S)²',
      badge: 'Matrix Generation',
    },
    {
      num: '03',
      title: 'Quantum Anneal',
      desc: 'Samples lowest energy state using transverse field simulated annealing or D-Wave physical QPU.',
      badge: 'Ground State Search',
    },
    {
      num: '04',
      title: 'Decode Bitstrings',
      desc: 'Transforms binary vectors back into discrete academic slots, days, and period assignments.',
      badge: 'Solution Decoding',
    },
    {
      num: '05',
      title: 'Verify & Export',
      desc: 'Confirms zero hard conflict invariants and exports publication-ready timetable grid.',
      badge: 'Zero Clashes Verified',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Title */}
      <div className="max-w-3xl space-y-4">
        <div className="text-xs font-semibold uppercase tracking-wider text-teal-600 dark:text-teal-400">
          Theoretical Foundation
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Quantum Unconstrained Binary Optimization (QUBO)
        </h1>
        <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed">
          How QuantSlot reformulates academic scheduling from intractable combinatorial constraint satisfaction into physical energy minimization.
        </p>
      </div>

      {/* Algorithm Flow Diagram */}
      <section className="space-y-6">
        <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Algorithmic Pipeline Flow
          </h2>
          <p className="text-xs text-slate-500">
            End-to-end execution path from raw academic data to verified schedule.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {steps.map((step, idx) => (
            <div
              key={step.num}
              className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3 relative flex flex-col justify-between shadow-xs"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl font-black font-mono text-teal-600 dark:text-teal-400">
                    {step.num}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                    {step.badge}
                  </span>
                </div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-1">
                  {step.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {step.desc}
                </p>
              </div>

              {idx < steps.length - 1 && (
                <div className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 z-10 text-slate-300 dark:text-slate-700">
                  <ChevronRight className="w-5 h-5" />
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Binary Variables x(i, s) */}
      <section className="p-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-6 shadow-xs">
        <div className="max-w-2xl space-y-2">
          <div className="text-xs font-semibold uppercase tracking-wider text-teal-600 dark:text-teal-400">
            Fundamental Units
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Binary Decision Variables x(i, s)
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            Every potential schedule configuration is uniquely encoded into a vector of boolean decision bits.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 font-mono text-xs space-y-2">
              <div className="text-slate-400">// Definition for Class i &isin; [0, N-1] and Slot s &isin; [0, S-1]</div>
              <div className="text-teal-600 dark:text-teal-400 font-semibold">
                x(i, s) &isin; &#123;0, 1&#125;
              </div>
              <div className="text-slate-700 dark:text-slate-300 text-[11px] leading-relaxed">
                Value is 1 if Class i is scheduled in Slot s; 0 otherwise.
              </div>
              <div className="pt-2 text-slate-500 text-[11px] border-t border-slate-200 dark:border-slate-800">
                Vector Dimension: Dim(x) = N &times; S binary qubits.
                <br />
                For 30 classes across 12 slots = 360 binary variables.
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              In physical quantum annealing hardware (such as D-Wave Advantage QPUs), each binary variable x corresponds to an Ising spin &sigma; &isin; &#123;-1, +1&#125; via the linear transformation x = (1 - &sigma;) / 2.
            </p>
          </div>

          <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 space-y-3">
            <div className="text-xs font-bold text-slate-900 dark:text-white">
              Binary Grid Representation
            </div>
            <div className="grid grid-cols-5 gap-1.5 font-mono text-center text-xs">
              <div className="p-2 font-semibold text-slate-400">Class</div>
              <div className="p-2 font-semibold text-slate-400">Slot 1</div>
              <div className="p-2 font-semibold text-slate-400">Slot 2</div>
              <div className="p-2 font-semibold text-slate-400">Slot 3</div>
              <div className="p-2 font-semibold text-slate-400">Slot 4</div>

              <div className="p-2 text-slate-700 dark:text-slate-300 text-left font-sans text-[11px]">Class 1</div>
              <div className="p-2 bg-teal-500/20 text-teal-700 dark:text-teal-300 font-bold rounded">1</div>
              <div className="p-2 bg-slate-200/50 dark:bg-slate-800 text-slate-400 rounded">0</div>
              <div className="p-2 bg-slate-200/50 dark:bg-slate-800 text-slate-400 rounded">0</div>
              <div className="p-2 bg-slate-200/50 dark:bg-slate-800 text-slate-400 rounded">0</div>

              <div className="p-2 text-slate-700 dark:text-slate-300 text-left font-sans text-[11px]">Class 2</div>
              <div className="p-2 bg-slate-200/50 dark:bg-slate-800 text-slate-400 rounded">0</div>
              <div className="p-2 bg-teal-500/20 text-teal-700 dark:text-teal-300 font-bold rounded">1</div>
              <div className="p-2 bg-slate-200/50 dark:bg-slate-800 text-slate-400 rounded">0</div>
              <div className="p-2 bg-slate-200/50 dark:bg-slate-800 text-slate-400 rounded">0</div>

              <div className="p-2 text-slate-700 dark:text-slate-300 text-left font-sans text-[11px]">Class 3</div>
              <div className="p-2 bg-slate-200/50 dark:bg-slate-800 text-slate-400 rounded">0</div>
              <div className="p-2 bg-slate-200/50 dark:bg-slate-800 text-slate-400 rounded">0</div>
              <div className="p-2 bg-teal-500/20 text-teal-700 dark:text-teal-300 font-bold rounded">1</div>
              <div className="p-2 bg-slate-200/50 dark:bg-slate-800 text-slate-400 rounded">0</div>
            </div>
            <div className="text-[10px] text-slate-400 text-right">
              Valid schedule: exactly one '1' in each row (H1 = 0).
            </div>
          </div>
        </div>
      </section>

      {/* The Three Objective Terms */}
      <section className="space-y-6">
        <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            The Three Hamiltonian Terms: H = H₁ + H₂ + H₃
          </h2>
          <p className="text-xs text-slate-500">
            Total energy minimization function mapped to matrix Q.
          </p>
        </div>

        {/* Tabs for H1, H2, H3 */}
        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800">
          <button
            onClick={() => setActiveTab('h1')}
            className={`px-4 py-2.5 text-xs font-semibold transition-colors border-b-2 ${
              activeTab === 'h1'
                ? 'border-teal-600 dark:border-teal-400 text-teal-600 dark:text-teal-400'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            H₁: Exact Slot Assignment
          </button>
          <button
            onClick={() => setActiveTab('h2')}
            className={`px-4 py-2.5 text-xs font-semibold transition-colors border-b-2 ${
              activeTab === 'h2'
                ? 'border-teal-600 dark:border-teal-400 text-teal-600 dark:text-teal-400'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            H₂: Resource Conflict Clashes
          </button>
          <button
            onClick={() => setActiveTab('h3')}
            className={`px-4 py-2.5 text-xs font-semibold transition-colors border-b-2 ${
              activeTab === 'h3'
                ? 'border-teal-600 dark:border-teal-400 text-teal-600 dark:text-teal-400'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            H₃: Soft Preferences & Balance
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4">
          {activeTab === 'h1' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  H₁: Exactly One Slot Per Course
                </h3>
                <span className="text-xs font-mono text-teal-600 dark:text-teal-400 font-semibold">
                  Default Weight A = 5.0
                </span>
              </div>

              <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-950 font-mono text-xs border border-slate-200 dark:border-slate-800">
                H₁ = A &times; &sum;<sub>i=1..N</sub> ( &sum;<sub>s=1..S</sub> x(i,s) - 1 )&sup2;
              </div>

              <div className="text-xs text-slate-600 dark:text-slate-300 space-y-2 leading-relaxed">
                <p>
                  Because x(i,s) &isin; &#123;0, 1&#125;, we know that x(i,s)&sup2; = x(i,s). Expanding the quadratic expression gives:
                </p>
                <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded border border-slate-100 dark:border-slate-800 font-mono text-slate-700 dark:text-slate-300">
                  (&sum;<sub>s</sub> x(i,s) - 1)&sup2; = -&sum;<sub>s</sub> x(i,s) + 2 &sum;<sub>s &lt; s'</sub> x(i,s) &middot; x(i,s') + 1
                </div>
                <p>
                  If a class has 0 slots assigned: (-1)&sup2; = 1 penalty.
                  If a class has 1 slot assigned: (1 - 1)&sup2; = 0 penalty.
                  If a class has 2 slots assigned: (2 - 1)&sup2; = 1 penalty.
                  This strictly forces the annealer into a valid one-hot assignment for every class.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'h2' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  H₂: Eradicating Resource Collisions (Clashes)
                </h3>
                <span className="text-xs font-mono text-teal-600 dark:text-teal-400 font-semibold">
                  Default Weight B = 8.0
                </span>
              </div>

              <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-950 font-mono text-xs border border-slate-200 dark:border-slate-800">
                H₂ = B &times; &sum;<sub>s=1..S</sub> &sum;<sub>i &lt; j</sub> C(i,j) &middot; x(i,s) &middot; x(j,s)
              </div>

              <div className="text-xs text-slate-600 dark:text-slate-300 space-y-2 leading-relaxed">
                <p>
                  The conflict coefficient C(i,j) counts simultaneous constraint collisions between class i and class j:
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  <li><strong>Faculty Conflict:</strong> Teacher i == Teacher j (+1 penalty)</li>
                  <li><strong>Classroom Conflict:</strong> Room i == Room j (+1 penalty)</li>
                  <li><strong>Student Cohort Conflict:</strong> Group i == Group j (+1 penalty)</li>
                </ul>
                <p>
                  If two conflicting classes are assigned to the same slot s, both x(i,s)=1 and x(j,s)=1, producing an energy spike of B &times; C(i,j). The annealer avoids high energy states, driving total clashes to 0.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'h3' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  H₃: Soft Preferences & Workload Distribution
                </h3>
                <span className="text-xs font-mono text-teal-600 dark:text-teal-400 font-semibold">
                  Default Weight C = 1.0
                </span>
              </div>

              <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-950 font-mono text-xs border border-slate-200 dark:border-slate-800">
                H₃ = C &times; &sum;<sub>i=1..N</sub> &sum;<sub>s=1..S</sub> P(i,s) &middot; x(i,s)
              </div>

              <div className="text-xs text-slate-600 dark:text-slate-300 space-y-2 leading-relaxed">
                <p>
                  Linear objective term P(i,s) incorporates instructor preferred teaching hours, department workload smoothing across the academic week, and lunch break spacing.
                </p>
                <p>
                  Because C &lt;&lt; B, the optimizer will never sacrifice conflict feasibility (H₂) to satisfy a soft preference, ensuring mathematical integrity.
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Classical vs Quantum Energy Barrier Comparison */}
      <section className="p-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 space-y-6">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          Quantum Tunneling vs. Classical Hill Climbing
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs text-slate-600 dark:text-slate-300">
          <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2">
            <h4 className="font-bold text-sm text-slate-900 dark:text-white">
              Classical Simulated Annealing
            </h4>
            <p className="leading-relaxed">
              Relies on thermal fluctuations exp(-&Delta;E / k<sub>B</sub>T). To escape a local clash minimum, the system must randomly step upwards through tall energy barriers. In large schedules, this causes freezing in sub-optimal 2-clash or 3-clash states.
            </p>
          </div>

          <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2">
            <h4 className="font-bold text-sm text-slate-900 dark:text-white">
              Quantum Annealing (Transverse Field)
            </h4>
            <p className="leading-relaxed">
              Exploits quantum mechanical tunneling through narrow, high energy barriers. Rather than climbing uphill, the state wavepacket tunnels directly into the global ground state basin, yielding zero-conflict schedules in fractions of a second.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
