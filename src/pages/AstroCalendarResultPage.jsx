import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { PRODUCTS } from '../config/products';

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
    const a = document.createElement('a');
    a.href = url; a.download = '2026_점성학_운세달력.ics';
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    URL.revokeObjectURL(url);
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

  const typeColors = {
    lucky: { bg: 'bg-indigo-500/20', border: 'border-indigo-400', text: 'text-indigo-300', dot: 'bg-indigo-400' },
    caution: { bg: 'bg-red-500/20', border: 'border-red-400', text: 'text-red-300', dot: 'bg-red-400' },
    turning_point: { bg: 'bg-amber-500/20', border: 'border-amber-400', text: 'text-amber-300', dot: 'bg-amber-400' },
    special: { bg: 'bg-violet-500/20', border: 'border-violet-400', text: 'text-violet-300', dot: 'bg-violet-400' },
  };

  const theme = PRODUCTS['astro-calendar'].theme;
  const analysis = data?.analysis || {};

  if (loading) return (
    <div className={`min-h-screen bg-gradient-to-br ${theme.bg} flex items-center justify-center`}>
      <div className="text-center"><div className="text-6xl mb-4 animate-bounce">🔭</div><div className={`${theme.text.primary} text-lg`}>점성학 운세 달력을 불러오는 중...</div></div>
    </div>
  );

  if (!data) return (
    <div className={`min-h-screen bg-gradient-to-br ${theme.bg} flex items-center justify-center`}>
      <div className={`${theme.text.primary} text-center`}><div className="text-4xl mb-4">😢</div><p>달력 데이터를 찾을 수 없습니다.</p></div>
    </div>
  );

  const months = Object.keys(data.months || {}).sort();
  const currentMonthData = data.months?.[selectedMonth];
  const calendarGrid = getCalendarGrid(selectedMonth);
  const monthNum = parseInt(selectedMonth.split('-')[1]);
  const filteredDates = (currentMonthData?.dates || []).filter(d => filterType === 'all' || d.type === filterType);

  // 현재 월의 분석 데이터
  const currentHouse = analysis.house_transits?.[selectedMonth];
  const currentPlanet = analysis.dominant_planets?.[selectedMonth];
  const currentElement = analysis.element_balance?.[selectedMonth];
  const currentScore = analysis.monthly_scores?.[selectedMonth];

  // ===== 원소 밸런스 바 컴포넌트 =====
  const ElementBar = ({ percentages }) => {
    if (!percentages) return null;
    const elements = [
      { key: 'fire', emoji: '🔥', name: '불', color: 'bg-red-500' },
      { key: 'earth', emoji: '🌍', name: '땅', color: 'bg-green-600' },
      { key: 'air', emoji: '💨', name: '공기', color: 'bg-blue-400' },
      { key: 'water', emoji: '💧', name: '물', color: 'bg-purple-500' },
    ];
    return (
      <div className="space-y-1.5">
        {elements.map(el => (
          <div key={el.key} className="flex items-center gap-2">
            <span className="text-sm w-6">{el.emoji}</span>
            <span className={`${theme.text.muted} text-xs w-8`}>{el.name}</span>
            <div className="flex-1 h-3 rounded-full bg-white/10 overflow-hidden">
              <div className={`h-full ${el.color} rounded-full transition-all`} style={{ width: `${percentages[el.key] || 0}%` }} />
            </div>
            <span className={`${theme.text.primary} text-xs font-bold w-8 text-right`}>{percentages[el.key] || 0}%</span>
          </div>
        ))}
      </div>
    );
  };

  // ===== 연간 원소 흐름 차트 =====
  const YearlyElementChart = () => {
    const elFlow = data.element_yearly_flow;
    if (!elFlow) return null;
    const monthLabels = ['1','2','3','4','5','6','7','8','9','10','11','12'];
    const elements = [
      { key: 'fire', emoji: '🔥', color: 'bg-red-400', border: 'border-red-400' },
      { key: 'earth', emoji: '🌍', color: 'bg-green-500', border: 'border-green-500' },
      { key: 'air', emoji: '💨', color: 'bg-blue-400', border: 'border-blue-400' },
      { key: 'water', emoji: '💧', color: 'bg-purple-400', border: 'border-purple-400' },
    ];
    return (
      <div>
        <div className="flex justify-center gap-4 mb-3">
          {elements.map(el => (
            <span key={el.key} className={`flex items-center gap-1 text-xs ${theme.text.muted}`}>
              <span className={`w-2.5 h-2.5 rounded-full ${el.color}`} /> {el.emoji}
            </span>
          ))}
        </div>
        <div className="flex items-end gap-0.5 h-24">
          {monthLabels.map((label, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-0">
              <div className="w-full flex flex-col-reverse" style={{ height: '80px' }}>
                {elements.map(el => {
                  const val = elFlow[el.key]?.[i] || 0;
                  return <div key={el.key} className={`w-full ${el.color} opacity-80`} style={{ height: `${val * 0.8}px` }} />;
                })}
              </div>
              <span className={`text-xs ${theme.text.muted} mt-1`}>{label}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // ========== 전체 보기 모드 ==========
  if (viewMode === 'full') {
    return (
      <div className={`min-h-screen bg-gradient-to-br ${theme.bg}`}>
        <style>{`
          @media print {
            body { background: white !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            .no-print { display: none !important; }
            .print-month-page { page-break-before: always; page-break-inside: avoid; min-height: 90vh; padding-top: 10px; }
            .print-first-page { page-break-inside: avoid; }
            .print-container { background: white !important; color: #1a1a1a !important; padding: 10px 20px !important; }
            .print-container * { color: #1a1a1a !important; border-color: #ddd !important; }
            .print-container .print-card { background: #f8f8f8 !important; border: 1px solid #ddd !important; }
          }
        `}</style>

        <div className="no-print sticky top-0 z-50 px-4 py-3" style={{ background: 'rgba(17,24,39,0.95)', backdropFilter: 'blur(8px)' }}>
          <div className="max-w-2xl mx-auto flex items-center justify-between">
            <button onClick={() => setViewMode('monthly')} className={`px-4 py-2 rounded-lg ${theme.card} border ${theme.text.primary} text-sm font-bold`}>← 월별 보기</button>
            <span className={`${theme.text.accent} font-bold`}>🔭 12개월 전체 보기</span>
            <button onClick={() => window.print()} className={`px-4 py-2 rounded-lg bg-gradient-to-r ${theme.button} text-sm font-bold`}>🖨️ 인쇄</button>
          </div>
        </div>

        <div className="print-container max-w-2xl mx-auto px-4 py-6">
          <div className="text-center mb-8">
            <h1 className={`${theme.text.primary} text-3xl font-bold mb-2`}>{data.calendar_title || '🔭 2026년 점성학 운세 달력'}</h1>
            <p className={`${theme.text.secondary} text-sm`}>{data.yearly_summary}</p>
            {data.yearly_keywords && (
              <div className="flex justify-center gap-2 mt-3">
                {data.yearly_keywords.map((kw, i) => (
                  <span key={i} className={`px-3 py-1 rounded-full text-xs ${theme.card} border ${theme.text.accent}`}>#{kw}</span>
                ))}
              </div>
            )}
          </div>

          {/* 연간 요약 */}
          <div className={`${theme.card} print-card rounded-2xl p-5 border mb-6`}>
            <div className="grid grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-300 bg-clip-text text-transparent">{data.yearly_score || 0}점</div>
                <div className={`${theme.text.muted} text-xs mt-1`}>종합 점수</div>
              </div>
              <div>
                <div className={`${theme.text.accent} text-sm font-bold`}>🏆 {data.best_month}</div>
                <div className={`${theme.text.muted} text-xs`}>최고의 달</div>
              </div>
              <div>
                <div className="text-red-300 text-sm font-bold">⚠️ {data.worst_month}</div>
                <div className={`${theme.text.muted} text-xs`}>주의할 달</div>
              </div>
              <div>
                <div className={`${theme.text.accent} text-sm font-bold`}>🔑 {data.yearly_keywords?.[0]}</div>
                <div className={`${theme.text.muted} text-xs`}>올해 키워드</div>
              </div>
            </div>
          </div>

          {/* ═══ 나의 출생 차트 — 빅쓰리 ═══ */}
          {data.astro_data && (
            <div className={`${theme.card} print-card rounded-2xl p-6 border mb-6`}>
              <h2 className={`${theme.text.accent} font-bold text-center mb-1`}>✦ 나의 출생 차트</h2>
              <p className={`${theme.text.muted} text-xs text-center mb-5`}>이 세 별자리를 기반으로 당신만의 달력이 만들어졌습니다</p>

              <div className="grid grid-cols-3 gap-3 mb-5">
                {/* 태양 */}
                <div className="text-center rounded-xl p-4" style={{ background: 'rgba(251,191,36,0.08)', border: '1.5px solid rgba(251,191,36,0.25)' }}>
                  <div className="text-3xl mb-1">{data.astro_data.sun_sign_symbol || '☀️'}</div>
                  <div className={`${theme.text.accent} font-bold text-sm`}>{data.astro_data.sun_sign}</div>
                  <div className={`${theme.text.muted} text-[10px] mt-1`}>태양 — 나의 본질</div>
                  <div className={`${theme.text.secondary} text-xs mt-2 leading-relaxed`}>외부에 보여지는 성격과 자아의 핵심 에너지</div>
                </div>

                {/* 달 */}
                <div className="text-center rounded-xl p-4" style={{ background: 'rgba(147,197,253,0.08)', border: '1.5px solid rgba(147,197,253,0.25)' }}>
                  <div className="text-3xl mb-1">🌙</div>
                  <div className={`${theme.text.accent} font-bold text-sm`}>{data.astro_data.moon_sign}</div>
                  <div className={`${theme.text.muted} text-[10px] mt-1`}>달 — 나의 감정</div>
                  <div className={`${theme.text.secondary} text-xs mt-2 leading-relaxed`}>내면의 감정과 무의식적 반응 패턴</div>
                </div>

                {/* 어센던트 */}
                <div className="text-center rounded-xl p-4" style={{ background: 'rgba(192,132,252,0.08)', border: '1.5px solid rgba(192,132,252,0.25)' }}>
                  <div className="text-3xl mb-1">⬆️</div>
                  <div className={`${theme.text.accent} font-bold text-sm`}>{data.astro_data.rising_sign}</div>
                  <div className={`${theme.text.muted} text-[10px] mt-1`}>상승궁 — 첫인상</div>
                  <div className={`${theme.text.secondary} text-xs mt-2 leading-relaxed`}>타인이 처음 느끼는 나의 분위기와 이미지</div>
                </div>
              </div>

              <div className="rounded-lg px-4 py-3" style={{ background: 'rgba(99,102,241,0.06)', borderLeft: '3px solid rgba(99,102,241,0.4)' }}>
                <div className={`${theme.text.secondary} text-xs leading-relaxed text-center`}>
                  태양·달·상승궁의 에너지 조합과 2026년 행성 트랜짓을 분석하여 <strong className={theme.text.primary}>당신만을 위한 맞춤 달력</strong>을 만들었습니다
                </div>
              </div>
            </div>
          )}

          {/* 역행 캘린더 */}
          {data.retrograde_periods?.length > 0 && (
            <div className={`${theme.card} print-card rounded-2xl p-5 border mb-6`}>
              <h3 className={`${theme.text.accent} font-bold mb-3`}>🔄 역행 주의 기간</h3>
              <div className="space-y-2">
                {data.retrograde_periods.map((r, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="text-lg">{'📱💕⚡🍀⏰💡🌊'[i % 7] || '🔄'}</span>
                    <div className="flex-1">
                      <span className={`${theme.text.primary} font-bold text-sm`}>{r.planet_kr || r.planet} 역행</span>
                      <span className={`${theme.text.muted} text-xs ml-2`}>{r.period}</span>
                    </div>
                    <span className={`${theme.text.secondary} text-xs`}>{r.impact}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TOP 날짜 */}
          {data.top_dates?.length > 0 && (
            <div className="mb-6">
              <h2 className={`${theme.text.accent} font-bold mb-3`}>🏆 올해의 행운 날짜 TOP</h2>
              <div className="space-y-2">
                {data.top_dates.slice(0, 5).map((item, i) => (
                  <div key={i} className={`${theme.card} print-card rounded-xl p-3 border flex items-center gap-3`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${i === 0 ? 'bg-yellow-500/30 text-yellow-300' : i === 1 ? 'bg-gray-400/30 text-gray-300' : 'bg-indigo-500/30 text-indigo-300'}`}>{i + 1}</div>
                    <div className="flex-1">
                      <span className={`${theme.text.primary} font-bold`}>{item.title}</span>
                      <span className={`${theme.text.muted} text-sm ml-2`}>{item.reason}</span>
                    </div>
                    <div className={`${theme.text.accent} text-sm font-mono font-bold`}>{item.date}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 주의 날짜 */}
          {data.caution_dates?.length > 0 && (
            <div className="mb-6">
              <h2 className="text-red-400 font-bold mb-3">⚠️ 주의할 날짜</h2>
              <div className="space-y-2">
                {data.caution_dates.slice(0, 3).map((item, i) => (
                  <div key={i} className={`${theme.card} print-card rounded-xl p-3 border border-red-500/30 flex items-center gap-3`}>
                    <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold bg-red-500/30 text-red-300">{i + 1}</div>
                    <div className="flex-1">
                      <span className={`${theme.text.primary} font-bold`}>{item.title}</span>
                      <span className={`${theme.text.muted} text-sm ml-2`}>{item.reason}</span>
                    </div>
                    <div className="text-red-300 text-sm font-mono font-bold">{item.date}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 12개월 전체 */}
          {months.map((m, monthIdx) => {
            const md = data.months[m];
            const mNum = parseInt(m.split('-')[1]);
            const mDates = md?.dates || [];
            const mGrid = getCalendarGrid(m);
            const scoreColor = md?.month_score >= 70 ? 'from-indigo-400 to-purple-300' : md?.month_score >= 50 ? 'from-amber-400 to-yellow-300' : 'from-red-400 to-orange-300';
            const mHouse = analysis.house_transits?.[m];
            const mPlanet = analysis.dominant_planets?.[m];
            const mElement = analysis.element_balance?.[m];

            return (
              <div key={m} className={`mb-8 ${monthIdx > 0 ? 'print-month-page' : 'print-first-page'}`}>
                <div className={`${theme.card} print-card rounded-2xl p-4 border mb-3`}>
                  <div className="flex items-center justify-between mb-2">
                    <h2 className={`${theme.text.primary} text-xl font-bold`}>📅 {mNum}월</h2>
                    <div className={`text-2xl font-bold bg-gradient-to-r ${scoreColor} bg-clip-text text-transparent`}>{md?.month_score || 0}점</div>
                  </div>
                  <p className={`${theme.text.secondary} text-sm mb-2`}>{md?.month_summary}</p>
                  {/* 월별 미니 분석 */}
                  <div className="flex flex-wrap gap-2 text-xs">
                    {mPlanet && <span className={`px-2 py-1 rounded-full ${theme.card} border`}>{mPlanet.emoji} {mPlanet.planet_kr}</span>}
                    {mHouse && <span className={`px-2 py-1 rounded-full ${theme.card} border`}>{mHouse.emoji} {mHouse.area}</span>}
                    {mElement?.dominant && <span className={`px-2 py-1 rounded-full ${theme.card} border`}>{mElement.dominant.emoji} {mElement.dominant.name}({mElement.dominant.percent}%)</span>}
                    {md?.month_grade && <span className={`px-2 py-1 rounded-full ${theme.card} border ${md.month_grade === '대길' || md.month_grade === '길' ? 'text-indigo-300' : md.month_grade === '흉' || md.month_grade === '소흉' ? 'text-red-300' : theme.text.muted}`}>{md.month_grade}</span>}
                  </div>
                </div>

                {/* 미니 달력 */}
                <div className={`${theme.card} print-card rounded-xl p-3 border mb-3`}>
                  <div className="grid grid-cols-7 gap-1 mb-1">
                    {['일','월','화','수','목','금','토'].map((d, i) => (
                      <div key={d} className={`text-center text-xs font-bold ${i === 0 ? 'text-red-400' : i === 6 ? 'text-blue-400' : theme.text.muted}`}>{d}</div>
                    ))}
                  </div>
                  <div className="grid grid-cols-7 gap-1">
                    {mGrid.map((day, i) => {
                      if (day === null) return <div key={`e-${i}`} className="aspect-square" />;
                      const events = getEventsForDate(m, day);
                      const hasEvents = events.length > 0;
                      const dayOfWeek = new Date(parseInt(m.split('-')[0]), parseInt(m.split('-')[1]) - 1, day).getDay();
                      return (
                        <div key={day} className={`aspect-square rounded flex flex-col items-center justify-center text-xs ${hasEvents ? `${typeColors[events[0]?.type]?.bg} border ${typeColors[events[0]?.type]?.border}` : ''}`}>
                          <div className={`font-bold ${dayOfWeek === 0 ? 'text-red-400' : dayOfWeek === 6 ? 'text-blue-400' : theme.text.primary}`}>{day}</div>
                          {hasEvents && <div className="flex gap-0.5">{events.slice(0, 2).map((e, j) => <div key={j} className={`w-1 h-1 rounded-full ${typeColors[e.type]?.dot}`} />)}</div>}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 날짜 리스트 */}
                <div className="space-y-2">
                  {mDates.map((item, i) => {
                    const colors = typeColors[item.type] || typeColors.lucky;
                    return (
                      <div key={i} className={`${theme.card} print-card rounded-xl p-3 border-l-4 ${colors.border}`}>
                        <div className="flex items-start gap-3">
                          <div className="text-center min-w-[40px]">
                            <div className={`text-xl font-bold ${colors.text}`}>{item.date?.split('-')[2]}</div>
                            <div className={`text-xs ${theme.text.muted}`}>{new Date(item.date).toLocaleDateString('ko-KR', { weekday: 'short' })}</div>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span>{item.emoji}</span>
                              <span className={`${theme.text.primary} font-bold text-sm`}>{item.title}</span>
                              {item.importance === 'high' && <span className="text-xs px-1.5 py-0.5 rounded-full bg-red-500/30 text-red-300">중요</span>}
                            </div>
                            <p className={`${theme.text.secondary} text-xs mb-1`}>{item.description}</p>
                            <div className={`text-xs ${colors.text}`}>💡 {item.action_tip}</div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {/* 개운 처방전 */}
          {data.lucky_prescription && (
            <div className={`${theme.card} print-card rounded-2xl p-5 border mb-6 print-month-page`}>
              <h3 className={`${theme.text.accent} font-bold mb-4 text-center`}>🍀 2026년 점성학 개운 처방전</h3>
              <div className="grid grid-cols-3 gap-4">
                {Object.entries(data.lucky_prescription).filter(([k]) => !['dominant_element','lacking_element','balance_tip'].includes(k)).map(([key, value]) => {
                  const labels = { color: { l: '행운 색상', e: '🎨' }, number: { l: '행운 숫자', e: '🔢' }, direction: { l: '좋은 방위', e: '🧭' }, stone: { l: '파워스톤', e: '💎' }, day: { l: '행운의 요일', e: '📅' }, activity: { l: '개운 활동', e: '🏃' } };
                  const info = labels[key] || { l: key, e: '📌' };
                  return (
                    <div key={key} className="text-center">
                      <div className="text-2xl mb-1">{info.e}</div>
                      <div className={`${theme.text.muted} text-xs`}>{info.l}</div>
                      <div className={`${theme.text.primary} text-sm font-bold mt-1`}>{typeof value === 'object' ? JSON.stringify(value) : value}</div>
                    </div>
                  );
                })}
              </div>
              {data.lucky_prescription.balance_tip && (
                <p className={`${theme.text.secondary} text-sm text-center mt-4`}>{data.lucky_prescription.balance_tip}</p>
              )}
            </div>
          )}

          <div className="no-print space-y-3 mt-8">
            <button onClick={downloadICS} className={`w-full py-4 rounded-xl bg-gradient-to-r ${theme.button} font-bold text-lg transition-all hover:scale-[1.02]`}>📅 캘린더에 자동 등록하기</button>
            <button onClick={() => window.print()} className={`w-full py-3 rounded-xl ${theme.card} border ${theme.text.primary} font-bold`}>🖨️ PDF로 저장하기</button>
            <button onClick={() => setViewMode('monthly')} className={`w-full py-3 rounded-xl ${theme.card} border ${theme.text.muted} font-bold`}>← 월별 보기로 돌아가기</button>
          </div>
          <p className={`text-center ${theme.text.muted} text-xs mt-8`}>© 2025 OZ Fortune. All rights reserved.</p>
        </div>
      </div>
    );
  }

  // ========== 월별 보기 모드 ==========
  return (
    <div className={`min-h-screen bg-gradient-to-br ${theme.bg}`}>
      {/* 헤더 */}
      <div className="px-4 pt-8 pb-4">
        <div className="max-w-lg mx-auto text-center">
          <div className="text-5xl mb-3">🔭</div>
          <h1 className={`${theme.text.primary} text-2xl font-bold mb-1`}>{data.calendar_title || '🔭 2026년 점성학 운세 달력'}</h1>
          <p className={`${theme.text.secondary} text-sm`}>{data.yearly_summary}</p>
          {data.yearly_keywords && (
            <div className="flex justify-center gap-2 mt-3">
              {data.yearly_keywords.map((kw, i) => (
                <span key={i} className={`px-3 py-1 rounded-full text-xs ${theme.card} border ${theme.text.accent}`}>#{kw}</span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 연간 요약 */}
      <div className="px-4 mb-4">
        <div className="max-w-lg mx-auto">
          <div className={`${theme.card} rounded-2xl p-5 border`}>
            <div className="grid grid-cols-3 gap-4 text-center mb-4">
              <div>
                <div className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-300 bg-clip-text text-transparent">{data.yearly_score || 0}</div>
                <div className={`${theme.text.muted} text-xs mt-1`}>종합 점수</div>
              </div>
              <div>
                <div className="text-2xl mb-1">🏆</div>
                <div className={`${theme.text.accent} text-sm font-bold`}>{data.best_month}</div>
                <div className={`${theme.text.muted} text-xs`}>최고의 달</div>
              </div>
              <div>
                <div className="text-2xl mb-1">⚠️</div>
                <div className="text-red-300 text-sm font-bold">{data.worst_month}</div>
                <div className={`${theme.text.muted} text-xs`}>주의할 달</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 🔄 역행 주의 기간 */}
      {data.retrograde_periods?.length > 0 && (
        <div className="px-4 mb-4">
          <div className="max-w-lg mx-auto">
            <h2 className={`${theme.text.accent} font-bold mb-3 text-center`}>🔄 역행 주의 기간</h2>
            <div className={`${theme.card} rounded-2xl p-4 border`}>
              <div className="space-y-3">
                {data.retrograde_periods.map((r, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className="text-xl mt-0.5">{'📱💕⚡🍀⏰💡🌊'.split('')[i % 7] || '🔄'}</span>
                    <div className="flex-1">
                      <div className={`${theme.text.primary} font-bold text-sm`}>{r.planet_kr || r.planet} 역행 <span className={`${theme.text.muted} font-normal`}>({r.period})</span></div>
                      <div className={`${theme.text.secondary} text-xs mt-0.5`}>{r.impact}</div>
                      {r.advice && <div className={`${theme.text.muted} text-xs mt-0.5`}>💡 {r.advice}</div>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══ 나의 빅쓰리 (간략) ═══ */}
      {data.astro_data && (
        <div className="px-4 mb-4">
          <div className="max-w-lg mx-auto">
            <div className={`${theme.card} rounded-2xl p-4 border`}>
              <h2 className={`${theme.text.accent} font-bold text-sm text-center mb-3`}>✦ 나의 출생 차트</h2>
              <div className="grid grid-cols-3 gap-2 mb-2">
                <div className="text-center rounded-lg p-2" style={{ background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.2)' }}>
                  <div className="text-xl mb-0.5">{data.astro_data.sun_sign_symbol || '☀️'}</div>
                  <div className={`${theme.text.accent} font-bold text-xs`}>{data.astro_data.sun_sign}</div>
                  <div className={`${theme.text.muted} text-[9px]`}>태양</div>
                </div>
                <div className="text-center rounded-lg p-2" style={{ background: 'rgba(147,197,253,0.08)', border: '1px solid rgba(147,197,253,0.2)' }}>
                  <div className="text-xl mb-0.5">🌙</div>
                  <div className={`${theme.text.accent} font-bold text-xs`}>{data.astro_data.moon_sign}</div>
                  <div className={`${theme.text.muted} text-[9px]`}>달</div>
                </div>
                <div className="text-center rounded-lg p-2" style={{ background: 'rgba(192,132,252,0.08)', border: '1px solid rgba(192,132,252,0.2)' }}>
                  <div className="text-xl mb-0.5">⬆️</div>
                  <div className={`${theme.text.accent} font-bold text-xs`}>{data.astro_data.rising_sign}</div>
                  <div className={`${theme.text.muted} text-[9px]`}>상승궁</div>
                </div>
              </div>
              <div className={`${theme.text.muted} text-[10px] text-center`}>이 에너지 조합으로 당신만의 달력이 만들어졌습니다</div>
            </div>
          </div>
        </div>
      )}

      {/* TOP 날짜 */}
      {data.top_dates?.length > 0 && (
        <div className="px-4 mb-4">
          <div className="max-w-lg mx-auto">
            <h2 className={`${theme.text.accent} font-bold mb-3 text-center`}>🏆 올해의 행운 날짜 TOP</h2>
            <div className="space-y-2">
              {data.top_dates.slice(0, 5).map((item, i) => (
                <div key={i} className={`${theme.card} rounded-xl p-4 border flex items-center gap-4`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${i === 0 ? 'bg-yellow-500/30 text-yellow-300' : i === 1 ? 'bg-gray-400/30 text-gray-300' : 'bg-indigo-500/30 text-indigo-300'}`}>{i + 1}</div>
                  <div className="flex-1">
                    <div className={`${theme.text.primary} font-bold`}>{item.title}</div>
                    <div className={`${theme.text.muted} text-sm`}>{item.reason}</div>
                  </div>
                  <div className={`${theme.text.accent} text-sm font-mono font-bold`}>{item.date?.split('-').slice(1).join('/')}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 월별 점수 바 */}
      <div className="px-4 mb-4">
        <div className="max-w-lg mx-auto">
          <h2 className={`${theme.text.accent} font-bold mb-3 text-center`}>📊 월별 운세 흐름</h2>
          <div className={`${theme.card} rounded-2xl p-4 border`}>
            <div className="flex items-end gap-1 h-32">
              {months.map((m) => {
                const md = data.months[m];
                const score = md?.month_score || 0;
                const isSelected = m === selectedMonth;
                return (
                  <button key={m} onClick={() => setSelectedMonth(m)}
                    className={`flex-1 flex flex-col items-center justify-end gap-1 transition-all ${isSelected ? 'scale-105' : 'opacity-60 hover:opacity-80'}`}>
                    <div className={`${theme.text.primary} text-xs font-bold`}>{score}</div>
                    <div className={`w-full rounded-t-lg transition-all ${isSelected ? 'bg-gradient-to-t from-indigo-500 to-purple-300' : score >= 70 ? 'bg-indigo-500/40' : score >= 50 ? 'bg-amber-500/40' : 'bg-red-500/40'}`}
                      style={{ height: `${Math.max(score * 0.8, 10)}%` }} />
                    <div className={`text-xs ${isSelected ? theme.text.accent + ' font-bold' : theme.text.muted}`}>{parseInt(m.split('-')[1])}월</div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* 월 선택 + 필터 */}
      <div className="px-4 mb-2">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button onClick={() => { const idx = months.indexOf(selectedMonth); if (idx > 0) setSelectedMonth(months[idx - 1]); }}
              className={`w-8 h-8 rounded-full ${theme.card} border flex items-center justify-center ${theme.text.primary}`}>◀</button>
            <span className={`${theme.text.primary} font-bold text-lg`}>{monthNum}월</span>
            <button onClick={() => { const idx = months.indexOf(selectedMonth); if (idx < months.length - 1) setSelectedMonth(months[idx + 1]); }}
              className={`w-8 h-8 rounded-full ${theme.card} border flex items-center justify-center ${theme.text.primary}`}>▶</button>
          </div>
          <div className="flex gap-1">
            {[{ key: 'all', label: '전체' }, { key: 'lucky', label: '🍀' }, { key: 'caution', label: '⚠️' }].map(f => (
              <button key={f.key} onClick={() => setFilterType(f.key)}
                className={`px-3 py-1 rounded-full text-xs transition-all ${filterType === f.key ? 'bg-indigo-500 text-white' : `${theme.card} border ${theme.text.muted}`}`}>{f.label}</button>
            ))}
          </div>
        </div>
      </div>

      {/* 🌟 월 요약 + 3가지 분석 */}
      {currentMonthData && (
        <div className="px-4 mb-3">
          <div className="max-w-lg mx-auto">
            <div className={`${theme.card} rounded-xl p-4 border`}>
              {/* 점수 + 등급 */}
              <div className="flex items-center justify-between mb-2">
                <div>
                  <span className={`${theme.text.accent} font-bold`}>{monthNum}월 운세</span>
                  {currentMonthData.month_grade && <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${currentMonthData.month_grade === '대길' || currentMonthData.month_grade === '길' ? 'bg-indigo-500/30 text-indigo-300' : currentMonthData.month_grade === '흉' || currentMonthData.month_grade === '소흉' ? 'bg-red-500/30 text-red-300' : 'bg-amber-500/30 text-amber-300'}`}>{currentMonthData.month_grade}</span>}
                </div>
                <div className={`text-lg font-bold bg-gradient-to-r ${currentMonthData.month_score >= 70 ? 'from-indigo-400 to-purple-300' : currentMonthData.month_score >= 50 ? 'from-amber-400 to-yellow-300' : 'from-red-400 to-orange-300'} bg-clip-text text-transparent`}>{currentMonthData.month_score}점</div>
              </div>
              <p className={`${theme.text.secondary} text-sm mb-3`}>{currentMonthData.month_summary}</p>

              {/* 3가지 미니 분석 태그 */}
              <div className="grid grid-cols-3 gap-2">
                {currentPlanet && (
                  <div className={`${theme.card} rounded-lg p-2 border text-center`}>
                    <div className="text-lg">{currentPlanet.emoji}</div>
                    <div className={`${theme.text.muted} text-xs`}>지배 행성</div>
                    <div className={`${theme.text.primary} text-xs font-bold`}>{currentPlanet.planet_kr}</div>
                    <div className={`${theme.text.muted} text-xs`}>{currentPlanet.theme}</div>
                  </div>
                )}
                {currentHouse && (
                  <div className={`${theme.card} rounded-lg p-2 border text-center`}>
                    <div className="text-lg">{currentHouse.emoji}</div>
                    <div className={`${theme.text.muted} text-xs`}>핵심 영역</div>
                    <div className={`${theme.text.primary} text-xs font-bold`}>{currentHouse.area}</div>
                    <div className={`${theme.text.muted} text-xs`}>{currentHouse.keyword}</div>
                  </div>
                )}
                {currentElement?.dominant && (
                  <div className={`${theme.card} rounded-lg p-2 border text-center`}>
                    <div className="text-lg">{currentElement.dominant.emoji}</div>
                    <div className={`${theme.text.muted} text-xs`}>우세 원소</div>
                    <div className={`${theme.text.primary} text-xs font-bold`}>{currentElement.dominant.name} {currentElement.dominant.percent}%</div>
                    <div className={`${theme.text.muted} text-xs`}>{currentElement.lacking?.name} 부족</div>
                  </div>
                )}
              </div>

              {/* 원소 밸런스 바 */}
              {currentElement?.percentages && (
                <div className="mt-3">
                  <ElementBar percentages={currentElement.percentages} />
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 달력 그리드 */}
      <div className="px-4 mb-4">
        <div className="max-w-lg mx-auto">
          <div className={`${theme.card} rounded-2xl p-4 border`}>
            <div className="grid grid-cols-7 gap-1 mb-2">
              {['일','월','화','수','목','금','토'].map((d, i) => (
                <div key={d} className={`text-center text-xs font-bold py-1 ${i === 0 ? 'text-red-400' : i === 6 ? 'text-blue-400' : theme.text.muted}`}>{d}</div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {calendarGrid.map((day, i) => {
                if (day === null) return <div key={`e-${i}`} className="aspect-square" />;
                const events = getEventsForDate(selectedMonth, day).filter(e => filterType === 'all' || e.type === filterType);
                const hasEvents = events.length > 0;
                const dayOfWeek = new Date(parseInt(selectedMonth.split('-')[0]), parseInt(selectedMonth.split('-')[1]) - 1, day).getDay();
                return (
                  <div key={day} className={`aspect-square rounded-lg flex flex-col items-center justify-center relative transition-all ${hasEvents ? `${typeColors[events[0]?.type]?.bg} cursor-pointer hover:scale-105 border ${typeColors[events[0]?.type]?.border}` : 'hover:bg-white/5'}`}
                    title={hasEvents ? events.map(e => `${e.emoji} ${e.title}`).join('\n') : ''}>
                    <div className={`text-sm font-bold ${dayOfWeek === 0 ? 'text-red-400' : dayOfWeek === 6 ? 'text-blue-400' : theme.text.primary}`}>{day}</div>
                    {hasEvents && <div className="flex gap-0.5 mt-0.5">{events.slice(0, 3).map((e, j) => <div key={j} className={`w-1.5 h-1.5 rounded-full ${typeColors[e.type]?.dot}`} />)}</div>}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* 이벤트 리스트 */}
      <div className="px-4 mb-4">
        <div className="max-w-lg mx-auto">
          <h3 className={`${theme.text.accent} font-bold mb-3`}>📌 {monthNum}월 중요 날짜 ({filteredDates.length}개)</h3>
          <div className="space-y-2">
            {filteredDates.length === 0 ? (
              <div className={`${theme.card} rounded-xl p-4 border text-center ${theme.text.muted}`}>이번 달 해당하는 날짜가 없습니다.</div>
            ) : filteredDates.map((item, i) => {
              const colors = typeColors[item.type] || typeColors.lucky;
              return (
                <div key={i} className={`${theme.card} rounded-xl p-4 border ${colors.border} border-l-4 transition-all hover:scale-[1.01]`}>
                  <div className="flex items-start gap-3">
                    <div className="text-center min-w-[48px]">
                      <div className={`text-2xl font-bold ${colors.text}`}>{item.date?.split('-')[2]}</div>
                      <div className={`text-xs ${theme.text.muted}`}>{new Date(item.date).toLocaleDateString('ko-KR', { weekday: 'short' })}</div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-lg">{item.emoji}</span>
                        <span className={`${theme.text.primary} font-bold`}>{item.title}</span>
                        {item.importance === 'high' && <span className="text-xs px-2 py-0.5 rounded-full bg-red-500/30 text-red-300">중요</span>}
                      </div>
                      <p className={`${theme.text.secondary} text-sm mb-2`}>{item.description}</p>
                      <div className={`flex items-center gap-2 text-sm ${colors.text}`}><span>💡</span><span>{item.action_tip}</span></div>
                      {item.aspect_basis && <div className={`${theme.text.muted} text-xs mt-1`}>⚙️ {item.aspect_basis}</div>}
                      <a href={getGoogleCalendarUrl(item)} target="_blank" rel="noopener noreferrer"
                        className={`inline-flex items-center gap-1 mt-2 text-xs px-3 py-1 rounded-full ${theme.card} border ${theme.text.muted} hover:text-indigo-300 transition-colors`}>
                        📅 Google Calendar에 추가
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
        <div className="px-4 mb-4">
          <div className="max-w-lg mx-auto">
            <div className={`${theme.card} rounded-2xl p-5 border`}>
              <h3 className={`${theme.text.accent} font-bold mb-4 text-center`}>🍀 2026년 점성학 개운 처방전</h3>
              <div className="grid grid-cols-3 gap-3">
                {Object.entries(data.lucky_prescription).filter(([k]) => !['dominant_element','lacking_element','balance_tip'].includes(k)).map(([key, value]) => {
                  const labels = { color: { l: '행운 색상', e: '🎨' }, number: { l: '행운 숫자', e: '🔢' }, direction: { l: '좋은 방위', e: '🧭' }, stone: { l: '파워스톤', e: '💎' }, day: { l: '행운의 요일', e: '📅' }, activity: { l: '개운 활동', e: '🏃' } };
                  const info = labels[key] || { l: key, e: '📌' };
                  return (
                    <div key={key} className="text-center">
                      <div className="text-2xl mb-1">{info.e}</div>
                      <div className={`${theme.text.muted} text-xs`}>{info.l}</div>
                      <div className={`${theme.text.primary} text-sm font-bold mt-1`}>{typeof value === 'object' ? JSON.stringify(value) : value}</div>
                    </div>
                  );
                })}
              </div>
              {data.lucky_prescription.balance_tip && (
                <p className={`${theme.text.secondary} text-sm text-center mt-3`}>{data.lucky_prescription.balance_tip}</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 하단 버튼 */}
      <div className="px-4 pb-12">
        <div className="max-w-lg mx-auto space-y-3">
          <button onClick={() => setViewMode('full')}
            className={`w-full py-4 rounded-xl bg-gradient-to-r from-violet-500 to-purple-600 font-bold text-lg text-white transition-all hover:scale-[1.02] active:scale-95 shadow-lg`}>
            📋 12개월 전체 보기 &amp; 인쇄
          </button>
          <button onClick={downloadICS}
            className={`w-full py-4 rounded-xl bg-gradient-to-r ${theme.button} font-bold text-lg transition-all hover:scale-[1.02] active:scale-95 shadow-lg`}>
            📅 캘린더에 자동 등록하기
          </button>
          <p className={`text-center ${theme.text.muted} text-xs`}>.ics 파일 다운로드 → Google Calendar / Apple Calendar 자동 등록</p>
          <button onClick={() => window.print()}
            className={`w-full py-3 rounded-xl ${theme.card} border ${theme.text.primary} font-bold transition-all hover:scale-[1.02]`}>
            🖨️ 현재 화면 PDF로 저장하기
          </button>
        </div>
      </div>

      <p className={`text-center ${theme.text.muted} text-xs pb-6`}>© 2025 OZ Fortune. All rights reserved.</p>
    </div>
  );
};

export default AstroCalendarResultPage;