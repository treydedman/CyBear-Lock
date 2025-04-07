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
(1, 'github.com', 'KeepPushing', 'U2FsdGVkX1++jrQjeQFAbvOpfGV6herz3A7g/Kh2o+4='),
(1, 'canva.com', 'AlmostOriginal', 'U2FsdGVkX18Fa33ZTlDlMPVC+YTRSP4fTI2mwLhr9sk='),
(1, 'indeed.com', 'HireMePls', 'U2FsdGVkX18jBkaSuirZTz8PKd5FgHMF8Xd3huGB9mY=');
