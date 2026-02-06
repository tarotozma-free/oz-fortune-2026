import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../config/supabase';
import { PRODUCTS } from '../config/products';

const CalendarResultPage = () => {
  const { orderId } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState('2026-01');
  const [filterType, setFilterType] = useState('all');

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
    a.href = url; a.download = '2026_운세달력.ics';
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
    lucky: { bg: 'bg-emerald-500/20', border: 'border-emerald-400', text: 'text-emerald-300', dot: 'bg-emerald-400' },
    caution: { bg: 'bg-red-500/20', border: 'border-red-400', text: 'text-red-300', dot: 'bg-red-400' },
    turning_point: { bg: 'bg-amber-500/20', border: 'border-amber-400', text: 'text-amber-300', dot: 'bg-amber-400' },
    special: { bg: 'bg-purple-500/20', border: 'border-purple-400', text: 'text-purple-300', dot: 'bg-purple-400' },
  };

  const theme = PRODUCTS.calendar.theme;

  if (loading) return (
    <div className={`min-h-screen bg-gradient-to-br ${theme.bg} flex items-center justify-center`}>
      <div className="text-center"><div className="text-6xl mb-4 animate-bounce">🗓️</div><div className={`${theme.text.primary} text-lg`}>운세 달력을 불러오는 중...</div></div>
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

  return (
    <div className={`min-h-screen bg-gradient-to-br ${theme.bg}`}>
      {/* 헤더 */}
      <div className="px-4 pt-8 pb-4">
        <div className="max-w-lg mx-auto text-center">
          <div className="text-5xl mb-3">🗓️</div>
          <h1 className={`${theme.text.primary} text-2xl font-bold mb-1`}>{data.calendar_title || '2026년 운세 달력'}</h1>
          <p className={`${theme.text.secondary} text-sm`}>{data.yearly_summary}</p>
        </div>
      </div>

      {/* 연간 요약 */}
      <div className="px-4 mb-4">
        <div className="max-w-lg mx-auto">
          <div className={`${theme.card} rounded-2xl p-5 border`}>
            <div className="grid grid-cols-3 gap-4 text-center mb-4">
              <div>
                <div className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">{data.yearly_score || 0}</div>
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
            <div className="text-center">
              <span className={`inline-block px-4 py-2 rounded-full ${theme.card} border ${theme.text.accent} text-sm font-bold`}>🔑 올해의 키워드: {data.yearly_keyword}</span>
            </div>
          </div>
        </div>
      </div>

      {/* TOP 3 */}
      {data.top_dates?.length > 0 && (
        <div className="px-4 mb-4">
          <div className="max-w-lg mx-auto">
            <h2 className={`${theme.text.accent} font-bold mb-3 text-center`}>🏆 올해 꼭 기억할 날짜 TOP 3</h2>
            <div className="space-y-2">
              {data.top_dates.map((item, i) => (
                <div key={i} className={`${theme.card} rounded-xl p-4 border flex items-center gap-4`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${i === 0 ? 'bg-yellow-500/30 text-yellow-300' : i === 1 ? 'bg-gray-400/30 text-gray-300' : 'bg-orange-500/30 text-orange-300'}`}>{i + 1}</div>
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
                    <div className={`w-full rounded-t-lg transition-all ${isSelected ? 'bg-gradient-to-t from-emerald-500 to-teal-300' : score >= 70 ? 'bg-emerald-500/40' : score >= 50 ? 'bg-amber-500/40' : 'bg-red-500/40'}`}
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
                className={`px-3 py-1 rounded-full text-xs transition-all ${filterType === f.key ? 'bg-emerald-500 text-white' : `${theme.card} border ${theme.text.muted}`}`}>{f.label}</button>
            ))}
          </div>
        </div>
      </div>

      {/* 월 요약 */}
      {currentMonthData && (
        <div className="px-4 mb-3">
          <div className="max-w-lg mx-auto">
            <div className={`${theme.card} rounded-xl p-3 border`}>
              <div className="flex items-center justify-between">
                <div>
                  <span className={`${theme.text.accent} font-bold`}>{monthNum}월 운세</span>
                  <span className={`${theme.text.muted} text-sm ml-2`}>{currentMonthData.month_element}</span>
                </div>
                <div className={`text-lg font-bold bg-gradient-to-r ${currentMonthData.month_score >= 70 ? 'from-emerald-400 to-teal-300' : currentMonthData.month_score >= 50 ? 'from-amber-400 to-yellow-300' : 'from-red-400 to-orange-300'} bg-clip-text text-transparent`}>{currentMonthData.month_score}점</div>
              </div>
              <p className={`${theme.text.secondary} text-sm mt-1`}>{currentMonthData.month_summary}</p>
            </div>
          </div>
        </div>
      )}

      {/* 달력 그리드 */}
      <div className="px-4 mb-4">
        <div className="max-w-lg mx-auto">
          <div className={`${theme.card} rounded-2xl p-4 border`}>
            <div className="grid grid-cols-7 gap-1 mb-2">
              {['일', '월', '화', '수', '목', '금', '토'].map((d, i) => (
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
                  <div key={day} className={`aspect-square rounded-lg flex flex-col items-center justify-center relative transition-all ${hasEvents ? `${typeColors[events[0]?.type]?.bg || 'bg-emerald-500/10'} cursor-pointer hover:scale-105 border ${typeColors[events[0]?.type]?.border || 'border-emerald-400/30'}` : 'hover:bg-white/5'}`}
                    title={hasEvents ? events.map(e => `${e.emoji} ${e.title}`).join('\n') : ''}>
                    <div className={`text-sm font-bold ${dayOfWeek === 0 ? 'text-red-400' : dayOfWeek === 6 ? 'text-blue-400' : theme.text.primary}`}>{day}</div>
                    {hasEvents && <div className="flex gap-0.5 mt-0.5">{events.slice(0, 3).map((e, j) => <div key={j} className={`w-1.5 h-1.5 rounded-full ${typeColors[e.type]?.dot || 'bg-emerald-400'}`} />)}</div>}
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
                      <a href={getGoogleCalendarUrl(item)} target="_blank" rel="noopener noreferrer"
                        className={`inline-flex items-center gap-1 mt-2 text-xs px-3 py-1 rounded-full ${theme.card} border ${theme.text.muted} hover:text-emerald-300 transition-colors`}>
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
              <h3 className={`${theme.text.accent} font-bold mb-4 text-center`}>🍀 2026년 개운 처방전</h3>
              <div className="grid grid-cols-3 gap-3">
                {Object.entries(data.lucky_prescription).map(([key, value]) => {
                  const labels = { color: { l: '행운 색상', e: '🎨' }, number: { l: '행운 숫자', e: '🔢' }, direction: { l: '좋은 방위', e: '🧭' }, item: { l: '행운 아이템', e: '💎' }, action: { l: '운 높이는 행동', e: '🏃' }, avoid: { l: '피할 것', e: '🚫' } };
                  const info = labels[key] || { l: key, e: '📌' };
                  return (
                    <div key={key} className="text-center">
                      <div className="text-2xl mb-1">{info.e}</div>
                      <div className={`${theme.text.muted} text-xs`}>{info.l}</div>
                      <div className={`${theme.text.primary} text-sm font-bold mt-1`}>{value}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 하단 버튼 */}
      <div className="px-4 pb-12">
        <div className="max-w-lg mx-auto space-y-3">
          <button onClick={downloadICS}
            className={`w-full py-4 rounded-xl bg-gradient-to-r ${theme.button} font-bold text-lg transition-all hover:scale-[1.02] active:scale-95 shadow-lg`}>
            📅 캘린더에 자동 등록하기
          </button>
          <p className={`text-center ${theme.text.muted} text-xs`}>.ics 파일 다운로드 → Google Calendar / Apple Calendar 자동 등록</p>
          <button onClick={() => window.print()}
            className={`w-full py-3 rounded-xl ${theme.card} border ${theme.text.primary} font-bold transition-all hover:scale-[1.02]`}>
            🖨️ PDF로 저장하기
          </button>
        </div>
      </div>
    </div>
  );
};


export default CalendarResultPage;