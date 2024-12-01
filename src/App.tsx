import React, { useState } from 'react';
import { BrainCircuit, Settings } from 'lucide-react';
import { ImageUpload } from './components/ImageUpload';
import { ImageAnalysis } from './components/ImageAnalysis';
import { ConfigPopup } from './components/ConfigPopup';
import { UsageStats } from './components/UsageStats';
import { Snow } from './components/Snow';
import { analyzeImage, verifyExtraction, setAPIProvider } from './services/api';
import { AnalysisResult, APIProvider } from './types/chat';
import { ImageAnalysisRecord } from './services/supabase';

// Default prompt for image analysis
const DEFAULT_PROMPT = "Identify the type of document and extract the data. For Chinese text, provide detailed extraction including characters and their meanings.";

function App() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  // State to store the analysis result, including loading state and error handling
  const [analysis, setAnalysis] = useState<AnalysisResult>({
    description: '',
    isLoading: false,
    startTime: undefined,
    endTime: undefined
  });
  // State to control the visibility of the configuration popup
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  // State to store the current extraction prompt
  const [extractionPrompt, setExtractionPrompt] = useState(DEFAULT_PROMPT);
  // State to store the currently selected API provider
  const [provider, setProvider] = useState<APIProvider>('azure');

  // Handles image selection and triggers the image analysis process
  const handleImageSelect = async (base64Image: string) => {
    const startTime = Date.now();
    setSelectedImage(base64Image);
    // Set loading state to true and clear previous analysis results
    setAnalysis({ 
      description: '', 
      isLoading: true,
      startTime,
      endTime: undefined,
      usage: undefined
    });

    try {
      // Call the analyzeImage function to perform OCR and extraction
      const response = await analyzeImage(base64Image, extractionPrompt);
      const extractedText = response.choices[0].message.content;

      // Call the verifyExtraction function to verify the accuracy of the extraction
      const verificationResponse = await verifyExtraction(extractedText, extractedText);
      const verificationText = verificationResponse.choices[0].message.content;
      
      // Parse confidence score from verification response
      const confidenceMatch = verificationText.match(/Confidence Score: (\d+)/);
      const confidence = confidenceMatch ? parseInt(confidenceMatch[1]) : 0;
      
      // Remove the confidence score line from the verification result
      const verificationResult = verificationText.replace(/Confidence Score:.*\n/, '').trim();

      // Update the analysis state with the results, including usage statistics and verification details
      setAnalysis({
        description: extractedText,
        isLoading: false,
        startTime,
        endTime: Date.now(),
        usage: {
          prompt_tokens: response.usage?.prompt_tokens || 0,
          completion_tokens: response.usage?.completion_tokens || 0,
          total_tokens: (response.usage?.total_tokens || 0) + (verificationResponse.usage?.total_tokens || 0)
        },
        verification: {
          result: verificationResult,
          confidence
        }
      });
    } catch (error) {
      // Handle errors during the analysis process
      setAnalysis({
        description: '',
        isLoading: false,
        error: 'OCR Fail。',
        startTime,
        endTime: Date.now()
      });
    }
  };

  // Handles selection of a record from the analysis history
  const handleHistorySelect = (record: ImageAnalysisRecord) => {
    // Update the selected image
    setSelectedImage(record.image_url);
    // Trigger new analysis for the historical image
    handleImageSelect(record.image_url);
  };

  // Handles saving the configuration changes from the ConfigPopup
  const handleConfigSave = (prompt: string, newProvider: APIProvider) => {
    setExtractionPrompt(prompt);
    // Update the provider if it has changed and call setAPIProvider to update the backend
    if (newProvider !== provider) {
      setProvider(newProvider);
      setAPIProvider(newProvider);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-green-50 to-red-50 py-6 relative">
      <Snow />
      <div className="max-w-6xl mx-auto px-4 relative z-10">
        {/* Simple Header */}
        <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg mb-6 p-3 flex items-center justify-between border border-red-100">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-red-100 rounded-lg">
              <BrainCircuit className="w-5 h-5 text-red-600" />
            </div>
            <h1 className="text-lg font-semibold text-gray-800">
              🎄 Extract Data from Image
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <ImageUpload
              onImageSelect={handleImageSelect}
              disabled={analysis.isLoading}
            />
            <button
              onClick={() => setIsConfigOpen(true)}
              className="p-1.5 text-gray-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Analysis"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Analysis Section */}
        {selectedImage && (
          <>
            <ImageAnalysis
              imageUrl={selectedImage}
              analysis={analysis}
              onLoadRecord={handleHistorySelect}
              onTriggerExtraction={handleImageSelect}
            />
            <UsageStats
              startTime={analysis.startTime}
              endTime={analysis.endTime}
              usage={analysis.usage}
            />
          </>
        )}

        {/* Configuration Popup */}
        <ConfigPopup
          isOpen={isConfigOpen}
          onClose={() => setIsConfigOpen(false)}
          currentPrompt={extractionPrompt}
          currentProvider={provider}
          onSave={handleConfigSave}
        />
      </div>
      
      {/* Christmas Decorations */}
      <div className="fixed top-0 left-0 w-32 h-32 pointer-events-none z-20">
        <span className="absolute text-4xl" style={{ left: '20px', top: '20px' }}>🎄</span>
      </div>
      <div className="fixed top-0 right-0 w-32 h-32 pointer-events-none z-20">
        <span className="absolute text-4xl" style={{ right: '20px', top: '20px' }}>🎄</span>
      </div>
      <div className="fixed bottom-0 left-0 w-32 h-32 pointer-events-none z-20">
        <span className="absolute text-4xl" style={{ left: '20px', bottom: '20px' }}>🎁</span>
      </div>
      <div className="fixed bottom-0 right-0 w-32 h-32 pointer-events-none z-20">
        <span className="absolute text-4xl" style={{ right: '20px', bottom: '20px' }}>🎁</span>
      </div>
    </div>
  );
}

export default App;
