import { type PersonnePayload, type RoleCode } from '../../api/client'

type Props = {
  statut?: RoleCode
  form: PersonnePayload
  setForm: (f: PersonnePayload) => void
  anneeDebut: number | ''
  setAnneeDebut: (n: number | '') => void
  anneeFin: number | ''
  setAnneeFin: (n: number | '') => void
  erreur: string
  titre: string
  onRetour?: () => void
  onSubmit: () => void
}

export default function FormulaireStatut({
  form, setForm, anneeDebut, setAnneeDebut, anneeFin, setAnneeFin,
  erreur, titre, onRetour, onSubmit
}: Props) {
  const valide = form.nom && form.prenom && anneeDebut

  return (
    <div className="space-y-5">
      <h2 className="text-xl font-semibold text-slate-900">{titre}</h2>

      <div className="grid grid-cols-2 gap-4">
        <Champ label="Prénom">
          <input
            value={form.prenom}
            onChange={e => setForm({ ...form, prenom: e.target.value })}
            className="w-full px-3 py-2 rounded-md border border-slate-200"
          />
        </Champ>
        <Champ label="Nom">
          <input
            value={form.nom}
            onChange={e => setForm({ ...form, nom: e.target.value })}
            className="w-full px-3 py-2 rounded-md border border-slate-200"
          />
        </Champ>
      </div>

      <Champ label="Date de naissance (optionnel)">
        <input
          type="date"
          value={form.dateNaissance ?? ''}
          onChange={e => setForm({ ...form, dateNaissance: e.target.value })}
          className="w-full px-3 py-2 rounded-md border border-slate-200"
        />
      </Champ>

      <div className="grid grid-cols-2 gap-4">
        <Champ label="Année de début">
          <input
            type="number"
            value={anneeDebut}
            onChange={e => setAnneeDebut(e.target.value === '' ? '' : Number(e.target.value))}
            className="w-full px-3 py-2 rounded-md border border-slate-200"
          />
        </Champ>
        <Champ label="Année de fin (optionnel)">
          <input
            type="number"
            value={anneeFin}
            onChange={e => setAnneeFin(e.target.value === '' ? '' : Number(e.target.value))}
            className="w-full px-3 py-2 rounded-md border border-slate-200"
          />
        </Champ>
      </div>

      <Champ label="Photo (URL, optionnel)">
        <input
          value={form.photoUrl ?? ''}
          onChange={e => setForm({ ...form, photoUrl: e.target.value })}
          placeholder="https://…"
          className="w-full px-3 py-2 rounded-md border border-slate-200"
        />
      </Champ>

      {erreur && <p className="text-sm text-red-600">{erreur}</p>}

      <div className="flex gap-3 pt-2">
        {onRetour && (
          <button onClick={onRetour} className="px-4 py-2 rounded-md border border-slate-200 text-sm">
            Retour
          </button>
        )}
        <button
          onClick={onSubmit}
          disabled={!valide}
          className="px-4 py-2 rounded-md bg-slate-900 text-white text-sm disabled:opacity-40"
        >
          Enregistrer
        </button>
      </div>
    </div>
  )
}

function Champ({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
      {children}
    </div>
  )
}