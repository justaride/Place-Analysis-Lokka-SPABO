import Image from 'next/image';

interface ImageViewerProps {
  imagePath: string;
  title: string;
  description?: string;
  priority?: boolean;
}

export default function ImageViewer({
  imagePath,
  title,
  description,
  priority = false
}: ImageViewerProps) {
  return (
    <div className="mb-20">
      {/* Optional Section Header */}
      {description && (
        <div className="mb-6">
          <p className="text-sm font-medium text-lokka-secondary uppercase tracking-wider">
            {description}
          </p>
        </div>
      )}

      {/* Image Container with Shadow and Rounded Corners */}
      <div className="group relative w-full overflow-hidden rounded-2xl shadow-soft transition-all duration-500 ease-out hover:shadow-large hover:-translate-y-1">
        <Image
          src={imagePath}
          alt={title}
          width={2480}
          height={3508}
          priority={priority}
          className="w-full h-auto transition-transform duration-500 ease-out group-hover:scale-[1.01]"
          quality={95}
          style={{
            maxWidth: '100%',
            height: 'auto',
          }}
        />
      </div>
    </div>
  );
}
