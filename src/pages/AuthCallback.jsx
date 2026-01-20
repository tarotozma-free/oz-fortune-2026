import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

const AuthCallback = () => {
  const navigate = useNavigate()
  const [error, setError] = useState(null)

  useEffect(() => {
    // URL에서 해시 프래그먼트 처리
    const hashParams = new URLSearchParams(window.location.hash.substring(1))
    const accessToken = hashParams.get('access_token')
    const refreshToken = hashParams.get('refresh_token')
    
    // URL에서 쿼리 파라미터 처리 (에러 체크)
    const searchParams = new URLSearchParams(window.location.search)
    const errorParam = searchParams.get('error')
    const errorDescription = searchParams.get('error_description')

    if (errorParam) {
      console.error('Auth error:', errorParam, errorDescription)
      setError(errorDescription || errorParam)
      setTimeout(() => navigate('/login', { replace: true }), 3000)
      return
    }

    // Supabase가 자동으로 세션을 처리하도록 대기
    const checkSession = async () => {
      try {
        // 짧은 지연 후 세션 확인 (Supabase가 세션을 설정할 시간 제공)
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('Session error:', error)
          setError(error.message)
          setTimeout(() => navigate('/login', { replace: true }), 3000)
          return
        }

        if (session) {
          console.log('Login successful, redirecting to /programs')
          navigate('/programs', { replace: true })
        } else {
          console.log('No session found, redirecting to /login')
          setTimeout(() => navigate('/login', { replace: true }), 2000)
        }
      } catch (err) {
        console.error('Unexpected error:', err)
        setError('로그인 처리 중 오류가 발생했습니다')
        setTimeout(() => navigate('/login', { replace: true }), 3000)
      }
    }

    checkSession()
  }, [navigate])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="text-center">
        {error ? (
          <>
            <div className="text-red-500 text-xl mb-4">❌</div>
            <p className="mt-4 text-red-600 text-lg font-semibold">로그인 실패</p>
            <p className="mt-2 text-gray-600 text-sm">{error}</p>
            <p className="mt-4 text-gray-500 text-sm">로그인 페이지로 돌아갑니다...</p>
          </>
        ) : (
          <>
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto"></div>
            <p className="mt-6 text-gray-600 text-lg">로그인 처리 중...</p>
            <p className="mt-2 text-gray-500 text-sm">잠시만 기다려주세요</p>
          </>
        )}
      </div>
    </div>
  )
}

export default AuthCallback