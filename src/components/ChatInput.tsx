import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { ImageUpload } from './ImageUpload';

interface ChatInputProps {
  onSendMessage: (message: string, image?: string) => void;
  disabled: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, disabled }) => {
  const [input, setInput] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | undefined>();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onSendMessage(input, selectedImage);
      setInput('');
      setSelectedImage(undefined);
    }
  };

  const handleImageSelect = (base64Image: string) => {
    setSelectedImage(base64Image);
  };

  return (
    <div className="space-y-2">
      {selectedImage && (
        <div className="relative inline-block">
          <img src={selectedImage} alt="Preview" className="max-h-32 rounded-lg" />
          <button
            onClick={() => setSelectedImage(undefined)}
            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
          >
            ×
          </button>
        </div>
      )}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <ImageUpload onImageSelect={handleImageSelect} disabled={disabled} />
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          disabled={disabled}
          className="flex-1 p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          disabled={disabled || !input.trim()}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
};