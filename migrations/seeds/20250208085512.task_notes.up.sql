CREATE TABLE IF NOT EXISTS task_notes (
  id uuid DEFAULT gen_random_uuid(),
  content TEXT NOT NULL,
  task_id uuid,
  created_at BIGINT NOT NULL,
  created_by uuid NOT NULL,
  updated_at BIGINT,
  updated_by UUID,
  PRIMARY KEY (id),
  CONSTRAINT fk_tasks
    FOREIGN KEY(task_id)
    REFERENCES tasks(id)
    ON DELETE CASCADE
);
