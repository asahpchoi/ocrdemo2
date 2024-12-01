import React from 'react';
import { systemPrompts, SystemPrompt } from '../types/prompts';

interface PromptSelectorProps {
  onSelect: (prompt: SystemPrompt) => void;
  className?: string;
}

export const PromptSelector: React.FC<PromptSelectorProps> = ({ onSelect, className = '' }) => {
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 ${className}`}>
      {systemPrompts.map((prompt) => (
        <button
          key={prompt.id}
          onClick={() => onSelect(prompt)}
          className="flex flex-col p-4 bg-white rounded-lg shadow-sm border border-gray-200 hover:border-red-300 hover:shadow-md transition-all text-left"
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-1">{prompt.name}</h3>
          <p className="text-sm text-gray-600 flex-1">{prompt.description}</p>
        </button>
      ))}
    </div>
  );
};
