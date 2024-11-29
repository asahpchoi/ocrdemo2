import React from 'react';
import { X, Loader2 } from 'lucide-react';
import { ImageAnalysisRecord, getImageAnalyses } from '../services/supabase';

interface HistoryPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (record: ImageAnalysisRecord) => void;
}

export const HistoryPopup: React.FC<HistoryPopupProps> = ({ isOpen, onClose, onSelect }) => {
  const [records, setRecords] = React.useState<ImageAnalysisRecord[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (isOpen) {
      loadHistory();
    }
  }, [isOpen]);

  const loadHistory = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getImageAnalyses();
      setRecords(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load history');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[80vh] overflow-hidden relative">
        {/* Header */}
        <div className="p-4 border-b flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-800">Analysis History</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(80vh-4rem)]">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
          ) : error ? (
            <div className="text-red-500 bg-red-50 p-4 rounded-lg">
              {error}
            </div>
          ) : records.length === 0 ? (
            <div className="text-gray-500 text-center py-12">
              No analysis history found
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {records.map((record) => (
                <button
                  key={record.id}
                  onClick={() => onSelect(record)}
                  className="group relative aspect-square rounded-lg overflow-hidden border hover:border-blue-500 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <img
                    src={record.image_url}
                    alt="Analysis thumbnail"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors" />
                  
                  {/* Token count badge */}
                  <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full">
                    {record.token_consumption} tokens
                  </div>
                  
                  {/* Date badge */}
                  <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full">
                    {new Date(record.created_at!).toLocaleDateString()}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
