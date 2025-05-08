import { Link, Outlet, useLocation } from "react-router-dom"
import { Button } from "~/components/ui/button"
import { HeartIcon, Gift, Calendar, Settings, LogOut, Plus } from "lucide-react"
import { useAuth } from "~/context/auth";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const location = useLocation();

  return (
    <div className="flex min-h-screen flex-col">
      <header className="px-4 lg:px-6 h-14 flex items-center border-b">
        <Link to="/" className="flex items-center gap-2 font-semibold">
          <HeartIcon className="h-6 w-6 text-pink-500" />
          <span>WeddingWish{user ? ` - ${user.email}` : ''}</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
            <Button variant="ghost" size="sm" onClick={logout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
        </nav>
      </header>
      <div className="flex flex-1">
        <aside className="w-64 border-r hidden md:block p-4">
          <nav className="space-y-2">
            <Link to="/dashboard">
              <Button 
                variant="ghost" 
                className={`w-full justify-start ${location.pathname === "/dashboard" ? "bg-accent" : ""}`}
              >
                <Calendar className="h-4 w-4 mr-2" />
                Wedding Details
              </Button>
            </Link>
            <Link to="/dashboard/gifts">
              <Button 
                variant="ghost" 
                className={`w-full justify-start ${location.pathname === "/dashboard/gifts" ? "bg-accent" : ""}`}
              >
                <Gift className="h-4 w-4 mr-2" />
                Gift Registry
              </Button>
            </Link>
            <Link to="/dashboard/create">
              <Button 
                variant="ghost" 
                className={`w-full justify-start ${location.pathname === "/dashboard/create" ? "bg-accent" : ""}`}
              >
                <Plus className="h-4 w-4 mr-2" />
                Create New Page
              </Button>
            </Link>
            <Link to="/dashboard/settings">
              <Button 
                variant="ghost" 
                className={`w-full justify-start ${location.pathname === "/dashboard/settings" ? "bg-accent" : ""}`}
              >
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </Link>
          </nav>
        </aside>
        <main className="flex-1 p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
