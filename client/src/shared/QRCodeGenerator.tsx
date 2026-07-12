import React from 'react';

interface QRCodeGeneratorProps {
  value: string; // The asset ID or QR code text, e.g. "AF-0012"
  name?: string;
  size?: number;
}

export const QRCodeGenerator: React.FC<QRCodeGeneratorProps> = ({ 
  value, 
  name = '', 
  size = 140 
}) => {
  
  // Hash the value string to generate a unique grid layout
  const generateGrid = (code: string) => {
    const gridSize = 15;
    const grid: boolean[][] = Array(gridSize).fill(null).map(() => Array(gridSize).fill(false));
    
    let hash = 0;
    for (let i = 0; i < code.length; i++) {
      hash = code.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    // Draw QR Code Position Detection Corners (4x4 filled targets)
    const fillCorner = (r: number, c: number) => {
      for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
          const border = (i === 0 || i === 3 || j === 0 || j === 3);
          const center = (i === 1 && j === 1) || (i === 1 && j === 2) || (i === 2 && j === 1) || (i === 2 && j === 2);
          if (border || center) {
            grid[r + i][c + j] = true;
          }
        }
      }
    };
    
    fillCorner(0, 0); // Top-left
    fillCorner(0, gridSize - 4); // Top-right
    fillCorner(gridSize - 4, 0); // Bottom-left
    
    // Fill the rest of the grid pseudo-randomly
    for (let r = 0; r < gridSize; r++) {
      for (let c = 0; c < gridSize; c++) {
        // Skip corner areas
        if ((r < 5 && c < 5) || (r < 5 && c > gridSize - 6) || (r > gridSize - 6 && c < 5)) {
          continue;
        }
        const bit = Math.abs((hash ^ (r * c * 33)) % 100) > 40;
        grid[r][c] = bit;
      }
    }
    return grid;
  };

  const grid = generateGrid(value);

  return (
    <div className="print-qr-section bg-white text-zinc-950 p-4 rounded-xl border border-zinc-200 flex flex-col items-center justify-center text-center shadow-inner mx-auto max-w-[200px]">
      {/* Brand Label */}
      <div className="flex items-center gap-1 mb-2 border-b pb-1.5 w-full justify-center border-zinc-200">
        <div className="w-4 h-4 rounded bg-zinc-950 flex items-center justify-center">
          <span className="font-black text-white text-[8px] tracking-wider">AF</span>
        </div>
        <span className="font-extrabold text-[9px] tracking-tight uppercase text-zinc-900">AssetFlow Tag</span>
      </div>

      {/* SVG QR GRID */}
      <svg width={size} height={size} className="bg-white p-0.5" viewBox="0 0 15 15">
        {grid.map((row, rIdx) => 
          row.map((active, cIdx) => 
            active ? (
              <rect 
                key={`${rIdx}-${cIdx}`} 
                x={cIdx} 
                y={rIdx} 
                width="1.02" 
                height="1.02" 
                fill="black" 
              />
            ) : null
          )
        )}
      </svg>

      {/* Tag Metadata */}
      <div className="mt-2">
        <p className="font-black text-[10px] tracking-wider text-zinc-900 uppercase">{value}</p>
        {name && <p className="text-[8px] font-bold text-zinc-400 truncate max-w-[170px] mt-0.5">{name}</p>}
      </div>
    </div>
  );
};

export default QRCodeGenerator;
