import React from 'react';
import { Clock, Cpu } from 'lucide-react';

interface UsageStatsProps {
  startTime?: number;
  endTime?: number;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export const UsageStats: React.FC<UsageStatsProps> = ({ startTime, endTime, usage }) => {
  const processingTime = startTime && endTime ? ((endTime - startTime) / 1000).toFixed(2) : null;

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-red-100 mt-4">
      <div className="grid grid-cols-2 gap-4">
        {/* Time Usage */}
        <div className="flex items-center gap-2">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Clock className="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Processing Time</p>
            <p className="text-lg font-semibold text-gray-800">
              {processingTime ? `${processingTime}s` : '-'}
            </p>
          </div>
        </div>

        {/* Token Usage */}
        <div className="flex items-center gap-2">
          <div className="p-2 bg-purple-100 rounded-lg">
            <Cpu className="w-4 h-4 text-purple-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Token Usage</p>
            {usage ? (
              <div className="space-y-1">
                <p className="text-sm text-gray-700">
                  Prompt: <span className="font-medium">{usage.prompt_tokens}</span>
                </p>
                <p className="text-sm text-gray-700">
                  Completion: <span className="font-medium">{usage.completion_tokens}</span>
                </p>
                <p className="text-sm font-semibold text-gray-800">
                  Total: {usage.total_tokens}
                </p>
              </div>
            ) : (
              <p className="text-lg font-semibold text-gray-800">-</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};