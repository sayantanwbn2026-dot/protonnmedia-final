import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useProjects } from '@/hooks/useProjects';
import CinematicProjectView from '@/components/CinematicProjectView';
import { ProjectDetails } from '@/components/ProjectCinematicOverlay';

gsap.registerPlugin(ScrollTrigger);

const fallbackProjects: ProjectDetails[] = [
  { id: 1, title: 'Echoes of Tomorrow', category: 'Feature Film', year: '2024', image: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800', overview: 'A groundbreaking exploration of humanity\'s relationship with AI.', directorsCut: 'What does it mean to be human in an age of intelligent machines?', director: 'Alexandra Chen' },
  { id: 2, title: 'Urban Rhythms', category: 'Documentary', year: '2024', image: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=800', overview: 'Capturing the pulse of city life through street artists worldwide.', directorsCut: 'Cities breathe through art and culture.', director: 'Marcus Williams' },
  { id: 3, title: 'Neon Dreams', category: 'Short Film', year: '2023', image: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800', overview: 'Cyberpunk aesthetics meets Japanese folklore in futuristic Tokyo.', directorsCut: 'A love letter to anime and timeless myth.', director: 'Sofia Rodriguez' },
];

const BentoGrid = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const [panelProject, setPanelProject] = useState<ProjectDetails | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const { projects: cmsProjects, loading } = useProjects();

  const mappedProjects: ProjectDetails[] = cmsProjects.length > 0
    ? cmsProjects.map((p, i) => ({
      id: i + 1,
      slug: p.slug,
      title: p.title,
      category: p.category,
      year: p.year,
      image: p.cover_image_url || 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800',
      overview: p.overview || p.description,
      directorsCut: p.challenge || '',
      director: (p.team as any)?.[0]?.name || '',
    }))
    : (loading ? [] : fallbackProjects);

  useEffect(() => {
    if (mappedProjects.length === 0) return;
    const ctx = gsap.context(() => {
      gsap.utils.toArray('.bento-card').forEach((card: any) => {
        gsap.fromTo(card,
          { y: 80, opacity: 0 },
          {
            y: 0, opacity: 1, duration: 0.8, ease: 'power3.out',
            scrollTrigger: { trigger: card, start: 'top 90%', toggleActions: 'play none none reverse' },
          }
        );
      });
    }, sectionRef);
    return () => ctx.revert();
  }, [mappedProjects.length]);

  const openPanel = (project: ProjectDetails) => {
    setPanelProject(project);
    setIsPanelOpen(true);
  };

  return (
    <section ref={sectionRef} className="relative py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-16 flex items-end justify-between">
          <div>
            <span className="font-body text-[11px] text-muted-foreground uppercase tracking-[0.3em]">Selected Work</span>
            <h2 className="font-display text-4xl md:text-6xl lg:text-7xl tracking-tight mt-3">
              Stories we've <em className="text-primary">told</em>
            </h2>
          </div>
          <Link to="/work" data-cursor-hover className="hidden md:block font-body text-xs text-muted-foreground border-b border-border/40 hover:text-primary hover:border-primary transition-colors pb-0.5">
            View all work →
          </Link>
        </div>

        <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {mappedProjects.map((project) => (
            <article
              key={project.id}
              data-cursor-hover
              onClick={() => openPanel(project)}
              className="bento-card relative group overflow-hidden cursor-pointer aspect-[4/5] transition-all duration-300"
            >
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-[1.2s] ease-out group-hover:scale-105 grayscale group-hover:grayscale-0"
                style={{ backgroundImage: `url(${project.image})` }}
              />
              <div className="absolute inset-0 bg-background/70 group-hover:bg-background/50 transition-colors duration-500" />
              <div className="absolute inset-0 p-6 flex flex-col justify-end">
                <p className="font-body text-[10px] text-muted-foreground uppercase tracking-[0.2em] mb-2">
                  {project.category} — {project.year}
                </p>
                <h3 className="font-display text-xl md:text-2xl tracking-tight group-hover:text-primary transition-colors duration-300">
                  {project.title}
                </h3>
                <div className="w-0 group-hover:w-12 h-px bg-primary mt-3 transition-all duration-500" />
              </div>
            </article>
          ))}
        </div>

        <div className="md:hidden mt-8 text-center">
          <Link to="/work" data-cursor-hover className="font-body text-xs text-muted-foreground border-b border-border/40 hover:text-primary hover:border-primary transition-colors pb-0.5">
            View all work →
          </Link>
        </div>
      </div>

      <CinematicProjectView
        project={panelProject}
        isOpen={isPanelOpen}
        onClose={() => setIsPanelOpen(false)}
        showCaseStudyLink={true}
      />
    </section>
  );
};

export default BentoGrid;
