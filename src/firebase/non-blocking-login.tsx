
'use client';
import {
  Auth,
  signInAnonymously,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';

/** Initiate anonymous sign-in (non-blocking). */
export function initiateAnonymousSignIn(authInstance: Auth): void {
  signInAnonymously(authInstance).catch(() => {
    // Silently handle anonymous sign-in errors
  });
}

/** Initiate Google sign-in (non-blocking). */
export function initiateGoogleSignIn(authInstance: Auth): void {
  const provider = new GoogleAuthProvider();
  // Using signInWithPopup for a better desktop experience
  // We catch errors to prevent them from bubbling up as unhandled promise rejections
  // and handle common popup cancellation errors gracefully.
  signInWithPopup(authInstance, provider).catch((error) => {
    if (
      error.code === 'auth/cancelled-popup-request' || 
      error.code === 'auth/popup-closed-by-user' ||
      error.code === 'auth/cancelled-by-user'
    ) {
      // These are expected user-driven cancellations, we can ignore them.
      return;
    }
    // Log other unexpected errors
    console.error("Firebase Auth Error:", error);
  });
}
