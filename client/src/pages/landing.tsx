import { useAuth } from '@/hooks/use-auth';
import { useLocation } from 'wouter';
import { useEffect } from 'react';

export default function Landing() {
  const { isAuthenticated, isLoading } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      setLocation('/portfolio');
    }
  }, [isAuthenticated, isLoading, setLocation]);

  const handleLogin = () => {
    window.location.href = '/api/login';
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <button
        onClick={handleLogin}
        disabled={isLoading}
        className="text-5xl sm:text-7xl md:text-8xl font-bold tracking-tight text-white hover:text-primary transition-all duration-300 cursor-pointer disabled:opacity-50"
        data-testid="button-enter-app"
      >
        Bit.
      </button>
    </div>
  );
}
