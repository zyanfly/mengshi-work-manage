import React, { useState } from 'react';
import { useMontessori } from '../context/MontessoriContext';
import { Plus, Edit2, Trash2, Phone, Baby, UserCircle2, ChevronRight } from 'lucide-react';
import Modal from '../components/Modal';
import { Student } from '../types';
import { useNavigate } from 'react-router-dom';

const StudentList: React.FC = () => {
  const { students, addStudent, updateStudent, deleteStudent } = useMontessori();
  const navigate = useNavigate();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [formData, setFormData] = useState<Omit<Student, 'id'>>({
    name: '', gender: '男', age: 3, parentContact: '', notes: ''
  });

  const handleOpenAdd = () => {
    setEditingStudent(null);
    setFormData({ name: '', gender: '男', age: 3, parentContact: '', notes: '' });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (student: Student, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingStudent(student);
    setFormData({ ...student });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('确定要删除这位学生吗？相关进度也会被删除。')) {
      deleteStudent(id);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingStudent) {
      updateStudent({ ...formData, id: editingStudent.id });
    } else {
      addStudent(formData);
    }
    setIsModalOpen(false);
  };

  const handleCardClick = (id: string) => {
      navigate(`/student/${id}`);
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-serif font-bold text-stone-800">我的班级</h2>
        <button
          onClick={handleOpenAdd}
          className="bg-monte-green text-white px-4 py-2 rounded-full flex items-center shadow-lg hover:bg-green-800 transition"
        >
          <Plus size={18} className="mr-1" /> 添加学生
        </button>
      </div>

      {students.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl border-2 border-dashed border-stone-200">
          <p className="text-stone-400 mb-4">还没有学生档案</p>
          <button onClick={handleOpenAdd} className="text-monte-green font-medium hover:underline">
            点击添加第一位学生
          </button>
        </div>
      ) : (
        <div className="grid gap-4">
          {students.map((student) => (
            <div
              key={student.id}
              onClick={() => handleCardClick(student.id)}
              className="bg-white p-4 rounded-xl shadow-sm border border-stone-100 flex items-center justify-between active:scale-[0.99] transition-transform cursor-pointer"
            >
              <div className="flex items-center space-x-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg ${student.gender === '女' ? 'bg-rose-300' : 'bg-blue-300'}`}>
                    {student.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-stone-800 text-lg">{student.name}</h3>
                  <div className="flex items-center text-stone-500 text-sm space-x-3">
                    <span className="flex items-center"><Baby size={14} className="mr-1"/> {student.age}岁</span>
                    {student.parentContact && (
                      <>
                        <span className="flex items-center text-stone-400">|</span>
                        <span className="flex items-center"><Phone size={14} className="mr-1"/> {student.parentContact}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                 <button 
                    onClick={(e) => handleOpenEdit(student, e)}
                    className="p-2 text-stone-400 hover:text-monte-green hover:bg-stone-50 rounded-full"
                 >
                    <Edit2 size={18} />
                 </button>
                 <button 
                    onClick={(e) => handleDelete(student.id, e)}
                    className="p-2 text-stone-400 hover:text-red-500 hover:bg-stone-50 rounded-full"
                 >
                    <Trash2 size={18} />
                 </button>
                 <ChevronRight className="text-stone-300" size={20} />
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingStudent ? '编辑学生' : '添加新学生'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-stone-600 mb-1">姓名</label>
            <input
              required
              type="text"
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
              className="w-full p-3 rounded-lg bg-stone-50 border border-stone-200 focus:ring-2 focus:ring-monte-green focus:outline-none"
            />
          </div>
          <div className="flex space-x-4">
            <div className="flex-1">
                <label className="block text-sm font-medium text-stone-600 mb-1">性别</label>
                <select
                    value={formData.gender}
                    onChange={e => setFormData({...formData, gender: e.target.value as '男' | '女'})}
                    className="w-full p-3 rounded-lg bg-stone-50 border border-stone-200 focus:ring-2 focus:ring-monte-green focus:outline-none"
                >
                    <option value="男">男</option>
                    <option value="女">女</option>
                </select>
            </div>
            <div className="flex-1">
                <label className="block text-sm font-medium text-stone-600 mb-1">年龄</label>
                <input
                required
                type="number"
                min="1"
                max="12"
                value={formData.age}
                onChange={e => setFormData({...formData, age: parseInt(e.target.value)})}
                className="w-full p-3 rounded-lg bg-stone-50 border border-stone-200 focus:ring-2 focus:ring-monte-green focus:outline-none"
                />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-600 mb-1">家长联系电话 (选填)</label>
            <input
              type="tel"
              value={formData.parentContact || ''}
              onChange={e => setFormData({...formData, parentContact: e.target.value})}
              className="w-full p-3 rounded-lg bg-stone-50 border border-stone-200 focus:ring-2 focus:ring-monte-green focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-600 mb-1">备注</label>
            <textarea
              rows={3}
              value={formData.notes || ''}
              onChange={e => setFormData({...formData, notes: e.target.value})}
              className="w-full p-3 rounded-lg bg-stone-50 border border-stone-200 focus:ring-2 focus:ring-monte-green focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-monte-green text-white font-bold rounded-lg hover:bg-green-800 transition mt-4"
          >
            保存
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default StudentList;