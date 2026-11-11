import { useRef, useState } from 'react';
import { Download, Upload } from 'lucide-react';
import { Button } from './ui/primitives';

// Everything the app stores in this browser.
const KEYS = ['prepa-revision-progress', 'prepa-exam-notes', 'prepa-exam-status', 'prepa-theme'];

export function ExportButton() {
  const save = () => {
    const data: Record<string, unknown> = { app: 'prepa-pc', version: 1, exportedAt: new Date().toISOString() };
    for (const k of KEYS) {
      const v = localStorage.getItem(k);
      if (v !== null) data[k] = k === 'prepa-theme' ? v : JSON.parse(v);
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `prepa-pc-sauvegarde-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  };
  return (
    <Button size="sm" onClick={save}>
      <Download size={14} /> Exporter
    </Button>
  );
}

export function ImportButton() {
  const input = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);

  const load = async (file: File) => {
    setError(null);
    try {
      const data = JSON.parse(await file.text());
      if (data?.app !== 'prepa-pc') throw new Error();
      for (const k of KEYS) {
        if (!(k in data)) continue;
        localStorage.setItem(k, k === 'prepa-theme' ? String(data[k]) : JSON.stringify(data[k]));
      }
      location.reload();
    } catch {
      setError("Ce fichier n'est pas une sauvegarde Prépa PC valide.");
    }
  };

  return (
    <div className="flex flex-col items-start gap-1 sm:items-end">
      <input ref={input} type="file" accept="application/json,.json" className="hidden" onChange={(e) => e.target.files?.[0] && load(e.target.files[0])} />
      <Button size="sm" onClick={() => input.current?.click()}>
        <Upload size={14} /> Importer…
      </Button>
      {error && <p role="alert" className="text-xs text-red-700 dark:text-red-400">{error}</p>}
    </div>
  );
}
