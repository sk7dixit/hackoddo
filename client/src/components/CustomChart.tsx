import React, { useState } from 'react';

interface ChartDataItem {
  label: string;
  value: number;
  color?: string;
}

interface SvgBarChartProps {
  data: ChartDataItem[];
  height?: number;
  colorClass?: string;
}

export const SvgBarChart: React.FC<SvgBarChartProps> = ({ 
  data, 
  height = 200, 
  colorClass = 'from-violet-500 to-indigo-600' 
}) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  
  if (!data || data.length === 0) {
    return <div className="text-zinc-500 text-center py-8 text-sm">No data available</div>;
  }

  const maxVal = Math.max(...data.map(d => d.value), 1);
  const chartHeight = height - 40; // reserve space for text labels
  
  return (
    <div className="w-full">
      <div className="flex items-end justify-between gap-3 h-[200px] px-2 relative" style={{ height: `${height}px` }}>
        {data.map((item, idx) => {
          const barHeight = (item.value / maxVal) * chartHeight;
          return (
            <div key={idx} className="flex-1 flex flex-col items-center group relative h-full justify-end">
              {/* Tooltip */}
              {hoveredIdx === idx && (
                <div className="absolute bottom-[calc(100%-80px)] mb-2 bg-zinc-900 border border-zinc-700 text-zinc-100 text-xs px-2.5 py-1.5 rounded-lg shadow-xl z-20 animate-fade-in pointer-events-none whitespace-nowrap">
                  <span className="font-bold">{item.label}</span>: {item.value}
                </div>
              )}
              
              {/* Bar */}
              <div 
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
                style={{ height: `${Math.max(barHeight, 8)}px` }}
                className={`w-full max-w-[40px] rounded-t-lg bg-gradient-to-t ${colorClass} transition-all duration-300 group-hover:brightness-125 cursor-pointer relative shadow-[0_4px_12px_rgba(139,92,246,0.1)]`}
              >
                {/* Glow layer */}
                <div className="absolute inset-0 rounded-t-lg opacity-0 group-hover:opacity-30 bg-white transition-opacity duration-300" />
              </div>
              
              {/* Label */}
              <span className="text-[10px] text-zinc-500 mt-2 truncate w-full text-center font-medium group-hover:text-zinc-300">
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

export const SvgDonutChart: React.FC<SvgDonutChartProps> = ({ data, size = 180 }) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  
  const total = data.reduce((sum, item) => sum + item.value, 0);
  
  if (total === 0) {
    return <div className="text-zinc-500 text-center py-8 text-sm">No data available</div>;
  }

  const radius = size * 0.35;
  const strokeWidth = size * 0.12;
  const center = size / 2;
  const circumference = 2 * Math.PI * radius;
  
  let accumulatedAngle = 0;

  // Curated color list
  const colors = [
    '#8b5cf6', // violet
    '#10b981', // emerald
    '#f59e0b', // amber
    '#ec4899', // pink
    '#3b82f6', // blue
    '#f43f5e', // rose
    '#06b6d4', // cyan
  ];

  return (
    <div className="flex flex-col sm:flex-row items-center gap-6 justify-center">
      {/* SVG Donut */}
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="transparent"
            stroke="#18181b"
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
                strokeWidth={isHovered ? strokeWidth + 3 : strokeWidth}
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
        
        {/* Core Center Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          {hoveredIdx !== null ? (
            <>
              <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">
                {data[hoveredIdx].label}
              </span>
              <span className="text-xl font-bold text-white">
                {data[hoveredIdx].value}
              </span>
              <span className="text-[9px] text-zinc-500">
                {((data[hoveredIdx].value / total) * 100).toFixed(0)}%
              </span>
            </>
          ) : (
            <>
              <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">
                Total Assets
              </span>
              <span className="text-2xl font-bold text-white">
                {total}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-col gap-2">
        {data.map((item, idx) => {
          const color = item.color || colors[idx % colors.length];
          const isHovered = hoveredIdx === idx;
          return (
            <div 
              key={idx} 
              className={`flex items-center gap-2 px-2 py-1 rounded-lg transition-all ${
                isHovered ? 'bg-zinc-900/60' : ''
              }`}
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
            >
              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
              <span className="text-xs text-zinc-400 font-medium">{item.label}</span>
              <span className="text-xs text-zinc-500 font-mono ml-auto">({item.value})</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
