'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

interface PdfViewerProps {
  pdfUrl: string;
  title: string;
  description?: string;
}

export default function PdfViewer({ pdfUrl, title, description }: PdfViewerProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">{title}</CardTitle>
            {description && (
              <p className="mt-1 text-sm text-gray-600">{description}</p>
            )}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="rounded-md bg-lokka-primary px-3 py-1 text-sm text-white transition-colors hover:bg-lokka-primary/90"
            >
              {isExpanded ? 'Lukk' : 'Vis'}
            </button>
            <a
              href={pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-md border-2 border-lokka-primary px-3 py-1 text-sm text-lokka-primary transition-colors hover:bg-lokka-primary hover:text-white"
            >
              Åpne PDF
            </a>
          </div>
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent className="p-0">
          <div className="relative h-[800px] w-full bg-gray-100">
            <iframe
              src={pdfUrl}
              className="h-full w-full"
              title={title}
            />
          </div>
        </CardContent>
      )}
    </Card>
  );
}
