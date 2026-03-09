import { Link, useLocation } from 'react-router-dom';
import { useEffect } from 'react';

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error('404 Error:', location.pathname);
  }, [location.pathname]);

  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="font-display text-7xl md:text-9xl text-primary mb-4">404</h1>
        <p className="font-body text-muted-foreground mb-8">Page not found</p>
        <Link to="/" className="font-body text-sm border-b border-foreground pb-1 hover:border-primary hover:text-primary transition-colors">
          Return home
        </Link>
      </div>
    </main>
  );
};

export default NotFound;
