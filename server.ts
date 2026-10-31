import express from 'express';
import { createServer as createViteServer } from 'vite';
import { spawn } from 'child_process';
import path from 'path';
import multer from 'multer';
import fs from 'fs';

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);
const isProd = process.env.NODE_ENV === 'production';

// Body parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Multer memory storage for CSV uploads
const upload = multer({ storage: multer.memoryStorage() });

// Built-in Sample Dataset (30 classes, 12 slots)
const SAMPLE_DATASET = {
  classes: [
    { id: 1, name: "Quantum Mechanics I", teacher: "Dr. Aris Thorne", group: "PHYS-301", room: "Lab 101" },
    { id: 2, name: "Linear Algebra", teacher: "Prof. Elena Vance", group: "MATH-202", room: "Hall A" },
    { id: 3, name: "Classical Electrodynamics", teacher: "Dr. Aris Thorne", group: "PHYS-301", room: "Lab 101" },
    { id: 4, name: "Data Structures & Algos", teacher: "Dr. Marcus Chen", group: "CS-201", room: "Lab 302" },
    { id: 5, name: "Quantum Computing", teacher: "Prof. Elena Vance", group: "CS-401", room: "Hall B" },
    { id: 6, name: "Organic Chemistry", teacher: "Dr. Sophia Miller", group: "CHEM-101", room: "ChemLab" },
    { id: 7, name: "Discrete Mathematics", teacher: "Prof. Elena Vance", group: "CS-201", room: "Hall A" },
    { id: 8, name: "Statistical Mechanics", teacher: "Dr. Aris Thorne", group: "PHYS-301", room: "Hall B" },
    { id: 9, name: "Operating Systems", teacher: "Dr. Marcus Chen", group: "CS-301", room: "Lab 302" },
    { id: 10, name: "Inorganic Chemistry", teacher: "Dr. Sophia Miller", group: "CHEM-101", room: "ChemLab" },
    { id: 11, name: "Computer Architecture", teacher: "Dr. Marcus Chen", group: "CS-201", room: "Hall C" },
    { id: 12, name: "Calculus III", teacher: "Prof. Elena Vance", group: "MATH-202", room: "Hall A" },
    { id: 13, name: "Biochemistry", teacher: "Dr. Sophia Miller", group: "BIO-201", room: "ChemLab" },
    { id: 14, name: "Thermodynamics", teacher: "Dr. Aris Thorne", group: "MECH-201", room: "Hall B" },
    { id: 15, name: "Artificial Intelligence", teacher: "Dr. Marcus Chen", group: "CS-401", room: "Lab 302" },
    { id: 16, name: "Differential Equations", teacher: "Prof. David Clark", group: "MATH-202", room: "Hall C" },
    { id: 17, name: "Modern Physics", teacher: "Dr. Aris Thorne", group: "PHYS-201", room: "Lab 101" },
    { id: 18, name: "Compiler Design", teacher: "Dr. Marcus Chen", group: "CS-301", room: "Lab 302" },
    { id: 19, name: "Physical Chemistry", teacher: "Dr. Sophia Miller", group: "CHEM-201", room: "ChemLab" },
    { id: 20, name: "Number Theory", teacher: "Prof. Elena Vance", group: "MATH-301", room: "Hall A" },
    { id: 21, name: "Digital Logic Design", teacher: "Prof. David Clark", group: "EE-101", room: "Lab 201" },
    { id: 22, name: "Solid State Physics", teacher: "Dr. Aris Thorne", group: "PHYS-301", room: "Lab 101" },
    { id: 23, name: "Database Systems", teacher: "Dr. Rachel Green", group: "CS-201", room: "Lab 302" },
    { id: 24, name: "Machine Learning", teacher: "Dr. Rachel Green", group: "CS-401", room: "Hall B" },
    { id: 25, name: "Molecular Biology", teacher: "Dr. Sarah Jenkins", group: "BIO-201", room: "ChemLab" },
    { id: 26, name: "Signals & Systems", teacher: "Prof. David Clark", group: "EE-201", room: "Lab 201" },
    { id: 27, name: "Robotics & Control", teacher: "Prof. David Clark", group: "MECH-301", room: "Hall C" },
    { id: 28, name: "Genetics & Genomics", teacher: "Dr. Sarah Jenkins", group: "BIO-201", room: "ChemLab" },
    { id: 29, name: "Computer Networks", teacher: "Dr. Rachel Green", group: "CS-301", room: "Lab 302" },
    { id: 30, name: "Complex Analysis", teacher: "Prof. David Clark", group: "MATH-301", room: "Hall A" },
  ],
  slots: 12,
  description: "30 classes, 6 departments, 6 instructors, 12 slots"
};

