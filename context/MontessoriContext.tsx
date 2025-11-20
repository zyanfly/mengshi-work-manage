
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Student, Work, ProgressRecord, MontessoriContextType, WorkStatus } from '../types';
import { INITIAL_WORKS } from '../constants';

const MontessoriContext = createContext<MontessoriContextType | undefined>(undefined);

const generateId = () => Math.random().toString(36).substr(2, 9);

export const MontessoriProvider = ({ children }: { children: ReactNode }) => {
  // Load initial state from localStorage or defaults
  const [students, setStudents] = useState<Student[]>(() => {
    const saved = localStorage.getItem('monte_students');
    return saved ? JSON.parse(saved) : [];
  });

  const [works, setWorks] = useState<Work[]>(() => {
    const saved = localStorage.getItem('monte_works');
    if (saved) return JSON.parse(saved);
    // Seed initial works
    return INITIAL_WORKS.map(w => ({ ...w, id: generateId() }));
  });

  const [progress, setProgress] = useState<ProgressRecord[]>(() => {
    const saved = localStorage.getItem('monte_progress');
    if (!saved) return [];
    
    const parsed = JSON.parse(saved);
    // Migration check for old data format
    if (parsed.length > 0 && 'isCompleted' in parsed[0]) {
        return parsed.map((p: any) => ({
            studentId: p.studentId,
            workId: p.workId,
            status: p.isCompleted ? WorkStatus.COMPLETED : WorkStatus.NOT_STARTED,
            updatedAt: p.completedAt || Date.now()
        })).filter((p: ProgressRecord) => p.status !== WorkStatus.NOT_STARTED);
    }
    return parsed;
  });

  // Persist changes
  useEffect(() => localStorage.setItem('monte_students', JSON.stringify(students)), [students]);
  useEffect(() => localStorage.setItem('monte_works', JSON.stringify(works)), [works]);
  useEffect(() => localStorage.setItem('monte_progress', JSON.stringify(progress)), [progress]);

  // Actions
  const addStudent = (s: Omit<Student, 'id'>) => {
    setStudents([...students, { ...s, id: generateId() }]);
  };

  const updateStudent = (s: Student) => {
    setStudents(students.map(stu => stu.id === s.id ? s : stu));
  };

  const deleteStudent = (id: string) => {
    setStudents(students.filter(s => s.id !== id));
    setProgress(progress.filter(p => p.studentId !== id)); // Cleanup progress
  };

  const addWork = (w: Omit<Work, 'id'>) => {
    setWorks([...works, { ...w, id: generateId() }]);
  };
  
  const addWorksBulk = (newWorks: Omit<Work, 'id'>[]) => {
    const worksWithIds = newWorks.map(w => ({ ...w, id: generateId() }));
    setWorks(prev => [...prev, ...worksWithIds]);
  }

  const updateWork = (w: Work) => {
    setWorks(works.map(work => work.id === w.id ? w : work));
  };

  const deleteWork = (id: string) => {
    setWorks(works.filter(w => w.id !== id));
    setProgress(progress.filter(p => p.workId !== id));
  };

  const cycleProgress = (studentId: string, workId: string) => {
    setProgress(prev => {
      const existingIndex = prev.findIndex(p => p.studentId === studentId && p.workId === workId);
      
      if (existingIndex >= 0) {
        const record = prev[existingIndex];
        if (record.status === WorkStatus.IN_PROGRESS) {
            // Move to COMPLETED
            const newProgress = [...prev];
            newProgress[existingIndex] = { ...record, status: WorkStatus.COMPLETED, updatedAt: Date.now() };
            return newProgress;
        } else if (record.status === WorkStatus.COMPLETED) {
            // Move to NOT_STARTED (Remove record)
            return prev.filter((_, idx) => idx !== existingIndex);
        } else {
            // Fallback, just remove
             return prev.filter((_, idx) => idx !== existingIndex);
        }
      }
      
      // If not found (NOT_STARTED), move to IN_PROGRESS
      return [...prev, { studentId, workId, status: WorkStatus.IN_PROGRESS, updatedAt: Date.now() }];
    });
  };

  const getStudentProgress = (studentId: string) => {
    const studentRecords = progress.filter(p => p.studentId === studentId);
    const completedCount = studentRecords.filter(p => p.status === WorkStatus.COMPLETED).length;
    const inProgressCount = studentRecords.filter(p => p.status === WorkStatus.IN_PROGRESS).length;
    const totalCount = works.length;
    
    return {
      completedCount,
      inProgressCount,
      totalCount,
      percent: totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100)
    };
  };

  return (
    <MontessoriContext.Provider value={{
      students, works, progress,
      addStudent, updateStudent, deleteStudent,
      addWork, addWorksBulk, updateWork, deleteWork,
      cycleProgress, getStudentProgress
    }}>
      {children}
    </MontessoriContext.Provider>
  );
};

export const useMontessori = () => {
  const context = useContext(MontessoriContext);
  if (!context) throw new Error('useMontessori must be used within a MontessoriProvider');
  return context;
};
