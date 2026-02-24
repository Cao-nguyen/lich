import { useState } from 'react';
import { DaySchedule, Period, DAYS } from '../types';
import { Card } from './ui/Card';
import { Modal } from './ui/Modal';
import { motion } from 'motion/react';
import { Clock, MapPin, FileText, ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';

interface ScheduleViewProps {
  schedule: DaySchedule[];
  onUpdatePeriod: (dayId: string, session: 'morning' | 'afternoon', index: number, data: Partial<Period>) => void;
  onResetSchedule: () => void;
}

export function ScheduleView({ schedule, onUpdatePeriod, onResetSchedule }: ScheduleViewProps) {
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [editingPeriod, setEditingPeriod] = useState<{
    dayId: string;
    session: 'morning' | 'afternoon';
    index: number;
    period: Period;
  } | null>(null);

  const currentDay = schedule[selectedDayIndex];

  const handlePrevDay = () => {
    setSelectedDayIndex((prev) => (prev > 0 ? prev - 1 : DAYS.length - 1));
  };

  const handleNextDay = () => {
    setSelectedDayIndex((prev) => (prev < DAYS.length - 1 ? prev + 1 : 0));
  };

  const handleReset = () => {
    if (confirm('Bạn có chắc muốn chuyển sang tuần mới? Tất cả môn học và lịch học thêm sẽ bị xoá, nhưng ghi chú sẽ được giữ lại.')) {
      onResetSchedule();
    }
  };

  const handleSavePeriod = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPeriod) return;
    
    const formData = new FormData(e.target as HTMLFormElement);
    onUpdatePeriod(editingPeriod.dayId, editingPeriod.session, editingPeriod.index, {
      subject: formData.get('subject') as string,
      room: formData.get('room') as string,
      note: formData.get('note') as string,
    });
    setEditingPeriod(null);
  };

  return (
    <div className="pb-24 pt-6 px-4 max-w-md mx-auto">
      {/* Day Selector */}
      <div className="flex items-center justify-between mb-8 relative">
        <button 
          onClick={handleReset}
          className="absolute left-0 top-1/2 -translate-y-1/2 -ml-12 p-2 text-gray-300 hover:text-rose-500 transition-colors hidden md:block"
          title="Làm mới thời khoá biểu"
        >
          <RotateCcw size={20} />
        </button>

        <button onClick={handlePrevDay} className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
          <ChevronLeft size={20} />
        </button>
        <div className="text-center">
          <motion.h2 
            key={currentDay?.name}
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-2xl font-bold text-gray-900"
          >
            {currentDay?.name}
          </motion.h2>
          <p className="text-sm text-gray-500 font-medium">Thời khoá biểu chính</p>
        </div>
        <button onClick={handleNextDay} className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
          <ChevronRight size={20} />
        </button>

        <button 
          onClick={handleReset}
          className="absolute right-0 top-1/2 -translate-y-1/2 -mr-12 p-2 text-gray-300 hover:text-rose-500 transition-colors hidden md:block"
          title="Làm mới thời khoá biểu"
        >
          <RotateCcw size={20} />
        </button>
      </div>

      <div className="flex justify-end mb-4 md:hidden">
        <button 
          onClick={handleReset}
          className="flex items-center gap-2 text-xs font-medium text-gray-400 hover:text-rose-500 transition-colors px-3 py-1.5 rounded-lg hover:bg-rose-50"
        >
          <RotateCcw size={14} />
          Chuyển sang tuần mới
        </button>
      </div>

      <div className="space-y-6">
        {/* Morning Session */}
        <SessionCard 
          title="Buổi Sáng" 
          periods={currentDay?.morning || []} 
          onPeriodClick={(p, idx) => setEditingPeriod({ dayId: currentDay.id, session: 'morning', index: idx, period: p })}
          icon={<div className="w-2 h-2 rounded-full bg-amber-400 mr-2 shadow-[0_0_8px_rgba(251,191,36,0.6)]" />}
        />

        {/* Afternoon Session */}
        <SessionCard 
          title="Buổi Chiều" 
          periods={currentDay?.afternoon || []} 
          onPeriodClick={(p, idx) => setEditingPeriod({ dayId: currentDay.id, session: 'afternoon', index: idx, period: p })}
          icon={<div className="w-2 h-2 rounded-full bg-indigo-400 mr-2 shadow-[0_0_8px_rgba(129,140,248,0.6)]" />}
        />
      </div>

      {/* Edit Modal */}
      <Modal
        isOpen={!!editingPeriod}
        onClose={() => setEditingPeriod(null)}
        title={editingPeriod ? `Tiết ${editingPeriod.index + 1} - ${editingPeriod.session === 'morning' ? 'Sáng' : 'Chiều'}` : ''}
      >
        <form onSubmit={handleSavePeriod} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Môn học</label>
            <input
              name="subject"
              defaultValue={editingPeriod?.period.subject}
              placeholder="Nhập tên môn học..."
              className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
              autoFocus
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phòng học (Tuỳ chọn)</label>
            <input
              name="room"
              defaultValue={editingPeriod?.period.room}
              placeholder="Ví dụ: A101"
              className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ghi chú</label>
            <textarea
              name="note"
              defaultValue={editingPeriod?.period.note}
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
              Lưu thay đổi
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

function SessionCard({ title, periods, onPeriodClick, icon }: { title: string, periods: Period[], onPeriodClick: (p: Period, idx: number) => void, icon: React.ReactNode }) {
  return (
    <Card className="p-1">
      <div className="px-5 py-4 border-b border-gray-50 flex items-center">
        {icon}
        <h3 className="font-semibold text-gray-800">{title}</h3>
      </div>
      <div className="divide-y divide-gray-50">
        {periods.map((period, idx) => (
          <motion.div
            key={period.id}
            whileTap={{ backgroundColor: "rgba(0,0,0,0.02)" }}
            onClick={() => onPeriodClick(period, idx)}
            className="flex items-center px-5 py-4 cursor-pointer group transition-colors hover:bg-gray-50/50"
          >
            <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500 mr-4 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
              {idx + 1}
            </div>
            <div className="flex-1">
              {period.subject ? (
                <div>
                  <div className="font-medium text-gray-900">{period.subject}</div>
                  {(period.room || period.note) && (
                    <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                      {period.room && (
                        <span className="flex items-center gap-1">
                          <MapPin size={10} /> {period.room}
                        </span>
                      )}
                      {period.note && (
                        <span className="flex items-center gap-1">
                          <FileText size={10} /> {period.note}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <span className="text-gray-400 text-sm italic">Trống</span>
              )}
            </div>
            <div className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-300">
              <ChevronRight size={16} />
            </div>
          </motion.div>
        ))}
      </div>
    </Card>
  );
}
