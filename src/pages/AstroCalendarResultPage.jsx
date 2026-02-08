import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { PRODUCTS } from '../config/products';

// 점성학 행성 기호
const PLANET_SYMBOLS = {
  Sun: '☉', Moon: '☽', Mercury: '☿', Venus: '♀', Mars: '♂',
  Jupiter: '♃', Saturn: '♄', Uranus: '♅', Neptune: '♆', Pluto: '♇',
};

const AstroCalendarResultPage = () => {
  const { orderId } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState('2026-01');
  const [filterType, setFilterType] = useState('all');
  const [viewMode, setViewMode] = useState('monthly');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: order, error } = await supabase
          .from('orders').select('*').eq('id', orderId).single();
        if (error) throw error;
        setData(order.ai_response);
      } catch (err) { console.error('데이터 로드 실패:', err); }
      finally { setLoading(false); }
    };
    fetchData();
  }, [orderId]);

  const downloadICS = () => {
    if (!data?.ics_base64) return;
    const byteCharacters = atob(data.ics_base64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) byteNumbers[i] = byteCharacters.charCodeAt(i);
    const blob = new Blob([new Uint8Array(byteNumbers)], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = '2026_점성학_운세달력.ics';
    document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
  };

  const getGoogleCalendarUrl = (dateItem) => {
    const date = dateItem.date.replace(/-/g, '');
    return `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(`${dateItem.emoji} ${dateItem.title}`)}&dates=${date}/${date}&details=${encodeURIComponent(`${dateItem.description}\n\n💡 ${dateItem.action_tip}`)}`;
  };

  const getCalendarGrid = (yearMonth) => {
    const [y, m] = yearMonth.split('-').map(Number);
    const firstDay = new Date(y, m - 1, 1).getDay();
    const daysInMonth = new Date(y, m, 0).getDate();
    const grid = [];
    for (let i = 0; i < firstDay; i++) grid.push(null);
    for (let d = 1; d <= daysInMonth; d++) grid.push(d);
    return grid;
  };

  const getEventsForDate = (yearMonth, day) => {
    const dateStr = `${yearMonth}-${String(day).padStart(2, '0')}`;
    return (data?.months?.[yearMonth]?.dates || []).filter(d => d.date === dateStr);
  };

  // 역행 기간에 해당하는지 체크
  const getRetroForMonth = (monthNum) => {
    return (data?.retrograde_periods || []).filter(r => {
      const months = r.period?.match(/(\d+)월/g)?.map(m => parseInt(m)) || [];
      return months.includes(monthNum);
    });
  };

  const theme = PRODUCTS['astro-calendar'].theme;
  const analysis = data?.analysis || {};

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#F9F7F2' }}>
      <div className="text-center">
        <div className="text-5xl mb-4 animate-pulse">☉</div>
        <div style={{ color: '#1B2A4A', fontFamily: '"Nanum Myeongjo", serif' }} className="text-lg">운세 달력을 불러오는 중...</div>
      </div>
    </div>
  );

  if (!data) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#F9F7F2' }}>
      <div className="text-center" style={{ color: '#1B2A4A' }}>
        <div className="text-4xl mb-4">☽</div><p>달력 데이터를 찾을 수 없습니다.</p>
      </div>
    </div>
  );

  const months = Object.keys(data.months || {}).sort();
  const currentMonthData = data.months?.[selectedMonth];
  const calendarGrid = getCalendarGrid(selectedMonth);
  const monthNum = parseInt(selectedMonth.split('-')[1]);
  const filteredDates = (currentMonthData?.dates || []).filter(d => filterType === 'all' || d.type === filterType);
  const currentHouse = analysis.house_transits?.[selectedMonth];
  const currentPlanet = analysis.dominant_planets?.[selectedMonth];
  const currentElement = analysis.element_balance?.[selectedMonth];

  // 프리미엄 컬러 팔레트
  const colors = {
    bg: '#F9F7F2',
    card: '#FFFFFF',
    cardBorder: '#E8E2D8',
    gold: '#B8934A',
    goldLight: '#D4B96A',
    goldBg: 'rgba(184, 147, 74, 0.08)',
    navy: '#1B2A4A',
    navyLight: '#2D4A7A',
    text: '#2C2C2C',
    textSecondary: '#6B6B6B',
    textMuted: '#9B9B9B',
    lucky: { bg: '#FFF5F0', border: '#E8A090', text: '#C4735E', dot: '#D4846E' },
    caution: { bg: '#F0F4F8', border: '#8BA4C0', text: '#5A7A9A', dot: '#7A94B0' },
    turning: { bg: '#FFF8EC', border: '#D4B96A', text: '#B8934A', dot: '#C4A35A' },
  };

  const typeStyle = {
    lucky: colors.lucky,
    caution: colors.caution,
    turning_point: colors.turning,
    special: colors.turning,
  };

  // ===== 공통 스타일 =====
  const globalCSS = `
    @import url('https://fonts.googleapis.com/css2?family=Nanum+Myeongjo:wght@400;700;800&family=Pretendard:wght@300;400;500;600;700&display=swap');
    .font-serif-kr { font-family: 'Nanum Myeongjo', 'Batang', serif; }
    .font-sans-kr { font-family: 'Pretendard', -apple-system, sans-serif; }
    @media print {
      body { background: #F9F7F2 !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      .no-print { display: none !important; }
      .print-break { page-break-before: always; }
      .print-avoid-break { page-break-inside: avoid; }
    }
  `;

  // ========== 전체 보기 모드 (인쇄용) ==========
  if (viewMode === 'full') {
    return (
      <div className="min-h-screen font-sans-kr" style={{ background: colors.bg, color: colors.text }}>
        <style>{globalCSS}</style>

        {/* 상단 네비 */}
        <div className="no-print sticky top-0 z-50 px-4 py-3 border-b" style={{ background: 'rgba(249,247,242,0.95)', backdropFilter: 'blur(8px)', borderColor: colors.cardBorder }}>
          <div className="max-w-2xl mx-auto flex items-center justify-between">
            <button onClick={() => setViewMode('monthly')} className="px-4 py-2 rounded-lg border text-sm font-medium" style={{ borderColor: colors.cardBorder, color: colors.navy }}>← 월별 보기</button>
            <span className="font-serif-kr font-bold" style={{ color: colors.gold }}>☉ 12개월 전체 보기</span>
            <button onClick={() => window.print()} className="px-4 py-2 rounded-lg text-sm font-bold text-white" style={{ background: colors.navy }}>🖨️ 인쇄</button>
          </div>
        </div>

        <div className="max-w-2xl mx-auto px-6 py-10">
          {/* 표지 */}
          <div className="text-center mb-12 print-avoid-break">
            <div className="text-4xl mb-3 tracking-widest" style={{ color: colors.gold }}>☉ ☽ ☿ ♀ ♂</div>
            <h1 className="font-serif-kr text-3xl font-extrabold mb-3" style={{ color: colors.navy }}>{data.calendar_title || '2026년 점성학 운세 달력'}</h1>
            <div className="w-16 h-px mx-auto mb-4" style={{ background: colors.gold }} />
            <p className="text-sm leading-relaxed max-w-md mx-auto" style={{ color: colors.textSecondary }}>{data.yearly_summary}</p>
            {data.yearly_keywords && (
              <div className="flex justify-center gap-3 mt-5">
                {data.yearly_keywords.map((kw, i) => (
                  <span key={i} className="px-4 py-1.5 rounded-full text-xs font-medium border" style={{ borderColor: colors.gold, color: colors.gold }}>{kw}</span>
                ))}
              </div>
            )}
          </div>

          {/* 연간 요약 카드 */}
          <div className="rounded-2xl p-8 mb-10 print-avoid-break" style={{ background: colors.card, border: `1px solid ${colors.cardBorder}` }}>
            <div className="grid grid-cols-3 gap-6 text-center">
              <div>
                <div className="font-serif-kr text-4xl font-extrabold" style={{ color: colors.gold }}>{data.yearly_score || 0}</div>
                <div className="text-xs mt-1" style={{ color: colors.textMuted }}>종합 점수</div>
              </div>
              <div>
                <div className="text-sm font-bold" style={{ color: colors.navy }}>☆ {data.best_month}</div>
                <div className="text-xs mt-1" style={{ color: colors.textMuted }}>최고의 달</div>
              </div>
              <div>
                <div className="text-sm font-bold" style={{ color: colors.caution.text }}>△ {data.worst_month}</div>
                <div className="text-xs mt-1" style={{ color: colors.textMuted }}>주의할 달</div>
              </div>
            </div>
          </div>

          {/* 카테고리별 추천일 */}
          {data.category_dates && Object.keys(data.category_dates).length > 0 && (
            <div className="rounded-2xl p-8 mb-10 print-avoid-break" style={{ background: colors.card, border: `1px solid ${colors.cardBorder}` }}>
              <h2 className="font-serif-kr text-xl font-bold text-center mb-6" style={{ color: colors.navy }}>이런 일엔 이 날</h2>
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(data.category_dates).map(([key, cat]) => (
                  <div key={key} className="rounded-xl p-4" style={{ background: colors.goldBg }}>
                    <div className="font-bold text-sm mb-2" style={{ color: colors.navy }}>{cat.emoji} {cat.label}</div>
                    <div className="flex flex-wrap gap-2">
                      {(cat.dates || []).map((d, i) => (
                        <span key={i} className="text-xs font-mono font-bold px-2 py-1 rounded" style={{ background: colors.card, color: colors.gold, border: `1px solid ${colors.cardBorder}` }}>{d.date?.split('-').slice(1).join('/')}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 기존 top_dates 호환 */}
          {!data.category_dates && data.top_dates?.length > 0 && (
            <div className="rounded-2xl p-8 mb-10 print-avoid-break" style={{ background: colors.card, border: `1px solid ${colors.cardBorder}` }}>
              <h2 className="font-serif-kr text-xl font-bold text-center mb-4" style={{ color: colors.navy }}>올해의 행운 날짜</h2>
              <div className="space-y-2">
                {data.top_dates.slice(0, 5).map((item, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: colors.goldBg }}>
                    <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm" style={{ background: colors.gold, color: '#fff' }}>{i + 1}</div>
                    <div className="flex-1"><span className="font-bold text-sm" style={{ color: colors.navy }}>{item.title}</span></div>
                    <span className="font-mono text-sm font-bold" style={{ color: colors.gold }}>{item.date}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 역행 캘린더 */}
          {data.retrograde_periods?.length > 0 && (
            <div className="rounded-2xl p-8 mb-10 print-avoid-break" style={{ background: colors.card, border: `1px solid ${colors.cardBorder}` }}>
              <h2 className="font-serif-kr text-xl font-bold text-center mb-6" style={{ color: colors.navy }}>역행 주의 기간</h2>
              <div className="space-y-3">
                {data.retrograde_periods.map((r, i) => (
                  <div key={i} className="flex items-center gap-4 p-3 rounded-xl border" style={{ borderColor: colors.cardBorder }}>
                    <span className="font-serif-kr text-lg" style={{ color: colors.navy }}>{PLANET_SYMBOLS[r.planet] || '☍'}</span>
                    <div className="flex-1">
                      <span className="font-bold text-sm" style={{ color: colors.navy }}>{r.planet_kr || r.planet} 역행</span>
                      <span className="text-xs ml-2" style={{ color: colors.textMuted }}>{r.period}</span>
                    </div>
                    <span className="text-xs" style={{ color: colors.textSecondary }}>{r.impact}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 12개월 */}
          {months.map((m, monthIdx) => {
            const md = data.months[m];
            const mNum = parseInt(m.split('-')[1]);
            const mDates = md?.dates || [];
            const mGrid = getCalendarGrid(m);
            const mHouse = analysis.house_transits?.[m];
            const mPlanet = analysis.dominant_planets?.[m];
            const mElement = analysis.element_balance?.[m];
            const mRetros = getRetroForMonth(mNum);
            const gradeColor = (md?.month_grade === '대길' || md?.month_grade === '길') ? colors.gold : (md?.month_grade === '흉' || md?.month_grade === '소흉') ? colors.caution.text : colors.textSecondary;

            return (
              <div key={m} className={`mb-10 ${monthIdx > 0 ? 'print-break' : ''} print-avoid-break`}>
                {/* 월 헤더 */}
                <div className="flex items-end justify-between mb-4 pb-3" style={{ borderBottom: `2px solid ${colors.navy}` }}>
                  <div>
                    <h2 className="font-serif-kr text-2xl font-extrabold" style={{ color: colors.navy }}>{mNum}월</h2>
                    {mPlanet && <span className="text-xs" style={{ color: colors.textMuted }}>{PLANET_SYMBOLS[mPlanet.planet] || ''} {mPlanet.planet_kr} · {mPlanet.theme}</span>}
                  </div>
                  <div className="text-right">
                    <div className="font-serif-kr text-2xl font-extrabold" style={{ color: gradeColor }}>{md?.month_score || 0}<span className="text-sm font-normal">점</span></div>
                    <span className="text-xs font-bold" style={{ color: gradeColor }}>{md?.month_grade}</span>
                  </div>
                </div>

                {/* 월 요약 */}
                <p className="text-sm leading-relaxed mb-2" style={{ color: colors.textSecondary }}>{md?.month_summary}</p>
                
                {/* 한 줄 가이드 */}
                {md?.month_tip && (
                  <div className="rounded-lg px-4 py-2 mb-4" style={{ background: colors.goldBg, borderLeft: `3px solid ${colors.gold}` }}>
                    <span className="text-sm font-bold" style={{ color: colors.gold }}>✦</span>
                    <span className="text-sm ml-1.5" style={{ color: colors.navy }}>{md.month_tip}</span>
                  </div>
                )}

                {/* 역행 바 */}
                {mRetros.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {mRetros.map((r, ri) => (
                      <span key={ri} className="text-xs px-3 py-1 rounded-full" style={{ background: '#F0EBF8', color: '#7B68AE', border: '1px solid #D4CCE8' }}>
                        {PLANET_SYMBOLS[r.planet] || '☍'} {r.planet_kr} 역행 중
                      </span>
                    ))}
                  </div>
                )}

                {/* 미니 달력 */}
                <div className="rounded-xl p-4 mb-4" style={{ background: colors.card, border: `1px solid ${colors.cardBorder}` }}>
                  <div className="grid grid-cols-7 gap-1 mb-2">
                    {['일','월','화','수','목','금','토'].map((d, i) => (
                      <div key={d} className="text-center text-xs font-bold py-1" style={{ color: i === 0 ? '#C4735E' : i === 6 ? '#5A7A9A' : colors.textMuted }}>{d}</div>
                    ))}
                  </div>
                  <div className="grid grid-cols-7 gap-1">
                    {mGrid.map((day, i) => {
                      if (day === null) return <div key={`e-${i}`} className="aspect-square" />;
                      const events = getEventsForDate(m, day);
                      const hasEvents = events.length > 0;
                      const evType = events[0]?.type;
                      const sty = typeStyle[evType] || {};
                      const dayOfWeek = new Date(parseInt(m.split('-')[0]), parseInt(m.split('-')[1]) - 1, day).getDay();
                      return (
                        <div key={day} className="aspect-square rounded-lg flex flex-col items-center justify-center text-xs relative"
                          style={hasEvents ? { background: sty.bg, border: `1.5px solid ${sty.border}` } : {}}>
                          <div className="font-bold" style={{ color: dayOfWeek === 0 ? '#C4735E' : dayOfWeek === 6 ? '#5A7A9A' : colors.text }}>{day}</div>
                          {hasEvents && evType === 'lucky' && <span className="text-[8px] absolute -top-0.5 -right-0.5" style={{ color: colors.gold }}>★</span>}
                          {hasEvents && evType === 'caution' && <span className="text-[8px] absolute -top-0.5 -right-0.5" style={{ color: colors.caution.text }}>!</span>}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 날짜 리스트 */}
                <div className="space-y-2 mb-4">
                  {mDates.map((item, i) => {
                    const sty = typeStyle[item.type] || typeStyle.lucky;
                    return (
                      <div key={i} className="rounded-xl p-3 flex items-start gap-3" style={{ background: sty.bg, borderLeft: `3px solid ${sty.border}` }}>
                        <div className="text-center min-w-[36px]">
                          <div className="text-lg font-bold" style={{ color: sty.text }}>{item.date?.split('-')[2]}</div>
                          <div className="text-[10px]" style={{ color: colors.textMuted }}>{new Date(item.date).toLocaleDateString('ko-KR', { weekday: 'short' })}</div>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-1.5 mb-0.5">
                            {item.type === 'lucky' && <span style={{ color: colors.gold }}>★</span>}
                            {item.type === 'caution' && <span style={{ color: colors.caution.text }}>△</span>}
                            <span className="font-bold text-sm" style={{ color: colors.navy }}>{item.title}</span>
                          </div>
                          <p className="text-xs leading-relaxed" style={{ color: colors.textSecondary }}>{item.description}</p>
                          <div className="text-xs mt-1" style={{ color: sty.text }}>→ {item.action_tip}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* 월별 행운 아이템 + 메모 */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl p-3" style={{ background: colors.goldBg, border: `1px solid ${colors.cardBorder}` }}>
                    <div className="font-serif-kr text-xs font-bold mb-1" style={{ color: colors.gold }}>✦ 이 달의 행운 부스터</div>
                    <div className="text-xs" style={{ color: colors.textSecondary }}>
                      {mPlanet?.advice || '에너지 충전 활동을 추천합니다'}
                    </div>
                    {mElement?.lacking && (
                      <div className="text-xs mt-1" style={{ color: colors.gold }}>
                        {mElement.lacking.emoji} {mElement.lacking.name} 원소 보충: {mElement.lacking.advice?.split(',')[0]}
                      </div>
                    )}
                  </div>
                  <div className="rounded-xl p-3" style={{ background: '#FAFAFA', border: `1px dashed ${colors.cardBorder}` }}>
                    <div className="font-serif-kr text-xs font-bold mb-1" style={{ color: colors.textMuted }}>✎ 나의 운세 기록장</div>
                    <div className="text-[10px] leading-5" style={{ color: '#D0D0D0' }}>
                      ___________________________<br/>
                      ___________________________<br/>
                      ___________________________
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {/* 개운 처방전 */}
          {data.lucky_prescription && (
            <div className="rounded-2xl p-8 mb-10 print-break print-avoid-break" style={{ background: colors.card, border: `1px solid ${colors.cardBorder}` }}>
              <h2 className="font-serif-kr text-xl font-bold text-center mb-6" style={{ color: colors.navy }}>2026년 점성학 개운 처방전</h2>
              <div className="grid grid-cols-3 gap-6">
                {Object.entries(data.lucky_prescription).filter(([k]) => !['dominant_element','lacking_element','balance_tip'].includes(k)).map(([key, value]) => {
                  const labels = { color: { l: '행운 색상', s: '🎨' }, number: { l: '행운 숫자', s: '✦' }, direction: { l: '좋은 방위', s: '◇' }, stone: { l: '파워스톤', s: '◆' }, day: { l: '행운의 요일', s: '☉' }, activity: { l: '개운 활동', s: '♃' } };
                  const info = labels[key] || { l: key, s: '·' };
                  return (
                    <div key={key} className="text-center">
                      <div className="font-serif-kr text-lg mb-1" style={{ color: colors.gold }}>{info.s}</div>
                      <div className="text-[10px] mb-1" style={{ color: colors.textMuted }}>{info.l}</div>
                      <div className="text-sm font-bold" style={{ color: colors.navy }}>{typeof value === 'object' ? JSON.stringify(value) : value}</div>
                    </div>
                  );
                })}
              </div>
              {data.lucky_prescription.balance_tip && (
                <p className="text-sm text-center mt-5" style={{ color: colors.textSecondary }}>{data.lucky_prescription.balance_tip}</p>
              )}
            </div>
          )}

          {/* 하단 버튼 */}
          <div className="no-print space-y-3 mt-10">
            <button onClick={downloadICS} className="w-full py-4 rounded-xl text-white font-bold text-lg transition-all hover:opacity-90" style={{ background: colors.navy }}>☉ 캘린더에 자동 등록하기</button>
            <button onClick={() => window.print()} className="w-full py-3 rounded-xl border font-bold" style={{ borderColor: colors.cardBorder, color: colors.navy }}>🖨️ PDF로 저장하기</button>
            <button onClick={() => setViewMode('monthly')} className="w-full py-3 rounded-xl font-medium" style={{ color: colors.textMuted }}>← 월별 보기로 돌아가기</button>
          </div>
          <p className="text-center text-xs mt-10 pb-6" style={{ color: colors.textMuted }}>© 2025 OZ Fortune. All rights reserved.</p>
        </div>
      </div>
    );
  }

  // ========== 월별 보기 모드 (웹) ==========
  return (
    <div className="min-h-screen font-sans-kr" style={{ background: colors.bg, color: colors.text }}>
      <style>{globalCSS}</style>

      {/* 헤더 */}
      <div className="px-4 pt-10 pb-6">
        <div className="max-w-lg mx-auto text-center">
          <div className="text-3xl mb-3 tracking-widest" style={{ color: colors.gold }}>☉ ☽ ☿</div>
          <h1 className="font-serif-kr text-2xl font-extrabold mb-2" style={{ color: colors.navy }}>{data.calendar_title || '2026년 점성학 운세 달력'}</h1>
          <div className="w-12 h-px mx-auto mb-3" style={{ background: colors.gold }} />
          <p className="text-sm leading-relaxed" style={{ color: colors.textSecondary }}>{data.yearly_summary}</p>
          {data.yearly_keywords && (
            <div className="flex justify-center gap-2 mt-4">
              {data.yearly_keywords.map((kw, i) => (
                <span key={i} className="px-3 py-1 rounded-full text-xs font-medium border" style={{ borderColor: colors.gold, color: colors.gold }}>{kw}</span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 연간 요약 */}
      <div className="px-4 mb-6">
        <div className="max-w-lg mx-auto">
          <div className="rounded-2xl p-6" style={{ background: colors.card, border: `1px solid ${colors.cardBorder}` }}>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="font-serif-kr text-3xl font-extrabold" style={{ color: colors.gold }}>{data.yearly_score || 0}</div>
                <div className="text-xs mt-1" style={{ color: colors.textMuted }}>종합 점수</div>
              </div>
              <div>
                <div className="text-sm font-bold" style={{ color: colors.navy }}>☆ {data.best_month}</div>
                <div className="text-xs mt-1" style={{ color: colors.textMuted }}>최고의 달</div>
              </div>
              <div>
                <div className="text-sm font-bold" style={{ color: colors.caution.text }}>△ {data.worst_month}</div>
                <div className="text-xs mt-1" style={{ color: colors.textMuted }}>주의할 달</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 역행 주의 기간 */}
      {data.retrograde_periods?.length > 0 && (
        <div className="px-4 mb-6">
          <div className="max-w-lg mx-auto">
            <h2 className="font-serif-kr text-base font-bold text-center mb-3" style={{ color: colors.navy }}>역행 주의 기간</h2>
            <div className="rounded-2xl p-4" style={{ background: colors.card, border: `1px solid ${colors.cardBorder}` }}>
              <div className="space-y-2">
                {data.retrograde_periods.map((r, i) => (
                  <div key={i} className="flex items-center gap-3 p-2 rounded-lg" style={{ background: '#F8F5FF' }}>
                    <span className="font-serif-kr text-base" style={{ color: '#7B68AE' }}>{PLANET_SYMBOLS[r.planet] || '☍'}</span>
                    <div className="flex-1">
                      <span className="font-bold text-sm" style={{ color: colors.navy }}>{r.planet_kr || r.planet} 역행</span>
                      <span className="text-xs ml-2" style={{ color: colors.textMuted }}>{r.period}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 카테고리별 추천일 */}
      {data.category_dates && Object.keys(data.category_dates).length > 0 && (
        <div className="px-4 mb-6">
          <div className="max-w-lg mx-auto">
            <h2 className="font-serif-kr text-base font-bold text-center mb-3" style={{ color: colors.navy }}>이런 일엔 이 날</h2>
            <div className="rounded-2xl p-4" style={{ background: colors.card, border: `1px solid ${colors.cardBorder}` }}>
              <div className="space-y-3">
                {Object.entries(data.category_dates).map(([key, cat]) => (
                  <div key={key} className="flex items-center gap-3">
                    <div className="text-sm font-bold min-w-[90px]" style={{ color: colors.navy }}>{cat.emoji} {cat.label}</div>
                    <div className="flex flex-wrap gap-1.5 flex-1">
                      {(cat.dates || []).map((d, i) => (
                        <span key={i} className="text-xs font-mono font-bold px-2.5 py-1 rounded-md" style={{ background: colors.goldBg, color: colors.gold, border: `1px solid ${colors.cardBorder}` }}>{d.date?.split('-').slice(1).join('/')}</span>
                      ))}
                      {(!cat.dates || cat.dates.length === 0) && (
                        <span className="text-xs" style={{ color: colors.textMuted }}>—</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 기존 top_dates 호환 */}
      {!data.category_dates && data.top_dates?.length > 0 && (
        <div className="px-4 mb-6">
          <div className="max-w-lg mx-auto">
            <h2 className="font-serif-kr text-base font-bold text-center mb-3" style={{ color: colors.navy }}>올해의 행운 날짜</h2>
            <div className="rounded-2xl p-4" style={{ background: colors.card, border: `1px solid ${colors.cardBorder}` }}>
              {data.top_dates.slice(0, 5).map((item, i) => (
                <div key={i} className="flex items-center gap-3 p-2 rounded-lg" style={i < 5 ? { background: colors.goldBg } : {}}>
                  <div className="w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs text-white" style={{ background: colors.gold }}>{i + 1}</div>
                  <div className="flex-1"><span className="font-bold text-sm" style={{ color: colors.navy }}>{item.title}</span></div>
                  <span className="font-mono text-xs font-bold" style={{ color: colors.gold }}>{item.date?.split('-').slice(1).join('/')}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 월별 점수 바 */}
      <div className="px-4 mb-6">
        <div className="max-w-lg mx-auto">
          <h2 className="font-serif-kr text-base font-bold text-center mb-3" style={{ color: colors.navy }}>월별 운세 흐름</h2>
          <div className="rounded-2xl p-5" style={{ background: colors.card, border: `1px solid ${colors.cardBorder}` }}>
            <div className="flex items-end gap-1.5 h-32">
              {months.map((m) => {
                const md = data.months[m];
                const score = md?.month_score || 0;
                const isSelected = m === selectedMonth;
                const barColor = isSelected ? colors.gold : score >= 70 ? colors.goldLight : score >= 50 ? '#D4CCB0' : colors.caution.border;
                return (
                  <button key={m} onClick={() => setSelectedMonth(m)}
                    className={`flex-1 flex flex-col items-center justify-end gap-1 transition-all ${isSelected ? 'scale-105' : 'opacity-50 hover:opacity-75'}`}>
                    <div className="text-[10px] font-bold" style={{ color: isSelected ? colors.gold : colors.textMuted }}>{score}</div>
                    <div className="w-full rounded-t-md transition-all" style={{ height: `${Math.max(score * 0.8, 8)}%`, background: barColor }} />
                    <div className="text-[10px] font-medium" style={{ color: isSelected ? colors.gold : colors.textMuted }}>{parseInt(m.split('-')[1])}</div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* 월 선택 + 필터 */}
      <div className="px-4 mb-3">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => { const idx = months.indexOf(selectedMonth); if (idx > 0) setSelectedMonth(months[idx - 1]); }}
              className="w-8 h-8 rounded-full border flex items-center justify-center" style={{ borderColor: colors.cardBorder, color: colors.navy }}>◀</button>
            <span className="font-serif-kr font-bold text-xl" style={{ color: colors.navy }}>{monthNum}월</span>
            <button onClick={() => { const idx = months.indexOf(selectedMonth); if (idx < months.length - 1) setSelectedMonth(months[idx + 1]); }}
              className="w-8 h-8 rounded-full border flex items-center justify-center" style={{ borderColor: colors.cardBorder, color: colors.navy }}>▶</button>
          </div>
          <div className="flex gap-1.5">
            {[{ key: 'all', label: '전체' }, { key: 'lucky', label: '★' }, { key: 'caution', label: '△' }].map(f => (
              <button key={f.key} onClick={() => setFilterType(f.key)}
                className="px-3 py-1.5 rounded-full text-xs font-medium transition-all"
                style={filterType === f.key ? { background: colors.navy, color: '#fff' } : { border: `1px solid ${colors.cardBorder}`, color: colors.textMuted }}>{f.label}</button>
            ))}
          </div>
        </div>
      </div>

      {/* 월 요약 카드 */}
      {currentMonthData && (
        <div className="px-4 mb-4">
          <div className="max-w-lg mx-auto">
            <div className="rounded-xl p-5" style={{ background: colors.card, border: `1px solid ${colors.cardBorder}` }}>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <span className="font-serif-kr font-bold" style={{ color: colors.navy }}>{monthNum}월 운세</span>
                  {currentMonthData.month_grade && (
                    <span className="ml-2 px-2.5 py-0.5 rounded-full text-xs font-bold"
                      style={{
                        background: (currentMonthData.month_grade === '대길' || currentMonthData.month_grade === '길') ? colors.goldBg : (currentMonthData.month_grade === '흉' || currentMonthData.month_grade === '소흉') ? colors.caution.bg : '#F5F5F0',
                        color: (currentMonthData.month_grade === '대길' || currentMonthData.month_grade === '길') ? colors.gold : (currentMonthData.month_grade === '흉' || currentMonthData.month_grade === '소흉') ? colors.caution.text : colors.textMuted,
                      }}>{currentMonthData.month_grade}</span>
                  )}
                </div>
                <div className="font-serif-kr text-xl font-extrabold" style={{ color: (currentMonthData.month_score >= 65) ? colors.gold : (currentMonthData.month_score < 35) ? colors.caution.text : colors.textSecondary }}>{currentMonthData.month_score}<span className="text-sm font-normal">점</span></div>
              </div>
              <p className="text-sm leading-relaxed mb-3" style={{ color: colors.textSecondary }}>{currentMonthData.month_summary}</p>
              
              {/* 한 줄 가이드 */}
              {currentMonthData.month_tip && (
                <div className="rounded-lg px-4 py-2 mb-3" style={{ background: colors.goldBg, borderLeft: `3px solid ${colors.gold}` }}>
                  <span className="text-sm font-bold" style={{ color: colors.gold }}>✦</span>
                  <span className="text-sm ml-1.5" style={{ color: colors.navy }}>{currentMonthData.month_tip}</span>
                </div>
              )}

              {/* 역행 바 (이번 달) */}
              {getRetroForMonth(monthNum).length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {getRetroForMonth(monthNum).map((r, ri) => (
                    <span key={ri} className="text-xs px-2.5 py-1 rounded-full" style={{ background: '#F0EBF8', color: '#7B68AE', border: '1px solid #D4CCE8' }}>
                      {PLANET_SYMBOLS[r.planet] || '☍'} {r.planet_kr} 역행 중
                    </span>
                  ))}
                </div>
              )}

              {/* 3가지 미니 분석 */}
              <div className="grid grid-cols-3 gap-2">
                {currentPlanet && (
                  <div className="rounded-lg p-2.5 text-center" style={{ background: colors.goldBg }}>
                    <div className="font-serif-kr text-base" style={{ color: colors.gold }}>{PLANET_SYMBOLS[currentPlanet.planet] || '☉'}</div>
                    <div className="text-[10px]" style={{ color: colors.textMuted }}>지배 행성</div>
                    <div className="text-xs font-bold" style={{ color: colors.navy }}>{currentPlanet.planet_kr}</div>
                  </div>
                )}
                {currentHouse && (
                  <div className="rounded-lg p-2.5 text-center" style={{ background: colors.goldBg }}>
                    <div className="text-base">{currentHouse.emoji}</div>
                    <div className="text-[10px]" style={{ color: colors.textMuted }}>핵심 영역</div>
                    <div className="text-xs font-bold" style={{ color: colors.navy }}>{currentHouse.area}</div>
                  </div>
                )}
                {currentElement?.dominant && (
                  <div className="rounded-lg p-2.5 text-center" style={{ background: colors.goldBg }}>
                    <div className="text-base">{currentElement.dominant.emoji}</div>
                    <div className="text-[10px]" style={{ color: colors.textMuted }}>우세 원소</div>
                    <div className="text-xs font-bold" style={{ color: colors.navy }}>{currentElement.dominant.name} {currentElement.dominant.percent}%</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 달력 그리드 */}
      <div className="px-4 mb-4">
        <div className="max-w-lg mx-auto">
          <div className="rounded-2xl p-4" style={{ background: colors.card, border: `1px solid ${colors.cardBorder}` }}>
            <div className="grid grid-cols-7 gap-1 mb-2">
              {['일','월','화','수','목','금','토'].map((d, i) => (
                <div key={d} className="text-center text-xs font-bold py-1" style={{ color: i === 0 ? '#C4735E' : i === 6 ? '#5A7A9A' : colors.textMuted }}>{d}</div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {calendarGrid.map((day, i) => {
                if (day === null) return <div key={`e-${i}`} className="aspect-square" />;
                const events = getEventsForDate(selectedMonth, day).filter(e => filterType === 'all' || e.type === filterType);
                const hasEvents = events.length > 0;
                const evType = events[0]?.type;
                const sty = typeStyle[evType] || {};
                const dayOfWeek = new Date(parseInt(selectedMonth.split('-')[0]), parseInt(selectedMonth.split('-')[1]) - 1, day).getDay();
                return (
                  <div key={day} className="aspect-square rounded-lg flex flex-col items-center justify-center relative transition-all"
                    style={hasEvents ? { background: sty.bg, border: `1.5px solid ${sty.border}`, cursor: 'pointer' } : {}}
                    title={hasEvents ? events.map(e => `${e.emoji} ${e.title}`).join('\n') : ''}>
                    <div className="text-sm font-bold" style={{ color: dayOfWeek === 0 ? '#C4735E' : dayOfWeek === 6 ? '#5A7A9A' : colors.text }}>{day}</div>
                    {hasEvents && evType === 'lucky' && <span className="text-[9px] absolute -top-0.5 -right-0.5" style={{ color: colors.gold }}>★</span>}
                    {hasEvents && evType === 'caution' && <span className="text-[8px] absolute -top-0.5 -right-0.5 font-bold" style={{ color: colors.caution.text }}>!</span>}
                    {hasEvents && evType === 'turning_point' && <span className="text-[8px] absolute -top-0.5 -right-0.5" style={{ color: colors.turning.text }}>◇</span>}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* 이벤트 리스트 */}
      <div className="px-4 mb-6">
        <div className="max-w-lg mx-auto">
          <h3 className="font-serif-kr font-bold mb-3" style={{ color: colors.navy }}>{monthNum}월 중요 날짜 <span className="text-xs font-normal" style={{ color: colors.textMuted }}>({filteredDates.length})</span></h3>
          <div className="space-y-2.5">
            {filteredDates.length === 0 ? (
              <div className="rounded-xl p-5 text-center text-sm" style={{ background: colors.card, border: `1px solid ${colors.cardBorder}`, color: colors.textMuted }}>이번 달 해당하는 날짜가 없습니다.</div>
            ) : filteredDates.map((item, i) => {
              const sty = typeStyle[item.type] || typeStyle.lucky;
              return (
                <div key={i} className="rounded-xl p-4 transition-all" style={{ background: colors.card, border: `1px solid ${colors.cardBorder}`, borderLeft: `3px solid ${sty.border}` }}>
                  <div className="flex items-start gap-3">
                    <div className="text-center min-w-[44px]">
                      <div className="text-xl font-bold" style={{ color: sty.text }}>{item.date?.split('-')[2]}</div>
                      <div className="text-[10px]" style={{ color: colors.textMuted }}>{new Date(item.date).toLocaleDateString('ko-KR', { weekday: 'short' })}</div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-1.5 mb-1">
                        {item.type === 'lucky' && <span style={{ color: colors.gold }}>★</span>}
                        {item.type === 'caution' && <span className="font-bold" style={{ color: colors.caution.text }}>!</span>}
                        {item.type === 'turning_point' && <span style={{ color: colors.turning.text }}>◇</span>}
                        <span className="font-bold" style={{ color: colors.navy }}>{item.title}</span>
                        {item.importance === 'high' && <span className="text-[10px] px-1.5 py-0.5 rounded-full font-bold" style={{ background: colors.lucky.bg, color: colors.lucky.text }}>중요</span>}
                      </div>
                      <p className="text-sm leading-relaxed mb-1.5" style={{ color: colors.textSecondary }}>{item.description}</p>
                      <div className="text-xs" style={{ color: sty.text }}>→ {item.action_tip}</div>
                      {item.aspect_basis && <div className="text-[10px] mt-1" style={{ color: colors.textMuted }}>{PLANET_SYMBOLS[item.aspect_basis?.split(' ')[0]] || '⚙️'} {item.aspect_basis}</div>}
                      <a href={getGoogleCalendarUrl(item)} target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 mt-2 text-[10px] px-2.5 py-1 rounded-full border transition-colors hover:opacity-70"
                        style={{ borderColor: colors.cardBorder, color: colors.textMuted }}>
                        ☉ Google Calendar에 추가
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 개운 처방전 */}
      {data.lucky_prescription && (
        <div className="px-4 mb-6">
          <div className="max-w-lg mx-auto">
            <div className="rounded-2xl p-6" style={{ background: colors.card, border: `1px solid ${colors.cardBorder}` }}>
              <h3 className="font-serif-kr font-bold text-center mb-5" style={{ color: colors.navy }}>2026년 개운 처방전</h3>
              <div className="grid grid-cols-3 gap-4">
                {Object.entries(data.lucky_prescription).filter(([k]) => !['dominant_element','lacking_element','balance_tip'].includes(k)).map(([key, value]) => {
                  const labels = { color: { l: '행운 색상', s: '🎨' }, number: { l: '행운 숫자', s: '✦' }, direction: { l: '좋은 방위', s: '◇' }, stone: { l: '파워스톤', s: '◆' }, day: { l: '행운의 요일', s: '☉' }, activity: { l: '개운 활동', s: '♃' } };
                  const info = labels[key] || { l: key, s: '·' };
                  return (
                    <div key={key} className="text-center">
                      <div className="font-serif-kr text-lg mb-1" style={{ color: colors.gold }}>{info.s}</div>
                      <div className="text-[10px]" style={{ color: colors.textMuted }}>{info.l}</div>
                      <div className="text-sm font-bold mt-1" style={{ color: colors.navy }}>{typeof value === 'object' ? JSON.stringify(value) : value}</div>
                    </div>
                  );
                })}
              </div>
              {data.lucky_prescription.balance_tip && (
                <p className="text-sm text-center mt-4" style={{ color: colors.textSecondary }}>{data.lucky_prescription.balance_tip}</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 하단 버튼 */}
      <div className="px-4 pb-12">
        <div className="max-w-lg mx-auto space-y-3">
          <button onClick={() => setViewMode('full')} className="w-full py-4 rounded-xl font-bold text-lg text-white transition-all hover:opacity-90 active:scale-[0.98]" style={{ background: colors.navy }}>
            ☉ 12개월 전체 보기 & 인쇄
          </button>
          <button onClick={downloadICS} className="w-full py-4 rounded-xl font-bold text-lg transition-all hover:opacity-90 active:scale-[0.98]" style={{ background: colors.gold, color: '#fff' }}>
            ☽ 캘린더에 자동 등록하기
          </button>
          <p className="text-center text-xs" style={{ color: colors.textMuted }}>.ics 파일 다운로드 → Google Calendar / Apple Calendar 자동 등록</p>
          <button onClick={() => window.print()} className="w-full py-3 rounded-xl border font-medium transition-all hover:opacity-70" style={{ borderColor: colors.cardBorder, color: colors.textMuted }}>
            🖨️ 현재 화면 PDF로 저장하기
          </button>
        </div>
      </div>

      <p className="text-center text-xs pb-6" style={{ color: colors.textMuted }}>© 2025 OZ Fortune. All rights reserved.</p>
    </div>
  );
};

export default AstroCalendarResultPage;