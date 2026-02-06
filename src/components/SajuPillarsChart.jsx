import { useState } from 'react';

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

export default SajuPillarsChart;