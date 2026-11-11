import { useNote } from '../../hooks/useNotes';

export default function ExamNotes({ examId }: { examId: string }) {
  const [text, setText] = useNote(examId);
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-ink">Mes notes</span>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={4}
        placeholder="Ex. : refaire Q12, erreur de signe dans la partie II…"
        className="w-full resize-y rounded-md border border-line bg-surface px-3 py-2 text-sm text-ink placeholder:text-faint focus:border-accent focus:outline-none"
      />
    </label>
  );
}
