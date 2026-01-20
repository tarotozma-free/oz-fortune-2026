import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// ========================================
// 한글 도시명 → 영어 도시명 변환
// ========================================
const CITY_NAME_MAP: Record<string, string> = {
  '서울': 'Seoul',
  '부산': 'Busan',
  '인천': 'Incheon',
  '대구': 'Daegu',
  '대전': 'Daejeon',
  '광주': 'Gwangju',
  '울산': 'Ulsan',
  '수원': 'Suwon',
  '제주': 'Jeju',
  '창원': 'Changwon',
  '성남': 'Seongnam',
  '고양': 'Goyang',
  '용인': 'Yongin',
  '청주': 'Cheongju',
  '전주': 'Jeonju',
  '천안': 'Cheonan',
  '도쿄': 'Tokyo',
  '오사카': 'Osaka',
  '뉴욕': 'New York',
  '로스앤젤레스': 'Los Angeles',
  '런던': 'London',
  '파리': 'Paris',
};

function convertCityName(city: string): string {
  if (!city) return 'Seoul';
  if (CITY_NAME_MAP[city]) return CITY_NAME_MAP[city];
  return city;
}

// ========================================
// 음력 → 양력 변환 (API 사용)
// ========================================
async function convertLunarToSolar(year: number, month: number, day: number): Promise<{year: number, month: number, day: number}> {
  try {
    const response = await fetch(
      `https://astro.kasi.re.kr:444/life/lun2sol?lun_y=${year}&lun_m=${month}&lun_d=${day}&lun_type=1`,
      { headers: { 'Accept': 'application/json' } }
    );
    
    if (response.ok) {
      const data = await response.json();
      if (data.sol_y && data.sol_m && data.sol_d) {
        console.log(`✅ 음력 변환 성공: ${year}-${month}-${day} → ${data.sol_y}-${data.sol_m}-${data.sol_d}`);
        return {
          year: parseInt(data.sol_y),
          month: parseInt(data.sol_m),
          day: parseInt(data.sol_d)
        };
      }
    }
  } catch (e) {
    console.log('⚠️ KASI API 실패, 폴백 사용');
  }
  
  // 폴백: 간단한 근사 변환
  console.log(`⚠️ 음력 변환 폴백 사용: ${year}-${month}-${day}`);
  let solarDay = day + 30;
  let solarMonth = month;
  let solarYear = year;
  
  if (solarDay > 30) {
    solarDay -= 30;
    solarMonth += 1;
  }
  if (solarMonth > 12) {
    solarMonth = 1;
    solarYear += 1;
  }
  
  return { year: solarYear, month: solarMonth, day: solarDay };
}

// ========================================
// KASI 공공데이터 API - 만세력 (년주/월주/일주)
// ========================================
const CHEONGAN = ['갑', '을', '병', '정', '무', '기', '경', '신', '임', '계'];
const CHEONGAN_HANJA = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
const JIJI = ['자', '축', '인', '묘', '진', '사', '오', '미', '신', '유', '술', '해'];
const JIJI_HANJA = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

const OHAENG_CHEONGAN: Record<string, string> = {
  '갑': '목', '을': '목', '병': '화', '정': '화', '무': '토',
  '기': '토', '경': '금', '신': '금', '임': '수', '계': '수'
};
const OHAENG_JIJI: Record<string, string> = {
  '자': '수', '축': '토', '인': '목', '묘': '목', '진': '토', '사': '화',
  '오': '화', '미': '토', '신': '금', '유': '금', '술': '토', '해': '수'
};

// 시주 계산 (일간 + 시간)
function calculateSiju(ilgan: string, hour: number): { cheongan: string, jiji: string } {
  const sijiIndex = Math.floor(((hour + 1) % 24) / 2);
  const jiji = JIJI[sijiIndex];
  
  const ilganIndex = CHEONGAN.indexOf(ilgan);
  const baseIndex = (ilganIndex % 5) * 2;
  const cheonganIndex = (baseIndex + sijiIndex) % 10;
  const cheongan = CHEONGAN[cheonganIndex];
  
  return { cheongan, jiji };
}

// 간지 문자열 파싱
function parseGanji(ganji: string): { cheongan: string, jiji: string } | null {
  if (!ganji || ganji.length < 2) return null;
  const cheongan = ganji.charAt(0);
  const jiji = ganji.charAt(1);
  if (CHEONGAN.includes(cheongan) && JIJI.includes(jiji)) {
    return { cheongan, jiji };
  }
  return null;
}

// 천간/지지를 한자로 변환
function toHanja(cheongan: string, jiji: string): { cheonganHanja: string, jijiHanja: string } {
  const cheonganIdx = CHEONGAN.indexOf(cheongan);
  const jijiIdx = JIJI.indexOf(jiji);
  return {
    cheonganHanja: cheonganIdx >= 0 ? CHEONGAN_HANJA[cheonganIdx] : cheongan,
    jijiHanja: jijiIdx >= 0 ? JIJI_HANJA[jijiIdx] : jiji
  };
}

// KASI API로 만세력 데이터 가져오기
async function getManseoryeok(year: number, month: number, day: number, apiKey: string): Promise<any> {
  console.log(`📅 KASI 만세력 API 호출: ${year}-${month}-${day}`);
  
  const solYear = String(year);
  const solMonth = String(month).padStart(2, '0');
  const solDay = String(day).padStart(2, '0');
  
  try {
    const url = `http://apis.data.go.kr/B090041/openapi/service/LrsrCldInfoService/getLunCalInfo?serviceKey=${apiKey}&solYear=${solYear}&solMonth=${solMonth}&solDay=${solDay}&_type=json`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      console.error('❌ KASI API 응답 에러:', response.status);
      return null;
    }
    
    const data = await response.json();
    const item = data?.response?.body?.items?.item;
    
    if (item) {
      console.log(`✅ KASI 만세력 응답:`, JSON.stringify(item).substring(0, 300));
      
      const extractGanji = (str: string): string => {
        if (!str) return '';
        const match = str.match(/^([가-힣]{2})/);
        return match ? match[1] : str;
      };
      
      return {
        lunSecha: extractGanji(item.lunSecha),
        lunWolgeon: extractGanji(item.lunWolgeon),
        lunIljin: extractGanji(item.lunIljin),
        lunYear: item.lunYear,
        lunMonth: item.lunMonth,
        lunDay: item.lunDay,
      };
    }
    
    console.log('⚠️ KASI API 응답에 item 없음');
    return null;
    
  } catch (e: any) {
    console.error('❌ KASI API 에러:', e.message);
    return null;
  }
}

