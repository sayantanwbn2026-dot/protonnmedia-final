import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { gsap } from 'gsap';

const navItems = [
  { name: 'Work', href: '/work' },
  { name: 'Process', href: '/process' },
  { name: 'Team', href: '/team' },
  { name: 'Contact', href: '/contact' },
];

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
      gsap.fromTo('.mobile-link', { y: 40, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.08, duration: 0.5, ease: 'power3.out', delay: 0.2 });
    } else {
      document.body.style.overflow = '';
    }
  }, [menuOpen]);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 px-6 md:px-10 py-4 flex items-center justify-between transition-all duration-500 border-b ${
          isScrolled
            ? 'bg-background/60 backdrop-blur-xl border-border/10'
            : 'bg-background/30 backdrop-blur-md border-transparent'
        }`}
      >
        <Link to="/" data-cursor-hover className="font-display text-xl tracking-tight">
          ProtoNN<span className="text-primary italic"> Media</span>
        </Link>

        <div className="hidden md:flex items-center gap-10">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              data-cursor-hover
              className={`font-body text-[13px] tracking-wide transition-colors duration-300 relative group ${
                location.pathname === item.href ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {item.name}
              <span className={`absolute -bottom-1 left-0 h-px bg-primary transition-all duration-300 ${
                location.pathname === item.href ? 'w-full' : 'w-0 group-hover:w-full'
              }`} />
            </Link>
          ))}
        </div>

        <button
          data-cursor-hover
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden relative w-6 h-4 flex flex-col justify-between"
        >
          <span className={`w-full h-px bg-foreground transition-all duration-300 origin-left ${menuOpen ? 'rotate-45 translate-y-px' : ''}`} />
          <span className={`w-full h-px bg-foreground transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
          <span className={`w-full h-px bg-foreground transition-all duration-300 origin-left ${menuOpen ? '-rotate-45 -translate-y-px' : ''}`} />
        </button>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="fixed inset-0 z-40 bg-background flex flex-col items-center justify-center gap-8">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className="mobile-link font-display text-4xl tracking-tight text-foreground hover:text-primary transition-colors"
              data-cursor-hover
            >
              {item.name}
            </Link>
          ))}
        </div>
      )}
    </>
  );
};

export default Navbar;
