import React, { useState } from 'react';
import { Settings, X } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface ConfigPopupProps {
  isOpen: boolean;
  onClose: () => void;
  currentPrompt: string;
  onSave: (prompt: string) => void;
}

export const ConfigPopup: React.FC<ConfigPopupProps> = ({
  isOpen,
  onClose,
  currentPrompt,
  onSave,
}) => {
  const [prompt, setPrompt] = useState(currentPrompt);

  const handleSave = () => {
    onSave(prompt);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-5xl mx-4 relative">
        {/* Header */}
        <div className="flex items-center justify-between px-3 py-2 border-b bg-gray-50">
          <div className="flex items-center gap-1.5">
            <Settings className="w-4 h-4 text-gray-600" />
            <h2 className="text-base font-medium text-gray-700">Extraction Configuration</h2>
          </div>
          <button
            onClick={onClose}
            className="p-0.5 hover:bg-gray-200 rounded transition-colors"
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="grid grid-cols-2 gap-6 p-4">
          {/* Left Panel - Editor */}
          <div>
            <div className="mb-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Extraction Prompt
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="w-full h-[calc(100vh-320px)] min-h-[300px] px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none font-mono text-sm"
                placeholder="Enter extraction prompt..."
              />
            </div>
            <p className="text-xs text-gray-500">
              Supports Markdown format. Preview formatted result on the right.
            </p>
          </div>

          {/* Right Panel - Preview */}
          <div>
            <div className="mb-1">
              <label className="block text-sm font-medium text-gray-700">
                Preview
              </label>
            </div>
            <div className="border rounded-lg p-4 h-[calc(100vh-320px)] min-h-[300px] overflow-auto bg-gray-50">
              <ReactMarkdown 
                className="prose prose-sm max-w-none"
                components={{
                  p: ({ children }) => <p className="mb-4 text-base">{children}</p>,
                  h1: ({ children }) => <h1 className="text-2xl font-bold mb-4">{children}</h1>,
                  h2: ({ children }) => <h2 className="text-xl font-bold mb-3">{children}</h2>,
                  h3: ({ children }) => <h3 className="text-lg font-semibold mb-2">{children}</h3>,
                  ul: ({ children }) => <ul className="list-disc list-inside mb-4">{children}</ul>,
                  ol: ({ children }) => <ol className="list-decimal list-inside mb-4">{children}</ol>,
                  li: ({ children }) => <li className="mb-1">{children}</li>,
                  code: ({ children }) => <code className="bg-gray-100 px-1 rounded">{children}</code>,
                  pre: ({ children }) => <pre className="bg-gray-100 p-2 rounded mb-4 overflow-auto">{children}</pre>,
                  blockquote: ({ children }) => <blockquote className="border-l-4 border-gray-200 pl-4 italic mb-4">{children}</blockquote>,
                }}
              >
                {prompt}
              </ReactMarkdown>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 p-2 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-200 rounded transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};