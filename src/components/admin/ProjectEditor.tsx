import { useState } from 'react';
import { Project } from '@/hooks/useProjects';
import { ArrowLeft } from 'lucide-react';
import MediaUpload from './MediaUpload';
import RepeatableFields from './RepeatableFields';

interface ProjectEditorProps {
  project: Project | null;
  onSave: (data: Partial<Project>) => Promise<void>;
  onCancel: () => void;
}

const steps = ['Ideation', 'Scripting', 'Pre-Production', 'Shooting', 'Post-Production'];
const categories = ['Film', 'Documentary', 'Short Film', 'Series', 'Commercial', 'Music Video', 'Identity'];

const ProjectEditor = ({ project, onSave, onCancel }: ProjectEditorProps) => {
  const [form, setForm] = useState({
    slug: project?.slug || '',
    title: project?.title || '',
    client: project?.client || '',
    category: project?.category || 'Film',
    process_step: project?.process_step || 'Ideation',
    cover_image_url: project?.cover_image_url || '',
    hero_video_url: project?.hero_video_url || '',
    description: project?.description || '',
    outcome: project?.outcome || '',
    year: project?.year || new Date().getFullYear().toString(),
    duration: project?.duration || '',
    overview: project?.overview || '',
    challenge: project?.challenge || '',
    solution: project?.solution || '',
    sort_order: project?.sort_order || 0,
    is_published: project?.is_published ?? true,
    team: (project?.team || []) as { role: string; name: string }[],
    behind_the_scenes: (project?.behind_the_scenes || []) as { title: string; description: string; image: string }[],
    videos: (project?.videos || []) as { title: string; url: string; thumbnail: string }[],
    stats: (project?.stats || []) as { label: string; value: string }[],
    awards: (project?.awards || []) as string[],
    testimonial_quote: (project?.testimonial as any)?.quote || '',
    testimonial_author: (project?.testimonial as any)?.author || '',
    testimonial_role: (project?.testimonial as any)?.role || '',
  });
  const [saving, setSaving] = useState(false);

  const set = (key: string, value: any) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const testimonial = form.testimonial_quote
      ? { quote: form.testimonial_quote, author: form.testimonial_author, role: form.testimonial_role }
      : null;
    await onSave({
      slug: form.slug,
      title: form.title,
      client: form.client,
      category: form.category,
      process_step: form.process_step,
      cover_image_url: form.cover_image_url || null,
      hero_video_url: form.hero_video_url || null,
      description: form.description,
      outcome: form.outcome,
      year: form.year,
      duration: form.duration,
      overview: form.overview,
      challenge: form.challenge,
      solution: form.solution,
      sort_order: Number(form.sort_order),
      is_published: form.is_published,
      team: form.team,
      behind_the_scenes: form.behind_the_scenes,
      videos: form.videos,
      stats: form.stats,
      awards: form.awards.filter(Boolean),
      testimonial,
    } as any);
    setSaving(false);
  };

  const inputClass = 'w-full px-3 py-2 bg-muted/30 border border-border/40 rounded-lg font-body text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/60 transition-colors';
  const labelClass = 'font-body text-xs text-muted-foreground mb-1 block';
  const sectionClass = 'space-y-4 p-5 bg-card/50 rounded-xl border border-border/20';

  return (
    <div>
      <button onClick={onCancel} className="flex items-center gap-2 font-body text-sm text-muted-foreground hover:text-primary transition-colors mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to projects
      </button>

      <h2 className="font-display text-2xl mb-6">{project ? 'Edit Project' : 'New Project'}</h2>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
        {/* Basic Info */}
        <div className={sectionClass}>
          <h3 className="font-display text-sm text-primary/80">Basic Info</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Title *</label>
              <input className={inputClass} value={form.title} onChange={(e) => set('title', e.target.value)} required />
            </div>
            <div>
              <label className={labelClass}>Slug *</label>
              <input className={inputClass} value={form.slug} onChange={(e) => set('slug', e.target.value)} required placeholder="my-project" />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className={labelClass}>Client</label>
              <input className={inputClass} value={form.client} onChange={(e) => set('client', e.target.value)} />
            </div>
            <div>
              <label className={labelClass}>Category</label>
              <select className={inputClass} value={form.category} onChange={(e) => set('category', e.target.value)}>
                {categories.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>Process Step</label>
              <select className={inputClass} value={form.process_step} onChange={(e) => set('process_step', e.target.value)}>
                {steps.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className={labelClass}>Year</label>
              <input className={inputClass} value={form.year} onChange={(e) => set('year', e.target.value)} />
            </div>
            <div>
              <label className={labelClass}>Duration</label>
              <input className={inputClass} value={form.duration} onChange={(e) => set('duration', e.target.value)} />
            </div>
            <div>
              <label className={labelClass}>Sort Order</label>
              <input type="number" className={inputClass} value={form.sort_order} onChange={(e) => set('sort_order', e.target.value)} />
            </div>
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.is_published} onChange={(e) => set('is_published', e.target.checked)} className="accent-primary w-4 h-4" />
            <span className="font-body text-sm">Published</span>
          </label>
        </div>

        {/* Media */}
        <div className={sectionClass}>
          <h3 className="font-display text-sm text-primary/80">Media</h3>
          <div className="grid grid-cols-2 gap-4">
            <MediaUpload value={form.cover_image_url} onChange={(url) => set('cover_image_url', url)} accept="image/*" label="Cover Image" maxSizeMB={5} />
            <MediaUpload value={form.hero_video_url} onChange={(url) => set('hero_video_url', url)} accept="video/*" label="Hero Video" maxSizeMB={15} />
          </div>
        </div>

        {/* Content */}
        <div className={sectionClass}>
          <h3 className="font-display text-sm text-primary/80">Content</h3>
          <div>
            <label className={labelClass}>Description</label>
            <textarea className={inputClass + ' min-h-[80px]'} value={form.description} onChange={(e) => set('description', e.target.value)} />
          </div>
          <div>
            <label className={labelClass}>Outcome</label>
            <input className={inputClass} value={form.outcome} onChange={(e) => set('outcome', e.target.value)} />
          </div>
          <div>
            <label className={labelClass}>Overview</label>
            <textarea className={inputClass + ' min-h-[80px]'} value={form.overview} onChange={(e) => set('overview', e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Challenge</label>
              <textarea className={inputClass + ' min-h-[80px]'} value={form.challenge} onChange={(e) => set('challenge', e.target.value)} />
            </div>
            <div>
              <label className={labelClass}>Solution</label>
              <textarea className={inputClass + ' min-h-[80px]'} value={form.solution} onChange={(e) => set('solution', e.target.value)} />
            </div>
          </div>
        </div>

        {/* Team */}
        <div className={sectionClass}>
          <RepeatableFields
            label="Team Members"
            fields={[
              { key: 'name', label: 'Name', placeholder: 'John Doe' },
              { key: 'role', label: 'Role', placeholder: 'Director' },
            ]}
            value={form.team}
            onChange={(v) => set('team', v)}
          />
        </div>

        {/* Behind the Scenes */}
        <div className={sectionClass}>
          <RepeatableFields
            label="Behind the Scenes"
            fields={[
              { key: 'title', label: 'Title', placeholder: 'On Set' },
              { key: 'description', label: 'Description', type: 'textarea', placeholder: 'Brief description...' },
              { key: 'image', label: 'Image URL', type: 'url', placeholder: 'https://...' },
            ]}
            value={form.behind_the_scenes}
            onChange={(v) => set('behind_the_scenes', v)}
          />
        </div>

        {/* Videos */}
        <div className={sectionClass}>
          <RepeatableFields
            label="Videos"
            fields={[
              { key: 'title', label: 'Title', placeholder: 'Trailer' },
              { key: 'url', label: 'Video URL', type: 'url', placeholder: 'https://vimeo.com/...' },
              { key: 'thumbnail', label: 'Thumbnail URL', type: 'url', placeholder: 'https://...' },
            ]}
            value={form.videos}
            onChange={(v) => set('videos', v)}
          />
        </div>

        {/* Stats */}
        <div className={sectionClass}>
          <RepeatableFields
            label="Stats"
            fields={[
              { key: 'label', label: 'Label', placeholder: 'Views' },
              { key: 'value', label: 'Value', placeholder: '1.2M' },
            ]}
            value={form.stats}
            onChange={(v) => set('stats', v)}
          />
        </div>

        {/* Awards */}
        <div className={sectionClass}>
          <RepeatableFields
            label="Awards"
            fields={[{ key: 'name', label: 'Award Name', placeholder: 'Cannes Lions Gold' }]}
            value={form.awards.map((a) => ({ name: a }))}
            onChange={(v) => set('awards', v.map((r) => r.name))}
          />
        </div>

        {/* Testimonial */}
        <div className={sectionClass}>
          <h3 className="font-display text-sm text-primary/80">Testimonial</h3>
          <div>
            <label className={labelClass}>Quote</label>
            <textarea className={inputClass + ' min-h-[60px]'} value={form.testimonial_quote} onChange={(e) => set('testimonial_quote', e.target.value)} placeholder="What the client said..." />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Author</label>
              <input className={inputClass} value={form.testimonial_author} onChange={(e) => set('testimonial_author', e.target.value)} placeholder="Jane Smith" />
            </div>
            <div>
              <label className={labelClass}>Role</label>
              <input className={inputClass} value={form.testimonial_role} onChange={(e) => set('testimonial_role', e.target.value)} placeholder="CEO, Company" />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-2 pb-8">
          <button type="submit" disabled={saving} className="px-6 py-2.5 bg-primary text-primary-foreground font-body text-sm rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50">
            {saving ? 'Saving...' : 'Save Project'}
          </button>
          <button type="button" onClick={onCancel} className="px-6 py-2.5 border border-border/40 font-body text-sm rounded-lg hover:border-primary/40 transition-colors">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProjectEditor;
