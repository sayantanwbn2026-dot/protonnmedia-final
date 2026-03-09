import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

interface LoadingScreenProps {
  onComplete: () => void;
}

const LoadingScreen = ({ onComplete }: LoadingScreenProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const [animComplete, setAnimComplete] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (document.readyState === 'complete') setLoaded(true);
    else window.addEventListener('load', () => setLoaded(true));
  }, []);

  useEffect(() => {
    const tl = gsap.timeline({ onComplete: () => setAnimComplete(true) });

    tl.fromTo(lineRef.current, { scaleX: 0 }, { scaleX: 1, duration: 1.4, ease: 'power3.inOut' });
    tl.fromTo(
      textRef.current?.querySelectorAll('.char') || [],
      { y: 60, opacity: 0 },
      { y: 0, opacity: 1, stagger: 0.04, duration: 0.5, ease: 'power3.out' },
      '-=0.8'
    );
  }, []);

  useEffect(() => {
    if (loaded && animComplete) {
      gsap.to(containerRef.current, {
        yPercent: -100,
        duration: 0.8,
        ease: 'power4.inOut',
        delay: 0.3,
        onComplete: onComplete,
      });
    }
  }, [loaded, animComplete, onComplete]);

  const name = 'ProtoNN';

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[200] bg-background flex flex-col items-center justify-center"
    >
      <div ref={textRef} className="flex overflow-hidden">
        {name.split('').map((char, i) => (
          <span key={i} className="char font-display text-5xl md:text-7xl tracking-tight">
            {char}
          </span>
        ))}
      </div>
      <div
        ref={lineRef}
        className="w-16 h-px bg-primary mt-6 origin-left"
        style={{ transform: 'scaleX(0)' }}
      />
    </div>
  );
};

export default LoadingScreen;