// 사주 팔자 계산 (KASI API + 시주 계산)
async function calculateSajuPalza(
  year: number, month: number, day: number, 
  hour: number | null,
  apiKey: string
): Promise<any> {
  const manseoryeok = await getManseoryeok(year, month, day, apiKey);
  
  if (!manseoryeok) {
    console.log('⚠️ KASI API 실패, 사주 계산 불가');
    return null;
  }
  
  const yearGanji = parseGanji(manseoryeok.lunSecha);
  const monthGanji = parseGanji(manseoryeok.lunWolgeon);
  const dayGanji = parseGanji(manseoryeok.lunIljin);
  
  if (!yearGanji || !monthGanji || !dayGanji) {
    console.log('⚠️ 간지 파싱 실패');
    return null;
  }
  
  let hourGanji = null;
  if (hour !== null && hour >= 0 && hour <= 23) {
    hourGanji = calculateSiju(dayGanji.cheongan, hour);
  }
  
  const result = {
    year: {
      cheongan: yearGanji.cheongan,
      cheongan_hanja: toHanja(yearGanji.cheongan, yearGanji.jiji).cheonganHanja,
      cheongan_kr: yearGanji.cheongan + OHAENG_CHEONGAN[yearGanji.cheongan],
      cheongan_element: OHAENG_CHEONGAN[yearGanji.cheongan],
      jiji: yearGanji.jiji,
      jiji_hanja: toHanja(yearGanji.cheongan, yearGanji.jiji).jijiHanja,
      jiji_kr: yearGanji.jiji + OHAENG_JIJI[yearGanji.jiji],
      jiji_element: OHAENG_JIJI[yearGanji.jiji],
    },
    month: {
      cheongan: monthGanji.cheongan,
      cheongan_hanja: toHanja(monthGanji.cheongan, monthGanji.jiji).cheonganHanja,
      cheongan_kr: monthGanji.cheongan + OHAENG_CHEONGAN[monthGanji.cheongan],
      cheongan_element: OHAENG_CHEONGAN[monthGanji.cheongan],
      jiji: monthGanji.jiji,
      jiji_hanja: toHanja(monthGanji.cheongan, monthGanji.jiji).jijiHanja,
      jiji_kr: monthGanji.jiji + OHAENG_JIJI[monthGanji.jiji],
      jiji_element: OHAENG_JIJI[monthGanji.jiji],
    },
    day: {
      cheongan: dayGanji.cheongan,
      cheongan_hanja: toHanja(dayGanji.cheongan, dayGanji.jiji).cheonganHanja,
      cheongan_kr: dayGanji.cheongan + OHAENG_CHEONGAN[dayGanji.cheongan],
      cheongan_element: OHAENG_CHEONGAN[dayGanji.cheongan],
      jiji: dayGanji.jiji,
      jiji_hanja: toHanja(dayGanji.cheongan, dayGanji.jiji).jijiHanja,
      jiji_kr: dayGanji.jiji + OHAENG_JIJI[dayGanji.jiji],
      jiji_element: OHAENG_JIJI[dayGanji.jiji],
    },
    hour: hourGanji ? {
      cheongan: hourGanji.cheongan,
      cheongan_hanja: toHanja(hourGanji.cheongan, hourGanji.jiji).cheonganHanja,
      cheongan_kr: hourGanji.cheongan + OHAENG_CHEONGAN[hourGanji.cheongan],
      cheongan_element: OHAENG_CHEONGAN[hourGanji.cheongan],
      jiji: hourGanji.jiji,
      jiji_hanja: toHanja(hourGanji.cheongan, hourGanji.jiji).jijiHanja,
      jiji_kr: hourGanji.jiji + OHAENG_JIJI[hourGanji.jiji],
      jiji_element: OHAENG_JIJI[hourGanji.jiji],
    } : null,
    ilgan: dayGanji.cheongan,
    ilgan_hanja: toHanja(dayGanji.cheongan, dayGanji.jiji).cheonganHanja,
    ilgan_element: OHAENG_CHEONGAN[dayGanji.cheongan],
  };
  
  const elements = ['목', '화', '토', '금', '수'];
  const ohaengCount: Record<string, number> = { '목': 0, '화': 0, '토': 0, '금': 0, '수': 0 };
  
  [result.year, result.month, result.day, result.hour].forEach(pillar => {
    if (pillar) {
      if (pillar.cheongan_element) ohaengCount[pillar.cheongan_element]++;
      if (pillar.jiji_element) ohaengCount[pillar.jiji_element]++;
    }
  });
  
  const total = Object.values(ohaengCount).reduce((a, b) => a + b, 0);
  const ohaengBalance: Record<string, any> = {};
  const ohaengEnglish: Record<string, string> = { '목': 'wood', '화': 'fire', '토': 'earth', '금': 'metal', '수': 'water' };
  
  elements.forEach(el => {
    const count = ohaengCount[el];
    const percent = total > 0 ? Math.round((count / total) * 100) : 0;
    let status = '적정';
    if (percent < 10) status = '부족';
    else if (percent > 35) status = '과다';
    
    ohaengBalance[ohaengEnglish[el]] = { count, percent, status };
  });
  
  return {
    spilar: result,
    ohaeng_balance: ohaengBalance,
    ilgan: result.ilgan,
    ilgan_hanja: result.ilgan_hanja,
    ilgan_element: result.ilgan_element,
  };
}

// ========================================
// FreeAstroAPI 호출 - 네이탈 차트
// ========================================
async function getNatalChart(
  year: number, month: number, day: number,
  hour: number, minute: number,
  city: string,
  name: string,
  apiKey: string
): Promise<any> {
  console.log(`🔭 FreeAstroAPI 호출: ${year}-${month}-${day} ${hour}:${minute}, city:${city}`);
  
  const response = await fetch('https://astro-api-1qnc.onrender.com/api/v1/natal/calculate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
    },
    body: JSON.stringify({
      name,
      year,
      month,
      day,
      hour,
      minute,
      city,
      tz_str: 'AUTO',
      house_system: 'placidus',
      zodiac_type: 'tropical',
    }),
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    console.error('❌ FreeAstroAPI 에러:', response.status, errorText);
    throw new Error(`FreeAstroAPI error: ${response.status}`);
  }
  
  const data = await response.json();
  console.log('✅ FreeAstroAPI 응답 수신');
  return data;
}

