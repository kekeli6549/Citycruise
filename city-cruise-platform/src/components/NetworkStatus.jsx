import { useEffect } from 'react';
import { useAuthStore } from '../context/authstore';

const NetworkStatus = () => {
  const setOnlineStatus = useAuthStore((state) => state.setOnlineStatus);

  useEffect(() => {
    const handleOnline = () => setOnlineStatus(true);
    const handleOffline = () => setOnlineStatus(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [setOnlineStatus]);

  return null;
};

export default NetworkStatus;