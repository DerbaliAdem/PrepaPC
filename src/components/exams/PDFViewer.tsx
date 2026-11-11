import { useCallback, useEffect, useRef, useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { ChevronLeft, ChevronRight, Maximize, Minimize, Minus, Plus } from 'lucide-react';
import workerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import { Spinner } from '../ui/Spinner';

pdfjs.GlobalWorkerOptions.workerSrc = workerUrl;

// Fetch whole files (no byte ranges) so the service worker can keep them for offline reading.
const PDF_OPTIONS = { disableRange: true, disableStream: true };

const ZOOMS =[0.5, 0.75, 1, 1.25, 1.5, 2, 2.5];

export default function PDFViewer({ url, onPages }: { url: string; onPages?: (n: number) => void }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [numPages, setNumPages] = useState(0);
  const [page, setPage] = useState(1);
  const [zoomIdx, setZoomIdx] = useState(2);
  const [width, setWidth] = useState(800);
  const [error, setError] = useState<string | null>(null);
  const [fullscreen, setFullscreen] = useState(false);
  const [pageInput, setPageInput] = useState('1');

  // Fit page width to the container (zoom 100% = fit width, capped for readability).
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setWidth(Math.min(entry.contentRect.width - 32, 900)));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const onFs = () => setFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener('fullscreenchange', onFs);
    return () => document.removeEventListener('fullscreenchange', onFs);
  }, []);

  useEffect(() => setPageInput(String(page)), [page]);

  const go = useCallback(
    (p: number) => {
      const n = Math.max(1, Math.min(numPages || 1, p));
      setPage(n);
      scrollRef.current?.scrollTo({ top: 0 });
    },
    [numPages],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement).tagName === 'INPUT') return;
      if (e.key === 'ArrowRight' || e.key === 'PageDown') go(page + 1);
      if (e.key === 'ArrowLeft' || e.key === 'PageUp') go(page - 1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [go, page]);

  const toggleFs = () => {
    if (document.fullscreenElement) document.exitFullscreen();
    else wrapRef.current?.requestFullscreen?.();
  };

  const scale = ZOOMS[zoomIdx];
  const iconBtn = 'grid size-8 place-items-center rounded-md text-muted hover:bg-sunken hover:text-ink disabled:opacity-40 disabled:pointer-events-none';

  return (
    <div ref={wrapRef} className="flex min-h-0 flex-1 flex-col bg-sunken">
      <div className="flex items-center justify-between gap-2 border-b border-line bg-surface px-3 py-1.5">
        <div className="flex items-center gap-1">
          <button className={iconBtn} onClick={() => go(page - 1)} disabled={page <= 1} aria-label="Page précédente"><ChevronLeft size={18} /></button>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              go(Number(pageInput) || 1);
            }}
            className="flex items-center gap-1.5 text-sm text-muted"
          >
            <input
              aria-label="Numéro de page"
              inputMode="numeric"
              value={pageInput}
              onChange={(e) => setPageInput(e.target.value.replace(/\D/g, ''))}
              onBlur={() => go(Number(pageInput) || 1)}
              className="h-8 w-11 rounded-md border border-line bg-surface text-center text-sm tabular text-ink focus:border-accent focus:outline-none"
            />
            <span className="tabular">/ {numPages || '–'}</span>
          </form>
          <button className={iconBtn} onClick={() => go(page + 1)} disabled={!numPages || page >= numPages} aria-label="Page suivante"><ChevronRight size={18} /></button>
        </div>
        <div className="flex items-center gap-1">
          <button className={iconBtn} onClick={() => setZoomIdx((z) => Math.max(0, z - 1))} disabled={zoomIdx === 0} aria-label="Réduire"><Minus size={16} /></button>
          <button className="h-8 w-14 rounded-md text-sm tabular text-muted hover:bg-sunken" onClick={() => setZoomIdx(2)} title="Ajuster à la largeur">
            {Math.round(scale * 100)} %
          </button>
          <button className={iconBtn} onClick={() => setZoomIdx((z) => Math.min(ZOOMS.length - 1, z + 1))} disabled={zoomIdx === ZOOMS.length - 1} aria-label="Agrandir"><Plus size={16} /></button>
          <span className="mx-1 h-5 w-px bg-line" />
          <button className={iconBtn} onClick={toggleFs} aria-label={fullscreen ? 'Quitter le plein écran' : 'Plein écran'}>
            {fullscreen ? <Minimize size={16} /> : <Maximize size={16} />}
          </button>
        </div>
      </div>

      <div ref={scrollRef} className="min-h-0 flex-1 overflow-auto">
        {error ? (
          <div className="mx-auto max-w-md px-6 py-20 text-center">
            <p className="font-medium text-ink">Impossible d'afficher ce document</p>
            <p className="mt-1 text-sm text-muted">{error}</p>
          </div>
        ) : (
          <Document
            file={url}
            options={PDF_OPTIONS}
            onLoadSuccess={({ numPages: n }) => {
              setNumPages(n);
              onPages?.(n);
            }}
            onLoadError={(e) => setError(/Missing|404|Unexpected server/i.test(e.message) ? 'Le fichier PDF est introuvable.' : 'Le fichier semble invalide ou endommagé.')}
            loading={<div className="grid place-items-center py-24"><Spinner label="Chargement du document… (les sujets scannés peuvent être volumineux)" /></div>}
            className="flex justify-center p-4"
          >
            <Page
              key={`${page}-${scale}-${width}`}
              pageNumber={page}
              width={width * scale}
              renderTextLayer={false}
              renderAnnotationLayer={false}
              loading={<div style={{ width: width * scale, height: width * scale * 1.414 }} className="grid place-items-center bg-white"><Spinner label={`Page ${page}…`} /></div>}
              className="shadow-[0_1px_3px_rgba(0,0,0,0.12),0_8px_24px_rgba(0,0,0,0.06)]"
            />
          </Document>
        )}
      </div>
    </div>
  );
}
