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
import { CompactFooter } from '../components/Branding';

const ProductPage = ({ productKey }) => {
  const config = PRODUCTS[productKey];
  const theme = config.theme;
  const navigate = useNavigate();
  
  const [step, setStep] = useState('form');
  const [formData, setFormData] = useState({
    name: '', dob: '', dob_year: '', dob_month: '', dob_day: '',
    calendar_type: 'solar',
    birth_time: '', birth_hour: '', birth_minute: '', birth_time_unknown: false, birth_city: '', gender: 'male', email: ''
  });
  const [orderId, setOrderId] = useState(null);
  const [result, setResult] = useState(null);
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('');
  const [displayName, setDisplayName] = useState(config.title);

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
        // 점성학 달력 상품도 전용 결과 페이지로 이동
        if (productKey === 'astro-calendar') {
          navigate(`/astro-calendar/${orderId}`);
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

  const Copyright = () => <CompactFooter />;

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
                        ? `bg-gradient-to-r ${theme.button}` 
                        : `${theme.input} border ${theme.text.secondary}`
                    }`}>
                      {cal === 'solar' ? '☀️ 양력' : '🌙 음력'}
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className={`block ${theme.text.secondary} text-sm mb-2`}>태어난 시간</label>
              <div className="flex gap-2 items-center">
                <select value={formData.birth_hour || ''}
                  onChange={(e) => {
                    const h = e.target.value;
                    const m = formData.birth_minute || '00';
                    setFormData({...formData, birth_hour: h, birth_time: h ? `${h}:${m}` : ''});
                  }}
                  disabled={formData.birth_time_unknown}
                  className={`flex-1 px-3 py-3 rounded-xl ${theme.input} border focus:outline-none focus:ring-2`}
                >
                  <option value="" className={theme.select}>시</option>
                  {Array.from({length: 24}, (_, i) => String(i).padStart(2, '0')).map(h => (
                    <option key={h} value={h} className={theme.select}>{h}시</option>
                  ))}
                </select>
                <select value={formData.birth_minute || ''}
                  onChange={(e) => {
                    const m = e.target.value;
                    const h = formData.birth_hour || '00';
                    setFormData({...formData, birth_minute: m, birth_time: h ? `${h}:${m}` : ''});
                  }}
                  disabled={formData.birth_time_unknown}
                  className={`flex-1 px-3 py-3 rounded-xl ${theme.input} border focus:outline-none focus:ring-2`}
                >
                  <option value="" className={theme.select}>분</option>
                  {['00', '10', '20', '30', '40', '50'].map(m => (
                    <option key={m} value={m} className={theme.select}>{m}분</option>
                  ))}
                </select>
              </div>
              <label className="flex items-center gap-2 mt-2 cursor-pointer">
                <input type="checkbox" checked={formData.birth_time_unknown}
                  onChange={(e) => setFormData({...formData, birth_time_unknown: e.target.checked, birth_time: e.target.checked ? '' : formData.birth_time})}
                  className="rounded" />
                <span className={`${theme.text.muted} text-sm`}>태어난 시간을 모르겠어요</span>
              </label>
            </div>

            {/* 점성학: 태어난 도시 */}
            {config.isAstro && (
              <div>
                <label className={`block ${theme.text.secondary} text-sm mb-2`}>태어난 도시</label>
                <input type="text" value={formData.birth_city}
                  onChange={(e) => setFormData({...formData, birth_city: e.target.value})}
                  className={`w-full px-4 py-3 rounded-xl ${theme.input} border focus:outline-none focus:ring-2`}
                  placeholder="서울 (기본값)"
                />
                <p className={`${theme.text.muted} text-xs mt-1`}>정확한 출생지를 입력하면 더 정밀한 분석이 가능합니다</p>
              </div>
            )}

            <div>
              <label className={`block ${theme.text.secondary} text-sm mb-2`}>성별</label>
              <div className="flex gap-2">
                {['male', 'female'].map(g => (
                  <label key={g} className="flex-1">
                    <input type="radio" name="gender" value={g} checked={formData.gender === g}
                      onChange={(e) => setFormData({...formData, gender: e.target.value})} className="sr-only" />
                    <div className={`py-3 rounded-xl text-center cursor-pointer transition-all ${
                      formData.gender === g 
                        ? `bg-gradient-to-r ${theme.button}` 
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
              className={`w-full py-4 rounded-xl bg-white border border-stone-200 text-stone-600 font-bold transition-all hover:bg-stone-50`}
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
            <div className="h-3 bg-stone-200 rounded-full overflow-hidden">
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
                  <span className="text-2xl font-black text-white">{grade}</span>
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
              className={`block w-full py-4 rounded-xl bg-gradient-to-r ${config.isAstro ? 'from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700' : 'from-[#2C3E6B] to-[#1A2744] hover:from-[#3A4F80] hover:to-[#2C3E6B]'} text-white font-bold text-lg transition-all transform hover:scale-[1.02] shadow-lg`}
            >
              📜 풀버전 보기
            </button>

            <button onClick={resetForm}
              className={`block w-full py-4 rounded-xl bg-white border border-stone-200 text-stone-600 font-bold transition-all hover:bg-stone-50`}
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