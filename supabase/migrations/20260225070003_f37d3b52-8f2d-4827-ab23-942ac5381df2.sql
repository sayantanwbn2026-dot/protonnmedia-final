
-- Admin users table FIRST
CREATE TABLE public.admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Admin role check function (table exists now)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_users WHERE user_id = auth.uid()
  )
$$;

ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can view admin_users" ON public.admin_users FOR SELECT TO authenticated USING (public.is_admin());

-- Global settings (key-value store)
CREATE TABLE public.global_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT NOT NULL UNIQUE,
  value JSONB NOT NULL DEFAULT '{}',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.global_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read global_settings" ON public.global_settings FOR SELECT USING (true);
CREATE POLICY "Admins can insert global_settings" ON public.global_settings FOR INSERT TO authenticated WITH CHECK (public.is_admin());
CREATE POLICY "Admins can update global_settings" ON public.global_settings FOR UPDATE TO authenticated USING (public.is_admin());
CREATE POLICY "Admins can delete global_settings" ON public.global_settings FOR DELETE TO authenticated USING (public.is_admin());

-- Projects table
CREATE TABLE public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  client TEXT NOT NULL DEFAULT '',
  category TEXT NOT NULL DEFAULT 'Film',
  process_step TEXT NOT NULL DEFAULT 'Ideation',
  cover_image_url TEXT,
  hero_video_url TEXT,
  description TEXT NOT NULL DEFAULT '',
  outcome TEXT NOT NULL DEFAULT '',
  year TEXT NOT NULL DEFAULT '',
  duration TEXT NOT NULL DEFAULT '',
  team JSONB NOT NULL DEFAULT '[]',
  overview TEXT NOT NULL DEFAULT '',
  challenge TEXT NOT NULL DEFAULT '',
  solution TEXT NOT NULL DEFAULT '',
  behind_the_scenes JSONB NOT NULL DEFAULT '[]',
  videos JSONB NOT NULL DEFAULT '[]',
  stats JSONB NOT NULL DEFAULT '[]',
  awards TEXT[] DEFAULT '{}',
  testimonial JSONB,
  sort_order INT NOT NULL DEFAULT 0,
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read published projects" ON public.projects FOR SELECT USING (is_published = true OR public.is_admin());
CREATE POLICY "Admins can insert projects" ON public.projects FOR INSERT TO authenticated WITH CHECK (public.is_admin());
CREATE POLICY "Admins can update projects" ON public.projects FOR UPDATE TO authenticated USING (public.is_admin());
CREATE POLICY "Admins can delete projects" ON public.projects FOR DELETE TO authenticated USING (public.is_admin());

-- Contact submissions
CREATE TABLE public.contact_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can submit contact" ON public.contact_submissions FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can read submissions" ON public.contact_submissions FOR SELECT TO authenticated USING (public.is_admin());
CREATE POLICY "Admins can update submissions" ON public.contact_submissions FOR UPDATE TO authenticated USING (public.is_admin());
CREATE POLICY "Admins can delete submissions" ON public.contact_submissions FOR DELETE TO authenticated USING (public.is_admin());

-- Updated_at trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON public.projects FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_global_settings_updated_at BEFORE UPDATE ON public.global_settings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Media storage bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('media', 'media', true) ON CONFLICT (id) DO NOTHING;
CREATE POLICY "Anyone can view media" ON storage.objects FOR SELECT USING (bucket_id = 'media');
CREATE POLICY "Admins can upload media" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'media' AND public.is_admin());
CREATE POLICY "Admins can update media" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'media' AND public.is_admin());
CREATE POLICY "Admins can delete media" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'media' AND public.is_admin());

-- Enable realtime for projects and global_settings
ALTER PUBLICATION supabase_realtime ADD TABLE public.projects;
ALTER PUBLICATION supabase_realtime ADD TABLE public.global_settings;
