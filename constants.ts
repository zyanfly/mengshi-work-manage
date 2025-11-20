import { AreaType, Work } from './types';

export const AREAS = [
  { type: AreaType.DAILY_LIFE, color: 'bg-amber-100 text-amber-800', border: 'border-amber-200' },
  { type: AreaType.SENSORY, color: 'bg-rose-100 text-rose-800', border: 'border-rose-200' },
  { type: AreaType.MATH, color: 'bg-blue-100 text-blue-800', border: 'border-blue-200' },
  { type: AreaType.LANGUAGE, color: 'bg-emerald-100 text-emerald-800', border: 'border-emerald-200' },
  { type: AreaType.CULTURE, color: 'bg-purple-100 text-purple-800', border: 'border-purple-200' },
];

// Initial seed data if local storage is empty
export const INITIAL_WORKS: Omit<Work, 'id'>[] = [
  { area: AreaType.DAILY_LIFE, title: '倒豆子', description: '练习手眼协调' },
  { area: AreaType.SENSORY, title: '粉红塔', description: '感知大小变化' },
  { area: AreaType.MATH, title: '数棒', description: '1-10的数量概念' },
  { area: AreaType.LANGUAGE, title: '砂纸字母', description: '触觉认识字母' },
  { area: AreaType.CULTURE, title: '世界地图嵌板', description: '认识大洲' },
];
