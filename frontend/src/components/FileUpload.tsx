import React, { useState } from 'react';

interface FileUploadProps {
  onTransform: (fileOrText: File | string) => void;
  isProcessing: boolean;
  error: string | null;
}

const FileUpload: React.FC<FileUploadProps> = ({ onTransform, isProcessing, error }) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [textInput, setTextInput] = useState('');
  const [inputMode, setInputMode] = useState<'file' | 'text'>('file');

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
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

  return (
    <div style={{
      background: 'white',
      borderRadius: '24px',
      padding: '40px',
      boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
      maxWidth: '800px',
      margin: '0 auto'
    }}>
      <div style={{ marginBottom: '30px', textAlign: 'center' }}>
        <div style={{ 
          display: 'flex', 
          gap: '10px', 
          justifyContent: 'center',
          marginBottom: '20px'
        }}>
          <button
            onClick={() => setInputMode('file')}
            style={{
              padding: '10px 30px',
              border: 'none',
              borderRadius: '12px',
              background: inputMode === 'file' ? '#667eea' : '#e2e8f0',
              color: inputMode === 'file' ? 'white' : '#64748b',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s'
            }}
          >
            📄 Upload File
          </button>
          <button
            onClick={() => setInputMode('text')}
            style={{
              padding: '10px 30px',
              border: 'none',
              borderRadius: '12px',
              background: inputMode === 'text' ? '#667eea' : '#e2e8f0',
              color: inputMode === 'text' ? 'white' : '#64748b',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s'
            }}
          >
            ✍️ Paste Text
          </button>
        </div>
      </div>

      {inputMode === 'file' ? (
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => document.getElementById('fileInput')?.click()}
          style={{
            border: dragActive ? '3px dashed #667eea' : '3px dashed #cbd5e1',
            borderRadius: '16px',
            padding: '60px 40px',
            textAlign: 'center',
            background: dragActive ? '#f8f9ff' : '#f8fafc',
            cursor: 'pointer',
            transition: 'all 0.3s',
            marginBottom: '20px'
          }}
        >
          <input
            type="file"
            id="fileInput"
            accept=".txt,.pdf,.docx,.md"
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
          
          <div style={{ fontSize: '4em', marginBottom: '20px' }}>
            {selectedFile ? '📄' : '⬆️'}
          </div>
          
          <h3 style={{ 
            fontSize: '1.5em', 
            marginBottom: '10px',
            color: '#1e293b',
            fontWeight: '600'
          }}>
            {selectedFile ? selectedFile.name : 'Drop your PRD here'}
          </h3>
          
          <p style={{ 
            color: '#64748b',
            fontSize: '0.95em'
          }}>
            {selectedFile 
              ? `Ready to transform (${(selectedFile.size / 1024).toFixed(1)} KB)` 
              : 'or click to browse (.docx, .pdf, .txt, .md)'
            }
          </p>
        </div>
      ) : (
        <textarea
          value={textInput}
          onChange={(e) => setTextInput(e.target.value)}
          placeholder="Paste your PRD text here...&#10;&#10;Include sections like:&#10;- Problem Statement&#10;- Opportunity&#10;- Users & Needs&#10;- etc."
          style={{
            width: '100%',
            height: '300px',
            padding: '20px',
            border: '2px solid #cbd5e1',
            borderRadius: '12px',
            fontSize: '0.95em',
            fontFamily: 'inherit',
            resize: 'vertical',
            marginBottom: '20px',
            background: '#f8fafc'
          }}
        />
      )}

      {error && (
        <div style={{
          background: '#fee2e2',
          border: '1px solid #fecaca',
          borderRadius: '12px',
          padding: '15px',
          marginBottom: '20px',
          color: '#dc2626',
          fontSize: '0.9em'
        }}>
          ⚠️ {error}
        </div>
      )}

      <button
        onClick={handleSubmit}
        disabled={isProcessing || (inputMode === 'file' && !selectedFile) || (inputMode === 'text' && !textInput.trim())}
        style={{
          width: '100%',
          padding: '18px',
          background: isProcessing ? '#94a3b8' : '#667eea',
          color: 'white',
          border: 'none',
          borderRadius: '12px',
          fontSize: '1.1em',
          fontWeight: '700',
          cursor: isProcessing ? 'not-allowed' : 'pointer',
          transition: 'all 0.3s',
          boxShadow: isProcessing ? 'none' : '0 4px 20px rgba(102, 126, 234, 0.4)'
        }}
      >
        {isProcessing ? '🤖 Transforming with AI...' : '✨ Transform to Visual Diagram'}
      </button>

      <p style={{
        textAlign: 'center',
        marginTop: '20px',
        color: '#64748b',
        fontSize: '0.85em'
      }}>
        Powered by Gemini AI • Supports .docx, .pdf, .txt, .md
      </p>
    </div>
  );
};

export default FileUpload;
