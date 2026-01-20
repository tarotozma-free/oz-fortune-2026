import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { products } from '../lib/supabase'

const ProgramSelect = () => {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const [productList, setProductList] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () => {
    try {
      const { data, error } = await products.getAll()
      if (error) throw error
      setProductList(data || [])
    } catch (error) {
      console.error('상품 로딩 실패:', error)
      alert('상품 목록을 불러오는데 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  const handleProductSelect = (product) => {
    // 프로필 선택 페이지로 이동 (productId 전달)
    navigate(`/profile-select?productId=${product.id}`)
  }

  const handleLogout = async () => {
    try {
      await signOut()
      navigate('/')
    } catch (error) {
      console.error('로그아웃 실패:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      {/* 헤더 */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-purple-600">🔮 OZ Fortune</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-600">{user?.email}</span>
            <button
              onClick={handleLogout}
              className="text-gray-600 hover:text-gray-800"
            >
              로그아웃
            </button>
          </div>
        </div>
      </div>

      {/* 메인 컨텐츠 */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            프로그램 선택
          </h2>
          <p className="text-gray-600">
            원하시는 운세 프로그램을 선택해주세요
          </p>
        </div>

        {/* 프로그램 목록 */}
        <div className="grid md:grid-cols-2 gap-6">
          {productList.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer"
              onClick={() => handleProductSelect(product)}
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-gray-800">
                  {product.name}
                </h3>
                {product.price > 0 ? (
                  <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-semibold">
                    {product.price.toLocaleString()}원
                  </span>
                ) : (
                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
                    무료
                  </span>
                )}
              </div>

              {product.description && (
                <p className="text-gray-600 text-sm mb-4">
                  {product.description}
                </p>
              )}

              <button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-3 rounded-lg hover:shadow-lg transition-all">
                시작하기
              </button>
            </div>
          ))}
        </div>

        {productList.length === 0 && (
          <div className="text-center text-gray-500 py-12">
            등록된 프로그램이 없습니다.
          </div>
        )}
      </div>
    </div>
  )
}

export default ProgramSelect