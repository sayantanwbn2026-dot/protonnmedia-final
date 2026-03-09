import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTeamMembers } from '@/hooks/useTeamMembers';

gsap.registerPlugin(ScrollTrigger);

const fallbackMembers = [
  { id: '1', name: 'Alexandra Chen', role: 'Creative Director', image_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400' },
  { id: '2', name: 'Marcus Williams', role: 'Lead Cinematographer', image_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400' },
  { id: '3', name: 'Sofia Rodriguez', role: 'Executive Producer', image_url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400' },
  { id: '4', name: 'James Okafor', role: 'Post-Production Lead', image_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400' },
];

const TheTribe = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const { members: cmsMembers, loading } = useTeamMembers();
  
  const teamMembers = cmsMembers.length > 0 ? cmsMembers : (loading ? [] : fallbackMembers);

  useEffect(() => {
    if (teamMembers.length === 0) return;
    const ctx = gsap.context(() => {
      gsap.utils.toArray('.tribe-card').forEach((card: any, i) => {
        gsap.fromTo(card,
          { y: 60, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out', delay: i * 0.08,
            scrollTrigger: { trigger: card, start: 'top 90%', toggleActions: 'play none none reverse' } }
        );
      });
    }, sectionRef);
    return () => ctx.revert();
  }, [teamMembers.length]);

  return (
    <section ref={sectionRef} className="relative py-20 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <span className="font-body text-[11px] text-muted-foreground uppercase tracking-[0.3em]">The people</span>
          <h2 className="font-display text-4xl md:text-6xl tracking-tight mt-3">
            The <em className="text-primary">tribe</em>
          </h2>
        </div>

        <div
          className="grid gap-4 md:gap-6 justify-center"
          style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 220px))' }}
        >
          {teamMembers.slice(0, 4).map((member) => (
            <div key={member.id} className="tribe-card group w-[220px]" data-cursor-hover>
              <div className="relative aspect-[3/4] overflow-hidden mb-3">
                <img
                  src={member.image_url}
                  alt={member.name}
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-background/20 group-hover:bg-transparent transition-colors duration-500" />
              </div>
              <h3 className="font-display text-base">{member.name}</h3>
              <p className="font-body text-xs text-muted-foreground">{member.role}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TheTribe;
