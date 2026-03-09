import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Mail, MailOpen, Trash2 } from 'lucide-react';

interface Submission {
  id: string;
  name: string;
  email: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

const ContactSubmissions = () => {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSubmissions = async () => {
    const { data } = await supabase
      .from('contact_submissions')
      .select('*')
      .order('created_at', { ascending: false });
    if (data) setSubmissions(data as unknown as Submission[]);
    setLoading(false);
  };

  useEffect(() => { fetchSubmissions(); }, []);

  const toggleRead = async (sub: Submission) => {
    const { error } = await supabase
      .from('contact_submissions')
      .update({ is_read: !sub.is_read } as any)
      .eq('id', sub.id);
    if (error) toast.error(error.message);
    else fetchSubmissions();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this submission?')) return;
    const { error } = await supabase.from('contact_submissions').delete().eq('id', id);
    if (error) toast.error(error.message);
    else { toast.success('Deleted'); fetchSubmissions(); }
  };

  if (loading) return <p className="font-body text-sm text-muted-foreground">Loading...</p>;

  return (
    <div>
      <h2 className="font-display text-2xl mb-6">
        Messages
        {submissions.filter((s) => !s.is_read).length > 0 && (
          <span className="ml-2 text-sm text-primary">({submissions.filter((s) => !s.is_read).length} unread)</span>
        )}
      </h2>

      {submissions.length === 0 ? (
        <p className="font-body text-sm text-muted-foreground">No messages yet.</p>
      ) : (
        <div className="space-y-3">
          {submissions.map((sub) => (
            <div
              key={sub.id}
              className={`p-4 border rounded transition-colors ${sub.is_read ? 'border-border/20' : 'border-primary/30 bg-primary/5'}`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-body text-sm font-medium">{sub.name}</h3>
                    <a href={`mailto:${sub.email}`} className="font-body text-xs text-primary hover:underline">{sub.email}</a>
                  </div>
                  <p className="font-body text-sm text-muted-foreground whitespace-pre-wrap">{sub.message}</p>
                  <p className="font-body text-[10px] text-muted-foreground/50 mt-2">{new Date(sub.created_at).toLocaleString()}</p>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => toggleRead(sub)} className="p-2 text-muted-foreground hover:text-primary transition-colors" title={sub.is_read ? 'Mark unread' : 'Mark read'}>
                    {sub.is_read ? <MailOpen className="w-4 h-4" /> : <Mail className="w-4 h-4" />}
                  </button>
                  <button onClick={() => handleDelete(sub.id)} className="p-2 text-muted-foreground hover:text-destructive transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ContactSubmissions;
