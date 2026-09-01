/**
 * FileDropzone - File upload component
 * Drag-and-drop support for .xlsx, .csv, .ods files
 */

import type { ReactNode } from 'react';

interface FileDropzoneProps {
  onFileSelect: (file: File) => void;
  isLoading?: boolean;
  children?: ReactNode;
}

export function FileDropzone({
  onFileSelect,
  isLoading = false,
  children,
}: FileDropzoneProps) {
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      onFileSelect(files[0]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files;
    if (files && files.length > 0) {
      onFileSelect(files[0]);
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      style={{
        position: 'relative',
        borderRadius: '8px',
        border: '2px dashed #9333ea',
        backgroundColor: '#faf5ff',
        padding: '32px 24px',
        textAlign: 'center',
        cursor: isLoading ? 'not-allowed' : 'pointer',
        opacity: isLoading ? 0.6 : 1,
        transition: 'all 200ms ease-in-out',
      }}
    >
      <input
        type="file"
        accept=".xlsx,.csv,.ods"
        onChange={handleInputChange}
        disabled={isLoading}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          opacity: 0,
          cursor: isLoading ? 'not-allowed' : 'pointer',
        }}
      />

      <div style={{ pointerEvents: 'none' }}>
        {isLoading ? (
          <>
            <div
              style={{
                width: '32px',
                height: '32px',
                border: '3px solid #9333ea',
                borderTop: '3px solid transparent',
                borderRadius: '50%',
                margin: '0 auto 12px',
                animation: 'spin 0.8s linear infinite',
              }}
            />
            <p style={{ color: '#6b21a8', fontSize: '14px', margin: 0 }}>
              Processando arquivo...
            </p>
          </>
        ) : (
          <>
            <p style={{ fontSize: '16px', fontWeight: 600, color: '#6b21a8', margin: '0 0 8px 0' }}>
              Solte o arquivo aqui ou clique para enviar
            </p>
            <p style={{ fontSize: '12px', color: '#9333ea', margin: 0 }}>
              Suportados: .xlsx, .csv, .ods (Máximo 10MB)
            </p>
            {children && <div style={{ marginTop: '16px' }}>{children}</div>}
          </>
        )}
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
