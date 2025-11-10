'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

interface PdfViewerProps {
  pdfUrl: string;
  title: string;
  description?: string;
  defaultExpanded?: boolean;
}

export default function PdfViewer({
  pdfUrl,
  title,
  description,
  defaultExpanded = true,
}: PdfViewerProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <CardTitle className="text-lg">{title}</CardTitle>
            {description && (
              <p className="mt-1 text-sm text-gray-600">{description}</p>
            )}
          </div>
          <div className="flex flex-shrink-0 gap-2">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="whitespace-nowrap rounded-md bg-lokka-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-lokka-primary/90"
            >
              {isExpanded ? '▼ Skjul' : '▶ Vis'}
            </button>
            <a
              href={pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="whitespace-nowrap rounded-md border-2 border-lokka-primary px-4 py-2 text-sm font-medium text-lokka-primary transition-colors hover:bg-lokka-primary hover:text-white"
            >
              📄 Åpne PDF
            </a>
          </div>
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent className="p-0">
          <div className="relative w-full bg-gray-100" style={{ height: '1000px' }}>
            <iframe
              src={pdfUrl}
              className="h-full w-full border-0"
              title={title}
            />
          </div>
        </CardContent>
      )}
    </Card>
  );
}
