import { useState } from 'react';
import Footer from '@/components/Footer';
import { Send, Mail, MapPin, Phone } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useGlobalSettingsContext } from '@/contexts/GlobalSettingsContext';
import { toast } from 'sonner';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', company: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const { getSetting } = useGlobalSettingsContext();

  const contactEmail = getSetting('contact_email', 'hello@protonnmedia.com') as string;
  const contactPhone = getSetting('contact_phone', '+1 (234) 567-890') as string;
  const contactAddress = getSetting('contact_address', '123 Creative Avenue\nLos Angeles, CA 90028') as string;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const { error } = await supabase.from('contact_submissions').insert({
      name: formData.name,
      email: formData.email,
      message: formData.company ? `[Company: ${formData.company}]\n\n${formData.message}` : formData.message,
    } as any);

    if (error) {
      toast.error('Failed to send message. Please try again.');
    } else {
      toast.success('Message sent! We\'ll get back to you soon.');
      setFormData({ name: '', email: '', company: '', message: '' });
    }
    setSubmitting(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <>
      <main className="relative pt-28 pb-0 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <span className="font-body text-[11px] text-muted-foreground uppercase tracking-[0.3em]">Let's connect</span>
            <h1 className="font-display text-5xl md:text-7xl tracking-tight mt-4">Get in touch</h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <form onSubmit={handleSubmit} className="space-y-5">
              {[
                { label: 'Name', name: 'name', type: 'text', placeholder: 'Your name', required: true },
                { label: 'Email', name: 'email', type: 'email', placeholder: 'you@example.com', required: true },
                { label: 'Company', name: 'company', type: 'text', placeholder: 'Optional' },
              ].map((field) => (
                <div key={field.name}>
                  <label className="font-body text-xs text-muted-foreground mb-2 block">{field.label}</label>
                  <input
                    type={field.type}
                    name={field.name}
                    value={formData[field.name as keyof typeof formData]}
                    onChange={handleChange}
                    required={field.required}
                    placeholder={field.placeholder}
                    className="w-full px-0 py-3 bg-transparent border-b border-border font-body text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
              ))}
              <div>
                <label className="font-body text-xs text-muted-foreground mb-2 block">Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={4}
                  placeholder="Tell us about your project..."
                  className="w-full px-0 py-3 bg-transparent border-b border-border font-body text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary transition-colors resize-none"
                />
              </div>
              <button
                type="submit"
                disabled={submitting}
                data-cursor-hover
                className="group flex items-center gap-2 font-body text-sm text-foreground border-b border-foreground pb-1 hover:border-primary hover:text-primary transition-colors duration-300 mt-4 disabled:opacity-50"
              >
                {submitting ? 'Sending...' : 'Send message'}
                <Send className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </form>

            <div className="space-y-10">
              {[
                { icon: Mail, label: 'Email', value: contactEmail, href: `mailto:${contactEmail}` },
                { icon: Phone, label: 'Phone', value: contactPhone, href: `tel:${contactPhone.replace(/\D/g, '')}` },
                { icon: MapPin, label: 'Studio', value: contactAddress },
              ].map((item) => (
                <div key={item.label} className="flex items-start gap-4">
                  <item.icon className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-body text-xs text-muted-foreground mb-1">{item.label}</h3>
                    {item.href ? (
                      <a href={item.href} data-cursor-hover className="font-body text-sm text-foreground/80 hover:text-primary transition-colors whitespace-pre-line">{item.value}</a>
                    ) : (
                      <p className="font-body text-sm text-foreground/80 whitespace-pre-line">{item.value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Contact;
