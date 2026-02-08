import SajuPillarsChart from '../components/SajuPillarsChart';
import AstroPlanetsChart from '../components/AstroPlanetsChart';
import LifetimeFlowChart from '../components/LifetimeFlowChart';
import GradeBadge from '../components/GradeBadge';

const FullView = ({ config, theme, formData, result, onBack, displayName }) => {
  const ai = result?.aiResponse || {};
  const rawPrescription = ai.lucky_prescription || {};
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
  
  const isLove = config.showLoveGrade;
  const isWealth = config.showWealthGrade;
  const isCareer = config.showCareerGrade;
  const isFull = config.showFullGrade;
  
  const grade = isLove ? ai.love_grade : isWealth ? ai.wealth_grade : isCareer ? ai.career_grade : ai.saju_summary?.saju_grade;
  const gradeType = isLove ? 'love' : isWealth ? 'wealth' : isCareer ? 'career' : 'full';
  const headerTitle = displayName || config.title;

  // VIP 핵심 DNA
  const soulType = ai.soul_type || ai.chart_grade_hook || ai.saju_type || '';
  const typeHook = ai.soul_type_hook || ai.saju_type_hook || '';

  // 10년 대운 그래프
  const hasFlowGraph = tenYearFortune.length >= 3;

  const Copyright = () => (
    <p className={`text-center ${theme.text.muted} text-xs mt-8 print:hidden`}>
      © 2025 OZ Fortune. All rights reserved.
    </p>
  );

  return (
    <div className={`min-h-screen bg-gradient-to-br ${theme.bg} print:bg-white`}>
      {/* 헤더 */}
      <div className="bg-black/30 backdrop-blur-sm sticky top-0 z-10 border-b border-white/10 print:hidden">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className={`${theme.text.primary} font-bold`}>{config.icon} {formData?.name || '회원'}님의 {headerTitle}</h1>
          <div className="flex gap-2">
            <button onClick={() => window.print()} className={`${theme.text.accent} hover:text-white text-sm px-3 py-1 rounded-lg bg-white/10`}>
              🖨️ 인쇄
            </button>
            {onBack && (
              <button onClick={onBack} className={`${theme.text.accent} hover:text-white text-sm`}>← 돌아가기</button>
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

        {/* ═══ ① VIP 핵심 요약 ═══ */}
        {ai.hooking_ment && (
          <div className={`${theme.card} print:bg-gray-100 rounded-2xl p-6 mb-6 border print:border-gray-300`}>
            <p className={`text-xl ${theme.text.primary} print:text-gray-800 text-center italic font-medium leading-relaxed`}>
              "{ai.hooking_ment}"
            </p>
          </div>
        )}

        {/* 나의 DNA 뱃지 */}
        {soulType && (
          <div className="text-center mb-6">
            <span className={`inline-block px-5 py-2.5 rounded-full text-sm font-bold border ${theme.card} print:bg-gray-100 print:border-gray-300`}>
              <span className={`${theme.text.accent} print:text-gray-700`}>
                {config.isAstro ? '✦ ' : '🔮 '}나의 DNA: '{soulType}'
              </span>
            </span>
            {typeHook && (
              <p className={`${theme.text.muted} print:text-gray-500 text-xs mt-2 max-w-md mx-auto`}>{typeHook}</p>
            )}
          </div>
        )}

        {/* ═══ ② 출생 차트 / 팔자표 ═══ */}

        {/* 빅쓰리 (점성학) */}
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

        {/* 사주 팔자표 */}
        {config.showVisualData && ai.visual_data && !config.isAstro && (
          <div className="mb-6"><SajuPillarsChart visualData={ai.visual_data} theme={theme} /></div>
        )}

        {/* 점성학 행성 배치표 */}
        {config.showVisualData && ai.visual_data && config.isAstro && (
          <div className="mb-6"><AstroPlanetsChart visualData={ai.visual_data} theme={theme} /></div>
        )}

        {/* ═══ ③ 등급 + 점수 ═══ */}
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

        {/* ═══ ④ 인생 로드맵 ═══ */}

        {/* 선 그래프 (10년 대운) */}
        {hasFlowGraph && (
          <div className={`${theme.card} print:bg-gray-50 rounded-2xl p-6 mb-6 border print:border-gray-300`}>
            <h2 className={`text-lg font-bold ${theme.text.primary} print:text-gray-800 mb-4 text-center`}>
              📈 {isCareer ? '커리어' : isWealth ? '재물' : isLove ? '연애' : '인생'} 운세 흐름
            </h2>
            <div className="relative w-full overflow-x-auto" style={{ height: '200px' }}>
              <svg viewBox={`0 0 ${Math.max(tenYearFortune.length * 80, 400)} 180`} className="w-full h-full" style={{ minWidth: `${tenYearFortune.length * 70}px` }}>
                {[40, 80, 120].map(y => (
                  <line key={y} x1="0" y1={y} x2={tenYearFortune.length * 80} y2={y} stroke="gray" strokeOpacity="0.15" strokeDasharray="4" />
                ))}
                <defs>
                  <linearGradient id="flowGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#22c55e" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#22c55e" stopOpacity="0.02" />
                  </linearGradient>
                </defs>
                <path
                  d={`M ${tenYearFortune.map((item, i) => `${i * 80 + 40},${160 - (item.score || 50) * 1.5}`).join(' L ')} L ${(tenYearFortune.length - 1) * 80 + 40},170 L 40,170 Z`}
                  fill="url(#flowGrad)"
                />
                <polyline
                  points={tenYearFortune.map((item, i) => `${i * 80 + 40},${160 - (item.score || 50) * 1.5}`).join(' ')}
                  fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round"
                />
                {tenYearFortune.map((item, i) => {
                  const x = i * 80 + 40;
                  const y = 160 - (item.score || 50) * 1.5;
                  const isHigh = (item.score || 50) >= 80;
                  const isLow = (item.score || 50) <= 40;
                  return (
                    <g key={i}>
                      <circle cx={x} cy={y} r={isHigh ? 6 : isLow ? 5 : 4} fill={isHigh ? '#22c55e' : isLow ? '#ef4444' : '#6b7280'} stroke="white" strokeWidth="1.5" />
                      <text x={x} y={y - 12} textAnchor="middle" fontSize="10" fill={isHigh ? '#22c55e' : isLow ? '#ef4444' : '#9ca3af'} fontWeight={isHigh || isLow ? 'bold' : 'normal'}>{item.score}점</text>
                      <text x={x} y="178" textAnchor="middle" fontSize="9" fill="#9ca3af">{item.year}</text>
                    </g>
                  );
                })}
              </svg>
            </div>
            <div className="flex justify-between mt-1 px-2 overflow-x-auto">
              {tenYearFortune.map((item, i) => (
                <div key={i} className="text-center flex-1 min-w-0">
                  <span className={`text-xs truncate block ${(item.score || 50) >= 80 ? 'text-green-400 font-bold' : (item.score || 50) <= 40 ? 'text-red-400' : theme.text.muted} print:text-gray-600`}>
                    {item.keyword}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 타임라인 마커 */}
        {(ai.peak_period || ai.danger_period) && (
          <div className={`${theme.card} print:bg-gray-50 rounded-2xl p-6 mb-8 border print:border-gray-300`}>
            <h2 className={`text-lg font-bold ${theme.text.primary} print:text-gray-800 mb-4 text-center`}>🗺️ 나의 인생 로드맵</h2>
            <div className="relative">
              <div className="h-3 rounded-full bg-gray-700/30 print:bg-gray-200 relative overflow-hidden">
                <div className="absolute h-full rounded-full bg-gradient-to-r from-red-400/60 via-amber-400/60 to-green-400/60" style={{ width: '100%' }}></div>
                <div className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full border-2 border-blue-400 shadow-lg" style={{ left: '40%' }}></div>
              </div>
              <div className="flex justify-between mt-4 text-center">
                {[
                  ai.danger_period ? { label: '⚠️ 주의 구간', value: ai.danger_period?.age || ai.danger_period, color: 'text-red-400 print:text-red-600', bg: 'bg-red-500/10 print:bg-red-50 border-red-500/20 print:border-red-200' } : null,
                  { label: '📍 현재', value: `${new Date().getFullYear()}년`, color: 'text-blue-400 print:text-gray-700', bg: 'bg-blue-500/10 print:bg-blue-50 border-blue-500/20 print:border-blue-200' },
                  ai.peak_period ? { label: '🌟 전성기', value: ai.peak_period?.age || ai.peak_period, color: 'text-green-400 print:text-green-600', bg: 'bg-green-500/10 print:bg-green-50 border-green-500/20 print:border-green-200' } : null,
                ].filter(Boolean).map((m, i) => (
                  <div key={i} className={`${m.bg} rounded-xl px-4 py-3 border flex-1 mx-1`}>
                    <div className={`${m.color} font-bold text-sm`}>{m.label}</div>
                    <div className={`${theme.text.primary} print:text-gray-800 text-xs mt-1 font-medium`}>{m.value}</div>
                  </div>
                ))}
              </div>
              {ai.danger_period && ai.peak_period && (
                <div className={`text-center mt-4 ${theme.text.muted} print:text-gray-500 text-xs italic`}>
                  "지금은 인내와 준비의 구간 → 전성기를 향해 기반을 다지세요"
                </div>
              )}
            </div>
          </div>
        )}

        {/* LifetimeFlowChart (기존 컴포넌트) */}
        {ai.lifetime_flow && (
          <div className="mb-8"><LifetimeFlowChart data={ai.lifetime_flow} theme={theme} /></div>
        )}

        {/* ═══ ⑤ 상세 분석 ═══ */}
        <div className="space-y-6">
          <h2 className={`text-2xl font-bold ${theme.text.primary} print:text-gray-800 mb-4`}>📋 상세 분석</h2>
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
              {/* 분석별 실전 팁 */}
              {item.action_tip && (
                <div className="mt-4 pt-3" style={{ borderTop: '1px dashed rgba(128,128,128,0.3)' }}>
                  <p className={`text-sm ${theme.text.accent} print:text-gray-600`}>
                    💡 <span className="font-semibold">실전 팁:</span> {item.action_tip}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* ═══ ⑥ 개운 처방전 (프리미엄) ═══ */}
        {Object.keys(prescription).length > 0 && (
          <div className={`${theme.card} print:bg-gray-50 rounded-2xl p-6 mt-8 border print:border-gray-300`}>
            <div className="text-center mb-5">
              <h2 className={`text-xl font-bold ${theme.text.primary} print:text-gray-800`}>{config.prescriptionTitle}</h2>
              <p className={`${theme.text.muted} print:text-gray-500 text-xs mt-1`}>— 학술 자문 —</p>
              <p className={`${theme.text.muted} print:text-gray-400 text-xs`}>비영리 OZ Fortune 국제연구소</p>
              {rawPrescription.detail_reason && (
                <p className={`${theme.text.accent} print:text-gray-600 text-xs mt-2 italic`}>📋 {rawPrescription.detail_reason}</p>
              )}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {config.prescriptionFields?.map(field => (
                prescription[field] && (
                  <div key={field} className={`${theme.card} print:bg-white rounded-xl p-4 border print:border-gray-200`}>
                    <div className={`${theme.text.accent} print:text-gray-600 text-sm font-semibold mb-2`}>
                      {config.prescriptionLabels?.[field] || field}
                    </div>
                    <div className={`${theme.text.primary} print:text-gray-800 font-medium leading-relaxed text-sm`}>
                      {prescription[field]}
                    </div>
                  </div>
                )
              ))}
            </div>
            {/* 체크리스트 */}
            <div className="mt-5 pt-4" style={{ borderTop: '1px dashed rgba(128,128,128,0.3)' }}>
              <p className={`${theme.text.muted} print:text-gray-500 text-xs mb-3 font-semibold`}>✅ 실천 체크리스트</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {config.prescriptionFields?.slice(0, 4).map(field => (
                  prescription[field] && (
                    <label key={`chk-${field}`} className="flex items-start gap-2 cursor-pointer print:cursor-default">
                      <input type="checkbox" className="mt-1 accent-green-500 print:hidden" />
                      <span className={`${theme.text.secondary} print:text-gray-600 text-xs leading-relaxed`}>
                        □ {config.prescriptionLabels?.[field]}: {typeof prescription[field] === 'string' ? prescription[field].split(',')[0].split('(')[0].trim() : prescription[field]}
                      </span>
                    </label>
                  )
                ))}
                <label className="flex items-start gap-2">
                  <span className={`${theme.text.muted} print:text-gray-400 text-xs italic`}>□ 나만의 긍정 확언: _______________</span>
                </label>
                <label className="flex items-start gap-2">
                  <span className={`${theme.text.muted} print:text-gray-400 text-xs italic`}>□ 올해 목표: _______________</span>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* ═══ ⑦ 마무리 ═══ */}
        {(ai.final_message || ai.final_advice) && (
          <div className={`${theme.card} print:bg-gray-100 rounded-2xl p-6 mt-8 border print:border-gray-300`}>
            <h2 className={`text-xl font-bold ${theme.text.primary} print:text-gray-800 mb-4`}>💌 마무리 메시지</h2>
            <p className={`${theme.text.secondary} print:text-gray-700 leading-relaxed whitespace-pre-line`}>
              {ai.final_message || ai.final_advice || ''}
            </p>
            {ai.final_hook && (
              <p className={`${theme.text.accent} print:text-gray-600 italic mt-4 text-center font-medium`}>"{ai.final_hook}"</p>
            )}
          </div>
        )}

        <button onClick={() => window.print()}
          className={`block w-full py-4 rounded-xl bg-gradient-to-r ${theme.button} font-bold text-center transition-all mt-8 print:hidden`}
        >🖨️ 인쇄 / PDF 저장</button>

        {onBack && (
          <button onClick={onBack}
            className={`block w-full py-3 rounded-xl ${theme.input} border font-medium transition-all mt-4 print:hidden`}
          >← 돌아가기</button>
        )}

        <Copyright />
      </div>

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
          svg text { fill: #374151 !important; }
        }
      `}</style>
    </div>
  );
};

export default FullView;