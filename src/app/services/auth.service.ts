import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';

export interface UserProfile {
  username: string;
  fullName: string;
  email: string;
  phone: string;
  password: string; // stored hashed-style (plain for demo)
  role: 'user' | 'admin';
}

const STORAGE_KEY = 'explorex_users';
const SESSION_KEY = 'explorex_current_user';

const ADMIN_ACCOUNT: UserProfile = {
  username: 'admin',
  fullName: 'Admin User',
  email: 'admin@explorex.com',
  phone: '9999999999',
  password: 'admin123',
  role: 'admin'
};

@Injectable({ providedIn: 'root' })
export class AuthService {
  private currentUserSubject = new BehaviorSubject<UserProfile | null>(this.loadSession());

  /** Observable of the currently logged-in user */
  currentUser$: Observable<UserProfile | null> = this.currentUserSubject.asObservable();

  /** Observable boolean: true when logged in */
  isLoggedIn$: Observable<boolean> = this.currentUser$.pipe(map(u => u !== null));

  /** Observable of user role */
  userRole$: Observable<'user' | 'admin' | null> = this.currentUser$.pipe(
    map(u => u ? u.role : null)
  );

  /** Snapshot of current user */
  get currentUser(): UserProfile | null {
    return this.currentUserSubject.value;
  }

  constructor() {
    this.seedAdmin();
  }

  // ── Seed admin account ────────────────────────────────────────────────────────

  private seedAdmin() {
    const users = this.getAllUsers();
    const adminExists = users.find(u => u.username === ADMIN_ACCOUNT.username);
    if (!adminExists) {
      users.push(ADMIN_ACCOUNT);
      this.saveAllUsers(users);
    }
  }

  // ── Session helpers ──────────────────────────────────────────────────────────

  private loadSession(): UserProfile | null {
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  private saveSession(user: UserProfile | null) {
    if (user) {
      localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(SESSION_KEY);
    }
  }

  // ── User store (all registered accounts) ────────────────────────────────────

  private getAllUsers(): UserProfile[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  private saveAllUsers(users: UserProfile[]) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
  }

  // ── Public API ───────────────────────────────────────────────────────────────

  /**
   * Register a new user. Returns an error message string on failure, null on success.
   */
  register(profile: Omit<UserProfile, 'role'>): string | null {
    const users = this.getAllUsers();
    const exists = users.find(u => u.username.toLowerCase() === profile.username.toLowerCase());
    if (exists) {
      return 'Username already taken. Please choose another.';
    }
    const emailExists = users.find(u => u.email.toLowerCase() === profile.email.toLowerCase());
    if (emailExists) {
      return 'An account with this email already exists.';
    }
    const newUser: UserProfile = { ...profile, role: 'user' };
    users.push(newUser);
    this.saveAllUsers(users);
    this.saveSession(newUser);
    this.currentUserSubject.next(newUser);
    return null;
  }

  /**
   * Login with email + password. Returns error string on failure, null on success.
   */
  login(email: string, password: string): string | null {
    const users = this.getAllUsers();
    const user = users.find(
      u => u.email && u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );
    if (!user) {
      return 'Invalid email or password.';
    }
    this.saveSession(user);
    this.currentUserSubject.next(user);
    return null;
  }

  /** Log out the current user */
  logout() {
    this.saveSession(null);
    this.currentUserSubject.next(null);
  }

  /**
   * Update current user's profile. Returns error string on failure, null on success.
   */
  updateProfile(updates: Partial<Omit<UserProfile, 'username' | 'password' | 'role'>>): string | null {
    const current = this.currentUser;
    if (!current) return 'Not logged in.';

    const updated: UserProfile = { ...current, ...updates };

    // Persist to all-users store
    const users = this.getAllUsers();
    const idx = users.findIndex(u => u.username === current.username);
    if (idx !== -1) {
      users[idx] = updated;
    }
    this.saveAllUsers(users);
    this.saveSession(updated);
    this.currentUserSubject.next(updated);
    return null;
  }
}
