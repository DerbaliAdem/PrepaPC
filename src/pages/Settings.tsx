import { useState } from 'react';
import Header from '../components/layout/Header';
import { Button, Panel, Section } from '../components/ui/primitives';
import { useTheme } from '../hooks/useTheme';
import { useRevisionProgress } from '../hooks/useRevisionProgress';
import { archiveStats } from '../utils/statistics';
import { getYears } from '../services/examService';
import { getAppearances, getChapters } from '../services/chapterService';
import { ExportButton, ImportButton } from '../components/BackupControls';

function Row({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
      <div>
        <p className="text-sm font-medium text-ink">{label}</p>
        {hint && <p className="mt-0.5 text-[13px] text-muted">{hint}</p>}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

export default function Settings() {
  const { theme, setTheme } = useTheme();
  const { progress, reset } = useRevisionProgress();
  const [confirming, setConfirming] = useState(false);
  const stats = archiveStats();
  const years = getYears();
  const tracked = Object.keys(progress).length;

  return (
    <>
      <div className="mx-auto max-w-[1040px]">
      <Header title="Paramètres" />
      <div className="max-w-3xl space-y-8">
        <Section title="Affichage">
          <Panel className="divide-y divide-line">
            <Row label="Thème">
              <div className="inline-flex rounded-md bg-sunken p-0.5" role="radiogroup" aria-label="Thème">
                {(['light', 'dark'] as const).map((t) => (
                  <button key={t} role="radio" aria-checked={theme === t} onClick={() => setTheme(t)} className={`rounded px-3 py-1 text-sm ${theme === t ? 'bg-surface font-medium text-ink shadow-sm' : 'text-muted'}`}>
                    {t === 'light' ? 'Clair' : 'Sombre'}
                  </button>
                ))}
              </div>
            </Row>
            <Row label="Langue">
              <select aria-label="Langue" className="h-9 rounded-md border border-line bg-surface px-2.5 pr-8 text-sm text-ink" value="fr" disabled>
                <option value="fr">Français</option>
              </select>
            </Row>
          </Panel>
        </Section>

        <Section title="Progression">
          <Panel className="divide-y divide-line">
            <Row label="Réinitialiser la progression">
              {confirming ? (
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => setConfirming(false)}>Annuler</Button>
                  <Button size="sm" className="!border-red-700 !bg-red-700 !text-white" onClick={() => { reset(); setConfirming(false); }}>
                    Confirmer la réinitialisation
                  </Button>
                </div>
              ) : (
                <Button size="sm" disabled={!tracked} onClick={() => setConfirming(true)}>Réinitialiser…</Button>
              )}
            </Row>
            <Row label="Exporter une sauvegarde">
              <ExportButton />
            </Row>
            <Row label="Importer une sauvegarde" hint="Remplace les données actuelles.">
              <ImportButton />
            </Row>
          </Panel>
        </Section>

        <Section title="Archive des sujets">
          <Panel className="px-4 py-4 text-sm leading-relaxed text-muted sm:px-5">
            <dl className="grid grid-cols-2 gap-y-2 sm:grid-cols-[200px_1fr]">
              <dt>Épreuves</dt><dd className="text-ink">{stats.total}</dd>
              <dt>Années couvertes</dt><dd className="text-ink">{years.join(', ')}</dd>
              <dt>Chapitres référencés</dt><dd className="text-ink">{getChapters().length}</dd>
              <dt>Apparitions vérifiées</dt><dd className="text-ink">{getAppearances().length}</dd>
            </dl>
          </Panel>
        </Section>
      </div>
      </div>
    </>
  );
}
