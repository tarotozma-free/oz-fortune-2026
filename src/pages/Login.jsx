import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const Login = () => {
  const { user, signInWithKakao, loading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (user) {
      navigate('/programs')
    }
  }, [user, navigate])

  const handleKakaoLogin = async () => {
    try {
      await signInWithKakao()
    } catch (error) {
      console.error('로그인 실패:', error)
      alert('로그인에 실패했습니다. 다시 시도해주세요.')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">로딩 중...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <div className="max-w-md w-full mx-4">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
            🔮 OZ Fortune
          </h1>
          <p className="text-gray-600 text-lg">
            당신의 운명을 만나보세요
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
            로그인
          </h2>

          <p className="text-gray-600 text-center mb-8">
            소셜 로그인으로 간편하게 시작하세요
          </p>

          <button
            onClick={handleKakaoLogin}
            className="w-full bg-[#FEE500] hover:bg-[#FDD835] text-[#000000] font-semibold py-4 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 flex items-center justify-center gap-3 shadow-md"
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 3C6.477 3 2 6.477 2 10.5c0 2.442 1.483 4.602 3.717 5.917-.153.634-.506 2.138-.584 2.473-.095.414.153.409.319.297.133-.09 2.052-1.373 2.826-1.898.567.08 1.146.122 1.722.122 5.523 0 10-3.477 10-7.5S17.523 3 12 3z"/>
            </svg>
            <span>카카오로 시작하기</span>
          </button>

          <button
            disabled
            className="w-full mt-4 bg-gray-100 text-gray-400 font-semibold py-4 px-6 rounded-lg flex items-center justify-center gap-3 cursor-not-allowed"
          >
            <span>구글 로그인 (준비중)</span>
          </button>
        </div>

        <p className="text-center text-gray-500 text-sm mt-6">
          로그인하시면 이용약관 및 개인정보처리방침에 동의하게 됩니다
        </p>
      </div>
    </div>
  )
}

export default Login