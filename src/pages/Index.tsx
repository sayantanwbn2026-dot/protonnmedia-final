import { useState } from 'react';
import Hero from '@/components/Hero';
import BentoGrid from '@/components/BentoGrid';
import ThinkingProcess from '@/components/ThinkingProcess';
import TheTribe from '@/components/TheTribe';
import InfiniteMarquee from '@/components/InfiniteMarquee';
import Footer from '@/components/Footer';
import LoadingScreen from '@/components/LoadingScreen';

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <>
      {isLoading && <LoadingScreen onComplete={() => setIsLoading(false)} />}
      <div style={{ visibility: isLoading ? 'hidden' : 'visible' }}>
        <main className="relative">
          <Hero />
          <BentoGrid />
          <ThinkingProcess />
          <InfiniteMarquee />
          <TheTribe />
          <Footer />
        </main>
      </div>
    </>
  );
};

export default Index;
