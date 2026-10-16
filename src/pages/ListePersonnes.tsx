import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { listerPersonnes, rechercherPersonnes, type Personne, type Page } from '../api/client'

export default function ListePersonnes() {
  const [data, setData] = useState<Page<Personne> | null>(null)
  const [resultats, setResultats] = useState<Personne[] | null>(null)
  const [q, setQ] = useState('')
  const [page, setPage] = useState(0)

  useEffect(() => {
    listerPersonnes(page).then(setData)
  }, [page])

  useEffect(() => {
    if (q.trim().length < 2) { setResultats(null); return }
    const t = setTimeout(() => rechercherPersonnes(q).then(setResultats), 300)
    return () => clearTimeout(t)
  }, [q])

  const personnes = resultats ?? data?.content ?? []

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Personnes</h1>
        <p className="text-sm text-slate-500 mt-1">
          {data?.totalElements ?? 0} fiches enregistrées
        </p>
      </div>

      <input
        type="search"
        placeholder="Rechercher un nom, un prénom…"
        value={q}
        onChange={e => setQ(e.target.value)}
        className="w-full px-4 py-3 rounded-lg border border-slate-200 bg-white
                   focus:outline-none focus:ring-2 focus:ring-slate-900/10"
      />

      <ul className="divide-y divide-slate-100 bg-white rounded-lg border border-slate-200">
        {personnes.map(p => (
          <li key={p.id}>
            <Link
              to={`/personnes/${p.id}`}
              className="flex items-center gap-4 px-4 py-3 hover:bg-slate-50"
            >
              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center
                              text-sm font-medium text-slate-600 shrink-0">
                {p.prenom[0]}{p.nom[0]}
              </div>
              <div className="min-w-0">
                <div className="font-medium text-slate-900 truncate">
                  {p.prenom} {p.nom}
                </div>
                {p.dateNaissance && (
                  <div className="text-xs text-slate-500">
                    né(e) en {p.dateNaissance.slice(0, 4)}
                  </div>
                )}
              </div>
            </Link>
          </li>
        ))}
        {personnes.length === 0 && (
          <li className="px-4 py-8 text-center text-sm text-slate-400">
            Aucun résultat
          </li>
        )}
      </ul>

      {!resultats && data && data.totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <button
            disabled={page === 0}
            onClick={() => setPage(p => p - 1)}
            className="px-4 py-2 rounded-md border border-slate-200 bg-white text-sm
                       disabled:opacity-40 hover:bg-slate-50"
          >
            Précédent
          </button>
          <span className="px-4 py-2 text-sm text-slate-600">
            {page + 1} / {data.totalPages}
          </span>
          <button
            disabled={page >= data.totalPages - 1}
            onClick={() => setPage(p => p + 1)}
            className="px-4 py-2 rounded-md border border-slate-200 bg-white text-sm
                       disabled:opacity-40 hover:bg-slate-50"
          >
            Suivant
          </button>
        </div>
      )}
    </div>
  )
}