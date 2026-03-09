import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { gsap } from 'gsap';

interface PageTransitionProps {
  children: React.ReactNode;
}

const PageTransition = ({ children }: PageTransitionProps) => {
  const location = useLocation();
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [displayLocation, setDisplayLocation] = useState(location);
  const [isAnimating, setIsAnimating] = useState(false);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      gsap.fromTo(
        contentRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.8, ease: 'power2.out', delay: 0.1 }
      );
      return;
    }

    if (location.pathname !== displayLocation.pathname && !isAnimating) {
      setIsAnimating(true);

      const tl = gsap.timeline({
        onComplete: () => {
          setDisplayLocation(location);
          setIsAnimating(false);
        },
      });

      tl.to(contentRef.current, {
        opacity: 0,
        y: -20,
        duration: 0.3,
        ease: 'power2.in',
      });

      tl.fromTo(
        overlayRef.current,
        { scaleY: 0, transformOrigin: 'bottom' },
        { scaleY: 1, duration: 0.5, ease: 'power4.inOut' },
        '-=0.1'
      );
    }
  }, [location, displayLocation, isAnimating]);

  useEffect(() => {
    if (displayLocation.pathname === location.pathname && !isAnimating && !isFirstRender.current) {
      const tl = gsap.timeline();

      tl.fromTo(
        overlayRef.current,
        { scaleY: 1, transformOrigin: 'top' },
        { scaleY: 0, duration: 0.5, ease: 'power4.inOut', delay: 0.05 }
      );

      tl.fromTo(
        contentRef.current,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' },
        '-=0.2'
      );
    }
  }, [displayLocation, location.pathname, isAnimating]);

  return (
    <>
      <div
        ref={overlayRef}
        className="fixed inset-0 z-[100] pointer-events-none"
        style={{
          transform: 'scaleY(0)',
          background: 'hsl(var(--primary))',
        }}
      />
      <div ref={contentRef}>{children}</div>
    </>
  );
};

export default PageTransition;
