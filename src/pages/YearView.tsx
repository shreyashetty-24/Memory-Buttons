import React, { useState, useEffect } from 'react';
import { MemoryButtonEntry, getAllMemories, saveMemory, deleteMemory } from '../lib/db';
import { MemoryButton } from '../components/MemoryButton';
import { PushPin, Paperclip, CoffeeStain } from '../components/Decorations';

interface YearViewProps {
    onClose: () => void;
    memories: MemoryButtonEntry[];
    onRefresh?: () => void;
}

type GroupBy = 'week' | 'month' | 'year';

export const YearView: React.FC<YearViewProps> = ({ onClose, memories, onRefresh }) => {
    const [selectedMemory, setSelectedMemory] = useState<MemoryButtonEntry | null>(null);
    const [groupBy, setGroupBy] = useState<GroupBy>('month');

    // Sort descending
    const sorted = [...memories].sort((a, b) => b.date.localeCompare(a.date));

    // Grouping logic
    const groupedMemories = sorted.reduce((acc, memory) => {
        const d = new Date(memory.date);
        let key = '';

        if (groupBy === 'year') {
            key = d.getFullYear().toString();
        } else if (groupBy === 'month') {
            key = d.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
        } else {
            // Week
            const firstDayOfYear = new Date(d.getFullYear(), 0, 1);
            const pastDaysOfYear = (d.getTime() - firstDayOfYear.getTime()) / 86400000;
            const weekNum = Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
            key = `Week ${weekNum}, ${d.getFullYear()}`;
        }

        if (!acc[key]) acc[key] = [];
        acc[key].push(memory);
        return acc;
    }, {} as Record<string, MemoryButtonEntry[]>);

    if (selectedMemory) {
        return <DetailView memory={selectedMemory} onClose={() => setSelectedMemory(null)} onUpdate={(updated) => {
            // Just visually update the list item when note changes (or refetch)
            const index = memories.findIndex(m => m.date === updated.date);
            if (index !== -1) memories[index] = updated;
            if (onRefresh) onRefresh();
        }} onDelete={async () => {
            await deleteMemory(selectedMemory.date);
            setSelectedMemory(null);
            if (onRefresh) onRefresh();
        }} />;
    }

    return (
        <div className="fixed inset-0 bg-[#f4ebd8] bg-[url('https://www.transparenttextures.com/patterns/rice-paper.png')] z-50 overflow-y-auto animate-fade-in pb-20">
            <div className="sticky top-0 bg-[#f4ebd8]/90 backdrop-blur-md px-6 py-4 flex flex-col sm:flex-row justify-between items-center border-b border-[#d8cdb4] z-20 shadow-sm gap-4">
                <h1 className="text-2xl font-pixelcursive text-[#4a3f35] leading-none pt-2 drop-shadow-sm">Your Scrapbook</h1>

                {/* View Toggle */}
                <div className="flex bg-[#e8decc] p-1 rounded-xl shadow-inner border border-[#d8cdb4]">
                    {(['week', 'month', 'year'] as GroupBy[]).map((type) => (
                        <button
                            key={type}
                            onClick={() => setGroupBy(type)}
                            className={`px-4 py-1.5 rounded-lg font-clean text-sm capitalize transition-all ${groupBy === type
                                ? 'bg-white text-[#4a3f35] shadow-sm font-semibold'
                                : 'text-[#8a7a6b] hover:text-[#4a3f35] hover:bg-white/50'
                                }`}
                        >
                            {type}
                        </button>
                    ))}
                </div>

                <button
                    onClick={onClose}
                    className="w-10 h-10 rounded-full bg-white flex items-center justify-center hover:bg-neutral-100 transition-colors shadow-[0_2px_8px_rgba(0,0,0,0.1)] border border-[#e8decc] absolute sm:relative right-4 top-4 sm:right-auto sm:top-auto"
                >
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M13 1L1 13M1 1L13 13" stroke="#4a3f35" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                </button>
            </div>

            <div className="max-w-5xl mx-auto px-4 py-12">
                {sorted.length === 0 ? (
                    <div className="text-center text-[#8a7a6b] py-20 font-handwritten text-3xl opacity-60">
                        Pages are empty. Start collecting.
                    </div>
                ) : (
                    <div className="flex flex-col gap-12">
                        {Object.entries(groupedMemories).map(([groupTitle, items]) => (
                            <div key={groupTitle} className="relative bg-white/60 backdrop-blur-sm shadow-[0_4px_24px_rgba(0,0,0,0.06)] rounded-sm p-8 border border-white rotate-[-0.5deg]">
                                {/* Washi tape detail */}
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-32 h-6 bg-[#ffe2d1] opacity-60 rotate-2 shadow-sm border border-black/5" style={{ backgroundImage: 'linear-gradient(45deg, transparent 40%, rgba(255,255,255,0.4) 40%, rgba(255,255,255,0.4) 60%, transparent 60%)', backgroundSize: '10px 10px' }} />

                                <h2 className="text-2xl md:text-3xl font-handwritten text-[#5c4f42] mb-6 md:mb-8 pb-4 border-b-2 border-dashed border-[#e8decc]">{groupTitle}</h2>

                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6 justify-items-center relative">
                                    <CoffeeStain className="absolute top-0 right-0 scale-50 -translate-y-12 translate-x-12 hidden md:block" />

                                    {items.map(memory => (
                                        <div
                                            key={memory.date}
                                            className="flex flex-col items-center gap-3 group cursor-pointer w-full bg-white p-4 pb-8 shadow-md rotate-[1deg] hover:rotate-0 hover:z-10 transition-all border border-[#f0f0f0] relative"
                                            onClick={() => setSelectedMemory(memory)}
                                        >
                                            <PushPin className="absolute -top-3 left-1/2 -translate-x-1/2 z-20 scale-75" color={Math.random() > 0.5 ? '#ef4444' : '#eab308'} />
                                            <div className="w-full aspect-square bg-[#f9f9f9] border border-neutral-100 flex items-center justify-center p-4">
                                                <MemoryButton
                                                    shape={memory.shape as any}
                                                    pattern={memory.pattern as any}
                                                    palette={memory.selectedPalette}
                                                    size={100}
                                                />
                                            </div>
                                            <span className="text-lg font-handwritten text-neutral-600 block mt-2 text-center w-full">
                                                {new Date(memory.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

// Detail View Component Inline
interface DetailViewProps {
    memory: MemoryButtonEntry;
    onClose: () => void;
    onUpdate: (entry: MemoryButtonEntry) => void;
    onDelete?: () => void;
}

const DetailView: React.FC<DetailViewProps> = ({ memory, onClose, onUpdate, onDelete }) => {
    const [notes, setNotes] = useState(memory.notes || '');
    const [photoUrl, setPhotoUrl] = useState<string>('');

    useEffect(() => {
        const url = URL.createObjectURL(memory.photoBlob);
        setPhotoUrl(url);
        return () => URL.revokeObjectURL(url);
    }, [memory]);

    const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setNotes(e.target.value);
    };

    const handleNotesBlur = async () => {
        if (notes !== memory.notes) {
            const updated = { ...memory, notes };
            await saveMemory(updated);
            onUpdate(updated);
        }
    };

    const formattedDate = new Date(memory.date).toLocaleDateString(undefined, {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });

    return (
        <div className="fixed inset-0 bg-[#f4ebd8] bg-[url('https://www.transparenttextures.com/patterns/rice-paper.png')] z-50 overflow-y-auto animate-fade-in relative flex flex-col md:flex-row p-4 md:p-8 gap-8">

            {/* Back to scrapbook button */}
            <button
                onClick={onClose}
                className="fixed top-8 left-8 w-12 h-12 rounded-full bg-white shadow-md flex items-center justify-center hover:scale-110 transition-transform z-50 border border-[#e8decc]"
            >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4a3f35" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
            </button>

            {/* Delete button */}
            {onDelete && (
                <button
                    onClick={() => {
                        if (confirm('Are you sure you want to permanently discard this memory?')) {
                            onDelete();
                        }
                    }}
                    className="fixed top-8 right-8 w-12 h-12 rounded-full bg-white shadow-md flex items-center justify-center hover:scale-110 hover:border-red-300 transition-all z-50 border border-[#e8decc] group"
                    title="Delete Memory"
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-70 group-hover:opacity-100"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                </button>
            )}

            {/* Left side: Visuals (Polaroid style) */}
            <div className="w-full md:w-[45%] lg:w-[40%] min-h-[40vh] md:min-h-[50vh] flex flex-col items-center justify-center mt-16 md:mt-0">
                <div className="relative bg-white p-4 sm:p-6 pb-16 sm:pb-20 shadow-[0_20px_40px_rgba(0,0,0,0.15)] border border-neutral-100 rounded-sm rotate-[-2deg] max-w-xs sm:max-w-sm w-full">
                    {/* Tape top */}
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-24 h-8 bg-black/5 rotate-3" />

                    <div className="bg-[#f0f0f0] aspect-square flex items-center justify-center relative overflow-hidden shadow-inner border border-neutral-200">
                        <MemoryButton
                            shape={memory.shape as any}
                            pattern={memory.pattern as any}
                            palette={memory.selectedPalette}
                            size={200}
                            className="filter drop-shadow-2xl hover:scale-105 transition-transform cursor-pointer"
                        />

                        {/* Small photo overlay on bottom right inside polaroid */}
                        {photoUrl && (
                            <img src={photoUrl} alt="Original" className="absolute -bottom-4 -right-4 w-28 h-28 object-cover rounded shadow-lg border-4 border-white rotate-[-6deg] z-10 opacity-90 transition-all hover:rotate-0 hover:scale-110" />
                        )}
                    </div>

                    <p className="absolute bottom-6 left-0 right-0 text-center font-handwritten text-3xl text-neutral-600 tracking-wide">
                        {formattedDate.split(',')[0]}
                    </p>
                </div>
            </div>

            {/* Right side: Journal Paper */}
            <div className="w-full md:w-[55%] lg:w-[60%] flex flex-col bg-[#fffcfa] shadow-[0_4px_24px_rgba(0,0,0,0.08)] p-8 md:p-12 relative rounded-sm min-h-[60vh] md:min-h-full border border-[#f0eadd]">
                {/* Paper ruling lines */}
                <div className="absolute inset-x-8 top-32 bottom-12 border-t-2 border-[#e6f0fa] pointer-events-none" style={{ backgroundImage: 'linear-gradient(transparent calc(100% - 2px), #e6f0fa calc(100% - 2px))', backgroundSize: '100% 2.5rem' }}></div>

                <div className="absolute top-0 left-12 bottom-0 w-0.5 bg-red-200/50 pointer-events-none"></div>

                <div className="pl-8 pt-4 pb-8 z-10 border-b-2 border-dashed border-[#e8decc] mb-8">
                    <h2 className="text-xl font-handwritten text-neutral-400 tracking-wider mb-2">Dear Memory,</h2>
                    <h1 className="text-2xl md:text-3xl font-clean font-semibold text-[#4a3f35] leading-tight">
                        {formattedDate.split(',').slice(1).join(',')}
                    </h1>
                </div>

                <div className="flex-1 relative pl-8 z-10 pt-1">
                    <textarea
                        value={notes}
                        onChange={handleNotesChange}
                        onBlur={handleNotesBlur}
                        placeholder="Click to start writing..."
                        className="w-full h-full min-h-[200px] md:min-h-[300px] resize-none border-none outline-none font-handwritten text-3xl md:text-4xl leading-[2.5rem] tracking-wide text-[#3d3329] placeholder:text-[#c4b5a3] bg-transparent"
                        style={{ lineHeight: '2.5rem' }} // matches the background grid perfectly
                    />
                </div>

                {/* Post stamp aesthetic */}
                <div className="absolute bottom-8 right-8 w-16 h-16 border-4 border-[#c9ada7] rounded-full flex flex-col items-center justify-center opacity-40 rotate-[15deg]">
                    <span className="font-pixelcursive text-[8px] uppercase tracking-widest text-[#c9ada7] leading-tight">Distilled</span>
                    <span className="font-clean text-[10px] font-bold text-[#c9ada7] mt-1">{new Date(memory.date).getFullYear()}</span>
                </div>
            </div>
        </div>
    );
};
