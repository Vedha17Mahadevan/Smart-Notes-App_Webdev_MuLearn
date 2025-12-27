import { Note } from '../types/Note';
import { Pin, Edit, Trash2, Download } from 'lucide-react';

interface NoteCardProps {
  note: Note;
  onEdit: (note: Note) => void;
  onDelete: (id: string) => void;
  onTogglePin: (id: string) => void;
}

export function NoteCard({ note, onEdit, onDelete, onTogglePin }: NoteCardProps) {
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getPreview = (body: string) => {
    const plainText = body.replace(/[#*_\[\]()]/g, '');
    return plainText.length > 120 ? plainText.substring(0, 120) + '...' : plainText;
  };

  const handleDownload = () => {
    const dataStr = JSON.stringify(note, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${note.title || 'note'}-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow p-5 border border-gray-200 dark:border-gray-700">
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex-1 pr-2 line-clamp-2">
          {note.title || 'Untitled Note'}
        </h3>
        <button
          onClick={() => onTogglePin(note.id)}
          className={`p-1.5 rounded-full transition-colors flex-shrink-0 ${
            note.isPinned
              ? 'text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/30'
              : 'text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
          }`}
          aria-label={note.isPinned ? 'Unpin note' : 'Pin note'}
        >
          <Pin size={18} fill={note.isPinned ? 'currentColor' : 'none'} />
        </button>
      </div>

      <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3">
        {getPreview(note.body)}
      </p>

      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-3">
        <span>Updated {formatDate(note.updatedAt)}</span>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => onEdit(note)}
          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-md hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors text-sm font-medium"
          aria-label="Edit note"
        >
          <Edit size={16} />
          Edit
        </button>
        <button
          onClick={handleDownload}
          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-md hover:bg-green-100 dark:hover:bg-green-900/50 transition-colors text-sm font-medium"
          aria-label="Download note"
        >
          <Download size={16} />
          Download
        </button>
        <button
          onClick={() => onDelete(note.id)}
          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-md hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors text-sm font-medium"
          aria-label="Delete note"
        >
          <Trash2 size={16} />
          Delete
        </button>
      </div>
    </div>
  );
}
