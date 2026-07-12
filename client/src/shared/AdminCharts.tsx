import React, { useEffect, useState } from 'react';

interface ChartDataItem {
  label: string;
  value: number;
  color?: string;
}

// 1. Circular Health Gauge with Count-Up and Rotation animation
export const CircularHealthGauge: React.FC<{ value: number; size?: number }> = ({ value, size = 160 }) => {
  const [displayVal, setDisplayVal] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = value;
    if (start === end) return;
    const duration = 1000;
    const increment = end / (duration / 16); // ~60fps
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setDisplayVal(end);
        clearInterval(timer);
      } else {
        setDisplayVal(Math.round(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [value]);

  const radius = size * 0.36;
  const strokeWidth = size * 0.08;
  const center = size / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (displayVal / 100) * circumference;

  return (
    <div className="relative flex flex-col items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <defs>
          <linearGradient id="healthGaugeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4F46E5" /> {/* Indigo */}
            <stop offset="100%" stopColor="#10B981" /> {/* Emerald */}
          </linearGradient>
        </defs>
        
        {/* Track circle */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="transparent"
          stroke="#E5E7EB"
          strokeWidth={strokeWidth}
        />
        
        {/* Animated fill circle */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="transparent"
          stroke="url(#healthGaugeGrad)"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-300 ease-out"
        />
      </svg>
      
      {/* Center Label */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <span className="text-3xl font-extrabold text-slate-800 leading-none">{displayVal}%</span>
        <span className="text-[10px] uppercase font-bold text-emerald-500 tracking-wider mt-1">Healthy</span>
      </div>
    </div>
  );
};

// 2. Horizontal Department Asset Bar Chart with loading transitions
export const SvgHorizontalBarChart: React.FC<{ data: ChartDataItem[] }> = ({ data }) => {
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 150);
    return () => clearTimeout(t);
  }, []);

  if (!data || data.length === 0) {
    return <div className="text-slate-400 text-center py-6 text-xs font-semibold">No data available</div>;
  }

  const maxVal = Math.max(...data.map(d => d.value), 1);

  return (
    <div className="space-y-4">
      {data.map((item, idx) => {
        const percentage = (item.value / maxVal) * 100;
        const color = item.color || '#4F46E5'; // Default Indigo
        
        return (
          <div key={idx} className="space-y-1 group">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
              <span className="group-hover:text-slate-900 transition-colors">{item.label}</span>
              <span className="font-mono text-slate-500">{item.value} Assets</span>
            </div>
            
            <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden relative border border-slate-200/50">
              <div
                style={{ 
                  width: animated ? `${percentage}%` : '0%', 
                  backgroundColor: color 
                }}
                className="h-full rounded-full transition-all duration-1000 ease-out relative shadow-[inset_0_1px_2px_rgba(255,255,255,0.2)]"
              >
                {/* Glow strip */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

// 3. Area Line Chart for Maintenance Trends (Jan - Jun)
export const SvgLineChart: React.FC<{ data: ChartDataItem[]; height?: number }> = ({ data, height = 180 }) => {
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 200);
    return () => clearTimeout(t);
  }, []);

  if (!data || data.length === 0) {
    return <div className="text-slate-400 text-center py-6 text-xs font-semibold">No data available</div>;
  }

  const maxVal = Math.max(...data.map(d => d.value), 1);
  const chartHeight = height - 40;
  const paddingX = 35;
  const paddingY = 20;

  // Compute SVG coordinates
  const points = data.map((item, idx) => {
    const x = paddingX + (idx * (280 - 2 * paddingX)) / (data.length - 1 || 1);
    const y = height - paddingY - (item.value / maxVal) * (chartHeight - paddingY);
    return { x, y };
  });

  // Construct Line Path (D attribute)
  let linePath = '';
  let areaPath = '';
  
  if (points.length > 0) {
    linePath = `M ${points[0].x} ${animated ? points[0].y : height - paddingY}`;
    for (let i = 1; i < points.length; i++) {
      linePath += ` L ${points[i].x} ${animated ? points[i].y : height - paddingY}`;
    }
    
    // Closed Area Path
    areaPath = `${linePath} L ${points[points.length - 1].x} ${height - paddingY} L ${points[0].x} ${height - paddingY} Z`;
  }

  return (
    <div className="w-full flex justify-center">
      <svg width="100%" height={height} viewBox={`0 0 280 ${height}`} preserveAspectRatio="none" className="overflow-visible">
        <defs>
          <linearGradient id="lineAreaGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#4F46E5" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#4F46E5" stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {/* Grid lines */}
        <line x1={paddingX} y1={height - paddingY} x2={280 - paddingX} y2={height - paddingY} stroke="#E5E7EB" strokeWidth="1" />
        <line x1={paddingX} y1={paddingY} x2={280 - paddingX} y2={paddingY} stroke="#F3F4F6" strokeWidth="1" strokeDasharray="3" />

        {/* Filled Area */}
        {areaPath && (
          <path
            d={areaPath}
            fill="url(#lineAreaGrad)"
            className="transition-all duration-1000 ease-out"
          />
        )}

        {/* Stroke Line */}
        {linePath && (
          <path
            d={linePath}
            fill="none"
            stroke="#4F46E5"
            strokeWidth="2.5"
            className="transition-all duration-1000 ease-out"
            strokeLinecap="round"
          />
        )}

        {/* Data Circles / Tooltips */}
        {animated && points.map((p, idx) => (
          <g key={idx} className="group cursor-pointer">
            <circle
              cx={p.x}
              cy={p.y}
              r="4.5"
              fill="#FFFFFF"
              stroke="#4F46E5"
              strokeWidth="2"
              className="hover:r-6 transition-all duration-150"
            />
            {/* Tooltip Overlay */}
            <rect
              x={p.x - 16}
              y={p.y - 24}
              width="32"
              height="16"
              rx="4"
              fill="#1F2937"
              className="opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none"
            />
            <text
              x={p.x}
              y={p.y - 13}
              textAnchor="middle"
              fill="#FFFFFF"
              fontSize="9"
              fontWeight="bold"
              className="opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none"
            >
              {data[idx].value}
            </text>
            
            {/* Month labels */}
            <text
              x={p.x}
              y={height - 5}
              textAnchor="middle"
              fill="#9CA3AF"
              fontSize="9"
              fontWeight="bold"
              className="pointer-events-none"
            >
              {data[idx].label}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
};

// 4. Booking Heatmap displaying peak usage hours
export const BookingHeatmap: React.FC<{ data: ChartDataItem[] }> = ({ data }) => {
  return (
    <div className="grid grid-cols-5 gap-3.5">
      {data.map((item, idx) => {
        let intensityClass = 'bg-[#4F46E5]/10 text-[#4F46E5]';
        let badgeClass = 'bg-[#4F46E5]/5 border-[#4F46E5]/10';

        if (item.value >= 40) {
          intensityClass = 'bg-[#4F46E5] text-white shadow-md shadow-[#4F46E5]/20';
          badgeClass = 'bg-white/20 border-white/30 text-white';
        } else if (item.value >= 30) {
          intensityClass = 'bg-[#4F46E5]/80 text-white';
          badgeClass = 'bg-white/10 border-white/25 text-white';
        } else if (item.value >= 20) {
          intensityClass = 'bg-[#4F46E5]/40 text-slate-800';
          badgeClass = 'bg-[#4F46E5]/10 border-[#4F46E5]/20 text-[#4F46E5]';
        }

        return (
          <div
            key={idx}
            className={`p-3 rounded-2xl border border-slate-200/40 flex flex-col items-center justify-between text-center transition-all duration-200 hover:scale-[1.03] hover:shadow-sm ${intensityClass}`}
          >
            <span className="text-[10px] font-extrabold tracking-wide uppercase opacity-90">{item.label}</span>
            <div className="my-2.5">
              <span className="text-lg font-black">{item.value}</span>
              <p className="text-[8px] opacity-75 font-bold uppercase leading-none mt-0.5">Bookings</p>
            </div>
            <span className={`text-[8px] font-extrabold uppercase px-1.5 py-0.5 rounded-full border ${badgeClass}`}>
              {item.value >= 40 ? '🔥 Peak' : item.value >= 20 ? 'Active' : 'Quiet'}
            </span>
          </div>
        );
      })}
    </div>
  );
};
