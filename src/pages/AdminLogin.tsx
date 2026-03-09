import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const { error } = await signIn(email, password);
    if (error) {
      toast.error(error.message);
    } else {
      navigate('/admin');
    }
    setSubmitting(false);
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-6 bg-background">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <h1 className="font-display text-3xl tracking-tight">
            ProtoNN<span className="text-primary italic"> Admin</span>
          </h1>
          <p className="font-body text-xs text-muted-foreground mt-2">Sign in to manage your site</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="font-body text-xs text-muted-foreground block mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 bg-muted/30 border border-border rounded font-body text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary transition-colors"
              placeholder="admin@example.com"
            />
          </div>
          <div>
            <label className="font-body text-xs text-muted-foreground block mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 bg-muted/30 border border-border rounded font-body text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary transition-colors"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 bg-primary text-primary-foreground font-body text-sm rounded hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {submitting ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
      </div>
    </main>
  );
};

export default AdminLogin;
