import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const AuthCallback = () => {
  const navigate = useNavigate()
  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      navigate('/programs', { replace: true })
    }
  }, [user, navigate])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto"></div>
        <p className="mt-6 text-gray-600 text-lg">로그인 처리 중...</p>
        <p className="mt-2 text-gray-500 text-sm">잠시만 기다려주세요</p>
      </div>
    </div>
  )
}

export default AuthCallback