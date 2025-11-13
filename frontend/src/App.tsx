import { Suspense, lazy } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuthStore } from './stores/authStore'
import './App.css'

// Lazy load pages for code splitting
const LoginPage = lazy(() => import('./pages/LoginPage'))
const RegisterPage = lazy(() => import('./pages/RegisterPage'))
const MainGamePage = lazy(() => import('./pages/MainGamePage'))

// Loading fallback component
function LoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pastel-blue via-pastel-purple to-pastel-pink">
      <div className="text-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="text-6xl mb-4"
        >
          🏝️
        </motion.div>
        <p className="text-lg text-gray-700">로딩 중...</p>
      </div>
    </div>
  )
}

function App() {
  const { isAuthenticated } = useAuthStore()

  return (
    <Router>
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route path="/login" element={!isAuthenticated ? <LoginPage /> : <Navigate to="/" />} />
          <Route path="/register" element={!isAuthenticated ? <RegisterPage /> : <Navigate to="/" />} />
          <Route path="/" element={isAuthenticated ? <MainGamePage /> : <Navigate to="/login" />} />
        </Routes>
      </Suspense>
    </Router>
  )
}

export default App

