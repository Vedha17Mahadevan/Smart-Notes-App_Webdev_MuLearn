// src/App.tsx
import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { Note } from './types/Note';
import { storage } from './utils/storage';
import { seedNotes } from './utils/seedNotes';
import { Header } from './components/Header';
import { NoteCard } from './components/NoteCard';
import { NoteModal } from './components/NoteModal';

type SortOrder = 'new' | 'old';

/**
 * Mock smart metadata generator (summary, tags, mood).
 * Deterministic, client-side — replace with AI API if available.
 */
function generateSmartMetadata(title: string, body: string) {
  const text = `${title} ${body}`.trim();
  const lower = text.toLowerCase();

  // summary: first 140 chars of body (or title+body)
  const summary = body.trim()
    ? (body.trim().slice(0, 140) + (body.length > 140 ? '…' : ''))
    : (title.trim().slice(0, 140) + (title.length > 140 ? '…' : ''));

  // simple tag extraction: frequency excluding stopwords
  const stop = new Set(['the','is','and','a','to','of','in','on','for','it','this','that','with','as','an','you','i']);
  const words = lower.match(/\b[a-z0-9]+\b/g) || [];
  const freq: Record<string, number> = {};
  words.forEach(w => {
    if (!stop.has(w) && w.length > 2) freq[w] = (freq[w]||0) + 1;
  });

  const tags = Object.entries(freq).sort((a,b)=>b[1]-a[1]).slice(0,5).map(x=>x[0]);

  // simple mood inference
  let mood: Note['mood'] = 'neutral';
  if (/\burgent\b/.test(lower) || /!/.test(lower)) mood = 'urgent';
  if (/\bhappy\b|\bexcited\b|:\)|😊|😀/.test(lower)) mood = 'happy';

  return { summary, tags, mood };
}

function App() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>('new');

  useEffect(() => {
    const savedNotes = storage.getNotes();
    if (!savedNotes || savedNotes.length === 0) {
      // generate metadata for seed notes if absent
      const seeded = (seedNotes || []).map(n => ({
        ...n,
        summary: n.summary ?? generateSmartMetadata(n.title, n.body).summary,
        tags: n.tags ?? generateSmartMetadata(n.title, n.body).tags,
        mood: n.mood ?? generateSmartMetadata(n.title, n.body).mood,
      }));
      storage.saveNotes(seeded);
      setNotes(seeded);
    } else {
      setNotes(savedNotes);
    }

    const savedTheme = storage.getTheme();
    setTheme(savedTheme);
    document.documentElement.classList.toggle('dark', savedTheme === 'dark');
  }, []);

  const handleToggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    storage.saveTheme(newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  // Save note (create or update) — generate/update smart metadata
  const handleSaveNote = (noteData: Partial<Note>) => {
    let updatedNotes: Note[];

    if (noteData.id) {
      // update existing note
      updatedNotes = notes.map((n) => {
        if (n.id === noteData.id) {
          const newTitle = noteData.title ?? n.title;
          const newBody = noteData.body ?? n.body;
          const meta = generateSmartMetadata(newTitle, newBody);

          return {
            ...n,
            ...noteData,
            title: newTitle,
            body: newBody,
            updatedAt: Date.now(),
            summary: meta.summary,
            tags: meta.tags,
            mood: meta.mood,
          };
        }
        return n;
      });
    } else {
      // create new note
      const title = noteData.title || 'Untitled Note';
      const body = noteData.body || '';
      const meta = generateSmartMetadata(title, body);

      const newNote: Note = {
        id: Date.now().toString(),
        title,
        body,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        isPinned: false,
        summary: meta.summary,
        tags: meta.tags,
        mood: meta.mood,
      };
      updatedNotes = [newNote, ...notes];
    }

    setNotes(updatedNotes);
    storage.saveNotes(updatedNotes);
  };

  const handleDeleteNote = (id: string) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      const updatedNotes = notes.filter((n) => n.id !== id);
      setNotes(updatedNotes);
      storage.saveNotes(updatedNotes);
    }
  };

  const handleTogglePin = (id: string) => {
    const updatedNotes = notes.map((n) =>
      n.id === id ? { ...n, isPinned: !n.isPinned, updatedAt: Date.now() } : n
    );
    setNotes(updatedNotes);
    storage.saveNotes(updatedNotes);
  };

  const handleEditNote = (note: Note) => {
    setEditingNote(note);
    setIsModalOpen(true);
  };

  const handleNewNote = () => {
    setEditingNote(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingNote(null);
  };

  // Export JSON
  const handleExportJSON = () => {
    const dataStr = JSON.stringify(notes, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `smart-notes-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Export TXT
  const handleExportTXT = () => {
    let text = '';
    notes.forEach((note) => {
      text += `Title: ${note.title}\n`;
      text += `Created: ${new Date(note.createdAt).toLocaleString()}\n`;
      text += `Updated: ${new Date(note.updatedAt).toLocaleString()}\n`;
      if (note.tags && note.tags.length) text += `Tags: ${note.tags.join(', ')}\n`;
      if (note.mood) text += `Mood: ${note.mood}\n`;
      if (note.summary) text += `Summary: ${note.summary}\n\n`;
      text += `${note.body}\n\n---------------------\n\n`;
    });

    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `smart-notes-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Filter (search)
  const filteredNotes = notes.filter((note) => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return true;
    const hay = `${note.title} ${note.body} ${(note.tags || []).join(' ')}`.toLowerCase();
    return hay.includes(q);
  });

  // Sorting + pinned on top
  const sortedNotes = [...filteredNotes].sort((a, b) => {
    // pinned first
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;

    // then by sortOrder (by updatedAt)
    if (sortOrder === 'new') {
      return b.updatedAt - a.updatedAt;
    } else {
      return a.updatedAt - b.updatedAt;
    }
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <Header
        theme={theme}
        onToggleTheme={handleToggleTheme}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onExportJSON={handleExportJSON}
        onExportTXT={handleExportTXT}
        sortOrder={sortOrder}
        onSortChange={setSortOrder}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {sortedNotes.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500 dark:text-gray-400 text-lg mb-4">
              {searchQuery ? 'No notes found matching your search.' : 'No notes yet. Create your first note!'}
            </p>
            {!searchQuery && (
              <button
                onClick={handleNewNote}
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
              >
                <Plus size={20} />
                Create Note
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {sortedNotes.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                onEdit={handleEditNote}
                onDelete={handleDeleteNote}
                onTogglePin={handleTogglePin}
              />
            ))}
          </div>
        )}
      </main>

      <button
        onClick={handleNewNote}
        className="fixed bottom-8 right-8 p-4 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
        aria-label="Add new note"
        title="Create new note"
      >
        <Plus size={28} />
      </button>

      <NoteModal
        isOpen={isModalOpen}
        note={editingNote}
        onClose={handleCloseModal}
        onSave={handleSaveNote}
      />
    </div>
  );
}

export default App;
