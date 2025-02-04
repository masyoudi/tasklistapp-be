CREATE TABLE IF NOT EXISTS tasks (
  id uuid DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  created_at BIGINT NOT NULL,
  created_by uuid NOT NULL,
  updated_at BIGINT,
  updated_by UUID,
  PRIMARY KEY (id)
);
