/* eslint-disable @typescript-eslint/no-unused-vars -- Remove when used */
import 'dotenv/config';
import express from 'express';
import pg from 'pg';
import { ClientError, errorMiddleware, authMiddleware } from './lib/index.js';
import argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import { encrypt, decrypt } from './lib/cipher.js';

type User = {
  id: number;
  email: string;
  username: string;
  hashedPassword: string;
};
type Auth = {
  username: string;
  email?: string;
  password: string;
};

const db = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

const hashKey = process.env.TOKEN_SECRET;
if (!hashKey) throw new Error('TOKEN_SECRET not found in .env');

const app = express();

// Create paths for static directories
const reactStaticDir = new URL('../client/dist', import.meta.url).pathname;
const uploadsStaticDir = new URL('public', import.meta.url).pathname;

app.use(express.static(reactStaticDir));
// Static directory for file uploads server/public/
app.use(express.static(uploadsStaticDir));
app.use(express.json());

app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello, World!' });
});

/*
 * SIGN-UP ROUTE
 * - Validates required fields (email, username, password)
 * - Hashes password securely using Argon2
 * - Stores user in the database
 * - Returns user info (excluding password)
 */
app.post('/api/auth/sign-up', async (req, res, next) => {
  try {
    const { email, username, password } = req.body;
    console.log('Request Body:', req.body);
    if (!email || !username || !password) {
      throw new ClientError(400, 'Email, username and password are required');
    }

    const encryptedPassword = encrypt(password);

    const sql = `
    insert into "users" ("email", "username", "hashedPassword")
    values ($1, $2, $3)
    returning "userId", "email", "username", "createdAt";
    `;

    const params = [email, username, encryptedPassword];
    const result = await db.query<User>(sql, params);

    res.status(201).json({
      username: result.rows[0].username,
      email: result.rows[0].email,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * SIGN-IN ROUTE
 * - Authenticates user via email or username
 * - Verifies password using Argon2
 * - Issues a JWT token for authenticated sessions
 */
app.post('/api/auth/sign-in', async (req, res, next) => {
  try {
    const { email, username, password } = req.body;
    if ((!email && !username) || !password) {
      throw new ClientError(
        400,
        'email or username and the password are required'
      );
    }

    const sql = `
    select "userId", "email", "username", "hashedPassword"
    from "users"
    where "email" = $1 or "username" = $2;
    `;

    const params = [email, username];
    const result = await db.query<User>(sql, params);
    const user = result.rows[0];

    if (!user) throw new ClientError(401, 'invalid email or username');

    try {
      const decryptedPassword = decrypt(user.hashedPassword);
      if (decryptedPassword !== password) {
        throw new ClientError(401, 'Invalid password');
      }
    } catch (error) {
      throw new ClientError(500, 'Error decrypting password');
    }

    const payload = { id: user.id, email: user.email, username: user.username };
    const token = jwt.sign(payload, hashKey);

    res.status(200).json({ token, user: payload });
  } catch (err) {
    next(err);
  }
});

/**
 * RETRIEVE PASSWORD ENTRY ROUTE
 * - Fetches a specific stored password for an authenticated user
 * - Requires the website/service name and account username as parameters
 * - Decrypts the stored password before returning it
 * - Ensures only the authenticated user can retrieve their own stored credentials
 */
app.get(
  '/api/passwords/:website/:accountUsername',
  authMiddleware,
  async (req, res, next) => {
    try {
      const userId = req.user?.userId;
      console.log(req.user);
      if (!userId) throw new ClientError(401, 'Authentication required');

      const { website, accountUsername } = req.params;
      if (!website || !accountUsername) {
        throw new ClientError(400, 'Website and account username are required');
      }

      const sql = `
      select "userId", "website", "accountUsername", "encryptedPassword"
      from "password_entries"
      where "userId" = $1 and "website" = $2 and "account_username" = $3
      limit 1;
    `;

      const params = [userId, website, accountUsername];
      const result = await db.query(sql, params);
      const entry = result.rows[0];

      if (!entry) throw new ClientError(404, 'Password entry not found');

      const decryptedPassword = decrypt(entry.encryptedPassword);

      res.status(200).json({
        website: entry.website,
        accountUsername: entry.accountUsername,
        password: decryptedPassword,
      });
    } catch (err) {
      next(err);
    }
  }
);

app.post('/api/passwords', authMiddleware, async (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) throw new ClientError(401, 'authentication required');

    const { website, accountUsername, password } = req.body;
    if (!website || !accountUsername || !password) {
      throw new ClientError(400, 'credentials are required');
    }

    const encryptedPassword = encrypt(password);

    const sql = `
    insert into "passwordEntries" ("userId", "website", "accountUsername", "encryptedPassword")
    values ($1, $2, $3, $4)
    returning "website", "accountUsername", "createdAt";
    `;

    const params = [userId, website, accountUsername, encryptedPassword];
    const result = await db.query(sql, params);

    res.status(201).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
});

/*
 * Handles paths that aren't handled by any other route handler.
 * It responds with `index.html` to support page refreshes with React Router.
 * This must be the _last_ route, just before errorMiddleware.
 */
app.get('*', (req, res) => res.sendFile(`${reactStaticDir}/index.html`));

app.use(errorMiddleware);

app.listen(process.env.PORT, () => {
  console.log('Listening on port', process.env.PORT);
});
