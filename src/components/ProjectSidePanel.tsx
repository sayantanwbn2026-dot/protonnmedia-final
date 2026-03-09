import { useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { X } from 'lucide-react';

export interface ProjectDetails {
  id: number;
  slug?: string;
  title: string;
  category: string;
  year: string;
  image: string;
  overview: string;
  directorsCut: string;
  director?: string;
  socialLinks?: { youtube?: string; instagram?: string; vimeo?: string };
}

interface ProjectSidePanelProps {
  project: ProjectDetails | null;
  isOpen: boolean;
  onClose: () => void;
  showCaseStudyLink?: boolean;
}

const ProjectSidePanel = ({ project, isOpen, onClose, showCaseStudyLink = true }: ProjectSidePanelProps) => {
  const panelRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && panelRef.current && overlayRef.current) {
      // Lock native scroll without Lenis interference
      const scrollY = window.scrollY;
      document.documentElement.style.overflow = 'hidden';
      document.documentElement.style.position = 'fixed';
      document.documentElement.style.top = `-${scrollY}px`;
      document.documentElement.style.width = '100%';
      document.documentElement.dataset.scrollY = String(scrollY);

      gsap.to(overlayRef.current, { opacity: 1, duration: 0.3, ease: 'power2.out' });
      gsap.to(panelRef.current, { x: 0, duration: 0.5, ease: 'power3.out' });
      if (contentRef.current) {
        gsap.fromTo(contentRef.current.children,
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, stagger: 0.06, duration: 0.5, delay: 0.2, ease: 'power3.out' }
        );
      }
    }
  }, [isOpen, project]);

  const handleClose = useCallback(() => {
    if (panelRef.current && overlayRef.current) {
      gsap.to(panelRef.current, { x: '100%', duration: 0.4, ease: 'power3.in' });
      gsap.to(overlayRef.current, {
        opacity: 0, duration: 0.3, delay: 0.1, ease: 'power2.in',
        onComplete: () => {
          // Restore scroll position exactly where it was
          const scrollY = parseInt(document.documentElement.dataset.scrollY || '0', 10);
          document.documentElement.style.overflow = '';
          document.documentElement.style.position = '';
          document.documentElement.style.top = '';
          document.documentElement.style.width = '';
          window.scrollTo(0, scrollY);
          onClose();
        },
      });
    }
  }, [onClose]);

  // Escape key support
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') handleClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, handleClose]);

  if (!project) return null;

  return (
    <div className={`fixed inset-0 z-50 ${isOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}>
      <div
        ref={overlayRef}
        className="absolute inset-0 bg-background/60 backdrop-blur-sm opacity-0"
        onClick={handleClose}
      />

      <div
        ref={panelRef}
        className="absolute right-0 top-0 h-full w-full max-w-md border-l border-border/10 overflow-y-auto bg-card/80 backdrop-blur-2xl shadow-[-20px_0_60px_-15px_hsl(var(--primary)/0.1)]"
        style={{ transform: 'translateX(100%)' }}
      >
        <button
          onClick={handleClose}
          data-cursor-hover
          className="sticky top-5 float-right mr-5 z-10 w-8 h-8 rounded-full bg-muted/50 backdrop-blur-md flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-muted/70 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div ref={contentRef} className="p-8 pt-16">
          <div className="aspect-video overflow-hidden rounded-sm mb-8">
            <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
          </div>

          <div className="mb-6">
            <span className="font-body text-[10px] text-muted-foreground uppercase tracking-[0.2em]">
              {project.category} — {project.year}
            </span>
            <h2 className="font-display text-2xl mt-1">{project.title}</h2>
          </div>

          <div className="mb-6">
            <h3 className="font-body text-[10px] text-muted-foreground uppercase tracking-[0.2em] mb-3">Overview</h3>
            <p className="font-body text-sm text-foreground/80 leading-relaxed">{project.overview}</p>
          </div>

          {project.directorsCut && (
            <div className="mb-6">
              <h3 className="font-body text-[10px] text-muted-foreground uppercase tracking-[0.2em] mb-3">
                {project.director ? `${project.director}'s Note` : "Director's Cut"}
              </h3>
              <div className="border-l-2 border-primary/30 pl-4">
                <p className="font-body text-sm text-foreground/70 italic leading-relaxed">"{project.directorsCut}"</p>
              </div>
            </div>
          )}

          <div className="pt-4 border-t border-border/10 flex flex-wrap gap-4">
            {showCaseStudyLink && project.slug && (
              <Link
                to={`/case-study/${project.slug}`}
                data-cursor-hover
                className="font-body text-xs text-primary border-b border-primary/40 hover:border-primary transition-colors"
                onClick={handleClose}
              >
                View case study →
              </Link>
            )}
            {project.socialLinks && Object.entries(project.socialLinks).map(([platform, url]) => (
              url && (
                <a key={platform} href={url} target="_blank" rel="noopener noreferrer" data-cursor-hover
                  className="font-body text-xs text-muted-foreground hover:text-primary transition-colors capitalize">
                  {platform}
                </a>
              )
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectSidePanel;
