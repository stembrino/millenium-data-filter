import type { ChangeEvent, DragEvent, ReactNode } from "react";

interface XmlFileDropzoneProps {
  onFileSelect: (file: File) => void;
  children?: ReactNode;
  compact?: boolean;
  accept?: string;
  acceptText?: string;
  backgroundColor?: string;
}

export function XmlFileDropzone({
  onFileSelect,
  children,
  compact = false,
  accept = ".xml,application/xml,text/xml",
  acceptText = "Suportados: .xml (Máximo 10MB)",
  backgroundColor = "#faf5ff",
}: XmlFileDropzoneProps) {
  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();

    const file = event.dataTransfer.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragEnter={handleDragOver}
      onDragLeave={handleDragOver}
      onDrop={handleDrop}
      style={{
        position: "relative",
        borderRadius: "8px",
        border: "2px dashed #9333ea",
        backgroundColor: backgroundColor,
        padding: compact ? "18px 20px" : "32px 24px",
        minHeight: compact ? "150px" : "180px",
        textAlign: "center",
        cursor: "pointer",
        transition: "all 200ms ease-in-out",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <input
        type="file"
        accept={accept}
        onChange={handleInputChange}
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0,
          cursor: "pointer",
        }}
      />

      <div style={{ pointerEvents: "none", width: "100%" }}>
        <p
          style={{
            fontSize: compact ? "18px" : "16px",
            fontWeight: 600,
            color: "#6b21a8",
            margin: "0 0 8px 0",
          }}
        >
          Solte o arquivo aqui ou clique para enviar
        </p>
        <p style={{ fontSize: "12px", color: "#9333ea", margin: 0 }}>
          {acceptText}
        </p>
        {children && <div style={{ marginTop: "16px" }}>{children}</div>}
      </div>
    </div>
  );
}
