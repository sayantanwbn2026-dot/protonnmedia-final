import { useEffect, useRef, ReactNode, createContext, useContext } from 'react';
import Lenis from 'lenis';
import { useLocation } from 'react-router-dom';

interface SmoothScrollProps {
  children: ReactNode;
}

const LenisContext = createContext<Lenis | null>(null);

export const useLenis = () => useContext(LenisContext);

const SmoothScroll = ({ children }: SmoothScrollProps) => {
  const lenisRef = useRef<Lenis | null>(null);
  const { pathname } = useLocation();
  const isAdmin = pathname.startsWith('/admin');

  useEffect(() => {
    if (isAdmin) return; // Skip Lenis for admin pages
    lenisRef.current = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    function raf(time: number) {
      lenisRef.current?.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenisRef.current?.destroy();
      lenisRef.current = null;
    };
  }, [isAdmin]);

  // Scroll to top on route change
  useEffect(() => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { immediate: true });
    }
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <LenisContext.Provider value={lenisRef.current}>
      {children}
    </LenisContext.Provider>
  );
};

export default SmoothScroll;