// ========================================
// 점성학 데이터에서 주요 정보 추출
// ========================================
function extractAstroData(natalData: any): {
  sun_sign: string,
  sun_sign_symbol: string,
  moon_sign: string,
  rising_sign: string,
  planets: any[],
  houses: any[],
} {
  const signSymbols: Record<string, string> = {
    'Aries': '♈', 'Taurus': '♉', 'Gemini': '♊', 'Cancer': '♋',
    'Leo': '♌', 'Virgo': '♍', 'Libra': '♎', 'Scorpio': '♏',
    'Sagittarius': '♐', 'Capricorn': '♑', 'Aquarius': '♒', 'Pisces': '♓',
    'Ari': '♈', 'Tau': '♉', 'Gem': '♊', 'Can': '♋',
    'Vir': '♍', 'Lib': '♎', 'Sco': '♏',
    'Sag': '♐', 'Cap': '♑', 'Aqu': '♒', 'Pis': '♓',
  };
  
  const signKorean: Record<string, string> = {
    'Aries': '양자리', 'Taurus': '황소자리', 'Gemini': '쌍둥이자리', 'Cancer': '게자리',
    'Leo': '사자자리', 'Virgo': '처녀자리', 'Libra': '천칭자리', 'Scorpio': '전갈자리',
    'Sagittarius': '궁수자리', 'Capricorn': '염소자리', 'Aquarius': '물병자리', 'Pisces': '물고기자리',
    'Ari': '양자리', 'Tau': '황소자리', 'Gem': '쌍둥이자리', 'Can': '게자리',
    'Vir': '처녀자리', 'Lib': '천칭자리', 'Sco': '전갈자리',
    'Sag': '궁수자리', 'Cap': '염소자리', 'Aqu': '물병자리', 'Pis': '물고기자리',
  };
  
  const planets = natalData.planets || [];
  const houses = natalData.houses || natalData.cusps || [];
  
  const sun = planets.find((p: any) => 
    p.name === 'Sun' || p.name === 'sun' || p.name?.toLowerCase() === 'sun'
  );
  const moon = planets.find((p: any) => 
    p.name === 'Moon' || p.name === 'moon' || p.name?.toLowerCase() === 'moon'
  );
  
  let risingSign = '';
  if (natalData.subject?.ascendant) {
    risingSign = natalData.subject.ascendant.sign || '';
  } else if (natalData.ascendant) {
    risingSign = typeof natalData.ascendant === 'string' ? natalData.ascendant : natalData.ascendant.sign || '';
  } else if (houses.length > 0) {
    const firstHouse = houses[0];
    risingSign = firstHouse?.sign || firstHouse?.sign_name || '';
  }
  
  const sunSign = sun?.sign || 'Aries';
  const moonSign = moon?.sign || 'Aries';
  
  return {
    sun_sign: signKorean[sunSign] || sunSign,
    sun_sign_symbol: signSymbols[sunSign] || '☀️',
    moon_sign: signKorean[moonSign] || moonSign,
    rising_sign: signKorean[risingSign] || risingSign || '정보 없음',
    planets,
    houses,
  };
}

// ========================================
// Gemini API 호출 함수
// ========================================
async function callGeminiAPI(prompt: string, apiKey: string, callNumber: number): Promise<any> {
  console.log(`\n🤖 [${callNumber}차 호출] Gemini API 호출 시작...`);
  console.log(`📝 프롬프트 길이: ${prompt.length}자`);
  
  const startTime = Date.now();
  
  try {
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
    
    const response = await fetch(geminiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { 
          responseMimeType: "application/json", 
          maxOutputTokens: 16000
        }
      })
    });
    
    const elapsed = Date.now() - startTime;
    console.log(`⏱️ [${callNumber}차 호출] 응답 시간: ${elapsed}ms`);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ [${callNumber}차 호출] API 에러: ${response.status}`, errorText);
      throw new Error(`Gemini API error: ${response.status}`);
    }
    
    const aiJson = await response.json();
    const rawText = aiJson.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
    
    console.log(`📄 [${callNumber}차 호출] 응답 길이: ${rawText.length}자`);
    
    const cleanedText = rawText.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(cleanedText);
    
    console.log(`✅ [${callNumber}차 호출] JSON 파싱 성공`);
    
    return parsed;
    
  } catch (error: any) {
    console.error(`❌ [${callNumber}차 호출] 실패:`, error.message);
    throw error;
  }
}

// ========================================
// 프롬프트 생성 함수들
// ========================================

// ⭐ 1차 호출: 기본 정보 + visual_data만
function buildBaseOnlyPrompt(
  basePrompt: string, 
  isAstro: boolean,
  astroData: any
): string {
  let prompt = basePrompt;
  
  prompt += `

## ⚠️ 1차 호출 - 기본 정보만 생성하세요!
이번 호출에서는 custom_analysis를 생성하지 마세요!
"custom_analysis": [] (빈 배열)로 설정하세요.

다음 항목만 생성하세요:
- hooking_ment (한 줄 후킹)
- ${isAstro ? 'sun_sign, sun_sign_symbol, moon_sign, rising_sign, chart_grade, chart_grade_hook, soul_type, soul_type_hook' : 'saju_grade, saju_grade_hook, saju_type, saju_type_hook'}
- peak_period (전성기 나이), peak_hook
- danger_period (주의 시기 나이), danger_hook  
- summary_score (종합점수 0~100)
- summary_text (종합 요약 100자)
- graphs (5개 지표별 점수)
- lifetime_flow 또는 lifetime_wealth_flow 또는 lifetime_love_flow (5~6개 연령대별)
- lucky_prescription (6개 항목)
- final_advice (마무리 조언)
- final_hook (마무리 훅)
- ten_year_fortune (향후 10년 운세, 해당되는 경우)
- visual_data (아래 구조 필수!)
`;

  if (isAstro) {
    prompt += `

## 🎨 visual_data 필수 포함 (점성학)
JSON 응답에 반드시 아래 구조의 visual_data를 포함하세요:

"visual_data": {
  "big_three": {
    "sun": {"sign": "${astroData?.sun_sign || '별자리'}", "symbol": "${astroData?.sun_sign_symbol || '♈'}", "degree": "도수", "house": 하우스번호, "element": "원소"},
    "moon": {"sign": "${astroData?.moon_sign || '별자리'}", "symbol": "심볼", "degree": "도수", "house": 하우스번호, "element": "원소"},
    "rising": {"sign": "${astroData?.rising_sign || '별자리'}", "symbol": "심볼", "degree": "도수", "element": "원소"}
  },
  "planets": {
    "mercury": {"sign": "별자리", "symbol": "♍", "degree": "도수", "house": 하우스번호, "retrograde": false},
    "venus": {"sign": "별자리", "symbol": "♎", "degree": "도수", "house": 하우스번호, "retrograde": false},
    "mars": {"sign": "별자리", "symbol": "♈", "degree": "도수", "house": 하우스번호, "retrograde": false},
    "jupiter": {"sign": "별자리", "symbol": "♐", "degree": "도수", "house": 하우스번호, "retrograde": false},
    "saturn": {"sign": "별자리", "symbol": "♑", "degree": "도수", "house": 하우스번호, "retrograde": true/false},
    "uranus": {"sign": "별자리", "symbol": "♅", "degree": "도수", "house": 하우스번호, "retrograde": false},
    "neptune": {"sign": "별자리", "symbol": "♆", "degree": "도수", "house": 하우스번호, "retrograde": false},
    "pluto": {"sign": "별자리", "symbol": "♇", "degree": "도수", "house": 하우스번호, "retrograde": true/false}
  },
  "element_balance": {
    "fire": {"count": 개수, "percent": 퍼센트},
    "earth": {"count": 개수, "percent": 퍼센트},
    "air": {"count": 개수, "percent": 퍼센트},
    "water": {"count": 개수, "percent": 퍼센트}
  },
  "modality_balance": {
    "cardinal": {"count": 개수, "percent": 퍼센트},
    "fixed": {"count": 개수, "percent": 퍼센트},
    "mutable": {"count": 개수, "percent": 퍼센트}
  },
  "dominant_planet": {"planet": "지배행성", "reason": "이유"},
  "chart_pattern": {"type": "패턴유형", "description": "설명"}
}`;
  } else {
    prompt += `

