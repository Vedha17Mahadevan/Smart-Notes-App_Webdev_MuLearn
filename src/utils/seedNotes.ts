import { Note } from '../types/Note';

export const seedNotes: Note[] = [
  {
    id: '1',
    title: 'Welcome to Smart Notes',
    body: 'This is your personal note-taking app. You can create, edit, and delete notes. Try pinning important notes to keep them at the top!\n\n**Features:**\n- Add, edit, and delete notes\n- Pin important notes\n- Search through your notes\n- Light and dark mode\n- Markdown support\n- Export your notes',
    createdAt: Date.now() - 86400000 * 2,
    updatedAt: Date.now() - 86400000 * 2,
    isPinned: true,
  },
  {
    id: '2',
    title: 'Meeting Notes - Project Planning',
    body: '## Agenda\n- Review project timeline\n- Discuss resource allocation\n- Set milestones\n\n**Action Items:**\n- Follow up with design team\n- Schedule next meeting\n- Update project documentation',
    createdAt: Date.now() - 86400000,
    updatedAt: Date.now() - 86400000,
    isPinned: false,
  },
  {
    id: '3',
    title: 'Grocery List',
    body: '* Milk\n* Eggs\n* Bread\n* Coffee\n* Fresh vegetables\n* Chicken\n* Rice',
    createdAt: Date.now() - 3600000 * 12,
    updatedAt: Date.now() - 3600000 * 12,
    isPinned: false,
  },
  {
    id: '4',
    title: 'Book Recommendations',
    body: 'Books to read this month:\n\n1. "Atomic Habits" by James Clear\n2. "Deep Work" by Cal Newport\n3. "The Pragmatic Programmer"\n\n_Currently reading: Atomic Habits - halfway through and loving it!_',
    createdAt: Date.now() - 3600000 * 6,
    updatedAt: Date.now() - 3600000 * 6,
    isPinned: false,
  },
  {
    id: '5',
    title: 'Code Snippets',
    body: 'Useful code patterns:\n\n`Array.map()` for transforming arrays\n`Array.filter()` for filtering elements\n`Array.reduce()` for aggregating values\n\n**Remember:** Always write clean, readable code with proper comments.',
    createdAt: Date.now() - 3600000 * 2,
    updatedAt: Date.now() - 3600000 * 2,
    isPinned: false,
  },
];
