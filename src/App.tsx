import { useState } from 'react';
import { useAppStore } from './hooks/useAppStore';
import { ScheduleView } from './components/ScheduleView';
import { ExtraClassesView } from './components/ExtraClassesView';
import { NotesView } from './components/NotesView';
import { BottomNav } from './components/BottomNav';
import { motion, AnimatePresence } from 'motion/react';

function App() {
  const [activeTab, setActiveTab] = useState<'schedule' | 'extra' | 'notes'>('schedule');
  const store = useAppStore();

  if (!store.isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FC] font-sans text-gray-900 selection:bg-indigo-100 selection:text-indigo-900">
      <AnimatePresence mode="wait">
        {activeTab === 'schedule' && (
          <motion.div
            key="schedule"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.2 }}
          >
            <ScheduleView 
              schedule={store.schedule} 
              onUpdatePeriod={store.updatePeriod} 
              onResetSchedule={store.resetSchedule}
            />
          </motion.div>
        )}
        {activeTab === 'extra' && (
          <motion.div
            key="extra"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.2 }}
          >
            <ExtraClassesView 
              classes={store.extraClasses} 
              onAdd={store.addExtraClass}
              onUpdate={store.updateExtraClass}
              onDelete={store.deleteExtraClass}
            />
          </motion.div>
        )}
        {activeTab === 'notes' && (
          <motion.div
            key="notes"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.2 }}
          >
            <NotesView 
              notes={store.notes}
              onAdd={store.addNote}
              onUpdate={store.updateNote}
              onDelete={store.deleteNote}
            />
          </motion.div>
        )}
      </AnimatePresence>
      
      <BottomNav activeTab={activeTab} onChange={setActiveTab} />
    </div>
  );
}

export default App;
