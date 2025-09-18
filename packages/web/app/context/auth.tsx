import {
  createContext,
  useState,
  useContext,
  type ReactNode,
  useEffect,
  useRef,
} from "react"
import { createClient } from "@openauthjs/openauth/client"
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router";
import type { UserType } from "@wedding-wish/core/user/types";

const client = createClient({
  clientID: "web",
  issuer: import.meta.env.VITE_AUTH_URL,
})

interface AuthContextType {
  user?: UserType
  loaded: boolean
  loggedIn: boolean
  logout: () => void
  login: () => Promise<void>
  error?: string
  clearError: () => void
  getToken: () => Promise<string | undefined>
}

const AuthContext = createContext({} as AuthContextType)

export function AuthProvider ({ children }: { children: ReactNode }) {
  const initializing = useRef(true);
  const [loaded, setLoaded] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const token = useRef<string | undefined>(undefined);
  const [user, setUser] = useState<UserType | undefined>();
  const [error, setError] = useState<string | undefined>();
  const navigate = useNavigate();


  useEffect(() => {
    const hash = new URLSearchParams(location.search.slice(1));
    const code = hash.get("code");
    const state = hash.get("state");

    if (!initializing.current) {
      return;
    }

    initializing.current = false;

    if (code && state) {
      callback(code, state);
      return;
    }

    auth();
  }, []);

  async function auth () {
    const token = await refreshTokens();

    if (token) {
      const decodedToken = jwtDecode<{ properties: UserType }>(token);
      setUser(decodedToken.properties);
      setLoggedIn(true);
    }

    setLoaded(true);
  }

  async function refreshTokens () {
    const refresh = localStorage.getItem("refresh");
    if (!refresh) {
      return;
    }
    const next = await client.refresh(refresh, {
      access: token.current,
    });
    if (next.err) {
      console.error("refreshTokens: Error refreshing token", next.err);
      // Clear invalid refresh token
      localStorage.removeItem("refresh");
      return;
    }
    if (!next.tokens) {
      return token.current;
    }

    localStorage.setItem("refresh", next.tokens.refresh);
    token.current = next.tokens.access;

    return next.tokens.access;
  }

  async function getToken () {
    const token = await refreshTokens();

    if (!token) {
      await login();
      return;
    }

    return token;
  }

  async function login () {
    const { challenge, url } = await client.authorize(location.origin, "code", {
      pkce: true,
    });
    sessionStorage.setItem("challenge", JSON.stringify(challenge));
    location.href = url;
  }

  async function callback (code: string, state: string) {
    try {
      const challengeData = sessionStorage.getItem("challenge");
      if (!challengeData) {
        setError("Authentication session expired. Please try logging in again.");
        navigate('/');
        return;
      }

      const challenge = JSON.parse(challengeData);
      
      if (!code) {
        setError("No authorization code received. Please try logging in again.");
        navigate('/');
        return;
      }

      if (state !== challenge.state || !challenge.verifier) {
        setError("Invalid authentication state. Please try logging in again.");
        navigate('/');
        return;
      }

      const exchanged = await client.exchange(
        code,
        location.origin,
        challenge.verifier,
      );

      if (exchanged.err) {
        console.error("callback: Token exchange failed", exchanged.err);
        setError("Login failed. Please check your verification code and try again.");
        navigate('/');
        return;
      }

      if (!exchanged.tokens) {
        setError("Failed to receive authentication tokens. Please try again.");
        navigate('/');
        return;
      }

      // Success - clear any previous errors
      setError(undefined);
      token.current = exchanged.tokens.access;
      localStorage.setItem("refresh", exchanged.tokens.refresh);

      const decodedToken = jwtDecode<{ properties: UserType }>(exchanged.tokens.access);
      setUser(decodedToken.properties);
      setLoggedIn(true);

      // Clean up session storage
      sessionStorage.removeItem("challenge");

      // Only redirect to dashboard on successful login
      navigate('/dashboard');
    } catch (err) {
      console.error("callback: Unexpected error during authentication", err);
      setError("An unexpected error occurred during login. Please try again.");
      navigate('/');
    }
  }

  function logout () {
    localStorage.removeItem("refresh");
    token.current = undefined;
    setUser(undefined);
    setLoggedIn(false);
    setError(undefined);
    window.location.replace('/');
  }

  function clearError () {
    setError(undefined);
  }

  return (
    <AuthContext.Provider
      value={{
        login,
        logout,
        user,
        loaded,
        loggedIn,
        error,
        clearError,
        getToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth () {
  return useContext(AuthContext);
}
