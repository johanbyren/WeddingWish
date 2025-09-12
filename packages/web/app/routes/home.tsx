import { Link } from "react-router-dom"
import { Button } from "~/components/ui/button"
import { HeartIcon, LogIn, LogOut, UserPlus } from "lucide-react"
import { useAuth } from "~/context/auth";
import { LanguageSelector, useTranslation } from "~/context/translation";

export default function Home() {
  const { loggedIn, user, loaded, login, logout } = useAuth();
  const { t } = useTranslation();

  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-14 flex items-center border-b">
        <Link to="/" className="flex items-center gap-2 font-semibold">
          <HeartIcon className="h-6 w-6 text-pink-500" />
          <span>WeddingWish{user ? ` - ${user.email}` : ''}</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6 items-center">
          <LanguageSelector />
          {!user ? (
            <>
              <Button variant="ghost" size="sm" onClick={login}>
                <LogIn className="h-4 w-4 mr-2" />
                {t('home.login')}
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/register" className="flex items-center">
                  <UserPlus className="h-4 w-4 mr-2" />
                  {t('home.register')}
                </Link>
              </Button>
            </>
          ) : (
            <Button variant="ghost" size="sm" onClick={logout}>
              <LogOut className="h-4 w-4 mr-2" />
              {t('home.logout')}
            </Button>
          )}
        </nav>
      </header>
      <main className="flex-1 flex flex-col">
        <section className="flex-1 flex items-center w-full bg-gradient-to-b from-white to-pink-50">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                  {t('home.title')}
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl">
                  {t('home.subtitle')}
                </p>
              </div>
              <div className="space-x-4">
                {user ? (
                  <Link to="/dashboard" className="block">
                    <Button size="lg" className="w-full bg-pink-500 hover:bg-pink-600">
                      {t('home.dashboard')}
                    </Button>
                  </Link>
                ) : (
                  <Button size="lg" className="bg-pink-500 hover:bg-pink-600" onClick={login}>
                    {t('home.getStarted')}
                  </Button>
                )}
                <Button size="lg" variant="outline" onClick={login}>
                  {t('home.learnMore')}
                </Button>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-white">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
              <div className="flex flex-col items-center space-y-2 border p-6 rounded-lg shadow-sm">
                <div className="p-3 rounded-full bg-pink-100">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-6 w-6 text-pink-500"
                  >
                    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold">{t('home.createPage')}</h3>
                <p className="text-center text-gray-500">
                  {t('home.createPageDesc')}
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 border p-6 rounded-lg shadow-sm">
                <div className="p-3 rounded-full bg-pink-100">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-6 w-6 text-pink-500"
                  >
                    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold">{t('home.addWishlist')}</h3>
                <p className="text-center text-gray-500">
                  {t('home.addWishlistDesc')}
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 border p-6 rounded-lg shadow-sm">
                <div className="p-3 rounded-full bg-pink-100">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-6 w-6 text-pink-500"
                  >
                    <path d="M5 12h14" />
                    <path d="M12 5v14" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold">{t('home.receiveContributions')}</h3>
                <p className="text-center text-gray-500">
                  {t('home.receiveContributionsDesc')}
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full border-t px-4 md:px-6">
        <p className="text-xs text-gray-500">{t('home.copyright')}</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link to="#" className="text-xs hover:underline underline-offset-4">
            {t('home.terms')}
          </Link>
          <Link to="#" className="text-xs hover:underline underline-offset-4">
            {t('home.privacy')}
          </Link>
        </nav>
      </footer>
    </div>
  )
}
