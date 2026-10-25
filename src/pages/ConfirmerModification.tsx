import { useEffect, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { confirmerModification } from '../api/client'

export default function ConfirmerModification() {
  const [params] = useSearchParams()
  const token = params.get('t') ?? ''
  const [etat, setEtat] = useState<'chargement' | 'ok' | 'erreur'>('chargement')
  const [msg, setMsg] = useState('')

  useEffect(() => {
    if (!token) { setEtat('erreur'); setMsg('Lien invalide.'); return }
    confirmerModification(token)
      .then(() => setEtat('ok'))
      .catch((e) => {
        setEtat('erreur')
        setMsg(e.response?.data?.detail ?? 'Impossible de confirmer la modification.')
      })
  }, [token])

  if (etat === 'chargement') return <p className="text-slate-500">Confirmation en cours…</p>

  if (etat === 'ok') return (
    <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6">
      <p className="text-emerald-900 font-medium">Modification appliquée.</p>
      <Link to="/" className="text-sm text-emerald-700 underline mt-2 inline-block">Retour à l'accueil</Link>
    </div>
  )

  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-6">
      <p className="text-red-900 font-medium">{msg}</p>
    </div>
  )
}