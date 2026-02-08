// ========================================
// products.js - 상품별 설정 (아이보리 테마 리뉴얼)
// ========================================
// 공통 베이스: 아이보리(#FDFBF7) / 베이지(#F5F0E8)
// 사주 계열: 남색 + 금색 (동양적, 단아한)
// 점성학 계열: 인디고 + 보라 (밝지만 화려한)
// ========================================

// ── 사주 공통 테마 ──
// ══════════════════════════════════════
// 달력 테마 (기준 - 절대 수정 금지!)
// ══════════════════════════════════════

// ── 사주 달력 테마 (기준) ──
const CALENDAR_THEME = {
  bg: 'from-[#FAF6F0] via-[#F5EFE6] to-[#EDE5D8]',
  card: 'bg-white/80 border-[#E0D5C3] shadow-sm',
  accent: 'amber',
  button: 'from-[#8B7355] to-[#6B5640] hover:from-[#9B8365] hover:to-[#7B6650] text-white',
  text: {
    primary: 'text-[#3D3225]',
    secondary: 'text-[#6B5B4E]',
    muted: 'text-[#9B8B7E]',
    accent: 'text-[#8B7355]',
  },
  input: 'bg-white/80 border-[#D5C9B8] text-[#3D3225] placeholder-[#9B8B7E] focus:ring-[#8B7355] focus:border-[#8B7355]',
  select: 'bg-white/80',
  score: 'from-[#8B7355] to-[#B8963E]',
};

// ── 점성학 달력 테마 (기준) ──
const ASTRO_CALENDAR_THEME = {
  bg: 'from-[#F8F5FA] via-[#F0ECF5] to-[#E8E0F0]',
  card: 'bg-white/80 border-[#D5CCE0] shadow-sm',
  accent: 'purple',
  button: 'from-[#6B5B8A] to-[#524470] hover:from-[#7B6B9A] hover:to-[#625480] text-white',
  text: {
    primary: 'text-[#2D2540]',
    secondary: 'text-[#5B4E6B]',
    muted: 'text-[#8B7E9B]',
    accent: 'text-[#6B5B8A]',
  },
  input: 'bg-white/80 border-[#D5CCE0] text-[#2D2540] placeholder-[#8B7E9B] focus:ring-[#6B5B8A] focus:border-[#6B5B8A]',
  select: 'bg-white/80',
  score: 'from-[#6B5B8A] to-[#8B6BAA]',
};

// ══════════════════════════════════════
// 상품 테마 (달력 기준으로 통일)
// ══════════════════════════════════════

// ── 사주 공통 테마 (= 사주 달력과 동일) ──
const SAJU_THEME = { ...CALENDAR_THEME };

