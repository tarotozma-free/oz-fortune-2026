// ========================================
// Branding.jsx - 공통 브랜딩 컴포넌트
// ========================================

// 공신력 인장 배지
export const CertificationBadge = ({ isAstro }) => (
  <div className="flex items-center justify-center gap-4 py-5 px-6 mb-8 rounded-2xl bg-gradient-to-r from-stone-50 via-white to-stone-50 border border-stone-200 shadow-sm">
    <div className="relative flex-shrink-0">
      <div className={`w-14 h-14 rounded-full border-2 ${isAstro ? 'border-purple-300' : 'border-[#B8860B]/60'} flex items-center justify-center`}>
        <div className={`w-10 h-10 rounded-full border ${isAstro ? 'border-purple-200 bg-purple-50' : 'border-[#DAA520]/30 bg-amber-50'} flex items-center justify-center`}>
          <span className={`text-base font-bold ${isAstro ? 'text-purple-600' : 'text-[#B8860B]'}`}>
            {isAstro ? '✧' : '印'}
          </span>
        </div>
      </div>
      <div className={`absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full ${isAstro ? 'bg-purple-500' : 'bg-[#B8860B]'} flex items-center justify-center shadow-sm`}>
        <span className="text-white text-[7px]">✓</span>
      </div>
    </div>
    <div>
      <div className="text-[9px] text-stone-400 tracking-[0.15em] uppercase mb-0.5">Certified Analysis System</div>
      <div className={`text-[13px] font-bold ${isAstro ? 'text-purple-700' : 'text-[#2C3E6B]'} leading-tight`}>
        OZ Fortune International Institute
      </div>
      <div className="text-[10px] text-stone-400 mt-0.5">비영리 국제연구소 학술 자문 검증</div>
    </div>
  </div>
);

// 섹션 구분선
export const SectionDivider = ({ isAstro }) => (
  <div className="flex items-center gap-4 my-8">
    <div className={`flex-1 h-px ${isAstro ? 'bg-purple-200' : 'bg-stone-200'}`} />
    <div className={`text-xs ${isAstro ? 'text-purple-300' : 'text-stone-300'}`}>✦</div>
    <div className={`flex-1 h-px ${isAstro ? 'bg-purple-200' : 'bg-stone-200'}`} />
  </div>
);

// 풀 푸터 (결과 페이지용)
export const Footer = ({ compact = false }) => (
  <div className={`text-center ${compact ? 'mt-6 pt-4' : 'mt-10 pt-6'} border-t border-stone-200`}>
    <div className="flex items-center justify-center gap-1.5 mb-2">
      <span className="text-stone-300 text-[10px]">—</span>
      <span className="text-stone-400 text-[10px] tracking-wide">학술 자문</span>
      <span className="text-stone-300 text-[10px]">—</span>
    </div>
    <p className="text-stone-500 text-[11px] font-medium">비영리 OZ Fortune 국제연구소</p>
    <div className="flex items-center justify-center gap-2 mt-2">
      <span className="text-stone-300 text-[10px]">|</span>
      <span className="text-stone-400 text-[10px]">개발·운영</span>
      <span className="text-stone-300 text-[10px]">|</span>
    </div>
    <p className="text-stone-400 text-[11px] mt-1">© 2025 주식회사 오즈마. All rights reserved.</p>
    <p className="text-stone-300 text-[9px] mt-1">본 분석 시스템의 저작권은 주식회사 오즈마에 있습니다.</p>
    <p className="text-stone-300 text-[9px] mt-1">업무 협업·교육·상담 문의: ozmaj@naver.com</p>
  </div>
);

// 간단 푸터 (ProductPage 카드형에서 사용)
export const CompactFooter = () => (
  <div className="text-center mt-6">
    <p className="text-stone-400 text-[10px]">학술 자문: 비영리 OZ Fortune 국제연구소 | 개발·운영: 주식회사 오즈마</p>
    <p className="text-stone-300 text-[9px] mt-1">© 2025 주식회사 오즈마 | 문의: ozmaj@naver.com</p>
  </div>
);