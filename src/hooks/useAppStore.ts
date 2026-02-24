import { useState, useEffect } from 'react';
import { DaySchedule, ExtraClass, Note, DAYS, Period } from '../types';

const STORAGE_KEY_SCHEDULE = 'app_schedule_v1';
const STORAGE_KEY_EXTRA = 'app_extra_v1';
const STORAGE_KEY_NOTES = 'app_notes_v1';

const generateEmptySchedule = (): DaySchedule[] => {
  return DAYS.map((day) => ({
    id: day.id,
    name: day.name,
    morning: Array.from({ length: 5 }).map((_, i) => ({
      id: `${day.id}-morning-${i + 1}`,
      subject: '',
      isActive: true,
    })),
    afternoon: Array.from({ length: 5 }).map((_, i) => ({
      id: `${day.id}-afternoon-${i + 1}`,
      subject: '',
      isActive: true,
    })),
  }));
};

export function useAppStore() {
  const [schedule, setSchedule] = useState<DaySchedule[]>([]);
  const [extraClasses, setExtraClasses] = useState<ExtraClass[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const loadData = () => {
      try {
        const storedSchedule = localStorage.getItem(STORAGE_KEY_SCHEDULE);
        const storedExtra = localStorage.getItem(STORAGE_KEY_EXTRA);
        const storedNotes = localStorage.getItem(STORAGE_KEY_NOTES);

        if (storedSchedule) {
          setSchedule(JSON.parse(storedSchedule));
        } else {
          setSchedule(generateEmptySchedule());
        }

        if (storedExtra) setExtraClasses(JSON.parse(storedExtra));
        if (storedNotes) setNotes(JSON.parse(storedNotes));
      } catch (e) {
        console.error("Failed to load data", e);
        setSchedule(generateEmptySchedule());
      } finally {
        setIsLoaded(true);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY_SCHEDULE, JSON.stringify(schedule));
    }
  }, [schedule, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY_EXTRA, JSON.stringify(extraClasses));
    }
  }, [extraClasses, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY_NOTES, JSON.stringify(notes));
    }
  }, [notes, isLoaded]);

  // Sync across tabs
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY_SCHEDULE && e.newValue) {
        setSchedule(JSON.parse(e.newValue));
      }
      if (e.key === STORAGE_KEY_EXTRA && e.newValue) {
        setExtraClasses(JSON.parse(e.newValue));
      }
      if (e.key === STORAGE_KEY_NOTES && e.newValue) {
        setNotes(JSON.parse(e.newValue));
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const updatePeriod = (dayId: string, session: 'morning' | 'afternoon', periodIndex: number, data: Partial<Period>) => {
    setSchedule((prev) =>
      prev.map((day) => {
        if (day.id !== dayId) return day;
        const newSession = [...day[session]];
        newSession[periodIndex] = { ...newSession[periodIndex], ...data };
        return { ...day, [session]: newSession };
      })
    );
  };

  const addExtraClass = (cls: ExtraClass) => {
    setExtraClasses((prev) => [...prev, cls]);
  };

  const updateExtraClass = (id: string, data: Partial<ExtraClass>) => {
    setExtraClasses((prev) => prev.map((c) => (c.id === id ? { ...c, ...data } : c)));
  };

  const deleteExtraClass = (id: string) => {
    setExtraClasses((prev) => prev.filter((c) => c.id !== id));
  };

  const addNote = (note: Note) => {
    setNotes((prev) => [note, ...prev]);
  };

  const updateNote = (id: string, content: string) => {
    setNotes((prev) => prev.map((n) => (n.id === id ? { ...n, content } : n)));
  };

  const deleteNote = (id: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
  };

  const resetSchedule = () => {
    setSchedule(generateEmptySchedule());
    setExtraClasses([]);
  };

  return {
    schedule,
    extraClasses,
    notes,
    updatePeriod,
    addExtraClass,
    updateExtraClass,
    deleteExtraClass,
    addNote,
    updateNote,
    deleteNote,
    resetSchedule,
    isLoaded,
  };
}
