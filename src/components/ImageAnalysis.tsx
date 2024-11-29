import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Loader2, Image as ImageIcon, Brain, CheckCircle2 } from 'lucide-react';
import { AnalysisResult } from '../types/chat';

interface ImageAnalysisProps {
  imageUrl: string;
  analysis: AnalysisResult;
}

export const ImageAnalysis: React.FC<ImageAnalysisProps> = ({ imageUrl, analysis }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-red-100 relative">
      {/* Decorative Corner Elements */}
      <div className="absolute -top-3 -left-3 text-2xl">🎄</div>
      <div className="absolute -top-3 -right-3 text-2xl">🎄</div>
      <div className="absolute -bottom-3 -left-3 text-2xl">🎁</div>
      <div className="absolute -bottom-3 -right-3 text-2xl">🎁</div>

      {/* Image Display */}
      <div className="flex flex-col h-[calc(100vh-16rem)]">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 bg-red-100 rounded-lg">
            <ImageIcon className="w-5 h-5 text-red-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800">Upload Photo</h2>
        </div>
        <div className="relative rounded-xl overflow-hidden bg-gradient-to-br from-red-50 to-green-50 shadow-inner flex-1">
          <div className="absolute inset-0 overflow-auto">
            <img
              src={imageUrl}
              alt="待分析图片"
              className="w-full h-auto object-contain relative z-10"
            />
          </div>
          {analysis.isLoading && (
            <>
              {/* Scanning line with glow effect */}
              <div className="absolute inset-0 z-20">
                <div className="w-full h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent absolute animate-scan-line shadow-[0_0_15px_rgba(239,68,68,0.5)]"></div>
              </div>
              
              {/* Corner highlights */}
              <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-red-500 rounded-tl-lg animate-pulse z-30"></div>
              <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-green-500 rounded-tr-lg animate-pulse z-30"></div>
              <div className="absolute bottom-0 left-0 w-16 h-16 border-b-2 border-l-2 border-green-500 rounded-bl-lg animate-pulse z-30"></div>
              <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-red-500 rounded-br-lg animate-pulse z-30"></div>
              
              {/* Scanning overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-red-500/10 via-transparent to-green-500/10 animate-scan-overlay z-20"></div>
              
              {/* Floating particles */}
              <div className="absolute inset-0 overflow-hidden z-20">
                {/* Diagonal particles */}
                <div className="absolute w-2 h-2 bg-red-400 rounded-full animate-float-1"></div>
                <div className="absolute w-2 h-2 bg-red-400 rounded-full animate-float-2"></div>
                <div className="absolute w-2 h-2 bg-green-400 rounded-full animate-float-3"></div>
                <div className="absolute w-2 h-2 bg-green-400 rounded-full animate-float-4"></div>
                
                {/* Horizontal and vertical particles */}
                <div className="absolute w-2 h-2 bg-red-400 rounded-full animate-float-5"></div>
                <div className="absolute w-2 h-2 bg-green-400 rounded-full animate-float-6"></div>
                <div className="absolute w-2 h-2 bg-red-400 rounded-full animate-float-7"></div>
                <div className="absolute w-2 h-2 bg-green-400 rounded-full animate-float-8"></div>
                
                {/* Circular motion particles */}
                <div className="absolute w-2 h-2 bg-red-400 rounded-full animate-float-circle-1"></div>
                <div className="absolute w-2 h-2 bg-green-400 rounded-full animate-float-circle-2"></div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Analysis Display */}
      <div className="flex flex-col h-[calc(100vh-16rem)]">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 bg-green-100 rounded-lg">
            <Brain className="w-5 h-5 text-green-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800">Analysis Result</h2>
          {analysis.verification && (
            <div className="ml-auto flex items-center gap-2 bg-green-50 px-3 py-1 rounded-full">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-green-700">
                Confidence: {analysis.verification.confidence}%
              </span>
            </div>
          )}
        </div>
        <div className="bg-gradient-to-br from-red-50 to-green-50 rounded-xl p-6 flex-1 shadow-inner overflow-auto">
          {analysis.isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="w-8 h-8 animate-spin text-red-600" />
                <p className="text-sm text-gray-600">Processing...</p>
              </div>
            </div>
          ) : analysis.error ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-red-500 bg-red-50 px-4 py-3 rounded-lg">
                {analysis.error}
              </div>
            </div>
          ) : (
            <>
              <div className="prose prose-sm max-w-none">
                <ReactMarkdown 
                  className="text-gray-700 leading-relaxed [&>*:first-child]:mt-0 [&>*:last-child]:mb-0"
                  components={{
                    p: ({ children }) => <p className="mb-4 text-base">{children}</p>,
                    h3: ({ children }) => <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">{children}</h3>,
                    ul: ({ children }) => <ul className="list-disc list-inside mb-4">{children}</ul>,
                    li: ({ children }) => <li className="mb-2 text-base">{children}</li>,
                  }}
                >
                  {analysis.description}
                </ReactMarkdown>
              </div>
              {analysis.verification && (
                <div className="mt-6 pt-6 border-t">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Verification Result</h3>
                  <div className="prose prose-sm max-w-none">
                    <ReactMarkdown>{analysis.verification.result}</ReactMarkdown>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};