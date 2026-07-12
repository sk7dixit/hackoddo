import React, { useRef } from 'react';
import { Asset } from '../../../server/src/types';
import { X, Printer, QrCode } from 'lucide-react';
import GlassCard from './GlassCard';

interface QRCodeModalProps {
  asset: Asset | null;
  onClose: () => void;
}

export const QRCodeModal: React.FC<QRCodeModalProps> = ({ asset, onClose }) => {
  if (!asset) return null;

  // Simple deterministic pattern generator to draw a mock QR Code grid
  const generateQrGrid = (code: string) => {
    const size = 15;
    const grid: boolean[][] = Array(size).fill(null).map(() => Array(size).fill(false));
    
    // Hash code string to seed random grid
    let hash = 0;
    for (let i = 0; i < code.length; i++) {
      hash = code.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    // Fill standard QR corners (Position Detection Markers)
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
    
    fillCorner(0, 0); // Top-Left
    fillCorner(0, size - 4); // Top-Right
    fillCorner(size - 4, 0); // Bottom-Left
    
    // Fill remaining grid pseudo-randomly based on hash
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        // Skip corner regions
        if ((r < 5 && c < 5) || (r < 5 && c > size - 6) || (r > size - 6 && c < 5)) {
          continue;
        }
        // Deterministic bit calculation
        const bit = Math.abs((hash ^ (r * c * 33)) % 100) > 42;
        grid[r][c] = bit;
      }
    }
    return grid;
  };

  const qrGrid = generateQrGrid(asset.qrCode);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-fade-in">
      <GlassCard className="w-full max-w-md bg-zinc-900 border-zinc-800 shadow-2xl relative">
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-500 hover:text-zinc-300 p-1.5 hover:bg-zinc-800 rounded-lg transition-all"
        >
          <X className="w-4.5 h-4.5" />
        </button>

        {/* Modal Title */}
        <div className="flex items-center gap-2 mb-6">
          <QrCode className="w-5 h-5 text-violet-400" />
          <h3 className="font-bold text-base text-white">Generate Asset QR Tag</h3>
        </div>

        {/* Tag Canvas (This gets printed) */}
        <div className="print-qr-section bg-white text-zinc-950 p-6 rounded-xl border border-zinc-200 flex flex-col items-center justify-center text-center shadow-inner mx-auto max-w-[280px]">
          {/* Logo / Header */}
          <div className="flex items-center gap-1.5 mb-3 border-b pb-2 w-full justify-center border-zinc-200">
            <div className="w-6 h-6 rounded bg-zinc-950 flex items-center justify-center">
              <span className="font-black text-white text-[10px] tracking-wider">AF</span>
            </div>
            <span className="font-extrabold text-xs tracking-tight uppercase text-zinc-900">AssetFlow ERP</span>
          </div>

          {/* QR Code SVG */}
          <svg width="150" height="150" className="bg-white p-1" viewBox="0 0 15 15">
            {qrGrid.map((row, rIdx) => 
              row.map((active, cIdx) => 
                active ? (
                  <rect 
                    key={`${rIdx}-${cIdx}`} 
                    x={cIdx} 
                    y={rIdx} 
                    width="1.05" 
                    height="1.05" 
                    fill="black" 
                  />
                ) : null
              )
            )}
          </svg>

          {/* Asset Metadata */}
          <div className="mt-3">
            <p className="font-black text-xs tracking-wide text-zinc-900 uppercase">{asset.qrCode}</p>
            <p className="text-[10px] font-bold text-zinc-500 mt-0.5 truncate max-w-[220px]">{asset.name}</p>
            <p className="text-[8px] text-zinc-400 mt-0.5 font-mono">ID: {asset.id}</p>
          </div>
        </div>

        {/* Modal Controls */}
        <div className="mt-8 flex gap-3">
          <button 
            onClick={onClose}
            className="flex-1 btn-secondary"
          >
            Cancel
          </button>
          <button 
            onClick={handlePrint}
            className="flex-1 btn-primary flex items-center justify-center gap-2"
          >
            <Printer className="w-4 h-4" />
            <span>Print Label</span>
          </button>
        </div>
      </GlassCard>
    </div>
  );
};

export default QRCodeModal;
