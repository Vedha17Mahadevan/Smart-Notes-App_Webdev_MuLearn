// src/types/Note.ts
export interface Note {
  id: string;
  title: string;
  body: string;
  createdAt: number;
  updatedAt: number;
  isPinned: boolean;
  // smart metadata
  summary?: string;
  tags?: string[];
  mood?: 'happy' | 'urgent' | 'neutral' | string;
}
