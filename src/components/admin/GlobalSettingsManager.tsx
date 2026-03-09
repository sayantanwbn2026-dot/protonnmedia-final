import { useState, useEffect, useRef } from 'react';
import { useGlobalSettingsContext } from '@/contexts/GlobalSettingsContext';
import { toast } from 'sonner';
import { Save, Image, Film } from 'lucide-react';
import MediaUpload from './MediaUpload';
import { Skeleton } from '@/components/ui/skeleton';

const textSettings = [
  { key: 'hero_headline', label: 'Hero Headline', type: 'text', default: 'We craft visual stories' },
  { key: 'hero_subtitle', label: 'Hero Subtitle', type: 'text', default: 'Film & videography studio building cinematic experiences that move people.' },
  { key: 'marquee_text', label: 'Marquee Text', type: 'text', default: 'Film · Motion · Story · Vision · Cinema · Craft · ' },
  { key: 'contact_email', label: 'Contact Email', type: 'text', default: 'hello@protonnmedia.com' },
  { key: 'contact_phone', label: 'Contact Phone', type: 'text', default: '+1 (234) 567-890' },
  { key: 'contact_address', label: 'Studio Address', type: 'textarea', default: '123 Creative Avenue\nLos Angeles, CA 90028' },
  { key: 'footer_tagline', label: 'Footer Tagline', type: 'text', default: "Let's create together" },
  { key: 'query_destination_email', label: 'Contact Form Destination Email', type: 'text', default: 'hello@protonnmedia.com' },
];

