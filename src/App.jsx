import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://mwgvdtwxiiluwdxtbqgz.supabase.co',  // g로 수정!
  'eyJhbGci...'
);

export default function App() {
  const [step, setStep] = useState('form');
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
        .select('status, ai_response')
        .eq('id', orderId)
        .single();

      if (data?.status === 'completed') {
        clearInterval(interval);
        const { data: urlData } = supabase.storage
          .from('reports')
          .getPublicUrl(`${orderId}_report.pdf`);
        
        setResult({
          pdfUrl: urlData?.publicUrl,
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
    setStep('loading');
    setProgress(5);

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
      setStep('form');
      return;
    }

    setOrderId(data.id);
  };

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
