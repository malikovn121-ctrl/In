import { useState, useCallback, useEffect } from 'react';
import { House, Trophy, User, UserCircle } from '@phosphor-icons/react';
import { Carousel } from './components/Carousel';
import { ProfilePage } from './components/ProfilePage';
import { LeadersPage } from './components/LeadersPage';
import { UpbloxLogo } from './components/UpbloxLogo';
import { LiveDropsBar } from './components/LiveDropsBar';
import { INITIAL_CARDS } from './data/mockData';
import { CardItem } from './types';

export default function App() {
  const [cards] = useState<CardItem[]>(INITIAL_CARDS);
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'home' | 'leaders' | 'profile'>('home');
  const [isOtpPopupOpen, setIsOtpPopupOpen] = useState(false);

  // Realistic online calculation fluctuating between 2000 and 3500 throughout the day
  const [onlineCount, setOnlineCount] = useState<number>(() => {
    const now = new Date();
    const hour = now.getHours() + now.getMinutes() / 60;
    const angle = ((hour - 21) / 24) * 2 * Math.PI;
    const factor = (Math.cos(angle) + 1) / 2; // 0 to 1
    const base = 2100 + factor * 1300; // 2100 to 3400
    const noise = Math.floor(Math.random() * 60) - 30;
    return Math.min(3500, Math.max(2000, Math.round(base + noise)));
  });

  // Natural live fluctuation (someone connects or disconnects every 3-5 seconds)
  useEffect(() => {
    const interval = setInterval(() => {
      setOnlineCount((prev) => {
        const delta = (Math.random() > 0.49 ? 1 : -1) * Math.floor(Math.random() * 3 + 1);
        const updated = prev + delta;
        return Math.min(3500, Math.max(2000, updated));
      });
    }, 3800);

    return () => clearInterval(interval);
  }, []);

  // "Раскрутить" button spin handler (triggers smooth continuous reel animation)
  const handleSpin = useCallback(() => {
    if (isSpinning) return;
    setIsSpinning(true);
  }, [isSpinning]);

  const handleSpinComplete = useCallback(() => {
    setIsSpinning(false);
  }, []);

  return (
    <div
      className="relative w-full min-h-[100dvh] flex flex-col justify-between overflow-x-hidden select-none pb-28"
      style={{ backgroundColor: '#121215' }}
    >
      {activeTab === 'profile' ? (
        /* Profile Screen */
        <main className="w-full flex-1 flex flex-col items-center justify-between overflow-y-auto">
          <ProfilePage onPopupChange={setIsOtpPopupOpen} />
        </main>
      ) : activeTab === 'leaders' ? (
        /* Leaders Screen */
        <main className="w-full flex-1 flex flex-col items-center justify-between overflow-y-auto">
          <LeadersPage />
        </main>
      ) : (
        /* Home / Main Screen */
        <div className="w-full flex-1 flex flex-col justify-between">
          {/* Top Header: Logo on the left, "Войти" on the right, and Live Drops bar below */}
          <header className="w-full max-w-[410px] mx-auto pt-6 px-5 sm:px-6 z-20 flex flex-col gap-4 mb-8 sm:mb-12">
            {/* Top row: UPBLOX logo on left & "Войти" button on right */}
            <div className="w-full flex items-center justify-between">
              <UpbloxLogo className="h-10 sm:h-11" />

              {/* Top-right: "Войти" button */}
              <button
                type="button"
                onClick={() => setActiveTab('profile')}
                className="h-[46px] sm:h-[48px] px-6 sm:px-7 rounded-full bg-white text-black font-bold text-base flex items-center justify-center active:scale-95 transition-transform border-0 outline-none shadow-none cursor-pointer shrink-0"
              >
                Войти
              </button>
            </div>

            {/* Bottom row: Online users plashka on left + 3-4 Live drop plashki on right (expanded & softly faded on right) */}
            <LiveDropsBar onlineCount={onlineCount} />
          </header>

          {/* Center: Big roulette carousel cards shifted noticeably LOWER down the page */}
          <main className="w-full flex-1 flex flex-col items-center justify-center my-auto py-8 sm:py-12 overflow-hidden">
            <Carousel
              cards={cards}
              isSpinning={isSpinning}
              onSpinComplete={handleSpinComplete}
            />
          </main>

          {/* Bottom "Раскрутить" button in solid #2663F0 with 1px matte border */}
          <div className="w-full max-w-[410px] mx-auto px-6 z-20 mt-6 sm:mt-8">
            <button
              type="button"
              disabled={isSpinning}
              onClick={handleSpin}
              style={{
                backgroundColor: '#2663F0',
                border: '1px solid rgba(255, 255, 255, 0.22)',
                boxShadow: 'none',
              }}
              className="w-full h-[62px] rounded-full text-white font-bold text-[22px] leading-none active:scale-95 transition-transform flex items-center justify-center tracking-tight outline-none shadow-none cursor-pointer"
            >
              Раскрутить
            </button>
          </div>
        </div>
      )}

      {/* Bottom Menu: Always fixed at the bottom above other objects (except popups) */}
      <footer
        className={`fixed bottom-0 inset-x-0 z-30 flex justify-center pb-6 pt-3 transition-opacity duration-200 bg-[#121215]/95 backdrop-blur-[6px] ${
          isOtpPopupOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
      >
        <nav className="w-full max-w-[410px] flex items-center justify-between px-6 select-none">
          <button
            type="button"
            onClick={() => setActiveTab('home')}
            className={`flex flex-col items-center justify-center gap-1.5 transition-all duration-200 cursor-pointer border-0 outline-none ${
              activeTab === 'home'
                ? 'text-white font-bold opacity-100 scale-105'
                : 'text-white/40 hover:text-white/70 font-medium'
            }`}
          >
            <House
              size={24}
              weight={activeTab === 'home' ? 'fill' : 'regular'}
              className="transition-transform duration-200"
            />
            <span className="text-xs leading-none">Home</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('leaders')}
            className={`flex flex-col items-center justify-center gap-1.5 transition-all duration-200 cursor-pointer border-0 outline-none ${
              activeTab === 'leaders'
                ? 'text-white font-bold opacity-100 scale-105'
                : 'text-white/40 hover:text-white/70 font-medium'
            }`}
          >
            <Trophy
              size={24}
              weight={activeTab === 'leaders' ? 'fill' : 'regular'}
              className="transition-transform duration-200"
            />
            <span className="text-xs leading-none">Leaders</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            className={`flex flex-col items-center justify-center gap-1.5 transition-all duration-200 cursor-pointer border-0 outline-none ${
              activeTab === 'profile'
                ? 'text-white font-bold opacity-100 scale-105'
                : 'text-white/40 hover:text-white/70 font-medium'
            }`}
          >
            <UserCircle
              size={24}
              weight={activeTab === 'profile' ? 'fill' : 'regular'}
              className="transition-transform duration-200"
            />
            <span className="text-xs leading-none">Profile</span>
          </button>
        </nav>
      </footer>
    </div>
  );
}
