-- Add due_date column to tasks table
ALTER TABLE public.tasks
ADD COLUMN due_date DATE;

-- Create index for better performance on due_date queries
CREATE INDEX idx_tasks_due_date ON public.tasks(due_date);

-- Comment for documentation
COMMENT ON COLUMN public.tasks.due_date IS 'Data de vencimento da tarefa (opcional)';