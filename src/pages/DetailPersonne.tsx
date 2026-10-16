import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { trouverPersonne, listerAffectations, type Personne, type Affectation } from '../api/client'

export default function DetailPersonne() {
  const { id } = useParams()
  const [personne, setPersonne] = useState<Personne | null>(null)
  const [affectations, setAffectations] = useState<Affectation[]>([])

  useEffect(() => {
    if (!id) return
    trouverPersonne(Number(id)).then(setPersonne)
    listerAffectations(Number(id)).then(setAffectations)
  }, [id])

  if (!personne) return <p className="text-slate-500">Chargement…</p>

  return (
    <div className="space-y-8">
      <Link to="/" className="text-sm text-slate-500 hover:text-slate-900">← Retour</Link>

      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h1 className="text-2xl font-semibold text-slate-900">
          {personne.prenom} {personne.nom}
        </h1>
        {personne.dateNaissance && (
          <p className="text-sm text-slate-500 mt-1">
            Né(e) le {new Date(personne.dateNaissance).toLocaleDateString('fr-FR')}
            {personne.lieuNaissance && ` à ${personne.lieuNaissance}`}
          </p>
        )}
        {personne.bio && <p className="mt-4 text-slate-700">{personne.bio}</p>}
      </div>

      <div>
        <h2 className="text-lg font-semibold text-slate-900 mb-3">Parcours à OBC</h2>
        <ul className="space-y-2">
          {affectations.map(a => (
            <li key={a.id}
                className="flex items-center justify-between bg-white rounded-lg
                           border border-slate-200 px-4 py-3">
              <div>
                <div className="font-medium text-slate-900">{a.roleCode}</div>
                <div className="text-sm text-slate-500">
                  Saison {a.saison}{a.equipe && ` · ${a.equipe}`}
                </div>
              </div>
            </li>
          ))}
          {affectations.length === 0 && (
            <li className="text-sm text-slate-400">Aucune affectation enregistrée.</li>
          )}
        </ul>
      </div>
    </div>
  )
}