-- Predefined roles
INSERT INTO roles (name, created_at)
VALUES 
  ('ADMIN', CURRENT_TIMESTAMP),
  ('ANALYST', CURRENT_TIMESTAMP),
  ('VIEWER', CURRENT_TIMESTAMP)
ON CONFLICT (name) DO NOTHING;

-- Predefined Users (with BCrypt encrypted password hashes)
-- admin   : admin123
-- analyst : analyst123
-- viewer  : viewer123
INSERT INTO users (username, email, password_hash, enabled, created_at, updated_at)
VALUES 
  ('admin', 'admin@apisentinel.local', '$2a$10$8ccAP7eiYQs34fcnYk6wkexoYBt44HrLiw98hDtJrOjrqtWtG8fiK', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('analyst', 'analyst@apisentinel.local', '$2a$10$bCrhtSP3vkNYh7DZCMxk1OY4FoxWJaQYlbiRxmARgE0Ashi9YsBq6', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('viewer', 'viewer@apisentinel.local', '$2a$10$R8EIN1tT/QS07YdTsp1OF.ZUXrQnhdb8U0Pb3Nl1xTlJ5ulpM.mam', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (username) DO UPDATE 
SET password_hash = EXCLUDED.password_hash,
    enabled = true;

-- Assign Roles
INSERT INTO user_roles (user_id, role_id)
SELECT u.id, r.id FROM users u, roles r WHERE u.username = 'admin' AND r.name = 'ADMIN'
ON CONFLICT DO NOTHING;

INSERT INTO user_roles (user_id, role_id)
SELECT u.id, r.id FROM users u, roles r WHERE u.username = 'analyst' AND r.name = 'ANALYST'
ON CONFLICT DO NOTHING;

INSERT INTO user_roles (user_id, role_id)
SELECT u.id, r.id FROM users u, roles r WHERE u.username = 'viewer' AND r.name = 'VIEWER'
ON CONFLICT DO NOTHING;
