import { EnvironmentProviders, InjectionToken, makeEnvironmentProviders } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { Auth, getAuth } from 'firebase/auth';
import { environment } from '../environments/environment';

/**
 * DI token for the Firebase Auth instance.
 * Inject it (`inject(FIREBASE_AUTH)`) instead of calling `getAuth()` directly,
 * so the app is initialized exactly once and services stay testable.
 */
export const FIREBASE_AUTH = new InjectionToken<Auth>('FIREBASE_AUTH');

/** Initializes the Firebase app (modular SDK) and exposes Auth via DI. */
export function provideFirebase(): EnvironmentProviders {
  return makeEnvironmentProviders([
    {
      provide: FIREBASE_AUTH,
      useFactory: () => {
        const app = initializeApp(environment.firebaseConfig);
        return getAuth(app);
      },
    },
  ]);
}
