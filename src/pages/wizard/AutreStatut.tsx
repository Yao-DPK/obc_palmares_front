import { type RoleCode } from '../../api/client'

type Props = {
  personneId: number
  onAjouter: (role: RoleCode) => void
  onTerminer: () => void
}

export default function AutreStatut({ onAjouter, onTerminer }: Props) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-slate-900">Un autre rôle à OBC ?</h2>
        <p className="text-slate-600 mt-1">
          Avez-vous eu un autre statut au club ? Vous pouvez en ajouter autant que nécessaire.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => onAjouter('FORME')}
          className="p-4 bg-white border border-slate-200 rounded-lg hover:border-slate-900 text-left"
        >
          <div className="font-medium text-slate-900">Formé</div>
        </button>
        <button
          onClick={() => onAjouter('JOUEUR')}
          className="p-4 bg-white border border-slate-200 rounded-lg hover:border-slate-900 text-left"
        >
          <div className="font-medium text-slate-900">Joueur</div>
        </button>
      </div>

      <button
        onClick={() => {
          if (confirm('Vous ne pourrez plus ajouter de rôle après cette étape. Terminer ?'))
            onTerminer()
        }}
        className="w-full py-3 rounded-md border border-slate-300 text-slate-900 font-medium hover:bg-slate-100"
      >
        Je n'ai pas d'autre rôle — Terminer
      </button>
    </div>
  )
}