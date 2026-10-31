import React, { useEffect, useState } from 'react';
import { RotateCcw, CheckCircle2, AlertTriangle, Zap } from 'lucide-react';

interface ClashCounterProps {
  initialCount?: number;
  targetCount?: number;
  durationMs?: number;
  autoStart?: boolean;
}

export const ClashCounter: React.FC<ClashCounterProps> = ({
  initialCount = 18,
  targetCount = 0,
  durationMs = 2400,
  autoStart = true,
}) => {
  const [current, setCurrent] = useState(initialCount);
  const [isRunning, setIsRunning] = useState(autoStart);
  const [solved, setSolved] = useState(false);

  const startAnimation = () => {
    setCurrent(initialCount);
    setIsRunning(true);
    setSolved(false);

    const steps = initialCount - targetCount;
    const intervalTime = durationMs / Math.max(1, steps);
    let step = 0;

    const timer = setInterval(() => {
      step++;
      const nextVal = initialCount - step;
      if (nextVal <= targetCount) {
        setCurrent(targetCount);
        setIsRunning(false);
        setSolved(true);
        clearInterval(timer);
      } else {
        setCurrent(nextVal);
      }
    }, intervalTime);

    return () => clearInterval(timer);
  };

  useEffect(() => {
    if (autoStart) {
      const cancel = startAnimation();
      return cancel;
    }
  }, [autoStart]);

  const progressPercent = Math.round(
    ((initialCount - current) / Math.max(1, initialCount - targetCount)) * 100
  );

  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm p-6 shadow-sm">
      <div className="flex items-center justify-between gap-4 mb-4">
        <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
          <Zap className="w-3.5 h-3.5 text-teal-500" />
          <span>Real-Time Annealing Benchmark</span>
        </div>
        <button
          onClick={startAnimation}
          disabled={isRunning}
          className="text-xs flex items-center gap-1 text-slate-500 hover:text-teal-600 dark:text-slate-400 dark:hover:text-teal-400 transition-colors disabled:opacity-50"
          title="Replay simulated annealing benchmark"
        >
          <RotateCcw className={`w-3.5 h-3.5 ${isRunning ? 'animate-spin' : ''}`} />
          <span>Replay</span>
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 items-center">
        <div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">
            Active Conflicts Detected
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl sm:text-5xl font-extrabold font-mono tabular-nums tracking-tight text-slate-900 dark:text-white">
              {current}
            </span>
            <span className="text-xs text-slate-400 dark:text-slate-500 font-mono">
              / {initialCount} initial
            </span>
          </div>
        </div>

        <div className="text-right">
          <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">
            Status
          </div>
          {solved ? (
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
              <span>Zero-Conflict Optimum</span>
            </div>
          ) : (
            <div className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-600 dark:text-amber-400">
              <AlertTriangle className="w-4 h-4" />
              <span>Resolving Overlaps...</span>
            </div>
          )}
        </div>
      </div>

      {/* Progress bar */}
      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80">
        <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mb-1.5 font-mono">
          <span>Hamiltonian Energy Loss</span>
          <span className="tabular-nums">{progressPercent}%</span>
        </div>
        <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-amber-500 via-teal-500 to-emerald-500 transition-all duration-150 ease-out rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>
    </div>
  );
};
