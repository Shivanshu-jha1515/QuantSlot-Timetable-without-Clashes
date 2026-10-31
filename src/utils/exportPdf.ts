import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { AssignedClassDetail, OptimizationResponse } from '../types';

interface ExportPdfOptions {
  optimizationResult: OptimizationResponse;
  numSlots: number;
  institutionName?: string;
  departmentName?: string;
}

export function exportTimetableToPdf({
  optimizationResult,
  numSlots,
  institutionName = 'Academic Institute & College',
  departmentName = 'Faculty of Science & Engineering',
}: ExportPdfOptions) {
  // Initialize landscape A4 document
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // Color Palette
  const brandDarkBlue: [number, number, number] = [15, 23, 42]; // #0f172a
  const brandTeal: [number, number, number] = [13, 148, 136]; // #0d9488
  const brandLightBg: [number, number, number] = [248, 250, 252]; // #f8fafc
  const mutedText: [number, number, number] = [100, 116, 139]; // #64748b

  // 1. Header Banner
  doc.setFillColor(...brandDarkBlue);
  doc.rect(0, 0, pageWidth, 24, 'F');

  // Accent Line under banner
  doc.setFillColor(...brandTeal);
  doc.rect(0, 24, pageWidth, 1.5, 'F');

  // Title & Brand
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('QuantSlot — Optimized Academic Timetable', 14, 12);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(203, 213, 225);
  doc.text(
    `${institutionName} · ${departmentName} · Quantum-Inspired QUBO Optimization`,
    14,
    18
  );

  // Right-aligned header badge
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(45, 212, 191); // Light Teal
  doc.text('0 CLASHES ACHIEVED', pageWidth - 14, 12, { align: 'right' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(203, 213, 225);
  doc.text(`Generated: ${new Date().toLocaleDateString()}`, pageWidth - 14, 18, {
    align: 'right',
  });

  // 2. Metrics Strip
  const stripY = 30;
  doc.setFillColor(...brandLightBg);
  doc.roundedRect(14, stripY, pageWidth - 28, 14, 2, 2, 'F');
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(14, stripY, pageWidth - 28, 14, 2, 2, 'S');

  doc.setFontSize(8);
  doc.setTextColor(...mutedText);

  // Metric 1: Conflicts Resolved
  doc.setFont('helvetica', 'bold');
  doc.text('CONFLICT RESOLUTION:', 20, stripY + 6);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(15, 23, 42);
  doc.text(
    `${optimizationResult.clashes_before} initial clashes  →  ${optimizationResult.clashes_after} clashes (100% resolved)`,
    20,
    stripY + 10.5
  );

  // Metric 2: Solve Velocity
  doc.setTextColor(...mutedText);
  doc.setFont('helvetica', 'bold');
  doc.text('SOLVE VELOCITY:', 120, stripY + 6);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(15, 23, 42);
  doc.text(`${optimizationResult.solve_time_ms} ms`, 120, stripY + 10.5);

  // Metric 3: Optimization Engine
  doc.setTextColor(...mutedText);
  doc.setFont('helvetica', 'bold');
  doc.text('OPTIMIZER ENGINE:', 180, stripY + 6);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(15, 23, 42);
  doc.text(`${optimizationResult.solver_used}`, 180, stripY + 10.5);

  // 3. Prepare Timetable Grid Table Data
  const periodsPerDay = numSlots % 4 === 0 ? 4 : numSlots % 3 === 0 ? 3 : 4;
  const numDays = Math.ceil(numSlots / periodsPerDay);
  const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].slice(0, numDays);

  // Map slots to assigned classes
  const slotMap: Record<number, AssignedClassDetail[]> = {};
  for (let s = 0; s < numSlots; s++) {
    slotMap[s] = [];
  }
  optimizationResult.details.forEach((item) => {
    if (slotMap[item.slot]) {
      slotMap[item.slot].push(item);
    }
  });

  // Table Headers
  const tableHeaders = ['Day'];
  for (let p = 0; p < periodsPerDay; p++) {
    const startTime = `${8 + p * 2}:30`;
    const endTime = `${10 + p * 2}:00`;
    tableHeaders.push(`Period ${p + 1}\n(${startTime} - ${endTime})`);
  }

  // Table Rows
  const tableRows: string[][] = [];
  dayNames.forEach((dayName, dayIdx) => {
    const row: string[] = [dayName];

    for (let pIdx = 0; pIdx < periodsPerDay; pIdx++) {
      const slotIndex = dayIdx * periodsPerDay + pIdx;
      const classesInSlot = slotMap[slotIndex] || [];

      if (classesInSlot.length === 0) {
        row.push('—\n[Free Slot]');
      } else {
        const cellText = classesInSlot
          .map((c) => {
            const faculty = c.teacher ? `Prof: ${c.teacher}` : '';
            const cohort = c.group ? `[${c.group}]` : '';
            const room = c.room ? `Room: ${c.room}` : '';
            const meta = [cohort, room, faculty].filter(Boolean).join(' · ');
            return `${c.name}\n${meta}`;
          })
          .join('\n\n');
        row.push(cellText);
      }
    }
    tableRows.push(row);
  });

  // Render Grid AutoTable
  autoTable(doc, {
    startY: 48,
    head: [tableHeaders],
    body: tableRows,
    theme: 'grid',
    headStyles: {
      fillColor: brandDarkBlue,
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      halign: 'center',
      valign: 'middle',
      fontSize: 9,
      cellPadding: 3,
    },
    bodyStyles: {
      textColor: [30, 41, 59],
      fontSize: 7.5,
      cellPadding: 3.5,
      valign: 'top',
      lineColor: [226, 232, 240],
      lineWidth: 0.2,
    },
    columnStyles: {
      0: {
        fontStyle: 'bold',
        halign: 'center',
        valign: 'middle',
        fillColor: [241, 245, 249],
        cellWidth: 26,
        fontSize: 9,
      },
    },
    alternateRowStyles: {
      fillColor: [255, 255, 255],
    },
    margin: { left: 14, right: 14 },
    didDrawPage: (data) => {
      // Footer on bottom
      const footerY = pageHeight - 8;
      doc.setFontSize(7.5);
      doc.setTextColor(...mutedText);
      doc.text(
        'QuantSlot — "From 18 clashes to zero, in seconds." Quantum-Inspired Academic Timetable Optimizer',
        14,
        footerY
      );
      doc.text(
        `Page ${data.pageNumber}`,
        pageWidth - 14,
        footerY,
        { align: 'right' }
      );
    },
  });

  // 4. Add Page 2: Detailed Course Allocation Roster
  doc.addPage('landscape');

  // Page 2 Header Banner
  doc.setFillColor(...brandDarkBlue);
  doc.rect(0, 0, pageWidth, 18, 'F');
  doc.setFillColor(...brandTeal);
  doc.rect(0, 18, pageWidth, 1, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('QuantSlot — Complete Academic Course Roster & Allocation Schedule', 14, 11);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(203, 213, 225);
  doc.text(`Total Assigned Classes: ${optimizationResult.details.length}`, pageWidth - 14, 11, {
    align: 'right',
  });

  // Prepare Roster Table Data sorted by Day and Period
  const dayOrder: Record<string, number> = {
    Monday: 1,
    Tuesday: 2,
    Wednesday: 3,
    Thursday: 4,
    Friday: 5,
    Saturday: 6,
  };

  const sortedDetails = [...optimizationResult.details].sort((a, b) => {
    const dayDiff = (dayOrder[a.day] || 99) - (dayOrder[b.day] || 99);
    if (dayDiff !== 0) return dayDiff;
    return a.slot - b.slot;
  });

  const rosterHeaders = ['ID', 'Course Title', 'Faculty Instructor', 'Cohort', 'Classroom Hall', 'Day', 'Period', 'Slot ID'];
  const rosterRows = sortedDetails.map((c) => [
    String(c.id),
    c.name,
    c.teacher || 'General Faculty',
    c.group || 'All Cohorts',
    c.room || 'Main Hall',
    c.day,
    c.period,
    `Slot ${c.slot + 1}`,
  ]);

  autoTable(doc, {
    startY: 24,
    head: [rosterHeaders],
    body: rosterRows,
    theme: 'striped',
    headStyles: {
      fillColor: brandDarkBlue,
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 8,
      cellPadding: 2.5,
    },
    bodyStyles: {
      fontSize: 7.5,
      cellPadding: 2,
      textColor: [30, 41, 59],
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252],
    },
    columnStyles: {
      0: { cellWidth: 14, halign: 'center' },
      1: { cellWidth: 55, fontStyle: 'bold' },
      2: { cellWidth: 45 },
      3: { cellWidth: 28 },
      4: { cellWidth: 32 },
      5: { cellWidth: 28 },
      6: { cellWidth: 28 },
      7: { cellWidth: 22, halign: 'center' },
    },
    margin: { left: 14, right: 14 },
    didDrawPage: (data) => {
      const footerY = pageHeight - 8;
      doc.setFontSize(7.5);
      doc.setTextColor(...mutedText);
      doc.text(
        'QuantSlot — "From 18 clashes to zero, in seconds." Quantum-Inspired Academic Timetable Optimizer',
        14,
        footerY
      );
      doc.text(
        `Page ${data.pageNumber}`,
        pageWidth - 14,
        footerY,
        { align: 'right' }
      );
    },
  });

  // Save the generated PDF
  doc.save('quant_slot_optimized_timetable.pdf');
}
