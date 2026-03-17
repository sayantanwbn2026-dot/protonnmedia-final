import { getMediaType, getYouTubeEmbedUrl } from '@/utils/mediaUtils';
import { type HTMLAttributes, forwardRef } from 'react';

interface MediaRendererProps extends HTMLAttributes<HTMLElement> {
  url: string;
  alt?: string;
  className?: string;
  type?: 'image' | 'video' | 'youtube' | 'instagram' | 'unknown';
}

const MediaRenderer = forwardRef<HTMLElement, MediaRendererProps>(
  ({ url, alt = '', className = '', ...props }, ref) => {
    const detectedType = getMediaType(url);

    if (detectedType === 'youtube') {
      return (
        <iframe
          ref={ref as any}
          src={getYouTubeEmbedUrl(url)}
          className={`w-full h-full ${className}`}
          title={alt || 'YouTube Video'}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          {...(props as any)}
        />
      );
    }

    if (detectedType === 'instagram') {
      return (
        <div 
          ref={ref as any}
          className={`flex flex-col items-center justify-center p-4 bg-muted/20 border border-border/10 rounded-lg text-center ${className}`} 
          {...(props as any)}
        >
          <span className="font-body text-[10px] text-muted-foreground uppercase tracking-wider mb-2">Instagram content</span>
          <a href={url} target="_blank" rel="noopener noreferrer" className="font-body text-xs text-primary underline underline-offset-4 decoration-primary/40 hover:decoration-primary transition-colors">
            View on Instagram
          </a>
        </div>
      );
    }

    if (detectedType === 'video') {
      return (
        <video 
          ref={ref as any}
          src={url} 
          className={`w-full h-full object-cover ${className}`} 
          controls 
          playsInline 
          {...(props as any)} 
        />
      );
    }

    // Default to image or fallback
    return (
      <img 
        ref={ref as any}
        src={url || 'https://images.unsplash.com/photo-1518770662639-470d65609e7c?w=1200'} 
        className={`w-full h-full object-cover ${className}`} 
        alt={alt} 
        crossOrigin="anonymous"
        onError={(e) => {
          // Fallback for broken image
          e.currentTarget.src = 'https://images.unsplash.com/photo-1518770662639-470d65609e7c?w=1200';
        }}
        {...(props as any)}
      />
    );
  }
);

MediaRenderer.displayName = 'MediaRenderer';

export default MediaRenderer;
