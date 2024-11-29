import React, { useRef } from 'react';
import { ImagePlus } from 'lucide-react';

interface ImageUploadProps {
  onImageSelect: (base64Image: string) => void;
  disabled: boolean;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ onImageSelect, disabled }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        onImageSelect(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="w-full flex justify-center">
      <div className="relative">
        <input
          type="file"
          ref={inputRef}
          onChange={handleImageChange}
          accept="image/*"
          className="hidden"
          disabled={disabled}
        />
        <button
          onClick={() => inputRef.current?.click()}
          disabled={disabled}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ImagePlus className="w-5 h-5" />
          Upload Image
        </button>
      </div>
    </div>
  );
};