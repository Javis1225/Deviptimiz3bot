import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Home } from '@/pages/Home'
import { ToolPage } from '@/pages/ToolPage'
import { Profile } from '@/pages/Profile'
import { AdminCatalogCheck } from '@/pages/AdminCatalogCheck'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/tool/:slug" element={<ToolPage />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/admin/catalog-check" element={<AdminCatalogCheck />} />
        {/* Static pages placeholders */}
        <Route path="/privacy" element={<StaticPage title="Privacy Policy" />} />
        <Route path="/terms" element={<StaticPage title="Terms of Service" />} />
        <Route path="/disclaimer" element={<StaticPage title="Disclaimer" />} />
        <Route path="/contact" element={<StaticPage title="Contact" />} />
      </Routes>
    </BrowserRouter>
  )
}

function StaticPage({ title }: { title: string }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <h1 className="text-xl font-semibold mb-2">{title}</h1>
      <p className="text-sm text-slate-400 mb-4">DevOptimizeBot</p>
      <a href="/" className="text-accent text-sm">← Back home</a>
    </div>
  )
}

export default App
