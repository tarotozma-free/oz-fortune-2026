import SajuPillarsChart from '../components/SajuPillarsChart';
import AstroPlanetsChart from '../components/AstroPlanetsChart';
import LifetimeFlowChart from '../components/LifetimeFlowChart';
import GradeBadge from '../components/GradeBadge';

// ========================================
// 공신력 인장 배지
// ========================================
const CertificationBadge = ({ isAstro }) => (
  <div className="flex items-center justify-center gap-3 py-4 px-6 mb-6 rounded-xl bg-gradient-to-r from-stone-50 to-stone-100 border border-stone-200 print:border-stone-300">
    <div className="relative flex-shrink-0">
      <div className={`w-12 h-12 rounded-full border-2 ${isAstro ? 'border-purple-400' : 'border-[#B8860B]'} flex items-center justify-center`}>
        <div className={`w-9 h-9 rounded-full border ${isAstro ? 'border-purple-300 bg-purple-50' : 'border-[#DAA520]/40 bg-amber-50'} flex items-center justify-center`}>
          <span className="text-lg">{isAstro ? '⭐' : '印'}</span>
        </div>
      </div>
      <div className={`absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full ${isAstro ? 'bg-purple-500' : 'bg-[#B8860B]'} flex items-center justify-center`}>
        <span className="text-white text-[8px]">✓</span>
      </div>
    </div>
    <div className="text-center">
      <div className="text-[10px] text-stone-400 tracking-wider uppercase">Verified by</div>
      <div className={`text-xs font-bold ${isAstro ? 'text-purple-700' : 'text-[#2C3E6B]'} tracking-wide`}>
        OZ Fortune International Institute
      </div>
      <div className="text-[10px] text-stone-400">업무 제휴 검증 시스템</div>
    </div>
  </div>
);

// ========================================
// 섹션 구분선
// ========================================
const SectionDivider = ({ isAstro }) => (
  <div className="flex items-center gap-4 my-8">
    <div className={`flex-1 h-px ${isAstro ? 'bg-purple-200' : 'bg-stone-200'}`} />
    <div className={`text-xs ${isAstro ? 'text-purple-300' : 'text-stone-300'}`}>✦</div>
    <div className={`flex-1 h-px ${isAstro ? 'bg-purple-200' : 'bg-stone-200'}`} />
  </div>
);

// ========================================
// 푸터
// ========================================
const Footer = () => (
  <div className="text-center mt-10 pt-6 border-t border-stone-200 print:mt-4 print:pt-4">
    <p className="text-stone-400 text-xs">© 2025 주식회사 오즈마. All rights reserved.</p>
    <p className="text-stone-300 text-[10px] mt-1">본 분석 시스템의 저작권은 주식회사 오즈마에 있습니다.</p>
  </div>
);

