import { openDB, DBSchema, IDBPDatabase } from 'idb';

export interface MemoryButtonEntry {
    date: string; // YYYY-MM-DD
    photoBlob: Blob;
    palettes: string[][]; // Array of hex color palettes
    selectedPalette: string[]; // Final selected palette
    shape: string;
    pattern: string;
    notes: string;
}

interface MemoryDB extends DBSchema {
    memory_buttons: {
        key: string;
        value: MemoryButtonEntry;
    };
}

let dbPromise: Promise<IDBPDatabase<MemoryDB>> | null = null;

export const initDB = () => {
    if (!dbPromise) {
        dbPromise = openDB<MemoryDB>('memory_buttons_db', 1, {
            upgrade(db) {
                db.createObjectStore('memory_buttons', { keyPath: 'date' });
            },
        });
    }
    return dbPromise;
};

export const saveMemory = async (entry: MemoryButtonEntry) => {
    const db = await initDB();
    await db.put('memory_buttons', entry);
};

export const getMemory = async (date: string): Promise<MemoryButtonEntry | undefined> => {
    const db = await initDB();
    return db.get('memory_buttons', date);
};

export const getAllMemories = async (): Promise<MemoryButtonEntry[]> => {
    const db = await initDB();
    return db.getAll('memory_buttons');
};

export const deleteMemory = async (date: string): Promise<void> => {
    const db = await initDB();
    await db.delete('memory_buttons', date);
};

export const getTodayDateString = (): string => {
    const date = new Date();
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};
