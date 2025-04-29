import { useAuth } from "../context/auth";
import { Button } from "./ui/button";

export function DevToolbar() {
  const { isAuthenticated, user, devLogin, logout } = useAuth();

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
          onClick={() => (isAuthenticated ? logout() : devLogin())}
        >
          {isAuthenticated ? 'Dev Logout' : 'Dev Login'}
        </Button>
      </div>
      {isAuthenticated && user && (
        <div className="text-sm">
          Logged in as: {user.email} (Mock User)
        </div>
      )}
    </div>
  );
} 