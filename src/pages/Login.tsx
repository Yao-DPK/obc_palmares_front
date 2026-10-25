import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login } from '../api/client'

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [erreur, setErreur] = useState('')
  const navigate = useNavigate()

  async function submit() {
    try {
      const res = await login(username, password)
      localStorage.setItem('jwt', res.token)
      localStorage.setItem('personneId', String(res.personneId))
      navigate('/')
    } catch {
      setErreur('Identifiants invalides')
    }
  }

  return (
    <div className="max-w-sm mx-auto space-y-4">
      <h1 className="text-xl font-semibold text-slate-900">Connexion</h1>
      <input placeholder="Nom d'utilisateur" value={username}
             onChange={e => setUsername(e.target.value)}
             className="w-full px-3 py-2 rounded-md border border-slate-200" />
      <input type="password" placeholder="Mot de passe" value={password}
             onChange={e => setPassword(e.target.value)}
             className="w-full px-3 py-2 rounded-md border border-slate-200" />
      {erreur && <p className="text-sm text-red-600">{erreur}</p>}
      <button onClick={submit}
              className="w-full py-2 rounded-md bg-slate-900 text-white">
        Se connecter
      </button>
    </div>
  )
}