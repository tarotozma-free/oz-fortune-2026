import { useState } from 'react';

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


export default AstroPlanetsChart;