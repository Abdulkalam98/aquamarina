import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Cookie management utilities for session persistence
export const cookieUtils = {
  // Set a cookie with expiration
  setCookie: (name: string, value: string, days: number = 7) => {
    const expires = new Date();
    expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
    const isSecure = location.protocol === 'https:';
    const secureFlag = isSecure ? ';Secure' : '';
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax${secureFlag}`;
  },

  // Get a cookie value
  getCookie: (name: string): string | null => {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  },

  // Delete a cookie
  deleteCookie: (name: string) => {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  },

  // Set session data in both localStorage and cookies
  setSessionData: (sessionData: any) => {
    const sessionStr = JSON.stringify(sessionData);
    localStorage.setItem('supabase.auth.session', sessionStr);
    // Also set as httpOnly-like cookie for additional security
    cookieUtils.setCookie('supabase-session', 'true', 1); // 1 day expiry
  },

  // Clear all session data
  clearSessionData: () => {
    localStorage.removeItem('supabase.auth.session');
    cookieUtils.deleteCookie('supabase-session');
    cookieUtils.deleteCookie('supabase-auth-token');
  }
};
