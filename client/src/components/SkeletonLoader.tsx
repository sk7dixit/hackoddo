import React from 'react';

export const CardSkeleton: React.FC = () => {
  return (
    <div className="glass-card border-zinc-800/40 p-5 space-y-4 animate-pulse">
      <div className="flex justify-between items-center">
        <div className="h-2.5 bg-zinc-850 rounded-full w-24" />
        <div className="h-4 bg-zinc-850 rounded w-12" />
      </div>
      <div className="space-y-2">
        <div className="h-3 bg-zinc-800 rounded w-full" />
        <div className="h-3 bg-zinc-800 rounded w-5/6" />
      </div>
      <div className="h-8 bg-zinc-850 rounded-xl w-full pt-1" />
    </div>
  );
};

interface TableSkeletonProps {
  rows?: number;
  cols?: number;
}

export const TableSkeleton: React.FC<TableSkeletonProps> = ({ rows = 5, cols = 5 }) => {
  return (
    <div className="w-full space-y-4 animate-pulse">
      <div className="flex gap-4 pb-3 border-b border-zinc-850">
        {Array(cols).fill(null).map((_, i) => (
          <div key={i} className="h-3 bg-zinc-850 rounded-full flex-1" />
        ))}
      </div>
      <div className="space-y-4">
        {Array(rows).fill(null).map((_, r) => (
          <div key={r} className="flex gap-4 items-center py-1">
            {Array(cols).fill(null).map((_, c) => (
              <div key={c} className="h-2.5 bg-zinc-800 rounded-full flex-1" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
