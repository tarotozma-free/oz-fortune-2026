import { useState } from 'react';

const SajuPillarsChart = ({ visualData, theme }) => {
  if (!visualData?.saju_pillars) return null;
  
  const { saju_pillars, ohaeng_balance, ilgan, yongshin, gyeokguk } = visualData;
  
  // 달력과 동일한 은은한 오행 색상 (베이지 톤 기반)
  const elementTextColors = {
    '목': '#2D7D46', '화': '#C4473A', '토': '#8B7355', '금': '#6B6B6B', '수': '#2B5EA7',
    'wood': '#2D7D46', 'fire': '#C4473A', 'earth': '#8B7355', 'metal': '#6B6B6B', 'water': '#2B5EA7',
  };
  
  const elementBgColors = {
    '목': 'bg-[#E8F5E9]', '화': 'bg-[#FFEBEE]', '토': 'bg-[#FFF8E1]', '금': 'bg-[#F5F5F5]', '수': 'bg-[#E3F2FD]',
    'wood': 'bg-[#E8F5E9]', 'fire': 'bg-[#FFEBEE]', 'earth': 'bg-[#FFF8E1]', 'metal': 'bg-[#F5F5F5]', 'water': 'bg-[#E3F2FD]',
  };

  const elementBarColors = {
    'wood': 'bg-[#4CAF50]', 'fire': 'bg-[#EF5350]', 'earth': 'bg-[#FFB74D]', 'metal': 'bg-[#9E9E9E]', 'water': 'bg-[#42A5F5]',
  };
  
  const ohaengKorean = { 'wood': '목', 'fire': '화', 'earth': '토', 'metal': '금', 'water': '수' };
  const ohaengHanja = { 'wood': '木', 'fire': '火', 'earth': '土', 'metal': '金', 'water': '水' };
  const ohaengEmoji = { 'wood': '🌳', 'fire': '🔥', 'earth': '⛰️', 'metal': '⚙️', 'water': '💧' };

  // 십신 관계 매핑
  const sipsinMap = {
    '비견': '비겁', '겁재': '비겁', '비겁': '비겁',
    '식신': '식신', '상관': '상관',
    '편재': '편재', '정재': '정재',
    '편관': '편관', '정관': '정관',
    '편인': '편인', '정인': '정인',
  };

  const pillarLabels = ['시주', '일주', '월주', '년주'];
  const pillarKeys = ['hour', 'day', 'month', 'year'];

  return (
    <div className="space-y-6">
      {/* 나의 사주팔자 */}
      <div className={`${theme.card} rounded-2xl p-6 border`}>
        <h3 className={`${theme.text.primary} font-bold mb-5 text-center text-lg`}>나의 사주팔자</h3>
        
        {/* 팔자 4주 - 달력과 동일한 스타일 */}
        <div className="grid grid-cols-4 gap-3 mb-5">
          {pillarKeys.map((pillar, i) => {
            const data = saju_pillars[pillar];
            const isDay = pillar === 'day';
            const cheonganEl = data?.천간_element || data?.천간_kr?.slice(-1);
            const jijiEl = data?.지지_element || data?.지지_kr?.slice(-1);
            
            return (
              <div key={i} className="text-center relative">
                {/* 라벨 */}
                <div className={`${theme.text.muted} text-xs mb-2`}>{pillarLabels[i]}</div>
                
                {/* 일주 뱃지 */}
                {isDay && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#8B7355] text-white text-[10px] font-bold flex items-center justify-center z-10">日</div>
                )}
                
                {data ? (
                  <div className="space-y-1.5">
                    {/* 천간 십신 */}
                    {data.천간_sipsin && (
                      <div className={`text-[10px] ${theme.text.muted}`}>{data.천간_sipsin}</div>
                    )}
                    {/* 천간 */}
                    <div className={`${elementBgColors[cheonganEl] || 'bg-gray-100'} rounded-lg py-3 border border-black/5`}>
                      <div className="text-2xl font-bold" style={{ color: elementTextColors[cheonganEl] || '#3D3225' }}>
                        {data.천간}
                      </div>
                      {data.천간_kr && (
                        <div className={`text-[10px] ${theme.text.muted} mt-0.5`}>{data.천간_kr}</div>
                      )}
                    </div>
                    {/* 지지 */}
                    <div className={`${elementBgColors[jijiEl] || 'bg-gray-100'} rounded-lg py-3 border border-black/5`}>
                      <div className="text-2xl font-bold" style={{ color: elementTextColors[jijiEl] || '#3D3225' }}>
                        {data.지지}
                      </div>
                      {data.지지_kr && (
                        <div className={`text-[10px] ${theme.text.muted} mt-0.5`}>{data.지지_kr}</div>
                      )}
                    </div>
                    {/* 지지 십신 */}
                    {data.지지_sipsin && (
                      <div className={`text-[10px] ${theme.text.muted}`}>{data.지지_sipsin}</div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    <div className="bg-gray-50 rounded-lg py-3 border border-black/5">
                      <div className={`text-2xl ${theme.text.muted}`}>-</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg py-3 border border-black/5">
                      <div className={`text-2xl ${theme.text.muted}`}>-</div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        
        {/* 일간·용신·격국 - 달력 스타일 인라인 */}
        <div className="flex items-center justify-center gap-4 flex-wrap">
          {ilgan && (
            <div className="flex items-center gap-1.5">
              <span className={`${theme.text.accent} font-bold text-sm`}>{ilgan.char}</span>
              <span className={`${theme.text.secondary} text-sm`}>{ilgan.name}</span>
            </div>
          )}
          {yongshin && (
            <div className="flex items-center gap-1.5">
              <span className="text-sm">💧</span>
              <span className={`${theme.text.secondary} text-sm`}>
                {ohaengHanja[yongshin.element] || ''}{ohaengKorean[yongshin.element] || ''} 가 나를 도와요
              </span>
            </div>
          )}
          {gyeokguk && (
            <div className="flex items-center gap-1.5">
              <span className="text-sm">⚖️</span>
              <span className={`${theme.text.secondary} text-sm`}>{gyeokguk.name || gyeokguk}</span>
            </div>
          )}
        </div>
      </div>
      
      {/* 오행 밸런스 - 달력 스타일 */}
      {ohaeng_balance && (
        <div className={`${theme.card} rounded-2xl p-6 border`}>
          <h3 className={`${theme.text.primary} font-bold mb-4 text-center`}>⚖️ 오행 밸런스</h3>
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
                    <div className="h-3 bg-black/5 rounded-full overflow-hidden">
                      <div className={`h-full ${elementBarColors[element] || 'bg-gray-400'} transition-all duration-500 rounded-full`}
                        style={{ width: `${Math.max(percent, 3)}%`, opacity: 0.7 }} />
                    </div>
                  </div>
                  <div className={`w-12 text-right ${theme.text.primary} text-sm font-bold`}>{percent}%</div>
                  {status && status !== '적정' && (
                    <div className={`text-[10px] px-2 py-0.5 rounded-full ${status === '부족' ? 'bg-[#FFF3E0] text-[#E65100]' : 'bg-[#FFF8E1] text-[#F57F17]'}`}>
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