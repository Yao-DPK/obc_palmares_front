import { useState } from 'react'
import { creerCompte } from '../../api/client'

type Props = {
  token: string
  erreur: string
  onSuccess: () => void
  onError: (msg: string) => void
}

export default function CreationCompte({ token, erreur, onSuccess, onError }: Props) {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const valide = username.length >= 3 && email.includes('@') && password.length >= 8

  async function submit() {
    setLoading(true)
    try {
      await creerCompte({ token, username, email, password })
      onSuccess()
    } catch (e: any) {
      onError(e.response?.data?.detail ?? 'Erreur lors de la création du compte')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-semibold text-slate-900">Créez votre compte</h2>
        <p className="text-slate-600 mt-1">
          Votre compte vous permettra de revenir plus tard pour modifier vos informations.
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Nom d'utilisateur</label>
        <input
          value={username}
          onChange={e => setUsername(e.target.value)}
          className="w-full px-3 py-2 rounded-md border border-slate-200"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-full px-3 py-2 rounded-md border border-slate-200"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Mot de passe (8 caractères minimum)
        </label>
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="w-full px-3 py-2 rounded-md border border-slate-200"
        />
      </div>

      {erreur && <p className="text-sm text-red-600">{erreur}</p>}

      <button
        onClick={submit}
        disabled={!valide || loading}
        className="w-full py-3 rounded-md bg-slate-900 text-white font-medium disabled:opacity-40"
      >
        {loading ? 'Création…' : 'Créer mon compte'}
      </button>
    </div>
  )
}