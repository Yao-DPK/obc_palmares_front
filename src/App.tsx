import { Routes, Route, Link, Navigate } from 'react-router-dom'

import { type ReactNode } from 'react'
import ConfirmerModification from './pages/ConfirmerModification'
import Wizard from './pages/Wizard'
import Login from './pages/Login'

function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-3xl mx-auto px-6 py-4">
          <Link to="/" className="text-xl font-semibold text-slate-900">
            OBC Palmarès
          </Link>
        </div>
      </header>
      <main className="max-w-3xl mx-auto px-6 py-10">{children}</main>
    </div>
  )
}

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/bienvenue" element={<Wizard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/confirmer-modification" element={<ConfirmerModification />} />
        {/* <Route path="/" element={<p className="text-slate-500">Page publique à venir.</p>} /> */}
        <Route
        path="*"
        element={<Navigate to="/bienvenue" replace={true} />}
        >

        </Route>
      </Routes>
    </Layout>
  )
}