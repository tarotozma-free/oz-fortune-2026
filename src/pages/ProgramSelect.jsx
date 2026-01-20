import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { products } from '../lib/supabase'

const ProgramSelect = () => {
  const navigate = useNavigate()
  const { user, signOut } = useAuth()
  const [programs, setPrograms] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadPrograms()
  }, [])

  const loadPrograms = async () => {
    try {
      const { data, error } = await products.getAll()
      if (error) throw error
      setPrograms(data || [])
    } catch (err) {
      console.error('Error loading programs:', err)
      setError('상품 목록을 불러오는데 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  const handleProgramSelect = (programId) => {
    navigate(`/profile-select?productId=${programId}`)
  }

  const handleLogout = async () => {
    try {
      await signOut()
      navigate('/login')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 flex items-center justify-center">
        <div className="text-amber-800 text-xl">로딩 중...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-amber-100">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-600 to-amber-700 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">🔮</span>
            </div>
            <h1 className="text-2xl font-bold text-amber-800">OZ Fortune</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-amber-700">{user?.email}</span>
            <button
              onClick={handleLogout}
              className="text-amber-700 hover:text-amber-900 font-medium transition-colors"
            >
              로그아웃
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-amber-800 mb-4">프로그램 선택</h2>
          <p className="text-amber-700 text-lg">원하시는 운세 프로그램을 선택해주세요</p>
        </div>

        {error && (
          <div className="max-w-2xl mx-auto mb-8 bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {programs.map((program) => (
            <div
              key={program.id}
              className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-amber-100 group"
            >
              <div className="p-8">
                <div className="flex items-start justify-between mb-6">
                  <h3 className="text-2xl font-bold text-amber-900 flex-1">{program.name}</h3>
                  {program.price > 0 ? (
                    <span className="text-amber-700 font-bold text-xl ml-4">
                      {program.price.toLocaleString()}원
                    </span>
                  ) : (
                    <span className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-4 py-1 rounded-full text-sm font-semibold ml-4 shadow-md">
                      무료
                    </span>
                  )}
                </div>
                <button
                  onClick={() => handleProgramSelect(program.id)}
                  className="w-full bg-gradient-to-r from-amber-600 to-amber-700 text-white py-4 rounded-xl font-semibold text-lg hover:from-amber-700 hover:to-amber-800 transition-all duration-300 shadow-lg hover:shadow-xl group-hover:scale-[1.02]"
                >
                  시작하기
                </button>
              </div>
            </div>
          ))}
        </div>

        {programs.length === 0 && !loading && !error && (
          <div className="text-center py-12">
            <p className="text-amber-700 text-lg">등록된 프로그램이 없습니다.</p>
          </div>
        )}
      </main>
    </div>
  )
}

export default ProgramSelect