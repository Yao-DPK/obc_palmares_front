import { useEffect, useState, type SetStateAction } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import {
  getInvitation, soumettre, ajouterAffectation, creerCompte,
  type RoleCode, type PersonnePayload,
} from '../api/client'
import FormulaireStatut from './wizard/FormulaireStatut'
import ChoixStatut from './wizard/ChoixStatut'
import CreationCompte from './wizard/CreationCompte'

type Etape =
  | 'chargement'
  | 'erreur'
  | 'onboarding'
  | 'formulaire'
  | 'autre-statut'
  | 'compte'
  | 'confirmation'

export default function Wizard() {
  const [params] = useSearchParams()
  const navigate = useNavigate()

  const [etape, setEtape] = useState<Etape>('chargement')
  const [erreur, setErreur] = useState('')
  const [token, setToken] = useState<string>(params.get('t') ?? '')
  const [personneId, setPersonneId] = useState<number | null>(null)

  // Formulaire courant
  const [statut, setStatut] = useState<RoleCode | null>(null)
  const [form, setForm] = useState<PersonnePayload>({
    nom: '', prenom: '', dateNaissance: '', photoUrl: '',
  })
  const [anneeDebut, setAnneeDebut] = useState<number | ''>('')
  const [anneeFin, setAnneeFin] = useState<number | ''>('')

  // Préparation du premier formulaire (déjà rempli ou pas)
  const premierStatut = personneId === null
  const titreFormulaire =
    statut === 'FORME' ? 'Passé au Centre de formation OBC'
    : statut === 'JOUEUR' ? 'Joueur'
    : statut === 'ENCADREUR' ? 'Encadreur'
    : ''

  // Au montage : si token présent, on vérifie son état
  useEffect(() => {
    if (!token) {
      setEtape('onboarding')
      return
    }
    getInvitation(token)
      .then(data => {
        if (data.etat === 'NOUVEAU') setEtape('onboarding')
        else if (data.etat === 'EN_COURS') {
          setPersonneId(Number(data.personneId))
          setEtape('autre-statut')
        } else if (data.etat === 'CONSOMME') {
          setErreur('Ce lien a déjà été utilisé. Contactez l’administrateur.')
          setEtape('erreur')
        } else {
          setErreur('Ce lien a expiré.')
          setEtape('erreur')
        }
      })
      .catch(() => {
        setErreur('Impossible de vérifier le lien.')
        setEtape('erreur')
      })
  }, [token])

  function resetFormulaire() {
    setStatut(null)
    setAnneeDebut('')
    setAnneeFin('')
  }

  async function envoyerPremierStatut() {
    if (!statut || !form.nom || !form.prenom || !anneeDebut) return
    setErreur('')
    try {
      const res = await soumettre({
        token: token || undefined,
        personne: form,
        roleCode: statut,
        anneeDebut: Number(anneeDebut),
        anneeFin: anneeFin === '' ? undefined : Number(anneeFin),
      })
      setPersonneId(res.personneId)
      setToken(res.token)         // le token retourné devient la référence
      resetFormulaire()
      setEtape('autre-statut')
    } catch (e: any) {
      if (e.response?.status === 409) {
        setErreur('Une fiche similaire existe déjà. Contactez l’administrateur.')
      } else {
        setErreur(e.response?.data?.detail ?? 'Erreur lors de la soumission')
      }
    }
  }

  async function envoyerAutreStatut() {
    if (!statut || !anneeDebut) return
    setErreur('')
    try {
      await ajouterAffectation({
        token,
        roleCode: statut,
        anneeDebut: Number(anneeDebut),
        anneeFin: anneeFin === '' ? undefined : Number(anneeFin),
      })
      resetFormulaire()
      setEtape('autre-statut')
    } catch (e: any) {
      setErreur(e.response?.data?.detail ?? 'Erreur lors de l’ajout')
    }
  }

  // --- Rendu ---

  if (etape === 'chargement') {
    return <p className="text-slate-500">Vérification du lien…</p>
  }

  if (etape === 'erreur') {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <p className="text-red-900 font-medium">{erreur}</p>
      </div>
    )
  }

  if (etape === 'onboarding') {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">
            Bienvenue sur OBC Palmarès
          </h1>
          <p className="text-slate-600 mt-2">
            Aidez-nous à reconstituer l’histoire du club.
            Commencez par votre <strong>premier</strong> rôle à OBC.
          </p>
        </div>
        <ChoixStatut
          onChoisir={(role) => {
            setStatut(role)
            setEtape('formulaire')
          }}
        />
      </div>
    )
  }

  if (etape === 'formulaire') {
    return (
      <FormulaireStatut
        titre={premierStatut
          ? `Premier statut : ${titreFormulaire}`
          : `Nouveau statut : ${titreFormulaire}`}
        form={form}
        setForm={setForm}
        anneeDebut={anneeDebut}
        setAnneeDebut={setAnneeDebut}
        anneeFin={anneeFin}
        setAnneeFin={setAnneeFin}
        erreur={erreur}
        onRetour={() => {
          resetFormulaire()
          setEtape(premierStatut ? 'onboarding' : 'autre-statut')
        }}
        onSubmit={premierStatut ? envoyerPremierStatut : envoyerAutreStatut}
      />
    )
  }

  if (etape === 'autre-statut') {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">
            Un autre rôle à OBC ?
          </h2>
          <p className="text-slate-600 mt-1">
            Vous pouvez en ajouter autant que nécessaire.
          </p>
        </div>

        <ChoixStatut
          onChoisir={(role) => {
            setStatut(role)
            setEtape('formulaire')
          }}
        />

        <button
          onClick={() => {
            if (confirm('Vous ne pourrez plus ajouter de rôle après cette étape. Terminer ?')) {
              setEtape('compte')
            }
          }}
          className="w-full py-3 rounded-md border border-slate-300 text-slate-900 font-medium hover:bg-slate-100"
        >
          Je n’ai pas d’autre rôle — Terminer
        </button>
      </div>
    )
  }

  if (etape === 'compte') {
    return (
      <CreationCompte
        token={token}
        erreur={erreur}
        onSuccess={() => setEtape('confirmation')}
        onError={(msg: SetStateAction<string>) => setErreur(msg)}
      />
    )
  }

  if (etape === 'confirmation') {
    return (
      <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6 space-y-3">
        <h2 className="text-xl font-semibold text-emerald-900">
          Enregistrement effectué
        </h2>
        <p className="text-emerald-800">
          Vous pouvez à présent vous connecter pour voir vos infos.
        </p>
        <button
          onClick={() => navigate('/login')}
          className="px-4 py-2 bg-slate-900 text-white rounded-md text-sm"
        >
          Se connecter
        </button>
      </div>
    )
  }

  return null
}