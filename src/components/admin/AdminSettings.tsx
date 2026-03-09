import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

const AdminSettings = () => {
  const { user, updateEmail, updatePassword } = useAuth();
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [saving, setSaving] = useState(false);

  const handleUpdateEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail) return;
    setSaving(true);
    const { error } = await updateEmail(newEmail);
    if (error) toast.error(error.message);
    else { toast.success('Email update initiated. Check your inbox.'); setNewEmail(''); }
    setSaving(false);
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) { toast.error('Passwords do not match'); return; }
    if (newPassword.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    setSaving(true);
    const { error } = await updatePassword(newPassword);
    if (error) toast.error(error.message);
    else { toast.success('Password updated'); setNewPassword(''); setConfirmPassword(''); }
    setSaving(false);
  };

  const inputClass = "w-full px-3 py-2 bg-muted/30 border border-border rounded font-body text-sm text-foreground focus:outline-none focus:border-primary transition-colors";

  return (
    <div className="max-w-lg">
      <h2 className="font-display text-2xl mb-6">Account Settings</h2>

      <div className="mb-4 p-3 border border-border/20 rounded">
        <p className="font-body text-xs text-muted-foreground">Current email</p>
        <p className="font-body text-sm">{user?.email}</p>
      </div>

      <form onSubmit={handleUpdateEmail} className="mb-10 space-y-3">
        <h3 className="font-body text-sm font-medium">Update Email</h3>
        <input className={inputClass} type="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} placeholder="New email address" required />
        <button type="submit" disabled={saving} className="px-4 py-2 bg-primary text-primary-foreground font-body text-sm rounded hover:bg-primary/90 transition-colors disabled:opacity-50">
          Update Email
        </button>
      </form>

      <form onSubmit={handleUpdatePassword} className="space-y-3">
        <h3 className="font-body text-sm font-medium">Update Password</h3>
        <input className={inputClass} type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="New password" required />
        <input className={inputClass} type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm password" required />
        <button type="submit" disabled={saving} className="px-4 py-2 bg-primary text-primary-foreground font-body text-sm rounded hover:bg-primary/90 transition-colors disabled:opacity-50">
          Update Password
        </button>
      </form>
    </div>
  );
};

export default AdminSettings;
