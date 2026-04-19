import { useState, useEffect } from 'react';
import { usePWA } from '../../hooks/usePWA';
import { Download, X, Wifi, WifiOff } from 'lucide-react';

const PWABanner = () => {
  const { isInstalled, canInstall, installApp, isOnline, swRegistered } = usePWA();
  const [showBanner, setShowBanner] = useState(false);
  const [showOffline, setShowOffline] = useState(false);

  useEffect(() => {
    // Show install banner after 3 seconds if installable
    if (canInstall && !isInstalled) {
      const timer = setTimeout(() => setShowBanner(true), 3000);
      return () => clearTimeout(timer);
    }
  }, [canInstall, isInstalled]);

  useEffect(() => {
    // Show offline indicator when offline
    setShowOffline(!isOnline);
  }, [isOnline]);

  const handleInstall = async () => {
    const success = await installApp();
    if (success) {
      setShowBanner(false);
    }
  };

  if (isInstalled) {
    return (
      <>
        {/* Offline indicator only when installed */}
        {showOffline && (
          <div className="fixed top-0 left-0 right-0 z-50 bg-yellow-500 text-white px-4 py-2 flex items-center justify-center">
            <WifiOff className="w-4 h-4 mr-2" />
            <span className="text-sm font-medium">You are offline. Some features may be limited.</span>
          </div>
        )}
        {/* Online restored notification */}
        {!showOffline && swRegistered && (
          <div className="fixed top-0 left-0 right-0 z-50 bg-green-500 text-white px-4 py-2 flex items-center justify-center">
            <Wifi className="w-4 h-4 mr-2" />
            <span className="text-sm font-medium">Back online</span>
          </div>
        )}
      </>
    );
  }

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-50 bg-white/70 backdrop-blur-xl rounded-2xl shadow-xl border border-white/30 p-4">
      <div className="flex items-start gap-3">
        <div className="p-2 bg-primary-100 rounded-lg">
          <Download className="w-5 h-5 text-primary-600" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900">Install Park Pro-Active</h3>
          <p className="text-sm text-gray-600 mt-1">
            Install this app on your device for quick access and offline functionality.
          </p>
          <div className="flex gap-2 mt-3">
            <button
              onClick={handleInstall}
              className="btn-primary text-sm py-2 px-4"
            >
              Install App
            </button>
            <button
              onClick={() => setShowBanner(false)}
              className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              Not Now
            </button>
          </div>
        </div>
        <button
          onClick={() => setShowBanner(false)}
          className="p-1 hover:bg-gray-100 rounded"
        >
          <X className="w-4 h-4 text-gray-500" />
        </button>
      </div>
    </div>
  );
};

export default PWABanner;
