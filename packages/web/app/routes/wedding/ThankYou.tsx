import { Link, useParams } from "react-router-dom"
import { Button } from "~/components/ui/button"
import { HeartIcon, PartyPopper } from "lucide-react"

export default function ThankYouPage() {
  const { id } = useParams()
  
  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-14 flex items-center border-b">
        <Link to="/" className="flex items-center gap-2 font-semibold">
          <HeartIcon className="h-6 w-6 text-pink-500" />
          <span>WeddingWish</span>
        </Link>
      </header>
      <main className="flex-1 flex items-center justify-center bg-gradient-to-b from-white to-pink-50">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="max-w-2xl mx-auto text-center">
            <PartyPopper className="h-16 w-16 mx-auto text-pink-500 mb-6" />
            <h1 className="text-3xl font-bold mb-4">Thank You for Your Contribution!</h1>
            <p className="text-gray-700 mb-8">
              Your generosity means the world to us. Your contribution will help make our special day even more memorable.
              We can't wait to celebrate with you!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild className="bg-pink-500 hover:bg-pink-600">
                <Link to={`/wedding/${id}`}>Return to Wedding Page</Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/">Back to Home</Link>
              </Button>
            </div>
          </div>
        </div>
      </main>
      <footer className="border-t py-6">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="text-center text-sm text-gray-500">
            <p>© 2024 WeddingWish. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
