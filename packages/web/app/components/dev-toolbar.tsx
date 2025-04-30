import { useAuth } from "../context/auth";
import { Button } from "./ui/button";

export function DevToolbar() {
  const { loggedIn, user, login, logout  } = useAuth();

  // Check if we're in development mode
  if (import.meta.env.PROD) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-100 border-t p-2 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">Dev Tools:</span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => (loggedIn ? logout() : login())}
        >
          {loggedIn ? 'Dev Logout' : 'Dev Login'}
        </Button>
      </div>
      {loggedIn && user && (
        <div className="text-sm">
          Logged in as: {user.email} (Mock User)
        </div>
      )}
    </div>
  );
} 