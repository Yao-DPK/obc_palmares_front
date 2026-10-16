import axios from 'axios'

export const api = axios.create({
  baseURL: 'http://localhost:8080/api',
})

export type Personne = {
  id: number
  nom: string
  prenom: string
  dateNaissance?: string
  lieuNaissance?: string
  photoUrl?: string
  bio?: string
  visibilite: 'PUBLIC' | 'PRIVE' | 'MASQUE'
  statut: 'ACTIF' | 'INACTIF' | 'DECEDE'
  creeLe: string
  majLe: string
}

export type Affectation = {
  id: number
  personneId: number
  roleCode: string
  saison: string
  equipe?: string
  commentaire?: string
  creeLe: string
}

export type Page<T> = {
  content: T[]
  totalElements: number
  totalPages: number
  number: number
  size: number
}

export type Candidat = {
  personne: Personne
  score: number
  scorePourcent: number
}

export type ResultatCreation = {
  statut: 'CREE' | 'DOUBLON_SUSPECT'
  personne: Personne | null
  candidats: Candidat[]
}

export const listerPersonnes = (page = 0, size = 20) =>
  api.get<Page<Personne>>('/personnes', { params: { page, size } }).then(r => r.data)

export const trouverPersonne = (id: number) =>
  api.get<Personne>(`/personnes/${id}`).then(r => r.data)

export const rechercherPersonnes = (q: string) =>
  api.get<Personne[]>('/personnes/recherche', { params: { q } }).then(r => r.data)

export const listerAffectations = (personneId: number) =>
  api.get<Affectation[]>(`/personnes/${personneId}/affectations`).then(r => r.data)

export const soumettrePersonne = (data: Partial<Personne>, forcer = false) =>
  api.post<ResultatCreation>('/personnes/soumettre', data, { params: { forcer } })
     .then(r => r.data)

export const creerPersonne = (data: Partial<Personne>) =>
  api.post<Personne>('/personnes', data).then(r => r.data)