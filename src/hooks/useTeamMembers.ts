import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  image_url: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export const useTeamMembers = () => {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMembers = useCallback(async () => {
    const { data } = await supabase
      .from('team_members')
      .select('*')
      .order('sort_order', { ascending: true });
    if (data) setMembers(data as unknown as TeamMember[]);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchMembers();

    const channel = supabase
      .channel('team_members_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'team_members' }, () => {
        fetchMembers();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [fetchMembers]);

  const createMember = async (member: Partial<TeamMember>) => {
    const { error } = await supabase.from('team_members').insert(member as any);
    return { error };
  };

  const updateMember = async (id: string, updates: Partial<TeamMember>) => {
    const { error } = await supabase.from('team_members').update(updates as any).eq('id', id);
    return { error };
  };

  const deleteMember = async (id: string) => {
    const { error } = await supabase.from('team_members').delete().eq('id', id);
    return { error };
  };

  return { members, loading, createMember, updateMember, deleteMember, refetch: fetchMembers };
};
