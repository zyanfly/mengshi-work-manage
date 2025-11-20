
export enum AreaType {
  DAILY_LIFE = '日常生活区',
  SENSORY = '感官区',
  MATH = '数学区',
  LANGUAGE = '语言区',
  CULTURE = '科学文化区',
}

export enum WorkStatus {
  NOT_STARTED = 'NOT_STARTED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
}

export interface Student {
  id: string;
  name: string;
  gender: '男' | '女';
  age: number;
  parentContact?: string;
  notes?: string;
}

export interface Work {
  id: string;
  area: AreaType;
  title: string;
  description?: string;
}

export interface ProgressRecord {
  studentId: string;
  workId: string;
  status: WorkStatus;
  updatedAt?: number;
}

export interface MontessoriContextType {
  students: Student[];
  works: Work[];
  progress: ProgressRecord[];
  addStudent: (student: Omit<Student, 'id'>) => void;
  updateStudent: (student: Student) => void;
  deleteStudent: (id: string) => void;
  addWork: (work: Omit<Work, 'id'>) => void;
  addWorksBulk: (works: Omit<Work, 'id'>[]) => void;
  updateWork: (work: Work) => void;
  deleteWork: (id: string) => void;
  cycleProgress: (studentId: string, workId: string) => void;
  getStudentProgress: (studentId: string) => { completedCount: number; inProgressCount: number; totalCount: number; percent: number };
}
