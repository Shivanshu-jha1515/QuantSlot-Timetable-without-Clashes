import { ClassItem } from '../types';

export interface CSVParseResult {
  classes: ClassItem[];
  detectedColumns: {
    course: string | null;
    teacher: string | null;
    room: string | null;
    group: string | null;
    id: string | null;
  };
  totalRows: number;
  warnings: string[];
}

/**
 * Splits CSV line respecting double quotes and escaped quotes
 */
function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++; // skip next quote
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

/**
 * Parses raw CSV text containing course, room, faculty, cohort data into ClassItem[]
 */
export function parseCSVClasses(csvText: string): CSVParseResult {
  const warnings: string[] = [];
  const lines = csvText
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  if (lines.length === 0) {
    throw new Error('The uploaded CSV file is empty.');
  }

  // Parse header line
  const rawHeaders = parseCSVLine(lines[0]);
  const headers = rawHeaders.map((h) => h.toLowerCase().replace(/[^a-z0-9_]/g, ''));

  // Detect column indices based on flexible synonyms
  const colIndex = {
    course: headers.findIndex((h) =>
      ['name', 'course', 'coursename', 'coursetitle', 'title', 'subject', 'class', 'subjectname'].includes(h)
    ),
    teacher: headers.findIndex((h) =>
      ['teacher', 'faculty', 'instructor', 'professor', 'prof', 'facultyname', 'lecturer', 'tutor'].includes(h)
    ),
    room: headers.findIndex((h) =>
      ['room', 'classroom', 'hall', 'lab', 'roomno', 'roomnumber', 'venue', 'location'].includes(h)
    ),
    group: headers.findIndex((h) =>
      ['group', 'cohort', 'section', 'batch', 'classgroup', 'studentgroup', 'dept', 'department'].includes(h)
    ),
    id: headers.findIndex((h) =>
      ['id', 'code', 'classid', 'courseid', 'courseno', 'itemid', 'no'].includes(h)
    ),
  };

  const detectedColumns = {
    course: colIndex.course !== -1 ? rawHeaders[colIndex.course] : null,
    teacher: colIndex.teacher !== -1 ? rawHeaders[colIndex.teacher] : null,
    room: colIndex.room !== -1 ? rawHeaders[colIndex.room] : null,
    group: colIndex.group !== -1 ? rawHeaders[colIndex.group] : null,
    id: colIndex.id !== -1 ? rawHeaders[colIndex.id] : null,
  };

  // If no course/name column was found, check if column 1 or 0 has course names
  if (colIndex.course === -1) {
    if (rawHeaders.length >= 2) {
      colIndex.course = 1;
      detectedColumns.course = rawHeaders[1];
      warnings.push(`No exact "course" or "name" header found; defaulted to column "${rawHeaders[1]}".`);
    } else {
      colIndex.course = 0;
      detectedColumns.course = rawHeaders[0];
    }
  }

  const parsedClasses: ClassItem[] = [];

  for (let i = 1; i < lines.length; i++) {
    const row = parseCSVLine(lines[i]);
    if (row.length === 0 || (row.length === 1 && !row[0])) continue;

    const rawCourse = colIndex.course !== -1 ? row[colIndex.course] : '';
    const rawTeacher = colIndex.teacher !== -1 ? row[colIndex.teacher] : '';
    const rawRoom = colIndex.room !== -1 ? row[colIndex.room] : '';
    const rawGroup = colIndex.group !== -1 ? row[colIndex.group] : '';
    const rawId = colIndex.id !== -1 && row[colIndex.id] ? row[colIndex.id] : String(parsedClasses.length + 1);

    const name = rawCourse || `Course ${parsedClasses.length + 1}`;

    parsedClasses.push({
      id: rawId,
      name: name.replace(/^["']|["']$/g, ''),
      teacher: (rawTeacher || '').replace(/^["']|["']$/g, ''),
      room: (rawRoom || '').replace(/^["']|["']$/g, ''),
      group: (rawGroup || '').replace(/^["']|["']$/g, ''),
    });
  }

  if (parsedClasses.length === 0) {
    throw new Error('No valid class or course rows found in the CSV.');
  }

  return {
    classes: parsedClasses,
    detectedColumns,
    totalRows: parsedClasses.length,
    warnings,
  };
}
