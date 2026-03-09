import { Link } from 'react-router-dom';
import Footer from '@/components/Footer';
import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTeamMembers } from '@/hooks/useTeamMembers';

gsap.registerPlugin(ScrollTrigger);

const fallbackMembers = [
  { id: '1', name: 'Alexandra Chen', role: 'Creative Director', bio: '15 years of visual storytelling—leading creative vision with cinematic excellence.', image_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600', sort_order: 0 },
  { id: '2', name: 'Marcus Williams', role: 'Lead Cinematographer', bio: 'A decade of Hollywood experience crafting the premium ProtoNN aesthetic.', image_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600', sort_order: 1 },
  { id: '3', name: 'Sofia Rodriguez', role: 'Executive Producer', bio: 'Orchestrating every production with precision from concept to delivery.', image_url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=600', sort_order: 2 },
  { id: '4', name: 'James Okafor', role: 'Post-Production Lead', bio: 'Transforming raw footage into polished masterpieces.', image_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=600', sort_order: 3 },
  { id: '5', name: 'Emily Watson', role: 'Sound Designer', bio: 'Crafting immersive soundscapes that bring stories to life.', image_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600', sort_order: 4 },
  { id: '6', name: 'David Park', role: 'VFX Supervisor', bio: 'Pushing the boundaries of visual effects with seamless CGI.', image_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600', sort_order: 5 },
];

const Team = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const [hoveredMember, setHoveredMember] = useState<(typeof fallbackMembers)[0] | null>(null);
  const { members: cmsMembers, loading } = useTeamMembers();

  const teamMembers = cmsMembers.length > 0 ? cmsMembers : (loading ? [] : fallbackMembers);

  useEffect(() => {
    if (teamMembers.length === 0) return;
    const ctx = gsap.context(() => {
      gsap.from(heroRef.current?.querySelectorAll('.anim') || [], {
        y: 50, opacity: 0, stagger: 0.12, duration: 1, ease: 'power3.out',
      });
      gsap.utils.toArray('.team-card').forEach((card: any, i) => {
        gsap.fromTo(card,
          { y: 60, opacity: 0 },
          {
            y: 0, opacity: 1, duration: 0.7, ease: 'power3.out', delay: i * 0.06,
            scrollTrigger: { trigger: card, start: 'top 90%', toggleActions: 'play none none reverse' }
          }
        );
      });
    });
    return () => ctx.revert();
  }, [teamMembers.length]);

  // Floating Cursor logic for the detailed card
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!cursorRef.current) return;
      // Position the floating card near the mouse
      gsap.to(cursorRef.current, {
        x: e.clientX + 20, // Offset a bit to the right
        y: e.clientY + 20, // Offset a bit to the bottom
        duration: 0.6,
        ease: 'power3.out'
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <>
      <main className="relative">
        <section ref={heroRef} className="min-h-[50vh] flex items-center justify-center px-6 pt-24">
          <div className="max-w-3xl mx-auto text-center">
            <span className="anim font-body text-[11px] text-muted-foreground uppercase tracking-[0.3em]">The visionaries</span>
            <h1 className="anim font-display text-5xl md:text-7xl tracking-tight mt-3 mb-5">
              Meet the <em className="text-primary">tribe</em>
            </h1>
            <p className="anim font-body text-muted-foreground text-sm md:text-base max-w-lg mx-auto leading-relaxed">
              Award-winning creatives united by a passion for cinematic excellence.
            </p>
          </div>
        </section>

        <section className="py-12 px-6 relative cursor-crosshair">
          <div className="max-w-7xl mx-auto" onMouseLeave={() => setHoveredMember(null)}>
            <div
              ref={gridRef}
              className="grid gap-2 sm:gap-4 justify-center"
              style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 280px))' }}
            >
              {teamMembers.map((member) => {
                const isHovered = hoveredMember?.id === member.id;
                const isNotHovered = hoveredMember !== null && !isHovered;

                return (
                  <div
                    key={member.id}
                    onMouseEnter={() => setHoveredMember(member)}
                    className="team-card relative w-full max-w-[280px] mx-auto aspect-[3/4] overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]"
                    style={{
                      transform: isHovered ? 'scale(1.02)' : isNotHovered ? 'scale(0.95)' : 'scale(1)',
                      zIndex: isHovered ? 10 : 1,
                      filter: isNotHovered ? 'blur(4px) brightness(0.4) grayscale(100%)' : 'blur(0px) brightness(1) grayscale(0%)'
                    }}
                  >
                    <img
                      src={member.image_url}
                      alt={member.name}
                      className="w-full h-full object-cover transition-transform duration-[1.5s] ease-out hover:scale-110"
                    />

                    {/* Default visible info that completely fades out on hover so the floating card takes over */}
                    <div
                      className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-background/90 to-transparent transition-opacity duration-500 pointer-events-none"
                      style={{ opacity: hoveredMember !== null ? 0 : 1 }}
                    >
                      <h3 className="font-display text-xl text-white">{member.name}</h3>
                      <p className="font-body text-xs text-white/70 uppercase tracking-widest mt-1">{member.role}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Global Floating Details Card */}
        <div
          ref={cursorRef}
          className="fixed top-0 left-0 pointer-events-none z-50 transition-opacity duration-300 hidden md:block"
          style={{
            opacity: hoveredMember ? 1 : 0,
            visibility: hoveredMember ? 'visible' : 'hidden'
          }}
        >
          {hoveredMember && (
            <div className="bg-background/40 backdrop-blur-2xl border border-white/10 p-6 rounded-2xl w-[320px] shadow-2xl transform -translate-y-1/2">
              <div className="w-10 h-px bg-primary mb-4" />
              <p className="font-body text-[10px] text-primary uppercase tracking-[0.3em] font-medium mb-1">
                {hoveredMember.role}
              </p>
              <h3 className="font-display text-2xl text-white mb-3 leading-none">
                {hoveredMember.name}
              </h3>
              <p className="font-body text-sm text-white/80 leading-relaxed">
                {hoveredMember.bio}
              </p>
            </div>
          )}
        </div>

        {/* Values */}
        <section className="py-20 px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-display text-3xl md:text-5xl tracking-tight mb-12">Our <em className="text-primary">values</em></h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { title: 'Excellence', desc: 'Perfection in every frame, every sound, every story.' },
                { title: 'Innovation', desc: 'Pushing boundaries with cutting-edge techniques.' },
                { title: 'Collaboration', desc: 'Great stories born from great teams.' },
              ].map((v) => (
                <div key={v.title} className="text-left">
                  <h3 className="font-display text-xl text-primary mb-3">{v.title}</h3>
                  <p className="font-body text-sm text-muted-foreground leading-relaxed">{v.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-display text-3xl md:text-5xl tracking-tight mb-5">
              Want to join the <em className="text-primary">tribe?</em>
            </h2>
            <Link to="/contact" data-cursor-hover className="font-body text-sm border-b border-foreground pb-1 hover:border-primary hover:text-primary transition-colors duration-300">
              Get in touch →
            </Link>
          </div>
        </section>

        <Footer />
      </main>

      {/* Mobile Drawer fallback since hover doesn't work well on mobile */}
      <div
        className={`fixed inset-x-0 bottom-0 z-50 bg-background/90 backdrop-blur-xl border-t border-white/10 p-6 transform transition-transform duration-500 ease-out md:hidden flex flex-col items-center text-center ${hoveredMember ? 'translate-y-0' : 'translate-y-full'}`}
      >
        {hoveredMember && (
          <>
            <button
              onClick={() => setHoveredMember(null)}
              className="absolute top-4 right-4 text-white/50 p-2"
            >
              ✕
            </button>
            <p className="font-body text-[10px] text-primary uppercase tracking-[0.3em] mt-4 mb-2">
              {hoveredMember.role}
            </p>
            <h3 className="font-display text-3xl text-white mb-4">
              {hoveredMember.name}
            </h3>
            <p className="font-body text-sm text-white/80 leading-relaxed max-w-sm">
              {hoveredMember.bio}
            </p>
          </>
        )}
      </div>
    </>
  );
};

export default Team;
