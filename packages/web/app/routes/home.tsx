import { Link } from "react-router-dom"
import { Button } from "~/components/ui/button"
import { HeartIcon, LogIn, LogOut, UserPlus } from "lucide-react"
import { useAuth } from "~/context/auth";
import { LanguageSelector, useTranslation } from "~/context/translation";

export default function Home() {
  const { loggedIn, user, loaded, login, logout, error, clearError } = useAuth();
  const { t } = useTranslation();

  return (
    <div 
      className="flex flex-col min-h-screen relative overflow-x-hidden"
      style={{
        background: 'linear-gradient(135deg, #ffffff 0%, #fdf2f8 25%, #fce7f3 50%, #fbcfe8 75%, #f9a8d4 100%)',
      }}
    >
      {/* Animated floating shapes */}
      <div className="absolute inset-0 overflow-hidden">
        <div 
          className="absolute w-[500px] h-[400px] rounded-full animate-pulse"
          style={{
            top: '10%',
            left: '10%',
            background: 'radial-gradient(circle, rgba(251, 207, 232, 0.4) 0%, transparent 70%)',
            filter: 'blur(60px)',
            animationDuration: '4s'
          }}
        ></div>
        <div 
          className="absolute w-[400px] h-[300px] rounded-full animate-pulse"
          style={{
            top: '60%',
            right: '15%',
            background: 'radial-gradient(circle, rgba(249, 168, 212, 0.3) 0%, transparent 70%)',
            filter: 'blur(50px)',
            animationDuration: '5s',
            animationDelay: '2s'
          }}
        ></div>
        <div 
          className="absolute w-[350px] h-[500px] rounded-full animate-pulse"
          style={{
            bottom: '20%',
            left: '20%',
            background: 'radial-gradient(circle, rgba(244, 114, 182, 0.25) 0%, transparent 70%)',
            filter: 'blur(70px)',
            animationDuration: '6s',
            animationDelay: '4s'
          }}
        ></div>
        <div 
          className="absolute w-[300px] h-[300px] rounded-full animate-pulse"
          style={{
            top: '30%',
            right: '30%',
            background: 'radial-gradient(circle, rgba(236, 72, 153, 0.2) 0%, transparent 70%)',
            filter: 'blur(40px)',
            animationDuration: '3s',
            animationDelay: '1s'
          }}
        ></div>
      </div>
      
      <header className="px-4 lg:px-6 h-14 flex items-center border-b bg-white/80 backdrop-blur-sm relative z-10">
        <Link to="/" className="flex items-center gap-2 font-semibold">
          <HeartIcon className="h-6 w-6 text-pink-500" />
          <span>
            Our Dream Day
            {user && <span className="text-sm text-gray-500 font-normal ml-1">- {user.email}</span>}
          </span>
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
      <main className="flex-1 flex flex-col relative z-10">
        <section className="flex-1 flex items-center w-full">
          <div className="container px-4 md:px-6 mx-auto">
            {error && (
              <div className="mb-6 mx-auto max-w-md">
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center justify-between">
                  <span className="text-sm">{error}</span>
                  <button 
                    onClick={clearError}
                    className="ml-2 text-red-500 hover:text-red-700 font-bold text-lg"
                    aria-label="Close error message"
                  >
                    ×
                  </button>
                </div>
              </div>
            )}
            <div className="flex flex-col items-center space-y-8 text-center">
              <div className="space-y-4">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl text-gray-900">
                  {t('home.title')}
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-600 md:text-xl">
                  {t('home.subtitle')}
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
                {user ? (
                  <Link to="/dashboard">
                    <Button size="lg" className="bg-pink-500 hover:bg-pink-600 text-white px-8">
                      {t('home.dashboard')}
                    </Button>
                  </Link>
                ) : (
                  <Button size="lg" className="bg-pink-500 hover:bg-pink-600 text-white px-8" onClick={login}>
                    {t('home.getStarted')}
                  </Button>
                )}
                <Button size="lg" variant="outline" className="border-pink-200 hover:bg-pink-50 px-8" onClick={login}>
                  {t('home.learnMore')}
                </Button>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
              <div className="flex flex-col items-center space-y-4 bg-white/70 backdrop-blur-sm border border-pink-100 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="p-4 rounded-full bg-gradient-to-br from-pink-100 to-pink-200">
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
                <h3 className="text-xl font-bold text-gray-900">{t('home.createPage')}</h3>
                <p className="text-center text-gray-600">
                  {t('home.createPageDesc')}
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 bg-white/70 backdrop-blur-sm border border-pink-100 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="p-4 rounded-full bg-gradient-to-br from-pink-100 to-pink-200">
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
                <h3 className="text-xl font-bold text-gray-900">{t('home.addWishlist')}</h3>
                <p className="text-center text-gray-600">
                  {t('home.addWishlistDesc')}
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 bg-white/70 backdrop-blur-sm border border-pink-100 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="p-4 rounded-full bg-gradient-to-br from-pink-100 to-pink-200">
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
                <h3 className="text-xl font-bold text-gray-900">{t('home.receiveContributions')}</h3>
                <p className="text-center text-gray-600">
                  {t('home.receiveContributionsDesc')}
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full border-t border-pink-100 px-4 md:px-6 bg-white/80 backdrop-blur-sm relative z-10">
        <p className="text-xs text-gray-600">{t('home.copyright')}</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link to="#" className="text-xs text-gray-600 hover:text-pink-600 hover:underline underline-offset-4 transition-colors">
            {t('home.terms')}
          </Link>
          <Link to="#" className="text-xs text-gray-600 hover:text-pink-600 hover:underline underline-offset-4 transition-colors">
            {t('home.privacy')}
          </Link>
        </nav>
      </footer>
    </div>
  )
}
