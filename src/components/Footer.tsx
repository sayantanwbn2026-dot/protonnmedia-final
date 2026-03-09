import { Link } from 'react-router-dom';
import { useGlobalSettingsContext } from '@/contexts/GlobalSettingsContext';

const socialLinks = [
  { name: 'Instagram', url: 'https://www.instagram.com/protonn.media?igsh=N3RtMjM5dm5yd2Vj' },
  { name: 'YouTube', url: 'https://youtube.com/@protonnmedia?si=5tPlujY5sZNRMwE8' },
];

const Footer = () => {
  const { getSetting } = useGlobalSettingsContext();
  const email = getSetting('contact_email', 'hello@protonnmedia.com') as string;
  const tagline = getSetting('footer_tagline', "Let's create together") as string;

  return (
    <footer className="relative py-16 px-6 border-t border-border/10">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          <div>
            <h2 className="font-display text-3xl md:text-4xl tracking-tight mb-5">
              {tagline.includes('together') ? (
                <>{tagline.replace('together', '')}<em className="text-primary">together</em></>
              ) : tagline}
            </h2>
            <a href={`mailto:${email}`} data-cursor-hover className="font-body text-sm text-muted-foreground hover:text-primary transition-colors duration-300 border-b border-border/20 pb-0.5">
              {email}
            </a>
          </div>

          <div>
            <h3 className="font-body text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-5">Navigation</h3>
            <ul className="space-y-2.5">
              {[{ name: 'Work', href: '/work' }, { name: 'Process', href: '/process' }, { name: 'Team', href: '/team' }, { name: 'Contact', href: '/contact' }].map((link) => (
                <li key={link.name}>
                  <Link to={link.href} data-cursor-hover className="font-body text-sm text-foreground/60 hover:text-primary transition-colors duration-300">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-body text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-5">Follow</h3>
            <ul className="space-y-2.5">
              {socialLinks.map((social) => (
                <li key={social.name}>
                  <a href={social.url} target="_blank" rel="noopener noreferrer" data-cursor-hover className="font-body text-sm text-foreground/60 hover:text-primary transition-colors duration-300">
                    {social.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-border/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <span className="font-display text-base tracking-tight">
            ProtoNN<span className="text-primary italic"> Media</span>
          </span>
          <p className="font-body text-xs text-muted-foreground/40">© {new Date().getFullYear()} All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