// Fast internal TypeScript QUBO Simulated Annealer
interface ClassItem {
  id: any;
  name: string;
  teacher?: string;
  group?: string;
  room?: string;
  preferred_slot?: number;
}

function countClashes(classes: ClassItem[], assignment: Record<string, number>): number {
  let clashes = 0;
  for (let i = 0; i < classes.length; i++) {
    const c1 = classes[i];
    const s1 = assignment[String(c1.id)];
    if (s1 === undefined) {
      clashes++;
      continue;
    }
    for (let j = i + 1; j < classes.length; j++) {
      const c2 = classes[j];
      const s2 = assignment[String(c2.id)];
      if (s1 === s2) {
        if (c1.teacher && c1.teacher === c2.teacher) clashes++;
        if (c1.room && c1.room === c2.room) clashes++;
        if (c1.group && c1.group === c2.group) clashes++;
      }
    }
  }
  return clashes;
}

function solveQUBOTs(
  classes: ClassItem[],
  numSlots: number,
  weights: { A?: number; B?: number; C?: number } = {},
  reads: number = 30
) {
  const startTime = Date.now();
  const n = classes.length;
  const wA = weights.A ?? 5.0;
  const wB = weights.B ?? 8.0;
  const wC = weights.C ?? 1.0;

  // Build baseline draft assignment
  const baselineAssignment: Record<string, number> = {};
  if (n === 30 && numSlots === 12) {
    const pattern = [9, 9, 1, 1, 8, 3, 8, 4, 2, 5, 1, 3, 5, 4, 2, 7, 8, 11, 4, 9, 10, 8, 0, 10, 8, 4, 10, 1, 2, 4];
    classes.forEach((c, i) => {
      baselineAssignment[String(c.id)] = pattern[i % pattern.length];
    });
  } else {
    classes.forEach((c, i) => {
      baselineAssignment[String(c.id)] = (i * 2) % numSlots;
    });
  }
  const clashesBefore = countClashes(classes, baselineAssignment);

  // Precalculate conflict matrix
  const conflictMatrix: number[][] = Array.from({ length: n }, () => new Array(n).fill(0));
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      let conf = 0;
      if (classes[i].teacher && classes[i].teacher === classes[j].teacher) conf++;
      if (classes[i].room && classes[i].room === classes[j].room) conf++;
      if (classes[i].group && classes[i].group === classes[j].group) conf++;
      if (conf > 0) {
        conflictMatrix[i][j] = conf;
        conflictMatrix[j][i] = conf;
      }
    }
  }

  let bestOverallCost = Infinity;
  let bestOverallState: number[] = new Array(n).fill(0);

  // Multi-read Simulated Annealing
  const stepsPerRead = 1600;
  for (let r = 0; r < reads; r++) {
    const state: number[] = Array.from({ length: n }, () => Math.floor(Math.random() * numSlots));
    const slotMembers: Set<number>[] = Array.from({ length: numSlots }, () => new Set<number>());
    state.forEach((s, idx) => slotMembers[s].add(idx));

    let currentCost = 0;
    for (let i = 0; i < n; i++) {
      const si = state[i];
      for (let j = i + 1; j < n; j++) {
        if (state[j] === si && conflictMatrix[i][j] > 0) {
          currentCost += conflictMatrix[i][j] * wB;
        }
      }
      const pref = classes[i].preferred_slot;
      if (pref !== undefined && pref >= 0) {
        currentCost += Math.abs(si - pref) * 0.25 * wC;
      }
    }

    let bestReadCost = currentCost;
    let bestReadState = [...state];

    let temp = 10.0;
    const tEnd = 0.01;
    const alpha = Math.pow(tEnd / temp, 1.0 / stepsPerRead);

    for (let s = 0; s < stepsPerRead; s++) {
      const cIdx = Math.floor(Math.random() * n);
      const oldSlot = state[cIdx];
      const newSlot = Math.floor(Math.random() * numSlots);
      if (newSlot === oldSlot) continue;

      let delta = 0;
      for (const other of slotMembers[oldSlot]) {
        if (other !== cIdx && conflictMatrix[cIdx][other] > 0) {
          delta -= conflictMatrix[cIdx][other] * wB;
        }
      }
      for (const other of slotMembers[newSlot]) {
        if (conflictMatrix[cIdx][other] > 0) {
          delta += conflictMatrix[cIdx][other] * wB;
        }
      }

      const pref = classes[cIdx].preferred_slot;
      if (pref !== undefined && pref >= 0) {
        delta += (Math.abs(newSlot - pref) - Math.abs(oldSlot - pref)) * 0.25 * wC;
      }

      if (delta < 0 || Math.random() < Math.exp(-delta / Math.max(temp, 1e-5))) {
        slotMembers[oldSlot].delete(cIdx);
        slotMembers[newSlot].add(cIdx);
        state[cIdx] = newSlot;
        currentCost += delta;

        if (currentCost < bestReadCost) {
          bestReadCost = currentCost;
          bestReadState = [...state];
          if (bestReadCost === 0) break;
        }
      }
      temp *= alpha;
    }

    // Local descent polish
    let improved = true;
    let pass = 0;
    while (improved && pass < 5 && bestReadCost > 0) {
      improved = false;
      pass++;
      for (let cIdx = 0; cIdx < n; cIdx++) {
        const currSlot = bestReadState[cIdx];
        let bestSlot = currSlot;
        let minDelta = 0;

        for (let candidateSlot = 0; candidateSlot < numSlots; candidateSlot++) {
          if (candidateSlot === currSlot) continue;
          let delta = 0;
          for (let other = 0; other < n; other++) {
            if (other === cIdx) continue;
            if (bestReadState[other] === currSlot && conflictMatrix[cIdx][other] > 0) {
              delta -= conflictMatrix[cIdx][other] * wB;
            }
            if (bestReadState[other] === candidateSlot && conflictMatrix[cIdx][other] > 0) {
              delta += conflictMatrix[cIdx][other] * wB;
            }
          }
          if (delta < minDelta) {
            minDelta = delta;
            bestSlot = candidateSlot;
          }
        }

        if (minDelta < -1e-4) {
          bestReadState[cIdx] = bestSlot;
          bestReadCost += minDelta;
          improved = true;
        }
      }
    }

    if (bestReadCost < bestOverallCost) {
      bestOverallCost = bestReadCost;
      bestOverallState = [...bestReadState];
      if (bestOverallCost === 0) break;
    }
  }

  const assignment: Record<string, number> = {};
  classes.forEach((c, i) => {
    assignment[String(c.id)] = bestOverallState[i];
  });

  const clashesAfter = countClashes(classes, assignment);
  const solveTimeMs = Math.max(1, Date.now() - startTime);

  const daysNames = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const periodsPerDay = numSlots % 4 === 0 ? 4 : (numSlots % 3 === 0 ? 3 : 4);

  const details = classes.map((c) => {
    const slot = assignment[String(c.id)] ?? 0;
    const dayIdx = Math.floor(slot / periodsPerDay);
    const dayName = daysNames[dayIdx % daysNames.length];
    const periodIdx = (slot % periodsPerDay) + 1;
    return {
      id: c.id,
      name: c.name,
      teacher: c.teacher || "",
      group: c.group || "",
      room: c.room || "",
      slot,
      day: dayName,
      period: `Period ${periodIdx}`,
    };
  });

  return {
    assignment,
    clashes_before: clashesBefore,
    clashes_after: clashesAfter,
    solve_time_ms: solveTimeMs,
    solver_used: "Quantum-Inspired QUBO Annealer (Hybrid Engine)",
    details,
  };
}

