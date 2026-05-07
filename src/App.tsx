import React, { useState, useEffect } from 'react';
import './index.css';
import { getTodayDateString, getMemory, getAllMemories, deleteMemory, MemoryButtonEntry } from './lib/db';
import { CreationFlow } from './pages/CreationFlow';
import { YearView } from './pages/YearView';
import { WoodenBox } from './components/WoodenBox';
import { MemoryButton } from './components/MemoryButton';
import { WashiTape, Pencil, Paperclip, Sticker, CoffeeStain, PushPin, DriedLeaf } from './components/Decorations';

type ViewState = 'menu' | 'create' | 'gallery';

const App = () => {
    const [todayMemory, setTodayMemory] = useState<MemoryButtonEntry | null>(null);
    const [allMemories, setAllMemories] = useState<MemoryButtonEntry[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentView, setCurrentView] = useState<ViewState>('menu');

    const loadData = async () => {
        try {
            const todayStr = getTodayDateString();
            const todayEntry = await getMemory(todayStr);
            if (todayEntry) {
                setTodayMemory(todayEntry);
            } else {
                setTodayMemory(null);
            }

            const memories = await getAllMemories();
            setAllMemories(memories);
        } catch (e) {
            console.error("Failed to load DB", e);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleCreationComplete = async (entry: MemoryButtonEntry) => {
        setTodayMemory(entry);
        loadData();
    };

    const handleDeleteToday = async () => {
        if (!todayMemory) return;
        if (confirm('Are you sure you want to discard this memory? You can create a new one for today.')) {
            await deleteMemory(todayMemory.date);
            setTodayMemory(null);
            loadData();
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <p className="text-sm font-clean text-neutral-400 animate-pulse">Loading collection...</p>
            </div>
        );
    }

    return (
        <div className="min-h-[100dvh] flex flex-col items-center py-8 md:py-12 px-4 md:px-8 w-full mx-auto relative bg-[#fcfaf7] bg-[url('https://www.transparenttextures.com/patterns/rice-paper.png')] overflow-hidden">

            {/* Background Scrapbook Decorations */}
            <CoffeeStain className="top-12 sm:top-24 right-4 sm:right-24 scale-75 -rotate-12" />
            <CoffeeStain className="bottom-24 left-10 scale-50 rotate-45 opacity-10" />

            <WashiTape className="top-4 left-4 sm:left-10 w-24 sm:w-32 h-8 -rotate-6" color="#ffb3ba" pattern="dots" />
            <WashiTape className="bottom-10 sm:bottom-20 right-4 sm:right-12 w-32 sm:w-40 h-10 rotate-12" color="#bae1ff" pattern="grid" />
            <WashiTape className="top-1/3 -left-4 w-20 h-6 -rotate-12" color="#baffc9" pattern="solid" />

            <Pencil className="hidden sm:block absolute top-32 -left-16 rotate-45 scale-75 opacity-70" />
            <Paperclip className="absolute top-1/4 right-8 rotate-12" />
            <Paperclip className="absolute bottom-12 left-1/3 -rotate-45 scale-75" />

            <Sticker className="absolute bottom-1/4 left-8" text="✿" />
            <Sticker className="absolute top-8 right-1/4 bg-blue-100 text-blue-500 scale-75" text="★" />
            <Sticker className="absolute top-1/2 right-12 bg-pink-100 text-pink-500 scale-50 -rotate-12" text="♥" />

            <PushPin className="absolute top-1/3 left-1/4" color="#ef4444" />
            <PushPin className="absolute bottom-1/4 right-1/4 scale-75 rotate-45" color="#3b82f6" />

            <DriedLeaf className="absolute -bottom-8 left-1/2 rotate-12" />
            <DriedLeaf className="absolute top-20 right-1/3 -rotate-45 scale-50" />

            {/* Header */}
            <header className="w-full flex justify-between items-center mb-16 animate-fade-in relative z-10">
                <div className="cursor-pointer group" onClick={() => setCurrentView('menu')}>
                    <h1 className="text-2xl md:text-3xl font-pixelcursive text-[#4a3f35] tracking-tight group-hover:scale-[1.02] transition-transform">Memory Buttons</h1>
                    <p className="text-[#a89a8c] font-clean text-sm mt-1">A daily memory in color.</p>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="w-full max-w-6xl flex-1 flex flex-col items-center justify-center min-h-[50vh] relative z-10 mx-auto">
                {currentView === 'menu' && (
                    <div className="flex flex-col items-center gap-6 md:gap-8 animate-fade-in-up w-full px-2">
                        <div className="bg-white/80 p-6 md:p-8 rounded-sm shadow-[0_4px_24px_rgba(0,0,0,0.06)] border border-[#e8decc] rotate-[1deg] hover:rotate-0 transition-all flex flex-col items-center w-full max-w-lg text-center mb-6 md:mb-8 relative mx-auto">
                            <WashiTape className="-top-4 left-1/2 -translate-x-1/2 w-24 h-6 rotate-2 shadow-sm" color="#fdfd96" pattern="solid" />
                            <h2 className="text-3xl md:text-5xl font-handwritten text-[#5c4f42] mb-4">Welcome back!</h2>
                            <p className="text-[#8a7a6b] font-clean text-sm md:text-base leading-relaxed px-2">
                                Open your scrapbook to revisit past memories, or distill a new moment into color for today or any day you missed.
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
                            <button
                                onClick={() => setCurrentView('create')}
                                className="px-8 py-4 bg-[#4a3f35] hover:bg-[#3d3329] text-white rounded-lg font-clean font-medium shadow-lg hover:-translate-y-1 transition-all flex items-center justify-center gap-2"
                            >
                                <span>+ Add a Memory</span>
                            </button>

                            <button
                                onClick={() => setCurrentView('gallery')}
                                className="px-6 md:px-8 py-4 bg-white hover:bg-neutral-50 border border-[#e8decc] text-[#4a3f35] rounded-lg font-clean font-medium shadow-sm hover:-translate-y-1 transition-all flex items-center justify-center gap-2 relative w-full sm:w-auto"
                            >
                                <span>Open Scrapbook</span>
                                {allMemories.length > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-red-400 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold shadow-sm">{allMemories.length}</span>
                                )}
                            </button>
                        </div>
                    </div>
                )}

                {currentView === 'create' && (
                    <div className="w-full relative">
                        <button onClick={() => setCurrentView('menu')} className="absolute -top-12 left-0 text-[#a89a8c] hover:text-[#4a3f35] font-clean text-sm flex items-center gap-1 transition-colors">
                            ← Back to Menu
                        </button>

                        {todayMemory && todayMemory.date === getTodayDateString() ? (
                            <div className="flex flex-col items-center justify-center animate-fade-in-up text-center bg-white/70 backdrop-blur-sm p-8 md:p-12 shadow-sm rounded-sm border border-[#e8decc] rotate-[-1deg]">
                                <span className="text-xl font-handwritten text-[#5c4f42] mb-4">You already captured today!</span>
                                <MemoryButton shape={todayMemory.shape as any} pattern={todayMemory.pattern as any} palette={todayMemory.selectedPalette} size={150} className="mb-6 drop-shadow-xl" />
                                <div className="flex flex-col sm:flex-row gap-4 items-center">
                                    <button onClick={() => setCurrentView('gallery')} className="text-sm font-clean px-4 py-2 bg-white border border-[#e8decc] rounded shadow-sm text-[#8a7a6b] hover:text-[#4a3f35] hover:bg-neutral-50 transition-colors">View in Scrapbook</button>
                                    <button onClick={handleDeleteToday} className="text-sm font-clean px-4 py-2 border border-red-200 bg-red-50 text-red-400 hover:text-red-600 hover:bg-red-100 rounded shadow-sm transition-colors">Discard Memory</button>
                                </div>
                            </div>
                        ) : (
                            <CreationFlow onComplete={(entry) => {
                                handleCreationComplete(entry);
                                setCurrentView('menu');
                            }} />
                        )}
                    </div>
                )}
            </main>

            {/* Modal/Overlay for Year View */}
            {currentView === 'gallery' && (
                <YearView memories={allMemories} onClose={() => setCurrentView('menu')} onRefresh={loadData} />
            )}
        </div>
    );
};

export default App;
