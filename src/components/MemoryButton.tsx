import React from 'react';
import { ShapeType, PatternType, getShapePath, getHolesDefinition } from '../lib/shapes';

interface MemoryButtonProps {
    shape: ShapeType;
    pattern: PatternType;
    palette: string[]; // At least 2 colors: Primary UI, shadow, highlights, etc.
    size?: number;
    className?: string;
    onClick?: () => void;
}

export const MemoryButton: React.FC<MemoryButtonProps> = ({
    shape,
    pattern,
    palette,
    size = 100,
    className = '',
    onClick
}) => {
    const pathData = getShapePath(shape);
    const holesData = getHolesDefinition();

    // Create safe fallback colors if palette is malformed
    const dominantColor = palette[0] || '#e5e5e5';
    const secondaryColor = palette[1] || '#ccc';
    const accent1 = palette[2] || dominantColor;

    // Generate an ID for the gradient and pattern to avoid collisions
    const uniqueId = React.useId().replace(/:/g, '');

    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 100 100"
            className={`transition-transform duration-300 hover:scale-105 filter drop-shadow-xl ${onClick ? 'cursor-pointer' : ''} ${className}`}
            onClick={onClick}
            xmlns="http://www.w3.org/2000/svg"
        >
            <defs>
                {/* Soft Shadow Filter for the button edges */}
                <filter id={`shadow-${uniqueId}`} x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="8" stdDeviation="6" floodColor={secondaryColor} floodOpacity="0.4" />
                    <feDropShadow dx="0" dy="-2" stdDeviation="2" floodColor="#ffffff" floodOpacity="0.5" />
                </filter>

                {/* Base Gradient */}
                <linearGradient id={`grad-${uniqueId}`} x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor={dominantColor} />
                    <stop offset="70%" stopColor={accent1} />
                    <stop offset="100%" stopColor={secondaryColor} />
                </linearGradient>

                {/* Patterns */}
                <pattern id={`pattern-stripes-${uniqueId}`} width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                    <rect width="5" height="10" fill="rgba(255,255,255,0.15)" />
                </pattern>

                <filter id={`pattern-grain-${uniqueId}`} x="-20%" y="-20%" width="140%" height="140%">
                    <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch" result="noise" />
                    <feColorMatrix type="matrix" values="1 0 0 0 0, 0 1 0 0 0, 0 0 1 0 0, 0 0 0 0.15 0" in="noise" result="coloredNoise" />
                    <feBlend in="coloredNoise" in2="SourceGraphic" mode="multiply" result="blended" />
                    {/* Mask the final blended output to the SourceAlpha */}
                    <feComposite in="blended" in2="SourceAlpha" operator="in" />
                </filter>

                <filter id={`pattern-noise-${uniqueId}`} x="-20%" y="-20%" width="140%" height="140%">
                    <feTurbulence type="turbulence" baseFrequency="0.05" numOctaves="2" result="turbulence" />
                    <feColorMatrix type="matrix" values="1 0 0 0 0, 0 1 0 0 0, 0 0 1 0 0, 0 0 0 0.2 0" result="coloredTurbulence" />
                    <feBlend in="coloredTurbulence" in2="SourceGraphic" mode="overlay" result="blended" />
                    <feComposite in="blended" in2="SourceAlpha" operator="in" />
                </filter>
            </defs>

            {/* Button Base */}
            <path
                d={pathData}
                fill={pattern === 'solid' ? dominantColor : `url(#grad-${uniqueId})`}
                stroke={dominantColor}
                strokeWidth="10"
                strokeLinejoin="round"
                filter={`url(#shadow-${uniqueId})`}
            />

            {/* Pattern Overlay */}
            {pattern === 'stripes' && (
                <path d={pathData} fill={`url(#pattern-stripes-${uniqueId})`} stroke={`url(#pattern-stripes-${uniqueId})`} strokeWidth="10" strokeLinejoin="round" />
            )}

            {pattern === 'grain' && (
                <path d={pathData} fill={dominantColor} filter={`url(#pattern-grain-${uniqueId})`} opacity={0.5} stroke={dominantColor} strokeWidth="10" strokeLinejoin="round" />
            )}

            {pattern === 'noise' && (
                <path d={pathData} fill="white" filter={`url(#pattern-noise-${uniqueId})`} opacity={0.3} style={{ mixBlendMode: 'overlay' }} stroke="white" strokeWidth="10" strokeLinejoin="round" />
            )}

            {/* Button Holes + Inner depth */}
            <g dangerouslySetInnerHTML={{ __html: holesData }} />

            {/* Light Reflection (Gloss/Highlight) */}
            <path
                d={pathData}
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                opacity="0.2"
                transform="scale(0.9) translate(5, 5)"
            />
        </svg>
    );
};
