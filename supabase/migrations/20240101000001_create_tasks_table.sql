-- Create tasks table
CREATE TABLE public.tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  due_date DATE,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Data API Grants
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.tasks TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.tasks TO service_role;

-- Enable RLS (REQUIRED)
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

-- Create policies for each operation
CREATE POLICY "tasks_select_policy" ON public.tasks
FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "tasks_insert_policy" ON public.tasks
FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "tasks_update_policy" ON public.tasks
FOR UPDATE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "tasks_delete_policy" ON public.tasks
FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Create index for better query performance
CREATE INDEX idx_tasks_user_id ON public.tasks(user_id);
CREATE INDEX idx_tasks_due_date ON public.tasks(due_date);
CREATE INDEX idx_tasks_completed ON public.tasks(completed);