## 🎨 visual_data 필수 포함 (사주)
JSON 응답에 반드시 아래 구조의 visual_data를 포함하세요:

"visual_data": {
  "saju_pillars": {
    "year": {"천간": "甲", "천간_kr": "갑목", "천간_element": "목", "지지": "子", "지지_kr": "자수", "지지_element": "수"},
    "month": {"천간": "丙", "천간_kr": "병화", "천간_element": "화", "지지": "寅", "지지_kr": "인목", "지지_element": "목"},
    "day": {"천간": "戊", "천간_kr": "무토", "천간_element": "토", "지지": "午", "지지_kr": "오화", "지지_element": "화"},
    "hour": {"천간": "庚", "천간_kr": "경금", "천간_element": "금", "지지": "申", "지지_kr": "신금", "지지_element": "금"}
  },
  "ohaeng_balance": {
    "wood": {"count": 개수, "percent": 퍼센트, "status": "적정/과다/부족"},
    "fire": {"count": 개수, "percent": 퍼센트, "status": "적정/과다/부족"},
    "earth": {"count": 개수, "percent": 퍼센트, "status": "적정/과다/부족"},
    "metal": {"count": 개수, "percent": 퍼센트, "status": "적정/과다/부족"},
    "water": {"count": 개수, "percent": 퍼센트, "status": "적정/과다/부족"}
  },
  "ilgan": {"char": "戊", "name": "무토", "element": "토", "yin_yang": "양", "desc": "산처럼 묵직한 사람"},
  "yongshin": {"char": "水", "name": "수", "desc": "물이 당신을 도와요", "reason": "화가 강해 수로 조절"},
  "gyeokguk": {"name": "정관격", "desc": "격국 설명"},
  "shipsin": {
    "year_cheongan": "편인",
    "year_jiji": "정관",
    "month_cheongan": "편관",
    "month_jiji": "편인",
    "day_jiji": "겁재",
    "hour_cheongan": "식신",
    "hour_jiji": "편재"
  },
  "daeun_current": {"start_age": 시작나이, "end_age": 끝나이, "cheongan": "천간", "jiji": "지지", "desc": "현재 대운 설명"}
}`;
  }
  
  return prompt;
}

// ⭐ 2차 이후 호출: 분석만 생성 (컨텍스트 보강 버전) - 11개 파라미터!
function buildAnalysisOnlyPrompt(
  baseInfo: string,
  startIndex: number,
  endIndex: number,
  analysisCount: number,
  previousAnalysisTopics: string[],
  isAstro: boolean,
  sajuData: any,
  astroData: any,
  firstCallResult: any,
  customerName: string,
  gender: string
): string {
  const actualEnd = Math.min(endIndex, analysisCount);
  
  // 1차 결과에서 핵심 정보 추출
  const grade = firstCallResult?.saju_grade || firstCallResult?.chart_grade || 'B';
  const gradeHook = firstCallResult?.saju_grade_hook || firstCallResult?.chart_grade_hook || '';
  const typeInfo = firstCallResult?.saju_type || firstCallResult?.soul_type || '';
  const typeHook = firstCallResult?.saju_type_hook || firstCallResult?.soul_type_hook || '';
  const hookingMent = firstCallResult?.hooking_ment || '';
  const peakPeriod = firstCallResult?.peak_period || '';
  const dangerPeriod = firstCallResult?.danger_period || '';

  let prompt = `
# Role: ${isAstro ? '점성학 그랜드마스터' : '대한민국 최고 권위 사주명리학 대가'}

## ⚠️ 중요: 이 고객의 데이터와 1차 분석 결과를 기반으로 작성하세요!

## 👤 고객 정보
- 이름: ${customerName}
- 성별: ${gender}
- ${baseInfo}
`;

  // 사주 데이터 추가
  if (!isAstro && sajuData && sajuData.spilar) {
    const sp = sajuData.spilar;
    prompt += `

## 📜 이 고객의 사주 팔자 (KASI 공식 데이터)
┌────────────────────────────────────────┐
│ 년주: ${sp.year.cheongan_hanja}${sp.year.jiji_hanja} (${sp.year.cheongan}${sp.year.jiji}) - ${sp.year.cheongan_element}/${sp.year.jiji_element}
│ 월주: ${sp.month.cheongan_hanja}${sp.month.jiji_hanja} (${sp.month.cheongan}${sp.month.jiji}) - ${sp.month.cheongan_element}/${sp.month.jiji_element}
│ 일주: ${sp.day.cheongan_hanja}${sp.day.jiji_hanja} (${sp.day.cheongan}${sp.day.jiji}) - ${sp.day.cheongan_element}/${sp.day.jiji_element}
│ 시주: ${sp.hour ? `${sp.hour.cheongan_hanja}${sp.hour.jiji_hanja} (${sp.hour.cheongan}${sp.hour.jiji}) - ${sp.hour.cheongan_element}/${sp.hour.jiji_element}` : '미상'}
├────────────────────────────────────────┤
│ 일간: ${sajuData.ilgan_hanja} (${sajuData.ilgan}) - ${sajuData.ilgan_element}
│ 
│ 오행 분포:
│   목(木): ${sajuData.ohaeng_balance?.wood?.count || 0}개 (${sajuData.ohaeng_balance?.wood?.percent || 0}%) - ${sajuData.ohaeng_balance?.wood?.status || ''}
│   화(火): ${sajuData.ohaeng_balance?.fire?.count || 0}개 (${sajuData.ohaeng_balance?.fire?.percent || 0}%) - ${sajuData.ohaeng_balance?.fire?.status || ''}
│   토(土): ${sajuData.ohaeng_balance?.earth?.count || 0}개 (${sajuData.ohaeng_balance?.earth?.percent || 0}%) - ${sajuData.ohaeng_balance?.earth?.status || ''}
│   금(金): ${sajuData.ohaeng_balance?.metal?.count || 0}개 (${sajuData.ohaeng_balance?.metal?.percent || 0}%) - ${sajuData.ohaeng_balance?.metal?.status || ''}
│   수(水): ${sajuData.ohaeng_balance?.water?.count || 0}개 (${sajuData.ohaeng_balance?.water?.percent || 0}%) - ${sajuData.ohaeng_balance?.water?.status || ''}
└────────────────────────────────────────┘
`;
  }

  // 점성학 데이터 추가
  if (isAstro && astroData) {
    prompt += `

## 🔭 이 고객의 점성학 데이터
┌────────────────────────────────────────┐
│ 태양 별자리: ${astroData.sun_sign} ${astroData.sun_sign_symbol}
│ 달 별자리: ${astroData.moon_sign}
│ 상승궁: ${astroData.rising_sign}
└────────────────────────────────────────┘
`;
  }

  // 1차 분석 결과 (톤 유지용)
  prompt += `

