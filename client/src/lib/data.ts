import { User } from '../components/UserContext';

const authKey = 'um.auth';

type Auth = {
  user: User;
  token: string;
};

export type UnsavedPassword = {
  site: string;
  username: string;
  password: string;
};

export type Password = UnsavedPassword & {
  entryId: number;
};

// Save user authentication details
export function saveAuth(user: User, token: string): void {
  const auth: Auth = { user, token };
  localStorage.setItem(authKey, JSON.stringify(auth));
}

// Remove authentication details (Logout)
export function removeAuth(): void {
  localStorage.removeItem(authKey);
}

// Read the current authenticated user
export function readUser(): User | undefined {
  const auth = localStorage.getItem(authKey);
  if (!auth) return undefined;
  return (JSON.parse(auth) as Auth).user;
}

// Read the authentication token
export function readToken(): string | undefined {
  const auth = localStorage.getItem(authKey);
  if (!auth) return undefined;
  return (JSON.parse(auth) as Auth).token;
}

// Fetch all saved passwords
export async function readPasswords(): Promise<Password[]> {
  const token = readToken();
  if (!token) throw new Error('No authentication token found');

  const req = {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const res = await fetch('/api/passwords', req);
  if (!res.ok) throw new Error(`fetch Error ${res.status}`);
  return (await res.json()) as Password[];
}

// Insert a new password entry
export async function insertPassword(
  password: UnsavedPassword
): Promise<Password> {
  const token = readToken();
  if (!token) throw new Error('No authentication token found');

  const req = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(password),
  };
  const res = await fetch('/api/passwords', req);
  if (!res.ok) throw new Error(`fetch Error ${res.status}`);
  return (await res.json()) as Password;
}

// Update an existing password entry
export async function updatePassword(password: Password): Promise<Password> {
  const token = readToken();
  if (!token) throw new Error('No authentication token found');

  if (!password.entryId) {
    throw new Error('Password entry ID is missing');
  }

  const req = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(password),
  };

  const res = await fetch(`/api/passwords/${password.entryId}`, req);

  if (!res.ok) throw new Error(`fetch Error ${res.status}`);

  return (await res.json()) as Password;
}

// Remove a password entry
export async function removePassword(passwordId: number): Promise<void> {
  const token = readToken();
  if (!token) throw new Error('No authentication token found');

  const req = {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const res = await fetch(`/api/passwords/${passwordId}`, req);
  if (!res.ok) throw new Error(`fetch Error ${res.status}`);
}
