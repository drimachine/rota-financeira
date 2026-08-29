import { createContext, useContext, useEffect, useState } from 'react'
import { api, getStoredSession, storeSession } from '../lib/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setSession(getStoredSession())
    setLoading(false)
  }, [])

  async function signUp({ name, email, password }) {
    const data = await api.signup({ name, email, password })
    if (data.access_token) {
      storeSession(data)
      setSession(data)
    }
    return data
  }

  async function signIn({ email, password }) {
    const data = await api.login({ email, password })
    storeSession(data)
    setSession(data)
    return data
  }

  async function signOut() {
    if (session) {
      await api
        .logout({ access_token: session.access_token, refresh_token: session.refresh_token })
        .catch(() => {})
    }
    storeSession(null)
    setSession(null)
  }

  const value = {
    session,
    user: session?.user ?? null,
    loading,
    signUp,
    signIn,
    signOut,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth deve ser usado dentro de <AuthProvider>')
  return ctx
}
