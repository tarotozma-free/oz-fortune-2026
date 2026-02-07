// ========================================
// products.js - 상품별 설정 (아이보리 테마 리뉴얼)
// ========================================
// 공통 베이스: 아이보리(#FDFBF7) / 베이지(#F5F0E8)
// 사주 계열: 남색 + 금색 (동양적, 단아한)
// 점성학 계열: 인디고 + 보라 (밝지만 화려한)
// ========================================

// ── 사주 공통 테마 ──
const SAJU_THEME = {
  bg: 'from-[#FDFBF7] via-[#F7F2EA] to-[#F0EBE0]',
  card: 'bg-white border-stone-200 shadow-sm',
  accent: 'stone',
  button: 'from-[#2C3E6B] to-[#1A2744] hover:from-[#3A4F80] hover:to-[#2C3E6B] text-white',
  text: {
    primary: 'text-stone-800',
    secondary: 'text-stone-600',
    muted: 'text-stone-400',
    accent: 'text-[#2C3E6B]',
  },
  input: 'bg-white border-stone-300 text-stone-800 placeholder-stone-400 focus:ring-[#2C3E6B] focus:border-[#2C3E6B]',
  select: 'bg-white',
  score: 'from-[#B8860B] to-[#DAA520]',
};

// ── 점성학 공통 테마 ──
const ASTRO_THEME = {
  bg: 'from-[#FDFBF7] via-[#F5F0F8] to-[#EDE8F5]',
  card: 'bg-white border-purple-100 shadow-sm',
  accent: 'purple',
  button: 'from-[#5B21B6] to-[#7C3AED] hover:from-[#6D28D9] hover:to-[#8B5CF6] text-white',
  text: {
    primary: 'text-stone-800',
    secondary: 'text-stone-600',
    muted: 'text-stone-400',
    accent: 'text-[#5B21B6]',
  },
  input: 'bg-white border-purple-200 text-stone-800 placeholder-stone-400 focus:ring-purple-500 focus:border-purple-500',
  select: 'bg-white',
  score: 'from-[#7C3AED] to-[#A855F7]',
};

// ── 달력 사주 테마 ──
const CALENDAR_THEME = {
  bg: 'from-[#FDFBF7] via-[#F0F7F4] to-[#E8F5EC]',
  card: 'bg-white border-emerald-100 shadow-sm',
  accent: 'emerald',
  button: 'from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white',
  text: {
    primary: 'text-stone-800',
    secondary: 'text-stone-600',
    muted: 'text-stone-400',
    accent: 'text-emerald-700',
  },
  input: 'bg-white border-emerald-200 text-stone-800 placeholder-stone-400 focus:ring-emerald-500 focus:border-emerald-500',
  select: 'bg-white',
  score: 'from-emerald-500 to-teal-500',
};

// ── 달력 점성학 테마 ──
const ASTRO_CALENDAR_THEME = {
  bg: 'from-[#FDFBF7] via-[#F0EDF8] to-[#E8E0F5]',
  card: 'bg-white border-indigo-100 shadow-sm',
  accent: 'indigo',
  button: 'from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white',
  text: {
    primary: 'text-stone-800',
    secondary: 'text-stone-600',
    muted: 'text-stone-400',
    accent: 'text-indigo-700',
  },
  input: 'bg-white border-indigo-200 text-stone-800 placeholder-stone-400 focus:ring-indigo-500 focus:border-indigo-500',
  select: 'bg-white',
  score: 'from-indigo-500 to-purple-500',
};


