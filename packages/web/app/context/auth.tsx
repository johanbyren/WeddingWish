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
  getToken: () => Promise<string | undefined>
}

const AuthContext = createContext({} as AuthContextType)

export function AuthProvider ({ children }: { children: ReactNode }) {
  const initializing = useRef(true);
  const [loaded, setLoaded] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const token = useRef<string | undefined>(undefined);
  const [user, setUser] = useState<UserType | undefined>();
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
    const challenge = JSON.parse(sessionStorage.getItem("challenge")!);
    if (code) {
      if (state === challenge.state && challenge.verifier) {
        const exchanged = await client.exchange(
          code!,
          location.origin,
          challenge.verifier,
        );
        if (!exchanged.err) {
          token.current = exchanged.tokens.access;
          localStorage.setItem("refresh", exchanged.tokens.refresh);

          const decodedToken = jwtDecode<{ properties: UserType }>(exchanged.tokens.access);
          setUser(decodedToken.properties);
          setLoggedIn(true);
        } else {
          console.error("callback: Token exchange failed", exchanged.err);
        }
      }
      // Use window.location.href for the initial redirect after auth
      window.location.href = '/dashboard';
    }
  }

  function logout () {
    localStorage.removeItem("refresh");
    token.current = undefined;
    setUser(undefined);
    setLoggedIn(false);
    window.location.replace('/');
  }

  return (
    <AuthContext.Provider
      value={{
        login,
        logout,
        user,
        loaded,
        loggedIn,
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
