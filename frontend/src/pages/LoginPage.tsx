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

    console.log('🔐 로그인 시도:', { username })

    try {
      await login(username, password)
      console.log('✅ 로그인 성공!')
      navigate('/')
    } catch (err: any) {
      console.error('❌ 로그인 오류:', err)
      
      // 다양한 에러 형식 처리
      let errorMessage = '로그인에 실패했습니다.'
      
      // Network Error 처리
      if (err?.code === 'ERR_NETWORK' || err?.message === 'Network Error' || err?.code === 'ECONNREFUSED') {
        errorMessage = `서버에 연결할 수 없습니다. 백엔드가 실행 중인지 확인해주세요.\n\n확인 사항:\n1. 백엔드가 http://localhost:8000에서 실행 중인지 확인\n2. 브라우저 콘솔(F12)에서 API URL 확인\n3. 백엔드 로그 확인`
      }
      // 타임아웃 에러
      else if (err?.code === 'ECONNABORTED' || err?.message?.includes('timeout')) {
        errorMessage = '요청 시간이 초과되었습니다. 백엔드가 응답하지 않습니다.'
      }
      // 401 Unauthorized - 인증 실패
      else if (err?.response?.status === 401) {
        // 백엔드에서 반환하는 상세 메시지 사용
        errorMessage = err.response?.data?.detail || '사용자 이름 또는 비밀번호가 올바르지 않습니다.'
      }
      // 400 Bad Request - 잘못된 요청
      else if (err?.response?.status === 400) {
        errorMessage = err.response?.data?.detail || '잘못된 요청입니다. 입력 정보를 확인해주세요.'
      }
      // 500 Internal Server Error
      else if (err?.response?.status === 500) {
        errorMessage = '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.'
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

