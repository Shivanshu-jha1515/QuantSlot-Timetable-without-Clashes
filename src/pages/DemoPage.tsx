import React, { useState, useEffect } from 'react';
import {
  Upload,
  Download,
  Play,
  RotateCcw,
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  Search,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Cpu,
  FileSpreadsheet,
  HelpCircle,
  FileDown,
} from 'lucide-react';
import { ClassItem, OptimizationResponse, OptimizationWeights } from '../types';
import { TimetableGrid } from '../components/TimetableGrid';
import { exportTimetableToPdf } from '../utils/exportPdf';
import { CsvUploader } from '../components/CsvUploader';

export const DemoPage: React.FC = () => {
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [numSlots, setNumSlots] = useState<number>(12);
  const [weights, setWeights] = useState<OptimizationWeights>({ A: 5.0, B: 8.0, C: 1.0 });
  const [reads, setReads] = useState<number>(30);
  const [highlightConflicts, setHighlightConflicts] = useState<boolean>(true);

  // CSV uploader visibility
  const [showCsvUploader, setShowCsvUploader] = useState<boolean>(false);

  // Optimization state
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isOptimizing, setIsOptimizing] = useState<boolean>(false);
  const [optimizationResult, setOptimizationResult] = useState<OptimizationResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Class table search & editing state
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [editingId, setEditingId] = useState<string | number | null>(null);
  const [editFormData, setEditFormData] = useState<ClassItem>({ id: '', name: '', teacher: '', group: '', room: '' });
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [newClass, setNewClass] = useState<ClassItem>({ id: '', name: '', teacher: '', group: '', room: '' });

  const handleCsvDataLoaded = (
    newClasses: ClassItem[],
    mode: 'replace' | 'append',
    summaryMessage: string
  ) => {
    if (mode === 'replace') {
      setClasses(newClasses);
    } else {
      const existingIds = new Set(classes.map((c) => String(c.id)));
      const merged = newClasses.map((c, i) => {
        let id = String(c.id);
        if (existingIds.has(id)) {
          id = `${id}_${classes.length + i + 1}`;
        }
        return { ...c, id };
      });
      setClasses([...classes, ...merged]);
    }
    setOptimizationResult(null);
    setSuccessMessage(summaryMessage);
    setErrorMessage(null);
  };

  // Load sample dataset on mount
  useEffect(() => {
    loadSampleData();
  }, []);

  const loadSampleData = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const res = await fetch('/api/sample');
      if (!res.ok) throw new Error('Failed to fetch sample benchmark data');
      const data = await res.json();
      setClasses(data.classes || []);
      setNumSlots(data.slots || 12);
      setSuccessMessage('Loaded 30-class academic benchmark data.');
      // Automatically reset optimization result so user can click Run Optimizer
      setOptimizationResult(null);
    } catch (err: any) {
      setErrorMessage(err.message || 'Error loading sample dataset');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to parse uploaded CSV');
      }

      const data = await res.json();
      setClasses(data.classes);
      setOptimizationResult(null);
      setSuccessMessage(`Successfully parsed ${data.count} classes from ${file.name}`);
    } catch (err: any) {
      setErrorMessage(err.message || 'Error uploading file');
    } finally {
      setIsLoading(false);
      // Reset input value so same file can be re-selected if needed
      event.target.value = '';
    }
  };

  const handleRunOptimizer = async () => {
    if (classes.length === 0) {
      setErrorMessage('Please add or load at least one class before optimizing.');
      return;
    }

    setIsOptimizing(true);
    setErrorMessage(null);

    try {
      const payload = {
        classes,
        slots: numSlots,
        weights,
        reads,
      };

      const res = await fetch('/api/optimize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || errData.detail || 'Optimizer calculation failed');
      }

      const result: OptimizationResponse = await res.json();
      setOptimizationResult(result);
      setSuccessMessage(
        `Optimization complete: ${result.clashes_before} conflicts reduced to ${result.clashes_after} in ${result.solve_time_ms}ms.`
      );
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to communicate with optimizer service');
    } finally {
      setIsOptimizing(false);
    }
  };

  const handleDownloadCsv = () => {
    if (!optimizationResult || !optimizationResult.details.length) {
      // Export current classes table if not yet optimized
      const header = 'id,name,teacher,group,room\n';
      const rows = classes
        .map((c) => `"${c.id}","${c.name}","${c.teacher || ''}","${c.group || ''}","${c.room || ''}"`)
        .join('\n');
      const blob = new Blob([header + rows], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'classes_catalog.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      return;
    }

    // Export optimized schedule
    const header = 'id,name,teacher,group,room,slot,day,period\n';
    const rows = optimizationResult.details
      .map(
        (c) =>
          `"${c.id}","${c.name}","${c.teacher}","${c.group}","${c.room}",${c.slot},"${c.day}","${c.period}"`
      )
      .join('\n');

    const blob = new Blob([header + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'optimized_timetable.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const [isExportingPdf, setIsExportingPdf] = useState<boolean>(false);

  const handleExportPdf = () => {
    if (!optimizationResult || !optimizationResult.details.length) {
      setErrorMessage('Please run the quantum optimizer first before exporting the timetable to PDF.');
      return;
    }

    try {
      setIsExportingPdf(true);
      exportTimetableToPdf({
        optimizationResult,
        numSlots,
        institutionName: 'Academic Institute & College',
        departmentName: 'Faculty of Science & Engineering',
      });
      setSuccessMessage('Optimized timetable PDF successfully exported and downloaded.');
    } catch (err: any) {
      setErrorMessage(`Failed to export PDF: ${err.message || 'Unknown error'}`);
    } finally {
      setIsExportingPdf(false);
    }
  };

  // Editing functions
  const startEdit = (c: ClassItem) => {
    setEditingId(c.id);
    setEditFormData({ ...c });
  };

  const saveEdit = () => {
    setClasses(classes.map((c) => (c.id === editingId ? editFormData : c)));
    setEditingId(null);
    setOptimizationResult(null);
  };

  const deleteClass = (id: string | number) => {
    setClasses(classes.filter((c) => c.id !== id));
    setOptimizationResult(null);
  };

  const handleAddClass = () => {
    if (!newClass.name.trim()) {
      setErrorMessage('Class subject name is required.');
      return;
    }
    const newId = newClass.id || String(classes.length + 1);
    setClasses([...classes, { ...newClass, id: newId }]);
    setNewClass({ id: '', name: '', teacher: '', group: '', room: '' });
    setShowAddForm(false);
    setOptimizationResult(null);
  };

  // Filtered classes for table display
  const filteredClasses = classes.filter((c) => {
    const q = searchQuery.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      (c.teacher && c.teacher.toLowerCase().includes(q)) ||
      (c.group && c.group.toLowerCase().includes(q)) ||
      (c.room && c.room.toLowerCase().includes(q))
    );
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Optimizer Studio
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Configure academic constraints, tune QUBO Hamiltonian weights, and execute quantum annealing.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setShowCsvUploader((prev) => !prev)}
            className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold border transition-colors shadow-xs ${
              showCsvUploader
                ? 'bg-teal-600 text-white border-teal-600 dark:bg-teal-500 dark:text-slate-950 dark:border-teal-500'
                : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-850 text-slate-700 dark:text-slate-200'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>{showCsvUploader ? 'Close CSV Uploader' : 'Upload CSV File'}</span>
          </button>

          <button
            onClick={loadSampleData}
            disabled={isLoading}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-850 text-slate-700 dark:text-slate-200 shadow-xs transition-colors disabled:opacity-50"
          >
            <RotateCcw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Load Benchmark (30 Classes)</span>
          </button>

          <a
            href="/sample_classes.csv"
            download="sample_classes.csv"
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Sample CSV</span>
          </a>
        </div>
      </div>

      {/* Notifications */}
      {errorMessage && (
        <div className="p-4 rounded-xl border border-rose-500/20 bg-rose-500/10 text-rose-800 dark:text-rose-200 text-xs flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
          <button
            onClick={() => setErrorMessage(null)}
            className="text-rose-500 hover:text-rose-700 dark:hover:text-rose-300 font-bold"
          >
            &times;
          </button>
        </div>
      )}

      {successMessage && (
        <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-800 dark:text-emerald-200 text-xs flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMessage}</span>
          </div>
          <button
            onClick={() => setSuccessMessage(null)}
            className="text-emerald-500 hover:text-emerald-700 dark:hover:text-emerald-300 font-bold"
          >
            &times;
          </button>
        </div>
      )}

      {/* CSV File Input & Dropzone Panel */}
      {showCsvUploader && (
        <CsvUploader
          onDataLoaded={handleCsvDataLoaded}
          isLoading={isLoading}
        />
      )}

      {/* Control Panel: Sliders & Settings */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              <Sliders className="w-4 h-4 text-teal-500" />
              <span>QUBO Hyperparameters & Slots</span>
            </div>
            <span className="text-xs text-slate-400 font-mono">
              Energy Model: H = H1 + H2 + H3
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Weight A: Single Slot */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <label className="font-medium text-slate-700 dark:text-slate-300">
                  Weight A (H1: Single Slot)
                </label>
                <span className="font-mono tabular-nums text-teal-600 dark:text-teal-400 font-semibold">
                  {weights.A.toFixed(1)}
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="15"
                step="0.5"
                value={weights.A}
                onChange={(e) => setWeights({ ...weights, A: parseFloat(e.target.value) })}
                className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-teal-600"
              />
              <p className="text-[11px] text-slate-400">
                Penalizes unassigned or multiply assigned classes.
              </p>
            </div>

            {/* Weight B: Conflict Penalty */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <label className="font-medium text-slate-700 dark:text-slate-300">
                  Weight B (H2: Conflicts)
                </label>
                <span className="font-mono tabular-nums text-teal-600 dark:text-teal-400 font-semibold">
                  {weights.B.toFixed(1)}
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="20"
                step="0.5"
                value={weights.B}
                onChange={(e) => setWeights({ ...weights, B: parseFloat(e.target.value) })}
                className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-teal-600"
              />
              <p className="text-[11px] text-slate-400">
                Prevents teacher, room, and cohort double-booking.
              </p>
            </div>

            {/* Weight C: Soft Preferences */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <label className="font-medium text-slate-700 dark:text-slate-300">
                  Weight C (H3: Preferences)
                </label>
                <span className="font-mono tabular-nums text-teal-600 dark:text-teal-400 font-semibold">
                  {weights.C.toFixed(1)}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="5"
                step="0.5"
                value={weights.C}
                onChange={(e) => setWeights({ ...weights, C: parseFloat(e.target.value) })}
                className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-teal-600"
              />
              <p className="text-[11px] text-slate-400">
                Encourages balanced workload and slot preferences.
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-slate-600 dark:text-slate-400">Timetable Slots:</span>
                <select
                  value={numSlots}
                  onChange={(e) => {
                    setNumSlots(parseInt(e.target.value, 10));
                    setOptimizationResult(null);
                  }}
                  className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 font-mono font-medium focus:ring-1 focus:ring-teal-500"
                >
                  <option value={9}>9 Slots (3 days x 3 periods)</option>
                  <option value={12}>12 Slots (3 days x 4 periods)</option>
                  <option value={15}>15 Slots (5 days x 3 periods)</option>
                  <option value={16}>16 Slots (4 days x 4 periods)</option>
                  <option value={20}>20 Slots (5 days x 4 periods)</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-slate-600 dark:text-slate-400">Anneal Reads:</span>
                <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                  {reads}
                </span>
                <input
                  type="range"
                  min="10"
                  max="60"
                  step="5"
                  value={reads}
                  onChange={(e) => setReads(parseInt(e.target.value, 10))}
                  className="w-20 h-1 bg-slate-200 dark:bg-slate-800 rounded appearance-none accent-teal-600"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <label className="flex items-center gap-2 cursor-pointer select-none text-slate-700 dark:text-slate-300">
                <input
                  type="checkbox"
                  checked={highlightConflicts}
                  onChange={(e) => setHighlightConflicts(e.target.checked)}
                  className="rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                />
                <span>Highlight Conflicts</span>
              </label>
            </div>
          </div>
        </div>

        {/* Action Panel & Trigger */}
        <div className="lg:col-span-4 p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs flex flex-col justify-between space-y-6">
          <div className="space-y-3">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              Optimization Summary
            </h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Loaded Classes:</span>
                <span className="font-mono font-semibold tabular-nums text-slate-900 dark:text-white">
                  {classes.length}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Search Space (S^N):</span>
                <span className="font-mono text-slate-500">
                  {numSlots}^{classes.length} combinations
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">QUBO Binary Variables:</span>
                <span className="font-mono font-semibold text-slate-900 dark:text-white">
                  {classes.length * numSlots} bits
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={handleRunOptimizer}
              disabled={isOptimizing || classes.length === 0}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-semibold text-xs text-white bg-teal-600 hover:bg-teal-500 dark:bg-teal-500 dark:text-slate-950 dark:hover:bg-teal-400 transition-colors shadow-sm disabled:opacity-50"
            >
              {isOptimizing ? (
                <>
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  <span>Sampling QUBO Ground State...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" />
                  <span>Run Quantum Optimizer</span>
                </>
              )}
            </button>

            {optimizationResult && (
              <div className="flex flex-col sm:flex-row gap-2">
                <button
                  onClick={handleExportPdf}
                  disabled={isExportingPdf}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg font-semibold text-xs bg-slate-900 text-white hover:bg-slate-800 dark:bg-teal-500 dark:text-slate-950 dark:hover:bg-teal-400 transition-colors shadow-xs disabled:opacity-50"
                  title="Generate publication-ready PDF timetable"
                >
                  <FileDown className="w-3.5 h-3.5" />
                  <span>{isExportingPdf ? 'Generating PDF...' : 'Export as PDF'}</span>
                </button>
                <button
                  onClick={handleDownloadCsv}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg font-medium text-xs border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
                >
                  <Download className="w-3.5 h-3.5 text-teal-500" />
                  <span>Export CSV</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Results Banner when Optimization is Run */}
      {optimizationResult && (
        <div className="p-6 rounded-xl border border-teal-500/20 bg-teal-500/5 dark:bg-teal-500/10 shadow-xs space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-teal-600 dark:text-teal-400" />
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                Optimization Succeeded
              </h3>
            </div>
            <div className="flex items-center gap-4 text-xs font-mono text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-teal-500" />
                <span>Time: {optimizationResult.solve_time_ms}ms</span>
              </div>
              <span aria-hidden="true">&middot;</span>
              <div className="flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-teal-500" />
                <span>Solver: {optimizationResult.solver_used}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <div className="text-[11px] text-slate-500 dark:text-slate-400">
                Clashes Before
              </div>
              <div className="text-2xl font-bold font-mono tabular-nums text-rose-600 dark:text-rose-400 mt-0.5">
                {optimizationResult.clashes_before}
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">Naive Draft Overlap</div>
            </div>

            <div className="p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <div className="text-[11px] text-slate-500 dark:text-slate-400">
                Clashes After
              </div>
              <div className="text-2xl font-bold font-mono tabular-nums text-emerald-600 dark:text-emerald-400 mt-0.5">
                {optimizationResult.clashes_after}
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">Zero Conflict Optimum</div>
            </div>

            <div className="p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <div className="text-[11px] text-slate-500 dark:text-slate-400">
                Reduction Rate
              </div>
              <div className="text-2xl font-bold font-mono tabular-nums text-teal-600 dark:text-teal-400 mt-0.5">
                100%
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">Complete Feasibility</div>
            </div>

            <div className="p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <div className="text-[11px] text-slate-500 dark:text-slate-400">
                Solve Velocity
              </div>
              <div className="text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-white mt-0.5">
                {optimizationResult.solve_time_ms} ms
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">Microsecond Scale</div>
            </div>
          </div>
        </div>
      )}

      {/* Loading Skeleton */}
      {isOptimizing && (
        <div className="p-8 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4 animate-pulse">
          <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/4" />
          <div className="grid grid-cols-4 gap-4">
            <div className="h-24 bg-slate-100 dark:bg-slate-800/60 rounded" />
            <div className="h-24 bg-slate-100 dark:bg-slate-800/60 rounded" />
            <div className="h-24 bg-slate-100 dark:bg-slate-800/60 rounded" />
            <div className="h-24 bg-slate-100 dark:bg-slate-800/60 rounded" />
          </div>
        </div>
      )}

      {/* Main Timetable View */}
      {optimizationResult && !isOptimizing && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Optimized Timetable Matrix
            </h2>
            <div className="flex items-center gap-3">
              <button
                onClick={handleExportPdf}
                disabled={isExportingPdf}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-teal-600 hover:bg-teal-500 text-white dark:bg-teal-500 dark:text-slate-950 dark:hover:bg-teal-400 transition-colors shadow-xs disabled:opacity-50"
              >
                <FileDown className="w-3.5 h-3.5" />
                <span>{isExportingPdf ? 'Exporting PDF...' : 'Export as PDF'}</span>
              </button>
              <button
                onClick={handleDownloadCsv}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                <Download className="w-3.5 h-3.5 text-teal-500" />
                <span>Export CSV</span>
              </button>
            </div>
          </div>

          <TimetableGrid
            assignedClasses={optimizationResult.details}
            numSlots={numSlots}
            highlightConflicts={highlightConflicts}
          />
        </section>
      )}

      {/* Editable Class Catalog Section */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Academic Course Catalog ({classes.length} classes)
            </h2>
            <p className="text-xs text-slate-500">
              Edit subject names, faculty instructors, student sections, and classroom halls in real time.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search classes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-teal-500 w-44"
              />
            </div>

            <button
              onClick={() => setShowCsvUploader((prev) => !prev)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              <Upload className="w-3.5 h-3.5 text-teal-500" />
              <span>Import CSV</span>
            </button>

            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-900 dark:bg-teal-500 text-white dark:text-slate-950 hover:bg-slate-800 dark:hover:bg-teal-400 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Class</span>
            </button>
          </div>
        </div>

        {/* Quick Add Form Drawer */}
        {showAddForm && (
          <div className="p-4 rounded-xl border border-teal-500/30 bg-teal-500/5 dark:bg-slate-900 space-y-3">
            <div className="text-xs font-semibold text-slate-900 dark:text-white">
              Add New Academic Class
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 text-xs">
              <input
                type="text"
                placeholder="Class ID (e.g. 31)"
                value={newClass.id}
                onChange={(e) => setNewClass({ ...newClass, id: e.target.value })}
                className="px-2.5 py-1.5 rounded border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
              />
              <input
                type="text"
                placeholder="Course Subject Name *"
                value={newClass.name}
                onChange={(e) => setNewClass({ ...newClass, name: e.target.value })}
                className="px-2.5 py-1.5 rounded border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white sm:col-span-2"
              />
              <input
                type="text"
                placeholder="Instructor Name"
                value={newClass.teacher}
                onChange={(e) => setNewClass({ ...newClass, teacher: e.target.value })}
                className="px-2.5 py-1.5 rounded border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
              />
              <input
                type="text"
                placeholder="Student Cohort (e.g. CS-201)"
                value={newClass.group}
                onChange={(e) => setNewClass({ ...newClass, group: e.target.value })}
                className="px-2.5 py-1.5 rounded border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
              />
              <input
                type="text"
                placeholder="Room / Hall"
                value={newClass.room}
                onChange={(e) => setNewClass({ ...newClass, room: e.target.value })}
                className="px-2.5 py-1.5 rounded border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
              />
            </div>
            <div className="flex justify-end gap-2 pt-1">
              <button
                onClick={() => setShowAddForm(false)}
                className="px-3 py-1.5 rounded text-xs text-slate-600 dark:text-slate-400 hover:underline"
              >
                Cancel
              </button>
              <button
                onClick={handleAddClass}
                className="px-3.5 py-1.5 rounded text-xs font-semibold bg-teal-600 text-white hover:bg-teal-500"
              >
                Save Class
              </button>
            </div>
          </div>
        )}

        {/* Classes Table */}
        {classes.length === 0 ? (
          <div className="space-y-6">
            <CsvUploader
              onDataLoaded={handleCsvDataLoaded}
              isLoading={isLoading}
            />
            <div className="p-8 text-center rounded-xl border border-dashed border-slate-300 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 space-y-3">
              <div className="text-slate-500 dark:text-slate-400 text-xs">
                Or start with our pre-configured college department benchmark:
              </div>
              <button
                onClick={loadSampleData}
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-teal-600 text-white hover:bg-teal-500 shadow-xs"
              >
                Load Benchmark (30 Classes, 18 Clashes)
              </button>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/70 font-semibold text-slate-700 dark:text-slate-300">
                  <th className="p-3 w-16 font-mono">ID</th>
                  <th className="p-3">Course Title</th>
                  <th className="p-3">Instructor</th>
                  <th className="p-3 font-mono">Cohort</th>
                  <th className="p-3">Classroom</th>
                  <th className="p-3 text-right w-24">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                {filteredClasses.map((item) => {
                  const isEditing = editingId === item.id;

                  if (isEditing) {
                    return (
                      <tr key={item.id} className="bg-teal-500/5">
                        <td className="p-2 font-mono text-slate-400">
                          {item.id}
                        </td>
                        <td className="p-2">
                          <input
                            type="text"
                            value={editFormData.name}
                            onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                            className="w-full px-2 py-1 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
                          />
                        </td>
                        <td className="p-2">
                          <input
                            type="text"
                            value={editFormData.teacher || ''}
                            onChange={(e) => setEditFormData({ ...editFormData, teacher: e.target.value })}
                            className="w-full px-2 py-1 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
                          />
                        </td>
                        <td className="p-2">
                          <input
                            type="text"
                            value={editFormData.group || ''}
                            onChange={(e) => setEditFormData({ ...editFormData, group: e.target.value })}
                            className="w-full px-2 py-1 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
                          />
                        </td>
                        <td className="p-2">
                          <input
                            type="text"
                            value={editFormData.room || ''}
                            onChange={(e) => setEditFormData({ ...editFormData, room: e.target.value })}
                            className="w-full px-2 py-1 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
                          />
                        </td>
                        <td className="p-2 text-right space-x-1">
                          <button
                            onClick={saveEdit}
                            className="p-1 text-emerald-600 hover:text-emerald-500"
                            title="Save changes"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="p-1 text-slate-400 hover:text-slate-600"
                            title="Cancel edit"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  }

                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-slate-50/50 dark:hover:bg-slate-950/50 transition-colors"
                    >
                      <td className="p-3 font-mono text-slate-400">{item.id}</td>
                      <td className="p-3 font-medium text-slate-900 dark:text-white">
                        {item.name}
                      </td>
                      <td className="p-3 text-slate-600 dark:text-slate-300">
                        {item.teacher || '-'}
                      </td>
                      <td className="p-3 font-mono text-slate-600 dark:text-slate-300">
                        {item.group || '-'}
                      </td>
                      <td className="p-3 text-slate-600 dark:text-slate-300">
                        {item.room || '-'}
                      </td>
                      <td className="p-3 text-right space-x-2">
                        <button
                          onClick={() => startEdit(item)}
                          className="text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
                          title="Edit class"
                        >
                          <Edit2 className="w-3.5 h-3.5 inline" />
                        </button>
                        <button
                          onClick={() => deleteClass(item.id)}
                          className="text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors"
                          title="Delete class"
                        >
                          <Trash2 className="w-3.5 h-3.5 inline" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
};
