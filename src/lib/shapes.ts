// Button shape definitions keeping 4 button holes and borders.

export type ShapeType = 'circle' | 'square' | 'pill' | 'blob' | 'star' | 'apple' | 'heart';
export type PatternType = 'grain' | 'gradient' | 'stripes' | 'noise' | 'solid';

export const SHAPES: ShapeType[] = ['circle', 'square', 'pill', 'blob', 'star', 'apple', 'heart'];
export const PATTERNS: PatternType[] = ['grain', 'gradient', 'stripes', 'noise', 'solid'];

// Helpers to get path definitions for a viewBox of 100x100
export const getShapePath = (shape: ShapeType): string => {
    switch (shape) {
        case 'circle':
            return 'M 50,20 A 30,30 0 1,0 50,80 A 30,30 0 1,0 50,20 Z';
        case 'square': // Soft rounded square
            return 'M 30 20 H 70 Q 80 20 80 30 V 70 Q 80 80 70 80 H 30 Q 20 80 20 70 V 30 Q 20 20 30 20 Z';
        case 'pill': // Tall pill
            return 'M 35 15 H 65 A 15 15 0 0 1 80 30 V 70 A 15 15 0 0 1 65 85 H 35 A 15 15 0 0 1 20 70 V 30 A 15 15 0 0 1 35 15 Z';
        case 'blob': // Gentle organic shape centered inside 20-80
            return 'M 50 20 C 70 15, 80 30, 80 50 C 80 75, 65 80, 45 80 C 20 80, 15 70, 20 45 C 25 20, 35 25, 50 20 Z';
        case 'star': // Big chunky star
            return 'M 50 10 L 61 34 L 88 38 L 68 56 L 75 85 L 50 70 L 25 85 L 32 56 L 12 38 L 39 34 Z';
        case 'apple': // Centered cute apple
            return 'M 50 25 C 60 15, 75 15, 80 35 C 85 60, 75 80, 50 78 C 25 80, 15 60, 20 35 C 25 15, 40 15, 50 25 Z';
        case 'heart': // Centered uniform heart
            return 'M 50 35 C 50 35, 45 15, 25 15 C 5 15, 10 45, 25 60 L 50 82 L 75 60 C 90 45, 95 15, 75 15 C 55 15, 50 35, 50 35 Z';
        default:
            return 'M 30 20 H 70 Q 80 20 80 30 V 70 Q 80 80 70 80 H 30 Q 20 80 20 70 V 30 Q 20 20 30 20 Z';
    }
};

export const getHolesDefinition = () => {
    // 4 standard button holes
    return `
    <circle cx="40" cy="40" r="5" fill="#333" opacity="0.6" />
    <circle cx="60" cy="40" r="5" fill="#333" opacity="0.6" />
    <circle cx="40" cy="60" r="5" fill="#333" opacity="0.6" />
    <circle cx="60" cy="60" r="5" fill="#333" opacity="0.6" />
  `;
};
