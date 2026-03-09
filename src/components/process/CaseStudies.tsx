import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight } from 'lucide-react';
import { useProjects } from '@/hooks/useProjects';

gsap.registerPlugin(ScrollTrigger);

const CaseStudies = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<(HTMLAnchorElement | null)[]>([]);
  const { projects, loading } = useProjects();

  useEffect(() => {
    if (loading || projects.length === 0) return;
    const ctx = gsap.context(() => {
      gsap.from('.case-studies-header', {
        y: 60, opacity: 0, duration: 1, ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' },
      });
      cardsRef.current.forEach((card, index) => {
        if (!card) return;
        gsap.from(card, {
          y: 80, opacity: 0, duration: 0.8, delay: index * 0.1, ease: 'power3.out',
          scrollTrigger: { trigger: card, start: 'top 85%', toggleActions: 'play none none reverse' },
        });
      });
    }, sectionRef);
    return () => ctx.revert();
  }, [loading, projects.length]);

  return (
    <section ref={sectionRef} className="py-20 px-6 relative overflow-hidden">
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full blur-3xl opacity-10 pointer-events-none" style={{ background: 'hsl(42 92% 56% / 0.15)' }} />

      <div className="max-w-7xl mx-auto">
        <div className="case-studies-header text-center mb-14">
          <div className="inline-flex items-center gap-4 mb-5">
            <div className="w-12 h-px bg-gradient-to-r from-transparent via-primary to-transparent" />
            <span className="font-body text-xs text-primary uppercase tracking-[0.4em]">Real Results</span>
            <div className="w-12 h-px bg-gradient-to-r from-transparent via-primary to-transparent" />
          </div>
          <h2 className="font-display text-4xl md:text-6xl font-bold mb-5">
            Case<span className="text-gradient-gold"> Studies</span>
          </h2>
          <p className="font-body text-muted-foreground/80 max-w-2xl mx-auto">
            See how our methodology translates into award-winning work across diverse industries.
          </p>
        </div>

        {loading ? (
          <p className="font-body text-sm text-muted-foreground text-center">Loading...</p>
        ) : (
          <div className="grid gap-6" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 340px), 1fr))' }}>
            {projects.map((project, index) => (
              <Link
                to={`/case-study/${project.slug}`}
                key={project.id}
                ref={(el) => { if (el) cardsRef.current[index] = el; }}
                className="group relative block"
                data-cursor-hover
              >
                <div className="glass-card-glow rounded-2xl overflow-hidden transition-all duration-500 hover:border-primary/40 hover:shadow-gold-soft h-full">
                  <div className="relative h-52 overflow-hidden">
                    <img
                      src={project.cover_image_url || 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=600'}
                      alt={project.title}
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
                    <div className="absolute top-4 left-4 px-4 py-1.5 rounded-full bg-primary/20 backdrop-blur-sm border border-primary/30">
                      <span className="font-body text-xs text-primary font-medium uppercase tracking-wider">{project.process_step}</span>
                    </div>
                    <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-primary/20 backdrop-blur-sm border border-primary/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:scale-110">
                      <ArrowUpRight className="w-5 h-5 text-primary" />
                    </div>
                  </div>
                  <div className="p-5">
                    <span className="font-body text-xs text-muted-foreground/60 uppercase tracking-wider">{project.client}</span>
                    <h3 className="font-display text-xl font-bold mt-1 mb-2 group-hover:text-primary transition-colors">{project.title}</h3>
                    <p className="font-body text-sm text-muted-foreground/80 leading-relaxed mb-3">{project.description}</p>
                    <div className="flex items-center gap-2 pt-3 border-t border-border/30">
                      <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                      <span className="font-body text-xs text-primary font-medium">{project.outcome}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default CaseStudies;
