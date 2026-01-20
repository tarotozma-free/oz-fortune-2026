import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { products, profiles, orders } from '../lib/supabase'

const ProgramSelect = () => {
  const navigate = useNavigate()
  const { user, signOut } = useAuth()
  const [programs, setPrograms] = useState([])
  const [userProfiles, setUserProfiles] = useState([])
  const [selectedProfileId, setSelectedProfileId] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    loadData()
  }, [user])

  const loadData = async () => {
    try {
      // 프로그램 목록 로드
      const { data: programsData, error: programsError } = await products.getAll()
      if (programsError) throw programsError
      setPrograms(programsData || [])

      // 프로필 목록 로드
      if (user) {
        const { data: profilesData, error: profilesError } = await profiles.getAll(user.id)
        if (profilesError) throw profilesError
        setUserProfiles(profilesData || [])

        // 기본 프로필 또는 첫 번째 프로필 자동 선택
        if (profilesData && profilesData.length > 0) {
          const defaultProfile = profilesData.find(p => p.is_default) || profilesData[0]
          setSelectedProfileId(defaultProfile.id)
        }
      }
    } catch (err) {
      console.error('Error loading data:', err)
      setError('데이터를 불러오는데 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  const handleProgramSelect = async (productId) => {
    // 프로필이 없으면 프로필 생성 페이지로
    if (userProfiles.length === 0) {
      alert('프로필을 먼저 등록해주세요')
      navigate(`/profile-manage?productId=${productId}`)
      return
    }

    // 프로필이 선택되지 않았으면
    if (!selectedProfileId) {
      alert('프로필을 선택해주세요')
      return
    }

    const selectedProfile = userProfiles.find(p => p.id === selectedProfileId)
    if (!selectedProfile) return

    // 확인 메시지
    if (!window.confirm(`${selectedProfile.profile_name} (${selectedProfile.name}) 프로필로 접수하시겠습니까?`)) {
      return
    }

    setSubmitting(true)

    try {
      const orderData = {
        user_id: user.id,
        profile_id: selectedProfile.id,
        product_id: productId,
        status: 'pending',
        input_data: {
          name: selectedProfile.name,
          birth_date: selectedProfile.birth_date,
          birth_time: selectedProfile.birth_time,
          birth_city: selectedProfile.birth_city,
          gender: selectedProfile.gender,
          is_lunar: selectedProfile.is_lunar,
          email: user.email
        }
      }

      const { data, error: orderError } = await orders.create(orderData)
      if (orderError) throw orderError

      // 성공 메시지
      alert(`접수가 완료되었습니다!\n결과는 ${user.email}로 전송됩니다.`)
      
    } catch (err) {
      console.error('Error creating order:', err)
      alert('접수 중 오류가 발생했습니다.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleLogout = async () => {
    try {
      await signOut()
      navigate('/login')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const handleAddProfile = () => {
    navigate('/profile-manage')
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
      {/* 헤더 */}
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

      {/* 메인 콘텐츠 */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-amber-800 mb-4">프로그램 선택</h2>
          <p className="text-amber-700 text-lg">원하시는 운세 프로그램을 선택해주세요</p>
        </div>

        {/* 프로필 선택 영역 */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-amber-100">
            <label className="block text-sm font-medium text-amber-900 mb-3">
              프로필 선택
            </label>
            <div className="flex gap-3">
              <select
                value={selectedProfileId}
                onChange={(e) => setSelectedProfileId(e.target.value)}
                className="flex-1 px-4 py-3 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-amber-50/30 text-amber-900"
              >
                <option value="">프로필을 선택하세요</option>
                {userProfiles.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.profile_name} ({p.name}, {p.birth_date})
                  </option>
                ))}
              </select>
              <button
                onClick={handleAddProfile}
                className="px-6 py-3 bg-stone-200 text-amber-900 rounded-lg font-semibold hover:bg-stone-300 transition-colors whitespace-nowrap"
              >
                + 새 프로필
              </button>
            </div>
            {selectedProfileId && (
              <p className="text-xs text-amber-600 mt-2">
                선택한 프로필로 운세를 접수합니다
              </p>
            )}
          </div>
        </div>

        {error && (
          <div className="max-w-2xl mx-auto mb-8 bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg">
            {error}
          </div>
        )}

        {/* 프로그램 그리드 */}
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
                  disabled={submitting || !selectedProfileId}
                  className="w-full bg-gradient-to-r from-amber-600 to-amber-700 text-white py-4 rounded-xl font-semibold text-lg hover:from-amber-700 hover:to-amber-800 transition-all duration-300 shadow-lg hover:shadow-xl group-hover:scale-[1.02] disabled:bg-stone-400 disabled:cursor-not-allowed disabled:scale-100"
                >
                  {submitting ? '접수 중...' : '시작하기'}
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