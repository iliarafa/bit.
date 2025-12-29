import { useLocation } from 'wouter';

export default function Landing() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <button
        onClick={() => setLocation('/portfolio')}
        className="text-5xl sm:text-7xl md:text-8xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60 hover:from-primary hover:to-primary/60 transition-all duration-300 cursor-pointer"
        data-testid="button-enter-app"
      >
        Bit.
      </button>
    </div>
  );
}
