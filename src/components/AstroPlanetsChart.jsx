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