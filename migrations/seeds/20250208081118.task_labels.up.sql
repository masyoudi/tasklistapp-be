CREATE TABLE IF NOT EXISTS task_labels (
  id uuid DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  color VARCHAR(8),
  created_at BIGINT NOT NULL,
  created_by uuid NOT NULL,
  updated_at BIGINT,
  updated_by UUID,
  PRIMARY KEY (id)
);