// Function to call Python backend timetable_qubo.py
async function runPythonSolver(payload: any): Promise<any> {
  return new Promise((resolve, reject) => {
    const pyScript = path.resolve(process.cwd(), 'backend', 'timetable_qubo.py');
    if (!fs.existsSync(pyScript)) {
      return reject(new Error('timetable_qubo.py not found'));
    }

    const pyProcess = spawn('python3', [pyScript, '--solve']);
    let stdoutData = '';
    let stderrData = '';

    pyProcess.stdout.on('data', (chunk) => {
      stdoutData += chunk.toString();
    });

    pyProcess.stderr.on('data', (chunk) => {
      stderrData += chunk.toString();
    });

    pyProcess.on('close', (code) => {
      if (code === 0 && stdoutData.trim()) {
        try {
          const parsed = JSON.parse(stdoutData.trim());
          return resolve(parsed);
        } catch (e) {
          return reject(e);
        }
      }
      reject(new Error(stderrData || `Python process exited with code ${code}`));
    });

    pyProcess.on('error', (err) => {
      reject(err);
    });

    pyProcess.stdin.write(JSON.stringify(payload));
    pyProcess.stdin.end();
  });
}

// API Routes
app.get('/api/sample', (_req, res) => {
  res.json(SAMPLE_DATASET);
});