## 🎯 1차 분석 결과 (이 톤과 맥락을 유지하세요!)
- 등급: ${grade}등급
- 등급 설명: ${gradeHook}
- 유형: ${typeInfo}
- 유형 설명: ${typeHook}
- 핵심 메시지: ${hookingMent}
- 전성기: ${peakPeriod}
- 주의 시기: ${dangerPeriod}

## 📋 이미 완료된 분석 주제 (중복 금지!)
${previousAnalysisTopics.length > 0 ? previousAnalysisTopics.map((t, i) => `${i + 1}. ${t}`).join('\n') : '(없음 - 첫 분석 세트입니다)'}

## ⚠️ 이번 호출: ${startIndex}번 ~ ${actualEnd}번 분석 생성
총 ${actualEnd - startIndex + 1}개의 분석을 생성하세요.

## 📝 필수 규칙
1. 각 분석의 full_content는 **반드시 600자 이상** (가능하면 800자 이상)
2. 위 사주/점성학 데이터를 **구체적으로 언급**하며 분석
3. "${customerName}님은 ${!isAstro && sajuData ? sajuData.ilgan + '(' + sajuData.ilgan_element + ')' : astroData?.sun_sign || ''} ..." 형태로 **이름과 데이터 직접 언급**
4. 1차 분석의 등급(${grade})과 톤을 유지
5. 일반론 금지! 이 사람만을 위한 구체적 분석
6. 구체적인 **나이, 년도, 시기** 포함
7. ${gender === '여성' ? '여성' : '남성'}에게 적합한 표현과 조언 사용

## 🗣️ 말투 가이드
- "제가 40년 봐왔는데요..."
- "솔직히 말씀드릴게요"
- "이건 꼭 기억하세요"
- "~입니다", "~됩니다" 같은 AI 말투 금지
- 자연스러운 구어체로 작성

## 📚 분석 주제 가이드 (${startIndex}~${actualEnd}번)
${isAstro ? `
- 태양 별자리 심층 분석 (핵심 정체성)
- 달 별자리 분석 (내면과 감정)
- 상승궁 분석 (외부 이미지)
- 하우스별 분석 (1~12하우스)
- 행성 배치 분석
- 원소 밸런스 분석
- 연애/결혼운
- 재물/커리어운
- 건강/가족운
- 인생 전성기와 주의기
- 영혼의 사명
- 개운법과 조언
` : `
- 사주 원국 해석
- 오행 밸런스 분석
- 일주론 (핵심 성격)
- 타고난 성격과 기질
- 숨겨진 재능
- 재물운 (평생 돈의 흐름)
- 직업 적성 (천직)
- 연애 스타일
- 결혼운과 배우자
- 가족운 (부모/자녀)
- 건강 체질
- 대운 흐름
- 연도별 운세
- 개운법
`}

# Response Format (JSON Only)
{
  "custom_analysis": [
    {
      "sequence": ${startIndex},
      "topic": "주제명 (이모지 포함)",
      "hook": "후킹 멘트 (20자 이내, 궁금증 유발)",
      "summary": "100자 내외 요약",
      "full_content": "600자 이상 상세 분석. ${customerName}님의 ${!isAstro && sajuData ? sajuData.ilgan + '(' + sajuData.ilgan_element + ')' : ''} 데이터를 구체적으로 언급하며 작성. 나이, 년도, 시기 포함."
    },
    ... (총 ${actualEnd - startIndex + 1}개)
  ]
}

