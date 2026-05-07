import React, { useState, useEffect } from 'react';
import { MemoryButtonEntry, getTodayDateString, saveMemory } from '../lib/db';
import { extractPalettes } from '../lib/colors';
import { SHAPES, PATTERNS, ShapeType, PatternType } from '../lib/shapes';
import { PhotoUpload } from '../components/PhotoUpload';
import { PalettePicker } from '../components/PalettePicker';
import { MemoryButton } from '../components/MemoryButton';

interface CreationFlowProps {
    onComplete: (entry: MemoryButtonEntry) => void;
}

export const CreationFlow: React.FC<CreationFlowProps> = ({ onComplete }) => {
    const [photo, setPhoto] = useState<Blob | null>(null);
    const [palettes, setPalettes] = useState<string[][]>([]);
    const [selectedPaletteIdx, setSelectedPaletteIdx] = useState<number>(0);
    const [isProcessing, setIsProcessing] = useState(false);
    const [shape, setShape] = useState<ShapeType>('circle');
    const [pattern, setPattern] = useState<PatternType>('solid');
    const [selectedDate, setSelectedDate] = useState(getTodayDateString());

    const handlePhotoUploaded = async (file: Blob) => {
        setPhoto(file);
        setIsProcessing(true);

        // Choose random shape and pattern
        const randomShape = SHAPES[Math.floor(Math.random() * SHAPES.length)];
        const randomPattern = PATTERNS[Math.floor(Math.random() * PATTERNS.length)];
        setShape(randomShape);
        setPattern(randomPattern);

        try {
            const extracted = await extractPalettes(file);
            setPalettes(extracted);
        } catch (e) {
            console.error('Failed to extract palettes', e);
            // Fallback palette
            setPalettes([['#e5e7eb', '#9ca3af', '#4b5563']]);
        }

        setIsProcessing(false);
    };

    const handleSave = async () => {
        if (!photo || palettes.length === 0) return;

        const entry: MemoryButtonEntry = {
            date: selectedDate,
            photoBlob: photo,
            palettes: palettes,
            selectedPalette: palettes[selectedPaletteIdx],
            shape,
            pattern,
            notes: ''
        };

        await saveMemory(entry);
        onComplete(entry);
    };

    if (isProcessing) {
        return (
            <div className="flex flex-col items-center justify-center animate-pulse">
                <div className="w-16 h-16 rounded-full border-4 border-neutral-200 border-t-neutral-800 animate-spin mb-4" />
                <p className="text-sm font-clean text-neutral-500">Distilling colors...</p>
            </div>
        );
    }

    if (palettes.length > 0 && photo) {
        return (
            <div className="flex flex-col items-center w-full max-w-2xl mx-auto gap-8 animate-fade-in-up">
                <h2 className="text-2xl font-clean font-semibold text-neutral-800 text-center">Your Memory Button</h2>

                <div className="bg-white p-12 rounded-[3xl] shadow-[0_8px_40px_rgba(0,0,0,0.04)] ring-1 ring-neutral-100 flex items-center justify-center w-64 h-64 mx-auto shrink-0 transition-all">
                    <MemoryButton
                        shape={shape}
                        pattern={pattern}
                        palette={palettes[selectedPaletteIdx]}
                        size={180}
                    />
                </div>

                <div className="w-full">
                    <PalettePicker
                        palettes={palettes}
                        onSelect={(p) => setSelectedPaletteIdx(palettes.indexOf(p))}
                        selectedIdx={selectedPaletteIdx}
                    />
                </div>

                <div className="w-full flex flex-col gap-6 mt-2 pb-4">
                    <div className="flex flex-col items-center">
                        <span className="text-[10px] uppercase tracking-widest text-[#a89a8c] font-clean font-bold mb-3">Shape</span>
                        <div className="flex flex-wrap gap-2 justify-center">
                            {SHAPES.map(s => (
                                <button
                                    key={s}
                                    onClick={() => setShape(s)}
                                    className={`px-4 py-1.5 text-xs font-clean rounded-full transition-all capitalize border shadow-sm ${shape === s ? 'bg-[#5c4f42] text-white border-[#5c4f42] scale-105' : 'bg-white text-[#8a7a6b] border-[#e8decc] hover:border-[#c4b5a3] hover:bg-[#faf8f5]'}`}
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex flex-col items-center">
                        <span className="text-[10px] uppercase tracking-widest text-[#a89a8c] font-clean font-bold mb-3">Pattern</span>
                        <div className="flex flex-wrap gap-2 justify-center">
                            {PATTERNS.map(p => (
                                <button
                                    key={p}
                                    onClick={() => setPattern(p)}
                                    className={`px-4 py-1.5 text-xs font-clean rounded-full transition-all capitalize border shadow-sm ${pattern === p ? 'bg-[#5c4f42] text-white border-[#5c4f42] scale-105' : 'bg-white text-[#8a7a6b] border-[#e8decc] hover:border-[#c4b5a3] hover:bg-[#faf8f5]'}`}
                                >
                                    {p}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <button
                    onClick={handleSave}
                    className="mt-6 px-8 py-4 bg-neutral-800 hover:bg-neutral-900 text-white rounded-full font-clean font-medium transition-transform hover:scale-105 shadow-xl shadow-neutral-800/20 active:scale-95"
                >
                    Keep this Memory
                </button>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center gap-6 w-full animate-fade-in-up">
            <label className="flex flex-col items-center text-sm font-clean text-[#8a7a6b]">
                <span className="mb-2 uppercase tracking-widest text-[#a89a8c] font-bold text-[10px]">Select Date</span>
                <input
                    type="date"
                    value={selectedDate}
                    max={getTodayDateString()}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="bg-white/60 border border-[#e8decc] rounded-lg px-4 py-2 font-clean text-[#5c4f42] focus:outline-none focus:ring-2 focus:ring-[#d8cdb4] shadow-sm"
                />
            </label>
            <PhotoUpload onPhotoUploaded={handlePhotoUploaded} />
        </div>
    );
};
