import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGlobalSettingsContext } from '@/contexts/GlobalSettingsContext';

gsap.registerPlugin(ScrollTrigger);

const Hero = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);
  const { getSetting, loading } = useGlobalSettingsContext();

  const headline = getSetting('hero_headline', 'We craft visual stories') as string;
  const subtitle = getSetting('hero_subtitle', 'Film & videography studio building cinematic experiences that move people.') as string;
  const heroMediaType = getSetting('hero_media_type', 'image') as string;
  const heroMediaUrl = getSetting('hero_media_url', '') as string;
  const heroOpacity = Number(getSetting('hero_opacity', 0.4));

  useEffect(() => {
    if (loading) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.4 });
      tl.fromTo(
        headlineRef.current?.querySelectorAll('.word') || [],
        { y: 100, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.1, duration: 1, ease: 'power4.out' }
      );
      tl.fromTo(subRef.current, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }, '-=0.5');
      tl.fromTo(ctaRef.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' }, '-=0.4');

      gsap.to(mediaRef.current, {
        yPercent: 30, ease: 'none',
        scrollTrigger: { trigger: sectionRef.current, start: 'top top', end: 'bottom top', scrub: true },
      });
      gsap.to(headlineRef.current, {
        opacity: 0, y: -60, ease: 'none',
        scrollTrigger: { trigger: sectionRef.current, start: 'top top', end: '60% top', scrub: true },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, [loading]);

  const words = headline.split(' ');

  return (
    <section ref={sectionRef} className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Media */}
      <div ref={mediaRef} className="absolute inset-0">
        {heroMediaUrl ? (
          <>
            {heroMediaType === 'video' ? (
              <video
                src={heroMediaUrl}
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover"
              />
            ) : (
              <img
                src={heroMediaUrl}
                alt=""
                className="w-full h-full object-cover"
              />
            )}
            {/* Opacity overlay */}
            <div className="absolute inset-0 bg-background" style={{ opacity: 1 - heroOpacity }} />
          </>
        ) : (
          <div className="w-full h-full bg-background" />
        )}
      </div>

      {/* Film grain */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
      }} />

      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
        <h1 ref={headlineRef} className="font-display text-[clamp(3rem,10vw,9rem)] leading-[0.9] tracking-tight mb-8">
          {words.map((word, i) => (
            <span key={i} className={`word inline-block ${i === 1 ? 'italic text-primary' : ''} `}>
              {word}{' '}
            </span>
          ))}
        </h1>

        <p ref={subRef} className="font-body text-muted-foreground text-sm md:text-base max-w-md mx-auto mb-12 leading-relaxed">
          {subtitle}
        </p>

        <div ref={ctaRef} className="flex items-center justify-center gap-6">
          <Link to="/work" data-cursor-hover className="font-body text-sm border-b border-foreground pb-1 hover:border-primary hover:text-primary transition-colors duration-300">
            View work
          </Link>
          <Link to="/contact" data-cursor-hover className="font-body text-sm text-muted-foreground hover:text-foreground transition-colors duration-300">
            Get in touch →
          </Link>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3">
        <div className="w-px h-10 bg-gradient-to-b from-muted-foreground/40 to-transparent overflow-hidden">
          <div className="w-full h-full bg-primary" style={{ animation: 'revealUp 2s ease infinite' }} />
        </div>
      </div>
    </section>
  );
};

export default Hero;
