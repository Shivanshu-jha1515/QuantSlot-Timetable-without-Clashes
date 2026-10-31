import React, { useRef, useState } from 'react';
import { Upload, FileSpreadsheet, CheckCircle2, AlertCircle, RefreshCw, X, Download } from 'lucide-react';
import { ClassItem } from '../types';
import { parseCSVClasses, CSVParseResult } from '../utils/csvParser';

interface CsvUploaderProps {
  onDataLoaded: (classes: ClassItem[], mode: 'replace' | 'append', summaryMessage: string) => void;
  isLoading?: boolean;
}

export const CsvUploader: React.FC<CsvUploaderProps> = ({ onDataLoaded, isLoading = false }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [parseResult, setParseResult] = useState<CSVParseResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [importMode, setImportMode] = useState<'replace' | 'append'>('replace');

  const processFile = async (file: File) => {
    setError(null);
    if (!file.name.toLowerCase().endsWith('.csv') && file.type !== 'text/csv') {
      setError('Please select a valid CSV (.csv) file.');
      return;
    }

    try {
      setSelectedFile(file);
      const text = await file.text();
      const parsed = parseCSVClasses(text);
      setParseResult(parsed);

      // Auto-apply or provide clear confirmation
      const msg = `Successfully loaded ${parsed.totalRows} courses from "${file.name}".`;
      onDataLoaded(parsed.classes, importMode, msg);
    } catch (err: any) {
      setError(err.message || 'Failed to parse CSV file.');
      setParseResult(null);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
    // reset input so the same file can be re-selected if updated
    if (e.target) {
      e.target.value = '';
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const resetSelection = () => {
    setSelectedFile(null);
    setParseResult(null);
    setError(null);
  };

  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center">
            <Upload className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              Upload Academic Schedule CSV
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Import custom course catalog, room allocations, faculty assignments, and cohort data.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg text-xs">
            <button
              type="button"
              onClick={() => setImportMode('replace')}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                importMode === 'replace'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Replace Catalog
            </button>
            <button
              type="button"
              onClick={() => setImportMode('append')}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                importMode === 'append'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Append
            </button>
          </div>

          <a
            href="/sample_classes.csv"
            download="sample_classes.csv"
            className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-teal-600 dark:text-teal-400 hover:underline"
            title="Download CSV reference template"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Sample Template</span>
          </a>
        </div>
      </div>

      {/* Dropzone & File Input Box */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`relative rounded-xl border-2 border-dashed transition-all p-6 text-center flex flex-col items-center justify-center gap-3 ${
          dragActive
            ? 'border-teal-500 bg-teal-500/10'
            : 'border-slate-200 dark:border-slate-800 hover:border-teal-500/50 dark:hover:border-teal-500/50 bg-slate-50/50 dark:bg-slate-950/50'
        }`}
      >
        <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400">
          <FileSpreadsheet className="w-6 h-6 text-teal-600 dark:text-teal-400" />
        </div>

        <div className="space-y-1">
          <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">
            Drag & drop your CSV file here, or{' '}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="text-teal-600 dark:text-teal-400 hover:underline font-bold"
            >
              browse computer
            </button>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            Supports standard headers: <code className="font-mono text-slate-700 dark:text-slate-300">name</code>, <code className="font-mono text-slate-700 dark:text-slate-300">teacher</code>, <code className="font-mono text-slate-700 dark:text-slate-300">room</code>, <code className="font-mono text-slate-700 dark:text-slate-300">group</code>, <code className="font-mono text-slate-700 dark:text-slate-300">id</code> (or synonyms like <code className="font-mono text-slate-700 dark:text-slate-300">course</code>, <code className="font-mono text-slate-700 dark:text-slate-300">faculty</code>, <code className="font-mono text-slate-700 dark:text-slate-300">classroom</code>).
          </p>
        </div>

        {/* Visible file input with custom accessible layout */}
        <div className="flex items-center gap-3 pt-1">
          <input
            ref={fileInputRef}
            type="file"
            id="csv-file-input"
            accept=".csv,text/csv"
            onChange={handleFileChange}
            disabled={isLoading}
            className="block text-xs text-slate-500 dark:text-slate-400 file:mr-4 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-teal-600 file:text-white hover:file:bg-teal-500 dark:file:bg-teal-500 dark:file:text-slate-950 dark:hover:file:bg-teal-400 file:cursor-pointer cursor-pointer"
          />
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="p-3 rounded-lg border border-rose-500/20 bg-rose-500/10 text-rose-800 dark:text-rose-200 text-xs flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
            <span>{error}</span>
          </div>
          <button
            type="button"
            onClick={() => setError(null)}
            className="text-rose-500 hover:text-rose-700 dark:hover:text-rose-300"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Parse Result Summary */}
      {parseResult && selectedFile && (
        <div className="p-4 rounded-lg border border-teal-500/20 bg-teal-500/5 dark:bg-teal-500/10 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              <span className="text-xs font-semibold text-slate-900 dark:text-white">
                Parsed {parseResult.totalRows} Courses from "{selectedFile.name}"
              </span>
            </div>
            <button
              type="button"
              onClick={resetSelection}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs flex items-center gap-1"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Clear</span>
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            <div className="p-2 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] text-slate-400 block">Course Column:</span>
              <span className="font-mono text-slate-800 dark:text-slate-200 truncate block">
                {parseResult.detectedColumns.course || 'Detected'}
              </span>
            </div>
            <div className="p-2 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] text-slate-400 block">Faculty Column:</span>
              <span className="font-mono text-slate-800 dark:text-slate-200 truncate block">
                {parseResult.detectedColumns.teacher || 'Detected'}
              </span>
            </div>
            <div className="p-2 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] text-slate-400 block">Room Column:</span>
              <span className="font-mono text-slate-800 dark:text-slate-200 truncate block">
                {parseResult.detectedColumns.room || 'Detected'}
              </span>
            </div>
            <div className="p-2 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] text-slate-400 block">Cohort Column:</span>
              <span className="font-mono text-slate-800 dark:text-slate-200 truncate block">
                {parseResult.detectedColumns.group || 'Detected'}
              </span>
            </div>
          </div>

          {parseResult.warnings.length > 0 && (
            <div className="text-[11px] text-amber-600 dark:text-amber-400">
              {parseResult.warnings.join(' ')}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
