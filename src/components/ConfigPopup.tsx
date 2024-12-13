import React, { useState } from 'react';
import { Settings, X } from 'lucide-react';
import { APIProvider } from '../types/chat';
import { PromptSelector } from './PromptSelector';
import { SystemPrompt } from '../types/prompts';

interface ConfigPopupProps {
  isOpen: boolean;
  onClose: () => void;
  currentPrompt: string;
  currentProvider: APIProvider;
  onSave: (prompt: string, provider: APIProvider, enableVerification: boolean) => void;
}

export const ConfigPopup: React.FC<ConfigPopupProps> = ({
  isOpen,
  onClose,
  currentPrompt,
  currentProvider,
  onSave,
}) => {
  const [prompt, setPrompt] = useState(currentPrompt);
  const [provider, setProvider] = useState<APIProvider>(currentProvider);
  const [enableVerification, setEnableVerification] = useState(false);

  const handleSave = () => {
    onSave(prompt, provider, enableVerification);
    onClose();
  };

  const handlePromptSelect = (selectedPrompt: SystemPrompt) => {
    setPrompt(selectedPrompt.prompt);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl mx-4 relative max-h-[90vh] overflow-hidden">
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

        <div className="overflow-auto p-4 max-h-[calc(90vh-100px)]">
          {/* Prompt Templates Section */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-700 mb-2">
              Predefined Prompt Templates
            </h3>
            <PromptSelector onSelect={handlePromptSelect} className="mb-4" />
          </div>

          {/* Main Content */}
          <div>
            {/* Provider Selection */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                API Provider
              </label>
              <select
                value={provider}
                onChange={(e) => setProvider(e.target.value as APIProvider)}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              >
                <option value="azure">Azure OpenAI</option>
                <option value="xai">X.AI (Grok)</option>
                <option value="gemini">Gemini</option>
              </select>
              <p className="mt-1 text-xs text-gray-500">
                Select the AI provider for image analysis
              </p>
            </div>

            {/* Verification Toggle */}
            <div className="mb-4 flex items-center">
              <input
                type="checkbox"
                id="enableVerification"
                checked={enableVerification}
                onChange={(e) => setEnableVerification(e.target.checked)}
                className="mr-2 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="enableVerification" className="text-sm font-medium text-gray-700">
                Enable Verification Step
              </label>
            </div>

            <div className="mb-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Extraction Prompt
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="w-full h-[300px] px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none font-mono text-sm"
                placeholder="Enter extraction prompt..."
              />
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
