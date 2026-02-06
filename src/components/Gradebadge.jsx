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


export default GradeBadge;