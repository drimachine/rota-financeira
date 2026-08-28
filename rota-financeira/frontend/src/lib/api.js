import { supabase } from './supabaseClient'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

async function authHeader() {
  const { data } = await supabase.auth.getSession()
  const token = data?.session?.access_token
  return token ? { Authorization: `Bearer ${token}` } : {}
}

async function request(path, { method = 'GET', body } = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...(await authHeader()),
  }
  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: 'Erro inesperado' }))
    throw new Error(err.detail || 'Erro na requisição')
  }
  if (res.status === 204) return null
  return res.json()
}

export const api = {
  // Perfil / onboarding
  getProfile: () => request('/users/me'),
  updateProfile: (payload) => request('/users/me', { method: 'PATCH', body: payload }),

  // Receitas
  listRevenues: (params = '') => request(`/revenues${params}`),
  createRevenue: (payload) => request('/revenues', { method: 'POST', body: payload }),
  deleteRevenue: (id) => request(`/revenues/${id}`, { method: 'DELETE' }),

  // Custos
  listCosts: (params = '') => request(`/costs${params}`),
  createCost: (payload) => request('/costs', { method: 'POST', body: payload }),
  deleteCost: (id) => request(`/costs/${id}`, { method: 'DELETE' }),

  // Metas
  listGoals: () => request('/goals'),
  createGoal: (payload) => request('/goals', { method: 'POST', body: payload }),
  updateGoal: (id, payload) => request(`/goals/${id}`, { method: 'PATCH', body: payload }),

  // Dashboard / relatórios
  getDashboardSummary: () => request('/reports/summary'),
  getMonthlyEvolution: () => request('/reports/monthly'),
}
