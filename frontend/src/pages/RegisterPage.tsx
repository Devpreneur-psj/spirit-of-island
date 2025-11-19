import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'
import { motion } from 'framer-motion'

export default function RegisterPage() {
  const navigate = useNavigate()
  const { register, isAuthenticated } = useAuthStore()
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
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
    
    console.log('📝 회원가입 시도:', { username, email, password: '***' })

    if (password !== confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.')
      return
    }

    if (password.length < 6) {
      setError('비밀번호는 최소 6자 이상이어야 합니다.')
      return
    }

    // UTF-8 바이트 길이 확인 (bcrypt는 최대 72바이트)
    const passwordBytes = new TextEncoder().encode(password).length
    if (passwordBytes > 72) {
      setError('비밀번호가 너무 깁니다. (최대 72바이트)')
      return
    }

    setLoading(true)
    console.log('🔄 register 함수 호출 시작...')

    try {
      await register(username, email, password)
      console.log('✅ 회원가입 성공!')
      navigate('/')
    } catch (err: any) {
      console.error('❌ 회원가입 오류:', err)
      // 다양한 에러 형식 처리
      let errorMessage = '회원가입에 실패했습니다.'
      
      // Network Error 처리
      if (err?.code === 'ERR_NETWORK' || err?.message === 'Network Error' || err?.code === 'ECONNREFUSED') {
        errorMessage = `서버에 연결할 수 없습니다. 백엔드가 실행 중인지 확인해주세요.\n\n확인 사항:\n1. 백엔드가 http://localhost:8000에서 실행 중인지 확인\n2. 브라우저 콘솔(F12)에서 API URL 확인\n3. 백엔드 로그 확인`
      }
      // 타임아웃 에러
      else if (err?.code === 'ECONNABORTED' || err?.message?.includes('timeout')) {
        errorMessage = '요청 시간이 초과되었습니다. 백엔드가 응답하지 않습니다.'
      }
      // 응답이 있는 경우
      else if (err?.response?.data?.detail) {
        // FastAPI ValidationError의 detail이 문자열인 경우
        if (typeof err.response.data.detail === 'string') {
          errorMessage = err.response.data.detail
        } 
        // FastAPI ValidationError의 detail이 배열인 경우
        else if (Array.isArray(err.response.data.detail)) {
          errorMessage = err.response.data.detail.map((item: any) => item.msg || item.message || JSON.stringify(item)).join(', ')
        }
        // 객체인 경우
        else if (typeof err.response.data.detail === 'object') {
          errorMessage = JSON.stringify(err.response.data.detail)
        }
      } 
      // 기타 에러 메시지
      else if (err?.message) {
        errorMessage = err.message
      } else if (typeof err === 'string') {
        errorMessage = err
      }
      
      setError(errorMessage)
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
          회원가입
        </h1>
        <p className="text-center text-gray-600 mb-8">Aether Island에 오신 것을 환영합니다!</p>

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
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              이메일
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
              비밀번호 확인
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-pastel-purple focus:border-transparent outline-none transition-all"
              required
            />
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-3 bg-red-100 text-red-700 rounded-xl text-sm whitespace-pre-line"
            >
              {error}
            </motion.div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? '가입 중...' : '회원가입'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            이미 계정이 있으신가요?{' '}
            <button
              onClick={() => navigate('/login')}
              className="text-pastel-purple font-medium hover:underline"
            >
              로그인
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  )
}

