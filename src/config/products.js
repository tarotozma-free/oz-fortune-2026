// ========================================
// products.js - 상품별 설정
// ========================================

const PRODUCTS = {
  saju: {
    product_id: '2026_vip_saju',
    icon: '🔮',
    title: '2026년 VIP 신년운세',
    subtitle: '프리미엄 사주 분석 리포트',
    buttonText: '내 운세 분석받기',
    theme: {
      bg: 'from-purple-900 via-indigo-900 to-blue-900',
      card: 'bg-white/10 border-white/20',
      accent: 'purple',
      button: 'from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600',
      text: {
        primary: 'text-white',
        secondary: 'text-purple-200',
        muted: 'text-purple-400/60',
        accent: 'text-purple-400',
      },
      input: 'bg-white/10 border-white/20 text-white placeholder-purple-300 focus:ring-purple-400',
      select: 'bg-gray-800',
      score: 'from-yellow-400 to-orange-500',
    },
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
      bg: 'from-gray-900 via-amber-950 to-gray-900',
      card: 'bg-black/40 border-amber-500/30',
      accent: 'amber',
      button: 'from-yellow-500 via-amber-500 to-yellow-600 hover:from-yellow-400 hover:to-amber-400 text-gray-900',
      text: {
        primary: 'text-white',
        secondary: 'text-amber-200',
        muted: 'text-amber-400/60',
        accent: 'text-amber-400',
      },
      input: 'bg-black/30 border-amber-500/30 text-white placeholder-amber-300/50 focus:ring-amber-400',
      select: 'bg-gray-900',
      score: 'from-yellow-400 to-amber-500',
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
      color: '지갑 색상', 
      number: '행운의 숫자', 
      direction: '돈이 오는 방향', 
      item: '재물 아이템',
      action: '투자 타이밍',
      avoid: '피해야 할 것'
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
      bg: 'from-pink-950 via-rose-900 to-red-950',
      card: 'bg-black/40 border-pink-500/30',
      accent: 'pink',
      button: 'from-pink-500 via-rose-500 to-red-500 hover:from-pink-400 hover:to-rose-400 text-white',
      text: {
        primary: 'text-white',
        secondary: 'text-pink-200',
        muted: 'text-pink-400/60',
        accent: 'text-pink-400',
      },
      input: 'bg-black/30 border-pink-500/30 text-white placeholder-pink-300/50 focus:ring-pink-400',
      select: 'bg-gray-900',
      score: 'from-pink-400 to-rose-500',
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
      color: '연애운 색상', 
      number: '인연의 숫자', 
      direction: '인연이 오는 방향', 
      item: '연애 아이템',
      action: '연애운 높이는 행동',
      avoid: '연애할 때 피할 것'
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
      bg: 'from-slate-950 via-blue-950 to-indigo-950',
      card: 'bg-black/40 border-blue-500/30',
      accent: 'blue',
      button: 'from-blue-500 via-indigo-500 to-blue-600 hover:from-blue-400 hover:to-indigo-400 text-white',
      text: {
        primary: 'text-white',
        secondary: 'text-blue-200',
        muted: 'text-blue-400/60',
        accent: 'text-blue-400',
      },
      input: 'bg-black/30 border-blue-500/30 text-white placeholder-blue-300/50 focus:ring-blue-400',
      select: 'bg-gray-900',
      score: 'from-blue-400 to-indigo-500',
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
      color: '면접운 색상', 
      number: '합격의 숫자', 
      direction: '좋은 직장 방향', 
      item: '합격 아이템',
      action: '면접 전 행동',
      avoid: '취업할 때 피할 것'
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
      bg: 'from-violet-950 via-purple-900 to-indigo-950',
      card: 'bg-black/40 border-violet-500/30',
      accent: 'violet',
      button: 'from-violet-500 via-purple-500 to-indigo-500 hover:from-violet-400 hover:to-purple-400 text-white',
      text: {
        primary: 'text-white',
        secondary: 'text-violet-200',
        muted: 'text-violet-400/60',
        accent: 'text-violet-400',
      },
      input: 'bg-black/30 border-violet-500/30 text-white placeholder-violet-300/50 focus:ring-violet-400',
      select: 'bg-gray-900',
      score: 'from-violet-400 to-purple-500',
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
  color: '행운 색상', 
  number: '행운의 숫자', 
  direction: '좋은 방향', 
  item: '행운 아이템',
  action: '운 높이는 행동',
  avoid: '피해야 할 것'
},
    showFullGrade: true,
    showSajuSummary: true,
    showPeakDanger: true,
    showLifetimeFlow: true,
    showTenYearFortune: true,
    showVisualData: true,  // ⬅️ 이거 추가!
    analysisCount: 20,
  },

  // ========================================
  // 점성학 상품들
  // ========================================
  astro: {
    product_id: '2026_astro_fortune',
    icon: '⭐',
    title: '2026년 점성학 운세',
    subtitle: '별자리로 보는 2026년 운세 분석',
    buttonText: '내 2026년 운세 보기',
    isAstro: true,
    theme: {
      bg: 'from-indigo-950 via-purple-900 to-blue-950',
      card: 'bg-black/40 border-indigo-500/30',
      accent: 'indigo',
      button: 'from-indigo-500 via-purple-500 to-blue-500 hover:from-indigo-400 hover:to-purple-400 text-white',
      text: {
        primary: 'text-white',
        secondary: 'text-indigo-200',
        muted: 'text-indigo-400/60',
        accent: 'text-indigo-400',
      },
      input: 'bg-black/30 border-indigo-500/30 text-white placeholder-indigo-300/50 focus:ring-indigo-400',
      select: 'bg-gray-900',
      score: 'from-indigo-400 to-purple-500',
    },
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
      color: '행운의 색상', 
      number: '행운의 숫자', 
      direction: '좋은 방향', 
      item: '행운 아이템',
      action: '운 높이는 행동',
      avoid: '피해야 할 것'
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
      bg: 'from-gray-900 via-amber-950 to-gray-900',
      card: 'bg-black/40 border-amber-500/30',
      accent: 'amber',
      button: 'from-yellow-500 via-amber-500 to-yellow-600 hover:from-yellow-400 hover:to-amber-400 text-gray-900',
      text: {
        primary: 'text-white',
        secondary: 'text-amber-200',
        muted: 'text-amber-400/60',
        accent: 'text-amber-400',
      },
      input: 'bg-black/30 border-amber-500/30 text-white placeholder-amber-300/50 focus:ring-amber-400',
      select: 'bg-gray-900',
      score: 'from-yellow-400 to-amber-500',
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
      color: '지갑 색상', 
      number: '재물 행운 숫자', 
      direction: '돈이 오는 방향', 
      item: '재물 아이템',
      action: '돈 운 높이는 행동',
      avoid: '재물운 막는 것'
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
      bg: 'from-pink-950 via-rose-900 to-red-950',
      card: 'bg-black/40 border-pink-500/30',
      accent: 'pink',
      button: 'from-pink-500 via-rose-500 to-red-500 hover:from-pink-400 hover:to-rose-400 text-white',
      text: {
        primary: 'text-white',
        secondary: 'text-pink-200',
        muted: 'text-pink-400/60',
        accent: 'text-pink-400',
      },
      input: 'bg-black/30 border-pink-500/30 text-white placeholder-pink-300/50 focus:ring-pink-400',
      select: 'bg-gray-900',
      score: 'from-pink-400 to-rose-500',
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
      color: '연애운 색상', 
      number: '사랑의 숫자', 
      direction: '인연 오는 방향', 
      item: '사랑의 보석',
      action: '사랑 부르는 행동',
      avoid: '연애운 막는 것'
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
      bg: 'from-slate-950 via-blue-950 to-indigo-950',
      card: 'bg-black/40 border-blue-500/30',
      accent: 'blue',
      button: 'from-blue-500 via-indigo-500 to-blue-600 hover:from-blue-400 hover:to-indigo-400 text-white',
      text: {
        primary: 'text-white',
        secondary: 'text-blue-200',
        muted: 'text-blue-400/60',
        accent: 'text-blue-400',
      },
      input: 'bg-black/30 border-blue-500/30 text-white placeholder-blue-300/50 focus:ring-blue-400',
      select: 'bg-gray-900',
      score: 'from-blue-400 to-indigo-500',
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
      color: '면접 합격 색상', 
      number: '합격의 숫자', 
      direction: '좋은 직장 방향', 
      item: '성공 아이템',
      action: '합격 부르는 행동',
      avoid: '커리어운 막는 것'
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
    theme: {
      bg: 'from-violet-950 via-purple-900 to-indigo-950',
      card: 'bg-black/40 border-violet-500/30',
      accent: 'violet',
      button: 'from-violet-500 via-purple-500 to-indigo-500 hover:from-violet-400 hover:to-purple-400 text-white',
      text: {
        primary: 'text-white',
        secondary: 'text-violet-200',
        muted: 'text-violet-400/60',
        accent: 'text-violet-400',
      },
      input: 'bg-black/30 border-violet-500/30 text-white placeholder-violet-300/50 focus:ring-violet-400',
      select: 'bg-gray-900',
      score: 'from-violet-400 to-purple-500',
    },
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
      color: '평생 행운 색상', 
      number: '인생 행운 숫자', 
      direction: '행운의 방향', 
      item: '수호 원석',
      action: '운 높이는 행동',
      avoid: '피해야 할 것'
    },
    showFullGrade: true,
    showSajuSummary: true,
    showPeakDanger: true,
    showLifetimeFlow: true,
    showSunSign: true,
    showVisualData: true,  // ⬅️ 이거 추가!
    analysisCount: 15,
  },

  calendar: {
    product_id: '2026_yearly_calendar',
    icon: '🗓️',
    title: '2026년 나만의 운세 달력',
    subtitle: '사주 기반 맞춤형 1년 운세 달력',
    buttonText: '내 운세 달력 만들기',
    theme: {
      bg: 'from-emerald-950 via-teal-900 to-cyan-950',
      card: 'bg-black/40 border-emerald-500/30',
      accent: 'emerald',
      button: 'from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-teal-400 text-white',
      text: {
        primary: 'text-white',
        secondary: 'text-emerald-200',
        muted: 'text-emerald-400/60',
        accent: 'text-emerald-400',
      },
      input: 'bg-black/30 border-emerald-500/30 text-white placeholder-emerald-300/50 focus:ring-emerald-400',
      select: 'bg-gray-900',
      score: 'from-emerald-400 to-teal-500',
    },
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
  }
};

// product_id로 productKey 찾기
const getProductKeyById = (productId) => {
  for (const [key, config] of Object.entries(PRODUCTS)) {
    if (config.product_id === productId) return key;
  }
  return 'saju'; // 기본값
};

export { PRODUCTS, getProductKeyById };