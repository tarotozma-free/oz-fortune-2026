import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { PRODUCTS } from '../config/products';
import SajuPillarsChart from '../components/SajuPillarsChart';
import AstroPlanetsChart from '../components/AstroPlanetsChart';
import LifetimeFlowChart from '../components/LifetimeFlowChart';
import GradeBadge from '../components/GradeBadge';
import SummaryView from '../components/SummaryView';
import FullView from '../components/FullView';

const ProductPage = ({ productKey }) => {
  const config = PRODUCTS[productKey];
  const theme = config.theme;
  const navigate = useNavigate();
  
  const [step, setStep] = useState('form');
  const [formData, setFormData] = useState({
    name: '', dob: '', dob_year: '', dob_month: '', dob_day: '',
    calendar_type: 'solar', // 'solar' = 양력, 'lunar' = 음력
    birth_time: '', birth_hour: '', birth_minute: '', birth_time_unknown: false, birth_city: '', gender: 'male', email: ''
  });
  const [orderId, setOrderId] = useState(null);
  const [result, setResult] = useState(null);
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('');
  const [displayName, setDisplayName] = useState(config.title); // DB에서 가져올 display_name

  // 페이지 로드 시 DB에서 display_name 가져오기
  useEffect(() => {
    const fetchDisplayName = async () => {
      try {
        const { data } = await supabase
          .from('products')
          .select('display_name, name')
          .eq('id', config.product_id)
          .single();
        
        if (data?.display_name) {
          setDisplayName(data.display_name);
        } else if (data?.name) {
          setDisplayName(data.name);
        }
      } catch (err) {
        console.log('display_name 로드 실패, 기본값 사용');
      }
    };
    fetchDisplayName();
  }, [config.product_id]);

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
        // 달력 상품은 전용 결과 페이지로 이동
        if (productKey === 'calendar') {
          navigate(`/calendar/${orderId}`);
          return;
        }
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
    // 점성학 상품인데 도시 입력 안했으면 서울로 기본값
    const submitData = {
      ...formData,
      birth_city: formData.birth_city || '서울'
    };
    const { data, error } = await supabase
      .from('orders')
      .insert({ product_id: config.product_id, input_data: submitData, status: 'pending' })
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
    setFormData({ name: '', dob: '', dob_year: '', dob_month: '', dob_day: '', calendar_type: 'solar', birth_time: '', birth_hour: '', birth_minute: '', birth_time_unknown: false, birth_city: '', gender: 'male', email: '' });
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
            <h1 className={`text-3xl font-bold ${theme.text.primary} mb-2`}>{displayName}</h1>
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
              {/* 양력/음력 선택 */}
              <div className="flex gap-2 mt-2">
                {['solar', 'lunar'].map(cal => (
                  <label key={cal} className="flex-1">
                    <input type="radio" name="calendar_type" value={cal} checked={formData.calendar_type === cal}
                      onChange={(e) => setFormData({...formData, calendar_type: e.target.value})} className="sr-only" />
                    <div className={`py-2 rounded-lg text-center text-sm cursor-pointer transition-all ${
                      formData.calendar_type === cal 
                        ? `bg-gradient-to-r ${theme.button} text-white` 
                        : `${theme.input} border ${theme.text.muted}`
                    }`}>
                      {cal === 'solar' ? '☀️ 양력' : '🌙 음력'}
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className={`block ${theme.text.secondary} text-sm mb-2`}>
                태어난 시간 {config.isAstro ? '(24시간 기준, 정확히 입력!)' : '(선택)'}
              </label>
              
              {/* 점성학: 시/분 직접 입력 */}
              {config.isAstro ? (
                <div>
                  {/* 모름 체크박스 */}
                  <label className="flex items-center gap-2 mb-2 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={formData.birth_time_unknown || false}
                      onChange={(e) => setFormData({
                        ...formData, 
                        birth_time_unknown: e.target.checked,
                        birth_hour: e.target.checked ? '12' : '',
                        birth_minute: e.target.checked ? '0' : ''
                      })}
                      className="w-4 h-4 rounded"
                    />
                    <span className={`text-sm ${theme.text.muted}`}>정확한 출생 시간을 모름 (정오 12시로 계산)</span>
                  </label>
                  
                  {/* 시/분 선택 (모름 체크 안했을 때만 활성화) */}
                  <div className={`flex gap-2 ${formData.birth_time_unknown ? 'opacity-50 pointer-events-none' : ''}`}>
                    <select value={formData.birth_hour || ''}
                      onChange={(e) => setFormData({...formData, birth_hour: e.target.value})}
                      className={`flex-1 px-3 py-3 rounded-xl ${theme.input} border focus:outline-none focus:ring-2`}
                      disabled={formData.birth_time_unknown}
                    >
                      <option value="" className={theme.select}>시</option>
                      {Array.from({length: 24}, (_, i) => (
                        <option key={i} value={String(i)} className={theme.select}>
                          {i < 10 ? `0${i}` : i}시
                        </option>
                      ))}
                    </select>
                    <select value={formData.birth_minute || ''}
                      onChange={(e) => setFormData({...formData, birth_minute: e.target.value})}
                      className={`flex-1 px-3 py-3 rounded-xl ${theme.input} border focus:outline-none focus:ring-2`}
                      disabled={formData.birth_time_unknown}
                    >
                      <option value="" className={theme.select}>분</option>
                      {[0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55].map(m => (
                        <option key={m} value={String(m)} className={theme.select}>
                          {m < 10 ? `0${m}` : m}분
                        </option>
                      ))}
                    </select>
                  </div>
                  {!formData.birth_time_unknown && (
                    <p className={`text-xs ${theme.text.muted} mt-1`}>
                      예: 오전 11시 30분 → 11시 30분 / 오후 3시 → 15시 00분
                    </p>
                  )}
                </div>
              ) : (
                /* 사주: 기존 시지 선택 */
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
              )}
            </div>

            {/* 점성학 상품일 때만 출생 도시 입력 */}
            {config.isAstro && (
              <div>
                <label className={`block ${theme.text.secondary} text-sm mb-2`}>태어난 도시 (선택)</label>
                <input
                  type="text" value={formData.birth_city}
                  onChange={(e) => setFormData({...formData, birth_city: e.target.value})}
                  className={`w-full px-4 py-3 rounded-xl ${theme.input} border focus:outline-none focus:ring-2`}
                  placeholder="미입력시 서울로 설정"
                />
              </div>
            )}

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
        displayName={displayName}
        onBack={() => setStep('result')}
      />
    );
  }

  // ========== 풀버전 ==========
  if (step === 'fullview') {
    return (
      <FullView 
        config={config} 
        theme={theme} 
        formData={formData} 
        result={result}
        displayName={displayName}
        onBack={() => setStep('result')}
      />
    );
  }

  // ========== 결과 화면 ==========
  if (step === 'result') {
    const ai = result?.aiResponse || {};
    const isLove = config.showLoveGrade;
    const isWealth = config.showWealthGrade;
    const isCareer = config.showCareerGrade;
    const isFull = config.showFullGrade;
    const grade = isLove ? ai.love_grade : isWealth ? ai.wealth_grade : isCareer ? ai.career_grade : (ai.saju_grade || ai.saju_summary?.saju_grade);
    const overallScore = ai.life_score?.overall || ai.summary_score;
    
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

          {/* 미리보기 (등급+점수) */}
          <div className="flex justify-center gap-6 mb-6">
            {(isWealth || isLove || isCareer || isFull) && grade && (
              <div className="text-center">
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br ${isLove ? 'from-pink-400 to-rose-500' : isCareer ? 'from-blue-400 to-indigo-500' : isFull ? 'from-violet-400 to-purple-500' : 'from-yellow-400 to-amber-500'} shadow-lg`}>
                  <span className="text-2xl font-black text-gray-900">{grade}</span>
                </div>
                <div className={`${theme.text.accent} text-sm mt-1`}>등급</div>
              </div>
            )}
            {overallScore && (
              <div className="text-center">
                <div className={`text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r ${theme.score}`}>
                  {overallScore}점
                </div>
                <div className={`${theme.text.accent} text-sm`}>종합 점수</div>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <button onClick={() => setStep('summary')}
              className={`block w-full py-4 rounded-xl bg-gradient-to-r ${theme.button} font-bold text-lg transition-all transform hover:scale-[1.02] shadow-lg`}
            >
              📊 요약본 보기
            </button>

            <button onClick={() => setStep('fullview')}
              className={`block w-full py-4 rounded-xl bg-gradient-to-r from-gray-700 to-gray-900 ${theme.text.primary} font-bold text-lg hover:from-gray-600 hover:to-gray-800 transition-all transform hover:scale-[1.02] shadow-lg`}
            >
              📜 풀버전 보기
            </button>

            <button onClick={resetForm}
              className={`block w-full py-4 rounded-xl ${theme.input} border font-bold transition-all`}
            >
              🔄 다른 사람 분석하기
            </button>
          </div>

          <p className={`${theme.text.muted} text-sm mt-6`}>📧 이메일로도 결과 링크가 발송되었습니다</p>
          <Copyright />
        </div>
      </div>
    );
  }
};

export default ProductPage;