-- Add due_date column to tasks table (if not exists)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'tasks' AND column_name = 'due_date'
  ) THEN
    ALTER TABLE public.tasks ADD COLUMN due_date DATE;
  END IF;
END $$;

-- Create index for due_date if not exists
CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON public.tasks(due_date);