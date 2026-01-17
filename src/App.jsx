import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { BrowserRouter, Routes, Route, Navigate, useParams } from 'react-router-dom';

const supabase = createClient(
  'https://mwgvdtwxiiluwdxtbqgz.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im13Z3ZkdHd4aWlsdXdkeHRicWd6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg0NDM2NzEsImV4cCI6MjA4NDAxOTY3MX0.XnK-V2r2Sb6Ndqw2HocTmrE2ujOLY-etBqpzD9dOZoo'
);

// ========================================
// 상품별 설정 (테마, 텍스트, product_id)
// ========================================
const PRODUCTS = {
  saju: {
    product_id: '2026_vip_saju',
    icon: '🔮',
    title: '2026년 VIP 신년운세',
    subtitle: '프리미엄 사주 분석 리포트',
    buttonText: '내 운세 분석받기',
    theme: {
      bg: 'from-purple-900 via-indigo-900 to-blue-900',
      card: 'bg-white/10 border-white/20',
      accent: 'purple',
      button: 'from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600',
      text: {
        primary: 'text-white',
        secondary: 'text-purple-200',
        muted: 'text-purple-400/60',
        accent: 'text-purple-400',
      },
      input: 'bg-white/10 border-white/20 text-white placeholder-purple-300 focus:ring-purple-400',
      select: 'bg-gray-800',
      score: 'from-yellow-400 to-orange-500',
    },
    statusMessages: [
      '🔮 사주 원국을 분석하고 있습니다...',
      '📊 2026년 운세를 계산하고 있습니다...',
      '✨ 맞춤형 분석을 생성하고 있습니다...',
      '📄 리포트를 제작하고 있습니다...',
      '🎁 마무리 작업 중입니다...'
    ],
    graphLabels: [
      { key: 'wealth', label: '재물', emoji: '💰' },
      { key: 'love', label: '애정', emoji: '💕' },
      { key: 'career', label: '직업', emoji: '💼' },
      { key: 'health', label: '건강', emoji: '🏃' },
      { key: 'social', label: '사회', emoji: '🤝' },
    ],
    prescriptionTitle: '🍀 개운 처방전',
    prescriptionFields: ['color', 'number', 'direction', 'item'],
    prescriptionLabels: { color: '색상', number: '숫자', direction: '방향', item: '물건' },
  },
  
  wealth: {
    product_id: 'lifetime_wealth_fortune',
    icon: '💰',
    title: '평생 재물운 대분석',
    subtitle: '돈의 흐름을 읽는 프리미엄 사주 분석',
    buttonText: '내 재물운 분석받기',
    theme: {
      bg: 'from-gray-900 via-amber-950 to-gray-900',
      card: 'bg-black/40 border-amber-500/30',
      accent: 'amber',
      button: 'from-yellow-500 via-amber-500 to-yellow-600 hover:from-yellow-400 hover:to-amber-400 text-gray-900',
      text: {
        primary: 'text-white',
        secondary: 'text-amber-200',
        muted: 'text-amber-400/60',
        accent: 'text-amber-400',
      },
      input: 'bg-black/30 border-amber-500/30 text-white placeholder-amber-300/50 focus:ring-amber-400',
      select: 'bg-gray-900',
      score: 'from-yellow-400 to-amber-500',
    },
    statusMessages: [
      '💰 재물 원국을 분석하고 있습니다...',
      '📊 평생 재물 흐름을 계산하고 있습니다...',
      '🏆 당신만의 부자 전략을 설계하고 있습니다...',
      '📈 투자 적성을 분석하고 있습니다...',
      '💎 맞춤형 재물 리포트를 제작하고 있습니다...'
    ],
    graphLabels: [
      { key: 'wealth_luck', label: '재물', emoji: '💰' },
      { key: 'business', label: '사업', emoji: '🏢' },
      { key: 'investment', label: '투자', emoji: '📈' },
      { key: 'salary', label: '급여', emoji: '💼' },
      { key: 'windfall', label: '횡재', emoji: '🎰' },
    ],
    prescriptionTitle: '💎 재물 처방전',
    prescriptionFields: ['wallet_color', 'lucky_number', 'money_direction', 'lucky_item', 'best_timing', 'avoid_action'],
    prescriptionLabels: { 
      wallet_color: '지갑 색상', 
      lucky_number: '행운의 숫자', 
      money_direction: '돈이 오는 방향', 
      lucky_item: '재물 아이템',
      best_timing: '투자 타이밍',
      avoid_action: '피해야 할 것'
    },
    showWealthGrade: true,
    showMoneyType: true,
    showPeakDanger: true,
    showLifetimeFlow: true,
  }
};

