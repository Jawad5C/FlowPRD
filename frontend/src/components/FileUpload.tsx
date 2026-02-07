import React, { useState } from 'react';

interface FileUploadProps {
  onTransform: (fileOrText: File | string) => void;
  isProcessing: boolean;
  error: string | null;
}

const FileUpload: React.FC<FileUploadProps> = ({
  onTransform,
  isProcessing,
  error,
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [textInput, setTextInput] = useState('');
  const [inputMode, setInputMode] = useState<'file' | 'text'>('file');

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setSelectedFile(file);
      setInputMode('file');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setInputMode('file');
    }
  };

  const handleSubmit = () => {
    if (inputMode === 'file' && selectedFile) {
      onTransform(selectedFile);
    } else if (inputMode === 'text' && textInput.trim()) {
      onTransform(textInput);
    }
  };

  const primaryButtonClass =
    'px-4 py-2 rounded-lg text-sm font-semibold cursor-pointer transition-all';
  const tabActive = `${primaryButtonClass} bg-squid-pink text-white`;
  const tabInactive = `${primaryButtonClass} bg-gray-200 text-gray-600 hover:bg-gray-300`;

  return (
    <div className="bg-white rounded-xl p-4 shadow border border-gray-200 flex-shrink-0">
      <div className="flex gap-2 mb-4 justify-center">
        <button
          type="button"
          onClick={() => setInputMode('file')}
          className={inputMode === 'file' ? tabActive : tabInactive}
        >
          📄 File
        </button>
        <button
          type="button"
          onClick={() => setInputMode('text')}
          className={inputMode === 'text' ? tabActive : tabInactive}
        >
          ✍️ Paste
        </button>
      </div>

      {inputMode === 'file' ? (
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-xl py-12 px-6 text-center transition-all mb-4 flex flex-col gap-4 justify-center items-center min-h-[200px] ${
            dragActive
              ? 'border-squid-pink bg-squid-light-pink/30'
              : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
          }`}
        >
          <input
            type="file"
            id="fileInput"
            accept=".txt,.pdf,.docx,.md"
            onChange={handleFileChange}
            className="hidden"
          />
          <div
            onClick={() => document.getElementById('fileInput')?.click()}
            className="cursor-pointer flex flex-col items-center gap-1"
          >
            <span className="text-4xl">
              {selectedFile ? '📄' : '⬆️'}
            </span>
            <p className="text-base font-semibold text-squid-navy">
              {selectedFile ? selectedFile.name : 'Drop your PRD here'}
            </p>
            <p className="text-sm text-gray-500">
              {selectedFile
                ? `${(selectedFile.size / 1024).toFixed(1)} KB • Click to change file`
                : 'or click to browse • .docx, .pdf, .txt, .md'}
            </p>
          </div>
          {selectedFile && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onTransform(selectedFile);
              }}
              disabled={isProcessing}
              className={`w-full max-w-xs py-3 rounded-lg text-sm font-bold text-white transition-all ${
                isProcessing
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-squid-pink hover:bg-squid-pink/90'
              }`}
            >
              {isProcessing ? 'Transforming…' : '✨ Transform'}
            </button>
          )}
        </div>
      ) : (
        <textarea
          value={textInput}
          onChange={(e) => setTextInput(e.target.value)}
          placeholder="Paste PRD text here..."
          className="w-full h-48 min-h-[180px] p-4 border-2 border-gray-200 rounded-xl text-sm text-gray-800 font-sans resize-y bg-gray-50 focus:border-squid-pink focus:outline-none mb-4"
        />
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4 text-red-700 text-sm">
          ⚠️ {error}
        </div>
      )}

      <button
        type="button"
        onClick={handleSubmit}
        disabled={
          isProcessing ||
          (inputMode === 'file' && !selectedFile) ||
          (inputMode === 'text' && !textInput.trim())
        }
        className={`w-full py-3 rounded-lg text-sm font-bold text-white transition-all ${
          isProcessing
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-squid-pink hover:bg-squid-pink/90'
        }`}
      >
        {isProcessing ? 'Transforming…' : '✨ Transform'}
      </button>
    </div>
  );
};

export default FileUpload;
