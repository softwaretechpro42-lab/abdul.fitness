import React, { useState } from 'react';
import { Download, Share2, X, Smartphone } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Language } from '../types';

interface Props {
  language: Language;
  variant?: 'header' | 'card' | 'settings';
}

export const PWAInstallButton: React.FC<Props> = ({ language, variant = 'header' }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  if (isInstalled) {
    if (variant === 'settings') {
      return (
        <div className="flex items-center gap-2 p-3 bg-[#111A17] border border-[#29372F] rounded-xl text-xs text-[#9DAFA6]">
          <Smartphone className="w-4 h-4 text-[#43D98B]" />
          <span>{language === 'ur' ? 'ایپ پہلے سے فون میں انسٹال ہے' : 'App is already installed on this device'}</span>
        </div>
      );
    }
    return null;
  }

  const label = language === 'ur' ? 'ایپ انسٹال کریں' : 'Install PWA';

  const renderButton = (onClick: () => void) => {
    if (variant === 'header') {
      return (
        <button
          onClick={onClick}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#B7FF4A]/15 border border-[#B7FF4A]/40 text-[#B7FF4A] hover:bg-[#B7FF4A]/25 text-xs font-semibold transition cursor-pointer min-h-[44px]"
          aria-label={label}
        >
          <Download className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">{label}</span>
        </button>
      );
    }

    return (
      <button
        onClick={onClick}
        className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#B7FF4A] text-[#0B1110] font-semibold text-sm hover:brightness-105 active:scale-[0.98] transition cursor-pointer min-h-[48px]"
      >
        <Download className="w-4 h-4" />
        <span>{label}</span>
      </button>
    );
  };

  return (
    <>
      {isInstallable && renderButton(install)}

      {isIOS && renderButton(() => setShowIOSGuide(true))}

      {/* Fallback preview button for desktop/demo browsers where beforeinstallprompt isn't emitted yet */}
      {!isInstallable && !isIOS && variant === 'settings' && (
        <button
          onClick={() => {
            alert(
              language === 'ur'
                ? 'ایپ کو براؤزر کے مینیو سے "Add to Home Screen" یا "Install" کر کے محفوظ کریں۔'
                : 'To install on desktop or mobile, open your browser menu and choose "Install App" or "Add to Home Screen".'
            );
          }}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-[#29372F] bg-[#111A17] text-[#9DAFA6] hover:text-[#F4F7F4] text-xs font-medium transition cursor-pointer"
        >
          <Download className="w-4 h-4" />
          <span>{language === 'ur' ? 'انسٹالیشن ہدایات' : 'PWA Install Instructions'}</span>
        </button>
      )}

      {/* iOS Modal */}
      {showIOSGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-2xl bg-[#17241D] border border-[#29372F] p-6 shadow-2xl text-[#F4F7F4]">
            <div className="flex items-center justify-between pb-3 border-b border-[#29372F]">
              <h3 className="text-base font-bold flex items-center gap-2 text-[#B7FF4A]">
                <Share2 className="w-4 h-4" />
                {language === 'ur' ? 'آئی فون پر انسٹال کریں' : 'Install on iPhone / iPad'}
              </h3>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="p-1 rounded-lg hover:bg-[#111A17] text-[#9DAFA6] hover:text-[#F4F7F4]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="mt-4 space-y-3 text-xs text-[#9DAFA6] leading-relaxed">
              <p>
                <strong className="text-[#F4F7F4]">1.</strong>{' '}
                {language === 'ur'
                  ? 'سفاری کے نچلے بار پر شیئر (Share) کا بٹن دبائیں۔'
                  : 'Tap the Share icon at the bottom of Safari.'}
              </p>
              <p>
                <strong className="text-[#F4F7F4]">2.</strong>{' '}
                {language === 'ur'
                  ? 'نیچے اسکرول کریں اور "Add to Home Screen" منتخب کریں۔'
                  : 'Scroll down and tap "Add to Home Screen".'}
              </p>
              <p>
                <strong className="text-[#F4F7F4]">3.</strong>{' '}
                {language === 'ur'
                  ? 'اوپر دائیں کونے میں "Add" دبائیں۔ ایپ مکمل آف لائن کام کرے گی۔'
                  : 'Tap "Add" in top right corner. The app will work seamlessly offline.'}
              </p>
            </div>
            <button
              onClick={() => setShowIOSGuide(false)}
              className="mt-6 w-full py-2.5 rounded-xl bg-[#29372F] hover:bg-[#34463C] text-sm font-medium text-[#F4F7F4] transition"
            >
              {language === 'ur' ? 'سمجھ آگیا' : 'Got it'}
            </button>
          </div>
        </div>
      )}
    </>
  );
};
