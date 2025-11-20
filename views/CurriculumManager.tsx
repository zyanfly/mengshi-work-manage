import React, { useState } from 'react';
import { useMontessori } from '../context/MontessoriContext';
import { AreaType, Work } from '../types';
import { AREAS } from '../constants';
import { Plus, Trash2, Sparkles, Loader2 } from 'lucide-react';
import Modal from '../components/Modal';
import { suggestWorksForArea } from '../services/geminiService';

const CurriculumManager: React.FC = () => {
  const { works, addWork, addWorksBulk, deleteWork } = useMontessori();
  const [activeArea, setActiveArea] = useState<AreaType>(AreaType.DAILY_LIFE);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newWork, setNewWork] = useState({ title: '', description: '' });
  
  const [isGenerating, setIsGenerating] = useState(false);

  const currentWorks = works.filter(w => w.area === activeArea);
  const activeAreaData = AREAS.find(a => a.type === activeArea);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    addWork({ area: activeArea, ...newWork });
    setNewWork({ title: '', description: '' });
    setIsModalOpen(false);
  };

  const handleGenerate = async () => {
    if(!window.confirm(`确定要使用 AI 自动推荐 ${activeArea} 的经典教具吗？`)) return;
    
    setIsGenerating(true);
    try {
        const suggestions = await suggestWorksForArea(activeArea);
        if(suggestions.length > 0) {
            addWorksBulk(suggestions);
        } else {
            alert('生成失败，请重试');
        }
    } catch (e) {
        alert('AI 服务暂时不可用');
    } finally {
        setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-serif font-bold text-stone-800">工作管理</h2>
      
      {/* Area Tabs - Scrollable on mobile */}
      <div className="flex overflow-x-auto space-x-2 pb-2 -mx-4 px-4 scrollbar-hide">
        {AREAS.map(area => (
          <button
            key={area.type}
            onClick={() => setActiveArea(area.type)}
            className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeArea === area.type 
                ? 'bg-stone-800 text-white shadow-md' 
                : 'bg-white text-stone-500 border border-stone-200'
            }`}
          >
            {area.type}
          </button>
        ))}
      </div>

      <div className={`p-4 rounded-xl ${activeAreaData?.color} bg-opacity-30 border ${activeAreaData?.border}`}>
        <div className="flex justify-between items-center mb-4">
             <h3 className="font-bold text-lg">{activeArea}</h3>
             <div className="flex gap-2">
                <button 
                    onClick={handleGenerate}
                    disabled={isGenerating}
                    className="p-2 bg-white rounded-full text-purple-600 shadow-sm hover:bg-purple-50 disabled:opacity-50"
                    title="AI 智能推荐"
                >
                    {isGenerating ? <Loader2 className="animate-spin" size={18}/> : <Sparkles size={18}/>}
                </button>
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="p-2 bg-stone-800 text-white rounded-full shadow-sm hover:bg-stone-700"
                >
                    <Plus size={18} />
                </button>
             </div>
        </div>

        <div className="space-y-3">
            {currentWorks.length === 0 ? (
                <p className="text-center py-8 text-stone-500 text-sm italic">
                    暂无工作项目，点击右上角添加或使用 AI 生成。
                </p>
            ) : (
                currentWorks.map(work => (
                    <div key={work.id} className="bg-white p-3 rounded-lg shadow-sm flex justify-between items-start">
                        <div>
                            <h4 className="font-bold text-stone-800">{work.title}</h4>
                            {work.description && <p className="text-xs text-stone-500 mt-1">{work.description}</p>}
                        </div>
                        <button 
                            onClick={() => { if(window.confirm('删除此工作？')) deleteWork(work.id); }}
                            className="text-stone-300 hover:text-red-400 p-1"
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                ))
            )}
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={`添加工作: ${activeArea}`}>
        <form onSubmit={handleAdd} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-stone-600 mb-1">工作名称</label>
                <input
                    required
                    className="w-full p-3 rounded-lg bg-stone-50 border border-stone-200"
                    value={newWork.title}
                    onChange={e => setNewWork({...newWork, title: e.target.value})}
                    placeholder="例如：粉红塔"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-stone-600 mb-1">描述 (选填)</label>
                <input
                    className="w-full p-3 rounded-lg bg-stone-50 border border-stone-200"
                    value={newWork.description}
                    onChange={e => setNewWork({...newWork, description: e.target.value})}
                    placeholder="例如：感知大小维度的变化"
                />
            </div>
            <button type="submit" className="w-full py-3 bg-monte-green text-white rounded-lg font-bold">
                添加
            </button>
        </form>
      </Modal>
    </div>
  );
};

export default CurriculumManager;
