import { useState } from 'react';
import { useTeamMembers, TeamMember } from '@/hooks/useTeamMembers';
import { toast } from 'sonner';
import { Plus, Pencil, Trash2, Save, X, GripVertical } from 'lucide-react';
import MediaUpload from './MediaUpload';

const TeamManager = () => {
  const { members, loading, createMember, updateMember, deleteMember } = useTeamMembers();
  const [editing, setEditing] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [form, setForm] = useState({ name: '', role: '', bio: '', image_url: '', sort_order: 0 });
  const [saving, setSaving] = useState(false);

  const inputClass = 'w-full px-3 py-2 bg-muted/30 border border-border/40 rounded-lg font-body text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/60 transition-colors';

  const resetForm = () => {
    setForm({ name: '', role: '', bio: '', image_url: '', sort_order: 0 });
    setEditing(null);
    setIsAdding(false);
  };

  const startEdit = (member: TeamMember) => {
    setForm({ name: member.name, role: member.role, bio: member.bio, image_url: member.image_url, sort_order: member.sort_order });
    setEditing(member.id);
    setIsAdding(false);
  };

  const startAdd = () => {
    setForm({ name: '', role: '', bio: '', image_url: '', sort_order: members.length });
    setIsAdding(true);
    setEditing(null);
  };

  const handleSave = async () => {
    if (!form.name.trim()) { toast.error('Name is required'); return; }
    setSaving(true);

    if (editing) {
      const { error } = await updateMember(editing, form);
      if (error) toast.error(error.message);
      else toast.success('Member updated');
    } else {
      const { error } = await createMember(form);
      if (error) toast.error(error.message);
      else toast.success('Member added');
    }

    setSaving(false);
    resetForm();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this team member?')) return;
    const { error } = await deleteMember(id);
    if (error) toast.error(error.message);
    else toast.success('Member deleted');
  };

  if (loading) {
    return <p className="font-body text-sm text-muted-foreground">Loading team...</p>;
  }

  const showForm = isAdding || editing;

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-2xl">Team Members</h2>
        {!showForm && (
          <button onClick={startAdd} className="flex items-center gap-1.5 px-4 py-2 bg-primary text-primary-foreground font-body text-sm rounded-lg hover:bg-primary/90 transition-colors">
            <Plus className="w-4 h-4" /> Add Member
          </button>
        )}
      </div>

      {/* Form */}
      {showForm && (
        <div className="p-5 bg-card/50 rounded-xl border border-border/20 mb-6 space-y-4">
          <h3 className="font-display text-sm text-primary/80">{editing ? 'Edit Member' : 'New Member'}</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="font-body text-xs text-muted-foreground mb-1 block">Name *</label>
              <input className={inputClass} value={form.name} onChange={(e) => setForm(p => ({ ...p, name: e.target.value }))} placeholder="John Doe" />
            </div>
            <div>
              <label className="font-body text-xs text-muted-foreground mb-1 block">Role</label>
              <input className={inputClass} value={form.role} onChange={(e) => setForm(p => ({ ...p, role: e.target.value }))} placeholder="Creative Director" />
            </div>
          </div>
          <div>
            <label className="font-body text-xs text-muted-foreground mb-1 block">Bio</label>
            <textarea className={inputClass + ' min-h-[60px]'} value={form.bio} onChange={(e) => setForm(p => ({ ...p, bio: e.target.value }))} placeholder="Short bio..." />
          </div>
          <MediaUpload
            value={form.image_url}
            onChange={(url) => setForm(p => ({ ...p, image_url: url }))}
            accept="image/*"
            label="Photo"
            maxSizeMB={5}
          />
          <div>
            <label className="font-body text-xs text-muted-foreground mb-1 block">Sort Order</label>
            <input type="number" className={inputClass + ' w-24'} value={form.sort_order} onChange={(e) => setForm(p => ({ ...p, sort_order: Number(e.target.value) }))} />
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={handleSave} disabled={saving} className="flex items-center gap-1.5 px-5 py-2 bg-primary text-primary-foreground font-body text-sm rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50">
              <Save className="w-3.5 h-3.5" /> {saving ? 'Saving...' : 'Save'}
            </button>
            <button onClick={resetForm} className="flex items-center gap-1.5 px-5 py-2 border border-border/40 font-body text-sm rounded-lg hover:border-primary/40 transition-colors">
              <X className="w-3.5 h-3.5" /> Cancel
            </button>
          </div>
        </div>
      )}

      {/* Members List */}
      <div className="space-y-2">
        {members.length === 0 && !showForm && (
          <p className="font-body text-sm text-muted-foreground text-center py-8">No team members yet. Click "Add Member" to get started.</p>
        )}
        {members.map((member) => (
          <div key={member.id} className={`flex items-center gap-4 p-4 rounded-xl border transition-colors ${editing === member.id ? 'border-primary/30 bg-primary/5' : 'border-border/20 bg-card/30 hover:border-border/40'}`}>
            <GripVertical className="w-4 h-4 text-muted-foreground/30 flex-shrink-0" />
            <div className="w-12 h-12 rounded-full overflow-hidden bg-muted flex-shrink-0">
              {member.image_url ? (
                <img src={member.image_url} alt={member.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="font-display text-lg text-primary">{member.name.charAt(0)}</span>
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-display text-sm truncate">{member.name}</p>
              <p className="font-body text-xs text-muted-foreground truncate">{member.role}</p>
            </div>
            <div className="flex items-center gap-1 flex-shrink-0">
              <button onClick={() => startEdit(member)} className="p-2 text-muted-foreground hover:text-primary transition-colors" title="Edit">
                <Pencil className="w-3.5 h-3.5" />
              </button>
              <button onClick={() => handleDelete(member.id)} className="p-2 text-muted-foreground hover:text-destructive transition-colors" title="Delete">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeamManager;
