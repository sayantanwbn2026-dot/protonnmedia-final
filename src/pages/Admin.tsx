import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import ProjectsManager from '@/components/admin/ProjectsManager';
import GlobalSettingsManager from '@/components/admin/GlobalSettingsManager';
import ContactSubmissions from '@/components/admin/ContactSubmissions';
import AdminSettings from '@/components/admin/AdminSettings';
import TeamManager from '@/components/admin/TeamManager';
import { LogOut, FolderOpen, Settings, Mail, Sliders, Users } from 'lucide-react';

const tabs = [
  { id: 'projects', label: 'Projects', icon: FolderOpen },
  { id: 'team', label: 'Team', icon: Users },
  { id: 'settings', label: 'Global Settings', icon: Sliders },
  { id: 'submissions', label: 'Messages', icon: Mail },
  { id: 'account', label: 'Account', icon: Settings },
] as const;

type TabId = typeof tabs[number]['id'];

const Admin = () => {
  const { user, isAdmin, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabId>('projects');

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      navigate('/admin/login');
    }
  }, [user, isAdmin, loading, navigate]);

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-background">
        <p className="font-body text-sm text-muted-foreground">Loading...</p>
      </main>
    );
  }

  if (!user || !isAdmin) return null;

  return (
    <main className="min-h-screen bg-background pt-20">
      <div className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur border-b border-border/20 px-6 py-3 flex items-center justify-between">
        <h1 className="font-display text-lg tracking-tight">
          ProtoNN<span className="text-primary italic"> CMS</span>
        </h1>
        <div className="flex items-center gap-4">
          <span className="font-body text-xs text-muted-foreground">{user.email}</span>
          <button
            onClick={signOut}
            className="flex items-center gap-1.5 font-body text-xs text-muted-foreground hover:text-primary transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign out
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-6">
        <div className="flex gap-1 mb-6 border-b border-border/20 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 font-body text-sm transition-colors border-b-2 -mb-px whitespace-nowrap ${
                activeTab === tab.id
                  ? 'text-primary border-primary'
                  : 'text-muted-foreground border-transparent hover:text-foreground'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'projects' && <ProjectsManager />}
        {activeTab === 'team' && <TeamManager />}
        {activeTab === 'settings' && <GlobalSettingsManager />}
        {activeTab === 'submissions' && <ContactSubmissions />}
        {activeTab === 'account' && <AdminSettings />}
      </div>
    </main>
  );
};

export default Admin;
