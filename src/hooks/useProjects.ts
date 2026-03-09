import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Project {
  id: string;
  slug: string;
  title: string;
  client: string;
  category: string;
  process_step: string;
  cover_image_url: string | null;
  hero_video_url: string | null;
  description: string;
  outcome: string;
  year: string;
  duration: string;
  team: { role: string; name: string }[];
  overview: string;
  challenge: string;
  solution: string;
  behind_the_scenes: { title: string; description: string; image: string }[];
  videos: { title: string; url: string; thumbnail: string }[];
  stats: { label: string; value: string }[];
  awards: string[];
  testimonial: { quote: string; author: string; role: string } | null;
  sort_order: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export const useProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProjects = async () => {
    const { data } = await supabase
      .from('projects')
      .select('*')
      .order('sort_order', { ascending: true });
    if (data) setProjects(data as unknown as Project[]);
    setLoading(false);
  };

  useEffect(() => {
    fetchProjects();

    const channel = supabase
      .channel('projects_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'projects' }, () => {
        fetchProjects();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const getProjectBySlug = (slug: string) => projects.find((p) => p.slug === slug);

  const createProject = async (project: Partial<Project>) => {
    const { error } = await supabase.from('projects').insert(project as any);
    return { error };
  };

  const updateProject = async (id: string, updates: Partial<Project>) => {
    const { error } = await supabase.from('projects').update(updates as any).eq('id', id);
    return { error };
  };

  const deleteProject = async (id: string) => {
    const { error } = await supabase.from('projects').delete().eq('id', id);
    return { error };
  };

  return { projects, loading, getProjectBySlug, createProject, updateProject, deleteProject, refetch: fetchProjects };
};
