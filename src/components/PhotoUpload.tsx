import React, { useRef } from 'react';
import { UploadCloud } from 'lucide-react';

interface PhotoUploadProps {
    onPhotoUploaded: (file: Blob) => void;
}

export const PhotoUpload: React.FC<PhotoUploadProps> = ({ onPhotoUploaded }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            onPhotoUploaded(e.target.files[0]);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center p-6 sm:p-8 bg-white rounded-[2.5rem] shadow-[0_4px_40px_rgba(0,0,0,0.06)] max-w-sm w-full mx-auto animate-fade-in-up">
            <div
                className="w-32 h-32 rounded-full bg-neutral-50 flex flex-col items-center justify-center cursor-pointer border-2 border-dashed border-neutral-200 hover:border-neutral-400 hover:bg-neutral-100 transition-colors mb-6 group"
                onClick={() => fileInputRef.current?.click()}
            >
                <UploadCloud className="w-8 h-8 text-neutral-300 group-hover:text-neutral-500 transition-colors mb-2" />
                <span className="text-xs font-clean font-medium text-neutral-400 group-hover:text-neutral-600">Tap to upload</span>
            </div>

            <h2 className="text-xl font-clean font-semibold text-neutral-800 mb-2 text-center">Capture Today</h2>
            <p className="text-sm font-handwritten text-neutral-500 text-center max-w-[200px]">
                Upload a single photo to distill your day into color.
            </p>

            <input
                type="file"
                accept="image/*"
                className="hidden"
                ref={fileInputRef}
                onChange={handleFileChange}
            />
        </div>
    );
};
