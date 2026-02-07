import SajuPillarsChart from '../components/SajuPillarsChart';
import AstroPlanetsChart from '../components/AstroPlanetsChart';
import LifetimeFlowChart from '../components/LifetimeFlowChart';
import GradeBadge from '../components/GradeBadge';
import { CertificationBadge, SectionDivider, Footer } from '../components/Branding';

// ========================================
// 점수 게이지 컴포넌트
// ========================================
const ScoreGauge = ({ score, label, theme }) => {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const progress = ((score || 0) / 100) * circumference;
  return (
    <div className="flex flex-col items-center">
      <svg width="130" height="130" viewBox="0 0 130 130">
        <circle cx="65" cy="65" r={radius} fill="none" stroke="#E8E4DD" strokeWidth="8" />
        <circle cx="65" cy="65" r={radius} fill="none" stroke="url(#scoreGrad)" strokeWidth="8"
          strokeDasharray={circumference} strokeDashoffset={circumference - progress}
          strokeLinecap="round" transform="rotate(-90 65 65)" className="transition-all duration-1000" />
        <defs>
          <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#B8860B" />
            <stop offset="100%" stopColor="#DAA520" />
          </linearGradient>
        </defs>
        <text x="65" y="58" textAnchor="middle" className="fill-stone-800 text-3xl font-bold" style={{ fontSize: '28px' }}>{score || 0}</text>
        <text x="65" y="78" textAnchor="middle" className="fill-stone-400 text-xs" style={{ fontSize: '11px' }}>{label || '종합 점수'}</text>
      </svg>
    </div>
  );
};

