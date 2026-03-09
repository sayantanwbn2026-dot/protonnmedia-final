import { useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { X, ArrowRight } from 'lucide-react';
import { ProjectDetails } from './ProjectCinematicOverlay';

interface Props {
  project: ProjectDetails | null;
  isOpen: boolean;
  onClose: () => void;
  showCaseStudyLink?: boolean;
}

const CinematicProjectView = ({ project, isOpen, onClose, showCaseStudyLink = true }: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (!isOpen || !containerRef.current || !project) return;

    // Prevent body caching scroll glitches by simply hiding overflow
    document.body.style.overflow = 'hidden';

    // Initial state
    gsap.set(containerRef.current, { opacity: 0, pointerEvents: 'auto', backdropFilter: 'blur(0px)' });
    if (cardRef.current) gsap.set(cardRef.current, { y: 40, opacity: 0, scale: 0.95 });

    // Animate In - Fade and blur background
    gsap.to(containerRef.current, {
      opacity: 1,
      backdropFilter: 'blur(20px)',
      duration: 0.5,
      ease: 'power3.out'
    });

    // Animate the card up
    if (cardRef.current) {
      gsap.to(cardRef.current, {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 0.6,
        delay: 0.1,
        ease: 'back.out(1.2)'
      });
    }

    if (imageRef.current) {
      gsap.fromTo(imageRef.current,
        { scale: 1.1 },
        { scale: 1, duration: 1.2, ease: 'power2.out' }
      );
    }

    if (contentRef.current) {
      gsap.fromTo(
        contentRef.current.children,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.05, duration: 0.5, delay: 0.3, ease: 'power3.out' }
      );
    }
  }, [isOpen, project]);

  const handleClose = useCallback(() => {
    if (!containerRef.current) return;

    if (cardRef.current) {
      gsap.to(cardRef.current, { y: 20, opacity: 0, scale: 0.95, duration: 0.3, ease: 'power3.in' });
    }

    gsap.to(containerRef.current, {
      opacity: 0,
      backdropFilter: 'blur(0px)',
      duration: 0.4,
      delay: 0.1,
      ease: 'power3.inOut',
      onComplete: () => {
        if (containerRef.current) gsap.set(containerRef.current, { pointerEvents: 'none' });
        document.body.style.overflow = '';
        onClose();
      },
    });
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') handleClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, handleClose]);

  if (!project) return null;

  return createPortal(
    <div
      ref={containerRef}
      className={`fixed top-0 left-0 w-[100vw] h-[100vh] z-[100] flex flex-col items-center justify-center p-4 md:p-8 bg-background/60 opacity-0 ${isOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}
      onClick={(e) => {
        if (e.target === containerRef.current) handleClose();
      }}
    >
      {/* Floating Detailed Card */}
      <div
        ref={cardRef}
        className="relative w-full max-w-5xl bg-card border border-border/20 shadow-2xl rounded-2xl md:rounded-3xl overflow-hidden flex flex-col md:flex-row min-h-[50vh] max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          data-cursor-hover
          className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-background/50 backdrop-blur-md border border-white/10 flex items-center justify-center text-foreground hover:bg-white hover:text-black transition-all duration-300 group"
        >
          <X className="w-5 h-5 transition-transform duration-300 group-hover:rotate-90" />
        </button>

        {/* Image Section */}
        <div className="w-full md:w-1/2 min-h-[250px] md:min-h-full relative overflow-hidden flex-shrink-0 border-b md:border-b-0 md:border-r border-border/10">
          <img
            ref={imageRef}
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-50" />
        </div>

        {/* Content Section */}
        <div className="w-full md:w-1/2 flex-1 p-6 md:p-10 lg:p-14 flex flex-col overflow-y-auto bg-card min-h-0">
          <div ref={contentRef} className="my-auto">
            <div className="mb-6">
              <span className="font-body text-[10px] text-primary uppercase tracking-[0.2em] px-2 py-1 rounded border border-primary/20 bg-primary/5">
                {project.category} — {project.year}
              </span>
            </div>

            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl tracking-tight mb-4">
              {project.title}
            </h2>

            {project.director && (
              <span className="font-body text-sm text-muted-foreground block mb-6">
                Directed by <span className="text-foreground">{project.director}</span>
              </span>
            )}

            <div className="w-12 h-px bg-primary mb-6" />

            <div className="mb-8">
              <h3 className="font-body text-[10px] text-muted-foreground uppercase tracking-[0.2em] mb-3">
                Overview
              </h3>
              <p className="font-body text-sm md:text-base text-foreground/80 leading-relaxed">
                {project.overview}
              </p>
            </div>

            {project.directorsCut && (
              <div className="mb-10 bg-muted/30 p-5 rounded-lg border border-border/10 border-l-2 border-l-primary">
                <h3 className="font-body text-[10px] text-muted-foreground uppercase tracking-[0.2em] mb-3">
                  Director's Note
                </h3>
                <p className="font-body text-sm text-foreground/90 italic leading-relaxed">
                  "{project.directorsCut}"
                </p>
              </div>
            )}

            <div className="mt-auto pt-6 flex flex-wrap items-center gap-6">
              {showCaseStudyLink && project.slug && (
                <Link
                  to={`/case-study/${project.slug}`}
                  data-cursor-hover
                  className="group relative inline-flex items-center gap-2 px-6 py-3 font-body text-xs uppercase tracking-widest text-background bg-foreground rounded-full font-semibold transition-transform hover:scale-105 active:scale-95"
                  onClick={handleClose}
                >
                  View case study <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
                </Link>
              )}

              <div className="flex gap-4">
                {project.socialLinks && Object.entries(project.socialLinks).map(([platform, url]) => (
                  url && (
                    <a key={platform} href={url} target="_blank" rel="noopener noreferrer" data-cursor-hover
                      className="font-body text-xs text-muted-foreground hover:text-foreground transition-colors capitalize underline underline-offset-4 decoration-border hover:decoration-foreground">
                      {platform}
                    </a>
                  )
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default CinematicProjectView;
