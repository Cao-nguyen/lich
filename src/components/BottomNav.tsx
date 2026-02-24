import { Calendar, BookOpen, StickyNote } from 'lucide-react';
import { cn } from '../lib/utils';

interface BottomNavProps {
  activeTab: 'schedule' | 'extra' | 'notes';
  onChange: (tab: 'schedule' | 'extra' | 'notes') => void;
}

export function BottomNav({ activeTab, onChange }: BottomNavProps) {
  const tabs = [
    { id: 'schedule', label: 'Thời khoá biểu', icon: Calendar },
    { id: 'extra', label: 'Học thêm', icon: BookOpen },
    { id: 'notes', label: 'Ghi chú', icon: StickyNote },
  ] as const;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 h-[80px] flex items-center px-6 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] z-40">
      <div className="flex justify-around items-center max-w-md mx-auto w-full h-full">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className={cn(
                "flex flex-col items-center justify-center w-full h-full space-y-1 transition-all duration-300",
                isActive ? "text-indigo-600 -translate-y-1" : "text-gray-400 hover:text-gray-600"
              )}
            >
              <tab.icon
                size={24}
                className={cn(
                  "transition-all duration-300",
                  isActive ? "fill-indigo-100 stroke-[2.5px]" : "stroke-2"
                )}
              />
              <span className="text-[10px] font-medium tracking-wide">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
