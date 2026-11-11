import { ButtonLink } from '../components/ui/primitives';

export default function NotFound() {
  return (
    <div className="py-20 text-center">
      <p className="font-serif text-3xl text-ink">Page introuvable</p>
      <p className="mt-2 text-sm text-muted">Cette adresse ne correspond à aucune page.</p>
      <ButtonLink to="/archives" className="mt-6">Retour aux archives</ButtonLink>
    </div>
  );
}