const GlobalSettingsManager = () => {
  const { settings, loading, updateSetting } = useGlobalSettingsContext();
  const [form, setForm] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState<string | null>(null);

  // Hero local state — decoupled from server state
  const [heroMediaType, setHeroMediaType] = useState<'image' | 'video'>('image');
  const [heroMediaUrl, setHeroMediaUrl] = useState('');
  const [heroOpacity, setHeroOpacity] = useState(0.4);

  // Preloader local state
  const [preloaderUrl, setPreloaderUrl] = useState('');
  const [preloaderDuration, setPreloaderDuration] = useState(7);

  // Track whether user has unsaved hero changes
  const heroDirtyRef = useRef(false);
  // Track initial sync
  const initializedRef = useRef(false);

  // Only sync from server settings on FIRST load, not on every realtime update
  useEffect(() => {
    if (loading || initializedRef.current) return;
    initializedRef.current = true;

    const initial: Record<string, string> = {};
    textSettings.forEach((s) => {
      initial[s.key] = settings[s.key] ?? s.default;
    });
    setForm(initial);

    setHeroMediaType(((settings['hero_media_type'] as string) || 'image') as 'image' | 'video');
    setHeroMediaUrl((settings['hero_media_url'] as string) || '');
    setHeroOpacity(Number(settings['hero_opacity']) || 0.4);

    setPreloaderUrl((settings['preloader_video_url'] as string) || '');
    setPreloaderDuration(Number(settings['preloader_duration']) || 7);
  }, [loading, settings]);

  // For text settings, sync from server ONLY if user hasn't modified the field
  // (We track this simply: update form values that match the OLD server value)
  const prevSettingsRef = useRef<Record<string, any>>({});
  useEffect(() => {
    if (!initializedRef.current) return;
    // Update text fields that haven't been locally modified
    setForm((prev) => {
      const next = { ...prev };
      textSettings.forEach((s) => {
        const serverVal = settings[s.key] ?? s.default;
        const oldServerVal = prevSettingsRef.current[s.key] ?? s.default;
        // If the local value still matches the old server value, update it
        if (prev[s.key] === oldServerVal || prev[s.key] === undefined) {
          next[s.key] = serverVal;
        }
      });
      return next;
    });
    prevSettingsRef.current = { ...settings };
  }, [settings]);

  const handleSave = async (key: string) => {
    setSaving(key);
    const { error } = await updateSetting(key, form[key]);
    if (error) toast.error((error as any).message);
    else toast.success('Saved');
    setSaving(null);
  };

  const handleHeroSave = async () => {
    setSaving('hero');
    try {
      const results = await Promise.all([
        updateSetting('hero_media_type', heroMediaType),
        updateSetting('hero_media_url', heroMediaUrl),
        updateSetting('hero_opacity', heroOpacity),
      ]);
      const firstError = results.find(r => r.error);
      if (firstError?.error) {
        toast.error((firstError.error as any).message);
      } else {
        toast.success('Hero settings saved');
        heroDirtyRef.current = false;
      }
    } catch {
      toast.error('Failed to save hero settings');
    }
    setSaving(null);
  };

  const handlePreloaderSave = async () => {
    setSaving('preloader');
    try {
      const results = await Promise.all([
        updateSetting('preloader_video_url', preloaderUrl),
        updateSetting('preloader_duration', preloaderDuration.toString()),
      ]);
      const firstError = results.find(r => r.error);
      if (firstError?.error) {
        toast.error((firstError.error as any).message);
      } else {
        toast.success('Preloader settings saved');
      }
    } catch {
      toast.error('Failed to save preloader settings');
    }
    setSaving(null);
  };

  const inputClass = 'w-full px-3 py-2 bg-muted/30 border border-border/40 rounded-lg font-body text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/60 transition-colors';
  const sectionClass = 'space-y-4 p-5 bg-card/50 rounded-xl border border-border/20';

  if (loading) {
    return (
      <div className="space-y-6 max-w-2xl">
        <Skeleton className="h-8 w-48" />
        {[...Array(6)].map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-full" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <h2 className="font-display text-2xl mb-6">Global Settings</h2>

      {/* Hero Section Controller */}
      <div className={sectionClass + ' mb-6'}>
        <div className="flex items-center justify-between">
          <h3 className="font-display text-sm text-primary/80">Hero Background</h3>
          <button
            onClick={handleHeroSave}
            disabled={saving === 'hero'}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary font-body text-xs rounded-md hover:bg-primary/20 transition-colors border border-primary/20 disabled:opacity-50"
          >
            <Save className="w-3 h-3" /> {saving === 'hero' ? 'Saving...' : 'Save Hero'}
          </button>
        </div>

        {/* Media Type Toggle */}
        <div>
          <label className="font-body text-xs text-muted-foreground mb-2 block">Media Type</label>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => { setHeroMediaType('image'); heroDirtyRef.current = true; }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-body text-sm transition-colors border ${heroMediaType === 'image'
                  ? 'bg-primary/15 text-primary border-primary/30'
                  : 'text-muted-foreground border-border/30 hover:border-border/60'
                }`}
            >
              <Image className="w-4 h-4" /> Image
            </button>
            <button
              type="button"
              onClick={() => { setHeroMediaType('video'); heroDirtyRef.current = true; }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-body text-sm transition-colors border ${heroMediaType === 'video'
                  ? 'bg-primary/15 text-primary border-primary/30'
                  : 'text-muted-foreground border-border/30 hover:border-border/60'
                }`}
            >
              <Film className="w-4 h-4" /> Video
            </button>
          </div>
        </div>

        {/* Media Source */}
        <MediaUpload
          value={heroMediaUrl}
          onChange={(url) => { setHeroMediaUrl(url); heroDirtyRef.current = true; }}
          accept={heroMediaType === 'video' ? 'video/*' : 'image/*'}
          label={`Hero ${heroMediaType === 'video' ? 'Video' : 'Image'}`}
          maxSizeMB={heroMediaType === 'video' ? 15 : 5}
        />

        {/* Opacity Slider */}
        <div>
          <label className="font-body text-xs text-muted-foreground mb-2 block">
            Background Opacity: <span className="text-primary font-medium">{heroOpacity.toFixed(1)}</span>
          </label>
          <input
            type="range"
            min="0.1"
            max="1"
            step="0.1"
            value={heroOpacity}
            onChange={(e) => { setHeroOpacity(Number(e.target.value)); heroDirtyRef.current = true; }}
            className="w-full h-1.5 bg-muted/50 rounded-full appearance-none cursor-pointer accent-primary"
          />
          <div className="flex justify-between font-body text-[10px] text-muted-foreground/50 mt-1">
            <span>Darker</span>
            <span>Lighter</span>
          </div>
        </div>

        {/* Preview */}
        {heroMediaUrl && (
          <div className="relative rounded-lg overflow-hidden h-32">
            {heroMediaType === 'image' ? (
              <img src={heroMediaUrl} alt="Hero preview" className="w-full h-full object-cover" />
            ) : (
              <video src={heroMediaUrl} className="w-full h-full object-cover" muted autoPlay loop playsInline />
            )}
            <div className="absolute inset-0 bg-background" style={{ opacity: 1 - heroOpacity }} />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-display text-lg text-foreground">Preview</span>
            </div>
          </div>
        )}
      </div>

      {/* Preloader Section */}
      <div className={sectionClass + ' mb-6'}>
        <div className="flex items-center justify-between">
          <h3 className="font-display text-sm text-primary/80">Preloader Animation</h3>
          <button
            onClick={handlePreloaderSave}
            disabled={saving === 'preloader'}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary font-body text-xs rounded-md hover:bg-primary/20 transition-colors border border-primary/20 disabled:opacity-50"
          >
            <Save className="w-3 h-3" /> {saving === 'preloader' ? 'Saving...' : 'Save Preloader'}
          </button>
        </div>

        <MediaUpload
          value={preloaderUrl}
          onChange={setPreloaderUrl}
          accept="video/*"
          label="Preloader Intro Video"
          maxSizeMB={15}
        />

        <div className="mt-4">
          <label className="font-body text-xs text-muted-foreground mb-2 block">
            Max Duration (seconds): <span className="text-primary font-medium">{preloaderDuration}s</span>
          </label>
          <input
            type="range"
            min="1"
            max="8"
            step="1"
            value={preloaderDuration}
            onChange={(e) => setPreloaderDuration(Number(e.target.value))}
            className="w-full h-1.5 bg-muted/50 rounded-full appearance-none cursor-pointer accent-primary"
          />
          <div className="flex justify-between font-body text-[10px] text-muted-foreground/50 mt-1">
            <span>1s</span>
            <span>8s (Max)</span>
          </div>
        </div>

        {preloaderUrl && (
          <div className="relative rounded-lg overflow-hidden h-32 mt-4 bg-black">
            <video src={preloaderUrl} className="w-full h-full object-cover" muted autoPlay loop playsInline />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-2 text-center">
              <span className="font-display text-xs text-foreground/80">Plays for up to {preloaderDuration}s</span>
            </div>
          </div>
        )}
      </div>

      {/* Other Settings */}
      <div className={sectionClass}>
        <h3 className="font-display text-sm text-primary/80">Site Content</h3>
        <div className="space-y-4">
          {textSettings.map((config) => (
            <div key={config.key} className="flex items-start gap-3">
              <div className="flex-1">
                <label className="font-body text-xs text-muted-foreground mb-1 block">{config.label}</label>
                {config.type === 'textarea' ? (
                  <textarea
                    className={inputClass + ' min-h-[80px]'}
                    value={form[config.key] || ''}
                    onChange={(e) => setForm((prev) => ({ ...prev, [config.key]: e.target.value }))}
                  />
                ) : (
                  <input
                    className={inputClass}
                    value={form[config.key] || ''}
                    onChange={(e) => setForm((prev) => ({ ...prev, [config.key]: e.target.value }))}
                  />
                )}
              </div>
              <button
                onClick={() => handleSave(config.key)}
                disabled={saving === config.key}
                className="mt-5 p-2 text-muted-foreground hover:text-primary transition-colors disabled:opacity-50"
                title="Save"
              >
                <Save className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GlobalSettingsManager;