// product_id로 productKey 찾기
const getProductKeyById = (productId) => {
  for (const [key, config] of Object.entries(PRODUCTS)) {
    if (config.product_id === productId) return key;
  }
  return 'saju'; // 기본값
};

// ========================================
// 꺾은선 그래프 컴포넌트 (재물운 전용)
// ========================================
const WealthFlowChart = ({ data, theme }) => {
  if (!data || data.length === 0) return null;
  
  const maxScore = 100;
  const width = 100;
  const height = 60;
  const padding = 10;
  
  const points = data.map((item, i) => {
    const x = padding + (i * (width - padding * 2) / (data.length - 1));
    const y = height - padding - ((item.score / maxScore) * (height - padding * 2));
    return { x, y, ...item };
  });
  
  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const areaD = `${pathD} L ${points[points.length-1].x} ${height - padding} L ${padding} ${height - padding} Z`;
  
  return (
    <div className="w-full">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-40">
        <defs>
          <linearGradient id="goldGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFD700" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#FFD700" stopOpacity="0.1" />
          </linearGradient>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#F59E0B" />
            <stop offset="50%" stopColor="#FFD700" />
            <stop offset="100%" stopColor="#F59E0B" />
          </linearGradient>
        </defs>
        
        {[0, 25, 50, 75, 100].map((val, i) => {
          const y = height - padding - ((val / maxScore) * (height - padding * 2));
          return (
            <line key={i} x1={padding} y1={y} x2={width - padding} y2={y} 
              stroke="rgba(255,215,0,0.2)" strokeWidth="0.3" strokeDasharray="2,2" />
          );
        })}
        
        <path d={areaD} fill="url(#goldGradient)" />
        <path d={pathD} fill="none" stroke="url(#lineGradient)" strokeWidth="1.5" strokeLinecap="round" />
        
        {points.map((p, i) => (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r="2.5" fill="#1F2937" stroke="#FFD700" strokeWidth="1.5" />
            <text x={p.x} y={height - 2} textAnchor="middle" className="text-[4px] fill-amber-400">{p.age_range}</text>
          </g>
        ))}
      </svg>
      
      <div className="flex justify-between px-2 mt-2">
        {data.map((item, i) => (
          <div key={i} className="text-center flex-1">
            <div className={`${theme.text.accent} font-bold text-sm`}>{item.score}점</div>
            <div className={`${theme.text.muted} text-xs truncate px-1`}>{item.hook}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ========================================
// 재물 등급 뱃지 컴포넌트
// ========================================
const WealthGradeBadge = ({ grade, hook }) => {
  const gradeColors = {
    'S': 'from-yellow-400 via-amber-300 to-yellow-500',
    'A': 'from-amber-400 via-yellow-400 to-amber-500',
    'B': 'from-gray-300 via-gray-200 to-gray-400',
    'C': 'from-orange-700 via-orange-600 to-orange-800',
    'D': 'from-stone-500 via-stone-400 to-stone-600'
  };
  
  const gradeLabels = {
    'S': '최상급 재물복', 'A': '상급 재물복', 'B': '중급 재물복', 'C': '관리형 재물복', 'D': '노력형 재물복'
  };
  
  return (
    <div className="text-center">
      <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br ${gradeColors[grade] || gradeColors['B']} shadow-lg shadow-amber-500/30`}>
        <span className="text-4xl font-black text-gray-900">{grade}</span>
      </div>
      <div className="text-amber-400 font-bold mt-2">{gradeLabels[grade] || '재물복'}</div>
      {hook && <div className="text-amber-200/80 text-sm mt-1 italic">"{hook}"</div>}
    </div>
  );
};

// ========================================
// 요약본 컴포넌트 (결과 페이지용)
// ========================================
const SummaryView = ({ config, theme, formData, result, onBack, onDownload }) => {
  const ai = result?.aiResponse || {};
  const analyses = ai.custom_analysis_10 || [];
  const prescription = ai.lucky_prescription || ai.wealth_prescription || {};
  const graphs = ai.graphs || {};
  const wealthFlow = ai.lifetime_wealth_flow || [];

  const Copyright = () => (
    <p className={`text-center ${theme.text.muted} text-xs mt-8`}>
      © 2025 OZ Fortune. All rights reserved.
    </p>
  );

  return (
    <div className={`min-h-screen bg-gradient-to-br ${theme.bg}`}>
      {/* 헤더 */}
      <div className="bg-black/30 backdrop-blur-sm sticky top-0 z-10 border-b border-white/10">
        <div className="max-w-2xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className={`${theme.text.primary} font-bold`}>{config.icon} {formData?.name || '회원'}님의 분석 결과</h1>
          {onBack && (
            <button onClick={onBack} className={`${theme.text.accent} hover:text-white text-sm`}>
              ← 돌아가기
            </button>
          )}
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* 후킹 멘트 */}
        {ai.hooking_ment && (
          <div className={`bg-gradient-to-r from-${theme.accent}-500/20 to-${theme.accent}-500/20 rounded-2xl p-6 mb-6 border border-${theme.accent}-500/30`}>
            <p className={`text-lg ${theme.text.primary} text-center italic`}>"{ai.hooking_ment}"</p>
          </div>
        )}

        {/* 재물운 전용: 등급 + 유형 */}
        {config.showWealthGrade && (
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className={`${theme.card} rounded-2xl p-5 border flex flex-col items-center justify-center`}>
              <WealthGradeBadge grade={ai.wealth_grade || 'A'} hook={ai.wealth_grade_hook} />
            </div>
            <div className={`${theme.card} rounded-2xl p-5 border`}>
              <div className="text-center">
                <div className="text-3xl mb-2">
                  {ai.money_type === '사업가형' ? '🏢' : ai.money_type === '투자자형' ? '📈' : '💰'}
                </div>
                <div className={`${theme.text.accent} font-bold`}>{ai.money_type || '복합형'}</div>
                <div className={`${theme.text.muted} text-xs mt-1 italic`}>"{ai.money_type_hook}"</div>
              </div>
            </div>
          </div>
        )}

        {/* 재물운 전용: 전성기/주의기 */}
        {config.showPeakDanger && (
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gradient-to-br from-green-900/40 to-emerald-900/40 rounded-xl p-4 border border-green-500/30">
              <div className="text-green-400 text-sm mb-1">🚀 전성기</div>
              <div className="text-white font-bold text-lg">{ai.peak_period || '45-55세'}</div>
              <div className="text-green-300/80 text-xs mt-1">"{ai.peak_hook}"</div>
            </div>
            <div className="bg-gradient-to-br from-red-900/40 to-rose-900/40 rounded-xl p-4 border border-red-500/30">
              <div className="text-red-400 text-sm mb-1">⚠️ 주의 시기</div>
              <div className="text-white font-bold text-lg">{ai.danger_period || '38-42세'}</div>
              <div className="text-red-300/80 text-xs mt-1">"{ai.danger_hook}"</div>
            </div>
          </div>
        )}

        {/* 종합 점수 + 지표 */}
        <div className={`${theme.card} rounded-2xl p-6 mb-6 border`}>
          <div className="text-center mb-6">
            <div className={`text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r ${theme.score} mb-1`}>
              {ai.summary_score || 85}점
            </div>
            <p className={`${theme.text.accent} text-sm`}>종합 점수</p>
          </div>
          <div className="grid grid-cols-5 gap-2">
            {config.graphLabels.map((item, i) => (
              <div key={i} className="text-center">
                <div className="text-lg">{item.emoji}</div>
                <div className={`${theme.text.primary} font-bold text-sm`}>{graphs[item.key] || 80}</div>
                <div className={`${theme.text.muted} text-xs`}>{item.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* 재물운 전용: 인생 그래프 */}
        {config.showLifetimeFlow && wealthFlow.length > 0 && (
          <div className={`${theme.card} rounded-2xl p-6 mb-6 border`}>
            <h3 className={`${theme.text.accent} font-bold mb-4 text-center`}>📈 인생 재물 흐름</h3>
            <WealthFlowChart data={wealthFlow} theme={theme} />
          </div>
        )}

        {/* 분석 10개 */}
        <div className="space-y-3 mb-6">
          {analyses.map((item, i) => (
            <div key={i} className={`${theme.card} rounded-xl p-4 border`}>
              <h3 className={`${theme.text.primary} font-medium mb-1`}>{item.topic || `분석 ${i + 1}`}</h3>
              {item.hook && <p className={`${theme.text.accent} text-sm italic mb-2`}>"{item.hook}"</p>}
              <p className={`${theme.text.secondary} text-sm leading-relaxed`}>
                {(item.summary || item.full_content || '').substring(0, 200)}
                {(item.summary || item.full_content || '').length > 200 && '...'}
              </p>
            </div>
          ))}
        </div>

        {/* 처방전 */}
        <div className={`bg-gradient-to-r from-${theme.accent}-500/20 to-${theme.accent}-500/20 rounded-2xl p-5 mb-6 border border-${theme.accent}-500/30`}>
          <h2 className={`text-lg font-bold ${theme.text.primary} mb-3`}>{config.prescriptionTitle}</h2>
          <div className="grid grid-cols-2 gap-2 text-sm">
            {config.prescriptionFields.map(field => prescription[field] && (
              <div key={field} className={`${theme.card} rounded-lg p-3`}>
                <span className={theme.text.accent}>{config.prescriptionLabels[field]}</span>
                <span className={`${theme.text.primary} ml-2`}>{prescription[field]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* PDF 다운로드 */}
        {result?.pdfUrl && (
          <a href={result?.pdfUrl} target="_blank" rel="noopener noreferrer"
            className={`block w-full py-4 rounded-xl bg-gradient-to-r ${theme.button} font-bold text-center transition-all mb-4`}
          >
            📄 PDF 전체 리포트 다운로드
          </a>
        )}

        {onBack && (
          <button onClick={onBack}
            className={`block w-full py-3 rounded-xl ${theme.input} border font-medium transition-all`}
          >
            ← 돌아가기
          </button>
        )}

        <Copyright />
      </div>
    </div>
  );
};

// ========================================
// 결과 페이지 (URL로 접근 시)
// ========================================
const ResultPage = () => {
  const { orderId } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [orderData, setOrderData] = useState(null);
  const [productKey, setProductKey] = useState('saju');

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .eq('id', orderId)
          .single();

        if (error) throw error;
        if (!data) throw new Error('주문을 찾을 수 없습니다');

        setOrderData(data);
        setProductKey(getProductKeyById(data.product_id));
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

  return (
    <SummaryView 
      config={config} 
      theme={theme} 
      formData={formData} 
      result={result}
      onBack={null}
    />
  );
};

// ========================================
// 메인 상품 컴포넌트
// ========================================
const ProductPage = ({ productKey }) => {
  const config = PRODUCTS[productKey];
  const theme = config.theme;
  
  const [step, setStep] = useState('form');
  const [formData, setFormData] = useState({
    name: '', dob: '', dob_year: '', dob_month: '', dob_day: '',
    birth_time: '', gender: 'male', email: ''
  });
  const [orderId, setOrderId] = useState(null);
  const [result, setResult] = useState(null);
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('');

  useEffect(() => {
    if (!orderId || step !== 'loading') return;

    const interval = setInterval(async () => {
      const { data } = await supabase
        .from('orders')
        .select('status, ai_response, pdf_url, notion_url')
        .eq('id', orderId)
        .single();

      if (data?.status === 'completed') {
        clearInterval(interval);
        setResult({ pdfUrl: data.pdf_url, notionUrl: data.notion_url, aiResponse: data.ai_response });
        setProgress(100);
        setTimeout(() => setStep('result'), 500);
      }
    }, 3000);

    const progressInterval = setInterval(() => {
      setProgress(prev => prev >= 90 ? prev : prev + Math.random() * 5);
    }, 2000);

    const messageInterval = setInterval(() => {
      setStatusText(config.statusMessages[Math.floor(Math.random() * config.statusMessages.length)]);
    }, 4000);
    setStatusText(config.statusMessages[0]);

    return () => {
      clearInterval(interval);
      clearInterval(progressInterval);
      clearInterval(messageInterval);
    };
  }, [orderId, step]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { data, error } = await supabase
      .from('orders')
      .insert({ product_id: config.product_id, input_data: formData, status: 'pending' })
      .select()
      .single();

    if (error) {
      alert('오류가 발생했습니다: ' + error.message);
      return;
    }
    setOrderId(data.id);
    setStep('submitted');
  };

  const handleWaitHere = () => {
    setStep('loading');
    setProgress(5);
  };

  const resetForm = () => {
    setStep('form');
    setFormData({ name: '', dob: '', dob_year: '', dob_month: '', dob_day: '', birth_time: '', gender: 'male', email: '' });
    setOrderId(null);
    setResult(null);
    setProgress(0);
  };

  const Copyright = () => (
    <p className={`text-center ${theme.text.muted} text-xs mt-8`}>
      © 2025 OZ Fortune. All rights reserved.
    </p>
  );

  // ========== 입력 폼 ==========
  if (step === 'form') {
    return (
      <div className={`min-h-screen bg-gradient-to-br ${theme.bg} flex items-center justify-center p-4`}>
        <div className={`${theme.card} backdrop-blur-lg rounded-3xl p-8 w-full max-w-md border shadow-2xl`}>
          <div className="text-center mb-8">
            <div className="text-5xl mb-4">{config.icon}</div>
            <h1 className={`text-3xl font-bold ${theme.text.primary} mb-2`}>{config.title}</h1>
            <p className={theme.text.secondary}>{config.subtitle}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className={`block ${theme.text.secondary} text-sm mb-2`}>이름</label>
              <input
                type="text" required value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className={`w-full px-4 py-3 rounded-xl ${theme.input} border focus:outline-none focus:ring-2`}
                placeholder="홍길동"
              />
            </div>

            <div>
              <label className={`block ${theme.text.secondary} text-sm mb-2`}>생년월일</label>
              <div className="flex gap-2">
                <select required value={formData.dob_year || ''}
                  onChange={(e) => setFormData({...formData, dob_year: e.target.value, dob: `${e.target.value}-${formData.dob_month || '01'}-${formData.dob_day || '01'}`})}
                  className={`flex-1 px-3 py-3 rounded-xl ${theme.input} border focus:outline-none focus:ring-2`}
                >
                  <option value="" className={theme.select}>년도</option>
                  {Array.from({length: 85}, (_, i) => 2010 - i).map(year => (
                    <option key={year} value={year} className={theme.select}>{year}년</option>
                  ))}
                </select>
                <select required value={formData.dob_month || ''}
                  onChange={(e) => setFormData({...formData, dob_month: e.target.value, dob: `${formData.dob_year || '1990'}-${e.target.value}-${formData.dob_day || '01'}`})}
                  className={`w-24 px-3 py-3 rounded-xl ${theme.input} border focus:outline-none focus:ring-2`}
                >
                  <option value="" className={theme.select}>월</option>
                  {Array.from({length: 12}, (_, i) => String(i + 1).padStart(2, '0')).map(month => (
                    <option key={month} value={month} className={theme.select}>{parseInt(month)}월</option>
                  ))}
                </select>
                <select required value={formData.dob_day || ''}
                  onChange={(e) => setFormData({...formData, dob_day: e.target.value, dob: `${formData.dob_year || '1990'}-${formData.dob_month || '01'}-${e.target.value}`})}
                  className={`w-24 px-3 py-3 rounded-xl ${theme.input} border focus:outline-none focus:ring-2`}
                >
                  <option value="" className={theme.select}>일</option>
                  {Array.from({length: 31}, (_, i) => String(i + 1).padStart(2, '0')).map(day => (
                    <option key={day} value={day} className={theme.select}>{parseInt(day)}일</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className={`block ${theme.text.secondary} text-sm mb-2`}>태어난 시간 (선택)</label>
              <select value={formData.birth_time}
                onChange={(e) => setFormData({...formData, birth_time: e.target.value})}
                className={`w-full px-4 py-3 rounded-xl ${theme.input} border focus:outline-none focus:ring-2`}
              >
                <option value="" className={theme.select}>모름</option>
                {['자시(23:00-01:00)', '축시(01:00-03:00)', '인시(03:00-05:00)', '묘시(05:00-07:00)',
                  '진시(07:00-09:00)', '사시(09:00-11:00)', '오시(11:00-13:00)', '미시(13:00-15:00)',
                  '신시(15:00-17:00)', '유시(17:00-19:00)', '술시(19:00-21:00)', '해시(21:00-23:00)'
                ].map(time => (
                  <option key={time} value={time} className={theme.select}>{time}</option>
                ))}
              </select>
            </div>

            <div>
              <label className={`block ${theme.text.secondary} text-sm mb-2`}>성별</label>
              <div className="flex gap-4">
                {['male', 'female'].map(g => (
                  <label key={g} className="flex-1">
                    <input type="radio" name="gender" value={g} checked={formData.gender === g}
                      onChange={(e) => setFormData({...formData, gender: e.target.value})} className="sr-only" />
                    <div className={`py-3 rounded-xl text-center cursor-pointer transition-all ${
                      formData.gender === g 
                        ? `bg-gradient-to-r ${theme.button} text-white` 
                        : `${theme.input} border ${theme.text.secondary}`
                    }`}>
                      {g === 'male' ? '남성' : '여성'}
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className={`block ${theme.text.secondary} text-sm mb-2`}>이메일</label>
              <input type="email" required value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className={`w-full px-4 py-3 rounded-xl ${theme.input} border focus:outline-none focus:ring-2`}
                placeholder="example@email.com"
              />
            </div>

            <button type="submit"
              className={`w-full py-4 rounded-xl bg-gradient-to-r ${theme.button} font-bold text-lg transition-all transform hover:scale-[1.02] shadow-lg`}
            >
              {config.icon} {config.buttonText}
            </button>
          </form>
          <Copyright />
        </div>
      </div>
    );
  }

  // ========== 접수 완료 ==========
  if (step === 'submitted') {
    return (
      <div className={`min-h-screen bg-gradient-to-br ${theme.bg} flex items-center justify-center p-4`}>
        <div className={`${theme.card} backdrop-blur-lg rounded-3xl p-8 w-full max-w-md border shadow-2xl text-center`}>
          <div className="text-6xl mb-6">✨</div>
          <h2 className={`text-2xl font-bold ${theme.text.primary} mb-2`}>접수 완료!</h2>
          <p className={`${theme.text.secondary} mb-8`}>{formData.name}님의 분석이 시작되었습니다</p>

          <div className="space-y-4">
            <button onClick={handleWaitHere}
              className={`w-full py-4 rounded-xl bg-gradient-to-r ${theme.button} font-bold transition-all`}
            >
              ⏳ 여기서 기다리기 (약 2분)
            </button>
            <button onClick={() => setStep('form')}
              className={`w-full py-4 rounded-xl ${theme.input} border font-bold transition-all`}
            >
              📧 이메일로 받을게요
            </button>
          </div>

          <p className={`${theme.text.muted} text-sm mt-6`}>분석이 완료되면 이메일로도 발송됩니다</p>
          <Copyright />
        </div>
      </div>
    );
  }

  // ========== 로딩 ==========
  if (step === 'loading') {
    return (
      <div className={`min-h-screen bg-gradient-to-br ${theme.bg} flex items-center justify-center p-4`}>
        <div className={`${theme.card} backdrop-blur-lg rounded-3xl p-8 w-full max-w-md border shadow-2xl text-center`}>
          <div className="text-6xl mb-6 animate-bounce">{config.icon}</div>
          <h2 className={`text-2xl font-bold ${theme.text.primary} mb-4`}>분석 중...</h2>
          
          <div className="mb-6">
            <div className="h-3 bg-black/50 rounded-full overflow-hidden">
              <div className={`h-full bg-gradient-to-r ${theme.score} transition-all duration-500 rounded-full`}
                style={{width: `${progress}%`}} />
            </div>
            <p className={`${theme.text.accent} text-sm mt-2`}>{Math.round(progress)}%</p>
          </div>

          <p className={theme.text.secondary}>{statusText}</p>
          <Copyright />
        </div>
      </div>
    );
  }

  // ========== 요약본 ==========
  if (step === 'summary') {
    return (
      <SummaryView 
        config={config} 
        theme={theme} 
        formData={formData} 
        result={result}
        onBack={() => setStep('result')}
      />
    );
  }

  // ========== 결과 화면 ==========
  if (step === 'result') {
    const ai = result?.aiResponse || {};
    
    return (
      <div className={`min-h-screen bg-gradient-to-br ${theme.bg} flex items-center justify-center p-4`}>
        <div className={`${theme.card} backdrop-blur-lg rounded-3xl p-8 w-full max-w-md border shadow-2xl text-center`}>
          <div className="text-6xl mb-6">🎉</div>
          <h2 className={`text-2xl font-bold ${theme.text.primary} mb-2`}>분석 완료!</h2>
          <p className={`${theme.text.secondary} mb-6`}>{formData.name}님의 분석이 준비되었습니다</p>

          {ai.hooking_ment && (
            <div className={`${theme.card} rounded-2xl p-4 mb-6 border`}>
              <p className={`${theme.text.primary} italic`}>"{ai.hooking_ment}"</p>
            </div>
          )}

          {/* 미리보기 (재물운: 등급+점수 / 일반: 점수만) */}
          <div className="flex justify-center gap-6 mb-6">
            {config.showWealthGrade && ai.wealth_grade && (
              <div className="text-center">
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 shadow-lg`}>
                  <span className="text-2xl font-black text-gray-900">{ai.wealth_grade}</span>
                </div>
                <div className={`${theme.text.accent} text-sm mt-1`}>등급</div>
              </div>
            )}
            {ai.summary_score && (
              <div className="text-center">
                <div className={`text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r ${theme.score}`}>
                  {ai.summary_score}점
                </div>
                <div className={`${theme.text.accent} text-sm`}>종합 점수</div>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <a href={result?.pdfUrl} target="_blank" rel="noopener noreferrer"
              className={`block w-full py-4 rounded-xl bg-gradient-to-r ${theme.button} font-bold text-lg transition-all transform hover:scale-[1.02] shadow-lg`}
            >
              📄 PDF 리포트 다운로드
            </a>

            <button onClick={() => setStep('summary')}
              className={`block w-full py-4 rounded-xl bg-gradient-to-r from-gray-700 to-gray-900 ${theme.text.primary} font-bold text-lg hover:from-gray-600 hover:to-gray-800 transition-all transform hover:scale-[1.02] shadow-lg`}
            >
              📊 요약본 보기
            </button>

            <button onClick={resetForm}
              className={`block w-full py-4 rounded-xl ${theme.input} border font-bold transition-all`}
            >
              🔄 다른 사람 분석하기
            </button>
          </div>

          <p className={`${theme.text.muted} text-sm mt-6`}>📧 이메일로도 리포트가 발송되었습니다</p>
          <Copyright />
        </div>
      </div>
    );
  }
};

// ========================================
// 라우터
// ========================================
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/saju" replace />} />
        <Route path="/saju" element={<ProductPage productKey="saju" />} />
        <Route path="/wealth" element={<ProductPage productKey="wealth" />} />
        <Route path="/result/:orderId" element={<ResultPage />} />
      </Routes>
    </BrowserRouter>
  );
}
