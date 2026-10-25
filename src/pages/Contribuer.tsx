import { useState } from 'react'
import { Link } from 'react-router-dom'
import { soumettrePersonne, creerPersonne, type ResultatCreation } from '../api/client'

export default function Contribuer() {
  const [nom, setNom] = useState('')
  const [prenom, setPrenom] = useState('')
  const [dateNaissance, setDateNaissance] = useState('')
  const [resultat, setResultat] = useState<ResultatCreation | null>(null)
  const [erreur, setErreur] = useState<string | null>(null)

  const payload = {
    nom,
    prenom,
    dateNaissance: dateNaissance || undefined,
  }

  async function soumettre(forcer: boolean) {
    setErreur(null)
    try {
      const r = forcer
        ? { statut: 'CREE' as const, personne: await creerPersonne(payload), candidats: [] }
        : await soumettrePersonne(payload)
      setResultat(r)
    } catch (e: any) {
      if (e.response?.status === 409) {
        setResultat(e.response.data)
      } else {
        setErreur('Erreur lors de la soumission')
      }
    }
  }

  return (
    <div className="space-y-6 max-w-xl">
      <h1 className="text-2xl font-semibold text-slate-900">Contribuer</h1>

      <div className="space-y-4 bg-white rounded-lg border border-slate-200 p-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Prénom</label>
          <input value={prenom} onChange={e => setPrenom(e.target.value)}
                 className="w-full px-3 py-2 rounded-md border border-slate-200" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Nom</label>
          <input value={nom} onChange={e => setNom(e.target.value)}
                 className="w-full px-3 py-2 rounded-md border border-slate-200" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Date de naissance (optionnel)
          </label>
          <input type="date" value={dateNaissance}
                 onChange={e => setDateNaissance(e.target.value)}
                 className="w-full px-3 py-2 rounded-md border border-slate-200" />
        </div>
        <button
          onClick={() => soumettre(false)}
          disabled={!nom || !prenom}
          className="w-full py-2 rounded-md bg-slate-900 text-white font-medium
                     disabled:opacity-40 hover:bg-slate-800"
        >
          Soumettre
        </button>
      </div>

      {erreur && <p className="text-red-600 text-sm">{erreur}</p>}

      {resultat?.statut === 'CREE' && resultat.personne && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
          <p className="text-emerald-900 font-medium">Fiche créée</p>
          <Link to={`/personnes/${resultat.personne.id}`}
                className="text-sm text-emerald-700 underline mt-1 inline-block">
            Voir la fiche
          </Link>
        </div>
      )}

      {resultat?.statut === 'DOUBLON_SUSPECT' && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 space-y-3">
          <p className="text-amber-900 font-medium">
            Doublons potentiels détectés
          </p>
          <ul className="space-y-2">
            {resultat.candidats.map(c => (
              <li key={c.personne.id}
                  className="flex items-center justify-between bg-white rounded border
                             border-amber-200 px-3 py-2">
                <Link to={`/personnes/${c.personne.id}`}
                      className="text-slate-900 hover:underline">
                  {c.personne.prenom} {c.personne.nom}
                </Link>
                <span className="text-sm font-medium text-amber-700">
                  {c.scorePourcent}%
                </span>
              </li>
            ))}
          </ul>
          <button
            onClick={() => soumettre(true)}
            className="w-full py-2 rounded-md border border-amber-300 text-amber-900
                       font-medium hover:bg-amber-100"
          >
            Ce n'est pas un doublon — créer quand même
          </button>
        </div>
      )}
    </div>
  )
}