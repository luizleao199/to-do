-- Create publish.tasks table for published/shared tasks
CREATE TABLE public.publish_tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  original_task_id UUID REFERENCES public.tasks(id) ON DELETE SET NULL,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  due_date DATE,
  completed BOOLEAN DEFAULT FALSE,
  published_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  original_created_at TIMESTAMP WITH TIME ZONE
);

-- Enable Data API Grants
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.publish_tasks TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.publish_tasks TO service_role;

-- Allow public read access for published tasks (so others can see them)
GRANT SELECT ON TABLE public.publish_tasks TO anon;

-- Enable RLS (REQUIRED)
ALTER TABLE public.publish_tasks ENABLE ROW LEVEL SECURITY;

-- Policies
-- Users can read all published tasks (public)
CREATE POLICY "publish_tasks_public_read" ON public.publish_tasks
FOR SELECT USING (true);

-- Users can only insert their own published tasks
CREATE POLICY "publish_tasks_insert_own" ON public.publish_tasks
FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- Users can only update their own published tasks
CREATE POLICY "publish_tasks_update_own" ON public.publish_tasks
FOR UPDATE TO authenticated USING (auth.uid() = user_id);

-- Users can only delete their own published tasks
CREATE POLICY "publish_tasks_delete_own" ON public.publish_tasks
FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Indexes for performance
CREATE INDEX idx_publish_tasks_user_id ON public.publish_tasks(user_id);
CREATE INDEX idx_publish_tasks_published_at ON public.publish_tasks(published_at DESC);
CREATE INDEX idx_publish_tasks_original_task_id ON public.publish_tasks(original_task_id);