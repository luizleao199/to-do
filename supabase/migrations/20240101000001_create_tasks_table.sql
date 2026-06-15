-- Create tasks table for user's private tasks
CREATE TABLE public.tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  due_date DATE,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Data API Grants
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.tasks TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.tasks TO service_role;

-- Enable RLS (REQUIRED)
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

-- RLS Policies - Users can only access their own tasks
CREATE POLICY "tasks_select_own" ON public.tasks
FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "tasks_insert_own" ON public.tasks
FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "tasks_update_own" ON public.tasks
FOR UPDATE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "tasks_delete_own" ON public.tasks
FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Indexes for performance
CREATE INDEX idx_tasks_user_id ON public.tasks(user_id);
CREATE INDEX idx_tasks_user_id_completed ON public.tasks(user_id, completed);
CREATE INDEX idx_tasks_user_id_due_date ON public.tasks(user_id, due_date);
CREATE INDEX idx_tasks_created_at ON public.tasks(created_at DESC);

-- Trigger to auto-update updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER
LANGUAGE PLPGSQL
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_tasks_updated_at ON public.tasks;
CREATE TRIGGER on_tasks_updated_at
  BEFORE UPDATE ON public.tasks
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();