import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Footer from '@/components/Footer';
import { useProjects } from '@/hooks/useProjects';
import CinematicProjectView from '@/components/CinematicProjectView';
import { ProjectDetails } from '@/components/ProjectCinematicOverlay';

gsap.registerPlugin(ScrollTrigger);

const Work = () => {
  const [panelProject, setPanelProject] = useState<ProjectDetails | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const gridRef = useRef<HTMLDivElement>(null);
  const { projects, loading } = useProjects();

  const mappedProjects: ProjectDetails[] = projects.map((p, i) => ({
    id: i + 1,
    slug: p.slug,
    title: p.title,
    category: p.category,
    year: p.year,
    image: p.cover_image_url || 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800',
    overview: p.overview || p.description,
    directorsCut: p.challenge || '',
    director: (p.team as any)?.[0]?.name || '',
  }));

  useEffect(() => {
    if (loading || mappedProjects.length === 0) return;
    const ctx = gsap.context(() => {
      gsap.utils.toArray('.work-card').forEach((card: any, i) => {
        gsap.fromTo(card,
          { y: 60, opacity: 0 },
          {
            y: 0, opacity: 1, duration: 0.7, ease: 'power3.out', delay: i * 0.06,
            scrollTrigger: { trigger: card, start: 'top 90%', toggleActions: 'play none none reverse' }
          }
        );
      });
    }, gridRef);
    return () => ctx.revert();
  }, [loading, mappedProjects.length]);

  const openPanel = (project: ProjectDetails) => {
    setPanelProject(project);
    setIsPanelOpen(true);
  };

  return (
    <>
      <main className="relative pt-24 pb-0 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <span className="font-body text-[11px] text-muted-foreground uppercase tracking-[0.3em]">Portfolio</span>
            <h1 className="font-display text-5xl md:text-7xl tracking-tight mt-3">Our work</h1>
          </div>

          {loading ? (
            <p className="font-body text-sm text-muted-foreground">Loading...</p>
          ) : (
            <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {mappedProjects.map((project) => (
                <article
                  key={project.id}
                  data-cursor-hover
                  onClick={() => openPanel(project)}
                  className="work-card group relative aspect-[4/5] overflow-hidden cursor-pointer transition-all duration-300"
                >
                  <img src={project.image} alt={project.title} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-background/60 group-hover:bg-background/40 transition-colors duration-500" />
                  <div className="absolute inset-0 p-6 flex flex-col justify-end">
                    <p className="font-body text-[10px] text-muted-foreground uppercase tracking-[0.2em] mb-2">{project.category} — {project.year}</p>
                    <h3 className="font-display text-xl tracking-tight group-hover:text-primary transition-colors duration-300">{project.title}</h3>
                    <div className="w-0 group-hover:w-10 h-px bg-primary mt-3 transition-all duration-500" />
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </main>

      <CinematicProjectView
        project={panelProject}
        isOpen={isPanelOpen}
        onClose={() => setIsPanelOpen(false)}
        showCaseStudyLink={true}
      />

      <Footer />
    </>
  );
};

export default Work;
