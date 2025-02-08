CREATE TABLE IF NOT EXISTS tasks (
  id uuid DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  due_date BIGINT,
  label_id uuid,
  created_at BIGINT NOT NULL,
  created_by uuid NOT NULL,
  updated_at BIGINT,
  updated_by UUID,
  PRIMARY KEY (id),
  CONSTRAINT fk_task_labels
    FOREIGN KEY(label_id)
    REFERENCES task_labels(id)
    ON DELETE SET NULL
);
