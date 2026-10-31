import React, { useState } from 'react';
import { AssignedClassDetail, ClassItem } from '../types';
import { AlertCircle, User, MapPin, Users, Check, Filter } from 'lucide-react';

interface TimetableGridProps {
  assignedClasses: AssignedClassDetail[];
  numSlots: number;
  highlightConflicts?: boolean;
}

export const TimetableGrid: React.FC<TimetableGridProps> = ({
  assignedClasses,
  numSlots,
  highlightConflicts = true,
}) => {
  const [selectedTeacher, setSelectedTeacher] = useState<string>('all');
  const [selectedGroup, setSelectedGroup] = useState<string>('all');
  const [selectedRoom, setSelectedRoom] = useState<string>('all');
  const [activeModalClass, setActiveModalClass] = useState<AssignedClassDetail | null>(null);

  // Group classes by slot
  const slotMap: Record<number, AssignedClassDetail[]> = {};
  for (let s = 0; s < numSlots; s++) {
    slotMap[s] = [];
  }

  // Filter classes based on active filters
  const filteredClasses = assignedClasses.filter((c) => {
    if (selectedTeacher !== 'all' && c.teacher !== selectedTeacher) return false;
    if (selectedGroup !== 'all' && c.group !== selectedGroup) return false;
    if (selectedRoom !== 'all' && c.room !== selectedRoom) return false;
    return true;
  });

  filteredClasses.forEach((c) => {
    if (slotMap[c.slot]) {
      slotMap[c.slot].push(c);
    }
  });

  // Unique filters lists
  const teachers = Array.from(new Set(assignedClasses.map((c) => c.teacher).filter(Boolean))).sort();
  const groups = Array.from(new Set(assignedClasses.map((c) => c.group).filter(Boolean))).sort();
  const rooms = Array.from(new Set(assignedClasses.map((c) => c.room).filter(Boolean))).sort();

  // Days and periods calculations
  const periodsPerDay = numSlots % 4 === 0 ? 4 : numSlots % 3 === 0 ? 3 : 4;
  const numDays = Math.ceil(numSlots / periodsPerDay);
  const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].slice(0, numDays);

  // Department color palette
  const getSubjectColor = (name: string, group: string) => {
    const text = (name + ' ' + group).toLowerCase();
    if (text.includes('phys') || text.includes('mech')) {
      return 'border-sky-500/30 bg-sky-500/10 text-sky-950 dark:text-sky-200';
    }
    if (text.includes('cs-') || text.includes('algo') || text.includes('comput') || text.includes('ai')) {
      return 'border-teal-500/30 bg-teal-500/10 text-teal-950 dark:text-teal-200';
    }
    if (text.includes('math') || text.includes('algeb') || text.includes('calc')) {
      return 'border-indigo-500/30 bg-indigo-500/10 text-indigo-950 dark:text-indigo-200';
    }
    if (text.includes('chem')) {
      return 'border-amber-500/30 bg-amber-500/10 text-amber-950 dark:text-amber-200';
    }
    if (text.includes('bio')) {
      return 'border-emerald-500/30 bg-emerald-500/10 text-emerald-950 dark:text-emerald-200';
    }
    return 'border-purple-500/30 bg-purple-500/10 text-purple-950 dark:text-purple-200';
  };

  // Check if a slot has a conflict
  const checkSlotConflict = (classesInSlot: AssignedClassDetail[]) => {
    if (classesInSlot.length < 2) return false;
    for (let i = 0; i < classesInSlot.length; i++) {
      for (let j = i + 1; j < classesInSlot.length; j++) {
        const c1 = classesInSlot[i];
        const c2 = classesInSlot[j];
        if (c1.teacher && c1.teacher === c2.teacher) return true;
        if (c1.room && c1.room === c2.room) return true;
        if (c1.group && c1.group === c2.group) return true;
      }
    }
    return false;
  };

  return (
    <div className="space-y-4">
      {/* Filter bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs">
        <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 font-medium">
          <Filter className="w-4 h-4 text-teal-500" />
          <span>Filter Timetable View:</span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Teacher filter */}
          <div className="flex items-center gap-1.5">
            <label className="text-slate-500 dark:text-slate-400">Teacher:</label>
            <select
              value={selectedTeacher}
              onChange={(e) => setSelectedTeacher(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-teal-500"
            >
              <option value="all">All Teachers ({teachers.length})</option>
              {teachers.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          {/* Group filter */}
          <div className="flex items-center gap-1.5">
            <label className="text-slate-500 dark:text-slate-400">Cohort:</label>
            <select
              value={selectedGroup}
              onChange={(e) => setSelectedGroup(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-teal-500"
            >
              <option value="all">All Cohorts ({groups.length})</option>
              {groups.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </div>

          {/* Room filter */}
          <div className="flex items-center gap-1.5">
            <label className="text-slate-500 dark:text-slate-400">Room:</label>
            <select
              value={selectedRoom}
              onChange={(e) => setSelectedRoom(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-teal-500"
            >
              <option value="all">All Rooms ({rooms.length})</option>
              {rooms.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          {(selectedTeacher !== 'all' || selectedGroup !== 'all' || selectedRoom !== 'all') && (
            <button
              onClick={() => {
                setSelectedTeacher('all');
                setSelectedGroup('all');
                setSelectedRoom('all');
              }}
              className="text-teal-600 dark:text-teal-400 hover:underline px-2 py-1"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Grid container */}
      <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
        <table className="w-full border-collapse text-left text-xs min-w-[760px]">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/70">
              <th className="p-3.5 font-semibold text-slate-700 dark:text-slate-300 w-32">
                Day
              </th>
              {Array.from({ length: periodsPerDay }).map((_, pIdx) => (
                <th
                  key={pIdx}
                  className="p-3.5 font-semibold text-slate-700 dark:text-slate-300"
                >
                  <div className="flex items-center justify-between">
                    <span>Period {pIdx + 1}</span>
                    <span className="text-[11px] font-mono text-slate-400 font-normal">
                      {8 + pIdx * 2}:30 - {10 + pIdx * 2}:00
                    </span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
            {dayNames.map((dayName, dayIdx) => (
              <tr key={dayName} className="hover:bg-slate-50/40 dark:hover:bg-slate-950/40 transition-colors">
                <td className="p-3.5 font-semibold text-slate-900 dark:text-white bg-slate-50/40 dark:bg-slate-950/40 border-r border-slate-200 dark:border-slate-800 align-top">
                  <div>{dayName}</div>
                  <div className="text-[10px] text-slate-400 font-mono mt-1">
                    Slots {dayIdx * periodsPerDay + 1} - {(dayIdx + 1) * periodsPerDay}
                  </div>
                </td>

                {Array.from({ length: periodsPerDay }).map((_, pIdx) => {
                  const slotIndex = dayIdx * periodsPerDay + pIdx;
                  const classesHere = slotMap[slotIndex] || [];
                  const hasConflict = highlightConflicts && checkSlotConflict(classesHere);

                  return (
                    <td
                      key={pIdx}
                      className={`p-2.5 align-top border-r border-slate-100 dark:border-slate-800/80 min-w-[180px] ${
                        hasConflict
                          ? 'bg-rose-500/10 border-rose-500/30 ring-1 ring-rose-500/30'
                          : ''
                      }`}
                    >
                      <div className="space-y-2">
                        {hasConflict && (
                          <div className="flex items-center gap-1 text-[11px] font-semibold text-rose-600 dark:text-rose-400">
                            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                            <span>Resource Conflict!</span>
                          </div>
                        )}

                        {classesHere.length === 0 ? (
                          <div className="text-slate-300 dark:text-slate-700 text-[11px] italic py-3 text-center">
                            Free Slot
                          </div>
                        ) : (
                          classesHere.map((item) => {
                            const colorClass = getSubjectColor(item.name, item.group);
                            return (
                              <div
                                key={item.id}
                                onClick={() => setActiveModalClass(item)}
                                className={`p-2.5 rounded-lg border cursor-pointer hover:scale-[1.01] transition-transform shadow-xs ${colorClass}`}
                              >
                                <div className="font-semibold text-xs leading-tight mb-1 truncate" title={item.name}>
                                  {item.name}
                                </div>
                                <div className="space-y-0.5 text-[11px] opacity-90">
                                  {item.teacher && (
                                    <div className="flex items-center gap-1 truncate">
                                      <User className="w-3 h-3 shrink-0 opacity-70" />
                                      <span className="truncate">{item.teacher}</span>
                                    </div>
                                  )}
                                  <div className="flex items-center justify-between gap-1">
                                    {item.group && (
                                      <div className="flex items-center gap-1 font-mono text-[10px]">
                                        <Users className="w-3 h-3 shrink-0 opacity-70" />
                                        <span>{item.group}</span>
                                      </div>
                                    )}
                                    {item.room && (
                                      <div className="flex items-center gap-1 text-[10px]">
                                        <MapPin className="w-3 h-3 shrink-0 opacity-70" />
                                        <span>{item.room}</span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            );
                          })
                        )}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Class inspection modal */}
      {activeModalClass && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 max-w-md w-full shadow-xl">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  {activeModalClass.name}
                </h3>
                <div className="text-xs text-slate-500 font-mono mt-0.5">
                  Class ID: {activeModalClass.id}
                </div>
              </div>
              <button
                onClick={() => setActiveModalClass(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-lg leading-none p-1"
              >
                &times;
              </button>
            </div>

            <div className="space-y-3 text-xs divide-y divide-slate-100 dark:divide-slate-800">
              <div className="pt-2 flex justify-between">
                <span className="text-slate-500">Instructor:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{activeModalClass.teacher || 'Not specified'}</span>
              </div>
              <div className="pt-2 flex justify-between">
                <span className="text-slate-500">Student Cohort:</span>
                <span className="font-semibold font-mono text-slate-800 dark:text-slate-200">{activeModalClass.group || 'All'}</span>
              </div>
              <div className="pt-2 flex justify-between">
                <span className="text-slate-500">Assigned Hall/Room:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{activeModalClass.room || 'General'}</span>
              </div>
              <div className="pt-2 flex justify-between">
                <span className="text-slate-500">Scheduled Time:</span>
                <span className="font-semibold text-teal-600 dark:text-teal-400">
                  {activeModalClass.day} &middot; {activeModalClass.period} (Slot {activeModalClass.slot + 1})
                </span>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setActiveModalClass(null)}
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-slate-900 dark:bg-teal-500 text-white dark:text-slate-950 hover:bg-slate-800 dark:hover:bg-teal-400 transition-colors"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
