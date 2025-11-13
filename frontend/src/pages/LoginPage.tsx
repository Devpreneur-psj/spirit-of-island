import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'
import { motion } from 'framer-motion'

export default function LoginPage() {
  const navigate = useNavigate()
  const { login, isAuthenticated } = useAuthStore()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/')
    }
  }, [isAuthenticated, navigate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await login(username, password)
      navigate('/')
    } catch (err: any) {
      setError(err.response?.data?.detail || '로그인에 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="card w-full max-w-md"
      >
        <h1 className="text-3xl font-bold text-center mb-2 bg-gradient-to-r from-pastel-purple to-pastel-pink bg-clip-text text-transparent">
          Aether Island
        </h1>
        <p className="text-center text-gray-600 mb-8">마정령 육성 시뮬레이션</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
              사용자 이름
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-pastel-purple focus:border-transparent outline-none transition-all"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              비밀번호
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-pastel-purple focus:border-transparent outline-none transition-all"
              required
            />
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-3 bg-red-100 text-red-700 rounded-xl text-sm"
            >
              {error}
            </motion.div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? '로그인 중...' : '로그인'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            계정이 없으신가요?{' '}
            <button
              onClick={() => navigate('/register')}
              className="text-pastel-purple font-medium hover:underline"
            >
              회원가입
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  )
}

