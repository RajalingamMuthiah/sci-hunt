"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import api from "../lib/axios";

const AuthContext = createContext(null);
export { AuthContext };

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [mfaRequired, setMfaRequired] = useState(false);
  const [mfaChallengeToken, setMfaChallengeToken] = useState(null);

  const bootstrapCsrf = useCallback(async () => {
    await api.get("/auth/csrf");
  }, []);

  const clearState = useCallback(() => {
    setUser(null);
    setIsAuthenticated(false);
    setMfaRequired(false);
    setMfaChallengeToken(null);
  }, []);

  const refreshProfile = useCallback(async () => {
    const { data } = await api.get("/auth/me");
    setUser(data);
    setIsAuthenticated(true);
    return data;
  }, []);

  const login = useCallback(async ({ email, password }) => {
    await bootstrapCsrf();
    const { data } = await api.post("/auth/login", { email, password });

    if (data?.mfaRequired) {
      setMfaRequired(true);
      setMfaChallengeToken(data.challengeToken || null);
      setIsAuthenticated(false);
      setUser(null);
      return { mfaRequired: true };
    }

    setMfaRequired(false);
    setMfaChallengeToken(null);

    if (data?.user) {
      setUser(data.user);
      setIsAuthenticated(true);
      return { mfaRequired: false, user: data.user };
    }

    const me = await refreshProfile();
    return { mfaRequired: false, user: me };
  }, [bootstrapCsrf, refreshProfile]);

  const verifyMfa = useCallback(async ({ code }) => {
    if (!mfaChallengeToken) {
      throw new Error("Missing MFA challenge token");
    }

    await bootstrapCsrf();
    const { data } = await api.post("/auth/mfa/verify", {
      challengeToken: mfaChallengeToken,
      code
    });

    setMfaRequired(false);
    setMfaChallengeToken(null);
    setUser(data);
    setIsAuthenticated(true);

    return data;
  }, [bootstrapCsrf, mfaChallengeToken]);

  const setupMfa = useCallback(async () => {
    await bootstrapCsrf();
    const { data } = await api.post("/auth/mfa/setup", {});
    return data;
  }, [bootstrapCsrf]);

  const enableMfa = useCallback(async ({ code }) => {
    await bootstrapCsrf();
    const { data } = await api.post("/auth/mfa/enable", { code });
    setUser(data);
    return data;
  }, [bootstrapCsrf]);

  const register = useCallback(async ({ name, email, password, role }) => {
    await bootstrapCsrf();
    const { data } = await api.post('/auth/register', { name, email, password, role });
    return data;
  }, [bootstrapCsrf]);

  const logout = useCallback(async () => {
    try {
      await bootstrapCsrf();
      await api.post("/auth/logout", {});
    } finally {
      clearState();
    }
  }, [bootstrapCsrf, clearState]);

  useEffect(() => {
    let active = true;

    const bootstrap = async () => {
      try {
        await bootstrapCsrf();
        await refreshProfile();
      } catch (_err) {
        if (active) {
          clearState();
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    };

    bootstrap();

    return () => {
      active = false;
    };
  }, [bootstrapCsrf, clearState, refreshProfile]);

  const value = useMemo(() => ({
    user,
    isAuthenticated,
    isLoading,
    mfaRequired,
    mfaChallengeToken,
    register,
    login,
    verifyMfa,
    setupMfa,
    enableMfa,
    refreshProfile,
    logout
  }), [
    user,
    isAuthenticated,
    isLoading,
    mfaRequired,
    mfaChallengeToken,
    register,
    login,
    verifyMfa,
    setupMfa,
    enableMfa,
    refreshProfile,
    logout
  ]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
