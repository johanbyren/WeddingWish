import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Lock, Eye, EyeOff } from 'lucide-react';

interface PasswordProtectionProps {
  onPasswordCorrect: () => void;
  language: 'en' | 'sv';
}

const PasswordProtection: React.FC<PasswordProtectionProps> = ({ onPasswordCorrect, language }) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Get the wedding ID from the URL
      const pathParts = window.location.pathname.split('/');
      const weddingId = pathParts[pathParts.length - 1];
      
      const response = await fetch(`${import.meta.env.VITE_API_URL}api/show-wedding/${weddingId}/verify-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      if (response.ok) {
        // Store the verification in session storage
        sessionStorage.setItem(`wedding_${weddingId}_verified`, 'true');
        onPasswordCorrect();
      } else {
        setError(language === 'sv' ? 'Felaktigt lösenord' : 'Incorrect password');
      }
    } catch (error) {
      setError(language === 'sv' ? 'Ett fel uppstod' : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const translations = {
    en: {
      title: 'Password Protected',
      description: 'This wedding page is password protected. Please enter the password to continue.',
      passwordLabel: 'Password',
      passwordPlaceholder: 'Enter password',
      submitButton: 'Access Wedding Page',
      incorrectPassword: 'Incorrect password',
      errorOccurred: 'An error occurred'
    },
    sv: {
      title: 'Lösenordsskyddad',
      description: 'Denna bröllopssida är lösenordsskyddad. Vänligen ange lösenordet för att fortsätta.',
      passwordLabel: 'Lösenord',
      passwordPlaceholder: 'Ange lösenord',
      submitButton: 'Kom åt bröllopssidan',
      incorrectPassword: 'Felaktigt lösenord',
      errorOccurred: 'Ett fel uppstod'
    }
  };

  const t = translations[language];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-white/80 backdrop-blur-sm" />
      <Card className="w-full max-w-md relative z-10 shadow-xl">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center">
            <Lock className="w-8 h-8 text-pink-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">{t.title}</CardTitle>
          <CardDescription className="text-gray-600">
            {t.description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                {t.passwordLabel}
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t.passwordPlaceholder}
                  className="pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
            
            {error && (
              <div className="text-red-600 text-sm text-center bg-red-50 p-2 rounded">
                {error}
              </div>
            )}
            
            <Button
              type="submit"
              className="w-full bg-pink-600 hover:bg-pink-700 text-white"
              disabled={isLoading || !password.trim()}
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>{language === 'sv' ? 'Kontrollerar...' : 'Verifying...'}</span>
                </div>
              ) : (
                t.submitButton
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default PasswordProtection;
