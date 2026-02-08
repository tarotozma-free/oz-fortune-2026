import SajuPillarsChart from '../components/SajuPillarsChart';
import AstroPlanetsChart from '../components/AstroPlanetsChart';
import LifetimeFlowChart from '../components/LifetimeFlowChart';
import GradeBadge from '../components/GradeBadge';

const SummaryView = ({ config, theme, formData, result, onBack, onShowFull, displayName }) => {
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
  const graphs = ai.graphs || {};
  
  // 상품 타입 구분
  const isLove = config.showLoveGrade;
  const isWealth = config.showWealthGrade;
  const isCareer = config.showCareerGrade;
  const isFull = config.showFullGrade;
  
  // 데이터 매핑
  const flowData = ai.lifetime_love_flow || ai.lifetime_wealth_flow || ai.lifetime_career_flow || ai.lifetime_flow || [];
  const grade = isLove ? ai.love_grade : isWealth ? ai.wealth_grade : isCareer ? ai.career_grade : (ai.saju_grade || ai.saju_summary?.saju_grade);
  const gradeHook = isLove ? ai.love_grade_hook : isWealth ? ai.wealth_grade_hook : isCareer ? ai.career_grade_hook : (ai.saju_grade_hook || ai.saju_summary?.saju_grade_hook);
  const styleType = isLove ? ai.love_style : isWealth ? ai.money_type : isCareer ? ai.career_type : (ai.saju_type || ai.saju_summary?.saju_type);
  const styleHook = isLove ? ai.love_style_hook : isWealth ? ai.money_type_hook : isCareer ? ai.career_type_hook : (ai.saju_type_hook || null);
  const chartColor = isLove ? '#EC4899' : isWealth ? '#FFD700' : isCareer ? '#3B82F6' : '#8B5CF6';
  const gradeType = isLove ? 'love' : isWealth ? 'wealth' : isCareer ? 'career' : 'full';
  
  // 분석 배열 (10개 또는 20개)
  const analyses = ai.custom_analysis || [];
  
  // 10년 대운 (full 전용)
  const tenYearFortune = ai.ten_year_fortune || [];
  
  // life_score (full 전용)
  const lifeScore = ai.life_score || {};

  // 표시할 제목 (displayName 우선, 없으면 config.title)
  const headerTitle = displayName || config.title;

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
          <h1 className={`${theme.text.primary} font-bold`}>{config.icon} {formData?.name || '회원'}님의 {headerTitle}</h1>
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

        {/* ✦ 빅쓰리 (점성학 전 상품 공통) */}
        {config.isAstro && (ai.sun_sign || ai.visual_data?.sun_sign) && (
          <div className={`${theme.card} rounded-2xl p-5 mb-6 border`}>
            <div className="grid grid-cols-3 gap-3 text-center">
              {[
                { emoji: '☀️', label: '태양', sign: ai.sun_sign || ai.visual_data?.sun_sign, symbol: ai.sun_sign_symbol || ai.visual_data?.sun_sign_symbol },
                { emoji: '🌙', label: '달', sign: ai.moon_sign || ai.visual_data?.moon_sign },
                { emoji: '⬆️', label: '상승궁', sign: ai.rising_sign || ai.visual_data?.rising_sign },
              ].map((b, i) => (
                <div key={i}>
                  <div className="text-lg">{b.emoji} {b.symbol || ''}</div>
                  <div className={`${theme.text.primary} font-bold text-sm`}>{b.sign}</div>
                  <div className={`${theme.text.muted} text-xs`}>{b.label}</div>
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


        {/* 등급 + 유형 */}
        {(isWealth || isLove || isCareer || isFull) && (
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className={`${theme.card} rounded-2xl p-5 border flex flex-col items-center justify-center`}>
              <GradeBadge grade={grade || 'A'} hook={gradeHook} type={gradeType} />
            </div>
            <div className={`${theme.card} rounded-2xl p-5 border`}>
              <div className="text-center">
                <div className="text-3xl mb-2">
                  {isLove 
                    ? (styleType === '헌신형' ? '💝' : styleType === '자유연애형' ? '🦋' : '💕')
                    : isWealth
                    ? (styleType === '사업가형' ? '🏢' : styleType === '투자자형' ? '📈' : '💰')
                    : isCareer
                    ? (styleType === '전문직형' ? '👔' : styleType === '창업형' ? '🚀' : '💼')
                    : '📜'
                  }
                </div>
                <div className={`${theme.text.accent} font-bold`}>
                  {styleType || (isLove ? '연애 유형' : isWealth ? '재물 유형' : isCareer ? '커리어 유형' : '사주 유형')}
                </div>
                {styleHook && <div className={`${theme.text.muted} text-xs mt-1 italic`}>"{styleHook}"</div>}
              </div>
            </div>
          </div>
        )}

        {/* 전성기/주의기 */}
        {config.showPeakDanger && (
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gradient-to-br from-green-900/40 to-emerald-900/40 rounded-xl p-4 border border-green-500/30">
              <div className="text-green-400 text-sm mb-1">
                {isLove ? '💕 연애 전성기' : isCareer ? '🎯 커리어 전성기' : isFull ? '🌟 인생 전성기' : '🚀 전성기'}
              </div>
              <div className="text-white font-bold text-lg">{ai.peak_period?.age || ai.peak_period || '45-55세'}</div>
              <div className="text-green-300/80 text-xs mt-1">"{ai.peak_period?.hook || ai.peak_hook}"</div>
            </div>
            <div className="bg-gradient-to-br from-red-900/40 to-rose-900/40 rounded-xl p-4 border border-red-500/30">
              <div className="text-red-400 text-sm mb-1">⚠️ 주의 시기</div>
              <div className="text-white font-bold text-lg">{ai.danger_period?.age || ai.danger_period || '38-42세'}</div>
              <div className="text-red-300/80 text-xs mt-1">"{ai.danger_period?.hook || ai.danger_hook}"</div>
            </div>
          </div>
        )}

        {/* 결혼 타이밍 (연애운 전용) */}
        {isLove && ai.marriage_timing && (
          <div className="bg-gradient-to-br from-purple-900/40 to-pink-900/40 rounded-xl p-4 mb-6 border border-purple-500/30">
            <div className="text-purple-400 text-sm mb-1">💍 결혼 적기</div>
            <div className="text-white font-bold text-lg">{ai.marriage_timing}</div>
            <div className="text-purple-300/80 text-xs mt-1">"{ai.marriage_hook}"</div>
          </div>
        )}

        {/* 점성학 전용: 태양/달/상승궁 표시 */}
        {config.showSunSign && ai.sun_sign && (
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className={`${theme.card} rounded-xl p-4 border text-center`}>
              <div className="text-3xl mb-1">{ai.sun_sign_symbol || '☀️'}</div>
              <div className={`${theme.text.accent} font-bold text-sm`}>태양</div>
              <div className={`${theme.text.primary} text-sm`}>{ai.sun_sign}</div>
            </div>
            {ai.moon_sign && (
              <div className={`${theme.card} rounded-xl p-4 border text-center`}>
                <div className="text-3xl mb-1">🌙</div>
                <div className={`${theme.text.accent} font-bold text-sm`}>달</div>
                <div className={`${theme.text.primary} text-sm`}>{ai.moon_sign}</div>
              </div>
            )}
            {ai.rising_sign && (
              <div className={`${theme.card} rounded-xl p-4 border text-center`}>
                <div className="text-3xl mb-1">⬆️</div>
                <div className={`${theme.text.accent} font-bold text-sm`}>상승궁</div>
                <div className={`${theme.text.primary} text-sm`}>{ai.rising_sign}</div>
              </div>
            )}
          </div>
        )}

        {/* 연애운 전용: 이상형 정보 */}
        {config.showIdealPartner && ai.ideal_partner_look && (
          <div className={`${theme.card} rounded-xl p-4 mb-6 border`}>
            <h3 className={`${theme.text.accent} font-bold mb-3`}>💑 운명의 상대</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className={`${theme.text.muted}`}>외모</div>
              <div className={`${theme.text.primary}`}>{ai.ideal_partner_look}</div>
              <div className={`${theme.text.muted}`}>성격</div>
              <div className={`${theme.text.primary}`}>{ai.ideal_partner_personality}</div>
              <div className={`${theme.text.muted}`}>직업</div>
              <div className={`${theme.text.primary}`}>{ai.ideal_partner_job}</div>
              <div className={`${theme.text.muted}`}>나이차</div>
              <div className={`${theme.text.primary}`}>{ai.ideal_partner_age}</div>
              {ai.where_to_meet && (
                <>
                  <div className={`${theme.text.muted}`}>만나는 곳</div>
                  <div className={`${theme.text.primary}`}>{ai.where_to_meet}</div>
                </>
              )}
            </div>
          </div>
        )}

        {/* 연애운: 궁합 별자리 */}
        {config.showIdealPartner && ai.soulmate_signs && (
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gradient-to-br from-pink-900/40 to-rose-900/40 rounded-xl p-4 border border-pink-500/30">
              <div className="text-pink-400 text-sm mb-2">💕 베스트 궁합</div>
              <div className="text-white font-bold">{ai.soulmate_signs?.join(', ') || ai.soulmate_signs}</div>
            </div>
            {ai.avoid_signs && (
              <div className="bg-gradient-to-br from-gray-900/40 to-slate-900/40 rounded-xl p-4 border border-gray-500/30">
                <div className="text-gray-400 text-sm mb-2">⚠️ 피할 궁합</div>
                <div className="text-white font-bold">{ai.avoid_signs?.join(', ') || ai.avoid_signs}</div>
              </div>
            )}
          </div>
        )}

        {/* 시험 타이밍 (커리어 전용) */}
        {isCareer && ai.exam_timing && (
          <div className="bg-gradient-to-br from-indigo-900/40 to-blue-900/40 rounded-xl p-4 mb-6 border border-indigo-500/30">
            <div className="text-indigo-400 text-sm mb-1">📝 시험 합격 타이밍</div>
            <div className="text-white font-bold text-lg">{ai.exam_timing}</div>
            <div className="text-indigo-300/80 text-xs mt-1">"{ai.exam_hook}"</div>
          </div>
        )}

        {/* 2026 점성학: 월별 운세 */}
        {config.showMonthlyFortune && ai.monthly_fortune && (
          <div className={`${theme.card} rounded-2xl p-6 mb-6 border`}>
            <h3 className={`${theme.text.accent} font-bold mb-4 text-center`}>📅 2026년 월별 운세</h3>
            <div className="grid grid-cols-3 gap-2">
              {ai.monthly_fortune.map((item, i) => (
                <div key={i} className={`${theme.card} rounded-lg p-3 border text-center`}>
                  <div className={`${theme.text.primary} font-bold`}>{item.month}</div>
                  <div className={`text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r ${theme.score}`}>
                    {item.score}
                  </div>
                  <div className={`${theme.text.accent} text-xs`}>{item.keyword}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 종합 점수 + 지표 */}
        <div className={`${theme.card} rounded-2xl p-6 mb-6 border`}>
          <div className="text-center mb-6">
            <div className={`text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r ${theme.score} mb-1`}>
              {lifeScore.overall || ai.summary_score || 85}점
            </div>
            <p className={`${theme.text.accent} text-sm`}>종합 점수</p>
          </div>
          <div className="grid grid-cols-5 gap-2">
            {config.graphLabels.map((item, i) => (
              <div key={i} className="text-center">
                <div className="text-lg">{item.emoji}</div>
                <div className={`${theme.text.primary} font-bold text-sm`}>{lifeScore[item.key] || graphs[item.key] || 80}</div>
                <div className={`${theme.text.muted} text-xs`}>{item.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* 인생 흐름 그래프 */}
        {config.showLifetimeFlow && flowData.length > 0 && (
          <div className={`${theme.card} rounded-2xl p-6 mb-6 border`}>
            <h3 className={`${theme.text.accent} font-bold mb-4 text-center`}>
              {isLove ? '💕 인생 연애 흐름' : isCareer ? '📈 인생 커리어 흐름' : isFull ? '🌟 인생 대운 흐름' : '📈 인생 재물 흐름'}
            </h3>
            <LifetimeFlowChart data={flowData} theme={theme} lineColor={chartColor} />
          </div>
        )}

        {/* 10년 대운 (full 전용) */}
        {config.showTenYearFortune && tenYearFortune.length > 0 && (
          <div className={`${theme.card} rounded-2xl p-6 mb-6 border`}>
            <h3 className={`${theme.text.accent} font-bold mb-4 text-center`}>📅 향후 10년 대운</h3>
            <div className="grid grid-cols-2 gap-2">
              {tenYearFortune.slice(0, 10).map((item, i) => (
                <div key={i} className={`${theme.card} rounded-lg p-3 border`}>
                  <div className="flex justify-between items-center mb-1">
                    <span className={`${theme.text.primary} font-bold`}>{item.year}년</span>
                    <span className={`${theme.text.accent} text-sm`}>{item.score}점</span>
                  </div>
                  <div className={`${theme.text.muted} text-xs`}>{item.keyword}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 분석 섹션 (10개 또는 20개) */}
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

        {/* 인쇄 버튼 */}
        <button onClick={() => window.print()}
          className={`block w-full py-4 rounded-xl bg-gradient-to-r ${theme.button} font-bold text-center transition-all mb-4`}
        >
          🖨️ 인쇄 / PDF 저장
        </button>

        {/* 풀버전 보기 버튼 */}
        {onShowFull && (
          <button onClick={onShowFull}
            className={`block w-full py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold text-center transition-all mb-4 hover:from-emerald-600 hover:to-teal-700`}
          >
            📖 풀버전 보기
          </button>
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


export default SummaryView;