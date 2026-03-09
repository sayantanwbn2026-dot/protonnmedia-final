-- Create team_members table for CMS management
CREATE TABLE public.team_members (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  role text NOT NULL DEFAULT '',
  bio text NOT NULL DEFAULT '',
  image_url text NOT NULL DEFAULT '',
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;

-- Anyone can read team members
CREATE POLICY "Anyone can read team_members" ON public.team_members FOR SELECT USING (true);

-- Only admins can modify
CREATE POLICY "Admins can insert team_members" ON public.team_members FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "Admins can update team_members" ON public.team_members FOR UPDATE USING (is_admin());
CREATE POLICY "Admins can delete team_members" ON public.team_members FOR DELETE USING (is_admin());

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.team_members;

-- Add updated_at trigger
CREATE TRIGGER update_team_members_updated_at
  BEFORE UPDATE ON public.team_members
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
