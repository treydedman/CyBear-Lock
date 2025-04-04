-- Use SQL insert statements to add any
-- starting/dummy data to your database tables

-- EXAMPLE:

--  insert into "todos"
--    ("task", "isCompleted")
--    values
--      ('Learn to code', false),
--      ('Build projects', false),
--      ('Get a job', false);

-- Insert Guest User
INSERT INTO "users" ("email", "username", "hashedPassword", "createdAt")
VALUES (
  'guest@example.com',
  'Guest',
  '$argon2id$v=19$m=65536,t=3,p=4$yW9WQZP0oQ0xPzMd3fHVkA$Bi7b4pkuVNHM3J4ITQIOX7Vm/fXACFzIHqLZTOMs/Mc',
  NOW()
);
