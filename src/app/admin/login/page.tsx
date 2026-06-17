'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLogin() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      const data = await res.json()
      if (data.success) {
        router.push('/admin/dashboard')
      } else {
        setError('Incorrect password.')
      }
    } catch {
      setError('Something went wrong. Try again.')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-dark dot-grid flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="font-mono text-neon text-lg mb-1">biltechie<span className="animate-blink">_</span></div>
          <div className="font-mono text-xs text-white/30 tracking-widest uppercase">Admin Panel</div>
        </div>

        <form onSubmit={handleLogin} className="bg-dark-100 border border-dark-300 rounded-xl p-6">
          <div className="mb-5">
            <label className="font-mono text-xs text-white/40 tracking-wide block mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-dark-200 border border-dark-400 rounded px-4 py-2.5 text-white font-mono text-sm focus:outline-none focus:border-neon/50 transition-colors"
              placeholder="Enter admin password"
              required
            />
          </div>

          {error && (
            <div className="mb-4 text-xs font-mono text-red-400 bg-red-500/10 border border-red-500/20 rounded px-3 py-2">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-neon text-dark font-mono font-medium text-sm py-3 rounded hover:bg-neon/90 disabled:opacity-50 transition-all"
          >
            {loading ? 'Authenticating...' : 'Enter'}
          </button>
        </form>
      </div>
    </div>
  )
}
