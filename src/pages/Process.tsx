import { Link } from 'react-router-dom';
import Footer from '@/components/Footer';
import CaseStudies from '@/components/process/CaseStudies';
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const steps = [
  { id: 1, title: 'Ideation', description: 'Deep-dive discovery into your vision—themes, emotions, and stories waiting to be told.', details: 'Mood boards, visual references, and narrative possibilities explored in intensive sessions.' },
  { id: 2, title: 'Scripting', description: 'Words become worlds. Narratives with authentic dialogue and emotional depth.', details: 'From concepts to polished scripts with character arcs that captivate.' },
  { id: 3, title: 'Pre-Production', description: 'Location scouting, casting, storyboarding—meticulous planning.', details: 'Assembling the perfect team and creating detailed shot lists.' },
  { id: 4, title: 'Shooting', description: 'State-of-the-art equipment and artistic direction for cinematic excellence.', details: 'RED cameras, ARRI lighting, and professional crews.' },
  { id: 5, title: 'Post-Production', description: 'Color grading, sound design, VFX—every frame polished to perfection.', details: 'Cinematic color grades, immersive soundscapes, seamless effects.' },
];

const Process = () => {
  const lineRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(heroRef.current?.querySelectorAll('.anim') || [], {
        y: 50, opacity: 0, stagger: 0.12, duration: 1, ease: 'power3.out',
      });

      gsap.fromTo(lineRef.current, { scaleY: 0 }, {
        scaleY: 1, ease: 'none',
        scrollTrigger: { trigger: '.process-timeline', start: 'top 60%', end: 'bottom 40%', scrub: 1 },
      });

      gsap.utils.toArray('.timeline-step').forEach((step: any) => {
        gsap.fromTo(step,
          { y: 40, opacity: 0 },
          {
            y: 0, opacity: 1, duration: 0.6, ease: 'power3.out',
            scrollTrigger: { trigger: step, start: 'top 85%', toggleActions: 'play none none reverse' }
          }
        );
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <main className="relative">
      {/* Case Studies - top */}
      <CaseStudies />

      {/* Hero / Methodology */}
      <section ref={heroRef} className="py-20 flex items-center justify-center px-6">
        <div className="max-w-3xl mx-auto text-center">
          <span className="anim font-body text-[11px] text-muted-foreground uppercase tracking-[0.3em]">Methodology</span>
          <h1 className="anim font-display text-5xl md:text-7xl tracking-tight mt-3 mb-5">
            The <em className="text-primary">process</em>
          </h1>
          <p className="anim font-body text-muted-foreground text-sm md:text-base max-w-lg mx-auto leading-relaxed">
            From concept to completion, every project follows our refined creative methodology.
          </p>
        </div>
      </section>

      {/* Timeline */}
      <section className="process-timeline relative py-20 px-6">
        <div className="max-w-4xl mx-auto relative">
          <div className="absolute left-4 md:left-1/2 md:-translate-x-1/2 top-0 bottom-0 w-px">
            <div ref={lineRef} className="w-full h-full bg-primary/20 origin-top" />
          </div>

          <div className="space-y-16">
            {steps.map((step, index) => {
              const isLeft = index % 2 === 0;
              return (
                <div key={step.id} className={`timeline-step relative flex ${isLeft ? 'md:justify-start' : 'md:justify-end'} pl-12 md:pl-0`}>
                  <div className="absolute left-4 md:left-1/2 md:-translate-x-1/2 top-1 w-2 h-2 rounded-full bg-primary z-10" />
                  <div className={`md:w-5/12 ${isLeft ? 'md:pr-12' : 'md:pl-12'}`}>
                    <span className="font-body text-[10px] text-primary tracking-[0.2em] uppercase">0{step.id}</span>
                    <h3 className="font-display text-2xl md:text-3xl mt-1 mb-3">{step.title}</h3>
                    <p className="font-body text-sm text-muted-foreground leading-relaxed mb-2">{step.description}</p>
                    <p className="font-body text-xs text-muted-foreground/60 leading-relaxed">{step.details}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-display text-3xl md:text-5xl tracking-tight mb-5">
            Ready to start your <em className="text-primary">journey?</em>
          </h2>
          <Link to="/contact" data-cursor-hover className="font-body text-sm border-b border-foreground pb-1 hover:border-primary hover:text-primary transition-colors duration-300">
            Start a project →
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default Process;
