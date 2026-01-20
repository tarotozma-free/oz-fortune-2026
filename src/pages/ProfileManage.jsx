import React, { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { profiles } from '../lib/supabase'

const ProfileManage = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const productId = searchParams.get('productId')

  const [profileList, setProfileList] = useState([])
  const [loading, setLoading] = useState(true)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newProfile, setNewProfile] = useState({
    profile_name: '본인',
    name: '',
    birth_date: '',
    birth_time: '',
    birth_city: '서울',
    gender: '남성',
    is_lunar: false
  })

  useEffect(() => {
    if (user) {
      loadProfiles()
    }
  }, [user])

  const loadProfiles = async () => {
    try {
      const { data, error } = await profiles.getAll(user.id)
      if (error) throw error
      setProfileList(data || [])
      
      // 프로필이 없으면 생성 폼 자동 표시
      if (!data || data.length === 0) {
        setShowCreateForm(true)
      }
    } catch (error) {
      console.error('프로필 로딩 실패:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateProfile = async (e) => {
    e.preventDefault()
    
    try {
      const { data, error } = await profiles.create({
        user_id: user.id,
        ...newProfile,
        is_default: profileList.length === 0 // 첫 프로필은 기본으로
      })
      
      if (error) throw error
      
      alert('프로필이 생성되었습니다!')
      setShowCreateForm(false)
      loadProfiles()
    } catch (error) {
      console.error('프로필 생성 실패:', error)
      alert('프로필 생성에 실패했습니다.')
    }
  }

  const handleSelectProfile = (profile) => {
    // 입력 페이지로 이동 (profileId, productId 전달)
    navigate(`/input?productId=${productId}&profileId=${profile.id}`)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <button
          onClick={() => navigate('/programs')}
          className="text-purple-600 hover:text-purple-800 mb-6"
        >
          ← 프로그램 선택으로 돌아가기
        </button>

        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            프로필 선택
          </h2>
          <p className="text-gray-600">
            누구의 운세를 보시겠어요?
          </p>
        </div>

        {/* 기존 프로필 목록 */}
        {profileList.length > 0 && (
          <div className="space-y-4 mb-6">
            {profileList.map((profile) => (
              <div
                key={profile.id}
                onClick={() => handleSelectProfile(profile)}
                className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                      {profile.profile_name} ({profile.name})
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {profile.birth_date} | {profile.gender}
                      {profile.is_default && (
                        <span className="ml-2 text-purple-600 font-semibold">
                          ⭐ 기본
                        </span>
                      )}
                    </p>
                  </div>
                  <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700">
                    선택
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 새 프로필 추가 버튼 */}
        {!showCreateForm && (
          <button
            onClick={() => setShowCreateForm(true)}
            className="w-full bg-white border-2 border-dashed border-purple-300 text-purple-600 font-semibold py-4 rounded-xl hover:border-purple-500 hover:bg-purple-50 transition-all"
          >
            + 새 프로필 추가
          </button>
        )}

        {/* 프로필 생성 폼 */}
        {showCreateForm && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              새 프로필 만들기
            </h3>
            <form onSubmit={handleCreateProfile} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  프로필 이름
                </label>
                <input
                  type="text"
                  value={newProfile.profile_name}
                  onChange={(e) => setNewProfile({...newProfile, profile_name: e.target.value})}
                  placeholder="예: 본인, 아내, 아들"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  이름
                </label>
                <input
                  type="text"
                  value={newProfile.name}
                  onChange={(e) => setNewProfile({...newProfile, name: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  생년월일
                </label>
                <input
                  type="date"
                  value={newProfile.birth_date}
                  onChange={(e) => setNewProfile({...newProfile, birth_date: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  태어난 시간
                </label>
                <input
                  type="time"
                  value={newProfile.birth_time}
                  onChange={(e) => setNewProfile({...newProfile, birth_time: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  태어난 위치
                </label>
                <input
                  type="text"
                  value={newProfile.birth_city}
                  onChange={(e) => setNewProfile({...newProfile, birth_city: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  성별
                </label>
                <select
                  value={newProfile.gender}
                  onChange={(e) => setNewProfile({...newProfile, gender: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                >
                  <option value="남성">남성</option>
                  <option value="여성">여성</option>
                </select>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={newProfile.is_lunar}
                  onChange={(e) => setNewProfile({...newProfile, is_lunar: e.target.checked})}
                  className="mr-2"
                />
                <label className="text-sm text-gray-700">음력</label>
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex-1 bg-purple-600 text-white font-semibold py-3 rounded-lg hover:bg-purple-700"
                >
                  저장
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="flex-1 bg-gray-200 text-gray-700 font-semibold py-3 rounded-lg hover:bg-gray-300"
                >
                  취소
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProfileManage