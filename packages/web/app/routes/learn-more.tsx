import { Link, useNavigate } from "react-router-dom"
import { Button } from "~/components/ui/button"
import { HeartIcon, CheckCircle, Users, CreditCard, Shield, Gift, Star, ArrowRight, ExternalLink, LogIn, LogOut, UserPlus } from "lucide-react"
import { useAuth } from "~/context/auth";
import { LanguageSelector, useTranslation } from "~/context/translation";

export default function LearnMore() {
  const { loggedIn, user, login, logout } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white">
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

      {/* Navigation Header */}
      <header className="px-4 lg:px-6 h-14 flex items-center border-b bg-white/80 backdrop-blur-sm relative z-10">
        <Link to="/" className="flex items-center gap-2 font-semibold">
          <HeartIcon className="h-6 w-6 text-pink-500" />
          <span>Our Dream Day</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6 items-center">
          <LanguageSelector />
          {!user ? (
            <>
              <Button variant="ghost" size="sm" onClick={login}>
                <LogIn className="h-4 w-4 mr-2" />
                {t('home.login')}
              </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate('/register')}
            >
              <UserPlus className="h-4 w-4 mr-2" />
              {t('home.register')}
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

      {/* Hero Section */}
      <section className="py-16 px-4 md:px-6 relative z-10">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="flex items-center justify-center gap-2 mb-6">
            <HeartIcon className="h-8 w-8 text-pink-500" />
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">Our Dream Day</h1>
          </div>
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-6">
            {t('learnMore.hero.title')}
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-3xl mx-auto">
            {t('learnMore.hero.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-pink-500 hover:bg-pink-600 text-white px-8"
              onClick={() => navigate('/register')}
            >
              {t('learnMore.hero.createButton')}
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-pink-200 hover:bg-pink-50 px-8"
              onClick={() => navigate('/')}
            >
              {t('learnMore.hero.backButton')}
            </Button>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 px-4 md:px-6 bg-white relative z-10">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
            {t('learnMore.howItWorks.title')}
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-pink-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-pink-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">{t('learnMore.howItWorks.step1.title')}</h3>
              <p className="text-gray-600">{t('learnMore.howItWorks.step1.description')}</p>
            </div>
            <div className="text-center">
              <div className="bg-pink-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Gift className="h-8 w-8 text-pink-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">{t('learnMore.howItWorks.step2.title')}</h3>
              <p className="text-gray-600">{t('learnMore.howItWorks.step2.description')}</p>
            </div>
            <div className="text-center">
              <div className="bg-pink-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <CreditCard className="h-8 w-8 text-pink-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">{t('learnMore.howItWorks.step3.title')}</h3>
              <p className="text-gray-600">{t('learnMore.howItWorks.step3.description')}</p>
            </div>
            <div className="text-center">
              <div className="bg-pink-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-pink-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">{t('learnMore.howItWorks.step4.title')}</h3>
              <p className="text-gray-600">{t('learnMore.howItWorks.step4.description')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 px-4 md:px-6 bg-pink-50 relative">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
            {t('learnMore.benefits.title')}
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="flex items-start gap-4">
              <CheckCircle className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-xl font-semibold mb-2">{t('learnMore.benefits.noAwkward.title')}</h3>
                <p className="text-gray-600">{t('learnMore.benefits.noAwkward.description')}</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <CheckCircle className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-xl font-semibold mb-2">{t('learnMore.benefits.transparent.title')}</h3>
                <p className="text-gray-600">{t('learnMore.benefits.transparent.description')}</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <CheckCircle className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-xl font-semibold mb-2">{t('learnMore.benefits.easyForGuests.title')}</h3>
                <p className="text-gray-600">{t('learnMore.benefits.easyForGuests.description')}</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <CheckCircle className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-xl font-semibold mb-2">{t('learnMore.benefits.fairPricing.title')}</h3>
                <p className="text-gray-600">{t('learnMore.benefits.fairPricing.description')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Legal Section */}
      <section className="py-16 px-4 md:px-6 bg-white relative z-10">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <Shield className="h-16 w-16 text-blue-500 mx-auto mb-4" />
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              {t('learnMore.trust.title')}
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              {t('learnMore.trust.subtitle')}
            </p>
          </div>
          <div className="bg-gray-50 rounded-lg p-8">
            <p className="text-gray-700 text-lg leading-relaxed mb-6">
              {t('learnMore.trust.explanation')}
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full">
                <Shield className="h-5 w-5 text-green-500" />
                <span className="text-sm font-medium">{t('learnMore.trust.swish')}</span>
              </div>
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full">
                <Shield className="h-5 w-5 text-green-500" />
                <span className="text-sm font-medium">{t('learnMore.trust.encrypted')}</span>
              </div>
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full">
                <Shield className="h-5 w-5 text-green-500" />
                <span className="text-sm font-medium">{t('learnMore.trust.secure')}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-16 px-4 md:px-6 bg-pink-50 relative">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12">
            {t('learnMore.testimonials.title')}
          </h2>
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-700 italic mb-4">"{t('learnMore.testimonials.quote1')}"</p>
              <p className="text-sm text-gray-500">- {t('learnMore.testimonials.author1')}</p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-700 italic mb-4">"{t('learnMore.testimonials.quote2')}"</p>
              <p className="text-sm text-gray-500">- {t('learnMore.testimonials.author2')}</p>
            </div>
          </div>
          
          {/* Social Media Links */}
          <div className="border-t pt-8">
            <h3 className="text-xl font-semibold mb-4">{t('learnMore.social.title')}</h3>
            <p className="text-gray-600 mb-6">{t('learnMore.social.description')}</p>
            <Button 
              variant="outline" 
              className="border-blue-200 hover:bg-blue-50"
              onClick={() => window.open('https://x.com/OurDreamDayWeb', '_blank', 'noopener,noreferrer')}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              {t('learnMore.social.twitter')}
            </Button>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-16 px-4 md:px-6 bg-gradient-to-r from-pink-500 to-pink-600 relative">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            {t('learnMore.cta.title')}
          </h2>
          <p className="text-xl text-pink-100 mb-8">
            {t('learnMore.cta.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-white text-pink-600 hover:bg-gray-50 px-8 shadow-lg hover:shadow-white/60 hover:shadow-[0_0_50px_15px_rgba(255,255,255,0.4)] transition-all duration-700 ease-out"
              onClick={() => navigate('/register')}
            >
              {t('learnMore.cta.createButton')}
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
            <Button 
              size="lg" 
              className="bg-white text-pink-600 hover:bg-gray-50 px-8 shadow-lg hover:shadow-white/60 hover:shadow-[0_0_50px_15px_rgba(255,255,255,0.4)] transition-all duration-700 ease-out"
              onClick={() => navigate('/')}
            >
              {t('learnMore.cta.homeButton')}
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 px-4 md:px-6 relative z-10">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <HeartIcon className="h-6 w-6 text-pink-500" />
            <span className="font-semibold">Our Dream Day</span>
          </div>
          <p className="text-gray-400 text-sm">
            {t('learnMore.footer.copyright')}
          </p>
        </div>
      </footer>
    </div>
  )
}
