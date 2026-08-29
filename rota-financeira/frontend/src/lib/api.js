const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'
const SESSION_KEY = 'rota-financeira-session'

export function getStoredSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function storeSession(session) {
  if (session) localStorage.setItem(SESSION_KEY, JSON.stringify(session))
  else localStorage.removeItem(SESSION_KEY)
}

async function request(path, { method = 'GET', body, auth = true } = {}) {
  const headers = { 'Content-Type': 'application/json' }
  if (auth) {
    const session = getStoredSession()
    if (session?.access_token) headers.Authorization = `Bearer ${session.access_token}`
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
  // Autenticação
  signup: (payload) => request('/auth/signup', { method: 'POST', body: payload, auth: false }),
  login: (payload) => request('/auth/login', { method: 'POST', body: payload, auth: false }),
  logout: (payload) => request('/auth/logout', { method: 'POST', body: payload, auth: false }),

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
