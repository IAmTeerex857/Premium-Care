import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { Session } from '@supabase/supabase-js'
import { isSupabaseConfigured, supabase } from './supabase'
import type { Profile } from './types'

type AuthState = {
  session: Session | null
  profile: Profile | null
  loading: boolean
  configured: boolean
  isAdmin: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, fullName: string, inviteCode: string) => Promise<void>
  updatePassword: (password: string) => Promise<void>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthState | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  const loadProfile = useCallback(async (userId: string) => {
    if (!supabase) return null
    const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).maybeSingle()
    if (error) {
      console.error('Failed to load profile:', error.message)
      return null
    }
    return (data as Profile | null) ?? null
  }, [])

  useEffect(() => {
    if (!supabase) {
      setLoading(false)
      return
    }

    let active = true

    supabase.auth.getSession().then(async ({ data }) => {
      if (!active) return
      setSession(data.session)
      if (data.session?.user) setProfile(await loadProfile(data.session.user.id))
      if (active) setLoading(false)
    })

    const { data: sub } = supabase.auth.onAuthStateChange(async (_event, next) => {
      if (!active) return
      setSession(next)
      setProfile(next?.user ? await loadProfile(next.user.id) : null)
      setLoading(false)
    })

    return () => {
      active = false
      sub.subscription.unsubscribe()
    }
  }, [loadProfile])

  const value = useMemo<AuthState>(
    () => ({
      session,
      profile,
      loading,
      configured: isSupabaseConfigured,
      isAdmin: profile?.role === 'admin',

      async signIn(email, password) {
        if (!supabase) throw new Error('Supabase is not configured.')
        const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password })
        if (error) throw new Error(error.message)
      },

      async signUp(email, password, fullName, inviteCode) {
        if (!supabase) throw new Error('Supabase is not configured.')
        const { error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: { data: { full_name: fullName.trim(), invite_code: inviteCode.trim().toUpperCase() } },
        })
        if (error) {
          // The signup trigger raises when no invitation exists. Supabase often
          // surfaces that as a generic "Database error saving new user", so match
          // both the raised message and the generic wrapper.
          if (/invitation/i.test(error.message) || /database error saving new user/i.test(error.message)) {
            throw new Error('That invitation code is not valid for this email address, or it has expired. Ask an administrator for a new invitation.')
          }
          throw new Error(error.message)
        }
      },

      async signOut() {
        if (!supabase) return
        await supabase.auth.signOut()
        setProfile(null)
      },

      async resetPassword(email) {
        if (!supabase) throw new Error('Supabase is not configured.')
        const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
          redirectTo: `${window.location.origin}/portal/reset-password`,
        })
        if (error) throw new Error(error.message)
      },

      async updatePassword(password) {
        if (!supabase) throw new Error('Supabase is not configured.')
        const { error } = await supabase.auth.updateUser({ password })
        if (error) throw new Error(error.message)
      },

      async refreshProfile() {
        if (session?.user) setProfile(await loadProfile(session.user.id))
      },
    }),
    [session, profile, loading, loadProfile],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}
