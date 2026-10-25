import { type RoleCode } from '../../api/client'

const STATUTS: { code: RoleCode; label: string; description: string }[] = [
  { code: 'FORME',     label: 'Formé',     description: 'Joueur non senior' },
  { code: 'JOUEUR',    label: 'Joueur',    description: 'Joueur senior' },
  { code: 'ENCADREUR', label: 'Encadreur', description: 'Entraîneur, dirigeant d’équipe' },
]

export default function ChoixStatut({ onChoisir }: { onChoisir: (role: RoleCode) => void }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {STATUTS.map(s => (
        <button
          key={s.code}
          onClick={() => onChoisir(s.code)}
          className="p-5 bg-white border border-slate-200 rounded-lg hover:border-slate-900 transition text-left"
        >
          <div className="font-medium text-slate-900">{s.label}</div>
          <div className="text-sm text-slate-500 mt-1">{s.description}</div>
        </button>
      ))}
    </div>
  )
}