import { useEffect, useRef, useState } from 'react';

const CustomCursor = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    let mouseX = 0, mouseY = 0, cursorX = 0, cursorY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const animate = () => {
      cursorX += (mouseX - cursorX) * 0.12;
      cursorY += (mouseY - cursorY) * 0.12;
      cursor.style.left = `${cursorX}px`;
      cursor.style.top = `${cursorY}px`;
      cursor.style.transform = 'translate(-50%, -50%)';
      requestAnimationFrame(animate);
    };

    const addListeners = () => {
      document.querySelectorAll('a, button, [data-cursor-hover]').forEach((el) => {
        el.addEventListener('mouseenter', () => setIsHovering(true));
        el.addEventListener('mouseleave', () => setIsHovering(false));
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    addListeners();
    animate();

    const observer = new MutationObserver(addListeners);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      observer.disconnect();
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      className={`cursor-dot ${isHovering ? 'hovering' : ''} hidden md:block`}
    />
  );
};

export default CustomCursor;
