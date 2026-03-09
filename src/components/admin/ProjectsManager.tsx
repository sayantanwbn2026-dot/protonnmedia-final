import { useState } from 'react';
import { useProjects, Project } from '@/hooks/useProjects';
import { toast } from 'sonner';
import { Plus, Pencil, Trash2, Eye, EyeOff } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import ProjectEditor from './ProjectEditor';

const ProjectsManager = () => {
  const { projects, loading, createProject, updateProject, deleteProject } = useProjects();
  const [editing, setEditing] = useState<Project | null>(null);
  const [creating, setCreating] = useState(false);

  const handleDelete = async (project: Project) => {
    if (!confirm(`Delete "${project.title}"?`)) return;
    const { error } = await deleteProject(project.id);
    if (error) toast.error(error.message);
    else toast.success('Project deleted');
  };

  const handleTogglePublish = async (project: Project) => {
    const { error } = await updateProject(project.id, { is_published: !project.is_published });
    if (error) toast.error(error.message);
    else toast.success(project.is_published ? 'Unpublished' : 'Published');
  };

  if (creating || editing) {
    return (
      <ProjectEditor
        project={editing}
        onSave={async (data) => {
          if (editing) {
            const { error } = await updateProject(editing.id, data);
            if (error) { toast.error(error.message); return; }
            toast.success('Project updated');
          } else {
            const { error } = await createProject(data);
            if (error) { toast.error(error.message); return; }
            toast.success('Project created');
          }
          setEditing(null);
          setCreating(false);
        }}
        onCancel={() => { setEditing(null); setCreating(false); }}
      />
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-2xl">Projects</h2>
        <button
          onClick={() => setCreating(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground font-body text-sm rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Project
        </button>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-center gap-4 p-4 border border-border/20 rounded-lg">
              <Skeleton className="w-16 h-12 rounded" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-3 w-56" />
              </div>
              <div className="flex gap-2">
                <Skeleton className="w-8 h-8 rounded" />
                <Skeleton className="w-8 h-8 rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : projects.length === 0 ? (
        <p className="font-body text-sm text-muted-foreground">No projects yet. Add your first one.</p>
      ) : (
        <div className="space-y-2">
          {projects.map((project) => (
            <div
              key={project.id}
              className="flex items-center justify-between p-4 border border-border/20 rounded-lg hover:border-border/40 transition-colors group"
            >
              <div className="flex items-center gap-4">
                {project.cover_image_url ? (
                  <img src={project.cover_image_url} alt="" className="w-16 h-12 object-cover rounded-md" />
                ) : (
                  <div className="w-16 h-12 bg-muted/30 rounded-md flex items-center justify-center">
                    <span className="font-body text-[10px] text-muted-foreground/50">No img</span>
                  </div>
                )}
                <div>
                  <h3 className="font-body text-sm font-medium">{project.title}</h3>
                  <p className="font-body text-xs text-muted-foreground">
                    {project.client} · {project.category} · {project.year}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => handleTogglePublish(project)} className="p-2 text-muted-foreground hover:text-primary transition-colors" title={project.is_published ? 'Unpublish' : 'Publish'}>
                  {project.is_published ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
                <button onClick={() => setEditing(project)} className="p-2 text-muted-foreground hover:text-primary transition-colors">
                  <Pencil className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(project)} className="p-2 text-muted-foreground hover:text-destructive transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectsManager;
