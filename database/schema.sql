set client_min_messages to warning;

-- DANGER: this is NOT how to do it in the real world.
-- `drop schema` INSTANTLY ERASES EVERYTHING.
drop schema "public" cascade;

create schema "public";

CREATE TABLE "users" (
  "userId" SERIAL PRIMARY KEY,
  "email" varchar UNIQUE NOT NULL,
  "username" varchar UNIQUE NOT NULL,
  "hashedPassword" varchar NOT NULL,
  "createdAt" TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE "passwordEntries" (
  "entryId" SERIAL PRIMARY KEY,
  "userId" integer NOT NULL,
  "website" varchar NOT NULL,
  "accountUsername" varchar NOT NULL,
  "encryptedPassword" varchar NOT NULL,
  "category" varchar,
  "tags" text,
  "createdAt" TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  "updatedAt" TIMESTAMPTZ DEFAULT NOW(),
  "deletedAt" TIMESTAMPTZ
);

ALTER TABLE "passwordEntries" ADD FOREIGN KEY ("userId") REFERENCES "users" ("userId");
