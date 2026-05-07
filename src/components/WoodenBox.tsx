import React from 'react';

interface WoodenBoxProps {
    isOpen: boolean;
    onClick: () => void;
    count: number;
}

export const WoodenBox: React.FC<WoodenBoxProps> = ({ isOpen, onClick, count }) => {
    return (
        <button
            onClick={onClick}
            className={`
        relative group transition-all duration-700 ease-out preserve-3d
        w-24 h-24 sm:w-32 sm:h-32 mx-auto focus:outline-none
        ${isOpen ? 'scale-110 opacity-0 pointer-events-none' : 'scale-100 opacity-100 hover:scale-[1.05]'}
      `}
            style={{ perspective: '1000px' }}
        >
            {/* Box Base (Shadow/Bottom) */}
            <div className="absolute inset-x-2 bottom-0 h-4 bg-neutral-300 rounded-full blur-md opacity-60 transition-opacity group-hover:opacity-80"></div>

            {/* Box body */}
            <div className="absolute inset-0 bg-[#e6ddcf] rounded-xl shadow-[inset_0_-8px_16px_rgba(0,0,0,0.06),_0_8px_32px_rgba(150,140,120,0.2)] flex items-center justify-center border border-[#d4c8b6] overflow-hidden">
                {/* Subtle wood grain texture placeholder */}
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-neutral-400 via-transparent to-transparent"></div>

                {/* Box label/badge */}
                <div className="relative bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm border border-white/40">
                    <span className="font-pixelcursive text-[10px] text-neutral-600 tracking-wider">
                        {count} BUTTON{count !== 1 ? 'S' : ''}
                    </span>
                </div>
            </div>

            {/* Box Lid - Animates open when clicked */}
            <div className="absolute inset-0 bg-[#f0e8db] rounded-xl shadow-[0_-2px_4px_rgba(255,255,255,0.8)_inset,_0_4px_12px_rgba(0,0,0,0.08)] border border-[#e8dfcf] origin-top transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:-rotate-x-12">
                {/* Lid texture */}
            </div>

            {/* Instructions tag */}
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="text-xs font-handwritten text-neutral-500">open collection</span>
            </div>
        </button>
    );
}
