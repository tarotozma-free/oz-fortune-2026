import SajuPillarsChart from '../components/SajuPillarsChart';
import AstroPlanetsChart from '../components/AstroPlanetsChart';
import LifetimeFlowChart from '../components/LifetimeFlowChart';
import GradeBadge from '../components/GradeBadge';

const FullView = ({ config, theme, formData, result, onBack, displayName }) => {
  const ai = result?.aiResponse || {};
  const rawPrescription = ai.lucky_prescription || {};
  // 키 매핑: Gemini가 기존 키(color, number 등)로 반환했을 때도 표시되도록
  const FIELD_ALIASES = {
    wallet_color: ['color'], invest_timing: ['action'], money_item: ['item'], saving_method: ['number'], side_income: ['direction'], money_avoid: ['avoid'],
    charm_color: ['color'], ideal_type: ['item'], date_spot: ['direction'], love_action: ['action'], confession_timing: ['number'], love_avoid: ['avoid'],
    interview_color: ['color'], study_time: ['number'], focus_item: ['item'], exam_routine: ['action'], career_fit: ['direction'], career_avoid: ['avoid'],
    life_color: ['color'], power_stone: ['item', 'stone'], daily_habit: ['action'], yearly_ritual: ['number'], relationship_tip: ['direction'], life_avoid: ['avoid'],
    lucky_color: ['color'], lucky_day: ['day'], ritual: ['action'], element_boost: ['direction'], planet_avoid: ['avoid'],
    wealth_stone: ['stone', 'item'], invest_day: ['day', 'number'], money_ritual: ['action'], abundance_action: ['direction'], wealth_block: ['avoid'],
    charm_style: ['color'], love_stone: ['stone', 'item'], date_day: ['day', 'number'], venus_ritual: ['action'], attract_action: ['direction'], love_block: ['avoid'],
    power_color: ['color'], focus_stone: ['stone', 'item'], study_day: ['day', 'number'], saturn_ritual: ['action'], career_action: ['direction'], career_block: ['avoid'],
    guardian_stone: ['stone', 'item'], power_day: ['day', 'number'], star_ritual: ['action'], soul_mission: ['direction'], karma_avoid: ['avoid'],
    routine: ['action'], season_tip: ['number'],
  };
  const prescription = {};
  for (const field of (config.prescriptionFields || [])) {
    if (rawPrescription[field]) { prescription[field] = rawPrescription[field]; continue; }
    const aliases = FIELD_ALIASES[field] || [];
    for (const alias of aliases) {
      if (rawPrescription[alias]) { prescription[field] = rawPrescription[alias]; break; }
    }
  }
  const analyses = ai.custom_analysis || [];
  const lifeScore = ai.life_score || {};
  const tenYearFortune = ai.ten_year_fortune || [];
  
  // 상품 타입 구분
  const isLove = config.showLoveGrade;
  const isWealth = config.showWealthGrade;
  const isCareer = config.showCareerGrade;
  const isFull = config.showFullGrade;
  
  const grade = isLove ? ai.love_grade : isWealth ? ai.wealth_grade : isCareer ? ai.career_grade : ai.saju_summary?.saju_grade;
  const gradeType = isLove ? 'love' : isWealth ? 'wealth' : isCareer ? 'career' : 'full';

  // 표시할 제목 (displayName 우선, 없으면 config.title)
  const headerTitle = displayName || config.title;

  const Copyright = () => (
    <p className={`text-center ${theme.text.muted} text-xs mt-8 print:hidden`}>
      © 2025 OZ Fortune. All rights reserved.
    </p>
  );

  return (
    <div className={`min-h-screen bg-gradient-to-br ${theme.bg} print:bg-white`}>
      {/* 헤더 (인쇄 시 숨김) */}
      <div className="bg-black/30 backdrop-blur-sm sticky top-0 z-10 border-b border-white/10 print:hidden">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className={`${theme.text.primary} font-bold`}>{config.icon} {formData?.name || '회원'}님의 {headerTitle}</h1>
          <div className="flex gap-2">
            <button onClick={() => window.print()} className={`${theme.text.accent} hover:text-white text-sm px-3 py-1 rounded-lg bg-white/10`}>
              🖨️ 인쇄
            </button>
            {onBack && (
              <button onClick={onBack} className={`${theme.text.accent} hover:text-white text-sm`}>
                ← 돌아가기
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 인쇄용 헤더 */}
      <div className="hidden print:block text-center py-8 border-b-2 border-gray-300">
        <h1 className="text-3xl font-bold text-gray-800">{config.icon} {headerTitle}</h1>
        <p className="text-xl text-gray-600 mt-2">{formData?.name || '회원'}님의 분석 결과</p>
        <p className="text-sm text-gray-400 mt-1">생년월일: {formData?.dob} | 성별: {formData?.gender === 'male' ? '남성' : '여성'}</p>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 print:py-4">
        {/* 후킹 멘트 */}
        {ai.hooking_ment && (
          <div className={`${theme.card} print:bg-gray-100 rounded-2xl p-6 mb-8 border print:border-gray-300`}>
            <p className={`text-xl ${theme.text.primary} print:text-gray-800 text-center italic font-medium`}>
              "{ai.hooking_ment}"
            </p>
          </div>
        )}

        {/* ✦ 빅쓰리 (점성학 전 상품 공통) */}
        {config.isAstro && (ai.sun_sign || ai.visual_data?.sun_sign) && (
          <div className={`${theme.card} print:bg-gray-50 rounded-2xl p-6 mb-8 border print:border-gray-300`}>
            <h2 className={`text-center text-sm ${theme.text.muted} print:text-gray-500 mb-4`}>✦ 나의 출생 차트</h2>
            <div className="grid grid-cols-3 gap-4 text-center">
              {[
                { emoji: '☀️', label: '태양', sign: ai.sun_sign || ai.visual_data?.sun_sign, symbol: ai.sun_sign_symbol || ai.visual_data?.sun_sign_symbol, desc: '본질과 자아' },
                { emoji: '🌙', label: '달', sign: ai.moon_sign || ai.visual_data?.moon_sign, desc: '감정과 무의식' },
                { emoji: '⬆️', label: '상승궁', sign: ai.rising_sign || ai.visual_data?.rising_sign, desc: '첫인상과 이미지' },
              ].map((b, i) => (
                <div key={i} className={`${theme.card} print:bg-white rounded-xl p-4 border print:border-gray-200`}>
                  <div className="text-2xl mb-1">{b.emoji} {b.symbol || ''}</div>
                  <div className={`${theme.text.primary} print:text-gray-800 font-bold`}>{b.sign}</div>
                  <div className={`${theme.text.muted} print:text-gray-500 text-xs mt-1`}>{b.label} — {b.desc}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 🎨 Visual Data - 사주 팔자표 */}
{config.showVisualData && ai.visual_data && !config.isAstro && (
  <div className="mb-6">
    <SajuPillarsChart visualData={ai.visual_data} theme={theme} />
  </div>
)}

{/* 🎨 Visual Data - 점성학 행성 배치표 */}
{config.showVisualData && ai.visual_data && config.isAstro && (
  <div className="mb-6">
    <AstroPlanetsChart visualData={ai.visual_data} theme={theme} />
  </div>
)}


        {/* 등급 + 점수 요약 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {grade && (
            <div className={`${theme.card} print:bg-gray-50 rounded-xl p-4 border print:border-gray-300 text-center`}>
              <GradeBadge grade={grade} type={gradeType} />
            </div>
          )}
          <div className={`${theme.card} print:bg-gray-50 rounded-xl p-4 border print:border-gray-300 text-center`}>
            <div className={`text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r ${theme.score} print:text-gray-800`}>
              {lifeScore.overall || ai.summary_score || 85}점
            </div>
            <div className={`${theme.text.muted} print:text-gray-500 text-sm`}>종합 점수</div>
          </div>
          {ai.peak_period && (
            <div className="bg-green-900/30 print:bg-green-50 rounded-xl p-4 border border-green-500/30 print:border-green-300 text-center">
              <div className="text-green-400 print:text-green-600 font-bold">{ai.peak_period?.age || ai.peak_period}</div>
              <div className="text-green-300/80 print:text-green-500 text-sm">전성기</div>
            </div>
          )}
          {ai.danger_period && (
            <div className="bg-red-900/30 print:bg-red-50 rounded-xl p-4 border border-red-500/30 print:border-red-300 text-center">
              <div className="text-red-400 print:text-red-600 font-bold">{ai.danger_period?.age || ai.danger_period}</div>
              <div className="text-red-300/80 print:text-red-500 text-sm">주의 시기</div>
            </div>
          )}
        </div>

        {/* 🗺️ 커리어 로드맵 타임라인 (전성기/주의시기 있으면) */}
        {(ai.peak_period || ai.danger_period) && (
          <div className={`${theme.card} print:bg-gray-50 rounded-2xl p-6 mb-8 border print:border-gray-300`}>
            <h2 className={`text-lg font-bold ${theme.text.primary} print:text-gray-800 mb-4 text-center`}>🗺️ 나의 인생 로드맵</h2>
            <div className="relative">
              {/* 타임라인 바 */}
              <div className="h-2 rounded-full bg-gray-200 print:bg-gray-300 relative overflow-hidden">
                <div className="absolute left-0 h-full rounded-full bg-gradient-to-r from-amber-400 via-green-400 to-blue-400" style={{ width: '100%', opacity: 0.6 }}></div>
              </div>
              {/* 마커들 */}
              <div className="flex justify-between mt-4 text-center">
                {[
                  ai.danger_period ? { label: '⚠️ 주의', value: ai.danger_period?.age || ai.danger_period, color: 'text-red-500 print:text-red-600', bg: 'bg-red-50 print:bg-red-100 border-red-200' } : null,
                  { label: '📍 현재', value: `${new Date().getFullYear()}년`, color: `${theme.text.accent} print:text-gray-700`, bg: `${theme.card} border-gray-300` },
                  ai.peak_period ? { label: '🌟 전성기', value: ai.peak_period?.age || ai.peak_period, color: 'text-green-500 print:text-green-600', bg: 'bg-green-50 print:bg-green-100 border-green-200' } : null,
                ].filter(Boolean).map((m, i) => (
                  <div key={i} className={`${m.bg} rounded-lg px-3 py-2 border print:border-gray-200 flex-1 mx-1`}>
                    <div className={`${m.color} font-bold text-sm`}>{m.label}</div>
                    <div className={`${theme.text.primary} print:text-gray-800 text-xs mt-1`}>{m.value}</div>
                  </div>
                ))}
              </div>
              {/* 구간 설명 */}
              <div className={`text-center mt-3 ${theme.text.muted} print:text-gray-500 text-xs`}>
                {ai.danger_period && ai.peak_period ? '지금은 인내와 준비의 구간 → 전성기를 향해 기반을 다지세요' : ''}
              </div>
            </div>
          </div>
        )}

        {/* 10년 대운 (있는 경우) */}
        {tenYearFortune.length > 0 && (
          <div className={`${theme.card} print:bg-gray-50 rounded-2xl p-6 mb-8 border print:border-gray-300`}>
            <h2 className={`text-xl font-bold ${theme.text.primary} print:text-gray-800 mb-4`}>📅 향후 10년 대운</h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {tenYearFortune.map((item, i) => (
                <div key={i} className={`${theme.card} print:bg-white rounded-lg p-3 border print:border-gray-200`}>
                  <div className="flex justify-between items-center mb-1">
                    <span className={`${theme.text.primary} print:text-gray-800 font-bold`}>{item.year}</span>
                    <span className={`${theme.text.accent} print:text-gray-600 text-sm`}>{item.score}점</span>
                  </div>
                  <div className={`${theme.text.muted} print:text-gray-500 text-xs`}>{item.keyword}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 상세 분석 목록 */}
        <div className="space-y-6">
          <h2 className={`text-2xl font-bold ${theme.text.primary} print:text-gray-800 mb-4`}>📜 상세 분석</h2>
          
          {analyses.map((item, i) => (
            <div key={i} className={`${theme.card} print:bg-white rounded-2xl p-6 border print:border-gray-300 print:break-inside-avoid`}>
              <h3 className={`text-lg font-bold ${theme.text.primary} print:text-gray-800 mb-2`}>
                {item.topic || `분석 ${i + 1}`}
              </h3>
              {item.hook && (
                <p className={`${theme.text.accent} print:text-gray-600 italic mb-3`}>"{item.hook}"</p>
              )}
              <div className={`${theme.text.secondary} print:text-gray-700 leading-relaxed whitespace-pre-line`}>
                {item.full_content || item.summary || ''}
              </div>
            </div>
          ))}
        </div>

        {/* 개운 처방전 (프리미엄) */}
        {Object.keys(prescription).length > 0 && (
          <div className={`${theme.card} print:bg-gray-50 rounded-2xl p-6 mt-8 border print:border-gray-300`}>
            <h2 className={`text-xl font-bold ${theme.text.primary} print:text-gray-800 mb-1 text-center`}>{config.prescriptionTitle}</h2>
            {rawPrescription.detail_reason && (
              <p className={`${theme.text.muted} print:text-gray-500 text-xs text-center mb-4`}>📋 {rawPrescription.detail_reason}</p>
            )}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {config.prescriptionFields?.map(field => (
                prescription[field] && (
                  <div key={field} className={`${theme.card} print:bg-white rounded-xl p-4 border print:border-gray-200`}>
                    <div className={`${theme.text.accent} print:text-gray-600 text-sm font-semibold mb-1`}>
                      {config.prescriptionLabels?.[field] || field}
                    </div>
                    <div className={`${theme.text.primary} print:text-gray-800 font-medium leading-relaxed text-sm`}>
                      {prescription[field]}
                    </div>
                  </div>
                )
              ))}
            </div>
            {/* 실천 체크리스트 */}
            <div className="mt-5 pt-4 border-t print:border-gray-200" style={{ borderTopStyle: 'dashed' }}>
              <p className={`${theme.text.muted} print:text-gray-500 text-xs mb-2`}>✅ 실천 체크리스트</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {config.prescriptionFields?.slice(0, 4).map(field => (
                  prescription[field] && (
                    <label key={`chk-${field}`} className="flex items-start gap-2 cursor-pointer print:cursor-default">
                      <input type="checkbox" className="mt-1 print:hidden" />
                      <span className={`${theme.text.secondary} print:text-gray-600 text-xs leading-relaxed`}>
                        □ {config.prescriptionLabels?.[field]}: {typeof prescription[field] === 'string' ? prescription[field].split(',')[0].split('(')[0].trim() : prescription[field]}
                      </span>
                    </label>
                  )
                ))}
                <label className="flex items-start gap-2">
                  <span className={`${theme.text.muted} print:text-gray-400 text-xs italic`}>□ 나만의 긍정 확언 적어보기: _______________</span>
                </label>
                <label className="flex items-start gap-2">
                  <span className={`${theme.text.muted} print:text-gray-400 text-xs italic`}>□ 올해 꼭 이루고 싶은 한 가지: _______________</span>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* 마무리 메시지 */}
        {ai.final_message && (
          <div className={`${theme.card} print:bg-gray-100 rounded-2xl p-6 mt-8 border print:border-gray-300`}>
            <h2 className={`text-xl font-bold ${theme.text.primary} print:text-gray-800 mb-4`}>💌 마무리 메시지</h2>
            <p className={`${theme.text.secondary} print:text-gray-700 leading-relaxed whitespace-pre-line`}>
              {ai.final_message}
            </p>
            {ai.final_hook && (
              <p className={`${theme.text.accent} print:text-gray-600 italic mt-4 text-center font-medium`}>
                "{ai.final_hook}"
              </p>
            )}
          </div>
        )}

        {/* 인쇄 버튼 */}
        <button onClick={() => window.print()}
          className={`block w-full py-4 rounded-xl bg-gradient-to-r ${theme.button} font-bold text-center transition-all mt-8 print:hidden`}
        >
          🖨️ 인쇄 / PDF 저장
        </button>

        {onBack && (
          <button onClick={onBack}
            className={`block w-full py-3 rounded-xl ${theme.input} border font-medium transition-all mt-4 print:hidden`}
          >
            ← 돌아가기
          </button>
        )}

        <Copyright />
      </div>

      {/* 인쇄용 CSS */}
      <style>{`
        @media print {
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .print\\:hidden { display: none !important; }
          .print\\:block { display: block !important; }
          .print\\:bg-white { background: white !important; }
          .print\\:bg-gray-50 { background: #f9fafb !important; }
          .print\\:bg-gray-100 { background: #f3f4f6 !important; }
          .print\\:text-gray-800 { color: #1f2937 !important; }
          .print\\:text-gray-700 { color: #374151 !important; }
          .print\\:text-gray-600 { color: #4b5563 !important; }
          .print\\:text-gray-500 { color: #6b7280 !important; }
          .print\\:border-gray-300 { border-color: #d1d5db !important; }
          .print\\:break-inside-avoid { break-inside: avoid; }
        }
      `}</style>
    </div>
  );
};


export default FullView;