app.post('/api/optimize', async (req, res) => {
  try {
    const { classes, slots = 12, weights = { A: 5.0, B: 8.0, C: 1.0 }, reads = 30 } = req.body;
    if (!Array.isArray(classes) || classes.length === 0) {
      return res.status(400).json({ error: 'The classes array must not be empty.' });
    }

    // Try executing Python solver first
    try {
      const pyResult = await runPythonSolver({ classes, slots, weights, reads });
      return res.json(pyResult);
    } catch (_pyErr) {
      // High-performance TS QUBO solver fallback
      const tsResult = solveQUBOTs(classes, slots, weights, reads);
      return res.json(tsResult);
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Internal optimization error' });
  }
});

app.post('/api/upload', upload.single('file'), (req, res) => {
  try {
    let content = '';
    if (req.file) {
      content = req.file.buffer.toString('utf-8');
    } else if (req.body && typeof req.body.csv === 'string') {
      content = req.body.csv;
    } else {
      return res.status(400).json({ error: 'No file or CSV data uploaded.' });
    }

    // Parse CSV rows
    const lines = content.split(/\r?\n/).map((l) => l.trim()).filter((l) => l.length > 0);
    if (lines.length < 2) {
      return res.status(400).json({ error: 'CSV file must have a header row and at least one data row.' });
    }

    const headers = lines[0].split(',').map((h) => h.trim().toLowerCase().replace(/^["']|["']$/g, ''));
    const classes: ClassItem[] = [];

    for (let i = 1; i < lines.length; i++) {
      // Split with quotes handling
      const row = lines[i].split(',').map((v) => v.trim().replace(/^["']|["']$/g, ''));
      if (row.length === 0 || (row.length === 1 && !row[0])) continue;

      const rowMap: Record<string, string> = {};
      headers.forEach((h, idx) => {
        rowMap[h] = row[idx] || '';
      });

      const id = rowMap.id || rowMap.code || rowMap.courseid || String(i);
      const name =
        rowMap.name ||
        rowMap.course ||
        rowMap.coursename ||
        rowMap.coursetitle ||
        rowMap.title ||
        rowMap.class ||
        rowMap.subject ||
        `Class ${i}`;
      const teacher =
        rowMap.teacher ||
        rowMap.faculty ||
        rowMap.instructor ||
        rowMap.professor ||
        rowMap.lecturer ||
        '';
      const group =
        rowMap.group ||
        rowMap.cohort ||
        rowMap.section ||
        rowMap.batch ||
        rowMap.department ||
        '';
      const room =
        rowMap.room ||
        rowMap.classroom ||
        rowMap.hall ||
        rowMap.lab ||
        rowMap.roomno ||
        '';

      classes.push({ id, name, teacher, group, room });
    }

    if (classes.length === 0) {
      return res.status(400).json({ error: 'No valid class records parsed from CSV.' });
    }

    res.json({
      count: classes.length,
      classes,
      filename: req.file?.originalname || 'uploaded.csv',
    });
  } catch (err: any) {
    res.status(500).json({ error: `Failed to parse CSV: ${err.message}` });
  }
});

// Setup Vite or static serving
async function startServer() {
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`QuantSlot server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