// ── 점성학 공통 테마 (= 점성학 달력과 동일) ──
const ASTRO_THEME = { ...ASTRO_CALENDAR_THEME };


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
    prescriptionFields: ['color', 'item', 'action', 'routine', 'season_tip', 'avoid'],
    prescriptionLabels: { color: '행운 색상·소재', item: '개운 아이템', action: '운 높이는 행동', routine: '매일 실천 루틴', season_tip: '올해 특별 처방', avoid: '주의할 것' },
    showVisualData: true,
  },
  
  wealth: {
    product_id: 'lifetime_wealth_fortune',
    icon: '💰',
    title: '평생 재물운 대분석',
    subtitle: '돈의 흐름을 읽는 프리미엄 사주 분석',
    buttonText: '내 재물운 분석받기',
    theme: SAJU_THEME,
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
    prescriptionFields: ['wallet_color', 'invest_timing', 'money_item', 'saving_method', 'side_income', 'money_avoid'],
    prescriptionLabels: { 
      wallet_color: '지갑·통장 색상', invest_timing: '투자 적기·방법', money_item: '재물 부적·아이템', 
      saving_method: '맞춤 저축 전략', side_income: '부업·부수입 적성', money_avoid: '돈 잃기 쉬운 상황'
    },
    showWealthGrade: true,
    showVisualData: true,
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
    theme: SAJU_THEME,
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
    prescriptionFields: ['charm_color', 'ideal_type', 'date_spot', 'love_action', 'confession_timing', 'love_avoid'],
    prescriptionLabels: { 
      charm_color: '매력 UP 색상·패션', ideal_type: '운명의 상대 특징', date_spot: '인연 만나는 장소', 
      love_action: '연애운 높이는 행동', confession_timing: '고백·프로포즈 적기', love_avoid: '연애 시 주의 패턴'
    },
    showLoveGrade: true,
    showVisualData: true,
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
    theme: SAJU_THEME,
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
    prescriptionFields: ['interview_color', 'study_time', 'focus_item', 'exam_routine', 'career_fit', 'career_avoid'],
    prescriptionLabels: { 
      interview_color: '면접·시험 필승 색상', study_time: '집중력 최고 시간대', focus_item: '합격 부적·집중 아이템', 
      exam_routine: '시험 전 루틴', career_fit: '적성에 맞는 직종', career_avoid: '합격 방해 패턴'
    },
    showCareerGrade: true,
    showVisualData: true,
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
    theme: SAJU_THEME,
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
    prescriptionFields: ['life_color', 'power_stone', 'daily_habit', 'yearly_ritual', 'relationship_tip', 'life_avoid'],
    prescriptionLabels: { 
      life_color: '평생 행운 색상·소재', power_stone: '수호 원석·부적', daily_habit: '매일 실천할 습관', 
      yearly_ritual: '매년 반복할 의식', relationship_tip: '대인관계 처방', life_avoid: '평생 주의할 패턴'
    },
    showFullGrade: true,
    showVisualData: true,
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
    prescriptionFields: ['lucky_color', 'power_stone', 'lucky_day', 'ritual', 'element_boost', 'planet_avoid'],
    prescriptionLabels: { 
      lucky_color: '행운 색상·패션', power_stone: '파워스톤·원석', lucky_day: '행운의 요일·시간', 
      ritual: '매일 실천 의식', element_boost: '부족 원소 보충법', planet_avoid: '행성 주의사항'
    },
    showYearGrade: true,
    showVisualData: true,
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
    theme: ASTRO_THEME,
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
    prescriptionFields: ['wallet_color', 'wealth_stone', 'invest_day', 'money_ritual', 'abundance_action', 'wealth_block'],
    prescriptionLabels: { 
      wallet_color: '지갑·금고 색상', wealth_stone: '재물 원석', invest_day: '투자 최적 요일', 
      money_ritual: '재물 끌어당기는 루틴', abundance_action: '풍요 에너지 활동', wealth_block: '재물운 차단 요소'
    },
    showWealthGrade: true,
    showVisualData: true,
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
    theme: ASTRO_THEME,
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
    prescriptionFields: ['charm_style', 'love_stone', 'date_day', 'venus_ritual', 'attract_action', 'love_block'],
    prescriptionLabels: { 
      charm_style: '매력 UP 색상·스타일', love_stone: '사랑의 원석', date_day: '데이트 최적 요일', 
      venus_ritual: '금성 에너지 루틴', attract_action: '인연 끌어당기는 행동', love_block: '연애운 차단 요소'
    },
    showLoveGrade: true,
    showVisualData: true,
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
    theme: ASTRO_THEME,
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
    prescriptionFields: ['power_color', 'focus_stone', 'study_day', 'saturn_ritual', 'career_action', 'career_block'],
    prescriptionLabels: { 
      power_color: '면접 필승 색상', focus_stone: '집중력 원석', study_day: '공부 최적 요일', 
      saturn_ritual: '토성 에너지 루틴', career_action: '합격 끌어당기는 행동', career_block: '합격운 차단 요소'
    },
    showCareerGrade: true,
    showVisualData: true,
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
    prescriptionFields: ['life_color', 'guardian_stone', 'power_day', 'star_ritual', 'soul_mission', 'karma_avoid'],
    prescriptionLabels: { 
      life_color: '평생 행운 색상', guardian_stone: '수호 원석', power_day: '파워 요일·시간', 
      star_ritual: '별의 에너지 루틴', soul_mission: '영혼의 미션', karma_avoid: '카르마 주의 패턴'
    },
    showFullGrade: true,
    showVisualData: true,
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