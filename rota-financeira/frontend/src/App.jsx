import { Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Onboarding from './pages/Onboarding'
import Dashboard from './pages/Dashboard'
import NewRevenue from './pages/NewRevenue'
import NewCost from './pages/NewCost'
import Revenues from './pages/Revenues'
import Costs from './pages/Costs'
import Goals from './pages/Goals'
import Reports from './pages/Reports'
import Profile from './pages/Profile'
import AppLayout from './components/AppLayout'
import ProtectedRoute from './components/ProtectedRoute'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/cadastro" element={<Signup />} />
      <Route
        path="/onboarding"
        element={
          <ProtectedRoute>
            <Onboarding />
          </ProtectedRoute>
        }
      />

      <Route
        path="/app"
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="receitas" element={<Revenues />} />
        <Route path="receitas/nova" element={<NewRevenue />} />
        <Route path="custos" element={<Costs />} />
        <Route path="custos/novo" element={<NewCost />} />
        <Route path="metas" element={<Goals />} />
        <Route path="relatorios" element={<Reports />} />
        <Route path="perfil" element={<Profile />} />
      </Route>

      <Route path="*" element={<Landing />} />
    </Routes>
  )
}