// ========================================
// FullView 메인
// ========================================
const FullView = ({ config, theme, formData, result, onBack, displayName }) => {
  const ai = result?.aiResponse || {};
  const prescription = ai.lucky_prescription || {};
  const analyses = ai.custom_analysis || [];
  const lifeScore = ai.life_score || {};
  const tenYearFortune = ai.ten_year_fortune || [];
  const isAstro = !!config.isAstro;

  const isLove = config.showLoveGrade;
  const isWealth = config.showWealthGrade;
  const isCareer = config.showCareerGrade;
  const isFull = config.showFullGrade;

  const grade = isLove ? ai.love_grade : isWealth ? ai.wealth_grade : isCareer ? ai.career_grade : ai.saju_summary?.saju_grade;
  const gradeType = isLove ? 'love' : isWealth ? 'wealth' : isCareer ? 'career' : 'full';
  const headerTitle = displayName || config.title;

  return (
    <div className={`min-h-screen bg-gradient-to-br ${theme.bg} print:bg-white`}>
      {/* 헤더 (인쇄 시 숨김) */}
      <div className="bg-white/80 backdrop-blur-sm sticky top-0 z-10 border-b border-stone-200 shadow-sm print:hidden">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-stone-800 font-bold text-sm">{config.icon} {formData?.name || '회원'}님의 {headerTitle}</h1>
          <div className="flex gap-2">
            <button onClick={() => window.print()} className="text-stone-500 hover:text-stone-800 text-sm px-3 py-1 rounded-lg bg-stone-100 hover:bg-stone-200 transition-colors">
              🖨️ 인쇄
            </button>
            {onBack && (
              <button onClick={onBack} className={`${theme.text.accent} hover:opacity-70 text-sm`}>← 돌아가기</button>
            )}
          </div>
        </div>
      </div>

      {/* 인쇄용 헤더 */}
      <div className="hidden print:block text-center py-8 border-b-2 border-stone-300">
        <h1 className="text-3xl font-bold text-stone-800">{config.icon} {headerTitle}</h1>
        <p className="text-xl text-stone-600 mt-2">{formData?.name || '회원'}님의 분석 결과</p>
        <p className="text-sm text-stone-400 mt-1">
          생년월일: {formData?.dob} | 성별: {formData?.gender === 'male' ? '남성' : '여성'}
        </p>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 print:py-4">

        {/* 공신력 배지 */}
        <CertificationBadge isAstro={isAstro} />

        {/* 후킹 멘트 */}
        {ai.hooking_ment && (
          <div className={`${isAstro ? 'bg-purple-50 border-purple-200' : 'bg-amber-50/60 border-stone-200'} rounded-2xl p-6 mb-8 border print:bg-stone-50 print:border-stone-300`}>
            <p className="text-xl text-stone-800 text-center italic font-medium leading-relaxed">
              "{ai.hooking_ment}"
            </p>
          </div>
        )}

        {/* 🎨 Visual Data */}
        {config.showVisualData && ai.visual_data && !config.isAstro && (
          <div className="mb-8"><SajuPillarsChart visualData={ai.visual_data} theme={theme} /></div>
        )}
        {config.showVisualData && ai.visual_data && config.isAstro && (
          <div className="mb-8"><AstroPlanetsChart visualData={ai.visual_data} theme={theme} /></div>
        )}

        {/* 등급 + 점수 요약 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {grade && (
            <div className={`${theme.card} rounded-xl p-5 border text-center print:bg-stone-50 print:border-stone-300`}>
              <GradeBadge grade={grade} type={gradeType} />
            </div>
          )}
          <div className={`${theme.card} rounded-xl p-5 border text-center print:bg-stone-50 print:border-stone-300`}>
            <div className={`text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r ${theme.score} print:text-stone-800`}>
              {lifeScore.overall || ai.summary_score || 85}점
            </div>
            <div className="text-stone-400 text-sm mt-1">종합 점수</div>
          </div>
          {ai.peak_period && (
            <div className="bg-emerald-50 rounded-xl p-5 border border-emerald-200 text-center print:bg-emerald-50 print:border-emerald-300">
              <div className="text-emerald-600 font-bold text-lg">{ai.peak_period?.age || ai.peak_period}</div>
              <div className="text-emerald-500 text-sm mt-1">전성기</div>
            </div>
          )}
          {ai.danger_period && (
            <div className="bg-red-50 rounded-xl p-5 border border-red-200 text-center print:bg-red-50 print:border-red-300">
              <div className="text-red-500 font-bold text-lg">{ai.danger_period?.age || ai.danger_period}</div>
              <div className="text-red-400 text-sm mt-1">주의 시기</div>
            </div>
          )}
        </div>

        {/* 10년 대운 */}
        {tenYearFortune.length > 0 && (
          <div className={`${theme.card} rounded-2xl p-6 mb-8 border print:bg-stone-50 print:border-stone-300`}>
            <h2 className="text-xl font-bold text-stone-800 mb-4">📅 향후 10년 대운</h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {tenYearFortune.map((item, i) => (
                <div key={i} className="bg-stone-50 rounded-lg p-3 border border-stone-100 print:bg-white print:border-stone-200">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-stone-800 font-bold">{item.year}</span>
                    <span className={`${theme.text.accent} text-sm font-bold`}>{item.score}점</span>
                  </div>
                  <div className="text-stone-500 text-xs">{item.keyword}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        <SectionDivider isAstro={isAstro} />

        {/* 상세 분석 목록 */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-stone-800 mb-4">📋 상세 분석</h2>

          {analyses.map((item, i) => (
            <div key={i} className={`${theme.card} rounded-2xl p-6 border print:bg-white print:border-stone-300 print:break-inside-avoid`}>
              <div className="flex items-start gap-4">
                <div className={`flex-shrink-0 w-10 h-10 rounded-full ${isAstro ? 'bg-purple-100 text-purple-600' : 'bg-stone-100 text-stone-600'} flex items-center justify-center text-sm font-bold`}>
                  {String(i + 1).padStart(2, '0')}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-stone-800 mb-2">{item.topic || `분석 ${i + 1}`}</h3>
                  {item.hook && (
                    <p className={`${theme.text.accent} italic mb-3 text-sm`}>"{item.hook}"</p>
                  )}
                  <div className="text-stone-600 leading-relaxed whitespace-pre-line text-[15px]">
                    {item.full_content || item.summary || ''}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <SectionDivider isAstro={isAstro} />

        {/* 개운 처방전 */}
        {Object.keys(prescription).length > 0 && (
          <div className={`${isAstro ? 'bg-purple-50 border-purple-200' : 'bg-amber-50/60 border-stone-200'} rounded-2xl p-6 mb-8 border print:bg-stone-50 print:border-stone-300`}>
            <h2 className={`text-xl font-bold ${theme.text.accent} mb-4 text-center`}>{config.prescriptionTitle}</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {config.prescriptionFields?.map(field => (
                prescription[field] && (
                  <div key={field} className="bg-white rounded-xl p-4 border border-stone-100 shadow-sm print:bg-white print:border-stone-200">
                    <div className="text-stone-400 text-sm mb-1">{config.prescriptionLabels?.[field] || field}</div>
                    <div className="text-stone-800 font-bold">{prescription[field]}</div>
                  </div>
                )
              ))}
            </div>
          </div>
        )}

        {/* 마무리 메시지 */}
        {ai.final_message && (
          <div className={`${theme.card} rounded-2xl p-6 mb-8 border print:bg-stone-50 print:border-stone-300`}>
            <h2 className="text-xl font-bold text-stone-800 mb-4">💌 마무리 메시지</h2>
            <p className="text-stone-600 leading-relaxed whitespace-pre-line text-[15px]">{ai.final_message}</p>
            {ai.final_hook && (
              <p className={`${theme.text.accent} italic mt-4 text-center font-medium`}>"{ai.final_hook}"</p>
            )}
          </div>
        )}

        {/* 버튼들 */}
        <div className="space-y-3 print:hidden">
          <button onClick={() => window.print()}
            className={`block w-full py-4 rounded-xl bg-gradient-to-r ${theme.button} font-bold text-center transition-all hover:shadow-lg active:scale-[0.98]`}>
            🖨️ 인쇄 / PDF 저장
          </button>
          {onBack && (
            <button onClick={onBack}
              className="block w-full py-3 rounded-xl bg-white border border-stone-200 text-stone-600 font-medium transition-all hover:bg-stone-50">
              ← 돌아가기
            </button>
          )}
        </div>

        <Footer />
      </div>

      {/* 인쇄용 CSS */}
      <style>{`
        @media print {
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; background: white !important; }
          .print\\:hidden { display: none !important; }
          .print\\:block { display: block !important; }
          .print\\:bg-white { background: white !important; }
          .print\\:bg-stone-50 { background: #fafaf9 !important; }
          .print\\:bg-emerald-50 { background: #ecfdf5 !important; }
          .print\\:bg-red-50 { background: #fef2f2 !important; }
          .print\\:border-stone-300 { border-color: #d6d3d1 !important; }
          .print\\:border-stone-200 { border-color: #e7e5e4 !important; }
          .print\\:border-emerald-300 { border-color: #6ee7b7 !important; }
          .print\\:border-red-300 { border-color: #fca5a5 !important; }
          .print\\:text-stone-800 { color: #292524 !important; }
          .print\\:break-inside-avoid { break-inside: avoid; }
          .print\\:mt-4 { margin-top: 1rem !important; }
          .print\\:pt-4 { padding-top: 1rem !important; }
          .print\\:py-4 { padding-top: 1rem !important; padding-bottom: 1rem !important; }
        }
      `}</style>
    </div>
  );
};

export default FullView;