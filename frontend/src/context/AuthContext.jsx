import { createContext, useContext, useState, useEffect, useCallback } from "react";
import * as authService from "../services/auth";

const AuthContext = createContext(null);

// Your backend's user shape may differ slightly from what the rest of the
// frontend expects. This normalizes it in one place so every component
// (navbar initials, dashboard greetings, RoleRoute checks, etc.) keeps
// working regardless of whether the backend sends:
//   - a single "role" string vs. a "roles" array
//   - a combined "fullname" vs. separate "firstName"/"lastName"
function normalizeUser(rawUser) {
  if (!rawUser) return null;

  const roles = Array.isArray(rawUser.roles)
    ? rawUser.roles
    : rawUser.role
    ? [rawUser.role]
    : [];

  let firstName = rawUser.firstName;
  let lastName = rawUser.lastName;

  if (!firstName && rawUser.fullname) {
    const parts = rawUser.fullname.trim().split(" ");
    firstName = parts[0];
    lastName = parts.slice(1).join(" ");
  }

  const fullname = rawUser.fullname || [firstName, lastName].filter(Boolean).join(" ");

  return {
    ...rawUser,
    roles,
    firstName,
    lastName,
    fullname,
  };
}

function persistUser(user) {
  if (user) {
    localStorage.setItem("user", JSON.stringify(user));
  } else {
    localStorage.removeItem("user");
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // NOTE: the backend has no GET /auth/me endpoint yet. Rather than
  // re-fetching the user on every page load (which would fail), hydrate
  // from the copy we stored in localStorage at login/register time.
  // Once a real /auth/me endpoint exists, swap this back to a fetch call.
  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (!token || !storedUser) {
      setLoading(false);
      return;
    }

    try {
      setUser(normalizeUser(JSON.parse(storedUser)));
    } catch {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    } finally {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (email, password) => {
    const data = await authService.login(email, password);
    localStorage.setItem("token", data.token);
    const normalized = normalizeUser(data.user);
    persistUser(normalized);
    setUser(normalized);
    return normalized;
  }, []);

  // Every new account is created with the client role by the backend.
  // Some backends return { token, user } immediately on register; others
  // just confirm the account was created and expect a separate login.
  // This handles both without crashing.
  const register = useCallback(async (payload) => {
    const data = await authService.register(payload);

    if (data.token && data.user) {
      localStorage.setItem("token", data.token);
      const normalized = normalizeUser(data.user);
      persistUser(normalized);
      setUser(normalized);
      return { autoLoggedIn: true, user: normalized };
    }

    // Registered, but backend didn't log them in automatically
    return { autoLoggedIn: false, user: null };
  }, []);

  const logout = useCallback(() => {
    authService.logout();
    persistUser(null);
    setUser(null);
  }, []);

  // Re-fetches the current user from the server. Will not work until a
  // real GET /auth/me endpoint exists on the backend — left in place for
  // that future case (e.g. picking up a newly-granted "provider" role).
  const refreshUser = useCallback(async () => {
    const data = await authService.fetchCurrentUser();
    const normalized = normalizeUser(data.user);
    persistUser(normalized);
    setUser(normalized);
    return normalized;
  }, []);

  // Merges a partial user update (e.g. the response from PATCH /users/me)
  // into local state directly — used instead of refreshUser() since there's
  // no GET /auth/me to re-fetch from.
  const updateUserLocally = useCallback((partialUser) => {
    setUser((prev) => {
      const merged = normalizeUser({ ...prev, ...partialUser });
      persistUser(merged);
      return merged;
    });
  }, []);

  const hasRole = useCallback((role) => Boolean(user?.roles?.includes(role)), [user]);

  const value = {
    user,
    roles: user?.roles ?? [],
    hasRole,
    isAuthenticated: Boolean(user),
    loading,
    login,
    register,
    logout,
    refreshUser,
    updateUserLocally,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
