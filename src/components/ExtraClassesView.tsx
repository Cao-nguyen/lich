import { useState } from 'react';
import { ExtraClass, DAYS } from '../types';
import { Card } from './ui/Card';
import { Modal } from './ui/Modal';
import { Plus, Clock, MapPin, Trash2, Edit2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ExtraClassesViewProps {
  classes: ExtraClass[];
  onAdd: (cls: ExtraClass) => void;
  onUpdate: (id: string, data: Partial<ExtraClass>) => void;
  onDelete: (id: string) => void;
}

export function ExtraClassesView({ classes, onAdd, onUpdate, onDelete }: ExtraClassesViewProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<ExtraClass | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    
    const data = {
      dayId: formData.get('dayId') as string,
      time: formData.get('time') as string,
      subject: formData.get('subject') as string,
      location: formData.get('location') as string,
      note: formData.get('note') as string,
    };

    if (editingClass) {
      onUpdate(editingClass.id, data);
    } else {
      onAdd({
        id: crypto.randomUUID(),
        ...data,
      });
    }
    setIsModalOpen(false);
    setEditingClass(null);
  };

  const handleEdit = (cls: ExtraClass) => {
    setEditingClass(cls);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Bạn có chắc muốn xoá lịch học này?')) {
      onDelete(id);
    }
  };

  // Group classes by day
  const groupedClasses = DAYS.map(day => ({
    ...day,
    classes: classes.filter(c => c.dayId === day.id).sort((a, b) => a.time.localeCompare(b.time))
  })).filter(day => day.classes.length > 0);

  return (
    <div className="pb-24 pt-6 px-4 max-w-md mx-auto min-h-screen">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Lịch Học Thêm</h2>
          <p className="text-sm text-gray-500 font-medium">Quản lý các lớp học thêm</p>
        </div>
        <button
          onClick={() => { setEditingClass(null); setIsModalOpen(true); }}
          className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-200 active:scale-90 transition-transform"
        >
          <Plus size={24} />
        </button>
      </div>

      {classes.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Clock size={32} className="opacity-50" />
          </div>
          <p>Chưa có lịch học thêm nào</p>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="text-indigo-600 font-medium mt-2 hover:underline"
          >
            Thêm ngay
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {groupedClasses.map((day) => (
            <div key={day.id}>
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3 ml-1">{day.name}</h3>
              <div className="space-y-3">
                <AnimatePresence>
                  {day.classes.map((cls, idx) => (
                    <Card key={cls.id} delay={idx * 0.05} className="relative group">
                      <div className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-1 rounded-md bg-indigo-50 text-indigo-700 text-xs font-bold font-mono">
                              {cls.time}
                            </span>
                            <h4 className="font-bold text-gray-900">{cls.subject}</h4>
                          </div>
                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => handleEdit(cls)} className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                              <Edit2 size={16} />
                            </button>
                            <button onClick={() => handleDelete(cls.id)} className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors">
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                        
                        <div className="space-y-1">
                          {cls.location && (
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                              <MapPin size={14} />
                              <span>{cls.location}</span>
                            </div>
                          )}
                          {cls.note && (
                            <div className="text-sm text-gray-500 pl-0.5 border-l-2 border-gray-200 ml-0.5 pl-2 mt-2 italic">
                              {cls.note}
                            </div>
                          )}
                        </div>
                      </div>
                    </Card>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingClass ? "Sửa lịch học" : "Thêm lịch học thêm"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Thứ</label>
              <select
                name="dayId"
                defaultValue={editingClass?.dayId || 'mon'}
                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all appearance-none"
              >
                {DAYS.map(d => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Giờ</label>
              <input
                type="time"
                name="time"
                defaultValue={editingClass?.time || '17:30'}
                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Môn học</label>
            <input
              name="subject"
              defaultValue={editingClass?.subject}
              placeholder="Nhập tên môn..."
              className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Địa điểm (Tuỳ chọn)</label>
            <input
              name="location"
              defaultValue={editingClass?.location}
              placeholder="Ví dụ: Nhà cô Lan..."
              className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ghi chú</label>
            <textarea
              name="note"
              defaultValue={editingClass?.note}
              placeholder="Ghi chú thêm..."
              rows={3}
              className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all resize-none"
            />
          </div>
          <div className="pt-4">
            <button
              type="submit"
              className="w-full py-3.5 bg-indigo-600 text-white rounded-xl font-semibold shadow-lg shadow-indigo-200 active:scale-[0.98] transition-all"
            >
              {editingClass ? "Lưu thay đổi" : "Thêm lịch học"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
