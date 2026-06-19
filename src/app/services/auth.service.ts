import { inject, Injectable } from '@angular/core';
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  User,
  UserCredential,
} from 'firebase/auth';
import { FirebaseError } from 'firebase/app';
import { FIREBASE_AUTH } from '../firebase';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private auth = inject(FIREBASE_AUTH);

  /**
   * Creates a new Firebase user with email + password.
   * Optionally sets the account's display name.
   * Rejects with a user-friendly Error message on failure.
   */
  async register(email: string, password: string, displayName?: string): Promise<UserCredential> {
    try {
      const credential = await createUserWithEmailAndPassword(this.auth, email, password);
      if (displayName) {
        await updateProfile(credential.user, { displayName });
      }
      return credential;
    } catch (error) {
      throw new Error(this.mapError(error));
    }
  }

  /**
   * Signs an existing user in with email + password.
   * Rejects with a user-friendly Error message on failure.
   */
  async login(email: string, password: string): Promise<UserCredential> {
    try {
      return await signInWithEmailAndPassword(this.auth, email, password);
    } catch (error) {
      throw new Error(this.mapError(error));
    }
  }

  /** Signs the current user out. */
  logout(): Promise<void> {
    return signOut(this.auth);
  }

  /** Currently signed-in user, or null. */
  get currentUser(): User | null {
    return this.auth.currentUser;
  }

  /**
   * Resolves with the restored user (or null) once Firebase has finished
   * loading its persisted session. Use this in route guards instead of
   * `currentUser`, which is null for a moment after a page reload.
   */
  authReady(): Promise<User | null> {
    return new Promise((resolve) => {
      const unsubscribe = onAuthStateChanged(this.auth, (user) => {
        unsubscribe();
        resolve(user);
      });
    });
  }

  /** Translates Firebase auth error codes into messages safe to show the user. */
  private mapError(error: unknown): string {
    if (error instanceof FirebaseError) {
      switch (error.code) {
        case 'auth/email-already-in-use':
          return 'That email address is already registered.';
        case 'auth/invalid-email':
          return 'The email address is not valid.';
        case 'auth/weak-password':
          return 'The password is too weak (min. 6 characters).';
        case 'auth/operation-not-allowed':
          return 'Email/password sign-in is disabled for this project.';
        case 'auth/user-disabled':
          return 'This account has been disabled.';
        case 'auth/user-not-found':
        case 'auth/wrong-password':
        case 'auth/invalid-credential':
          return 'Incorrect email or password.';
        case 'auth/too-many-requests':
          return 'Too many attempts. Please try again later.';
        case 'auth/network-request-failed':
          return 'Network error. Check your connection and try again.';
        default:
          return 'Something went wrong. Please try again.';
      }
    }
    return 'Something went wrong. Please try again.';
  }
}
