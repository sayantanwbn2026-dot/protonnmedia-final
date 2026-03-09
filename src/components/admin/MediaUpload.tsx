import { useState, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Upload, X, Loader2, Link as LinkIcon, HardDrive } from 'lucide-react';

interface MediaUploadProps {
  value: string;
  onChange: (url: string) => void;
  accept?: string;
  label?: string;
  bucket?: string;
  maxSizeMB?: number;
}

const MediaUpload = ({ value, onChange, accept = 'image/*,video/*', label = 'Media', bucket = 'media', maxSizeMB }: MediaUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [mode, setMode] = useState<'upload' | 'url'>('upload');
  const [urlInput, setUrlInput] = useState(value || '');
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-detect max size: images 5MB, videos 15MB
  const getMaxSize = (file: File) => {
    if (maxSizeMB) return maxSizeMB;
    return file.type.startsWith('video/') ? 15 : 5;
  };

  const upload = async (file: File) => {
    const limit = getMaxSize(file);
    if (file.size > limit * 1024 * 1024) {
      toast.error(`File too large. Max ${limit}MB for ${file.type.startsWith('video/') ? 'videos' : 'images'}.`);
      return;
    }

    setUploading(true);
    const ext = file.name.split('.').pop();
    const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    const { error } = await supabase.storage.from(bucket).upload(path, file, {
      cacheControl: '3600',
      upsert: false,
    });

    if (error) {
      toast.error('Upload failed: ' + error.message);
      setUploading(false);
      return;
    }

    const { data: { publicUrl } } = supabase.storage.from(bucket).getPublicUrl(path);
    onChange(publicUrl);
    setUrlInput(publicUrl);
    toast.success('Uploaded successfully');
    setUploading(false);
  };

  const handleFile = (file: File | undefined) => {
    if (!file) return;
    upload(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const handleUrlApply = () => {
    onChange(urlInput.trim());
    if (urlInput.trim()) toast.success('URL applied');
  };

  const isImage = value && /\.(jpg|jpeg|png|gif|webp|svg|avif)(\?.*)?$/i.test(value);
  const isVideo = value && /\.(mp4|webm|mov|ogg)(\?.*)?$/i.test(value);

  const tabClass = (active: boolean) =>
    `flex-1 flex items-center justify-center gap-1.5 py-1.5 font-body text-xs rounded transition-colors ${
      active ? 'bg-primary/15 text-primary border border-primary/30' : 'text-muted-foreground hover:text-foreground border border-transparent'
    }`;

  return (
    <div className="space-y-2">
      <label className="font-body text-xs text-muted-foreground block">{label}</label>

      {/* Preview */}
      {value && (
        <div className="relative group rounded-lg border border-border/20 overflow-hidden">
          {isImage ? (
            <img src={value} alt="" className="w-full h-32 object-cover" />
          ) : isVideo ? (
            <video src={value} className="w-full h-32 object-cover" muted />
          ) : (
            <div className="w-full h-16 flex items-center justify-center bg-muted/20">
              <span className="font-body text-xs text-muted-foreground truncate px-4 max-w-full">{value}</span>
            </div>
          )}
          <div className="absolute inset-0 bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <button type="button" onClick={() => inputRef.current?.click()} className="px-3 py-1.5 bg-primary text-primary-foreground font-body text-xs rounded hover:bg-primary/90 transition-colors">
              Replace
            </button>
            <button type="button" onClick={() => { onChange(''); setUrlInput(''); }} className="p-1.5 text-muted-foreground hover:text-destructive transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Mode Toggle */}
      <div className="flex gap-1 p-0.5 bg-muted/30 rounded-lg">
        <button type="button" onClick={() => setMode('upload')} className={tabClass(mode === 'upload')}>
          <HardDrive className="w-3 h-3" /> Upload
        </button>
        <button type="button" onClick={() => setMode('url')} className={tabClass(mode === 'url')}>
          <LinkIcon className="w-3 h-3" /> URL
        </button>
      </div>

      {mode === 'upload' ? (
        <div
          onClick={() => !uploading && inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className={`w-full h-24 border-2 border-dashed rounded-lg flex flex-col items-center justify-center gap-1.5 cursor-pointer transition-all ${
            dragOver ? 'border-primary bg-primary/5' : 'border-border/30 hover:border-primary/40 hover:bg-muted/10'
          }`}
        >
          {uploading ? (
            <Loader2 className="w-5 h-5 text-primary animate-spin" />
          ) : (
            <>
              <Upload className="w-4 h-4 text-muted-foreground" />
              <span className="font-body text-xs text-muted-foreground">Drop file or click</span>
              <span className="font-body text-[10px] text-muted-foreground/60">Images: max 5MB · Videos: max 15MB</span>
            </>
          )}
        </div>
      ) : (
        <div className="flex gap-2">
          <input
            type="text"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="https://example.com/media.jpg"
            className="flex-1 px-3 py-2 bg-muted/30 border border-border rounded-lg font-body text-xs text-foreground focus:outline-none focus:border-primary transition-colors"
          />
          <button type="button" onClick={handleUrlApply} className="px-3 py-2 bg-primary/15 text-primary font-body text-xs rounded-lg hover:bg-primary/25 transition-colors border border-primary/20">
            Apply
          </button>
        </div>
      )}

      <input ref={inputRef} type="file" accept={accept} className="hidden" onChange={(e) => handleFile(e.target.files?.[0])} />
    </div>
  );
};

export default MediaUpload;
