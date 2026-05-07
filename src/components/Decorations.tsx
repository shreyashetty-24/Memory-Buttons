import React from 'react';

// A collection of decorative CSS/SVG stationary items

export const WashiTape: React.FC<{
    className?: string;
    color?: string;
    pattern?: string; // 'plaid', 'dots', 'grid'
}> = ({ className = '', color = '#ffcccb', pattern = 'dots' }) => {
    let bgStyle = {};
    if (pattern === 'dots') {
        bgStyle = {
            backgroundColor: color,
            backgroundImage: 'radial-gradient(rgba(255,255,255,0.4) 20%, transparent 20%)',
            backgroundSize: '10px 10px'
        };
    } else if (pattern === 'grid') {
        bgStyle = {
            backgroundColor: color,
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)',
            backgroundSize: '10px 10px'
        };
    } else {
        bgStyle = { backgroundColor: color };
    }

    return (
        <div
            className={`absolute opacity-80 mix-blend-multiply shadow-sm z-10 ${className}`}
            style={{
                ...bgStyle,
                clipPath: 'polygon(0 5%, 5% 0, 95% 2%, 100% 10%, 98% 90%, 90% 100%, 5% 95%, 0 90%)',
            }}
        />
    );
};

export const Pencil: React.FC<{ className?: string }> = ({ className = '' }) => (
    <div className={`absolute pointer-events-none drop-shadow-xl z-20 ${className}`}>
        <svg width="150" height="20" viewBox="0 0 150 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Eraser */}
            <path d="M0 5C0 2.23858 2.23858 0 5 0H15V20H5C2.23858 20 0 17.7614 0 15V5Z" fill="#F4a261" />
            {/* Metal band */}
            <rect x="15" y="0" width="10" height="20" fill="#E0E0E0" />
            <rect x="17" y="0" width="2" height="20" fill="#BDBDBD" />
            <rect x="21" y="0" width="2" height="20" fill="#BDBDBD" />
            {/* Wood body */}
            <path d="M25 0H120L150 10L120 20H25V0Z" fill="#F4CE14" />
            <path d="M25 5H125L150 10L125 15H25V5Z" fill="#d9b611" />
            {/* Lead tip */}
            <path d="M140 6.666L150 10L140 13.333V6.666Z" fill="#333333" />
        </svg>
    </div>
);

export const Paperclip: React.FC<{ className?: string }> = ({ className = '' }) => (
    <div className={`absolute pointer-events-none drop-shadow-md z-30 ${className}`}>
        <svg width="24" height="60" viewBox="0 0 24 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C6.47715 2 2 6.47715 2 12V45C2 51.6274 7.37258 57 14 57C20.6274 57 26 51.6274 26 45V15" stroke="#9ca3af" strokeWidth="4" strokeLinecap="round" />
            <path d="M22 15V40C22 44.4183 18.4183 48 14 48C9.58172 48 6 44.4183 6 40V12C6 8.68629 8.68629 6 12 6C15.3137 6 18 8.68629 18 12V35" stroke="#9ca3af" strokeWidth="4" strokeLinecap="round" />
        </svg>
    </div>
);

export const Sticker: React.FC<{ className?: string, text?: string }> = ({ className = '', text = '★' }) => (
    <div className={`absolute pointer-events-none z-20 flex items-center justify-center font-bold font-handwritten text-xl text-yellow-600 bg-yellow-100 rounded-full w-12 h-12 shadow-sm border-2 border-white rotate-12 ${className}`}>
        {text}
    </div>
);

export const CoffeeStain: React.FC<{ className?: string }> = ({ className = '' }) => (
    <div className={`absolute pointer-events-none z-0 mix-blend-multiply opacity-[0.15] ${className}`}>
        <svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M100 20C120 18 140 25 155 40C170 55 180 75 182 95C184 115 178 135 165 150C150 165 130 178 110 180C90 182 70 175 55 160C40 145 28 125 25 105C22 85 28 65 40 50C55 35 75 22 100 20Z" fill="#5C4F42" opacity="0.4" />
            <path d="M100 25C118 23 135 30 148 43C162 56 172 74 174 92C176 110 170 128 158 142C145 156 127 168 109 170C90 172 72 165 59 152C45 138 35 120 32 102C30 84 35 66 46 52C59 39 77 27 100 25Z" fill="white" />
            <path d="M100 30C116 28 131 35 142 47C154 59 164 75 166 90C168 106 162 122 151 134C139 146 122 158 106 160C90 162 74 155 62 143C50 131 41 115 39 99C37 83 42 67 52 55C64 43 79 32 100 30Z" fill="#5C4F42" opacity="0.6" />
            {/* Some splatter drops */}
            <circle cx="160" cy="30" r="5" fill="#5C4F42" opacity="0.5" />
            <circle cx="180" cy="50" r="3" fill="#5C4F42" opacity="0.4" />
            <circle cx="40" cy="160" r="4" fill="#5C4F42" opacity="0.6" />
            <circle cx="20" cy="140" r="2" fill="#5C4F42" opacity="0.5" />
        </svg>
    </div>
);

export const PushPin: React.FC<{ className?: string, color?: string }> = ({ className = '', color = '#ef4444' }) => (
    <div className={`absolute pointer-events-none drop-shadow-md z-30 ${className}`}>
        <svg width="24" height="40" viewBox="0 0 24 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 20L12 36" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" />
            <path d="M6 14C6 10 8 6 12 6C16 6 18 10 18 14H20C21.1046 14 22 14.8954 22 16V18C22 19.1046 21.1046 20 20 20H4C2.89543 20 2 19.1046 2 18V16C2 14.8954 2.89543 14 4 14H6Z" fill={color} />
            <circle cx="12" cy="6" r="4" fill={color} />
            {/* Highlight */}
            <path d="M10 8C10 6.89543 10.8954 6 12 6" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
        </svg>
    </div>
);

export const DriedLeaf: React.FC<{ className?: string }> = ({ className = '' }) => (
    <div className={`absolute pointer-events-none drop-shadow-sm opacity-60 mix-blend-multiply z-10 ${className}`}>
        <svg width="60" height="100" viewBox="0 0 60 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M30 10C50 30 60 50 30 90C0 50 10 30 30 10Z" fill="#a89a8c" />
            <path d="M30 10C50 30 60 50 30 90C0 50 10 30 30 10Z" stroke="#8a7a6b" strokeWidth="1" />
            <path d="M30 10V90" stroke="#8a7a6b" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M30 30L45 20" stroke="#8a7a6b" strokeWidth="1" />
            <path d="M30 40L15 30" stroke="#8a7a6b" strokeWidth="1" />
            <path d="M30 50L40 40" stroke="#8a7a6b" strokeWidth="1" />
            <path d="M30 60L20 50" stroke="#8a7a6b" strokeWidth="1" />
            <path d="M30 70L35 65" stroke="#8a7a6b" strokeWidth="1" />
        </svg>
    </div>
);
