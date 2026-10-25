import axios from 'axios'

export const api = axios.create({
  baseURL: 'http://localhost:8081/api',
})

// Injecte le JWT s'il est présent
api.interceptors.request.use((config) => {
  const jwt = localStorage.getItem('jwt')
  if (jwt) config.headers.Authorization = `Bearer ${jwt}`
  return config
})

export type RoleCode = 'FORME' | 'JOUEUR' | 'ENCADREUR'
export type EtatInvitation = 'NOUVEAU' | 'EN_COURS' | 'CONSOMME' | 'EXPIRE'

export type Personne = {
  id: number
  nom: string
  prenom: string
  dateNaissance?: string
  lieuNaissance?: string
  photoUrl?: string
  bio?: string
}

export type Candidat = {
  personne: Personne
  score: number
  scorePourcent: number
}

export type ResultatCreation =
  | { statut: 'CREE'; personne: Personne; candidats: [] }
  | { statut: 'DOUBLON_SUSPECT'; personne: null; candidats: Candidat[] }

export type PersonnePayload = {
  nom: string
  prenom: string
  dateNaissance?: string
  photoUrl?: string
}

export type SoumissionPayload = {
  token?: string          // ← optionnel
  personne: PersonnePayload
  roleCode: RoleCode
  anneeDebut: number
  anneeFin?: number
}

export type AffectationPayload = {
  token: string
  roleCode: RoleCode
  anneeDebut: number
  anneeFin?: number
}

// --- Endpoints ---

export const getInvitation = (token: string) =>
  api.get<{ etat: EtatInvitation; personneId: number | '' }>(`/invitation/${token}`)
     .then(r => r.data)

export const soumettre = (payload: SoumissionPayload) =>
  api.post<{ personneId: number; token: string }>('/soumissions', payload)
     .then(r => r.data)

export const ajouterAffectation = (payload: AffectationPayload) =>
  api.post<{ affectationId: number }>('/soumissions/affectations', payload).then(r => r.data)

export const creerCompte = (payload: {
  token: string
  username: string
  email: string
  password: string
}) => api.post<{ compteId: number }>('/comptes', payload).then(r => r.data)

export const login = (username: string, password: string) =>
  api.post<{ token: string; personneId: number }>('/auth/login', { username, password })
     .then(r => r.data)

export const demanderModification = (personneId: number, payload: PersonnePayload) =>
  api.post<{ emailEnvoye: boolean }>(`/personnes/${personneId}/modification-demande`, payload)
     .then(r => r.data)

export const confirmerModification = (token: string) =>
  api.post<{ applique: boolean }>(`/confirmer-modification/${token}`).then(r => r.data)