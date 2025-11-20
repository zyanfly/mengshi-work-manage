
import React from 'react';
import { useMontessori } from '../context/MontessoriContext';
import { AreaType, WorkStatus } from '../types';
import { AREAS } from '../constants';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, Cell } from 'recharts';

const Dashboard: React.FC = () => {
  const { students, works, progress } = useMontessori();

  // 1. Calculate average progress per area
  const areaData = AREAS.map(area => {
    const areaWorks = works.filter(w => w.area === area.type);
    const totalPossibleCompletions = areaWorks.length * students.length;
    
    if (totalPossibleCompletions === 0) return { name: area.type, value: 0, color: '#A89F91' };

    const actualCompletions = progress.filter(p => {
        // Find the work for this progress record
        const work = works.find(w => w.id === p.workId);
        return work && work.area === area.type && p.status === WorkStatus.COMPLETED;
    }).length;

    return {
        name: area.type.replace('区', ''), // Shorten for chart
        value: Math.round((actualCompletions / totalPossibleCompletions) * 100),
        color: area.color.includes('amber') ? '#f59e0b' 
             : area.color.includes('rose') ? '#f43f5e'
             : area.color.includes('blue') ? '#3b82f6'
             : area.color.includes('emerald') ? '#10b981'
             : '#8b5cf6'
    };
  });

  // 2. Calculate top performing students (by completion %)
  const studentRankings = students.map(student => {
    const completed = progress.filter(p => p.studentId === student.id && p.status === WorkStatus.COMPLETED).length;
    const total = works.length;
    const percent = total === 0 ? 0 : Math.round((completed / total) * 100);
    return { ...student, percent, completed };
  }).sort((a, b) => b.percent - a.percent);

  return (
    <div className="space-y-8 pb-8">
      <h2 className="text-2xl font-serif font-bold text-stone-800">全班总览</h2>

      {/* Chart Card */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-stone-100">
        <h3 className="text-lg font-bold text-stone-700 mb-4">区域完成度分布</h3>
        <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={areaData} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12}} />
                    <YAxis axisLine={false} tickLine={false} hide />
                    <Tooltip 
                        cursor={{fill: 'transparent'}}
                        contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                    />
                    <Bar dataKey="value" radius={[6, 6, 0, 0]} name="平均完成率(%)">
                        {areaData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
      </div>

      {/* Student Rankings List */}
      <div>
        <h3 className="text-lg font-bold text-stone-700 mb-4 px-2">学生进度排名</h3>
        <div className="space-y-3">
            {studentRankings.map((student, index) => (
                <div key={student.id} className="bg-white p-4 rounded-xl border border-stone-100 flex items-center space-x-4">
                    <div className="flex-none w-8 text-center font-bold text-stone-400">
                        {index + 1}
                    </div>
                    <div className="flex-none w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center text-stone-600 text-sm font-bold">
                        {student.name[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex justify-between mb-1">
                            <span className="font-medium truncate">{student.name}</span>
                            <span className="text-sm font-bold text-monte-green">{student.percent}%</span>
                        </div>
                        <div className="w-full bg-stone-100 rounded-full h-2 overflow-hidden">
                            <div 
                                className="bg-monte-green h-full rounded-full transition-all duration-500" 
                                style={{ width: `${student.percent}%` }}
                            />
                        </div>
                    </div>
                </div>
            ))}
            {studentRankings.length === 0 && (
                <p className="text-center text-stone-400 py-4">暂无数据</p>
            )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
