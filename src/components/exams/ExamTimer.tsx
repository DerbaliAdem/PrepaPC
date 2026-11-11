import { useEffect, useRef, useState } from 'react';
import { Pause, Play, RotateCcw, Timer, X } from 'lucide-react';
import type { Subject } from '../../types';

// Durations printed on the papers read so far (Physique and Maths 4 h, STA 3 h).
const KNOWN: Partial<Record<Subject, number>> = { physique: 240, mathematiques: 240, sta: 180 };
const PRESETS = [120, 180, 240];

const fmt = (s: number) => {
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return `${h}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
};

/** Countdown for working a paper in exam conditions. */
export default function ExamTimer({ subject }: { subject: Subject }) {
  const [open, setOpen] = useState(false);
  const [minutes, setMinutes] = useState(KNOWN[subject] ?? 240);
  const [left, setLeft] = useState(minutes * 60);
  const [running, setRunning] = useState(false);
  const endAt = useRef(0);

  useEffect(() => {
    if (!running) return;
    endAt.current = Date.now() + left * 1000;
    const id = setInterval(() => {
      const s = Math.max(0, Math.round((endAt.current - Date.now()) / 1000));
      setLeft(s);
      if (s === 0) setRunning(false);
    }, 250);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running]);

  const choose = (m: number) => {
    setMinutes(m);
    setLeft(m * 60);
    setRunning(false);
  };

  const btn = 'grid size-8 place-items-center rounded-md text-muted hover:bg-sunken hover:text-ink';

  if (!open)
    return (
      <button type="button" onClick={() => setOpen(true)} className="inline-flex h-8 items-center gap-1.5 rounded-md border border-line px-2.5 text-sm text-ink hover:bg-sunken">
        <Timer size={14} /> Chrono
      </button>
    );

  const done = left === 0;
  return (
    <div className="inline-flex h-8 items-center gap-1 rounded-md border border-line pl-2" role="timer" aria-live="off">
      <span className={`min-w-[62px] text-sm font-semibold tabular ${done ? 'text-red-700 dark:text-red-400' : left < 900 ? 'text-warn' : 'text-ink'}`}>
        {done ? 'Terminé' : fmt(left)}
      </span>
      {!running && left === minutes * 60 && (
        <select aria-label="Durée" value={minutes} onChange={(e) => choose(Number(e.target.value))} className="h-7 rounded bg-sunken px-1 text-xs text-ink">
          {PRESETS.map((m) => (
            <option key={m} value={m}>{m / 60} h</option>
          ))}
        </select>
      )}
      {!done && (
        <button type="button" className={btn} onClick={() => setRunning((r) => !r)} aria-label={running ? 'Pause' : 'Démarrer'}>
          {running ? <Pause size={15} /> : <Play size={15} />}
        </button>
      )}
      <button type="button" className={btn} onClick={() => choose(minutes)} aria-label="Réinitialiser"><RotateCcw size={14} /></button>
      <button type="button" className={btn} onClick={() => { setRunning(false); setOpen(false); }} aria-label="Fermer le chrono"><X size={15} /></button>
    </div>
  );
}
