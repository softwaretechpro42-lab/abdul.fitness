import React, { useEffect, useState } from 'react';
import { WifiOff } from 'lucide-react';
import { Language } from '../types';

interface Props {
  language: Language;
}

export const OfflineIndicator: React.FC<Props> = ({ language }) => {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline) return null;

  return (
    <aside
      aria-label="Offline status"
      className="fixed bottom-20 left-4 right-4 sm:left-auto sm:right-6 sm:bottom-6 z-50 flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-[#17241D] border border-[#FFAD5A]/50 text-[#FFAD5A] shadow-xl text-xs font-medium backdrop-blur-md animate-fade-in"
    >
      <WifiOff className="w-4 h-4 shrink-0 text-[#FFAD5A]" />
      <span>
        {language === 'ur'
          ? 'آف لائن موڈ فعال — آپ کا تمام ڈیٹا لوکل ڈیوائس پر محفوظ ہو رہا ہے۔'
          : 'Offline Mode active — All workout progress is saved directly to your device.'}
      </span>
    </aside>
  );
};