// ========================================
// SummaryView 메인
// ========================================
const SummaryView = ({ config, theme, formData, result, onBack, onShowFull, displayName }) => {
  const ai = result?.aiResponse || {};
  const prescription = ai.lucky_prescription || {};
  const graphs = ai.graphs || {};
  const isAstro = !!config.isAstro;
  
  const isLove = config.showLoveGrade;
  const isWealth = config.showWealthGrade;
  const isCareer = config.showCareerGrade;
  const isFull = config.showFullGrade;
  
  const flowData = ai.lifetime_love_flow || ai.lifetime_wealth_flow || ai.lifetime_career_flow || ai.lifetime_flow || [];
  const grade = isLove ? ai.love_grade : isWealth ? ai.wealth_grade : isCareer ? ai.career_grade : (ai.saju_grade || ai.saju_summary?.saju_grade);
  const gradeHook = isLove ? ai.love_grade_hook : isWealth ? ai.wealth_grade_hook : isCareer ? ai.career_grade_hook : (ai.saju_grade_hook || ai.saju_summary?.saju_grade_hook);
  const styleType = isLove ? ai.love_style : isWealth ? ai.money_type : isCareer ? ai.career_type : (ai.saju_type || ai.saju_summary?.saju_type);
  const styleHook = isLove ? ai.love_style_hook : isWealth ? ai.money_type_hook : isCareer ? ai.career_type_hook : (ai.saju_type_hook || null);
  const chartColor = isLove ? '#EC4899' : isWealth ? '#B8860B' : isCareer ? '#3B82F6' : isAstro ? '#7C3AED' : '#2C3E6B';
  const gradeType = isLove ? 'love' : isWealth ? 'wealth' : isCareer ? 'career' : 'full';
  const analyses = ai.custom_analysis || [];
  const tenYearFortune = ai.ten_year_fortune || [];
  const lifeScore = ai.life_score || {};
  const headerTitle = displayName || config.title;

  return (
    <div className={`min-h-screen bg-gradient-to-br ${theme.bg}`}>
      {/* 헤더 */}
      <div className="bg-white/80 backdrop-blur-sm sticky top-0 z-10 border-b border-stone-200 shadow-sm">
        <div className="max-w-2xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className={`${theme.text.primary} font-bold text-sm`}>
            {config.icon} {formData?.name || '회원'}님의 {headerTitle}
          </h1>
          {onBack && (
            <button onClick={onBack} className={`${theme.text.accent} hover:opacity-70 text-sm`}>← 돌아가기</button>
          )}
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8">

        {/* 공신력 배지 */}
        <CertificationBadge isAstro={isAstro} />

        {/* 후킹 멘트 */}
        {ai.hooking_ment && (
          <div className={`bg-gradient-to-r ${isAstro ? 'from-purple-50 to-indigo-50 border-purple-200' : 'from-amber-50/60 to-stone-50 border-stone-200'} rounded-2xl p-6 mb-8 border`}>
            <p className={`text-lg ${theme.text.primary} text-center italic font-medium leading-relaxed`}>
              "{ai.hooking_ment}"
            </p>
          </div>
        )}

        {/* 🎨 Visual Data - 사주 팔자표 */}
        {config.showVisualData && ai.visual_data && !config.isAstro && (
          <div className="mb-8"><SajuPillarsChart visualData={ai.visual_data} theme={theme} /></div>
        )}

        {/* 🎨 Visual Data - 점성학 행성 배치표 */}
        {config.showVisualData && ai.visual_data && config.isAstro && (
          <div className="mb-8"><AstroPlanetsChart visualData={ai.visual_data} theme={theme} /></div>
        )}

        {/* 등급 + 유형 */}
        {(isWealth || isLove || isCareer || isFull) && (
          <>
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className={`${theme.card} rounded-2xl p-6 border flex flex-col items-center justify-center`}>
                <GradeBadge grade={grade || 'A'} hook={gradeHook} type={gradeType} />
              </div>
              <div className={`${theme.card} rounded-2xl p-6 border`}>
                <div className="text-center">
                  <div className="text-4xl mb-3">
                    {isLove ? (styleType === '헌신형' ? '💝' : styleType === '자유연애형' ? '🦋' : '💕')
                    : isWealth ? (styleType === '사업가형' ? '🏢' : styleType === '투자자형' ? '📈' : '💰')
                    : isCareer ? (styleType === '전문직형' ? '👔' : styleType === '창업형' ? '🚀' : '💼')
                    : '📜'}
                  </div>
                  <div className={`${theme.text.accent} font-bold text-base`}>
                    {styleType || (isLove ? '연애 유형' : isWealth ? '재물 유형' : isCareer ? '커리어 유형' : '사주 유형')}
                  </div>
                  {styleHook && <div className={`${theme.text.muted} text-xs mt-2 italic`}>"{styleHook}"</div>}
                </div>
              </div>
            </div>
            <SectionDivider isAstro={isAstro} />
          </>
        )}

        {/* 전성기/주의기 */}
        {config.showPeakDanger && (
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-emerald-50 rounded-xl p-5 border border-emerald-200">
              <div className="text-emerald-600 text-sm font-medium mb-2">
                {isLove ? '💕 연애 전성기' : isCareer ? '🎯 커리어 전성기' : isFull ? '🌟 인생 전성기' : '🚀 전성기'}
              </div>
              <div className="text-stone-800 font-bold text-xl">{ai.peak_period?.age || ai.peak_period || '45-55세'}</div>
              <div className="text-emerald-600/70 text-xs mt-2 italic">"{ai.peak_period?.hook || ai.peak_hook}"</div>
            </div>
            <div className="bg-red-50 rounded-xl p-5 border border-red-200">
              <div className="text-red-500 text-sm font-medium mb-2">⚠️ 주의 시기</div>
              <div className="text-stone-800 font-bold text-xl">{ai.danger_period?.age || ai.danger_period || '38-42세'}</div>
              <div className="text-red-400/70 text-xs mt-2 italic">"{ai.danger_period?.hook || ai.danger_hook}"</div>
            </div>
          </div>
        )}

        {/* 결혼 타이밍 (연애운 전용) */}
        {isLove && ai.marriage_timing && (
          <div className="bg-pink-50 rounded-xl p-5 mb-8 border border-pink-200">
            <div className="text-pink-600 text-sm font-medium mb-2">💍 결혼 적기</div>
            <div className="text-stone-800 font-bold text-xl">{ai.marriage_timing}</div>
            <div className="text-pink-400/70 text-xs mt-2 italic">"{ai.marriage_hook}"</div>
          </div>
        )}

        {/* 점성학 전용: 태양/달/상승궁 */}
        {config.showSunSign && ai.sun_sign && (
          <div className="grid grid-cols-3 gap-3 mb-8">
            <div className={`${theme.card} rounded-xl p-5 border text-center`}>
              <div className="text-4xl mb-2">{ai.sun_sign_symbol || '☀️'}</div>
              <div className={`${theme.text.accent} font-bold text-sm`}>태양</div>
              <div className={`${theme.text.primary} text-sm mt-1`}>{ai.sun_sign}</div>
            </div>
            {ai.moon_sign && (
              <div className={`${theme.card} rounded-xl p-5 border text-center`}>
                <div className="text-4xl mb-2">🌙</div>
                <div className={`${theme.text.accent} font-bold text-sm`}>달</div>
                <div className={`${theme.text.primary} text-sm mt-1`}>{ai.moon_sign}</div>
              </div>
            )}
            {ai.rising_sign && (
              <div className={`${theme.card} rounded-xl p-5 border text-center`}>
                <div className="text-4xl mb-2">⬆️</div>
                <div className={`${theme.text.accent} font-bold text-sm`}>상승궁</div>
                <div className={`${theme.text.primary} text-sm mt-1`}>{ai.rising_sign}</div>
              </div>
            )}
          </div>
        )}

        {/* 연애운 전용: 이상형 정보 */}
        {config.showIdealPartner && ai.ideal_partner_look && (
          <div className={`${theme.card} rounded-xl p-5 mb-8 border`}>
            <h3 className={`${theme.text.accent} font-bold mb-4 text-base`}>💑 운명의 상대</h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className={`${theme.text.muted}`}>외모</div>
              <div className={`${theme.text.primary} font-medium`}>{ai.ideal_partner_look}</div>
              <div className={`${theme.text.muted}`}>성격</div>
              <div className={`${theme.text.primary} font-medium`}>{ai.ideal_partner_personality}</div>
              <div className={`${theme.text.muted}`}>직업</div>
              <div className={`${theme.text.primary} font-medium`}>{ai.ideal_partner_job}</div>
              <div className={`${theme.text.muted}`}>나이차</div>
              <div className={`${theme.text.primary} font-medium`}>{ai.ideal_partner_age}</div>
              {ai.where_to_meet && (
                <>
                  <div className={`${theme.text.muted}`}>만나는 곳</div>
                  <div className={`${theme.text.primary} font-medium`}>{ai.where_to_meet}</div>
                </>
              )}
            </div>
          </div>
        )}

        {/* 궁합 별자리 */}
        {config.showIdealPartner && ai.soulmate_signs && (
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-pink-50 rounded-xl p-4 border border-pink-200">
              <div className="text-pink-600 text-sm font-medium mb-2">💕 베스트 궁합</div>
              <div className="text-stone-800 font-bold">{ai.soulmate_signs?.join(', ') || ai.soulmate_signs}</div>
            </div>
            {ai.avoid_signs && (
              <div className="bg-stone-50 rounded-xl p-4 border border-stone-200">
                <div className="text-stone-500 text-sm font-medium mb-2">⚠️ 피할 궁합</div>
                <div className="text-stone-800 font-bold">{ai.avoid_signs?.join(', ') || ai.avoid_signs}</div>
              </div>
            )}
          </div>
        )}

        {/* 시험 타이밍 (커리어 전용) */}
        {isCareer && ai.exam_timing && (
          <div className="bg-blue-50 rounded-xl p-5 mb-8 border border-blue-200">
            <div className="text-blue-600 text-sm font-medium mb-2">📝 시험 합격 타이밍</div>
            <div className="text-stone-800 font-bold text-xl">{ai.exam_timing}</div>
            <div className="text-blue-400/70 text-xs mt-2 italic">"{ai.exam_hook}"</div>
          </div>
        )}

        {/* 월별 운세 */}
        {config.showMonthlyFortune && ai.monthly_fortune && (
          <div className={`${theme.card} rounded-2xl p-6 mb-8 border`}>
            <h3 className={`${theme.text.accent} font-bold mb-4 text-center text-base`}>📅 2026년 월별 운세</h3>
            <div className="grid grid-cols-3 gap-3">
              {ai.monthly_fortune.map((item, i) => (
                <div key={i} className="bg-stone-50 rounded-lg p-3 border border-stone-100 text-center">
                  <div className="text-stone-800 font-bold">{item.month}</div>
                  <div className={`text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r ${theme.score}`}>{item.score}</div>
                  <div className={`${theme.text.accent} text-xs mt-1`}>{item.keyword}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        <SectionDivider isAstro={isAstro} />

        {/* 종합 점수 게이지 + 세부 지표 */}
        <div className={`${theme.card} rounded-2xl p-6 mb-8 border`}>
          <ScoreGauge score={lifeScore.overall || ai.summary_score || 85} label="종합 점수" theme={theme} />
          <div className="grid grid-cols-5 gap-3 mt-6">
            {config.graphLabels.map((item, i) => (
              <div key={i} className="text-center">
                <div className="text-xl mb-1">{item.emoji}</div>
                <div className="text-stone-800 font-bold text-base">{lifeScore[item.key] || graphs[item.key] || 80}</div>
                <div className="text-stone-400 text-xs mt-0.5">{item.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* 인생 흐름 그래프 */}
        {config.showLifetimeFlow && flowData.length > 0 && (
          <div className={`${theme.card} rounded-2xl p-6 mb-8 border`}>
            <h3 className={`${theme.text.accent} font-bold mb-4 text-center text-base`}>
              {isLove ? '💕 인생 연애 흐름' : isCareer ? '📈 인생 커리어 흐름' : isFull ? '🌟 인생 대운 흐름' : '📈 인생 재물 흐름'}
            </h3>
            <LifetimeFlowChart data={flowData} theme={theme} lineColor={chartColor} />
          </div>
        )}

        {/* 10년 대운 */}
        {config.showTenYearFortune && tenYearFortune.length > 0 && (
          <div className={`${theme.card} rounded-2xl p-6 mb-8 border`}>
            <h3 className={`${theme.text.accent} font-bold mb-4 text-center text-base`}>📅 향후 10년 대운</h3>
            <div className="grid grid-cols-2 gap-3">
              {tenYearFortune.slice(0, 10).map((item, i) => (
                <div key={i} className="bg-stone-50 rounded-lg p-4 border border-stone-100">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-stone-800 font-bold">{item.year}년</span>
                    <span className={`${theme.text.accent} text-sm font-bold`}>{item.score}점</span>
                  </div>
                  <div className="text-stone-500 text-xs">{item.keyword}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        <SectionDivider isAstro={isAstro} />

        {/* 분석 섹션 */}
        <div className="space-y-4 mb-8">
          <h2 className={`${theme.text.accent} font-bold text-lg mb-2`}>📋 상세 분석</h2>
          {analyses.map((item, i) => (
            <div key={i} className={`${theme.card} rounded-xl p-5 border`}>
              <div className="flex items-start gap-3">
                <div className={`flex-shrink-0 w-8 h-8 rounded-full ${isAstro ? 'bg-purple-100 text-purple-600' : 'bg-stone-100 text-stone-600'} flex items-center justify-center text-sm font-bold`}>
                  {String(i + 1).padStart(2, '0')}
                </div>
                <div className="flex-1">
                  <h3 className="text-stone-800 font-bold text-base mb-1">{item.topic || `분석 ${i + 1}`}</h3>
                  {item.hook && <p className={`${theme.text.accent} text-sm italic mb-2`}>"{item.hook}"</p>}
                  <p className="text-stone-600 text-sm leading-relaxed">
                    {(item.summary || item.full_content || '').substring(0, 200)}
                    {(item.summary || item.full_content || '').length > 200 && '...'}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 처방전 */}
        <div className={`${isAstro ? 'bg-purple-50 border-purple-200' : 'bg-amber-50/60 border-stone-200'} rounded-2xl p-6 mb-8 border`}>
          <h2 className={`text-lg font-bold ${theme.text.accent} mb-4 text-center`}>{config.prescriptionTitle}</h2>
          <div className="grid grid-cols-2 gap-3 text-sm">
            {config.prescriptionFields.map(field => prescription[field] && (
              <div key={field} className="bg-white rounded-lg p-4 border border-stone-100 shadow-sm">
                <div className="text-stone-400 text-xs mb-1">{config.prescriptionLabels[field]}</div>
                <div className="text-stone-800 font-bold">{prescription[field]}</div>
              </div>
            ))}
          </div>
        </div>

        {/* 버튼들 */}
        <div className="space-y-3">
          <button onClick={() => window.print()}
            className={`block w-full py-4 rounded-xl bg-gradient-to-r ${theme.button} font-bold text-center transition-all hover:shadow-lg active:scale-[0.98]`}>
            🖨️ 인쇄 / PDF 저장
          </button>

          {onShowFull && (
            <button onClick={onShowFull}
              className="block w-full py-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-center transition-all hover:shadow-lg active:scale-[0.98]">
              📖 풀버전 보기
            </button>
          )}

          {onBack && (
            <button onClick={onBack}
              className="block w-full py-3 rounded-xl bg-white border border-stone-200 text-stone-600 font-medium transition-all hover:bg-stone-50">
              ← 돌아가기
            </button>
          )}
        </div>

        <Footer />
      </div>
    </div>
  );
};

export default SummaryView;