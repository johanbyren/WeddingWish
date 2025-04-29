import { Link, Outlet } from "react-router-dom"
import { Button } from "~/components/ui/button"
import { HeartIcon, Gift, Calendar, Settings, LogOut, Plus } from "lucide-react"

export default function Dashboard() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="px-4 lg:px-6 h-14 flex items-center border-b">
        <Link to="/" className="flex items-center gap-2 font-semibold">
          <HeartIcon className="h-6 w-6 text-pink-500" />
          <span>WeddingWish</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link to="/">
            <Button variant="ghost" size="sm">
              <LogOut className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </nav>
      </header>
      <div className="flex flex-1">
        <aside className="w-64 border-r hidden md:block p-4">
          <nav className="space-y-2">
            <Link to="/dashboard">
              <Button variant="ghost" className="w-full justify-start">
                <Calendar className="h-4 w-4 mr-2" />
                Wedding Details
              </Button>
            </Link>
            <Link to="/dashboard/gifts">
              <Button variant="ghost" className="w-full justify-start">
                <Gift className="h-4 w-4 mr-2" />
                Gift Registry
              </Button>
            </Link>
            <Link to="/dashboard/create">
              <Button variant="ghost" className="w-full justify-start">
                <Plus className="h-4 w-4 mr-2" />
                Create New Page
              </Button>
            </Link>
            <Link to="/dashboard/settings">
              <Button variant="ghost" className="w-full justify-start">
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
