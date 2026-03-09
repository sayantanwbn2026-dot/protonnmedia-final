import { useParams, Link } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowLeft, Play, Award, Quote } from 'lucide-react';
import Footer from '@/components/Footer';
import { useProjects } from '@/hooks/useProjects';

gsap.registerPlugin(ScrollTrigger);

const CaseStudyDetail = () => {
  const { id } = useParams<{ id: string }>();
  const heroRef = useRef<HTMLDivElement>(null);
  const { projects, loading, getProjectBySlug } = useProjects();

  const study = getProjectBySlug(id || '');

  useEffect(() => {
    if (!study) return;
    const ctx = gsap.context(() => {
      gsap.from(heroRef.current?.querySelectorAll('.anim') || [], {
        y: 60, opacity: 0, stagger: 0.1, duration: 1, ease: 'power3.out',
      });
      gsap.utils.toArray('.cs-section').forEach((section: any) => {
        gsap.fromTo(section,
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out',
            scrollTrigger: { trigger: section, start: 'top 88%', toggleActions: 'play none none reverse' } }
        );
      });
    });
    return () => ctx.revert();
  }, [study]);

  if (loading) {
    return (
      <main className="relative min-h-screen flex items-center justify-center">
        <p className="font-body text-sm text-muted-foreground">Loading...</p>
      </main>
    );
  }

  if (!study) {
    return (
      <main className="relative min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-display text-4xl mb-4">Not Found</h1>
          <Link to="/process" className="text-primary font-body text-sm">← Back to Process</Link>
        </div>
      </main>
    );
  }

  const currentIndex = projects.findIndex((s) => s.slug === id);
  const nextStudy = projects[(currentIndex + 1) % projects.length];
  const team = (study.team || []) as { role: string; name: string }[];
  const stats = (study.stats || []) as { label: string; value: string }[];
  const videos = (study.videos || []) as { title: string; url: string; thumbnail: string }[];
  const behindTheScenes = (study.behind_the_scenes || []) as { title: string; description: string; image: string }[];
  const awards = study.awards || [];
  const testimonial = study.testimonial as { quote: string; author: string; role: string } | null;

  return (
    <main className="relative">
      {/* Hero */}
      <section ref={heroRef} className="relative min-h-[70vh] flex items-end pb-12">
        <div className="absolute inset-0">
          <img src={study.cover_image_url || ''} alt={study.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/30" />
        </div>
        <div className="relative max-w-5xl mx-auto px-6 w-full">
          <Link to="/process" className="anim inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-5 group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="font-body text-xs uppercase tracking-wider">Back</span>
          </Link>
          <div className="anim">
            <span className="font-body text-[10px] text-primary uppercase tracking-[0.2em]">{study.process_step} — {study.year}</span>
          </div>
          <h1 className="anim font-display text-4xl md:text-6xl lg:text-7xl tracking-tight mt-2 mb-3">{study.title}</h1>
          <p className="anim font-body text-muted-foreground">for <span className="text-primary">{study.client}</span></p>
          <div className="anim flex flex-wrap gap-8 mt-6">
            {stats.slice(0, 3).map((stat) => (
              <div key={stat.label}>
                <p className="font-display text-2xl md:text-3xl text-primary">{stat.value}</p>
                <p className="font-body text-[10px] text-muted-foreground uppercase tracking-wider">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Two-column content with sticky sidebar */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto grid md:grid-cols-[1fr_320px] gap-12">
          {/* Left: scrollable content */}
          <div>
            <div className="cs-section mb-12">
              <h2 className="font-display text-2xl mb-4">Overview</h2>
              <p className="font-body text-muted-foreground leading-relaxed">{study.overview}</p>
            </div>
            <div className="cs-section grid sm:grid-cols-2 gap-8 mb-12">
              <div className="border-l border-primary/20 pl-6">
                <h3 className="font-display text-lg text-primary mb-3">Challenge</h3>
                <p className="font-body text-sm text-muted-foreground leading-relaxed">{study.challenge}</p>
              </div>
              <div className="border-l border-primary/20 pl-6">
                <h3 className="font-display text-lg text-primary mb-3">Solution</h3>
                <p className="font-body text-sm text-muted-foreground leading-relaxed">{study.solution}</p>
              </div>
            </div>

            {/* Behind the Scenes inline */}
            {behindTheScenes.length > 0 && (
              <div className="cs-section mb-12">
                <h2 className="font-display text-2xl mb-8">Behind the <em className="text-primary">scenes</em></h2>
                <div className="space-y-12">
                  {behindTheScenes.map((bts, index) => (
                    <div key={bts.title} className={`grid sm:grid-cols-2 gap-6 items-center`}>
                      <div className={index % 2 === 1 ? 'sm:order-2' : ''}>
                        <div className="aspect-[4/3] overflow-hidden">
                          <img src={bts.image} alt={bts.title} className="w-full h-full object-cover" />
                        </div>
                      </div>
                      <div className={index % 2 === 1 ? 'sm:order-1' : ''}>
                        <span className="font-body text-[10px] text-primary uppercase tracking-wider">Step {index + 1}</span>
                        <h3 className="font-display text-xl mt-1 mb-3">{bts.title}</h3>
                        <p className="font-body text-sm text-muted-foreground leading-relaxed">{bts.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right: sticky details panel */}
          <aside className="hidden md:block">
            <div className="sticky top-24 space-y-8">
              {/* Team */}
              {team.length > 0 && (
                <div>
                  <h3 className="font-body text-[10px] text-muted-foreground uppercase tracking-[0.2em] mb-4">The team</h3>
                  <div className="space-y-3">
                    {team.map((member) => (
                      <div key={member.name} className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                          <span className="font-display text-xs text-primary">{member.name.charAt(0)}</span>
                        </div>
                        <div>
                          <p className="font-body text-sm">{member.name}</p>
                          <p className="font-body text-[10px] text-muted-foreground">{member.role}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Stats */}
              {stats.length > 0 && (
                <div>
                  <h3 className="font-body text-[10px] text-muted-foreground uppercase tracking-[0.2em] mb-4">Results</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {stats.map((stat) => (
                      <div key={stat.label} className="border border-border/10 p-3 text-center">
                        <p className="font-display text-lg text-primary">{stat.value}</p>
                        <p className="font-body text-[9px] text-muted-foreground uppercase tracking-wider">{stat.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Awards */}
              {awards.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Award className="w-4 h-4 text-primary" />
                    <h3 className="font-body text-[10px] text-muted-foreground uppercase tracking-[0.2em]">Awards</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {awards.map((award) => (
                      <span key={award} className="font-body text-[10px] text-primary border border-primary/20 px-3 py-1.5">{award}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Testimonial */}
              {testimonial && (
                <div>
                  <Quote className="w-5 h-5 text-primary/20 mb-2" />
                  <blockquote className="font-display text-sm italic leading-relaxed mb-3">
                    "{testimonial.quote}"
                  </blockquote>
                  <p className="font-body text-xs">{testimonial.author}</p>
                  <p className="font-body text-[10px] text-muted-foreground">{testimonial.role}</p>
                </div>
              )}
            </div>
          </aside>
        </div>
      </section>

      {/* Videos */}
      {videos.length > 0 && (
        <section className="py-16 px-6">
          <div className="max-w-5xl mx-auto">
            <h2 className="cs-section font-display text-2xl text-center mb-10">Watch the <em className="text-primary">film</em></h2>
            <div className="cs-section grid sm:grid-cols-2 gap-6">
              {videos.map((video) => (
                <div key={video.title} className="group relative cursor-pointer" data-cursor-hover>
                  <div className="relative aspect-video overflow-hidden">
                    <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-background/40 group-hover:bg-background/20 transition-colors" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-14 h-14 rounded-full border border-primary/50 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Play className="w-5 h-5 text-primary ml-0.5" />
                      </div>
                    </div>
                  </div>
                  <h3 className="font-display text-base mt-3">{video.title}</h3>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Mobile-only details (team, stats, awards, testimonial) */}
      <section className="md:hidden py-12 px-6">
        <div className="max-w-3xl mx-auto space-y-10">
          {team.length > 0 && (
            <div className="cs-section">
              <h2 className="font-display text-2xl mb-4">The team</h2>
              <div className="grid grid-cols-2 gap-4">
                {team.map((member) => (
                  <div key={member.name}>
                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center mb-2">
                      <span className="font-display text-sm text-primary">{member.name.charAt(0)}</span>
                    </div>
                    <p className="font-body text-sm">{member.name}</p>
                    <p className="font-body text-xs text-muted-foreground">{member.role}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {stats.length > 0 && (
            <div className="cs-section grid grid-cols-2 gap-4">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center border border-border/10 p-4">
                  <p className="font-display text-2xl text-primary mb-1">{stat.value}</p>
                  <p className="font-body text-[10px] text-muted-foreground uppercase tracking-wider">{stat.label}</p>
                </div>
              ))}
            </div>
          )}

          {testimonial && (
            <div className="cs-section text-center">
              <Quote className="w-8 h-8 text-primary/20 mx-auto mb-4" />
              <blockquote className="font-display text-xl italic leading-relaxed mb-4">
                "{testimonial.quote}"
              </blockquote>
              <p className="font-body text-sm">{testimonial.author}</p>
              <p className="font-body text-xs text-muted-foreground">{testimonial.role}</p>
            </div>
          )}
        </div>
      </section>

      {/* Next */}
      {nextStudy && (
        <section className="py-16 px-6 border-t border-border/10">
          <div className="max-w-3xl mx-auto text-center">
            <p className="font-body text-[10px] text-muted-foreground uppercase tracking-wider mb-3">Next</p>
            <Link to={`/case-study/${nextStudy.slug}`} className="group inline-block" data-cursor-hover>
              <h2 className="font-display text-3xl md:text-5xl tracking-tight group-hover:text-primary transition-colors">{nextStudy.title}</h2>
            </Link>
          </div>
        </section>
      )}

      <Footer />
    </main>
  );
};

export default CaseStudyDetail;
