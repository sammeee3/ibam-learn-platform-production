// app/components/common/DownloadModal.tsx
'use client';

import { useState } from 'react';
import { X, FileText, FileSpreadsheet, Download } from 'lucide-react';
import { downloadService } from '@/app/services/downloadService';
interface DownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  availableDownloads: {
    actions?: any;
    sessionData?: any;
    businessPlan?: any;
    fullCourse?: any;
  };
}

const DownloadModal: React.FC<DownloadModalProps> = ({ 
  isOpen, 
  onClose, 
  availableDownloads
}) => {
  const [selectedType, setSelectedType] = useState<'actions' | 'session' | 'business-plan' | 'full-course'>('actions');
  const [selectedFormat, setSelectedFormat] = useState<'pdf' | 'csv' | 'word'>('pdf');
  const [isDownloading, setIsDownloading] = useState(false);

  if (!isOpen) return null;

  const downloadOptions = [
    {
      id: 'actions',
      label: '📋 Action Steps',
      description: 'Your commitments and SMART goals',
      available: !!availableDownloads.actions,
      count: availableDownloads.actions?.length || 0,
      formats: ['pdf', 'csv', 'word']
    },
    {
      id: 'session',
      label: '📚 Course Handbook',
      description: 'All your session work and notes',
      available: !!availableDownloads.sessionData,
      progress: '45% complete',
      formats: ['pdf', 'word']
    },
    {
      id: 'business-plan',
      label: '💼 Business Plan',
      description: 'Professional investor-ready document',
      available: !!availableDownloads.businessPlan,
      status: 'Draft',
      formats: ['pdf', 'word', 'csv']
    }
  ];

  const handleDownload = async () => {
    setIsDownloading(true);
    
    try {
      const data = {
        actions: availableDownloads.actions,
        session: availableDownloads.sessionData,
        businessPlan: availableDownloads.businessPlan
      };

      await downloadService.download({
        format: selectedFormat,
        data: data[selectedType as keyof typeof data],
        type: selectedType
      });
      
      // Success feedback
      setTimeout(() => {
        onClose();
      }, 500);
    } catch (error) {
      console.error('Download error:', error);
      alert('Download failed. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  const selectedOption = downloadOptions.find(opt => opt.id === selectedType);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800">Download Your Work</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Download Type Selection */}
          <div>
            <h3 className="font-semibold text-gray-700 mb-3">What would you like to download?</h3>
            <div className="space-y-2">
              {downloadOptions.map((option) => (
                <label
                  key={option.id}
                  className={`
                    block p-4 rounded-lg border-2 cursor-pointer transition-all
                    ${!option.available ? 'opacity-50 cursor-not-allowed' : ''}
                    ${selectedType === option.id 
                      ? 'border-teal-500 bg-teal-50' 
                      : 'border-gray-200 hover:border-gray-300'
                    }
                  `}
                >
                  <input
                    type="radio"
                    name="downloadType"
                    value={option.id}
                    checked={selectedType === option.id}
                    onChange={(e) => setSelectedType(e.target.value as any)}
                    disabled={!option.available}
                    className="sr-only"
                  />
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium text-gray-800">{option.label}</div>
                      <div className="text-sm text-gray-600 mt-1">{option.description}</div>
                    </div>
                    <div className="text-right text-sm">
                      {option.count && <span className="text-teal-600 font-medium">{option.count} items</span>}
                      {option.progress && <span className="text-blue-600">{option.progress}</span>}
                      {option.status && <span className="text-gray-500">{option.status}</span>}
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Format Selection */}
          <div>
            <h3 className="font-semibold text-gray-700 mb-3">Choose format:</h3>
            <div className="grid grid-cols-3 gap-2">
              {selectedOption?.formats.includes('pdf') && (
                <label className={`
                  flex flex-col items-center p-3 rounded-lg border-2 cursor-pointer transition-all
                  ${selectedFormat === 'pdf' 
                    ? 'border-teal-500 bg-teal-50' 
                    : 'border-gray-200 hover:border-gray-300'
                  }
                `}>
                  <input
                    type="radio"
                    name="format"
                    value="pdf"
                    checked={selectedFormat === 'pdf'}
                    onChange={(e) => setSelectedFormat(e.target.value as any)}
                    className="sr-only"
                  />
                  <FileText className="w-6 h-6 mb-1 text-red-500" />
                  <span className="text-sm font-medium">PDF</span>
                  <span className="text-xs text-gray-500">Best for printing</span>
                </label>
              )}
              
              {selectedOption?.formats.includes('word') && (
                <label className={`
                  flex flex-col items-center p-3 rounded-lg border-2 cursor-pointer transition-all
                  ${selectedFormat === 'word' 
                    ? 'border-teal-500 bg-teal-50' 
                    : 'border-gray-200 hover:border-gray-300'
                  }
                `}>
                  <input
                    type="radio"
                    name="format"
                    value="word"
                    checked={selectedFormat === 'word'}
                    onChange={(e) => setSelectedFormat(e.target.value as any)}
                    className="sr-only"
                  />
                  <FileText className="w-6 h-6 mb-1 text-blue-500" />
                  <span className="text-sm font-medium">Word</span>
                  <span className="text-xs text-gray-500">Editable</span>
                </label>
              )}
              
              {selectedOption?.formats.includes('csv') && (
                <label className={`
                  flex flex-col items-center p-3 rounded-lg border-2 cursor-pointer transition-all
                  ${selectedFormat === 'csv' 
                    ? 'border-teal-500 bg-teal-50' 
                    : 'border-gray-200 hover:border-gray-300'
                  }
                `}>
                  <input
                    type="radio"
                    name="format"
                    value="csv"
                    checked={selectedFormat === 'csv'}
                    onChange={(e) => setSelectedFormat(e.target.value as any)}
                    className="sr-only"
                  />
                  <FileSpreadsheet className="w-6 h-6 mb-1 text-green-500" />
                  <span className="text-sm font-medium">CSV</span>
                  <span className="text-xs text-gray-500">Spreadsheet</span>
                </label>
              )}
            </div>
          </div>

          {/* Download Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              💡 Your file will download to your device's Downloads folder. 
              {selectedFormat === 'pdf' && ' Perfect for printing or sharing.'}
              {selectedFormat === 'word' && ' You can edit this document in Microsoft Word or Google Docs.'}
              {selectedFormat === 'csv' && ' Opens in Excel, Google Sheets, or any spreadsheet app.'}
            </p>
          </div>

          {/* Action Button */}
          <button
            onClick={handleDownload}
            disabled={isDownloading || !selectedOption?.available}
            className={`
              w-full py-3 px-4 rounded-lg font-medium transition-all flex items-center justify-center
              ${isDownloading || !selectedOption?.available
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-teal-600 text-white hover:bg-teal-700'
              }
            `}
          >
            {isDownloading ? (
              <>
                <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Processing...
              </>
            ) : (
              <>
                <Download className="w-5 h-5 mr-2" />
                Download Now
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DownloadModal;