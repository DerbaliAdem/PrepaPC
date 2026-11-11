import { useEffect, useState } from 'react';

export const NOTES_KEY = 'prepa-exam-notes';

export function readNotes(): Record<string, string> {
  try {
    return JSON.parse(localStorage.getItem(NOTES_KEY) ?? '{}') as Record<string, string>;
  } catch {
    return {};
  }
}

/** A personal note for one exam, saved in this browser as you type. */
export function useNote(examId: string) {
  const [text, setText] = useState(() => readNotes()[examId] ?? '');

  useEffect(() => {
    const t = setTimeout(() => {
      try {
        const all = readNotes();
        if (text.trim()) all[examId] = text;
        else delete all[examId];
        localStorage.setItem(NOTES_KEY, JSON.stringify(all));
      } catch {
        /* storage unavailable */
      }
    }, 300);
    return () => clearTimeout(t);
  }, [examId, text]);

  return [text, setText] as const;
}
