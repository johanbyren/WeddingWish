import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Lock, Calendar, Heart } from 'lucide-react';
import { useTranslation } from '~/context/translation';

interface PrivateWeddingProps {
  language: 'en' | 'sv';
}

const PrivateWedding: React.FC<PrivateWeddingProps> = ({ language }) => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-white/80 backdrop-blur-sm" />
      <Card className="w-full max-w-md relative z-10 shadow-xl">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center">
            <Heart className="w-8 h-8 text-pink-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">{t('private.title')}</CardTitle>
          <CardDescription className="text-gray-600">
            {t('private.description')}
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <div className="space-y-2">
            <p className="text-gray-700 font-medium">{t('private.subtitle')}</p>
            <p className="text-sm text-gray-500">{t('private.contactMessage')}</p>
          </div>
          
          <div className="pt-4 border-t border-gray-200">
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
              <Lock className="w-4 h-4" />
              <span>{language === 'sv' ? 'Privat bröllopssida' : 'Private wedding page'}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PrivateWedding;
