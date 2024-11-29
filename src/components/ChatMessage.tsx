import React from 'react';
import { MessageSquare, Bot } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface ChatMessageProps {
  role: 'user' | 'assistant';
  content: string;
  image?: string;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ role, content, image }) => {
  return (
    <div className={`flex gap-3 ${role === 'assistant' ? 'bg-gray-50' : ''} p-4 rounded-lg`}>
      <div className="w-8 h-8 rounded-full flex items-center justify-center bg-blue-100">
        {role === 'user' ? (
          <MessageSquare className="w-5 h-5 text-blue-600" />
        ) : (
          <Bot className="w-5 h-5 text-blue-600" />
        )}
      </div>
      <div className="flex-1">
        <div className="font-medium mb-1">{role === 'user' ? 'You' : 'Assistant'}</div>
        {image && (
          <div className="mb-3">
            <img src={image} alt="Uploaded" className="max-w-xs rounded-lg shadow-sm" />
          </div>
        )}
        <div className="prose prose-sm max-w-none">
          <ReactMarkdown>{content}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
};