import { Note } from '../types/Note';

const NOTES_KEY = 'smart-notes-app';
const THEME_KEY = 'smart-notes-theme';

export const storage = {
  getNotes(): Note[] {
    try {
      const notes = localStorage.getItem(NOTES_KEY);
      return notes ? JSON.parse(notes) : [];
    } catch (error) {
      console.error('Error loading notes:', error);
      return [];
    }
  },

  saveNotes(notes: Note[]): void {
    try {
      localStorage.setItem(NOTES_KEY, JSON.stringify(notes));
    } catch (error) {
      console.error('Error saving notes:', error);
    }
  },

  getTheme(): 'light' | 'dark' {
    try {
      const theme = localStorage.getItem(THEME_KEY);
      return theme === 'dark' ? 'dark' : 'light';
    } catch (error) {
      return 'light';
    }
  },

  saveTheme(theme: 'light' | 'dark'): void {
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  },
};
