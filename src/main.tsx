import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import './index.css'
import ListePersonnes from './pages/ListePersonnes'
import DetailPersonne from './pages/DetailPersonne.tsx'
import Contribuer from './pages/Contribuer'

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center gap-6">
          <Link to="/" className="text-xl font-semibold text-slate-900">
            OBC Palmarès
          </Link>
          <nav className="flex gap-4 text-sm text-slate-600">
            <Link to="/" className="hover:text-slate-900">Personnes</Link>
            <Link to="/contribuer" className="hover:text-slate-900">Contribuer</Link>
          </nav>
        </div>
      </header>
      <main className="max-w-5xl mx-auto px-6 py-8">{children}</main>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<ListePersonnes />} />
          <Route path="/personnes/:id" element={<DetailPersonne />} />
          <Route path="/contribuer" element={<Contribuer />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  </React.StrictMode>
)