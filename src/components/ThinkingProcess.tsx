import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const steps = [
  { id: 1, title: 'Ideation', description: 'Deep-dive discovery sessions to explore your vision, themes, and stories.' },
  { id: 2, title: 'Scripting', description: 'Crafting narratives with authentic dialogue and emotional depth.' },
  { id: 3, title: 'Pre-Production', description: 'Location scouting, casting, and storyboarding every detail.' },
  { id: 4, title: 'Shooting', description: 'State-of-the-art cameras and seasoned crews capture the magic.' },
  { id: 5, title: 'Post-Production', description: 'Color grading, sound design, and VFX polish every frame.' },
];

const ThinkingProcess = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(lineRef.current, { scaleY: 0 }, {
        scaleY: 1, ease: 'none',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 60%', end: 'bottom 40%', scrub: 1 },
      });

      gsap.utils.toArray('.process-step').forEach((step: any) => {
        gsap.fromTo(step,
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out',
            scrollTrigger: { trigger: step, start: 'top 85%', toggleActions: 'play none none reverse' } }
        );
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <span className="font-body text-[11px] text-muted-foreground uppercase tracking-[0.3em]">How we work</span>
          <h2 className="font-display text-4xl md:text-6xl tracking-tight mt-3">
            Our <em className="text-primary">process</em>
          </h2>
        </div>

        <div className="relative">
          <div className="absolute left-4 md:left-1/2 md:-translate-x-1/2 top-0 bottom-0 w-px">
            <div ref={lineRef} className="w-full h-full bg-primary/30 origin-top" />
          </div>

          <div className="space-y-14">
            {steps.map((step, index) => {
              const isLeft = index % 2 === 0;
              return (
                <div key={step.id} className={`process-step relative flex ${isLeft ? 'md:justify-start' : 'md:justify-end'} pl-12 md:pl-0`}>
                  <div className="absolute left-4 md:left-1/2 md:-translate-x-1/2 top-2 w-2 h-2 rounded-full bg-primary z-10" />
                  <div className={`md:w-5/12 ${isLeft ? 'md:pr-12' : 'md:pl-12'}`}>
                    <span className="font-body text-[10px] text-primary tracking-[0.2em] uppercase">0{step.id}</span>
                    <h3 className="font-display text-2xl md:text-3xl mt-1 mb-3">{step.title}</h3>
                    <p className="font-body text-sm text-muted-foreground leading-relaxed">{step.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ThinkingProcess;
