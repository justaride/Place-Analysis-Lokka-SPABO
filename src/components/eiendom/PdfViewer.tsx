interface PdfViewerProps {
  pdfUrl: string;
  title: string;
  description?: string;
}

export default function PdfViewer({ pdfUrl, title }: PdfViewerProps) {
  return (
    <div className="mb-8">
      <div className="relative w-full overflow-hidden rounded-lg shadow-soft" style={{ height: '1400px' }}>
        <iframe
          src={pdfUrl}
          className="h-full w-full border-0"
          title={title}
        />
      </div>
    </div>
  );
}
