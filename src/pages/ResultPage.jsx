import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { PRODUCTS, getProductKeyById } from '../config/products';
import SummaryView from '../components/SummaryView';
import FullView from '../components/FullView';

const ResultPage = () => {
  const { orderId } = useParams();
  const [searchParams] = useSearchParams();
  const viewMode = searchParams.get('view'); // 'full' or null
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [orderData, setOrderData] = useState(null);
  const [productKey, setProductKey] = useState('saju');
  const [showFull, setShowFull] = useState(viewMode === 'full'); // URL 파라미터로 초기값 설정

  const [displayName, setDisplayName] = useState('');

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        // orders와 products를 join해서 display_name 가져오기
        const { data, error } = await supabase
          .from('orders')
          .select(`
            *,
            products:product_id (
              display_name,
              name
            )
          `)
          .eq('id', orderId)
          .single();

        if (error) throw error;
        if (!data) throw new Error('주문을 찾을 수 없습니다');

        setOrderData(data);
        setProductKey(getProductKeyById(data.product_id));
        // display_name 설정 (없으면 name 사용)
        setDisplayName(data.products?.display_name || data.products?.name || '운세 분석');
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 flex items-center justify-center">
        <div className="text-white text-xl">불러오는 중...</div>
      </div>
    );
  }

  if (error || !orderData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 flex items-center justify-center p-4">
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 w-full max-w-md border border-white/20 text-center">
          <div className="text-6xl mb-4">😢</div>
          <h2 className="text-2xl font-bold text-white mb-2">결과를 찾을 수 없습니다</h2>
          <p className="text-purple-200 mb-6">{error || '잘못된 링크이거나 결과가 아직 준비되지 않았습니다.'}</p>
          <a href="/" className="inline-block py-3 px-6 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold">
            홈으로 돌아가기
          </a>
        </div>
      </div>
    );
  }

  if (orderData.status !== 'completed') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 flex items-center justify-center p-4">
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 w-full max-w-md border border-white/20 text-center">
          <div className="text-6xl mb-4 animate-bounce">⏳</div>
          <h2 className="text-2xl font-bold text-white mb-2">분석 진행 중입니다</h2>
          <p className="text-purple-200 mb-6">잠시 후 다시 확인해 주세요. 완료되면 이메일로도 안내드립니다.</p>
          <button onClick={() => window.location.reload()} className="py-3 px-6 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold">
            새로고침
          </button>
        </div>
      </div>
    );
  }

  const config = PRODUCTS[productKey];
  const theme = config.theme;
  const formData = orderData.input_data || {};
  const result = {
    aiResponse: orderData.ai_response,
    pdfUrl: orderData.pdf_url,
    notionUrl: orderData.notion_url
  };

  // showFull 상태에 따라 요약/풀버전 표시
  return showFull ? (
    <FullView 
      config={config} 
      theme={theme} 
      formData={formData} 
      result={result}
      displayName={displayName}
      onBack={() => setShowFull(false)}
    />
  ) : (
    <SummaryView 
      config={config} 
      theme={theme} 
      formData={formData} 
      result={result}
      displayName={displayName}
      onBack={null}
      onShowFull={() => setShowFull(true)}
    />
  );
};


export default ResultPage;