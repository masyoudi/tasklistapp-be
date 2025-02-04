CREATE TABLE IF NOT EXISTS users (
  id uuid DEFAULT gen_random_uuid(),
  username VARCHAR(150) NOT NULL,
  name VARCHAR(250) NOT NULL,
  email VARCHAR(250) NOT NULL,
  password VARCHAR(250) NOT NULL,
  created_at BIGINT NOT NULL,
  created_by uuid NOT NULL,
  updated_at BIGINT,
  updated_by UUID,
  PRIMARY KEY (id)
);
