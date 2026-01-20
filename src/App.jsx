import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { BrowserRouter, Routes, Route, Navigate, useParams, useSearchParams } from 'react-router-dom';

import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import AuthCallback from './pages/AuthCallback';
import ProgramSelect from './pages/ProgramSelect';
import ProfileManage from './pages/ProfileManage';

const supabase = createClient(
  'https://mwgvdtwxiiluwdxtbqgz.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im13Z3ZkdHd4aWlsdXdkeHRicWd6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg0NDM2NzEsImV4cCI6MjA4NDAxOTY3MX0.XnK-V2r2Sb6Ndqw2HocTmrE2ujOLY-etBqpzD9dOZoo'
);

// ========================================
// 상품별 설정 (테마, 텍스트, product_id)
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
  }
};

// product_id로 productKey 찾기
const getProductKeyById = (productId) => {
  for (const [key, config] of Object.entries(PRODUCTS)) {
    if (config.product_id === productId) return key;
  }
  return 'saju'; // 기본값
};

// ========================================
// 사주 팔자표 비주얼 컴포넌트 (NEW!)
// ========================================
const SajuPillarsChart = ({ visualData, theme }) => {
  if (!visualData?.saju_pillars) return null;
  
  const { saju_pillars, ohaeng_balance, ilgan, yongshin, gyeokguk } = visualData;
  
  const elementColors = {
    '목': 'from-green-500 to-emerald-600', '화': 'from-red-500 to-orange-600',
    '토': 'from-yellow-600 to-amber-700', '금': 'from-gray-300 to-slate-400',
    '수': 'from-blue-500 to-indigo-600',
    'wood': 'from-green-500 to-emerald-600', 'fire': 'from-red-500 to-orange-600',
    'earth': 'from-yellow-600 to-amber-700', 'metal': 'from-gray-300 to-slate-400',
    'water': 'from-blue-500 to-indigo-600',
  };
  
  const ohaengKorean = { 'wood': '목', 'fire': '화', 'earth': '토', 'metal': '금', 'water': '수' };
  const ohaengEmoji = { 'wood': '🌳', 'fire': '🔥', 'earth': '🏔️', 'metal': '⚙️', 'water': '💧' };

  return (
    <div className="space-y-6">
      <div className={`${theme.card} rounded-2xl p-6 border`}>
        <h3 className={`${theme.text.accent} font-bold mb-4 text-center text-lg`}>📜 당신의 사주 팔자</h3>
        
        <div className="grid grid-cols-4 gap-2 mb-6">
          {['시주', '일주', '월주', '년주'].map((label, i) => (
            <div key={i} className={`text-center ${theme.text.muted} text-sm py-2`}>{label}</div>
          ))}
          
          {['hour', 'day', 'month', 'year'].map((pillar, i) => {
            const data = saju_pillars[pillar];
            if (!data) return <div key={`c${i}`} className="text-center">-</div>;
            const element = data.천간_element || data.천간_kr?.slice(-1);
            return (
              <div key={`c${i}`} className={`text-center p-3 rounded-xl bg-gradient-to-br ${elementColors[element] || 'from-gray-500 to-gray-600'}`}>
                <div className="text-2xl font-bold text-white">{data.천간}</div>
                <div className="text-xs text-white/80">{data.천간_kr}</div>
              </div>
            );
          })}
          
          {['hour', 'day', 'month', 'year'].map((pillar, i) => {
            const data = saju_pillars[pillar];
            if (!data) return <div key={`j${i}`} className="text-center">-</div>;
            const element = data.지지_element || data.지지_kr?.slice(-1);
            return (
              <div key={`j${i}`} className={`text-center p-3 rounded-xl bg-gradient-to-br ${elementColors[element] || 'from-gray-500 to-gray-600'}`}>
                <div className="text-2xl font-bold text-white">{data.지지}</div>
                <div className="text-xs text-white/80">{data.지지_kr}</div>
              </div>
            );
          })}
        </div>
        
        <div className="grid grid-cols-3 gap-3">
          {ilgan && (
            <div className={`${theme.card} rounded-xl p-3 border text-center`}>
              <div className="text-2xl mb-1">{ilgan.char}</div>
              <div className={`${theme.text.accent} font-bold text-sm`}>일간</div>
              <div className={`${theme.text.primary} text-sm`}>{ilgan.name}</div>
              <div className={`${theme.text.muted} text-xs mt-1`}>{ilgan.desc}</div>
            </div>
          )}
          {yongshin && (
            <div className={`${theme.card} rounded-xl p-3 border text-center`}>
              <div className="text-2xl mb-1">{yongshin.char}</div>
              <div className={`${theme.text.accent} font-bold text-sm`}>용신</div>
              <div className={`${theme.text.primary} text-sm`}>{yongshin.name}</div>
              <div className={`${theme.text.muted} text-xs mt-1`}>{yongshin.desc}</div>
            </div>
          )}
          {gyeokguk && (
            <div className={`${theme.card} rounded-xl p-3 border text-center`}>
              <div className="text-2xl mb-1">⚖️</div>
              <div className={`${theme.text.accent} font-bold text-sm`}>격국</div>
              <div className={`${theme.text.primary} text-sm`}>{gyeokguk.name || gyeokguk}</div>
            </div>
          )}
        </div>
      </div>
      
      {ohaeng_balance && (
        <div className={`${theme.card} rounded-2xl p-6 border`}>
          <h3 className={`${theme.text.accent} font-bold mb-4 text-center`}>⚖️ 오행 밸런스</h3>
          <div className="space-y-3">
            {Object.entries(ohaeng_balance).map(([element, data]) => {
              const percent = data.percent || 0;
              const status = data.status;
              const korean = ohaengKorean[element] || element;
              const emoji = ohaengEmoji[element] || '⭐';
              
              return (
                <div key={element} className="flex items-center gap-3">
                  <div className="w-12 text-center">
                    <span className="text-lg">{emoji}</span>
                    <div className={`${theme.text.primary} text-xs`}>{korean}</div>
                  </div>
                  <div className="flex-1">
                    <div className="h-4 bg-black/30 rounded-full overflow-hidden">
                      <div className={`h-full bg-gradient-to-r ${elementColors[element]} transition-all duration-500 rounded-full`}
                        style={{ width: `${percent}%` }} />
                    </div>
                  </div>
                  <div className={`w-16 text-right ${theme.text.primary} text-sm font-bold`}>{percent}%</div>
                  {status && status !== '적정' && (
                    <div className={`text-xs px-2 py-1 rounded ${status === '부족' ? 'bg-red-500/30 text-red-300' : 'bg-yellow-500/30 text-yellow-300'}`}>
                      {status}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

// ========================================
// 점성학 행성 배치표 비주얼 컴포넌트 (NEW!)
// ========================================
const AstroPlanetsChart = ({ visualData, theme }) => {
  if (!visualData) return null;
  
  const { big_three, planets, element_balance, dominant_planet, chart_pattern } = visualData;
  
  const elementColors = {
    'fire': 'from-red-500 to-orange-600', 'earth': 'from-yellow-600 to-amber-700',
    'air': 'from-cyan-400 to-blue-500', 'water': 'from-blue-500 to-indigo-600',
  };
  const elementKorean = { 'fire': '🔥 불', 'earth': '🌍 흙', 'air': '💨 공기', 'water': '💧 물' };
  const planetEmoji = {
    'mercury': '☿', 'venus': '♀', 'mars': '♂', 'jupiter': '♃',
    'saturn': '♄', 'uranus': '♅', 'neptune': '♆', 'pluto': '♇'
  };
  const planetKorean = {
    'mercury': '수성', 'venus': '금성', 'mars': '화성', 'jupiter': '목성',
    'saturn': '토성', 'uranus': '천왕성', 'neptune': '해왕성', 'pluto': '명왕성'
  };

  return (
    <div className="space-y-6">
      {big_three && (
        <div className={`${theme.card} rounded-2xl p-6 border`}>
          <h3 className={`${theme.text.accent} font-bold mb-4 text-center text-lg`}>🌟 당신의 빅 쓰리</h3>
          <div className="grid grid-cols-3 gap-4">
            {big_three.sun && (
              <div className="text-center">
                <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center mb-2 shadow-lg shadow-yellow-500/30">
                  <span className="text-3xl">{big_three.sun.symbol || '☉'}</span>
                </div>
                <div className={`${theme.text.accent} font-bold`}>태양</div>
                <div className={`${theme.text.primary} text-lg font-bold`}>{big_three.sun.sign}</div>
                {big_three.sun.degree && <div className={`${theme.text.muted} text-xs`}>{big_three.sun.degree}</div>}
                {big_three.sun.house && <div className={`${theme.text.muted} text-xs`}>{big_three.sun.house}하우스</div>}
              </div>
            )}
            {big_three.moon && (
              <div className="text-center">
                <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-slate-300 to-slate-500 flex items-center justify-center mb-2 shadow-lg shadow-slate-500/30">
                  <span className="text-3xl">{big_three.moon.symbol || '☽'}</span>
                </div>
                <div className={`${theme.text.accent} font-bold`}>달</div>
                <div className={`${theme.text.primary} text-lg font-bold`}>{big_three.moon.sign}</div>
                {big_three.moon.degree && <div className={`${theme.text.muted} text-xs`}>{big_three.moon.degree}</div>}
                {big_three.moon.house && <div className={`${theme.text.muted} text-xs`}>{big_three.moon.house}하우스</div>}
              </div>
            )}
            {big_three.rising && (
              <div className="text-center">
                <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-purple-400 to-indigo-600 flex items-center justify-center mb-2 shadow-lg shadow-purple-500/30">
                  <span className="text-3xl">{big_three.rising.symbol || '⬆'}</span>
                </div>
                <div className={`${theme.text.accent} font-bold`}>상승궁</div>
                <div className={`${theme.text.primary} text-lg font-bold`}>{big_three.rising.sign}</div>
                {big_three.rising.degree && <div className={`${theme.text.muted} text-xs`}>{big_three.rising.degree}</div>}
              </div>
            )}
          </div>
        </div>
      )}
      
      {planets && Object.keys(planets).length > 0 && (
        <div className={`${theme.card} rounded-2xl p-6 border`}>
          <h3 className={`${theme.text.accent} font-bold mb-4 text-center`}>💫 행성 배치</h3>
          <div className="space-y-2">
            {Object.entries(planets).map(([planet, data]) => (
              <div key={planet} className={`flex items-center gap-3 ${theme.card} rounded-lg p-3 border`}>
                <div className="w-8 text-center text-xl">{planetEmoji[planet] || data.symbol || '⭐'}</div>
                <div className="w-16">
                  <div className={`${theme.text.primary} font-bold text-sm`}>{planetKorean[planet] || planet}</div>
                </div>
                <div className="flex-1">
                  <div className={`${theme.text.secondary}`}>{data.sign} {data.symbol}</div>
                </div>
                <div className={`${theme.text.muted} text-sm`}>{data.degree}</div>
                <div className={`${theme.text.muted} text-sm w-12`}>{data.house}H</div>
                {data.retrograde && (
                  <div className="text-xs px-2 py-1 rounded bg-red-500/30 text-red-300">Ⓡ</div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      
      {element_balance && (
        <div className={`${theme.card} rounded-2xl p-6 border`}>
          <h3 className={`${theme.text.accent} font-bold mb-4 text-center`}>🌈 원소 밸런스</h3>
          <div className="grid grid-cols-4 gap-3">
            {Object.entries(element_balance).map(([element, data]) => {
              const percent = data.percent || 0;
              return (
                <div key={element} className="text-center">
                  <div className="h-24 bg-black/30 rounded-xl overflow-hidden flex flex-col justify-end">
                    <div className={`bg-gradient-to-t ${elementColors[element]} transition-all duration-500 rounded-b-xl`}
                      style={{ height: `${percent}%` }} />
                  </div>
                  <div className={`${theme.text.primary} font-bold mt-2`}>{percent}%</div>
                  <div className={`${theme.text.muted} text-xs`}>{elementKorean[element]}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}
      
      {(dominant_planet || chart_pattern) && (
        <div className="grid grid-cols-2 gap-4">
          {dominant_planet && (
            <div className={`${theme.card} rounded-xl p-4 border text-center`}>
              <div className="text-2xl mb-2">⭐</div>
              <div className={`${theme.text.accent} font-bold text-sm`}>지배 행성</div>
              <div className={`${theme.text.primary} font-bold`}>{dominant_planet.planet}</div>
              <div className={`${theme.text.muted} text-xs mt-1`}>{dominant_planet.reason}</div>
            </div>
          )}
          {chart_pattern && (
            <div className={`${theme.card} rounded-xl p-4 border text-center`}>
              <div className="text-2xl mb-2">📊</div>
              <div className={`${theme.text.accent} font-bold text-sm`}>차트 패턴</div>
              <div className={`${theme.text.primary} font-bold`}>{chart_pattern.type}</div>
              <div className={`${theme.text.muted} text-xs mt-1`}>{chart_pattern.description}</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ========================================
// 꺾은선 그래프 컴포넌트 (재물운/연애운 공용)
// ========================================
const LifetimeFlowChart = ({ data, theme, lineColor = '#FFD700' }) => {
  if (!data || data.length === 0) return null;
  
  const maxScore = 100;
  const width = 100;
  const height = 60;
  const padding = 10;
  
  const points = data.map((item, i) => {
    const x = padding + (i * (width - padding * 2) / (data.length - 1));
    const y = height - padding - ((item.score / maxScore) * (height - padding * 2));
    return { x, y, ...item };
  });
  
  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const areaD = `${pathD} L ${points[points.length-1].x} ${height - padding} L ${padding} ${height - padding} Z`;
  
  return (
    <div className="w-full">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-40">
        <defs>
          <linearGradient id="flowGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={lineColor} stopOpacity="0.6" />
            <stop offset="100%" stopColor={lineColor} stopOpacity="0.1" />
          </linearGradient>
          <linearGradient id="flowLineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={lineColor} />
            <stop offset="50%" stopColor={lineColor} />
            <stop offset="100%" stopColor={lineColor} />
          </linearGradient>
        </defs>
        
        {[0, 25, 50, 75, 100].map((val, i) => {
          const y = height - padding - ((val / maxScore) * (height - padding * 2));
          return (
            <line key={i} x1={padding} y1={y} x2={width - padding} y2={y} 
              stroke={`${lineColor}33`} strokeWidth="0.3" strokeDasharray="2,2" />
          );
        })}
        
        <path d={areaD} fill="url(#flowGradient)" />
        <path d={pathD} fill="none" stroke="url(#flowLineGradient)" strokeWidth="1.5" strokeLinecap="round" />
        
        {points.map((p, i) => (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r="2.5" fill="#1F2937" stroke={lineColor} strokeWidth="1.5" />
            <text x={p.x} y={height - 2} textAnchor="middle" className="text-[4px]" fill={lineColor}>{p.age_range}</text>
          </g>
        ))}
      </svg>
      
     <div className="grid grid-cols-5 gap-1 mt-4">
  {data.map((item, i) => (
    <div key={i} className="text-center">
      <div className={`${theme.text.accent} font-bold text-sm`}>{item.score}점</div>
      <div className={`${theme.text.muted} text-xs leading-tight px-1`}>
        {item.hook?.length > 12 ? item.hook.substring(0, 12) + '...' : item.hook}
      </div>
    </div>
  ))}
</div>
    </div>
  );
};

// ========================================
// 등급 뱃지 컴포넌트 (재물운/연애운 공용)
// ========================================
const GradeBadge = ({ grade, hook, type = 'wealth' }) => {
  const colorSchemes = {
    wealth: {
      colors: {
        'S': 'from-yellow-400 via-amber-300 to-yellow-500',
        'A': 'from-amber-400 via-yellow-400 to-amber-500',
        'B': 'from-gray-300 via-gray-200 to-gray-400',
        'C': 'from-orange-700 via-orange-600 to-orange-800',
        'D': 'from-stone-500 via-stone-400 to-stone-600'
      },
      labels: {
        'S': '최상급 재물복', 'A': '상급 재물복', 'B': '중급 재물복', 'C': '관리형 재물복', 'D': '노력형 재물복'
      },
      shadow: 'shadow-amber-500/30',
      textColor: 'text-amber-400',
      hookColor: 'text-amber-200/80'
    },
    love: {
      colors: {
        'S': 'from-pink-400 via-rose-300 to-pink-500',
        'A': 'from-rose-400 via-pink-400 to-rose-500',
        'B': 'from-pink-300 via-pink-200 to-pink-400',
        'C': 'from-rose-600 via-rose-500 to-rose-700',
        'D': 'from-pink-700 via-pink-600 to-pink-800'
      },
      labels: {
        'S': '타고난 연애고수', 'A': '매력 넘치는 인연', 'B': '평범한 연애운', 'C': '노력형 연애운', 'D': '대기만성 연애운'
      },
      shadow: 'shadow-pink-500/30',
      textColor: 'text-pink-400',
      hookColor: 'text-pink-200/80'
    },
    career: {
      colors: {
        'S': 'from-blue-400 via-indigo-300 to-blue-500',
        'A': 'from-indigo-400 via-blue-400 to-indigo-500',
        'B': 'from-blue-300 via-blue-200 to-blue-400',
        'C': 'from-indigo-600 via-indigo-500 to-indigo-700',
        'D': 'from-blue-700 via-blue-600 to-blue-800'
      },
      labels: {
        'S': '타고난 합격체질', 'A': '상위권 커리어', 'B': '평균 커리어운', 'C': '노력형 커리어', 'D': '대기만성 합격운'
      },
      shadow: 'shadow-blue-500/30',
      textColor: 'text-blue-400',
      hookColor: 'text-blue-200/80'
    },
    full: {
      colors: {
        'S': 'from-violet-400 via-purple-300 to-violet-500',
        'A': 'from-purple-400 via-violet-400 to-purple-500',
        'B': 'from-violet-300 via-violet-200 to-violet-400',
        'C': 'from-purple-600 via-purple-500 to-purple-700',
        'D': 'from-violet-700 via-violet-600 to-violet-800'
      },
      labels: {
        'S': '천생 복덩이 사주', 'A': '상위 10% 사주', 'B': '평균 이상 사주', 'C': '노력형 사주', 'D': '대기만성 사주'
      },
      shadow: 'shadow-violet-500/30',
      textColor: 'text-violet-400',
      hookColor: 'text-violet-200/80'
    }
  };
  
  const scheme = colorSchemes[type] || colorSchemes.wealth;
  
  return (
    <div className="text-center">
      <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br ${scheme.colors[grade] || scheme.colors['B']} shadow-lg ${scheme.shadow}`}>
        <span className="text-4xl font-black text-gray-900">{grade}</span>
      </div>
      <div className={`${scheme.textColor} font-bold mt-2`}>{scheme.labels[grade] || '운세'}</div>
      {hook && <div className={`${scheme.hookColor} text-sm mt-1 italic`}>"{hook}"</div>}
    </div>
  );
};

// ========================================
// 요약본 컴포넌트 (결과 페이지용)
// ========================================
const SummaryView = ({ config, theme, formData, result, onBack, onShowFull, displayName }) => {
  const ai = result?.aiResponse || {};
  const prescription = ai.lucky_prescription || {};
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

// ========================================
// 풀버전 컴포넌트 (전체 분석 내용)
// ========================================
const FullView = ({ config, theme, formData, result, onBack, displayName }) => {
  const ai = result?.aiResponse || {};
  const prescription = ai.lucky_prescription || {};
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

        {/* 개운 처방전 */}
        {Object.keys(prescription).length > 0 && (
          <div className={`${theme.card} print:bg-gray-50 rounded-2xl p-6 mt-8 border print:border-gray-300`}>
            <h2 className={`text-xl font-bold ${theme.text.primary} print:text-gray-800 mb-4`}>{config.prescriptionTitle}</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {config.prescriptionFields?.map(field => (
                prescription[field] && (
                  <div key={field} className={`${theme.card} print:bg-white rounded-xl p-4 border print:border-gray-200`}>
                    <div className={`${theme.text.muted} print:text-gray-500 text-sm mb-1`}>
                      {config.prescriptionLabels?.[field] || field}
                    </div>
                    <div className={`${theme.text.primary} print:text-gray-800 font-medium`}>
                      {prescription[field]}
                    </div>
                  </div>
                )
              ))}
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

// ========================================
// 결과 페이지 (URL로 접근 시)
// ========================================
const ResultPage = () => {
  const { orderId } = useParams();
  const [searchParams] = useSearchParams();
  const viewMode = searchParams.get('view'); // 'full' or null
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [orderData, setOrderData] = useState(null);
  const [productKey, setProductKey] = useState('saju');
  const [showFull, setShowFull] = useState(viewMode === 'full'); // URL 파라미터로 초기값 설정

  const [displayName, setDisplayName] = useState('');

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        // orders와 products를 join해서 display_name 가져오기
        const { data, error } = await supabase
          .from('orders')
          .select(`
            *,
            products:product_id (
              display_name,
              name
            )
          `)
          .eq('id', orderId)
          .single();

        if (error) throw error;
        if (!data) throw new Error('주문을 찾을 수 없습니다');

        setOrderData(data);
        setProductKey(getProductKeyById(data.product_id));
        // display_name 설정 (없으면 name 사용)
        setDisplayName(data.products?.display_name || data.products?.name || '운세 분석');
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 flex items-center justify-center">
        <div className="text-white text-xl">불러오는 중...</div>
      </div>
    );
  }

  if (error || !orderData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 flex items-center justify-center p-4">
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 w-full max-w-md border border-white/20 text-center">
          <div className="text-6xl mb-4">😢</div>
          <h2 className="text-2xl font-bold text-white mb-2">결과를 찾을 수 없습니다</h2>
          <p className="text-purple-200 mb-6">{error || '잘못된 링크이거나 결과가 아직 준비되지 않았습니다.'}</p>
          <a href="/" className="inline-block py-3 px-6 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold">
            홈으로 돌아가기
          </a>
        </div>
      </div>
    );
  }

  if (orderData.status !== 'completed') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 flex items-center justify-center p-4">
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 w-full max-w-md border border-white/20 text-center">
          <div className="text-6xl mb-4 animate-bounce">⏳</div>
          <h2 className="text-2xl font-bold text-white mb-2">분석 진행 중입니다</h2>
          <p className="text-purple-200 mb-6">잠시 후 다시 확인해 주세요. 완료되면 이메일로도 안내드립니다.</p>
          <button onClick={() => window.location.reload()} className="py-3 px-6 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold">
            새로고침
          </button>
        </div>
      </div>
    );
  }

  const config = PRODUCTS[productKey];
  const theme = config.theme;
  const formData = orderData.input_data || {};
  const result = {
    aiResponse: orderData.ai_response,
    pdfUrl: orderData.pdf_url,
    notionUrl: orderData.notion_url
  };

  // showFull 상태에 따라 요약/풀버전 표시
  return showFull ? (
    <FullView 
      config={config} 
      theme={theme} 
      formData={formData} 
      result={result}
      displayName={displayName}
      onBack={() => setShowFull(false)}
    />
  ) : (
    <SummaryView 
      config={config} 
      theme={theme} 
      formData={formData} 
      result={result}
      displayName={displayName}
      onBack={null}
      onShowFull={() => setShowFull(true)}
    />
  );
};

// ========================================
// 메인 상품 컴포넌트
// ========================================
const ProductPage = ({ productKey }) => {
  const config = PRODUCTS[productKey];
  const theme = config.theme;
  
  const [step, setStep] = useState('form');
  const [formData, setFormData] = useState({
    name: '', dob: '', dob_year: '', dob_month: '', dob_day: '',
    calendar_type: 'solar', // 'solar' = 양력, 'lunar' = 음력
    birth_time: '', birth_hour: '', birth_minute: '', birth_time_unknown: false, birth_city: '', gender: 'male', email: ''
  });
  const [orderId, setOrderId] = useState(null);
  const [result, setResult] = useState(null);
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('');
  const [displayName, setDisplayName] = useState(config.title); // DB에서 가져올 display_name

  // 페이지 로드 시 DB에서 display_name 가져오기
  useEffect(() => {
    const fetchDisplayName = async () => {
      try {
        const { data } = await supabase
          .from('products')
          .select('display_name, name')
          .eq('id', config.product_id)
          .single();
        
        if (data?.display_name) {
          setDisplayName(data.display_name);
        } else if (data?.name) {
          setDisplayName(data.name);
        }
      } catch (err) {
        console.log('display_name 로드 실패, 기본값 사용');
      }
    };
    fetchDisplayName();
  }, [config.product_id]);

  useEffect(() => {
    if (!orderId || step !== 'loading') return;

    const interval = setInterval(async () => {
      const { data } = await supabase
        .from('orders')
        .select('status, ai_response, pdf_url, notion_url')
        .eq('id', orderId)
        .single();

      if (data?.status === 'completed') {
        clearInterval(interval);
        setResult({ pdfUrl: data.pdf_url, notionUrl: data.notion_url, aiResponse: data.ai_response });
        setProgress(100);
        setTimeout(() => setStep('result'), 500);
      }
    }, 3000);

    const progressInterval = setInterval(() => {
      setProgress(prev => prev >= 90 ? prev : prev + Math.random() * 5);
    }, 2000);

    const messageInterval = setInterval(() => {
      setStatusText(config.statusMessages[Math.floor(Math.random() * config.statusMessages.length)]);
    }, 4000);
    setStatusText(config.statusMessages[0]);

    return () => {
      clearInterval(interval);
      clearInterval(progressInterval);
      clearInterval(messageInterval);
    };
  }, [orderId, step]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // 점성학 상품인데 도시 입력 안했으면 서울로 기본값
    const submitData = {
      ...formData,
      birth_city: formData.birth_city || '서울'
    };
    const { data, error } = await supabase
      .from('orders')
      .insert({ product_id: config.product_id, input_data: submitData, status: 'pending' })
      .select()
      .single();

    if (error) {
      alert('오류가 발생했습니다: ' + error.message);
      return;
    }
    setOrderId(data.id);
    setStep('submitted');
  };

  const handleWaitHere = () => {
    setStep('loading');
    setProgress(5);
  };

  const resetForm = () => {
    setStep('form');
    setFormData({ name: '', dob: '', dob_year: '', dob_month: '', dob_day: '', calendar_type: 'solar', birth_time: '', birth_hour: '', birth_minute: '', birth_time_unknown: false, birth_city: '', gender: 'male', email: '' });
    setOrderId(null);
    setResult(null);
    setProgress(0);
  };

  const Copyright = () => (
    <p className={`text-center ${theme.text.muted} text-xs mt-8`}>
      © 2025 OZ Fortune. All rights reserved.
    </p>
  );

  // ========== 입력 폼 ==========
  if (step === 'form') {
    return (
      <div className={`min-h-screen bg-gradient-to-br ${theme.bg} flex items-center justify-center p-4`}>
        <div className={`${theme.card} backdrop-blur-lg rounded-3xl p-8 w-full max-w-md border shadow-2xl`}>
          <div className="text-center mb-8">
            <div className="text-5xl mb-4">{config.icon}</div>
            <h1 className={`text-3xl font-bold ${theme.text.primary} mb-2`}>{displayName}</h1>
            <p className={theme.text.secondary}>{config.subtitle}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className={`block ${theme.text.secondary} text-sm mb-2`}>이름</label>
              <input
                type="text" required value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className={`w-full px-4 py-3 rounded-xl ${theme.input} border focus:outline-none focus:ring-2`}
                placeholder="홍길동"
              />
            </div>

            <div>
              <label className={`block ${theme.text.secondary} text-sm mb-2`}>생년월일</label>
              <div className="flex gap-2">
                <select required value={formData.dob_year || ''}
                  onChange={(e) => setFormData({...formData, dob_year: e.target.value, dob: `${e.target.value}-${formData.dob_month || '01'}-${formData.dob_day || '01'}`})}
                  className={`flex-1 px-3 py-3 rounded-xl ${theme.input} border focus:outline-none focus:ring-2`}
                >
                  <option value="" className={theme.select}>년도</option>
                  {Array.from({length: 85}, (_, i) => 2010 - i).map(year => (
                    <option key={year} value={year} className={theme.select}>{year}년</option>
                  ))}
                </select>
                <select required value={formData.dob_month || ''}
                  onChange={(e) => setFormData({...formData, dob_month: e.target.value, dob: `${formData.dob_year || '1990'}-${e.target.value}-${formData.dob_day || '01'}`})}
                  className={`w-24 px-3 py-3 rounded-xl ${theme.input} border focus:outline-none focus:ring-2`}
                >
                  <option value="" className={theme.select}>월</option>
                  {Array.from({length: 12}, (_, i) => String(i + 1).padStart(2, '0')).map(month => (
                    <option key={month} value={month} className={theme.select}>{parseInt(month)}월</option>
                  ))}
                </select>
                <select required value={formData.dob_day || ''}
                  onChange={(e) => setFormData({...formData, dob_day: e.target.value, dob: `${formData.dob_year || '1990'}-${formData.dob_month || '01'}-${e.target.value}`})}
                  className={`w-24 px-3 py-3 rounded-xl ${theme.input} border focus:outline-none focus:ring-2`}
                >
                  <option value="" className={theme.select}>일</option>
                  {Array.from({length: 31}, (_, i) => String(i + 1).padStart(2, '0')).map(day => (
                    <option key={day} value={day} className={theme.select}>{parseInt(day)}일</option>
                  ))}
                </select>
              </div>
              {/* 양력/음력 선택 */}
              <div className="flex gap-2 mt-2">
                {['solar', 'lunar'].map(cal => (
                  <label key={cal} className="flex-1">
                    <input type="radio" name="calendar_type" value={cal} checked={formData.calendar_type === cal}
                      onChange={(e) => setFormData({...formData, calendar_type: e.target.value})} className="sr-only" />
                    <div className={`py-2 rounded-lg text-center text-sm cursor-pointer transition-all ${
                      formData.calendar_type === cal 
                        ? `bg-gradient-to-r ${theme.button} text-white` 
                        : `${theme.input} border ${theme.text.muted}`
                    }`}>
                      {cal === 'solar' ? '☀️ 양력' : '🌙 음력'}
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className={`block ${theme.text.secondary} text-sm mb-2`}>
                태어난 시간 {config.isAstro ? '(24시간 기준, 정확히 입력!)' : '(선택)'}
              </label>
              
              {/* 점성학: 시/분 직접 입력 */}
              {config.isAstro ? (
                <div>
                  {/* 모름 체크박스 */}
                  <label className="flex items-center gap-2 mb-2 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={formData.birth_time_unknown || false}
                      onChange={(e) => setFormData({
                        ...formData, 
                        birth_time_unknown: e.target.checked,
                        birth_hour: e.target.checked ? '12' : '',
                        birth_minute: e.target.checked ? '0' : ''
                      })}
                      className="w-4 h-4 rounded"
                    />
                    <span className={`text-sm ${theme.text.muted}`}>정확한 출생 시간을 모름 (정오 12시로 계산)</span>
                  </label>
                  
                  {/* 시/분 선택 (모름 체크 안했을 때만 활성화) */}
                  <div className={`flex gap-2 ${formData.birth_time_unknown ? 'opacity-50 pointer-events-none' : ''}`}>
                    <select value={formData.birth_hour || ''}
                      onChange={(e) => setFormData({...formData, birth_hour: e.target.value})}
                      className={`flex-1 px-3 py-3 rounded-xl ${theme.input} border focus:outline-none focus:ring-2`}
                      disabled={formData.birth_time_unknown}
                    >
                      <option value="" className={theme.select}>시</option>
                      {Array.from({length: 24}, (_, i) => (
                        <option key={i} value={String(i)} className={theme.select}>
                          {i < 10 ? `0${i}` : i}시
                        </option>
                      ))}
                    </select>
                    <select value={formData.birth_minute || ''}
                      onChange={(e) => setFormData({...formData, birth_minute: e.target.value})}
                      className={`flex-1 px-3 py-3 rounded-xl ${theme.input} border focus:outline-none focus:ring-2`}
                      disabled={formData.birth_time_unknown}
                    >
                      <option value="" className={theme.select}>분</option>
                      {[0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55].map(m => (
                        <option key={m} value={String(m)} className={theme.select}>
                          {m < 10 ? `0${m}` : m}분
                        </option>
                      ))}
                    </select>
                  </div>
                  {!formData.birth_time_unknown && (
                    <p className={`text-xs ${theme.text.muted} mt-1`}>
                      예: 오전 11시 30분 → 11시 30분 / 오후 3시 → 15시 00분
                    </p>
                  )}
                </div>
              ) : (
                /* 사주: 기존 시지 선택 */
                <select value={formData.birth_time}
                  onChange={(e) => setFormData({...formData, birth_time: e.target.value})}
                  className={`w-full px-4 py-3 rounded-xl ${theme.input} border focus:outline-none focus:ring-2`}
                >
                  <option value="" className={theme.select}>모름</option>
                  {['자시(23:00-01:00)', '축시(01:00-03:00)', '인시(03:00-05:00)', '묘시(05:00-07:00)',
                    '진시(07:00-09:00)', '사시(09:00-11:00)', '오시(11:00-13:00)', '미시(13:00-15:00)',
                    '신시(15:00-17:00)', '유시(17:00-19:00)', '술시(19:00-21:00)', '해시(21:00-23:00)'
                  ].map(time => (
                    <option key={time} value={time} className={theme.select}>{time}</option>
                  ))}
                </select>
              )}
            </div>

            {/* 점성학 상품일 때만 출생 도시 입력 */}
            {config.isAstro && (
              <div>
                <label className={`block ${theme.text.secondary} text-sm mb-2`}>태어난 도시 (선택)</label>
                <input
                  type="text" value={formData.birth_city}
                  onChange={(e) => setFormData({...formData, birth_city: e.target.value})}
                  className={`w-full px-4 py-3 rounded-xl ${theme.input} border focus:outline-none focus:ring-2`}
                  placeholder="미입력시 서울로 설정"
                />
              </div>
            )}

            <div>
              <label className={`block ${theme.text.secondary} text-sm mb-2`}>성별</label>
              <div className="flex gap-4">
                {['male', 'female'].map(g => (
                  <label key={g} className="flex-1">
                    <input type="radio" name="gender" value={g} checked={formData.gender === g}
                      onChange={(e) => setFormData({...formData, gender: e.target.value})} className="sr-only" />
                    <div className={`py-3 rounded-xl text-center cursor-pointer transition-all ${
                      formData.gender === g 
                        ? `bg-gradient-to-r ${theme.button} text-white` 
                        : `${theme.input} border ${theme.text.secondary}`
                    }`}>
                      {g === 'male' ? '남성' : '여성'}
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className={`block ${theme.text.secondary} text-sm mb-2`}>이메일</label>
              <input type="email" required value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className={`w-full px-4 py-3 rounded-xl ${theme.input} border focus:outline-none focus:ring-2`}
                placeholder="example@email.com"
              />
            </div>

            <button type="submit"
              className={`w-full py-4 rounded-xl bg-gradient-to-r ${theme.button} font-bold text-lg transition-all transform hover:scale-[1.02] shadow-lg`}
            >
              {config.icon} {config.buttonText}
            </button>
          </form>
          <Copyright />
        </div>
      </div>
    );
  }

  // ========== 접수 완료 ==========
  if (step === 'submitted') {
    return (
      <div className={`min-h-screen bg-gradient-to-br ${theme.bg} flex items-center justify-center p-4`}>
        <div className={`${theme.card} backdrop-blur-lg rounded-3xl p-8 w-full max-w-md border shadow-2xl text-center`}>
          <div className="text-6xl mb-6">✨</div>
          <h2 className={`text-2xl font-bold ${theme.text.primary} mb-2`}>접수 완료!</h2>
          <p className={`${theme.text.secondary} mb-8`}>{formData.name}님의 분석이 시작되었습니다</p>

          <div className="space-y-4">
            <button onClick={handleWaitHere}
              className={`w-full py-4 rounded-xl bg-gradient-to-r ${theme.button} font-bold transition-all`}
            >
              ⏳ 여기서 기다리기 (약 2분)
            </button>
            <button onClick={() => setStep('form')}
              className={`w-full py-4 rounded-xl ${theme.input} border font-bold transition-all`}
            >
              📧 이메일로 받을게요
            </button>
          </div>

          <p className={`${theme.text.muted} text-sm mt-6`}>분석이 완료되면 이메일로도 발송됩니다</p>
          <Copyright />
        </div>
      </div>
    );
  }

  // ========== 로딩 ==========
  if (step === 'loading') {
    return (
      <div className={`min-h-screen bg-gradient-to-br ${theme.bg} flex items-center justify-center p-4`}>
        <div className={`${theme.card} backdrop-blur-lg rounded-3xl p-8 w-full max-w-md border shadow-2xl text-center`}>
          <div className="text-6xl mb-6 animate-bounce">{config.icon}</div>
          <h2 className={`text-2xl font-bold ${theme.text.primary} mb-4`}>분석 중...</h2>
          
          <div className="mb-6">
            <div className="h-3 bg-black/50 rounded-full overflow-hidden">
              <div className={`h-full bg-gradient-to-r ${theme.score} transition-all duration-500 rounded-full`}
                style={{width: `${progress}%`}} />
            </div>
            <p className={`${theme.text.accent} text-sm mt-2`}>{Math.round(progress)}%</p>
          </div>

          <p className={theme.text.secondary}>{statusText}</p>
          <Copyright />
        </div>
      </div>
    );
  }

  // ========== 요약본 ==========
  if (step === 'summary') {
    return (
      <SummaryView 
        config={config} 
        theme={theme} 
        formData={formData} 
        result={result}
        displayName={displayName}
        onBack={() => setStep('result')}
      />
    );
  }

  // ========== 풀버전 ==========
  if (step === 'fullview') {
    return (
      <FullView 
        config={config} 
        theme={theme} 
        formData={formData} 
        result={result}
        displayName={displayName}
        onBack={() => setStep('result')}
      />
    );
  }

  // ========== 결과 화면 ==========
  if (step === 'result') {
    const ai = result?.aiResponse || {};
    const isLove = config.showLoveGrade;
    const isWealth = config.showWealthGrade;
    const isCareer = config.showCareerGrade;
    const isFull = config.showFullGrade;
    const grade = isLove ? ai.love_grade : isWealth ? ai.wealth_grade : isCareer ? ai.career_grade : (ai.saju_grade || ai.saju_summary?.saju_grade);
    const overallScore = ai.life_score?.overall || ai.summary_score;
    
    return (
      <div className={`min-h-screen bg-gradient-to-br ${theme.bg} flex items-center justify-center p-4`}>
        <div className={`${theme.card} backdrop-blur-lg rounded-3xl p-8 w-full max-w-md border shadow-2xl text-center`}>
          <div className="text-6xl mb-6">🎉</div>
          <h2 className={`text-2xl font-bold ${theme.text.primary} mb-2`}>분석 완료!</h2>
          <p className={`${theme.text.secondary} mb-6`}>{formData.name}님의 분석이 준비되었습니다</p>

          {ai.hooking_ment && (
            <div className={`${theme.card} rounded-2xl p-4 mb-6 border`}>
              <p className={`${theme.text.primary} italic`}>"{ai.hooking_ment}"</p>
            </div>
          )}

          {/* 미리보기 (등급+점수) */}
          <div className="flex justify-center gap-6 mb-6">
            {(isWealth || isLove || isCareer || isFull) && grade && (
              <div className="text-center">
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br ${isLove ? 'from-pink-400 to-rose-500' : isCareer ? 'from-blue-400 to-indigo-500' : isFull ? 'from-violet-400 to-purple-500' : 'from-yellow-400 to-amber-500'} shadow-lg`}>
                  <span className="text-2xl font-black text-gray-900">{grade}</span>
                </div>
                <div className={`${theme.text.accent} text-sm mt-1`}>등급</div>
              </div>
            )}
            {overallScore && (
              <div className="text-center">
                <div className={`text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r ${theme.score}`}>
                  {overallScore}점
                </div>
                <div className={`${theme.text.accent} text-sm`}>종합 점수</div>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <button onClick={() => setStep('summary')}
              className={`block w-full py-4 rounded-xl bg-gradient-to-r ${theme.button} font-bold text-lg transition-all transform hover:scale-[1.02] shadow-lg`}
            >
              📊 요약본 보기
            </button>

            <button onClick={() => setStep('fullview')}
              className={`block w-full py-4 rounded-xl bg-gradient-to-r from-gray-700 to-gray-900 ${theme.text.primary} font-bold text-lg hover:from-gray-600 hover:to-gray-800 transition-all transform hover:scale-[1.02] shadow-lg`}
            >
              📜 풀버전 보기
            </button>

            <button onClick={resetForm}
              className={`block w-full py-4 rounded-xl ${theme.input} border font-bold transition-all`}
            >
              🔄 다른 사람 분석하기
            </button>
          </div>

          <p className={`${theme.text.muted} text-sm mt-6`}>📧 이메일로도 결과 링크가 발송되었습니다</p>
          <Copyright />
        </div>
      </div>
    );
  }
};

// ========================================
// 라우터
// ========================================
export default function App() {
  return (
    <BrowserRouter>
    <AuthProvider>
      <Routes>
        {/* 새로 추가된 라우트 */}
          <Route path="/login" element={<Login />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/programs" element={<ProtectedRoute><ProgramSelect /></ProtectedRoute>} />
          <Route path="/profile-select" element={<ProtectedRoute><ProfileManage /></ProtectedRoute>} />
          
        <Route path="/" element={<Navigate to="/saju" replace />} />
        {/* 사주 상품들 */}
        <Route path="/saju" element={<ProductPage productKey="saju" />} />
        <Route path="/wealth" element={<ProductPage productKey="wealth" />} />
        <Route path="/love" element={<ProductPage productKey="love" />} />
        <Route path="/career" element={<ProductPage productKey="career" />} />
        <Route path="/full" element={<ProductPage productKey="full" />} />
        {/* 점성학 상품들 */}
        <Route path="/astro" element={<ProductPage productKey="astro" />} />
        <Route path="/astro-wealth" element={<ProductPage productKey="astro-wealth" />} />
        <Route path="/astro-love" element={<ProductPage productKey="astro-love" />} />
        <Route path="/astro-career" element={<ProductPage productKey="astro-career" />} />
        <Route path="/astro-full" element={<ProductPage productKey="astro-full" />} />
        {/* 결과 페이지 */}
        <Route path="/result/:orderId" element={<ResultPage />} />
      </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}