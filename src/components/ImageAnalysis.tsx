import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Loader2, Image as ImageIcon, Brain, CheckCircle2, Save, Copy, Check, History } from 'lucide-react';
import { AnalysisResult } from '../types/chat';
import { saveImageAnalysis, ImageAnalysisRecord } from '../services/supabase';
import { HistoryPopup } from './HistoryPopup';
import { verifyExtraction, analyzeImage } from '../services/api';

interface ImageAnalysisProps {
  imageUrl: string;
  analysis: AnalysisResult;
  onLoadRecord?: (record: ImageAnalysisRecord) => void;
  onTriggerExtraction?: (imageUrl: string) => void;
  enableVerification: boolean;
}

export const ImageAnalysis: React.FC<ImageAnalysisProps> = ({ 
  imageUrl, 
  analysis, 
  onLoadRecord,
  onTriggerExtraction,
  enableVerification
}) => {
  const [isSaving, setIsSaving] = React.useState(false);
  const [saveError, setSaveError] = React.useState<string | null>(null);
  const [copySuccess, setCopySuccess] = React.useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = React.useState(false);
  const [verificationResult, setVerificationResult] = React.useState<AnalysisResult['verification']>();

  const handleSave = async () => {
    if (isSaving || !analysis.description) return;
    
    setIsSaving(true);
    setSaveError(null);
    
    try {
      console.log('Saving analysis:', {
        imageUrl,
        descriptionLength: analysis.description.length,
        tokenUsage: analysis.usage?.total_tokens
      });
      
      await saveImageAnalysis({
        image_url: imageUrl,
        analysis_text: analysis.description,
        token_consumption: analysis.usage?.total_tokens || 0
      });
      
      console.log('Save completed successfully');
    } catch (error) {
      console.error('Save failed:', error);
      const errorMessage = error instanceof Error 
        ? `Save failed: ${error.message}`
        : 'Failed to save analysis. Please check console for details.';
      setSaveError(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCopy = async () => {
    if (!analysis.description) return;
    
    try {
      await navigator.clipboard.writeText(analysis.description);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  const handleHistorySelect = (record: ImageAnalysisRecord) => {
    if (onLoadRecord) {
      onLoadRecord(record);
    }
    if (onTriggerExtraction) {
      onTriggerExtraction(record.image_url);
    }
    setIsHistoryOpen(false);
  };

  React.useEffect(() => {
    const performVerification = async () => {
      if (enableVerification && analysis.description) {
        try {
          const verification = await verifyExtraction(imageUrl, analysis.description);
          setVerificationResult({
            result: verification.choices[0].message.content,
            confidence: 90, // TODO: parse confidence from the response
          });
        } catch (error) {
          console.error('Verification failed:', error);
          setVerificationResult({
            result: 'Verification failed',
            confidence: 0,
          });
        }
      } else {
        setVerificationResult(undefined);
      }
    };

    performVerification();
  }, [analysis.description, enableVerification, imageUrl]);

  return (
    <>
      <div className="w-full max-w-[100vw] px-4 md:px-8">
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
              
              {/* History Button */}
              <button
                onClick={() => setIsHistoryOpen(true)}
                className="ml-auto flex items-center gap-2 px-3 py-1.5 rounded-lg text-white bg-purple-600 hover:bg-purple-700 transition-colors"
              >
                <History className="w-4 h-4" />
                History
              </button>
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
                    <div className="absolute w-2 h-2 bg-red-400 rounded-full animate-float-1"></div>
                    <div className="absolute w-2 h-2 bg-red-400 rounded-full animate-float-2"></div>
                    <div className="absolute w-2 h-2 bg-green-400 rounded-full animate-float-3"></div>
                    <div className="absolute w-2 h-2 bg-green-400 rounded-full animate-float-4"></div>
                    <div className="absolute w-2 h-2 bg-red-400 rounded-full animate-float-5"></div>
                    <div className="absolute w-2 h-2 bg-green-400 rounded-full animate-float-6"></div>
                    <div className="absolute w-2 h-2 bg-red-400 rounded-full animate-float-7"></div>
                    <div className="absolute w-2 h-2 bg-green-400 rounded-full animate-float-8"></div>
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
              {verificationResult && (
                <div className="ml-auto flex items-center gap-2 bg-green-50 px-3 py-1 rounded-full">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium text-green-700">
                    Confidence: {verificationResult.confidence}%
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
                  {verificationResult && (
                    <div className="mt-6 pt-6 border-t">
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Verification Result</h3>
                      <div className="prose prose-sm max-w-none">
                        <ReactMarkdown>{verificationResult.result}</ReactMarkdown>
                      </div>
                    </div>
                  )}
                  
                  {/* Token Usage Display */}
                  {analysis.usage && (
                    <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
                      <span>Tokens Used: {analysis.usage.total_tokens}</span>
                      <span>•</span>
                      <span>Prompt: {analysis.usage.prompt_tokens}</span>
                      <span>•</span>
                      <span>Completion: {analysis.usage.completion_tokens}</span>
                    </div>
                  )}
                  
                  {/* Action Buttons */}
                  <div className="mt-6 pt-6 border-t flex gap-3">
                    {/* Save Button */}
                    <button
                      onClick={handleSave}
                      disabled={isSaving || !analysis.description}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-white ${
                        isSaving ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'
                      } transition-colors`}
                    >
                      {isSaving ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Save className="w-4 h-4" />
                      )}
                      {isSaving ? 'Saving...' : 'Save Analysis'}
                    </button>

                    {/* Copy Button */}
                    <button
                      onClick={handleCopy}
                      disabled={!analysis.description}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-white ${
                        !analysis.description ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
                      } transition-colors`}
                    >
                      {copySuccess ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                      {copySuccess ? 'Copied!' : 'Copy Text'}
                    </button>
                  </div>

                  {saveError && (
                    <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-sm text-red-600">{saveError}</p>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* History Popup */}
      <HistoryPopup
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        onSelect={handleHistorySelect}
      />
    </>
  );
};
