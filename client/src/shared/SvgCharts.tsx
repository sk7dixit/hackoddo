import React, { useState } from 'react';

interface ChartDataItem {
  label: string;
  value: number;
  color?: string;
}

interface SvgBarChartProps {
  data: ChartDataItem[];
  height?: number;
}

export const SvgBarChart: React.FC<SvgBarChartProps> = ({ data, height = 200 }) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  if (!data || data.length === 0) {
    return <div className="text-slate-400 text-center py-8 text-xs font-semibold">No data available</div>;
  }

  const maxVal = Math.max(...data.map(d => d.value), 1);
  const chartHeight = height - 40; // Leave space for label texts

  return (
    <div className="w-full">
      <div className="flex items-end justify-between gap-4 h-[200px] px-2 relative" style={{ height: `${height}px` }}>
        {data.map((item, idx) => {
          const barHeight = (item.value / maxVal) * chartHeight;
          return (
            <div key={idx} className="flex-1 flex flex-col items-center group relative h-full justify-end">
              {/* Tooltip */}
              {hoveredIdx === idx && (
                <div className="absolute bottom-[calc(100%-85px)] mb-2 bg-white border border-slate-200 text-slate-800 text-[10px] px-2.5 py-1 rounded-lg shadow-md z-20 pointer-events-none whitespace-nowrap font-bold">
                  {item.label}: {item.value}
                </div>
              )}

              {/* Value Label above Bar */}
              <span className="text-[10px] text-slate-800 font-extrabold mb-1">
                {item.value}
              </span>

              {/* Bar */}
              <div
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
                style={{ height: `${Math.max(barHeight, 8)}px` }}
                className="w-full max-w-[28px] rounded-t-md bg-[#5B5BD6] hover:bg-[#4a4ab5] transition-all duration-200 cursor-pointer relative shadow-[0_2px_4px_rgba(91,91,214,0.1)]"
              >
                <div className="absolute inset-0 rounded-t-md opacity-0 group-hover:opacity-10 bg-white transition-opacity duration-200" />
              </div>

              {/* Label */}
              <span className="text-[10px] text-slate-500 mt-2 truncate w-full text-center font-bold group-hover:text-slate-850">
                {item.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

interface SvgDonutChartProps {
  data: ChartDataItem[];
  size?: number;
}

export const SvgDonutChart: React.FC<SvgDonutChartProps> = ({ data, size = 160 }) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const total = data.reduce((sum, item) => sum + item.value, 0);

  if (total === 0) {
    return <div className="text-slate-400 text-center py-8 text-xs font-semibold">No data available</div>;
  }

  const radius = size * 0.35;
  const strokeWidth = size * 0.12;
  const center = size / 2;
  const circumference = 2 * Math.PI * radius;

  let accumulatedAngle = 0;

  const colors = [
    '#5B5BD6', // Brand Primary
    '#22C55E', // Success Green
    '#F59E0B', // Warning Amber
    '#3b82f6', // Info Blue
    '#ec4899', // Pink
    '#EF4444', // Danger Red
    '#06b6d4', // Cyan
  ];

  return (
    <div className="flex flex-col sm:flex-row items-center gap-4 justify-center">
      {/* SVG Container */}
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="transparent"
            stroke="#f1f5f9"
            strokeWidth={strokeWidth}
          />
          {data.map((item, idx) => {
            const percentage = item.value / total;
            const strokeDashoffset = circumference - (percentage * circumference);
            const rotation = accumulatedAngle;
            accumulatedAngle += percentage * 360;

            const color = item.color || colors[idx % colors.length];
            const isHovered = hoveredIdx === idx;

            return (
              <circle
                key={idx}
                cx={center}
                cy={center}
                r={radius}
                fill="transparent"
                stroke={color}
                strokeWidth={isHovered ? strokeWidth + 2 : strokeWidth}
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                transform={`rotate(${rotation} ${center} ${center})`}
                className="transition-all duration-300 cursor-pointer"
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
              />
            );
          })}
        </svg>

        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          {hoveredIdx !== null ? (
            <>
              <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">
                {data[hoveredIdx].label}
              </span>
              <span className="text-lg font-black text-slate-800">
                {data[hoveredIdx].value}
              </span>
            </>
          ) : (
            <>
              <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">
                Total
              </span>
              <span className="text-xl font-black text-slate-850">
                {total}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Legend list */}
      <div className="flex flex-col gap-1.5 min-w-[140px]">
        {data.map((item, idx) => {
          const color = item.color || colors[idx % colors.length];
          const isHovered = hoveredIdx === idx;
          return (
            <div
              key={idx}
              className={`flex items-center gap-2 px-2 py-0.5 rounded-lg transition-all ${
                isHovered ? 'bg-slate-100' : ''
              }`}
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
            >
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
              <span className="text-xs text-slate-600 font-semibold">{item.label}</span>
              <span className="text-xs text-slate-400 font-mono font-bold ml-auto pl-2">({item.value})</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
