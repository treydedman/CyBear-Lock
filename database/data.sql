-- Use SQL insert statements to add any
-- starting/dummy data to your database tables

-- EXAMPLE:

--  insert into "todos"
--    ("task", "isCompleted")
--    values
--      ('Learn to code', false),
--      ('Build projects', false),
--      ('Get a job', false);

-- Insert Users
INSERT INTO "users" ("userId", "email", "username", "hashedPassword", "createdAt") VALUES
(1, 'john.doe@example.com', 'johndoe', '$2b$12$abcdefghijABCDEFGHIJabcdefghijABCDEFGHIJabcdefghij', NOW()),
(2, 'jane.smith@example.com', 'janesmith', '$2b$12$klmnopqrstKLMNOPQRSTklmnopqrstKLMNOPQRSTklmnopqrst', NOW()),
(3, 'alex.taylor@example.com', 'alextaylor', '$2b$12$uvwxyzUVWXyzUVWXYZuvwxyzUVWXYZuvwxyzUVWXYZ', NOW());

-- Insert Password Entries
INSERT INTO "passwordEntries" ("entryId", "userId", "website", "accountUsername", "encryptedPassword", "category", "tags", "createdAt", "updatedAt", "deletedAt") VALUES
(1, 1, 'google.com', 'johndoe', 'ENCRYPTED_PASSWORD_1', 'Personal', 'email, search, google', NOW(), NOW(), NULL),
(2, 1, 'amazon.com', 'johndoe123', 'ENCRYPTED_PASSWORD_2', 'Shopping', 'shopping, e-commerce', NOW(), NOW(), NULL),
(3, 2, 'linkedin.com', 'janesmith', 'ENCRYPTED_PASSWORD_3', 'Work', 'networking, work, social', NOW(), NOW(), NULL),
(4, 2, 'github.com', 'janesmith_dev', 'ENCRYPTED_PASSWORD_4', 'Work', 'development, coding, git', NOW(), NOW(), NULL),
(5, 3, 'steam.com', 'alextaylor99', 'ENCRYPTED_PASSWORD_5', 'Gaming', 'games, steam, entertainment', NOW(), NOW(), NULL),
(6, 3, 'paypal.com', 'alext_finance', 'ENCRYPTED_PASSWORD_6', 'Finance', 'banking, money, transactions', NOW(), NOW(), NULL);
