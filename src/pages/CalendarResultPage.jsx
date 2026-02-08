import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { PRODUCTS } from '../config/products';

const CalendarResultPage = () => {
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
    const a = document.createElement('a'); a.href = url; a.download = '2026_운세달력.ics';
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

  // ── 사주 데이터 헬퍼 (기존 주문: saju_data / 새 주문: 직접 키) ──
  const sd = data?.saju_data || {};
  const sajuPillars = data?.saju_pillars || sd.spilar || null;
  const sajuOhaeng = data?.ohaeng_balance || sd.ohaeng_balance || null;
  const sajuIlgan = data?.ilgan || (sd.ilgan_hanja ? { char: sd.ilgan_hanja, name: (sd.ilgan || '') + (sd.ilgan_element || ''), element: sd.ilgan_element } : null);
  const sajuShipsin = data?.shipsin || null;
  const sajuYongshin = data?.yongshin || (data?.algorithm_meta?.yongshin ? {
    element: data.algorithm_meta.yongshin,
    char: { '목':'木','화':'火','토':'土','금':'金','수':'水' }[data.algorithm_meta.yongshin],
    desc: { '목':'성장과 창의력','화':'열정과 표현력','토':'안정과 신뢰','금':'결단력과 실행력','수':'지혜와 유연성' }[data.algorithm_meta.yongshin] + '의 기운이 당신을 돕습니다',
  } : null);

  // 프리미엄 컬러 (사주 = 앤틱 골드 + 먹색)
  const C = {
    bg: '#F9F7F2',
    card: '#FFFFFF',
    border: '#E8E2D8',
    gold: '#A08030',       // 앤틱 골드 (점성학보다 약간 어둡고 따뜻하게)
    goldLight: '#C4A850',
    goldBg: 'rgba(160, 128, 48, 0.07)',
    ink: '#2A2A28',        // 먹색
    inkLight: '#4A4A46',
    text: '#2C2C2C',
    sub: '#6B6B6B',
    muted: '#9B9B9B',
    lucky: { bg: '#FFF5F0', border: '#E8A090', text: '#C4735E' },
    caution: { bg: '#F0F4F8', border: '#8BA4C0', text: '#5A7A9A' },
    turning: { bg: '#FFF8EC', border: '#D4B96A', text: '#A08030' },
  };
  const typeStyle = {
    lucky: C.lucky, caution: C.caution, turning_point: C.turning, special: C.turning,
  };

  // 오행 컬러맵 (용신 색상 테두리용)
  const ELEMENT_COLORS = {
    '목': '#4A8C5C', '木': '#4A8C5C',
    '화': '#C45C3E', '火': '#C45C3E',
    '토': '#A08030', '土': '#A08030',
    '금': '#8A8A8A', '金': '#8A8A8A',
    '수': '#4A7A9A', '水': '#4A7A9A',
  };

  // 오행별 맞춤 미션 (month_element에서 주요 오행 추출)
  const ELEMENT_MISSIONS = {
    '목': '자연 속에서 30분 산책하기 — 성장의 기운 흡수',
    '木': '자연 속에서 30분 산책하기 — 성장의 기운 흡수',
    '화': '햇볕 쬐며 15분 걷기 — 열정의 에너지 보충',
    '火': '햇볕 쬐며 15분 걷기 — 열정의 에너지 보충',
    '토': '서랍 속 안 쓰는 물건 정리하기 — 안정의 에너지',
    '土': '서랍 속 안 쓰는 물건 정리하기 — 안정의 에너지',
    '금': '오래 미뤄둔 중요한 결단 내리기 — 단호한 에너지',
    '金': '오래 미뤄둔 중요한 결단 내리기 — 단호한 에너지',
    '수': '일기 쓰며 감정 정리하기 — 지혜의 에너지',
    '水': '일기 쓰며 감정 정리하기 — 지혜의 에너지',
  };

  // 주의 날짜 안심 멘트
  const COMFORT_MESSAGES = [
    '이날은 가벼운 명상이나 일찍 잠자리에 드는 것만으로도 충분히 좋은 하루를 만들 수 있어요.',
    '하루를 조용히 보내는 것만으로도 나쁜 기운을 충분히 피할 수 있습니다.',
    '무리하지 않고 쉬어가는 것 자체가 가장 좋은 대처법이에요.',
  ];

  // month_element에서 주요 오행 추출
  const extractElement = (elemStr) => {
    if (!elemStr) return null;
    for (const key of Object.keys(ELEMENT_MISSIONS)) {
      if (elemStr.includes(key)) return key;
    }
    return null;
  };

  // 월별 오행 미션 생성
  const getMonthMission = (md) => {
    const el = extractElement(md?.month_element);
    return el ? ELEMENT_MISSIONS[el] : md?.month_tip || '균형 잡힌 생활로 에너지를 충전하세요';
  };

  // 월 한자 추출 및 분리 (己丑월 → { hanja: '己丑', korean: '기축' })
  const parseMonthElement = (elemStr) => {
    if (!elemStr) return { hanja: '', rest: '' };
    // 한자 패턴: 2~4글자 한자 + '월'
    const hanjaMatch = elemStr.match(/([一-龥]{1,4})월/);
    if (hanjaMatch) {
      return { hanja: hanjaMatch[1] + '월', rest: elemStr.replace(hanjaMatch[0], '').trim() };
    }
    return { hanja: '', rest: elemStr };
  };

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

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: C.bg }}>
      <div className="text-center">
        <div className="text-5xl mb-4 animate-pulse">卦</div>
        <div className="font-serif-kr text-lg" style={{ color: C.ink }}>운세 달력을 불러오는 중...</div>
      </div>
    </div>
  );

  if (!data) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: C.bg }}>
      <div className="text-center" style={{ color: C.ink }}>
        <div className="text-4xl mb-4">☰</div><p>달력 데이터를 찾을 수 없습니다.</p>
      </div>
    </div>
  );

  const months = Object.keys(data.months || {}).sort();
  const currentMonthData = data.months?.[selectedMonth];
  const calendarGrid = getCalendarGrid(selectedMonth);
  const monthNum = parseInt(selectedMonth.split('-')[1]);
  const filteredDates = (currentMonthData?.dates || []).filter(d => filterType === 'all' || d.type === filterType);

  // ========== 전체 보기 모드 (인쇄) ==========
  if (viewMode === 'full') {
    return (
      <div className="min-h-screen font-sans-kr" style={{ background: C.bg, color: C.text }}>
        <style>{globalCSS}</style>

        <div className="no-print sticky top-0 z-50 px-4 py-3 border-b" style={{ background: 'rgba(249,247,242,0.95)', backdropFilter: 'blur(8px)', borderColor: C.border }}>
          <div className="max-w-2xl mx-auto flex items-center justify-between">
            <button onClick={() => setViewMode('monthly')} className="px-4 py-2 rounded-lg border text-sm font-medium" style={{ borderColor: C.border, color: C.ink }}>← 월별 보기</button>
            <span className="font-serif-kr font-bold" style={{ color: C.gold }}>卦 12개월 전체 보기</span>
            <button onClick={() => window.print()} className="px-4 py-2 rounded-lg text-sm font-bold text-white" style={{ background: C.ink }}>🖨️ 인쇄</button>
          </div>
        </div>

        <div className="max-w-2xl mx-auto px-6 py-10">
          {/* 표지 */}
          <div className="text-center mb-12 print-avoid-break">
            <div className="text-3xl mb-3 tracking-widest" style={{ color: C.gold }}>☰ ☷ ☲ ☵</div>
            <h1 className="font-serif-kr text-3xl font-extrabold mb-3" style={{ color: C.ink }}>{data.calendar_title || '2026년 사주 운세 달력'}</h1>
            <div className="w-16 h-px mx-auto mb-4" style={{ background: C.gold }} />
            <p className="text-sm leading-relaxed max-w-md mx-auto" style={{ color: C.sub }}>{data.yearly_summary}</p>
          </div>

          {/* 연간 요약 */}
          <div className="rounded-2xl p-8 mb-10 print-avoid-break" style={{ background: C.card, border: `1px solid ${C.border}` }}>
            <div className="grid grid-cols-4 gap-4 text-center">
              <div>
                <div className="font-serif-kr text-3xl font-extrabold" style={{ color: C.gold }}>{data.yearly_score || 0}</div>
                <div className="text-xs mt-1" style={{ color: C.muted }}>종합 점수</div>
              </div>
              <div>
                <div className="text-sm font-bold" style={{ color: C.ink }}>☆ {data.best_month}</div>
                <div className="text-xs mt-1" style={{ color: C.muted }}>최고의 달</div>
              </div>
              <div>
                <div className="text-sm font-bold" style={{ color: C.caution.text }}>△ {data.worst_month}</div>
                <div className="text-xs mt-1" style={{ color: C.muted }}>주의할 달</div>
              </div>
              <div>
                <div className="text-sm font-bold" style={{ color: C.gold }}>🔑 {data.yearly_keyword}</div>
                <div className="text-xs mt-1" style={{ color: C.muted }}>올해 키워드</div>
              </div>
            </div>
          </div>

          {/* ═══ 나의 사주팔자 원국 ═══ */}
          {sajuPillars && (
            <div className="rounded-2xl p-8 mb-10 print-avoid-break" style={{ background: C.card, border: `1px solid ${C.border}` }}>
              <h2 className="font-serif-kr text-xl font-bold text-center mb-1" style={{ color: C.ink }}>나의 사주팔자</h2>
              <p className="text-xs text-center mb-6" style={{ color: C.muted }}>이 여덟 글자를 기반으로 당신만의 달력이 만들어졌습니다</p>

              {/* 사주 4기둥 테이블 — 한자 대형, 십신 작게 */}
              <div className="grid grid-cols-4 gap-3 mb-6">
                {['hour', 'day', 'month', 'year'].map((pillar) => {
                  const p = sajuPillars[pillar];
                  const pillarLabel = pillar === 'year' ? '년주' : pillar === 'month' ? '월주' : pillar === 'day' ? '일주' : '시주';
                  const isDayMaster = pillar === 'day';

                  if (!p) return (
                    <div key={pillar} className="text-center opacity-30">
                      <div className="text-[10px]" style={{ color: C.muted }}>{pillarLabel}</div>
                      <div className="font-serif-kr text-3xl my-3" style={{ color: C.muted }}>?</div>
                      <div className="font-serif-kr text-3xl mb-2" style={{ color: C.muted }}>?</div>
                    </div>
                  );

                  const stemColor = ELEMENT_COLORS[p.cheongan_element] || C.ink;
                  const branchColor = ELEMENT_COLORS[p.jiji_element] || C.ink;
                  const stemShipsin = pillar === 'day' ? '' : sajuShipsin?.[`${pillar}_cheongan`] || '';
                  const branchShipsin = sajuShipsin?.[`${pillar}_jiji`] || '';

                  return (
                    <div key={pillar} className="text-center rounded-xl p-2.5 relative" style={{ background: isDayMaster ? C.goldBg : C.bg, border: isDayMaster ? `2px solid ${C.gold}` : `1px solid ${C.border}` }}>
                      {isDayMaster && <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 text-[9px] px-2 py-0.5 rounded-full font-bold" style={{ background: C.gold, color: '#fff' }}>나</div>}
                      <div className="text-[9px] mb-1" style={{ color: C.muted }}>{pillarLabel}</div>

                      {/* 천간: 한자 크게 + 십신 작게 */}
                      <div className="rounded-lg p-1.5 mb-1" style={{ background: `${stemColor}10` }}>
                        <div className="font-serif-kr text-3xl font-extrabold leading-none" style={{ color: stemColor }}>{p.cheongan_hanja}</div>
                        {stemShipsin && <div className="text-[9px] mt-1" style={{ color: stemColor, opacity: 0.7 }}>{stemShipsin}</div>}
                      </div>

                      {/* 지지: 한자 크게 + 십신 작게 */}
                      <div className="rounded-lg p-1.5" style={{ background: `${branchColor}10` }}>
                        <div className="font-serif-kr text-3xl font-extrabold leading-none" style={{ color: branchColor }}>{p.jiji_hanja}</div>
                        {branchShipsin && <div className="text-[9px] mt-1" style={{ color: branchColor, opacity: 0.7 }}>{branchShipsin}</div>}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* 오행 밸런스 바 */}
              {sajuOhaeng && (
                <div className="mb-5">
                  <div className="flex gap-2 items-end justify-center h-14">
                    {[
                      { key: 'wood', label: '木', color: '#4A8C5C' },
                      { key: 'fire', label: '火', color: '#C45C3E' },
                      { key: 'earth', label: '土', color: '#A08030' },
                      { key: 'metal', label: '金', color: '#8A8A8A' },
                      { key: 'water', label: '水', color: '#4A7A9A' },
                    ].map(({ key, label, color }) => {
                      const pct = sajuOhaeng[key]?.percent || 0;
                      return (
                        <div key={key} className="flex flex-col items-center gap-0.5 flex-1">
                          <div className="text-[10px] font-bold" style={{ color }}>{pct}%</div>
                          <div className="w-full rounded-t-md" style={{ height: `${Math.max(pct * 0.5, 4)}px`, background: color, opacity: 0.7 }} />
                          <div className="font-serif-kr text-xs font-bold" style={{ color }}>{label}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 나의 기운 해석 */}
              <div className="rounded-xl p-4" style={{ background: C.bg, border: `1px solid ${C.border}` }}>
                <div className="flex items-center justify-center gap-6 mb-3">
                  {sajuIlgan && (
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center font-serif-kr text-lg font-extrabold" style={{ background: `${ELEMENT_COLORS[sajuIlgan.element] || C.gold}15`, color: ELEMENT_COLORS[sajuIlgan.element] || C.gold }}>{sajuIlgan.char}</div>
                      <div>
                        <div className="text-xs font-bold" style={{ color: C.ink }}>일간 {sajuIlgan.name}</div>
                      </div>
                    </div>
                  )}
                  {sajuYongshin && (
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg" style={{ background: `${ELEMENT_COLORS[sajuYongshin.element] || C.gold}15`, color: ELEMENT_COLORS[sajuYongshin.element] || C.gold }}>🛡️</div>
                      <div>
                        <div className="text-xs font-bold" style={{ color: C.ink }}>{sajuYongshin.char} <span style={{ color: C.sub, fontWeight: 'normal' }}>가 나를 도와요</span></div>
                      </div>
                    </div>
                  )}
                </div>
                <div className="text-xs text-center leading-relaxed" style={{ color: C.sub }}>
                  위 여덟 글자의 기운을 분석하여 <strong style={{ color: C.ink }}>당신만을 위한 맞춤 달력</strong>을 만들었습니다
                </div>
              </div>
            </div>
          )}

          {/* 달력 활용 가이드 */}
          <div className="rounded-2xl p-8 mb-10 print-avoid-break" style={{ background: C.card, border: `1px solid ${C.border}` }}>
            <h2 className="font-serif-kr text-xl font-bold text-center mb-5" style={{ color: C.ink }}>달력 200% 활용법</h2>
            <p className="text-sm text-center leading-relaxed mb-6" style={{ color: C.sub }}>
              이 달력은 복잡한 사주 이론을 <strong>'오늘의 날씨'</strong>처럼 쉽게 풀이했습니다.
            </p>
            <div className="grid grid-cols-2 gap-4 mb-5">
              <div className="rounded-xl p-4" style={{ background: C.lucky.bg }}>
                <div className="text-lg mb-1">★</div>
                <div className="text-sm font-bold mb-1" style={{ color: C.ink }}>행운의 날</div>
                <div className="text-xs" style={{ color: C.sub }}>나를 돕는 기운이 강해지는 날. 자신감 있게 행동하세요!</div>
              </div>
              <div className="rounded-xl p-4" style={{ background: C.caution.bg }}>
                <div className="text-lg mb-1">△</div>
                <div className="text-sm font-bold mb-1" style={{ color: C.ink }}>주의할 날</div>
                <div className="text-xs" style={{ color: C.sub }}>부딪힘과 마찰이 있을 수 있어요. 한 번 더 확인하세요.</div>
              </div>
              <div className="rounded-xl p-4" style={{ background: C.turning.bg }}>
                <div className="text-lg mb-1">◇</div>
                <div className="text-sm font-bold mb-1" style={{ color: C.ink }}>전환점</div>
                <div className="text-xs" style={{ color: C.sub }}>기운의 흐름이 바뀌는 날. 유연하게 대처하면 기회가 됩니다.</div>
              </div>
              <div className="rounded-xl p-4" style={{ background: C.goldBg }}>
                <div className="text-lg mb-1">✦</div>
                <div className="text-sm font-bold mb-1" style={{ color: C.ink }}>나를 돕는 기운</div>
                <div className="text-xs" style={{ color: C.sub }}>용신이 작용하는 날. 좋은 에너지를 활용해 중요한 일을 추진하세요.</div>
              </div>
            </div>
            <div className="rounded-xl p-4" style={{ background: C.goldBg, borderLeft: `3px solid ${C.gold}` }}>
              <div className="text-sm" style={{ color: C.ink }}>
                <strong>Tip:</strong> 오행(목·화·토·금·수)은 계절의 에너지와 같습니다. '이 달의 온도'로 이해하면 쉬워요 — 흙(土) 기운이 강한 달은 안정과 저축에, 불(火) 기운이 강한 달은 도전과 열정에 좋습니다.
              </div>
            </div>
          </div>

          {/* TOP 3 */}
          {data.top_dates?.length > 0 && (
            <div className="rounded-2xl p-8 mb-10 print-avoid-break" style={{ background: C.card, border: `1px solid ${C.border}` }}>
              <h2 className="font-serif-kr text-xl font-bold text-center mb-5" style={{ color: C.ink }}>올해 꼭 기억할 날짜</h2>
              <div className="space-y-3">
                {data.top_dates.map((item, i) => (
                  <div key={i} className="flex items-center gap-4 p-3 rounded-xl" style={{ background: i === 0 ? C.goldBg : C.bg }}>
                    <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm" style={{ background: i === 0 ? C.gold : i === 1 ? '#AAA' : C.goldLight, color: '#fff' }}>{i + 1}</div>
                    <div className="flex-1">
                      <span className="font-bold text-sm" style={{ color: C.ink }}>{item.title}</span>
                      <span className="text-xs ml-2" style={{ color: C.muted }}>{item.reason}</span>
                    </div>
                    <span className="font-mono text-sm font-bold" style={{ color: C.gold }}>{item.date?.split('-').slice(1).join('/')}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 카테고리별 추천일 */}
          {data.category_dates && Object.keys(data.category_dates).length > 0 && (
            <div className="rounded-2xl p-8 mb-10 print-avoid-break" style={{ background: C.card, border: `1px solid ${C.border}` }}>
              <h2 className="font-serif-kr text-xl font-bold text-center mb-6" style={{ color: C.ink }}>이런 일엔 이 날</h2>
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(data.category_dates).map(([key, cat]) => (
                  <div key={key} className="rounded-xl p-4" style={{ background: C.goldBg }}>
                    <div className="font-bold text-sm mb-2" style={{ color: C.ink }}>{cat.emoji} {cat.label}</div>
                    <div className="flex flex-wrap gap-2">
                      {(cat.dates || []).map((d, i) => (
                        <span key={i} className="text-xs font-mono font-bold px-2 py-1 rounded" style={{ background: C.card, color: C.gold, border: `1px solid ${C.border}` }}>{d.date?.split('-').slice(1).join('/')}</span>
                      ))}
                    </div>
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
            const gradeColor = md?.month_score >= 70 ? C.gold : md?.month_score < 40 ? C.caution.text : C.sub;

            return (
              <div key={m} className={`mb-10 ${monthIdx > 0 ? 'print-break' : ''} print-avoid-break`}>
                {/* 월 헤더 — 한자 최소화 */}
                <div className="flex items-end justify-between mb-3 pb-3" style={{ borderBottom: `2px solid ${C.ink}` }}>
                  <div>
                    <h2 className="font-serif-kr text-2xl font-extrabold" style={{ color: C.ink }}>{mNum}월</h2>
                    {md?.month_element && (() => {
                      const { hanja, rest } = parseMonthElement(md.month_element);
                      return (
                        <div className="flex items-center gap-2 mt-0.5">
                          {rest && <span className="text-xs" style={{ color: C.sub }}>{rest}</span>}
                          {hanja && <span className="text-[10px]" style={{ color: C.muted }}>({hanja})</span>}
                        </div>
                      );
                    })()}
                  </div>
                  <div className="text-right">
                    <div className="font-serif-kr text-2xl font-extrabold" style={{ color: gradeColor }}>{md?.month_score || 0}<span className="text-sm font-normal">점</span></div>
                  </div>
                </div>

                <p className="text-sm leading-relaxed mb-2" style={{ color: C.sub }}>{md?.month_summary}</p>
                {md?.month_tip && (
                  <div className="rounded-lg px-4 py-2 mb-4" style={{ background: C.goldBg, borderLeft: `3px solid ${C.gold}` }}>
                    <span className="text-sm font-bold" style={{ color: C.gold }}>✦</span>
                    <span className="text-sm ml-1.5" style={{ color: C.ink }}>{md.month_tip}</span>
                  </div>
                )}

                {/* 미니 달력 */}
                <div className="rounded-xl p-4 mb-4" style={{ background: C.card, border: `1px solid ${C.border}` }}>
                  <div className="grid grid-cols-7 gap-1 mb-2">
                    {['일','월','화','수','목','금','토'].map((d, i) => (
                      <div key={d} className="text-center text-xs font-bold py-1" style={{ color: i === 0 ? '#C4735E' : i === 6 ? '#5A7A9A' : C.muted }}>{d}</div>
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
                          <div className="font-bold" style={{ color: dayOfWeek === 0 ? '#C4735E' : dayOfWeek === 6 ? '#5A7A9A' : C.text }}>{day}</div>
                          {hasEvents && evType === 'lucky' && <span className="text-[8px] absolute -top-0.5 -right-0.5" style={{ color: C.gold }}>★</span>}
                          {hasEvents && evType === 'caution' && <span className="text-[8px] absolute -top-0.5 -right-0.5 font-bold" style={{ color: C.caution.text }}>!</span>}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 날짜 리스트 */}
                <div className="space-y-2 mb-4">
                  {mDates.map((item, i) => {
                    const sty = typeStyle[item.type] || typeStyle.lucky;
                    const isYongshin = item.title?.includes('용신') || item.description?.includes('용신') || item.title?.includes('나를 돕는');
                    return (
                      <div key={i} className="rounded-xl p-3 flex items-start gap-3" style={{ background: sty.bg, borderLeft: `3px solid ${sty.border}` }}>
                        <div className="text-center min-w-[36px]">
                          <div className="text-lg font-bold" style={{ color: sty.text }}>{item.date?.split('-')[2]}</div>
                          <div className="text-[10px]" style={{ color: C.muted }}>{new Date(item.date).toLocaleDateString('ko-KR', { weekday: 'short' })}</div>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-1.5 mb-0.5">
                            {item.type === 'lucky' && <span style={{ color: C.gold }}>★</span>}
                            {item.type === 'caution' && <span style={{ color: C.caution.text }}>△</span>}
                            {isYongshin && <span title="나를 돕는 기운">🛡️</span>}
                            <span className="font-bold text-sm" style={{ color: C.ink }}>{item.title}</span>
                          </div>
                          <p className="text-xs leading-relaxed" style={{ color: C.sub }}>{item.description}</p>
                          <div className="text-xs mt-1" style={{ color: sty.text }}>→ {item.action_tip}</div>
                          {item.type === 'caution' && (
                            <div className="text-[11px] mt-1.5 italic" style={{ color: C.muted }}>
                              ☽ {COMFORT_MESSAGES[i % COMFORT_MESSAGES.length]}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Tip + 메모 */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl p-3" style={{ background: C.goldBg, border: `1px solid ${C.border}` }}>
                    <div className="font-serif-kr text-xs font-bold mb-1" style={{ color: C.gold }}>✦ 이 달의 미션</div>
                    <div className="text-xs leading-relaxed" style={{ color: C.sub }}>
                      {getMonthMission(md)}
                    </div>
                  </div>
                  <div className="rounded-xl p-3" style={{ background: '#FAFAFA', border: `1px dashed ${C.border}` }}>
                    <div className="font-serif-kr text-xs font-bold mb-1" style={{ color: C.muted }}>✎ 나의 운세 기록장</div>
                    <div className="text-[10px] leading-5" style={{ color: '#D0D0D0' }}>
                      ___________________________<br/>___________________________<br/>___________________________
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {/* 개운 처방전 (체크리스트형) */}
          {data.lucky_prescription && (
            <div className="rounded-2xl p-8 mb-10 print-break print-avoid-break" style={{ background: C.card, border: `1px solid ${C.border}` }}>
              <h2 className="font-serif-kr text-xl font-bold text-center mb-6" style={{ color: C.ink }}>2026년 개운 처방전</h2>
              <div className="grid grid-cols-3 gap-6">
                {Object.entries(data.lucky_prescription).map(([key, value]) => {
                  const labels = { color: { l: '행운 색상', s: '🎨' }, number: { l: '행운 숫자', s: '✦' }, direction: { l: '좋은 방위', s: '◇' }, item: { l: '행운 아이템', s: '◆' }, action: { l: '운 높이는 행동', s: '☰' }, avoid: { l: '피할 것', s: '△' } };
                  const info = labels[key] || { l: key, s: '·' };
                  return (
                    <div key={key} className="text-center">
                      <div className="font-serif-kr text-lg mb-1" style={{ color: C.gold }}>{info.s}</div>
                      <div className="text-[10px] mb-1" style={{ color: C.muted }}>{info.l}</div>
                      <div className="text-sm font-bold" style={{ color: C.ink }}>{typeof value === 'object' ? JSON.stringify(value) : value}</div>
                    </div>
                  );
                })}
              </div>
              {/* 럭키 아이템 체크리스트 */}
              <div className="mt-6 pt-5" style={{ borderTop: `1px solid ${C.border}` }}>
                <div className="font-serif-kr text-sm font-bold mb-3" style={{ color: C.ink }}>✓ 럭키 아이템 실천 체크리스트</div>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    data.lucky_prescription.color ? `${data.lucky_prescription.color} 계열 소품 활용하기` : null,
                    data.lucky_prescription.item ? `${data.lucky_prescription.item} 지니고 다니기` : null,
                    data.lucky_prescription.direction ? `${data.lucky_prescription.direction} 방향으로 산책하기` : null,
                    data.lucky_prescription.action || null,
                    data.lucky_prescription.number ? `숫자 ${data.lucky_prescription.number} 활용하기` : null,
                    data.lucky_prescription.avoid ? `${data.lucky_prescription.avoid} 피하기` : null,
                  ].filter(Boolean).map((txt, i) => (
                    <div key={i} className="flex items-center gap-2 p-2 rounded-lg" style={{ background: C.bg }}>
                      <div className="w-4 h-4 rounded border flex-shrink-0" style={{ borderColor: C.gold }} />
                      <span className="text-xs" style={{ color: C.ink }}>{txt}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="no-print space-y-3 mt-10">
            <button onClick={downloadICS} className="w-full py-4 rounded-xl text-white font-bold text-lg transition-all hover:opacity-90" style={{ background: C.ink }}>☰ 캘린더에 자동 등록하기</button>
            <button onClick={() => window.print()} className="w-full py-3 rounded-xl border font-bold" style={{ borderColor: C.border, color: C.ink }}>🖨️ PDF로 저장하기</button>
            <button onClick={() => setViewMode('monthly')} className="w-full py-3 rounded-xl font-medium" style={{ color: C.muted }}>← 월별 보기로 돌아가기</button>
          </div>
          <p className="text-center text-xs mt-10 pb-6" style={{ color: C.muted }}>© 2025 OZ Fortune. All rights reserved.</p>
        </div>
      </div>
    );
  }

  // ========== 월별 보기 모드 (웹) ==========
  return (
    <div className="min-h-screen font-sans-kr" style={{ background: C.bg, color: C.text }}>
      <style>{globalCSS}</style>

      {/* 헤더 */}
      <div className="px-4 pt-10 pb-6">
        <div className="max-w-lg mx-auto text-center">
          <div className="text-3xl mb-3 tracking-widest" style={{ color: C.gold }}>☰ ☷ ☲</div>
          <h1 className="font-serif-kr text-2xl font-extrabold mb-2" style={{ color: C.ink }}>{data.calendar_title || '2026년 사주 운세 달력'}</h1>
          <div className="w-12 h-px mx-auto mb-3" style={{ background: C.gold }} />
          <p className="text-sm leading-relaxed" style={{ color: C.sub }}>{data.yearly_summary}</p>
        </div>
      </div>

      {/* 연간 요약 */}
      <div className="px-4 mb-6">
        <div className="max-w-lg mx-auto">
          <div className="rounded-2xl p-6" style={{ background: C.card, border: `1px solid ${C.border}` }}>
            <div className="grid grid-cols-3 gap-4 text-center mb-4">
              <div>
                <div className="font-serif-kr text-3xl font-extrabold" style={{ color: C.gold }}>{data.yearly_score || 0}</div>
                <div className="text-xs mt-1" style={{ color: C.muted }}>종합 점수</div>
              </div>
              <div>
                <div className="text-sm font-bold" style={{ color: C.ink }}>☆ {data.best_month}</div>
                <div className="text-xs mt-1" style={{ color: C.muted }}>최고의 달</div>
              </div>
              <div>
                <div className="text-sm font-bold" style={{ color: C.caution.text }}>△ {data.worst_month}</div>
                <div className="text-xs mt-1" style={{ color: C.muted }}>주의할 달</div>
              </div>
            </div>
            <div className="text-center">
              <span className="px-4 py-1.5 rounded-full text-xs font-bold border" style={{ borderColor: C.gold, color: C.gold }}>🔑 올해의 키워드: {data.yearly_keyword}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ═══ 나의 사주팔자 (간략) ═══ */}
      {sajuPillars && (
        <div className="px-4 mb-6">
          <div className="max-w-lg mx-auto">
            <div className="rounded-2xl p-5" style={{ background: C.card, border: `1px solid ${C.border}` }}>
              <h2 className="font-serif-kr text-sm font-bold text-center mb-3" style={{ color: C.ink }}>나의 사주팔자</h2>
              <div className="grid grid-cols-4 gap-2 mb-3">
                {['hour', 'day', 'month', 'year'].map((pillar) => {
                  const p = sajuPillars[pillar];
                  if (!p) return <div key={pillar} className="text-center opacity-30"><div className="font-serif-kr text-2xl" style={{ color: C.muted }}>?</div><div className="font-serif-kr text-2xl" style={{ color: C.muted }}>?</div></div>;
                  const stemColor = ELEMENT_COLORS[p.cheongan_element] || C.ink;
                  const branchColor = ELEMENT_COLORS[p.jiji_element] || C.ink;
                  const isDayMaster = pillar === 'day';
                  const label = pillar === 'year' ? '년' : pillar === 'month' ? '월' : pillar === 'day' ? '일' : '시';
                  const stemShipsin = pillar === 'day' ? '' : sajuShipsin?.[`${pillar}_cheongan`] || '';
                  const branchShipsin = sajuShipsin?.[`${pillar}_jiji`] || '';

                  return (
                    <div key={pillar} className="text-center rounded-lg p-2 relative" style={{ background: isDayMaster ? C.goldBg : 'transparent', border: isDayMaster ? `1.5px solid ${C.gold}` : `1px solid ${C.border}` }}>
                      {isDayMaster && <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 text-[8px] px-1.5 rounded-full font-bold" style={{ background: C.gold, color: '#fff' }}>나</div>}
                      <div className="text-[9px] mb-1" style={{ color: C.muted }}>{label}주</div>
                      <div className="rounded px-1 py-0.5 mb-0.5" style={{ background: `${stemColor}10` }}>
                        <div className="font-serif-kr text-xl font-extrabold" style={{ color: stemColor }}>{p.cheongan_hanja}</div>
                        {stemShipsin && <div className="text-[8px]" style={{ color: stemColor, opacity: 0.6 }}>{stemShipsin}</div>}
                      </div>
                      <div className="rounded px-1 py-0.5" style={{ background: `${branchColor}10` }}>
                        <div className="font-serif-kr text-xl font-extrabold" style={{ color: branchColor }}>{p.jiji_hanja}</div>
                        {branchShipsin && <div className="text-[8px]" style={{ color: branchColor, opacity: 0.6 }}>{branchShipsin}</div>}
                      </div>
                    </div>
                  );
                })}
              </div>
              {/* 일간 + 용신 한 줄 */}
              <div className="flex items-center justify-center gap-4 text-xs">
                {sajuIlgan && (
                  <span style={{ color: C.sub }}>
                    <span className="font-serif-kr font-bold" style={{ color: ELEMENT_COLORS[sajuIlgan.element] || C.gold }}>{sajuIlgan.char}</span>
                    <span className="ml-1">{sajuIlgan.name}</span>
                  </span>
                )}
                {sajuYongshin && (
                  <span style={{ color: C.sub }}>
                    🛡️ <span className="font-bold" style={{ color: ELEMENT_COLORS[sajuYongshin.element] || C.gold }}>{sajuYongshin.char}</span>
                    <span className="ml-0.5">가 나를 도와요</span>
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TOP 3 */}
      {data.top_dates?.length > 0 && (
        <div className="px-4 mb-6">
          <div className="max-w-lg mx-auto">
            <h2 className="font-serif-kr text-base font-bold text-center mb-3" style={{ color: C.ink }}>올해 꼭 기억할 날짜</h2>
            <div className="rounded-2xl p-4" style={{ background: C.card, border: `1px solid ${C.border}` }}>
              {data.top_dates.map((item, i) => (
                <div key={i} className="flex items-center gap-3 p-2.5 rounded-lg mb-1.5" style={{ background: i === 0 ? C.goldBg : 'transparent' }}>
                  <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs text-white" style={{ background: i === 0 ? C.gold : i === 1 ? '#AAA' : C.goldLight }}>{i + 1}</div>
                  <div className="flex-1">
                    <span className="font-bold text-sm" style={{ color: C.ink }}>{item.title}</span>
                    <span className="text-xs ml-1.5" style={{ color: C.muted }}>{item.reason}</span>
                  </div>
                  <span className="font-mono text-xs font-bold" style={{ color: C.gold }}>{item.date?.split('-').slice(1).join('/')}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 카테고리별 추천일 */}
      {data.category_dates && Object.keys(data.category_dates).length > 0 && (
        <div className="px-4 mb-6">
          <div className="max-w-lg mx-auto">
            <h2 className="font-serif-kr text-base font-bold text-center mb-3" style={{ color: C.ink }}>이런 일엔 이 날</h2>
            <div className="rounded-2xl p-4" style={{ background: C.card, border: `1px solid ${C.border}` }}>
              <div className="space-y-3">
                {Object.entries(data.category_dates).map(([key, cat]) => (
                  <div key={key} className="flex items-center gap-3">
                    <div className="text-sm font-bold min-w-[90px]" style={{ color: C.ink }}>{cat.emoji} {cat.label}</div>
                    <div className="flex flex-wrap gap-1.5 flex-1">
                      {(cat.dates || []).map((d, i) => (
                        <span key={i} className="text-xs font-mono font-bold px-2.5 py-1 rounded-md" style={{ background: C.goldBg, color: C.gold, border: `1px solid ${C.border}` }}>{d.date?.split('-').slice(1).join('/')}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 월별 점수 바 */}
      <div className="px-4 mb-6">
        <div className="max-w-lg mx-auto">
          <h2 className="font-serif-kr text-base font-bold text-center mb-3" style={{ color: C.ink }}>월별 운세 흐름</h2>
          <div className="rounded-2xl p-5" style={{ background: C.card, border: `1px solid ${C.border}` }}>
            <div className="flex items-end gap-1.5 h-32">
              {months.map((m) => {
                const md = data.months[m];
                const score = md?.month_score || 0;
                const isSelected = m === selectedMonth;
                const barColor = isSelected ? C.gold : score >= 70 ? C.goldLight : score >= 50 ? '#D4CCB0' : C.caution.border;
                return (
                  <button key={m} onClick={() => setSelectedMonth(m)}
                    className={`flex-1 flex flex-col items-center justify-end gap-1 transition-all ${isSelected ? 'scale-105' : 'opacity-50 hover:opacity-75'}`}>
                    <div className="text-[10px] font-bold" style={{ color: isSelected ? C.gold : C.muted }}>{score}</div>
                    <div className="w-full rounded-t-md transition-all" style={{ height: `${Math.max(score * 0.8, 8)}%`, background: barColor }} />
                    <div className="text-[10px] font-medium" style={{ color: isSelected ? C.gold : C.muted }}>{parseInt(m.split('-')[1])}</div>
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
              className="w-8 h-8 rounded-full border flex items-center justify-center" style={{ borderColor: C.border, color: C.ink }}>◀</button>
            <span className="font-serif-kr font-bold text-xl" style={{ color: C.ink }}>{monthNum}월</span>
            <button onClick={() => { const idx = months.indexOf(selectedMonth); if (idx < months.length - 1) setSelectedMonth(months[idx + 1]); }}
              className="w-8 h-8 rounded-full border flex items-center justify-center" style={{ borderColor: C.border, color: C.ink }}>▶</button>
          </div>
          <div className="flex gap-1.5">
            {[{ key: 'all', label: '전체' }, { key: 'lucky', label: '★' }, { key: 'caution', label: '△' }].map(f => (
              <button key={f.key} onClick={() => setFilterType(f.key)}
                className="px-3 py-1.5 rounded-full text-xs font-medium transition-all"
                style={filterType === f.key ? { background: C.ink, color: '#fff' } : { border: `1px solid ${C.border}`, color: C.muted }}>{f.label}</button>
            ))}
          </div>
        </div>
      </div>

      {/* 월 요약 */}
      {currentMonthData && (
        <div className="px-4 mb-4">
          <div className="max-w-lg mx-auto">
            <div className="rounded-xl p-5" style={{ background: C.card, border: `1px solid ${C.border}` }}>
              <div className="flex items-center justify-between mb-2">
                <div>
                  <span className="font-serif-kr font-bold" style={{ color: C.ink }}>{monthNum}월 운세</span>
                  {currentMonthData.month_element && (() => {
                    const { hanja, rest } = parseMonthElement(currentMonthData.month_element);
                    return (
                      <>
                        {rest && <span className="text-xs ml-2" style={{ color: C.sub }}>{rest}</span>}
                        {hanja && <span className="text-[10px] ml-1" style={{ color: C.muted }}>({hanja})</span>}
                      </>
                    );
                  })()}
                </div>
                <div className="font-serif-kr text-xl font-extrabold" style={{ color: currentMonthData.month_score >= 65 ? C.gold : currentMonthData.month_score < 35 ? C.caution.text : C.sub }}>{currentMonthData.month_score}<span className="text-sm font-normal">점</span></div>
              </div>
              <p className="text-sm leading-relaxed mb-2" style={{ color: C.sub }}>{currentMonthData.month_summary}</p>
              {currentMonthData.month_tip && (
                <div className="rounded-lg px-4 py-2" style={{ background: C.goldBg, borderLeft: `3px solid ${C.gold}` }}>
                  <span className="text-sm font-bold" style={{ color: C.gold }}>✦</span>
                  <span className="text-sm ml-1.5" style={{ color: C.ink }}>{currentMonthData.month_tip}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 달력 그리드 */}
      <div className="px-4 mb-4">
        <div className="max-w-lg mx-auto">
          <div className="rounded-2xl p-4" style={{ background: C.card, border: `1px solid ${C.border}` }}>
            <div className="grid grid-cols-7 gap-1 mb-2">
              {['일','월','화','수','목','금','토'].map((d, i) => (
                <div key={d} className="text-center text-xs font-bold py-1" style={{ color: i === 0 ? '#C4735E' : i === 6 ? '#5A7A9A' : C.muted }}>{d}</div>
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
                    <div className="text-sm font-bold" style={{ color: dayOfWeek === 0 ? '#C4735E' : dayOfWeek === 6 ? '#5A7A9A' : C.text }}>{day}</div>
                    {hasEvents && evType === 'lucky' && <span className="text-[9px] absolute -top-0.5 -right-0.5" style={{ color: C.gold }}>{events[0]?.title?.includes('용신') || events[0]?.description?.includes('용신') ? '🛡️' : '★'}</span>}
                    {hasEvents && evType === 'caution' && <span className="text-[8px] absolute -top-0.5 -right-0.5 font-bold" style={{ color: C.caution.text }}>!</span>}
                    {hasEvents && evType === 'turning_point' && <span className="text-[8px] absolute -top-0.5 -right-0.5" style={{ color: C.turning.text }}>◇</span>}
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
          <h3 className="font-serif-kr font-bold mb-3" style={{ color: C.ink }}>{monthNum}월 중요 날짜 <span className="text-xs font-normal" style={{ color: C.muted }}>({filteredDates.length})</span></h3>
          <div className="space-y-2.5">
            {filteredDates.length === 0 ? (
              <div className="rounded-xl p-5 text-center text-sm" style={{ background: C.card, border: `1px solid ${C.border}`, color: C.muted }}>이번 달 해당하는 날짜가 없습니다.</div>
            ) : filteredDates.map((item, i) => {
              const sty = typeStyle[item.type] || typeStyle.lucky;
              return (
                <div key={i} className="rounded-xl p-4 transition-all" style={{ background: C.card, border: `1px solid ${C.border}`, borderLeft: `3px solid ${sty.border}` }}>
                  <div className="flex items-start gap-3">
                    <div className="text-center min-w-[44px]">
                      <div className="text-xl font-bold" style={{ color: sty.text }}>{item.date?.split('-')[2]}</div>
                      <div className="text-[10px]" style={{ color: C.muted }}>{new Date(item.date).toLocaleDateString('ko-KR', { weekday: 'short' })}</div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-1.5 mb-1">
                        {item.type === 'lucky' && <span style={{ color: C.gold }}>★</span>}
                        {item.type === 'caution' && <span className="font-bold" style={{ color: C.caution.text }}>!</span>}
                        {item.type === 'turning_point' && <span style={{ color: C.turning.text }}>◇</span>}
                        {(item.title?.includes('용신') || item.description?.includes('용신') || item.title?.includes('나를 돕는')) && <span title="나를 돕는 기운">🛡️</span>}
                        <span className="font-bold" style={{ color: C.ink }}>{item.title}</span>
                        {item.importance === 'high' && <span className="text-[10px] px-1.5 py-0.5 rounded-full font-bold" style={{ background: C.lucky.bg, color: C.lucky.text }}>중요</span>}
                      </div>
                      <p className="text-sm leading-relaxed mb-1.5" style={{ color: C.sub }}>{item.description}</p>
                      <div className="text-xs" style={{ color: sty.text }}>→ {item.action_tip}</div>
                      {item.type === 'caution' && (
                        <div className="text-[11px] mt-2 italic" style={{ color: C.muted }}>
                          ☽ {COMFORT_MESSAGES[i % COMFORT_MESSAGES.length]}
                        </div>
                      )}
                      <a href={getGoogleCalendarUrl(item)} target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 mt-2 text-[10px] px-2.5 py-1 rounded-full border transition-colors hover:opacity-70"
                        style={{ borderColor: C.border, color: C.muted }}>
                        ☰ Google Calendar에 추가
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
            <div className="rounded-2xl p-6" style={{ background: C.card, border: `1px solid ${C.border}` }}>
              <h3 className="font-serif-kr font-bold text-center mb-5" style={{ color: C.ink }}>2026년 개운 처방전</h3>
              <div className="grid grid-cols-3 gap-4">
                {Object.entries(data.lucky_prescription).map(([key, value]) => {
                  const labels = { color: { l: '행운 색상', s: '🎨' }, number: { l: '행운 숫자', s: '✦' }, direction: { l: '좋은 방위', s: '◇' }, item: { l: '행운 아이템', s: '◆' }, action: { l: '운 높이는 행동', s: '☰' }, avoid: { l: '피할 것', s: '△' } };
                  const info = labels[key] || { l: key, s: '·' };
                  return (
                    <div key={key} className="text-center">
                      <div className="font-serif-kr text-lg mb-1" style={{ color: C.gold }}>{info.s}</div>
                      <div className="text-[10px]" style={{ color: C.muted }}>{info.l}</div>
                      <div className="text-sm font-bold mt-1" style={{ color: C.ink }}>{typeof value === 'object' ? JSON.stringify(value) : value}</div>
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
          <button onClick={() => setViewMode('full')} className="w-full py-4 rounded-xl font-bold text-lg text-white transition-all hover:opacity-90 active:scale-[0.98]" style={{ background: C.ink }}>
            ☰ 12개월 전체 보기 & 인쇄
          </button>
          <button onClick={downloadICS} className="w-full py-4 rounded-xl font-bold text-lg transition-all hover:opacity-90 active:scale-[0.98]" style={{ background: C.gold, color: '#fff' }}>
            ☷ 캘린더에 자동 등록하기
          </button>
          <p className="text-center text-xs" style={{ color: C.muted }}>.ics 파일 다운로드 → Google Calendar / Apple Calendar 자동 등록</p>
          <button onClick={() => window.print()} className="w-full py-3 rounded-xl border font-medium transition-all hover:opacity-70" style={{ borderColor: C.border, color: C.muted }}>
            🖨️ 현재 화면 PDF로 저장하기
          </button>
        </div>
      </div>

      <p className="text-center text-xs pb-6" style={{ color: C.muted }}>© 2025 OZ Fortune. All rights reserved.</p>
    </div>
  );
};

export default CalendarResultPage;