import { useGlobalSettingsContext } from '@/contexts/GlobalSettingsContext';

const InfiniteMarquee = () => {
  const { getSetting } = useGlobalSettingsContext();
  const text = getSetting('marquee_text', 'Film · Motion · Story · Vision · Cinema · Craft · ') as string;
  const repeated = text.repeat(8);

  return (
    <section className="py-16 overflow-hidden border-y border-border/10">
      <div className="marquee-track whitespace-nowrap">
        <span className="font-display text-5xl md:text-7xl italic text-muted-foreground/15 select-none tracking-tight">
          {repeated}
        </span>
      </div>
    </section>
  );
};

export default InfiniteMarquee;
