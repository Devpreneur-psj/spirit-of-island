import axios from 'axios'

// 환경 변수에서 API URL 가져오기 (개발 모드: http://localhost:8000, 프로덕션: 빌드 시 설정)
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

console.log('🔗 API URL:', `${API_URL}/api/v1`)

const api = axios.create({
  baseURL: `${API_URL}/api/v1`,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30초 타임아웃
})

// 요청 인터셉터: 토큰 추가 및 요청 로깅
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    // 요청 상세 로깅
    console.log('📤 API 요청:', {
      method: config.method?.toUpperCase(),
      url: config.url,
      baseURL: config.baseURL,
      fullURL: `${config.baseURL}${config.url}`,
      headers: config.headers,
    })
    return config
  },
  (error) => {
    console.error('❌ 요청 인터셉터 에러:', error)
    return Promise.reject(error)
  }
)

// 응답 인터셉터: 토큰 만료 처리 및 에러 로깅
api.interceptors.response.use(
  (response) => {
    console.log('✅ API 응답 성공:', {
      status: response.status,
      url: response.config.url,
      fullURL: `${response.config.baseURL}${response.config.url}`,
    })
    return response
  },
  (error) => {
    // 네트워크 에러 상세 로깅
    if (error.code === 'ERR_NETWORK' || error.message === 'Network Error' || error.code === 'ECONNREFUSED') {
      console.error('❌ 네트워크 에러 상세:', {
        message: error.message,
        code: error.code,
        apiUrl: API_URL,
        baseURL: `${API_URL}/api/v1`,
        requestedURL: error.config ? `${error.config.baseURL}${error.config.url}` : 'unknown',
        method: error.config?.method?.toUpperCase(),
        timeout: error.config?.timeout,
        stack: error.stack,
      })
      
      // 추가 진단 정보
      console.error('🔍 진단 정보:', {
        'API_URL 환경 변수': import.meta.env.VITE_API_URL,
        '실제 사용된 API_URL': API_URL,
        '브라우저 URL': window.location.href,
        '현재 시간': new Date().toISOString(),
      })
    } else if (error.response) {
      console.error('❌ API 응답 에러:', {
        status: error.response.status,
        statusText: error.response.statusText,
        url: error.config?.url,
        fullURL: error.config ? `${error.config.baseURL}${error.config.url}` : 'unknown',
        data: error.response.data,
      })
    } else {
      console.error('❌ 알 수 없는 에러:', error)
    }
    
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api

