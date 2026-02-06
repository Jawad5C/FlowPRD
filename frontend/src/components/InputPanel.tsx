import React, { useState } from 'react';
import { Upload, FileText, FileType } from 'lucide-react';

interface InputPanelProps {
  onTextSubmit: (text: string) => void;
  onFileUpload: (file: File) => void;
}

const InputPanel: React.FC<InputPanelProps> = ({ onTextSubmit, onFileUpload }) => {
  const [text, setText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!text.trim()) return;
    
    setIsLoading(true);
    try {
      await onTextSubmit(text);
      setText('');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (max 10MB)
      const maxSize = 10 * 1024 * 1024; // 10MB in bytes
      if (file.size > maxSize) {
        alert('File is too large. Maximum size is 10MB.');
        e.target.value = ''; // Reset input
        return;
      }
      
      const validTypes = ['.txt', '.md', '.docx'];
      const fileExt = '.' + file.name.split('.').pop()?.toLowerCase();
      
      if (validTypes.includes(fileExt)) {
        onFileUpload(file);
        e.target.value = ''; // Reset input
      } else {
        alert('Please upload a .txt, .md, or .docx file');
        e.target.value = ''; // Reset input
      }
    }
  };

  return (
    <div className="bg-white border-b border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Create PRD</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Describe your product idea
          </label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                e.preventDefault();
                handleSubmit();
              }
            }}
            placeholder="Enter your product idea or paste existing PRD text here..."
            className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-squid-pink focus:border-transparent resize-none"
          />
          <div className="flex justify-between items-center mt-2">
            <span className="text-xs text-gray-500">
              {text.length} characters
            </span>
            <button
              onClick={handleSubmit}
              disabled={!text.trim() || isLoading}
              className="px-6 py-2 bg-squid-pink text-white rounded-lg hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {isLoading ? 'Generating...' : 'Generate PRD'}
            </button>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex-1 h-px bg-gray-300"></div>
          <span className="text-sm text-gray-500">OR</span>
          <div className="flex-1 h-px bg-gray-300"></div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload existing PRD
          </label>
          <div className="relative">
            <input
              type="file"
              accept=".txt,.md,.docx"
              onChange={handleFileChange}
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="flex items-center justify-center gap-2 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-squid-pink hover:bg-squid-light-pink cursor-pointer transition-all"
            >
              <Upload className="w-5 h-5 text-gray-600" />
              <span className="text-sm text-gray-600">
                Click to upload .txt, .md, or .docx file
              </span>
            </label>
          </div>
          <div className="flex gap-2 mt-2 text-xs text-gray-500">
            <FileText className="w-4 h-4" />
            <FileType className="w-4 h-4" />
            <span>Supported: TXT, Markdown, Word</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InputPanel;
