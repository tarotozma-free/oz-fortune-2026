const LifetimeFlowChart = ({ data, theme, lineColor = '#FFD700' }) => {
  if (!data || data.length === 0) return null;
  
  const maxScore = 100;
  const width = 100;
  const height = 60;
  const padding = 10;
  
  const points = data.map((item, i) => {
    const x = padding + (i * (width - padding * 2) / (data.length - 1));
    const y = height - padding - ((item.score / maxScore) * (height - padding * 2));
    return { x, y, ...item };
  });
  
  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const areaD = `${pathD} L ${points[points.length-1].x} ${height - padding} L ${padding} ${height - padding} Z`;
  
  return (
    <div className="w-full">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-40">
        <defs>
          <linearGradient id="flowGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={lineColor} stopOpacity="0.6" />
            <stop offset="100%" stopColor={lineColor} stopOpacity="0.1" />
          </linearGradient>
          <linearGradient id="flowLineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={lineColor} />
            <stop offset="50%" stopColor={lineColor} />
            <stop offset="100%" stopColor={lineColor} />
          </linearGradient>
        </defs>
        
        {[0, 25, 50, 75, 100].map((val, i) => {
          const y = height - padding - ((val / maxScore) * (height - padding * 2));
          return (
            <line key={i} x1={padding} y1={y} x2={width - padding} y2={y} 
              stroke={`${lineColor}33`} strokeWidth="0.3" strokeDasharray="2,2" />
          );
        })}
        
        <path d={areaD} fill="url(#flowGradient)" />
        <path d={pathD} fill="none" stroke="url(#flowLineGradient)" strokeWidth="1.5" strokeLinecap="round" />
        
        {points.map((p, i) => (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r="2.5" fill="#1F2937" stroke={lineColor} strokeWidth="1.5" />
            <text x={p.x} y={height - 2} textAnchor="middle" className="text-[4px]" fill={lineColor}>{p.age_range}</text>
          </g>
        ))}
      </svg>
      
     <div className="grid grid-cols-5 gap-1 mt-4">
  {data.map((item, i) => (
    <div key={i} className="text-center">
      <div className={`${theme.text.accent} font-bold text-sm`}>{item.score}점</div>
      <div className={`${theme.text.muted} text-xs leading-tight px-1`}>
        {item.hook?.length > 12 ? item.hook.substring(0, 12) + '...' : item.hook}
      </div>
    </div>
  ))}
</div>
    </div>
  );
};


export default LifetimeFlowChart;