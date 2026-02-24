import { useState } from 'react';
import { Note, COLORS } from '../types';
import { Modal } from './ui/Modal';
import { Plus, Trash2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

interface NotesViewProps {
  notes: Note[];
  onAdd: (note: Note) => void;
  onUpdate: (id: string, content: string) => void;
  onDelete: (id: string) => void;
}

export function NotesView({ notes, onAdd, onUpdate, onDelete }: NotesViewProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const content = formData.get('content') as string;

    if (!content.trim()) return;

    onAdd({
      id: crypto.randomUUID(),
      content,
      createdAt: Date.now(),
      color: selectedColor,
    });
    setIsModalOpen(false);
    setSelectedColor(COLORS[0]);
  };

  return (
    <div className="pb-24 pt-6 px-4 max-w-md mx-auto min-h-screen">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Ghi Chú</h2>
          <p className="text-sm text-gray-500 font-medium">Lưu lại mọi thứ quan trọng</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-200 active:scale-90 transition-transform"
        >
          <Plus size={24} />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <AnimatePresence>
          {notes.map((note, idx) => (
            <motion.div
              key={note.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ delay: idx * 0.05 }}
              className={cn(
                "aspect-square rounded-2xl p-4 flex flex-col justify-between relative group shadow-sm hover:shadow-md transition-shadow",
                note.color
              )}
            >
              <textarea
                defaultValue={note.content}
                onBlur={(e) => onUpdate(note.id, e.target.value)}
                className="w-full h-full bg-transparent resize-none outline-none text-sm font-medium placeholder-black/20"
              />
              <button
                onClick={() => onDelete(note.id)}
                className="absolute top-2 right-2 p-1.5 rounded-full bg-black/5 text-black/40 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/10 hover:text-black/60"
              >
                <X size={14} />
              </button>
              <div className="text-[10px] opacity-40 font-mono mt-2">
                {new Date(note.createdAt).toLocaleDateString('vi-VN')}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {notes.length === 0 && (
        <div className="text-center py-20 text-gray-400">
          <p>Chưa có ghi chú nào</p>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="text-indigo-600 font-medium mt-2 hover:underline"
          >
            Tạo ghi chú mới
          </button>
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Ghi chú mới"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <textarea
              name="content"
              placeholder="Viết gì đó..."
              rows={5}
              className={cn(
                "w-full px-4 py-4 rounded-2xl border-none focus:ring-0 outline-none transition-all text-lg",
                selectedColor
              )}
              autoFocus
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Chọn màu</label>
            <div className="flex gap-2 flex-wrap">
              {COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setSelectedColor(color)}
                  className={cn(
                    "w-8 h-8 rounded-full border-2 transition-all",
                    color,
                    selectedColor === color ? "border-indigo-600 scale-110" : "border-transparent hover:scale-105"
                  )}
                />
              ))}
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              className="w-full py-3.5 bg-indigo-600 text-white rounded-xl font-semibold shadow-lg shadow-indigo-200 active:scale-[0.98] transition-all"
            >
              Tạo ghi chú
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
