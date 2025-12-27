// src/components/Header.tsx
import { Search, Moon, Sun, Download } from 'lucide-react';

interface HeaderProps {
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onExportJSON: () => void;
  onExportTXT: () => void;
  sortOrder: 'new' | 'old';
  onSortChange: (v: 'new' | 'old') => void;
}

export function Header({
  theme,
  onToggleTheme,
  searchQuery,
  onSearchChange,
  onExportJSON,
  onExportTXT,
  sortOrder,
  onSortChange,
}: HeaderProps) {
  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            Smart Notes
          </h1>

          <div className="flex items-center gap-3 flex-1 max-w-md">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={20} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search notes..."
                className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                aria-label="Search notes"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={sortOrder}
              onChange={(e) => onSortChange(e.target.value as 'new' | 'old')}
              className="px-3 py-2 rounded-md bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm"
              aria-label="Sort notes"
              title="Sort notes"
            >
              <option value="new">Newest First</option>
              <option value="old">Oldest First</option>
            </select>

            <div className="flex items-center gap-1 border-l pl-3 ml-3">
              <button
                onClick={onExportTXT}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-gray-600 dark:text-gray-400 text-sm"
                aria-label="Export notes as TXT"
                title="Download all notes as .txt"
              >
                TXT
              </button>

              <button
                onClick={onExportJSON}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-gray-600 dark:text-gray-400"
                aria-label="Export notes as JSON"
                title="Download all notes as .json"
              >
                <Download size={18} />
              </button>

              <button
                onClick={onToggleTheme}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-gray-600 dark:text-gray-400"
                aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
                title="Toggle theme"
              >
                {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
