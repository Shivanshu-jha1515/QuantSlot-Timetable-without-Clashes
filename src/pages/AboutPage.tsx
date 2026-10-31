import React from 'react';
import { Cpu, Code2, Globe, Sparkles, Rocket, Users, BookOpen, Layers, CheckCircle } from 'lucide-react';

export const AboutPage: React.FC = () => {
  const teamMembers = [
    {
      name: 'Dr. Aris Thorne',
      role: 'Quantum Optimization Researcher',
      affiliation: 'Institute for Quantum Computing & Mathematical Physics',
      bio: 'Specializes in Ising spin glasses, Hamiltonian compilation, and NP-hard graph coloring on NISQ devices.',
    },
    {
      name: 'Elena Vance, M.Sc.',
      role: 'Lead Systems Architect',
      affiliation: 'Operations Research & Distributed Computing',
      bio: 'Focuses on high-throughput algorithmic pipelines, FastAPI services, and reactive scientific dashboards.',
    },
    {
      name: 'Marcus Chen',
      role: 'Academic Operations Lead',
      affiliation: 'Higher Education Scheduling Board',
      bio: '12+ years optimizing registrar operations, multi-department course allocations, and campus resource workflows.',
    },
  ];

  const techStack = [
    {
      category: 'Quantum & Optimization',
      items: ['QUBO Formulation', 'D-Wave Ocean Suite (dimod)', 'dwave-neal (Simulated Annealing)', 'Ising Hamiltonian'],
    },
    {
      category: 'Backend & Services',
      items: ['Python 3.10+', 'FastAPI (Asynchronous)', 'Uvicorn Server', 'Pydantic V2 Validation'],
    },
    {
      category: 'Frontend & UI',
      items: ['React 19 & TypeScript', 'Tailwind CSS', 'Vite 8 Build Tool', 'Plus Jakarta Sans & JetBrains Mono'],
    },
    {
      category: 'Full-Stack Runtime',
      items: ['Express.js Proxy', 'Automated Fallback Engine', 'CSV Ingestion Engine', 'RESTful API'],
    },
  ];

  const futureScopes = [
    {
      icon: <Cpu className="w-5 h-5 text-teal-600 dark:text-teal-400" />,
      title: 'Real Quantum Hardware (QPUs)',
      desc: 'Seamless integration with physical D-Wave Advantage 5,000+ qubit superconducting processors via the D-Wave Leap cloud API for microsecond physical quantum annealing.',
    },
    {
      icon: <Layers className="w-5 h-5 text-teal-600 dark:text-teal-400" />,
      title: 'University-Wide Exam Scheduling',
      desc: 'Expanding the Hamiltonian to multi-week final exams with hard constraints against students having back-to-back 3-hour exam sessions or overlapping finals.',
    },
    {
      icon: <Globe className="w-5 h-5 text-teal-600 dark:text-teal-400" />,
      title: 'Physical Room Capacity & Equipment Matching',
      desc: 'Automated quadratic coupling between class enrollment sizes, room seating capacities, accessibility needs, and specialized laboratory equipment.',
    },
    {
      icon: <Sparkles className="w-5 h-5 text-teal-600 dark:text-teal-400" />,
      title: 'Real-Time Dynamic Emergency Replanning',
      desc: 'Instant delta-annealing to reschedule displaced lectures in under 20 milliseconds if a classroom is closed for maintenance or faculty takes sudden leave.',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Title */}
      <div className="max-w-3xl space-y-4">
        <div className="text-xs font-semibold uppercase tracking-wider text-teal-600 dark:text-teal-400">
          About QuantSlot
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Bridging Quantum Information Science and Academic Scheduling
        </h1>
        <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed">
          From manual registrar headaches to instantaneous quantum-inspired global convergence.
        </p>
      </div>

      {/* Project Story */}
      <section className="p-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-6">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-teal-600 dark:text-teal-400">
          <BookOpen className="w-4 h-4" />
          <span>The Project Story</span>
        </div>

        <div className="prose dark:prose-invert max-w-none text-xs sm:text-sm text-slate-600 dark:text-slate-300 space-y-4 leading-relaxed">
          <p>
            Every academic term, college registrars and school administrators face a combinatorial nightmare: hundreds of courses, dozens of classrooms with varying capacities, and instructors with conflicting commitments. Even for a modest department of 30 classes across 12 time slots, the space of possible timetables exceeds <span className="font-mono font-semibold">12³⁰ ≈ 2.37 × 10³³</span> configurations.
          </p>
          <p>
            Traditional greedy heuristics or recursive backtracking solvers frequently get trapped in deep local minima — delivering schedules with 10 to 20 persistent room or teacher double-bookings that take days of stressful manual revision to untangle.
          </p>
          <p>
            QuantSlot was engineered to eliminate this barrier by reformulating scheduling as a <strong>Quadratic Unconstrained Binary Optimization (QUBO)</strong> problem. By translating hard resource constraints into energy penalties on an Ising lattice, our quantum-inspired simulated annealing engine tunnels directly into the zero-clash global ground state in under 15 milliseconds.
          </p>
        </div>
      </section>

      {/* Tech Stack Matrix */}
      <section className="space-y-6">
        <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Architecture & Tech Stack
          </h2>
          <p className="text-xs text-slate-500">
            Engineered with modern, typed, and mathematically rigorous open-source technologies.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {techStack.map((stack) => (
            <div
              key={stack.category}
              className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3 shadow-xs"
            >
              <h3 className="font-bold text-xs uppercase tracking-wider text-teal-600 dark:text-teal-400">
                {stack.category}
              </h3>
              <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                {stack.items.map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-teal-500 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Future Scope */}
      <section className="space-y-6">
        <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Future Scope & Roadmap
          </h2>
          <p className="text-xs text-slate-500">
            What lies ahead for enterprise quantum operations research.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {futureScopes.map((scope) => (
            <div
              key={scope.title}
              className="p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3 shadow-xs"
            >
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-teal-500/10 border border-teal-500/20">
                  {scope.icon}
                </div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  {scope.title}
                </h3>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {scope.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Team Section */}
      <section className="space-y-6">
        <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Research & Engineering Team
          </h2>
          <p className="text-xs text-slate-500">
            The interdisciplinary minds behind QuantSlot.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {teamMembers.map((member) => (
            <div
              key={member.name}
              className="p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3 shadow-xs"
            >
              <div className="w-12 h-12 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-600 dark:text-teal-400 font-bold font-mono text-base">
                {member.name.split(' ').map((n) => n[0]).join('')}
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  {member.name}
                </h3>
                <div className="text-xs text-teal-600 dark:text-teal-400 font-medium">
                  {member.role}
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  {member.affiliation}
                </div>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed pt-2 border-t border-slate-100 dark:border-slate-800">
                {member.bio}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
