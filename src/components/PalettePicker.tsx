import React from 'react';

interface PalettePickerProps {
    palettes: string[][];
    onSelect: (palette: string[]) => void;
    selectedIdx: number;
}

export const PalettePicker: React.FC<PalettePickerProps> = ({ palettes, onSelect, selectedIdx }) => {
    return (
        <div className="flex flex-col gap-4 animate-fade-in w-full max-w-sm mx-auto">
            <h3 className="text-xl font-clean font-medium text-neutral-600 mb-2">Select a Palette</h3>

            {palettes.map((palette, idx) => (
                <button
                    key={idx}
                    onClick={() => onSelect(palette)}
                    className={`
            p-3 rounded-2xl flex items-center justify-between transition-all duration-300
            ${selectedIdx === idx
                            ? 'bg-white shadow-[0_8px_30px_rgba(0,0,0,0.08)] scale-105 border border-neutral-100 ring-2 ring-neutral-200 ring-offset-2'
                            : 'bg-neutral-100/50 hover:bg-neutral-100 hover:scale-[1.02] border border-transparent'}
          `}
                >
                    <div className="flex -space-x-3">
                        {palette.map((color, cIdx) => (
                            <div
                                key={cIdx}
                                className="w-10 h-10 rounded-full border-2 border-white shadow-sm"
                                style={{ backgroundColor: color }}
                            />
                        ))}
                    </div>

                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${selectedIdx === idx ? 'bg-neutral-800 border-neutral-800' : 'border-neutral-300'}`}>
                        {selectedIdx === idx && (
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M20 6L9 17L4 12" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        )}
                    </div>
                </button>
            ))}
        </div>
    );
};