⚠️ JSON만 응답하세요. 다른 텍스트 없이 순수 JSON만!`;

  return prompt;
}

// ========================================
// 메인 서버
// ========================================
serve(async (req) => {
  const requestStartTime = Date.now();
  console.log("\n" + "=".repeat(60));
  console.log("🚀 새로운 요청 시작:", new Date().toISOString());
  console.log("=".repeat(60));
  
  try {
    // Supabase 클라이언트 생성
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
    const supabase = createClient(supabaseUrl, supabaseKey);
    console.log("✅ Supabase 클라이언트 생성 완료");

    // 시스템 설정 로드
    const { data: configs, error: configError } = await supabase.from("system_config").select("key, value");
    if (configError) {
      console.error("❌ system_config 로드 실패:", configError.message);
      throw new Error("시스템 설정 로드 실패");
    }
    
    const config: any = {};
    configs?.forEach((c: any) => { config[c.key] = c.value; });
    console.log("✅ 시스템 설정 로드 완료");

    // 요청 데이터 파싱
    const { record } = await req.json();
    console.log("📦 주문 ID:", record.id);
    console.log("📦 상품 ID:", record.product_id);
    
    // 상품 정보 조회
    const { data: product, error: productError } = await supabase
      .from("products")
      .select("*")
      .eq("id", record.product_id)
      .single();
    
    if (productError || !product) {
      console.error("❌ 상품 조회 실패:", productError?.message);
      throw new Error("상품 정보 없음");
    }
    console.log("✅ 상품 조회 완료:", product.name);

    const input = record.input_data;
    const customerName = input.name;
    const analysisCount = product.analysis_count || 10;
    const isAstro = product.id.includes('astro');
    
    console.log("\n📊 분석 설정:");
    console.log(`   - 고객명: ${customerName}`);
    console.log(`   - 분석 개수: ${analysisCount}`);
    console.log(`   - 점성학 여부: ${isAstro}`);
    
    const ANALYSIS_PER_CALL = 5;
    const analysisCallCount = Math.ceil(analysisCount / ANALYSIS_PER_CALL);
    const totalCallCount = 1 + analysisCallCount;
    console.log(`   - AI 호출 횟수: ${totalCallCount}회 (기본1회 + 분석${analysisCallCount}회)`);

    // ========================================
    // 음력 → 양력 변환
    // ========================================
    let year = parseInt(input.dob_year || input.dob?.split('-')[0]);
    let month = parseInt(input.dob_month || input.dob?.split('-')[1]);
    let day = parseInt(input.dob_day || input.dob?.split('-')[2]);
    
    const calendarType = input.calendar_type || 'solar';
    console.log(`\n📅 생년월일: ${year}-${month}-${day} (${calendarType === 'lunar' ? '음력' : '양력'})`);
    
    if (calendarType === 'lunar') {
      console.log("🌙 음력 → 양력 변환 시작...");
      const solar = await convertLunarToSolar(year, month, day);
      year = solar.year;
      month = solar.month;
      day = solar.day;
      console.log(`☀️ 양력 변환 완료: ${year}-${month}-${day}`);
    }
    
    const solarDob = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

    // ========================================
    // 점성학: FreeAstroAPI 호출
    // ========================================
    let astroData: any = null;
    
    if (isAstro) {
      const astroApiKey = config.FREEASTRO_API_KEY;
      
      if (astroApiKey) {
        try {
          const city = convertCityName(input.birth_city || '서울');
          const hour = parseInt(input.birth_hour) || 12;
          const minute = parseInt(input.birth_minute) || 0;
          
          console.log(`\n🔭 점성학 API 호출: ${city}, ${hour}:${minute}`);
          
          const natalData = await getNatalChart(year, month, day, hour, minute, city, customerName, astroApiKey);
          astroData = extractAstroData(natalData);
          
          console.log(`✅ 점성학 데이터 추출 완료:`);
          console.log(`   - 태양: ${astroData.sun_sign}`);
          console.log(`   - 달: ${astroData.moon_sign}`);
          console.log(`   - 상승궁: ${astroData.rising_sign}`);
          
        } catch (astroError: any) {
          console.error('❌ 점성학 API 에러:', astroError.message);
          console.log('⚠️ AI가 추정하도록 진행');
        }
      } else {
        console.log('⚠️ FREEASTRO_API_KEY 미설정');
      }
    }

    // ========================================
    // 사주: KASI 만세력 API 호출
    // ========================================
    let sajuData: any = null;
    
    if (!isAstro) {
      const kasiApiKey = config.KASI_API_KEY || '4e1040eb4ccbd29dc4bcb4c3c4fa70f585d56735e524466e3972e829e213859c';
      
      if (kasiApiKey) {
        try {
          let birthHour: number | null = null;
          if (input.birth_time && input.birth_time !== '미상') {
            const timeMatch = input.birth_time.match(/(\d{1,2}):(\d{2})/);
            if (timeMatch) {
              birthHour = parseInt(timeMatch[1]);
            }
          } else if (input.birth_hour) {
            birthHour = parseInt(input.birth_hour);
          }
          
          console.log(`\n📅 사주 계산: ${year}-${month}-${day}, 시간: ${birthHour !== null ? birthHour + '시' : '미상'}`);
          
          sajuData = await calculateSajuPalza(year, month, day, birthHour, kasiApiKey);
          
          if (sajuData) {
            console.log(`✅ 사주 팔자 계산 완료:`);
            console.log(`   - 년주: ${sajuData.spilar.year.cheongan}${sajuData.spilar.year.jiji}`);
            console.log(`   - 월주: ${sajuData.spilar.month.cheongan}${sajuData.spilar.month.jiji}`);
            console.log(`   - 일주: ${sajuData.spilar.day.cheongan}${sajuData.spilar.day.jiji}`);
            if (sajuData.spilar.hour) {
              console.log(`   - 시주: ${sajuData.spilar.hour.cheongan}${sajuData.spilar.hour.jiji}`);
            }
            console.log(`   - 일간: ${sajuData.ilgan} (${sajuData.ilgan_element})`);
          }
          
        } catch (sajuError: any) {
          console.error('❌ 사주 계산 에러:', sajuError.message);
          console.log('⚠️ AI가 추정하도록 진행');
        }
      } else {
        console.log('⚠️ KASI_API_KEY 미설정');
      }
    }

    // ========================================
    // 기본 프롬프트 준비
    // ========================================
    let basePrompt = product.prompt_template
      .replace(/\{\{name\}\}/g, customerName)
      .replace(/\{\{dob\}\}/g, solarDob)
      .replace(/\{\{birth_time\}\}/g, input.birth_time || "미상")
      .replace(/\{\{birth_city\}\}/g, input.birth_city || "서울")
      .replace(/\{\{gender\}\}/g, input.gender);
    
    if (calendarType === 'lunar' && !isAstro) {
      basePrompt += `\n\n## 참고: 고객이 입력한 생년월일은 음력 ${input.dob}이며, 양력으로 변환하면 ${solarDob}입니다.`;
    }
    
    if (isAstro && astroData) {
      basePrompt += `

## 🔭 계산된 점성학 데이터 (정확한 값):
- 태양 별자리: ${astroData.sun_sign} ${astroData.sun_sign_symbol}
- 달 별자리: ${astroData.moon_sign}
- 상승궁: ${astroData.rising_sign}
- 행성 배치: ${JSON.stringify(astroData.planets)}

⚠️ 위의 값을 그대로 사용하세요!`;
    }

    if (!isAstro && sajuData) {
      const sp = sajuData.spilar;
      basePrompt += `

## 📜 ⚠️⚠️⚠️ 이 고객의 실제 사주 팔자 (KASI 천문연구원 공식 데이터) ⚠️⚠️⚠️

┌────────────────────────────────────────────────────┐
│  년주(年柱): ${sp.year.cheongan_hanja}${sp.year.jiji_hanja} (${sp.year.cheongan}${sp.year.jiji}) - ${sp.year.cheongan_element}/${sp.year.jiji_element}
│  월주(月柱): ${sp.month.cheongan_hanja}${sp.month.jiji_hanja} (${sp.month.cheongan}${sp.month.jiji}) - ${sp.month.cheongan_element}/${sp.month.jiji_element}
│  일주(日柱): ${sp.day.cheongan_hanja}${sp.day.jiji_hanja} (${sp.day.cheongan}${sp.day.jiji}) - ${sp.day.cheongan_element}/${sp.day.jiji_element}
│  시주(時柱): ${sp.hour ? `${sp.hour.cheongan_hanja}${sp.hour.jiji_hanja} (${sp.hour.cheongan}${sp.hour.jiji}) - ${sp.hour.cheongan_element}/${sp.hour.jiji_element}` : '미상'}
├────────────────────────────────────────────────────┤
│  일간(日干): ${sajuData.ilgan_hanja} (${sajuData.ilgan}) - ${sajuData.ilgan_element} 오행
│  
│  오행 분포:
│    목(木): ${sajuData.ohaeng_balance.wood.count}개 (${sajuData.ohaeng_balance.wood.percent}%) - ${sajuData.ohaeng_balance.wood.status}
│    화(火): ${sajuData.ohaeng_balance.fire.count}개 (${sajuData.ohaeng_balance.fire.percent}%) - ${sajuData.ohaeng_balance.fire.status}
│    토(土): ${sajuData.ohaeng_balance.earth.count}개 (${sajuData.ohaeng_balance.earth.percent}%) - ${sajuData.ohaeng_balance.earth.status}
│    금(金): ${sajuData.ohaeng_balance.metal.count}개 (${sajuData.ohaeng_balance.metal.percent}%) - ${sajuData.ohaeng_balance.metal.status}
│    수(水): ${sajuData.ohaeng_balance.water.count}개 (${sajuData.ohaeng_balance.water.percent}%) - ${sajuData.ohaeng_balance.water.status}
└────────────────────────────────────────────────────┘

## ⚠️ 필수 지침:
1. 위 사주 팔자를 기반으로 분석하세요. 다른 사주를 만들지 마세요!
2. 일간 "${sajuData.ilgan}(${sajuData.ilgan_element})"의 특성을 중심으로 분석하세요
3. 오행 분포에서 "${sajuData.ohaeng_balance.wood.status === '부족' ? '목' : sajuData.ohaeng_balance.fire.status === '부족' ? '화' : sajuData.ohaeng_balance.earth.status === '부족' ? '토' : sajuData.ohaeng_balance.metal.status === '부족' ? '금' : '수'}"이 부족하면 이를 보완하는 용신/개운법을 제시하세요
4. custom_analysis의 모든 내용은 이 사주 기반으로, 일반론 금지!
5. "${customerName}님은 ${sajuData.ilgan}${sajuData.ilgan_element} 일간으로..." 형태로 구체적으로 언급하세요
6. 대운/세운 분석시 실제 년도와 나이를 계산해서 제시하세요`;
    }

    // ========================================
    // AI 다중 호출 (병렬 방식!)
    // ========================================
    console.log("\n" + "=".repeat(40));
    console.log("🤖 AI 분석 시작 (병렬 호출 방식)");
    console.log("=".repeat(40));
    
    let finalResult: any = {};
    let allAnalyses: any[] = [];
    
    // ⭐ 1차 호출: 기본 정보 + visual_data (먼저 실행)
    console.log(`\n--- 1차 호출: 기본 정보 + visual_data ---`);
    try {
      const baseOnlyPrompt = buildBaseOnlyPrompt(basePrompt, isAstro, astroData);
      finalResult = await callGeminiAPI(baseOnlyPrompt, config.GOOGLE_API_KEY, 1);
      
      console.log(`✅ 1차 결과 키: ${Object.keys(finalResult).join(', ')}`);
      
      if (finalResult.visual_data) {
        console.log(`✅ visual_data 생성됨`);
      } else {
        console.log(`⚠️ visual_data 없음`);
      }
      
      // 사주 데이터가 있으면 visual_data 덮어쓰기
      if (!isAstro && sajuData) {
        const sp = sajuData.spilar;
        
        if (!finalResult.visual_data) {
          finalResult.visual_data = {};
        }
        
        finalResult.visual_data.saju_pillars = {
          year: {
            천간: sp.year.cheongan_hanja,
            천간_kr: sp.year.cheongan_kr,
            천간_element: sp.year.cheongan_element,
            지지: sp.year.jiji_hanja,
            지지_kr: sp.year.jiji_kr,
            지지_element: sp.year.jiji_element,
          },
          month: {
            천간: sp.month.cheongan_hanja,
            천간_kr: sp.month.cheongan_kr,
            천간_element: sp.month.cheongan_element,
            지지: sp.month.jiji_hanja,
            지지_kr: sp.month.jiji_kr,
            지지_element: sp.month.jiji_element,
          },
          day: {
            천간: sp.day.cheongan_hanja,
            천간_kr: sp.day.cheongan_kr,
            천간_element: sp.day.cheongan_element,
            지지: sp.day.jiji_hanja,
            지지_kr: sp.day.jiji_kr,
            지지_element: sp.day.jiji_element,
          },
          hour: sp.hour ? {
            천간: sp.hour.cheongan_hanja,
            천간_kr: sp.hour.cheongan_kr,
            천간_element: sp.hour.cheongan_element,
            지지: sp.hour.jiji_hanja,
            지지_kr: sp.hour.jiji_kr,
            지지_element: sp.hour.jiji_element,
          } : null,
        };
        
        finalResult.visual_data.ohaeng_balance = sajuData.ohaeng_balance;
        
        finalResult.visual_data.ilgan = {
          char: sajuData.ilgan_hanja,
          name: sajuData.ilgan + OHAENG_CHEONGAN[sajuData.ilgan],
          element: sajuData.ilgan_element,
          desc: finalResult.visual_data?.ilgan?.desc || `${sajuData.ilgan_element}의 기운을 가진 사람`,
        };
        
        console.log(`✅ visual_data를 KASI API 데이터로 덮어씀`);
      }
      
    } catch (firstCallError: any) {
      console.error(`❌ 1차 호출 실패:`, firstCallError.message);
      throw new Error(`1차 AI 호출 실패: ${firstCallError.message}`);
    }
    
    // ⭐ 2차 이후: 분석 병렬 호출!
    console.log(`\n--- 2차 이후: 분석 ${analysisCallCount}개 병렬 호출 ---`);
    
    // baseInfo 준비
    let sajuInfo = '';
    if (!isAstro && sajuData) {
      const sp = sajuData.spilar;
      sajuInfo = `
사주: 년주 ${sp.year.cheongan}${sp.year.jiji}(${sp.year.cheongan_element}/${sp.year.jiji_element}), 월주 ${sp.month.cheongan}${sp.month.jiji}, 일주 ${sp.day.cheongan}${sp.day.jiji}, 일간 ${sajuData.ilgan}(${sajuData.ilgan_element})
오행: 목${sajuData.ohaeng_balance.wood.percent}% 화${sajuData.ohaeng_balance.fire.percent}% 토${sajuData.ohaeng_balance.earth.percent}% 금${sajuData.ohaeng_balance.metal.percent}% 수${sajuData.ohaeng_balance.water.percent}%`;
    }
    
    const baseInfo = `이름: ${customerName}, 생년월일: ${solarDob}, 성별: ${input.gender}${isAstro && astroData ? `, 태양: ${astroData.sun_sign}, 달: ${astroData.moon_sign}, 상승궁: ${astroData.rising_sign}` : ''}${sajuInfo}`;
    
    // ⭐ 병렬 호출을 위한 Promise 배열 생성
    const analysisPromises: Promise<any>[] = [];
    
    for (let i = 0; i < analysisCallCount; i++) {
      const callNumber = i + 2;
      const startIndex = i * ANALYSIS_PER_CALL + 1;
      const endIndex = Math.min((i + 1) * ANALYSIS_PER_CALL, analysisCount);
      
      // 예상 이전 주제 (병렬이라 실제 주제 대신 번호로)
      const expectedPreviousTopics = Array.from(
        { length: startIndex - 1 }, 
        (_, idx) => `분석 ${idx + 1}`
      );
      
      console.log(`📋 ${callNumber}차 호출 준비: 분석 ${startIndex}~${endIndex}번`);
      
      // ⭐ 11개 파라미터 모두 전달!
      const analysisPrompt = buildAnalysisOnlyPrompt(
        baseInfo, 
        startIndex, 
        endIndex, 
        analysisCount, 
        expectedPreviousTopics, 
        isAstro,
        sajuData,
        astroData,
        finalResult,
        customerName,
        input.gender
      );
      
      // Promise 배열에 추가
      analysisPromises.push(
        callGeminiAPI(analysisPrompt, config.GOOGLE_API_KEY, callNumber)
          .then(result => ({ success: true, callNumber, result }))
          .catch(error => ({ success: false, callNumber, error: error.message }))
      );
    }
    
    // ⭐ 모든 분석 호출을 동시에 실행!
    console.log(`\n🚀 ${analysisPromises.length}개 API 호출 동시 시작!`);
    const parallelStartTime = Date.now();
    
    const analysisResults = await Promise.all(analysisPromises);
    
    const parallelEndTime = Date.now();
    console.log(`⏱️ 병렬 호출 총 소요 시간: ${parallelEndTime - parallelStartTime}ms`);
    
    // ⭐ 결과 수집
    for (const res of analysisResults) {
      if (res.success && res.result?.custom_analysis) {
        const analyses = res.result.custom_analysis;
        allAnalyses.push(...analyses);
        console.log(`✅ ${res.callNumber}차 호출 성공: 분석 ${analyses.length}개`);
      } else {
        console.error(`❌ ${res.callNumber}차 호출 실패:`, res.error || 'unknown error');
      }
    }
    
    // sequence 기준으로 정렬
    allAnalyses.sort((a, b) => (a.sequence || 0) - (b.sequence || 0));
    
    console.log(`\n📊 총 수집된 분석: ${allAnalyses.length}개`);

    // ========================================
    // 결과 합치기
    // ========================================
    console.log("\n" + "=".repeat(40));
    console.log("📦 결과 합치기");
    console.log("=".repeat(40));
    
    finalResult.custom_analysis = allAnalyses;
    console.log(`✅ 총 분석 개수: ${allAnalyses.length}개`);
    
    if (isAstro && astroData) {
      finalResult.sun_sign = astroData.sun_sign;
      finalResult.sun_sign_symbol = astroData.sun_sign_symbol;
      finalResult.moon_sign = astroData.moon_sign;
      finalResult.rising_sign = astroData.rising_sign;
      console.log("✅ 점성학 데이터 덮어쓰기 완료");
    }
    
    // 분석 품질 체크
    const shortAnalyses = allAnalyses.filter((a: any) => 
      (a.full_content?.length || 0) < 500
    );
    if (shortAnalyses.length > 0) {
      console.log(`⚠️ 500자 미만 분석 ${shortAnalyses.length}개 발견`);
    }
    
    // DB 저장
    console.log("\n💾 DB 저장 중...");
    const { error: updateError } = await supabase
      .from("orders")
      .update({ ai_response: finalResult })
      .eq("id", record.id);
    
    if (updateError) {
      console.error("❌ DB 저장 실패:", updateError.message);
      throw new Error("DB 저장 실패");
    }
    console.log("✅ ai_response 저장 완료");

    // ========================================
    // 이메일 발송
    // ========================================
    const brandName = config.BRAND_NAME || "OZ Fortune";
    
    if (input.email && config.RESEND_API_KEY) {
      console.log("\n📧 이메일 발송 중...", input.email);
      
      const resultUrl = `https://ozfortune.site/result/${record.id}`;
      const fullResultUrl = `https://ozfortune.site/result/${record.id}?view=full`;
      
      const emailHtml = `
<div style="font-family:'Apple SD Gothic Neo',sans-serif;max-width:600px;margin:0 auto;padding:40px 20px;">
  <h1 style="color:#9b59b6;text-align:center;">${isAstro ? '⭐' : '🔮'} ${product.name}</h1>
  <p style="text-align:center;color:#666;">${brandName}</p>
  <div style="background:#f5f7fa;padding:30px;border-radius:15px;margin:30px 0;">
    <p style="font-size:18px;color:#333;">안녕하세요, <strong>${customerName}</strong>님!</p>
    <p style="color:#555;">분석이 완료되었습니다. 아래 버튼을 클릭하여 결과를 확인하세요.</p>
    ${isAstro && astroData ? `
    <div style="background:#fff;padding:15px;border-radius:10px;margin-top:15px;text-align:center;">
      <p style="margin:0;color:#9b59b6;">
        <strong>${astroData.sun_sign_symbol} ${astroData.sun_sign}</strong> | 
        🌙 ${astroData.moon_sign} | 
        ⬆️ ${astroData.rising_sign}
      </p>
    </div>
    ` : ''}
  </div>
  <a href="${resultUrl}" style="display:block;background:linear-gradient(135deg,#9b59b6,#e91e63);color:white;text-decoration:none;padding:18px;border-radius:10px;text-align:center;font-weight:bold;margin-bottom:15px;">
    📋 요약본 보기
  </a>
  <a href="${fullResultUrl}" style="display:block;background:linear-gradient(135deg,#3498db,#2ecc71);color:white;text-decoration:none;padding:18px;border-radius:10px;text-align:center;font-weight:bold;margin-bottom:15px;">
    📖 풀버전 보기
  </a>
  <p style="text-align:center;color:#888;margin-top:30px;font-size:14px;">
    인쇄 기능을 통해 PDF로 저장도 가능합니다.
  </p>
  <p style="text-align:center;color:#aaa;margin-top:20px;">- ${brandName} -</p>
</div>`;

      try {
        const emailResponse = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: { 
            "Authorization": `Bearer ${config.RESEND_API_KEY}`, 
            "Content-Type": "application/json" 
          },
          body: JSON.stringify({
            from: `${config.SENDER_NAME || 'OZ Fortune'} <${config.SENDER_EMAIL || 'onboarding@resend.dev'}>`,
            to: [input.email],
            subject: `${isAstro ? '⭐' : '🔮'} ${customerName}님의 ${product.name} 분석 완료!`,
            html: emailHtml
          })
        });
        
        if (emailResponse.ok) {
          console.log("✅ 이메일 발송 완료");
        } else {
          const emailError = await emailResponse.text();
          console.error("⚠️ 이메일 발송 실패:", emailError);
        }
      } catch (emailErr: any) {
        console.error("⚠️ 이메일 발송 에러:", emailErr.message);
      }
    }

    // ========================================
    // 상태 업데이트
    // ========================================
    const { error: statusError } = await supabase
      .from("orders")
      .update({ status: "completed" })
      .eq("id", record.id);
    
    if (statusError) {
      console.error("⚠️ 상태 업데이트 실패:", statusError.message);
    } else {
      console.log("✅ 상태 'completed' 업데이트 완료");
    }

    // ========================================
    // 완료
    // ========================================
    const totalTime = Date.now() - requestStartTime;
    console.log("\n" + "=".repeat(60));
    console.log(`🎉 처리 완료! 총 소요 시간: ${totalTime}ms (${(totalTime/1000).toFixed(1)}초)`);
    console.log(`   - 분석 개수: ${allAnalyses.length}개`);
    console.log(`   - AI 호출: ${totalCallCount}회 (병렬)`);
    console.log("=".repeat(60) + "\n");

    return new Response(JSON.stringify({ 
      success: true,
      orderId: record.id,
      analysisCount: allAnalyses.length,
      callCount: totalCallCount,
      totalTime
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });

  } catch (err: any) {
    const totalTime = Date.now() - requestStartTime;
    console.error("\n" + "=".repeat(60));
    console.error("❌ 처리 실패:", err.message);
    console.error(`   소요 시간: ${totalTime}ms`);
    console.error("=".repeat(60) + "\n");
    
    return new Response(JSON.stringify({ 
      error: err.message,
      totalTime 
    }), { 
      status: 500, 
      headers: { "Content-Type": "application/json" } 
    });
  }
});