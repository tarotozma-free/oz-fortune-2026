import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { profiles } from '../lib/supabase'

const ProfileManage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useAuth()
  
  const productId = new URLSearchParams(location.search).get('productId')

  const [formData, setFormData] = useState({
    profile_name: '',
    name: '',
    birth_year: '',
    birth_month: '',
    birth_day: '',
    birth_hour: '',
    birth_minute: '',
    birth_time_unknown: false,
    is_lunar: false,
    birth_city: '서울',
    gender: 'male',
    is_default: false
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleBirthTimeUnknownChange = (e) => {
    const checked = e.target.checked
    setFormData(prev => ({
      ...prev,
      birth_time_unknown: checked,
      birth_hour: checked ? '0' : '',
      birth_minute: checked ? '0' : ''
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    // 유효성 검사
    if (!formData.profile_name.trim()) {
      setError('프로필 이름을 입력해주세요')
      return
    }

    if (!formData.name.trim()) {
      setError('이름을 입력해주세요')
      return
    }

    if (!formData.birth_year || !formData.birth_month || !formData.birth_day) {
      setError('생년월일을 모두 입력해주세요')
      return
    }

    const year = parseInt(formData.birth_year)
    const month = parseInt(formData.birth_month)
    const day = parseInt(formData.birth_day)

    if (year < 1900 || year > 2100) {
      setError('올바른 년도를 입력해주세요 (1900-2100)')
      return
    }

    if (month < 1 || month > 12) {
      setError('올바른 월을 입력해주세요 (1-12)')
      return
    }

    if (day < 1 || day > 31) {
      setError('올바른 일을 입력해주세요 (1-31)')
      return
    }

    // 시간 유효성 검사 (생시 모름이 아닌 경우만)
    if (!formData.birth_time_unknown && formData.birth_hour !== '') {
      const hour = parseInt(formData.birth_hour)
      if (hour < 0 || hour > 23) {
        setError('올바른 시간을 입력해주세요 (0-23)')
        return
      }

      if (formData.birth_minute !== '') {
        const minute = parseInt(formData.birth_minute)
        if (minute < 0 || minute > 59) {
          setError('올바른 분을 입력해주세요 (0-59)')
          return
        }
      }
    }

    setLoading(true)

    try {
      // 생년월일 조합
      const birthDate = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
      
      // 시간 정보
      let birthTime = null
      if (formData.birth_time_unknown) {
        birthTime = '00:00:00'
      } else if (formData.birth_hour !== '') {
        const hour = String(formData.birth_hour).padStart(2, '0')
        const minute = formData.birth_minute ? String(formData.birth_minute).padStart(2, '0') : '00'
        birthTime = `${hour}:${minute}:00`
      }

      const profileData = {
        user_id: user.id,
        profile_name: formData.profile_name.trim(),
        name: formData.name.trim(),
        birth_date: birthDate,
        birth_time: birthTime,
        is_lunar: formData.is_lunar,
        birth_city: formData.birth_city,
        gender: formData.gender,
        is_default: formData.is_default
      }

      const { data, error: createError } = await profiles.create(profileData)

      if (createError) throw createError

      // 성공 시 다음 페이지로 이동
      if (productId) {
        navigate(`/product/${productId}?profileId=${data.id}`)
      } else {
        navigate('/programs')
      }
    } catch (err) {
      console.error('Profile creation error:', err)
      setError('프로필 생성 중 오류가 발생했습니다')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-3xl font-bold text-center text-purple-600 mb-2">
            프로필 만들기
          </h1>
          <p className="text-center text-gray-600 mb-8">
            누구의 운세를 보시겠어요?
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 프로필 이름 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                프로필 이름
              </label>
              <input
                type="text"
                name="profile_name"
                value={formData.profile_name}
                onChange={handleChange}
                placeholder="본인"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            {/* 이름 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                이름
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="장세나"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            {/* 생년월일 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                생년월일
              </label>
              <div className="grid grid-cols-3 gap-3">
                <input
                  type="number"
                  name="birth_year"
                  value={formData.birth_year}
                  onChange={handleChange}
                  placeholder="1980"
                  min="1900"
                  max="2100"
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <input
                  type="number"
                  name="birth_month"
                  value={formData.birth_month}
                  onChange={handleChange}
                  placeholder="12"
                  min="1"
                  max="12"
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <input
                  type="number"
                  name="birth_day"
                  value={formData.birth_day}
                  onChange={handleChange}
                  placeholder="14"
                  min="1"
                  max="31"
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">년(4자리) - 월 - 일</p>
            </div>

            {/* 양력/음력 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                양력/음력
              </label>
              <div className="flex gap-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="is_lunar"
                    value="false"
                    checked={!formData.is_lunar}
                    onChange={() => setFormData(prev => ({ ...prev, is_lunar: false }))}
                    className="mr-2"
                  />
                  <span>양력</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="is_lunar"
                    value="true"
                    checked={formData.is_lunar}
                    onChange={() => setFormData(prev => ({ ...prev, is_lunar: true }))}
                    className="mr-2"
                  />
                  <span>음력</span>
                </label>
              </div>
            </div>

            {/* 태어난 시간 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                태어난 시간 (선택사항)
              </label>
              
              {/* 생시 모름 체크박스 */}
              <div className="mb-3">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="birth_time_unknown"
                    checked={formData.birth_time_unknown}
                    onChange={handleBirthTimeUnknownChange}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">생시를 모릅니다</span>
                </label>
              </div>

              {/* 시간 입력 */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <input
                    type="number"
                    name="birth_hour"
                    value={formData.birth_hour}
                    onChange={handleChange}
                    placeholder="시 (0-23)"
                    min="0"
                    max="23"
                    disabled={formData.birth_time_unknown}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                  <p className="text-xs text-gray-500 mt-1">시 (24시간 형식)</p>
                </div>
                <div>
                  <input
                    type="number"
                    name="birth_minute"
                    value={formData.birth_minute}
                    onChange={handleChange}
                    placeholder="분 (0-59)"
                    min="0"
                    max="59"
                    disabled={formData.birth_time_unknown}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                  <p className="text-xs text-gray-500 mt-1">분</p>
                </div>
              </div>
            </div>

            {/* 태어난 위치 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                태어난 위치
              </label>
              <input
                type="text"
                name="birth_city"
                value={formData.birth_city}
                onChange={handleChange}
                placeholder="서울"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            {/* 성별 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                성별
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="male">남성</option>
                <option value="female">여성</option>
              </select>
            </div>

            {/* 결과 수신 이메일 (읽기 전용) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                결과 수신 이메일
              </label>
              <div className="px-4 py-3 border border-gray-200 rounded-lg bg-gray-50">
                <p className="text-gray-700">{user?.email || '이메일 없음'}</p>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                운세 결과가 이 이메일로 전송됩니다
              </p>
            </div>

            {/* 기본 프로필 */}
            <div className="flex items-center">
              <input
                type="checkbox"
                name="is_default"
                checked={formData.is_default}
                onChange={handleChange}
                className="mr-2"
                id="is_default"
              />
              <label htmlFor="is_default" className="text-sm text-gray-700">
                기본 프로필로 설정
              </label>
            </div>

            {/* 에러 메시지 */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            {/* 버튼 */}
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-purple-600 text-white py-4 rounded-lg font-semibold hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? '저장 중...' : '저장'}
              </button>
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="flex-1 bg-gray-200 text-gray-700 py-4 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
              >
                취소
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ProfileManage