// ========================================
// 상품 정의
// ========================================
const PRODUCTS = {

  // ══════════════════════════════════════
  // 사주 상품들 (동양적/단아한)
  // ══════════════════════════════════════

  saju: {
    product_id: '2026_vip_saju',
    icon: '🔮',
    title: '2026년 VIP 신년운세',
    subtitle: '프리미엄 사주 분석 리포트',
    buttonText: '내 운세 분석받기',
    theme: SAJU_THEME,
    statusMessages: [
      '🔮 사주 원국을 분석하고 있습니다...',
      '📊 2026년 운세를 계산하고 있습니다...',
      '✨ 맞춤형 분석을 생성하고 있습니다...',
      '📄 리포트를 제작하고 있습니다...',
      '🎁 마무리 작업 중입니다...'
    ],
    graphLabels: [
      { key: 'wealth', label: '재물', emoji: '💰' },
      { key: 'love', label: '애정', emoji: '💕' },
      { key: 'career', label: '직업', emoji: '💼' },
      { key: 'health', label: '건강', emoji: '🏃' },
      { key: 'social', label: '사회', emoji: '🤝' },
    ],
    prescriptionTitle: '🍀 개운 처방전',
    prescriptionFields: ['color', 'number', 'direction', 'item'],
    prescriptionLabels: { color: '색상', number: '숫자', direction: '방향', item: '물건' },
  },
  
  wealth: {
    product_id: 'lifetime_wealth_fortune',
    icon: '💰',
    title: '평생 재물운 대분석',
    subtitle: '돈의 흐름을 읽는 프리미엄 사주 분석',
    buttonText: '내 재물운 분석받기',
    theme: {
      ...SAJU_THEME,
      score: 'from-[#B8860B] to-[#DAA520]',
    },
    statusMessages: [
      '💰 재물 원국을 분석하고 있습니다...',
      '📊 평생 재물 흐름을 계산하고 있습니다...',
      '🏆 당신만의 부자 전략을 설계하고 있습니다...',
      '📈 투자 적성을 분석하고 있습니다...',
      '💎 맞춤형 재물 리포트를 제작하고 있습니다...'
    ],
    graphLabels: [
      { key: 'wealth_luck', label: '재물', emoji: '💰' },
      { key: 'business', label: '사업', emoji: '🏢' },
      { key: 'investment', label: '투자', emoji: '📈' },
      { key: 'salary', label: '급여', emoji: '💼' },
      { key: 'windfall', label: '횡재', emoji: '🎰' },
    ],
    prescriptionTitle: '💎 재물 처방전',
    prescriptionFields: ['color', 'number', 'direction', 'item', 'action', 'avoid'],
    prescriptionLabels: { 
      color: '지갑 색상', number: '행운의 숫자', direction: '돈이 오는 방향', 
      item: '재물 아이템', action: '투자 타이밍', avoid: '피해야 할 것'
    },
    showWealthGrade: true,
    showMoneyType: true,
    showPeakDanger: true,
    showLifetimeFlow: true,
  },

  love: {
    product_id: 'love_relationship_fortune',
    icon: '💕',
    title: '평생 연애·결혼운 대분석',
    subtitle: '사랑의 흐름을 읽는 프리미엄 사주 분석',
    buttonText: '내 연애운 분석받기',
    theme: {
      ...SAJU_THEME,
      accent: 'rose',
      text: { ...SAJU_THEME.text, accent: 'text-rose-700' },
      score: 'from-rose-500 to-pink-500',
    },
    statusMessages: [
      '💕 연애 원국을 분석하고 있습니다...',
      '💑 평생 인연 흐름을 계산하고 있습니다...',
      '💍 당신의 이상형을 분석하고 있습니다...',
      '❤️ 결혼운을 살펴보고 있습니다...',
      '🌹 맞춤형 연애 리포트를 제작하고 있습니다...'
    ],
    graphLabels: [
      { key: 'charm', label: '매력', emoji: '✨' },
      { key: 'love_luck', label: '연애', emoji: '💕' },
      { key: 'marriage_luck', label: '결혼', emoji: '💍' },
      { key: 'spouse_luck', label: '배우자복', emoji: '👫' },
      { key: 'destiny', label: '인연', emoji: '🔗' },
    ],
    prescriptionTitle: '💕 연애 처방전',
    prescriptionFields: ['color', 'number', 'direction', 'item', 'action', 'avoid'],
    prescriptionLabels: { 
      color: '연애운 색상', number: '인연의 숫자', direction: '인연이 오는 방향', 
      item: '연애 아이템', action: '연애운 높이는 행동', avoid: '연애할 때 피할 것'
    },
    showLoveGrade: true,
    showLoveStyle: true,
    showPeakDanger: true,
    showLifetimeFlow: true,
  },

  career: {
    product_id: 'career_exam_fortune',
    icon: '🎯',
    title: '평생 취업·합격운 대분석',
    subtitle: '커리어의 흐름을 읽는 프리미엄 사주 분석',
    buttonText: '내 합격운 분석받기',
    theme: {
      ...SAJU_THEME,
      accent: 'blue',
      text: { ...SAJU_THEME.text, accent: 'text-blue-800' },
      score: 'from-blue-500 to-indigo-500',
    },
    statusMessages: [
      '🎯 커리어 원국을 분석하고 있습니다...',
      '📊 평생 직업 흐름을 계산하고 있습니다...',
      '🏆 당신의 합격 전략을 설계하고 있습니다...',
      '📈 승진/이직 적기를 분석하고 있습니다...',
      '💼 맞춤형 커리어 리포트를 제작하고 있습니다...'
    ],
    graphLabels: [
      { key: 'job_luck', label: '취업', emoji: '💼' },
      { key: 'change_luck', label: '이직', emoji: '🔄' },
      { key: 'exam_luck', label: '시험', emoji: '📝' },
      { key: 'promotion_luck', label: '승진', emoji: '🚀' },
      { key: 'business_luck', label: '사업', emoji: '🏢' },
    ],
    prescriptionTitle: '🎯 합격 처방전',
    prescriptionFields: ['color', 'number', 'direction', 'item', 'action', 'avoid'],
    prescriptionLabels: { 
      color: '면접운 색상', number: '합격의 숫자', direction: '좋은 직장 방향', 
      item: '합격 아이템', action: '면접 전 행동', avoid: '취업할 때 피할 것'
    },
    showCareerGrade: true,
    showCareerType: true,
    showPeakDanger: true,
    showLifetimeFlow: true,
    showExamTiming: true,
  },

  full: {
    product_id: 'lifetime_saju_full',
    icon: '📜',
    title: '나의 평생 사주 대풀이',
    subtitle: '20가지 주제로 완전 분석하는 프리미엄 사주',
    buttonText: '내 사주 완전 분석받기',
    theme: {
      ...SAJU_THEME,
      score: 'from-[#2C3E6B] to-[#B8860B]',
    },
    statusMessages: [
      '📜 사주 원국을 해석하고 있습니다...',
      '⚖️ 오행 밸런스를 분석하고 있습니다...',
      '🌟 일주론을 풀이하고 있습니다...',
      '💰 재물운을 계산하고 있습니다...',
      '💕 연애운을 살펴보고 있습니다...',
      '💼 직업운을 분석하고 있습니다...',
      '🏃 건강운을 확인하고 있습니다...',
      '📅 10년 대운을 계산하고 있습니다...',
      '✨ 개운법을 정리하고 있습니다...',
      '📄 24페이지 리포트를 제작하고 있습니다...'
    ],
    graphLabels: [
      { key: 'wealth', label: '재물', emoji: '💰' },
      { key: 'love', label: '연애', emoji: '💕' },
      { key: 'career', label: '직업', emoji: '💼' },
      { key: 'health', label: '건강', emoji: '🏃' },
      { key: 'family', label: '가족', emoji: '👨‍👩‍👧' },
    ],
    prescriptionTitle: '✨ 평생 개운 처방전',
    prescriptionFields: ['color', 'number', 'direction', 'item', 'action', 'avoid'],
    prescriptionLabels: { 
      color: '행운 색상', number: '행운의 숫자', direction: '좋은 방향', 
      item: '행운 아이템', action: '운 높이는 행동', avoid: '피해야 할 것'
    },
    showFullGrade: true,
    showSajuSummary: true,
    showPeakDanger: true,
    showLifetimeFlow: true,
    showTenYearFortune: true,
    showVisualData: true,
    analysisCount: 20,
  },

  // ══════════════════════════════════════
  // 점성학 상품들 (밝고 화려한)
  // ══════════════════════════════════════

  astro: {
    product_id: '2026_astro_fortune',
    icon: '⭐',
    title: '2026년 점성학 운세',
    subtitle: '별자리로 보는 2026년 운세 분석',
    buttonText: '내 2026년 운세 보기',
    isAstro: true,
    theme: ASTRO_THEME,
    statusMessages: [
      '⭐ 네이탈 차트를 분석하고 있습니다...',
      '🌞 태양 별자리를 확인하고 있습니다...',
      '🌙 달 별자리를 계산하고 있습니다...',
      '💫 2026년 행성 트랜짓을 분석하고 있습니다...',
      '✨ 맞춤형 운세를 작성하고 있습니다...'
    ],
    graphLabels: [
      { key: 'love', label: '연애', emoji: '💕' },
      { key: 'wealth', label: '재물', emoji: '💰' },
      { key: 'career', label: '커리어', emoji: '💼' },
      { key: 'health', label: '건강', emoji: '🏃' },
      { key: 'luck', label: '행운', emoji: '🍀' },
    ],
    prescriptionTitle: '⭐ 2026 행운 처방전',
    prescriptionFields: ['color', 'number', 'direction', 'item', 'action', 'avoid'],
    prescriptionLabels: { 
      color: '행운의 색상', number: '행운의 숫자', direction: '좋은 방향', 
      item: '행운 아이템', action: '운 높이는 행동', avoid: '피해야 할 것'
    },
    showYearGrade: true,
    showMonthlyFortune: true,
    showSunSign: true,
  },

  'astro-wealth': {
    product_id: 'astro_wealth_fortune',
    icon: '💰',
    title: '평생 재물운 (점성학)',
    subtitle: '별자리로 보는 평생 재물운 분석',
    buttonText: '내 재물운 분석받기',
    isAstro: true,
    theme: {
      ...ASTRO_THEME,
      score: 'from-amber-500 to-yellow-500',
    },
    statusMessages: [
      '💰 네이탈 차트를 분석하고 있습니다...',
      '🏦 2하우스 재물궁을 확인하고 있습니다...',
      '💎 금성 배치를 분석하고 있습니다...',
      '📈 평생 재물 흐름을 계산하고 있습니다...',
      '✨ 맞춤형 재물 리포트를 작성하고 있습니다...'
    ],
    graphLabels: [
      { key: 'wealth_luck', label: '재물', emoji: '💰' },
      { key: 'business', label: '사업', emoji: '🏢' },
      { key: 'investment', label: '투자', emoji: '📈' },
      { key: 'salary', label: '급여', emoji: '💼' },
      { key: 'windfall', label: '횡재', emoji: '🎰' },
    ],
    prescriptionTitle: '💎 재물 처방전',
    prescriptionFields: ['color', 'number', 'direction', 'item', 'action', 'avoid'],
    prescriptionLabels: { 
      color: '지갑 색상', number: '재물 행운 숫자', direction: '돈이 오는 방향', 
      item: '재물 아이템', action: '돈 운 높이는 행동', avoid: '재물운 막는 것'
    },
    showWealthGrade: true,
    showMoneyType: true,
    showPeakDanger: true,
    showLifetimeFlow: true,
    showSunSign: true,
  },

  'astro-love': {
    product_id: 'astro_love_fortune',
    icon: '💕',
    title: '평생 연애·결혼운 (점성학)',
    subtitle: '별자리로 보는 평생 연애·결혼운 분석',
    buttonText: '내 연애운 분석받기',
    isAstro: true,
    theme: {
      ...ASTRO_THEME,
      text: { ...ASTRO_THEME.text, accent: 'text-pink-600' },
      score: 'from-pink-500 to-rose-500',
    },
    statusMessages: [
      '💕 네이탈 차트를 분석하고 있습니다...',
      '💑 금성 배치를 확인하고 있습니다...',
      '🔥 화성 배치를 분석하고 있습니다...',
      '💍 7하우스 결혼궁을 살펴보고 있습니다...',
      '✨ 맞춤형 연애 리포트를 작성하고 있습니다...'
    ],
    graphLabels: [
      { key: 'charm', label: '매력', emoji: '✨' },
      { key: 'love_luck', label: '연애', emoji: '💕' },
      { key: 'marriage_luck', label: '결혼', emoji: '💍' },
      { key: 'sexual_chemistry', label: '속궁합', emoji: '🔥' },
      { key: 'destiny', label: '인연', emoji: '🔗' },
    ],
    prescriptionTitle: '💕 연애 처방전',
    prescriptionFields: ['color', 'number', 'direction', 'item', 'action', 'avoid'],
    prescriptionLabels: { 
      color: '연애운 색상', number: '사랑의 숫자', direction: '인연 오는 방향', 
      item: '사랑의 보석', action: '사랑 부르는 행동', avoid: '연애운 막는 것'
    },
    showLoveGrade: true,
    showLoveStyle: true,
    showPeakDanger: true,
    showLifetimeFlow: true,
    showSunSign: true,
    showIdealPartner: true,
  },

  'astro-career': {
    product_id: 'astro_career_fortune',
    icon: '🎯',
    title: '평생 취업·합격운 (점성학)',
    subtitle: '별자리로 보는 평생 커리어·합격운 분석',
    buttonText: '내 합격운 분석받기',
    isAstro: true,
    theme: {
      ...ASTRO_THEME,
      text: { ...ASTRO_THEME.text, accent: 'text-blue-700' },
      score: 'from-blue-500 to-indigo-500',
    },
    statusMessages: [
      '🎯 네이탈 차트를 분석하고 있습니다...',
      '📊 10하우스 커리어궁을 확인하고 있습니다...',
      '🍀 목성 배치를 분석하고 있습니다...',
      '📝 수성 시험운을 살펴보고 있습니다...',
      '✨ 맞춤형 커리어 리포트를 작성하고 있습니다...'
    ],
    graphLabels: [
      { key: 'job_luck', label: '취업', emoji: '💼' },
      { key: 'exam_luck', label: '시험', emoji: '📝' },
      { key: 'promotion_luck', label: '승진', emoji: '🚀' },
      { key: 'leadership', label: '리더십', emoji: '👔' },
      { key: 'wealth_from_career', label: '연봉', emoji: '💰' },
    ],
    prescriptionTitle: '🎯 합격 처방전',
    prescriptionFields: ['color', 'number', 'direction', 'item', 'action', 'avoid'],
    prescriptionLabels: { 
      color: '면접 합격 색상', number: '합격의 숫자', direction: '좋은 직장 방향', 
      item: '성공 아이템', action: '합격 부르는 행동', avoid: '커리어운 막는 것'
    },
    showCareerGrade: true,
    showCareerType: true,
    showPeakDanger: true,
    showLifetimeFlow: true,
    showSunSign: true,
    showExamTiming: true,
  },

  'astro-full': {
    product_id: 'astro_full_fortune',
    icon: '🌟',
    title: '평생 점성학 대풀이',
    subtitle: '15가지 주제로 완전 분석하는 점성학 운세',
    buttonText: '내 점성학 완전 분석받기',
    isAstro: true,
    theme: ASTRO_THEME,
    statusMessages: [
      '🌟 네이탈 차트를 해석하고 있습니다...',
      '🌞 태양 별자리를 분석하고 있습니다...',
      '🌙 달 별자리를 확인하고 있습니다...',
      '⬆️ 상승궁을 계산하고 있습니다...',
      '💫 행성 배치를 분석하고 있습니다...',
      '💰 재물운을 살펴보고 있습니다...',
      '💕 연애운을 분석하고 있습니다...',
      '💼 커리어운을 확인하고 있습니다...',
      '✨ 평생 개운법을 정리하고 있습니다...',
      '📄 15페이지 리포트를 제작하고 있습니다...'
    ],
    graphLabels: [
      { key: 'overall_luck', label: '종합', emoji: '🌟' },
      { key: 'love', label: '연애', emoji: '💕' },
      { key: 'wealth', label: '재물', emoji: '💰' },
      { key: 'career', label: '커리어', emoji: '💼' },
      { key: 'health', label: '건강', emoji: '🏃' },
    ],
    prescriptionTitle: '✨ 평생 개운 처방전',
    prescriptionFields: ['color', 'number', 'direction', 'item', 'action', 'avoid'],
    prescriptionLabels: { 
      color: '평생 행운 색상', number: '인생 행운 숫자', direction: '행운의 방향', 
      item: '수호 원석', action: '운 높이는 행동', avoid: '피해야 할 것'
    },
    showFullGrade: true,
    showSajuSummary: true,
    showPeakDanger: true,
    showLifetimeFlow: true,
    showSunSign: true,
    showVisualData: true,
    analysisCount: 15,
  },

  // ══════════════════════════════════════
  // 달력 상품들
  // ══════════════════════════════════════

  calendar: {
    product_id: '2026_yearly_calendar',
    icon: '🗓️',
    title: '2026년 나만의 운세 달력',
    subtitle: '사주 기반 맞춤형 1년 운세 달력',
    buttonText: '내 운세 달력 만들기',
    theme: CALENDAR_THEME,
    statusMessages: [
      '🗓️ 2026년 달력을 분석하고 있습니다...',
      '📅 매월 중요 날짜를 선별하고 있습니다...',
      '💰 재물운 길일을 찾고 있습니다...',
      '💕 연애운 좋은 날을 계산하고 있습니다...',
      '✨ 맞춤형 운세 달력을 제작하고 있습니다...'
    ],
    graphLabels: [],
    prescriptionTitle: '🍀 2026 개운 처방전',
    prescriptionFields: ['color', 'number', 'direction', 'item', 'action', 'avoid'],
    prescriptionLabels: {
      color: '행운 색상', number: '행운 숫자', direction: '좋은 방위',
      item: '행운 아이템', action: '운 높이는 행동', avoid: '피할 것'
    },
  },
  
  'astro-calendar': {
    product_id: 'astro_yearly_calendar',
    icon: '🔭',
    title: '2026년 점성학 운세 달력',
    subtitle: '별의 움직임으로 보는 나만의 2026년',
    buttonText: '내 점성학 달력 만들기',
    isAstro: true,
    theme: ASTRO_CALENDAR_THEME,
    statusMessages: [
      '🔭 네이탈 차트를 분석하고 있습니다...',
      '🪐 2026년 행성 트랜짓을 계산하고 있습니다...',
      '📊 월별 애스펙트를 분석하고 있습니다...',
      '🔄 역행 기간을 확인하고 있습니다...',
      '🏠 하우스 트랜짓을 계산하고 있습니다...',
      '🔥💧💨🌍 원소 밸런스를 분석하고 있습니다...',
      '✨ 맞춤형 점성학 달력을 제작하고 있습니다...'
    ],
    graphLabels: [],
    prescriptionTitle: '🍀 2026 점성학 개운 처방전',
    prescriptionFields: ['color', 'number', 'direction', 'stone', 'day', 'activity'],
    prescriptionLabels: {
      color: '행운 색상', number: '행운 숫자', direction: '좋은 방위',
      stone: '파워스톤', day: '행운의 요일', activity: '개운 활동'
    },
  }
};

// product_id로 productKey 찾기
const getProductKeyById = (productId) => {
  for (const [key, config] of Object.entries(PRODUCTS)) {
    if (config.product_id === productId) return key;
  }
  return 'saju';
};

export { PRODUCTS, getProductKeyById };