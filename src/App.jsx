import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://mwgvdtwxiiluwdxtbqgz.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im13Z3ZkdHd4aWlsdXdkeHRicWd6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg0NDM2NzEsImV4cCI6MjA4NDAxOTY3MX0.XnK-V2r2Sb6Ndqw2HocTmrE2ujOLY-etBqpzD9dOZoo'
);

export default function App() {
  const [step, setStep] = useState('form'); // form, submitted, loading, result, summary
  const [formData, setFormData] = useState({
    name: '',
    dob: '',
    birth_time: '',
    gender: 'male',
    email: ''
  });
  const [orderId, setOrderId] = useState(null);
  const [result, setResult] = useState(null);
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('');

  const statusMessages = [
    '🔮 사주 원국을 분석하고 있습니다...',
    '📊 2026년 운세를 계산하고 있습니다...',
    '✨ 맞춤형 분석을 생성하고 있습니다...',
    '📄 리포트를 제작하고 있습니다...',
    '🎁 마무리 작업 중입니다...'
  ];

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
        setResult({
          pdfUrl: data.pdf_url,
          notionUrl: data.notion_url,
          aiResponse: data.ai_response
        });
        setProgress(100);
        setTimeout(() => setStep('result'), 500);
      }
    }, 3000);

    const progressInterval = setInterval(() => {
      setProgress(prev => prev >= 90 ? prev : prev + Math.random() * 5);
    }, 2000);

    const messageInterval = setInterval(() => {
      setStatusText(statusMessages[Math.floor(Math.random() * statusMessages.length)]);
    }, 4000);
    setStatusText(statusMessages[0]);

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
      .insert({
        product_id: '2026_vip_saju',
        input_data: formData,
        status: 'pending'
      })
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

  // 입력 폼
  if (step === 'form') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 flex items-center justify-center p-4">
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 w-full max-w-md border border-white/20 shadow-2xl">
          <div className="text-center mb-8">
            <div className="text-5xl mb-4">🔮</div>
            <h1 className="text-3xl font-bold text-white mb-2">2026년 VIP 신년운세</h1>
            <p className="text-purple-200">프리미엄 사주 분석 리포트</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-purple-200 text-sm mb-2">이름</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
                placeholder="홍길동"
              />
            </div>

            <div>
              <label className="block text-purple-200 text-sm mb-2">생년월일</label>
              <input
                type="date"
                required
                value={formData.dob}
                onChange={(e) => setFormData({...formData, dob: e.target.value})}
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
            </div>

            <div>
              <label className="block text-purple-200 text-sm mb-2">태어난 시간 (선택)</label>
              <select
                value={formData.birth_time}
                onChange={(e) => setFormData({...formData, birth_time: e.target.value})}
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
              >
                <option value="" className="bg-gray-800">모름</option>
                <option value="자시(23:00-01:00)" className="bg-gray-800">자시 (23:00-01:00)</option>
                <option value="축시(01:00-03:00)" className="bg-gray-800">축시 (01:00-03:00)</option>
                <option value="인시(03:00-05:00)" className="bg-gray-800">인시 (03:00-05:00)</option>
                <option value="묘시(05:00-07:00)" className="bg-gray-800">묘시 (05:00-07:00)</option>
                <option value="진시(07:00-09:00)" className="bg-gray-800">진시 (07:00-09:00)</option>
                <option value="사시(09:00-11:00)" className="bg-gray-800">사시 (09:00-11:00)</option>
                <option value="오시(11:00-13:00)" className="bg-gray-800">오시 (11:00-13:00)</option>
                <option value="미시(13:00-15:00)" className="bg-gray-800">미시 (13:00-15:00)</option>
                <option value="신시(15:00-17:00)" className="bg-gray-800">신시 (15:00-17:00)</option>
                <option value="유시(17:00-19:00)" className="bg-gray-800">유시 (17:00-19:00)</option>
                <option value="술시(19:00-21:00)" className="bg-gray-800">술시 (19:00-21:00)</option>
                <option value="해시(21:00-23:00)" className="bg-gray-800">해시 (21:00-23:00)</option>
              </select>
            </div>

            <div>
              <label className="block text-purple-200 text-sm mb-2">성별</label>
              <div className="flex gap-4">
                <label className="flex-1">
                  <input
                    type="radio"
                    name="gender"
                    value="male"
                    checked={formData.gender === 'male'}
                    onChange={(e) => setFormData({...formData, gender: e.target.value})}
                    className="sr-only peer"
                  />
                  <div className="px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-center text-white cursor-pointer peer-checked:bg-purple-500 peer-checked:border-purple-400 transition-all">
                    👨 남성
                  </div>
                </label>
                <label className="flex-1">
                  <input
                    type="radio"
                    name="gender"
                    value="female"
                    checked={formData.gender === 'female'}
                    onChange={(e) => setFormData({...formData, gender: e.target.value})}
                    className="sr-only peer"
                  />
                  <div className="px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-center text-white cursor-pointer peer-checked:bg-purple-500 peer-checked:border-purple-400 transition-all">
                    👩 여성
                  </div>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-purple-200 text-sm mb-2">이메일 (리포트 발송)</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
                placeholder="email@example.com"
              />
            </div>

            <button
              type="submit"
              className="w-full py-4 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold text-lg hover:from-purple-600 hover:to-pink-600 transition-all transform hover:scale-[1.02] shadow-lg"
            >
              🔮 운세 분석 시작하기
            </button>
          </form>

          <p className="text-center text-purple-300 text-sm mt-6">
            분석에는 약 1분 정도 소요됩니다
          </p>
        </div>
      </div>
    );
  }

  // 접수 완료 - 선택 화면
  if (step === 'submitted') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 flex items-center justify-center p-4">
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 w-full max-w-md border border-white/20 shadow-2xl text-center">
          <div className="text-6xl mb-6">✅</div>
          <h2 className="text-2xl font-bold text-white mb-2">주문 접수 완료!</h2>
          <p className="text-purple-200 mb-2">{formData.name}님의 운세 분석이 시작되었습니다</p>
          <p className="text-purple-300 text-sm mb-8">약 1분 후 <strong>{formData.email}</strong>로 발송됩니다</p>

          <div className="space-y-4">
            <button
              onClick={handleWaitHere}
              className="block w-full py-4 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold text-lg hover:from-purple-600 hover:to-pink-600 transition-all transform hover:scale-[1.02] shadow-lg"
            >
              ⏳ 여기서 결과 기다리기
            </button>

            <button
              onClick={() => {
                setStep('form');
                setFormData({ name: '', dob: '', birth_time: '', gender: 'male', email: '' });
                setOrderId(null);
              }}
              className="block w-full py-4 rounded-xl bg-white/10 border border-white/20 text-white font-bold hover:bg-white/20 transition-all"
            >
              📧 이메일로 받을게요 (창 닫기)
            </button>
          </div>

          <p className="text-purple-400 text-xs mt-6">
            💡 창을 닫아도 분석은 계속 진행되며, 완료 시 이메일로 발송됩니다
          </p>
        </div>
      </div>
    );
  }

  // 로딩 화면
  if (step === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 flex items-center justify-center p-4">
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 w-full max-w-md border border-white/20 shadow-2xl text-center">
          <div className="text-6xl mb-6 animate-pulse">🔮</div>
          <h2 className="text-2xl font-bold text-white mb-4">분석 중...</h2>
          <p className="text-purple-200 mb-8">{statusText}</p>

          <div className="w-full bg-white/10 rounded-full h-3 mb-4 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-1000"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-purple-300 text-sm">{Math.round(progress)}% 완료</p>

          <div className="mt-8 flex justify-center gap-2">
            <div className="w-3 h-3 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
            <div className="w-3 h-3 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
            <div className="w-3 h-3 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
          </div>

          <p className="text-purple-300 text-xs mt-6">
            잠시만 기다려주세요. 정확한 분석을 위해 최선을 다하고 있습니다.
          </p>
        </div>
      </div>
    );
  }

  // 요약본 페이지
  if (step === 'summary') {
    const ai = result?.aiResponse || {};
    const analyses = ai.custom_analysis_10 || [];
    const luck = ai.lucky_prescription || {};
    const graphs = ai.graphs || {};

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        {/* 헤더 */}
        <div className="bg-black/30 backdrop-blur-sm sticky top-0 z-10 border-b border-white/10">
          <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
            <h1 className="text-white font-bold">🔮 {formData.name}님의 2026년 운세</h1>
            <button
              onClick={() => setStep('result')}
              className="text-purple-300 hover:text-white text-sm"
            >
              ← 돌아가기
            </button>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* 훅킹 멘트 */}
          {ai.hooking_ment && (
            <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl p-6 mb-8 border border-purple-500/30">
              <p className="text-xl text-white text-center italic">"{ai.hooking_ment}"</p>
            </div>
          )}

          {/* 종합 점수 */}
          <div className="bg-white/5 rounded-2xl p-8 mb-8 text-center border border-white/10">
            <div className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500 mb-2">
              {ai.summary_score || 85}점
            </div>
            <p className="text-purple-300">2026년 종합운</p>
          </div>

          {/* 운세 지표 */}
          <div className="grid grid-cols-5 gap-4 mb-8">
            {[
              { label: '재물', value: graphs.wealth || 80, emoji: '💰' },
              { label: '애정', value: graphs.love || 80, emoji: '💕' },
              { label: '직업', value: graphs.career || 80, emoji: '💼' },
              { label: '건강', value: graphs.health || 80, emoji: '🏃' },
              { label: '사회', value: graphs.social || 80, emoji: '🤝' },
            ].map((item, i) => (
              <div key={i} className="bg-white/5 rounded-xl p-4 text-center border border-white/10">
                <div className="text-2xl mb-1">{item.emoji}</div>
                <div className="text-white font-bold">{item.value}</div>
                <div className="text-purple-300 text-xs">{item.label}</div>
              </div>
            ))}
          </div>

          {/* 총평 */}
          {ai.summary_text && (
            <div className="bg-white/5 rounded-2xl p-6 mb-8 border border-white/10">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                📜 총평
              </h2>
              <p className="text-purple-100 leading-relaxed whitespace-pre-line">{ai.summary_text}</p>
            </div>
          )}

          {/* 소주제 10개 */}
          <div className="space-y-4 mb-8">
            <h2 className="text-xl font-bold text-white mb-4">🔮 상세 분석</h2>
            {analyses.map((item, i) => (
              <details key={i} className="bg-white/5 rounded-xl border border-white/10 overflow-hidden group">
                <summary className="px-6 py-4 cursor-pointer text-white font-medium hover:bg-white/5 transition-all flex justify-between items-center">
                  <span>{item.topic || `분석 ${i + 1}`}</span>
                  <span className="text-purple-400 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <div className="px-6 py-4 border-t border-white/10">
                  <p className="text-purple-100 leading-relaxed whitespace-pre-line">
                    {item.full_content || item.summary || ''}
                  </p>
                </div>
              </details>
            ))}
          </div>

          {/* 개운 처방전 */}
          <div className="bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-2xl p-6 mb-8 border border-emerald-500/30">
            <h2 className="text-xl font-bold text-white mb-4">🍀 개운 처방전</h2>
            <div className="grid grid-cols-2 gap-4">
              {luck.color && (
                <div className="bg-white/10 rounded-xl p-4">
                  <div className="text-sm text-emerald-300 mb-1">행운의 색상</div>
                  <div className="text-white font-medium">🎨 {luck.color}</div>
                </div>
              )}
              {luck.number && (
                <div className="bg-white/10 rounded-xl p-4">
                  <div className="text-sm text-emerald-300 mb-1">행운의 숫자</div>
                  <div className="text-white font-medium">🔢 {luck.number}</div>
                </div>
              )}
              {luck.direction && (
                <div className="bg-white/10 rounded-xl p-4">
                  <div className="text-sm text-emerald-300 mb-1">행운의 방향</div>
                  <div className="text-white font-medium">🧭 {luck.direction}</div>
                </div>
              )}
              {luck.item && (
                <div className="bg-white/10 rounded-xl p-4">
                  <div className="text-sm text-emerald-300 mb-1">행운의 물건</div>
                  <div className="text-white font-medium">💎 {luck.item}</div>
                </div>
              )}
            </div>
            {luck.action && (
              <div className="mt-4 bg-white/10 rounded-xl p-4">
                <div className="text-sm text-emerald-300 mb-1">운을 여는 행동</div>
                <div className="text-white">{luck.action}</div>
              </div>
            )}
          </div>

          {/* 마무리 조언 */}
          {ai.final_advice && (
            <div className="bg-white/5 rounded-2xl p-6 mb-8 border border-white/10">
              <h2 className="text-xl font-bold text-white mb-4">💫 마무리 조언</h2>
              <p className="text-purple-100 leading-relaxed whitespace-pre-line">{ai.final_advice}</p>
            </div>
          )}

          {/* 하단 버튼 */}
          <div className="flex gap-4">
            <a
              href={result?.pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-4 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold text-center hover:from-purple-600 hover:to-pink-600 transition-all"
            >
              📄 PDF 다운로드
            </a>
            <button
              onClick={() => setStep('result')}
              className="flex-1 py-4 rounded-xl bg-white/10 border border-white/20 text-white font-bold hover:bg-white/20 transition-all"
            >
              ← 돌아가기
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 결과 화면
  if (step === 'result') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 flex items-center justify-center p-4">
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 w-full max-w-md border border-white/20 shadow-2xl text-center">
          <div className="text-6xl mb-6">🎉</div>
          <h2 className="text-2xl font-bold text-white mb-2">분석 완료!</h2>
          <p className="text-purple-200 mb-8">{formData.name}님의 2026년 운세가 준비되었습니다</p>

          {result?.aiResponse?.hooking_ment && (
            <div className="bg-white/10 rounded-2xl p-4 mb-6 border border-white/10">
              <p className="text-white italic">"{result.aiResponse.hooking_ment}"</p>
            </div>
          )}

          {result?.aiResponse?.summary_score && (
            <div className="mb-8">
              <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
                {result.aiResponse.summary_score}점
              </div>
              <p className="text-purple-300 text-sm">2026년 종합운</p>
            </div>
          )}

          <div className="space-y-4">
            <a
              href={result?.pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full py-4 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold text-lg hover:from-purple-600 hover:to-pink-600 transition-all transform hover:scale-[1.02] shadow-lg"
            >
              📄 PDF 리포트 다운로드
            </a>

            <button
              onClick={() => setStep('summary')}
              className="block w-full py-4 rounded-xl bg-gradient-to-r from-gray-700 to-gray-900 text-white font-bold text-lg hover:from-gray-800 hover:to-black transition-all transform hover:scale-[1.02] shadow-lg"
            >
              📝 요약본 보기
            </button>

            <button
              onClick={() => {
                setStep('form');
                setFormData({ name: '', dob: '', birth_time: '', gender: 'male', email: '' });
                setOrderId(null);
                setResult(null);
                setProgress(0);
              }}
              className="block w-full py-4 rounded-xl bg-white/10 border border-white/20 text-white font-bold hover:bg-white/20 transition-all"
            >
              🔄 다른 사람 분석하기
            </button>
          </div>

          <p className="text-purple-300 text-sm mt-6">
            📧 이메일로도 리포트가 발송되었습니다
          </p>
        </div>
      </div>
    );
  }
}
