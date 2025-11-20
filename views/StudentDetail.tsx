
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useMontessori } from '../context/MontessoriContext';
import { AREAS } from '../constants';
import { WorkStatus } from '../types';
import { ChevronLeft, CheckCircle2, Circle, Trophy, Timer } from 'lucide-react';
import clsx from 'clsx';

const StudentDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { students, works, progress, cycleProgress } = useMontessori();
  const student = students.find(s => s.id === id);
  
  // Collapse state for areas
  const [expandedAreas, setExpandedAreas] = useState<string[]>(AREAS.map(a => a.type));

  if (!student) return <div className="p-4">学生不存在</div>;

  const toggleArea = (areaType: string) => {
    if (expandedAreas.includes(areaType)) {
      setExpandedAreas(expandedAreas.filter(a => a !== areaType));
    } else {
      setExpandedAreas([...expandedAreas, areaType]);
    }
  };

  // Calculate overall stats
  const studentProgress = progress.filter(p => p.studentId === id);
  const completedWorks = studentProgress.filter(p => p.status === WorkStatus.COMPLETED);
  const inProgressWorks = studentProgress.filter(p => p.status === WorkStatus.IN_PROGRESS);
  
  const totalWorks = works.length;
  const totalCompleted = completedWorks.length;
  const percent = totalWorks === 0 ? 0 : Math.round((totalCompleted / totalWorks) * 100);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center space-x-2 mb-6">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-stone-500 hover:text-stone-800">
            <ChevronLeft size={24} />
        </button>
        <div>
            <h2 className="text-2xl font-serif font-bold text-stone-800">{student.name}</h2>
            <div className="flex items-center space-x-2 text-sm text-stone-500">
                <span>总进度: {percent}%</span>
                {inProgressWorks.length > 0 && (
                    <span className="text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full text-xs">
                        进行中: {inProgressWorks.length}
                    </span>
                )}
            </div>
        </div>
      </div>

      {/* Progress Bars per Area */}
      <div className="grid gap-4">
        {AREAS.map(area => {
          const areaWorks = works.filter(w => w.area === area.type);
          const areaRecord = studentProgress.filter(p => 
            areaWorks.some(w => w.id === p.workId)
          );
          const areaCompleted = areaRecord.filter(p => p.status === WorkStatus.COMPLETED).length;
          const areaInProgress = areaRecord.filter(p => p.status === WorkStatus.IN_PROGRESS).length;
          const areaTotal = areaWorks.length;
          const areaPercent = areaTotal === 0 ? 0 : Math.round((areaCompleted / areaTotal) * 100);
          const isExpanded = expandedAreas.includes(area.type);

          return (
            <div key={area.type} className="bg-white rounded-xl shadow-sm border border-stone-100 overflow-hidden">
              {/* Area Header */}
              <div 
                onClick={() => toggleArea(area.type)}
                className={clsx("p-4 flex justify-between items-center cursor-pointer", area.color)}
              >
                <div>
                    <h3 className="font-bold">{area.type}</h3>
                    <div className="text-xs opacity-80 mt-1 flex items-center gap-2">
                        <span>已完成 {areaCompleted}/{areaTotal}</span>
                        {areaInProgress > 0 && (
                            <span className="flex items-center"><Timer size={10} className="mr-0.5"/> {areaInProgress}</span>
                        )}
                    </div>
                </div>
                <div className="flex items-center space-x-3">
                    {areaPercent === 100 && areaTotal > 0 && <Trophy size={18} className="text-yellow-600" />}
                    <div className="w-12 text-right font-bold text-sm">{areaPercent}%</div>
                </div>
              </div>

              {/* Works List */}
              {isExpanded && (
                <div className="divide-y divide-stone-100">
                    {areaWorks.length === 0 ? (
                        <div className="p-4 text-center text-stone-400 text-sm">该区域暂无工作</div>
                    ) : (
                        areaWorks.map(work => {
                            const record = studentProgress.find(p => p.workId === work.id);
                            const status = record ? record.status : WorkStatus.NOT_STARTED;
                            
                            return (
                                <div 
                                    key={work.id} 
                                    onClick={() => cycleProgress(student.id, work.id)}
                                    className={clsx(
                                        "p-4 flex items-start space-x-3 cursor-pointer transition-colors select-none",
                                        status === WorkStatus.COMPLETED ? "bg-stone-50/50" : "hover:bg-stone-50"
                                    )}
                                >
                                    <div className="mt-1 transition-transform duration-200">
                                        {status === WorkStatus.COMPLETED && <CheckCircle2 size={22} className="text-monte-green" fill="#e8f5e9" />}
                                        {status === WorkStatus.IN_PROGRESS && <Timer size={22} className="text-amber-500" />}
                                        {status === WorkStatus.NOT_STARTED && <Circle size={22} className="text-stone-300" />}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-center">
                                            <p className={clsx("font-medium", status === WorkStatus.COMPLETED ? "text-stone-500 line-through decoration-stone-300" : "text-stone-800")}>
                                                {work.title}
                                            </p>
                                            {status === WorkStatus.IN_PROGRESS && (
                                                <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">进行中</span>
                                            )}
                                        </div>
                                        {work.description && (
                                            <p className="text-xs text-stone-400 mt-0.5">{work.description}</p>
                                        )}
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StudentDetail;
