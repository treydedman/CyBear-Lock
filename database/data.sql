-- Insert Guest User
INSERT INTO "users" ("email", "username", "hashedPassword", "createdAt")
VALUES (
  'guest@example.com',
  'Guest',
  '$argon2id$v=19$m=65536,t=3,p=4$PM5uRdmKQKpekeEroT5WLg$1px0Sid/LzwGZewfa/W/Whb8UkNf0E0kiX6pFTMoJr4',
  NOW()
);

-- Insert Guest User Password Entries
INSERT INTO "passwordEntries" (
  "userId", "website", "accountUsername", "encryptedPassword"
  )
VALUES
(1, 'github.com', 'KeepPushing', 'lWjOiDe5Z7743wqsmX+6tw=='),
(1, 'canva.com', 'AlmostOriginal', 'Ahw5lGfYxEZF/2PnnrDeNA=='),
(1, 'indeed.com', 'HireMePls', 'fFdT6hOq2yKv2Z5xYx1K4Q==');
