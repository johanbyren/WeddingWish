import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { HeartIcon, LogIn } from "lucide-react";
import { useAuth } from "~/context/auth";
import { useTranslation } from "~/context/translation";


export default function Register() {
  const auth = useAuth();
  const { login } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    // password: "",
    // confirmPassword: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const body = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      createdAt: new Date().toISOString().split("T")[0],
      updatedAt: new Date().toISOString().split("T")[0],
    };

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}api/user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${await auth.getToken()}`,
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to register');
      }

      console.log('response: ', response);

      // navigate("/dashboard");
      
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <header className="px-4 lg:px-6 h-14 flex items-center border-b">
        <Link to="/" className="flex items-center gap-2 font-semibold">
          <HeartIcon className="h-6 w-6 text-pink-500" />
          <span>WeddingWish</span>
        </Link>
      </header>
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="mx-auto w-full max-w-md space-y-6">
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold">{t('register.title')}</h1>
            <p className="text-gray-500">{t('register.subtitle')}</p>
          </div>
          <div className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">{t('register.firstName')}</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  placeholder={t('register.firstNamePlaceholder')}
                  required
                  value={formData.firstName}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">{t('register.lastName')}</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  placeholder={t('register.lastNamePlaceholder')}
                  required
                  value={formData.lastName}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">{t('register.email')}</Label>
                <Input
                  id="email"
                  name="email"
                  placeholder={t('register.emailPlaceholder')}
                  required
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              {/* <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  required
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  required
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
              </div> */}
              {error && <p className="text-sm text-red-500">{error}</p>}
              <Button type="submit" className="w-full bg-pink-500 hover:bg-pink-600">
                {t('register.submit')}
              </Button>
            </form>
            <div className="text-center text-sm">
              {t('register.alreadyHaveAccount')}{" "}
              <button onClick={login} className="underline bg-transparent border-none p-0 text-inherit cursor-pointer">
                {t('register.login')}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 