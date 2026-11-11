/** A compact year strip: one cell per archived year, filled when the chapter appeared. */
export default function ChapterFrequency({ years, appeared }: { years: number[]; appeared: Set<number> }) {
  return (
    <figure>
      <div className="flex gap-1" role="img" aria-label={`Présent en ${[...appeared].sort().join(', ') || 'aucune année'} sur ${years.length} années archivées`}>
        {years.map((y) => (
          <div key={y} className="flex flex-1 flex-col items-center gap-1.5">
            <div className={`h-8 w-full rounded-sm ${appeared.has(y) ? 'bg-accent' : 'border border-dashed border-line bg-transparent'}`} />
            <span className="text-[11px] tabular text-muted">{y}</span>
          </div>
        ))}
      </div>
      <figcaption className="mt-2 text-xs text-faint">Historique, pas une prévision.</figcaption>
    </figure>
  );
}
