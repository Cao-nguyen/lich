import { forwardRef } from 'react';
import { ExtraClass, DAYS } from '../types';
import { cn } from '../lib/utils';

interface WeeklyTableProps {
  classes: ExtraClass[];
  id?: string;
}

export const WeeklyTable = forwardRef<HTMLDivElement, WeeklyTableProps>(({ classes, id }, ref) => {
  const getClassesForDay = (dayId: string) => {
    return classes
      .filter((c) => c.dayId === dayId)
      .sort((a, b) => a.time.localeCompare(b.time));
  };

  return (
    <div ref={ref} id={id} className="bg-white p-8 min-w-[800px] mx-auto">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900 uppercase tracking-wider">Lịch Học Thêm</h1>
        <p className="text-gray-500 mt-2">Thời gian biểu trong tuần</p>
      </div>

      <div className="grid grid-cols-7 border-2 border-gray-900">
        {DAYS.map((day, index) => (
          <div key={day.id} className={cn("border-r-2 border-gray-900 last:border-r-0", index % 2 === 0 ? "bg-gray-50" : "bg-white")}>
            {/* Header */}
            <div className="p-3 text-center border-b-2 border-gray-900 bg-indigo-100 font-bold text-indigo-900 uppercase text-sm">
              {day.name}
            </div>
            
            {/* Content */}
            <div className="p-2 min-h-[300px] space-y-3">
              {getClassesForDay(day.id).map((cls) => (
                <div key={cls.id} className="bg-white border border-gray-200 rounded-lg p-2 shadow-sm text-sm">
                  <div className="font-bold text-indigo-700 text-xs mb-1">{cls.time}</div>
                  <div className="font-bold text-gray-900 leading-tight mb-1">{cls.subject}</div>
                  {cls.location && (
                    <div className="text-xs text-gray-500 mb-1 line-clamp-1">📍 {cls.location}</div>
                  )}
                  {cls.note && (
                    <div className="text-[10px] text-gray-400 italic border-t border-gray-100 pt-1 mt-1">
                      {cls.note}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex justify-between text-xs text-gray-400 font-mono">
        <div>Được tạo bởi School Schedule App</div>
        <div>{new Date().toLocaleDateString('vi-VN')}</div>
      </div>
    </div>
  );
});

WeeklyTable.displayName = 'WeeklyTable';
