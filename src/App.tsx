import { Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import ToolPage from './pages/ToolPage'
import Profile from './pages/Profile'
import AdminOverview from './pages/admin/AdminOverview'
import AdminUsers from './pages/admin/AdminUsers'
import AdminRewards from './pages/admin/AdminRewards'
import AdminSettings from './pages/admin/AdminSettings'
import CatalogCheck from './pages/admin/CatalogCheck'

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/tools/:slug" element={<ToolPage />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/admin" element={<AdminOverview />} />
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/admin/rewards" element={<AdminRewards />} />
        <Route path="/admin/settings" element={<AdminSettings />} />
        <Route path="/admin/catalog-check" element={<CatalogCheck />} />
      </Routes>
    </Layout>
  )
}
