import React, { useState, useEffect } from 'react';
import { Trophy } from 'lucide-react';

interface LeaderItem {
  id: number;
  rank: number;
  username: string;
  spins: number;
}

const INITIAL_LEADERS: LeaderItem[] = [
  { id: 1, rank: 1, username: '@runbarryrun', spins: 989 },
  { id: 2, rank: 2, username: '@darknesss', spins: 854 },
  { id: 3, rank: 3, username: '@hheat', spins: 762 },
  { id: 4, rank: 4, username: '@obibobi', spins: 641 },
  { id: 5, rank: 5, username: '@kalel', spins: 580 },
  { id: 6, rank: 6, username: '@one1fut', spins: 495 },
  { id: 7, rank: 7, username: '@innorks', spins: 420 },
  { id: 8, rank: 8, username: '@belozarov', spins: 368 },
  { id: 9, rank: 9, username: '@krytoi', spins: 295 },
  { id: 10, rank: 10, username: '@zamzam', spins: 210 },
];

function formatSpins(count: number): string {
  const mod10 = count % 10;
  const mod100 = count % 100;
  let word = 'прокруток';
  if (mod100 < 11 || mod100 > 14) {
    if (mod10 === 1) word = 'прокрутка';
    else if (mod10 >= 2 && mod10 <= 4) word = 'прокрутки';
  }
  return `${count.toLocaleString('ru-RU')} ${word}`;
}

export const LeadersPage: React.FC = () => {
  // Live monthly timer calculation: time remaining until the end of the current month
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  }>(() => calculateTimeLeft());

  function calculateTimeLeft() {
    const now = new Date();
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1, 0, 0, 0);
    const diff = Math.max(0, endOfMonth.getTime() - now.getTime());

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    return { days, hours, minutes, seconds };
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const format2 = (val: number) => String(val).padStart(2, '0');

  // Medal icons for top 3
  const getMedalIcon = (rank: number) => {
    if (rank === 1) return '/medals/gold.webp';
    if (rank === 2) return '/medals/silver.webp';
    if (rank === 3) return '/medals/bronze.webp';
    return null;
  };

  // Prizes for leaders: 1st: 100K, 2nd: 70K, 3rd: 50K, others: 10K
  const getPrize = (rank: number): string => {
    if (rank === 1) return '100K';
    if (rank === 2) return '70K';
    if (rank === 3) return '50K';
    return '10K';
  };

  return (
    <div className="w-full max-w-[410px] mx-auto h-full flex flex-col pt-10 pb-8 px-5 sm:px-6 select-none">
      {/* 1. Top left corner: "Список лидеров" */}
      <h1 className="text-white font-bold text-2xl sm:text-[28px] tracking-tight leading-tight text-left mb-6">
        Список лидеров
      </h1>

      {/* 2. Banner Plashka: "ПРИЗЫ ЛИДЕРАМ" & subtext "каждый месяц" */}
      <div className="w-full rounded-[22px] bg-[#27282F] p-5 sm:p-6 mb-4 flex items-center justify-between border-0 outline-none shadow-none">
        <div>
          <h2 className="font-geological text-white font-extrabold text-lg sm:text-[20px] tracking-wider uppercase leading-none">
            ПРИЗЫ ЛИДЕРАМ
          </h2>
          <p className="text-white/50 text-xs sm:text-sm font-medium mt-2 leading-none">
            каждый месяц
          </p>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center shrink-0">
          <Trophy className="w-6 h-6 text-white stroke-[2.2]" />
        </div>
      </div>

      {/* 3. Timer Plashka in the form of a month with Geological font numbers */}
      <div className="w-full rounded-[22px] bg-[#27282F] p-4 sm:p-5 mb-7 border-0 outline-none shadow-none">
        <div className="text-white/40 text-xs font-semibold uppercase tracking-wider mb-3 text-left">
          До подведения итогов месяца
        </div>

        {/* Timer segmented numbers using the Geological font */}
        <div className="grid grid-cols-4 gap-2 text-center">
          {/* Days */}
          <div className="flex flex-col items-center justify-center bg-[#1A1A20] rounded-xl py-2 px-1">
            <span className="font-geological font-extrabold text-xl sm:text-2xl text-white tracking-tight leading-none">
              {format2(timeLeft.days)}
            </span>
            <span className="text-[10px] text-white/40 font-medium uppercase mt-1 leading-none">
              дней
            </span>
          </div>

          {/* Hours */}
          <div className="flex flex-col items-center justify-center bg-[#1A1A20] rounded-xl py-2 px-1">
            <span className="font-geological font-extrabold text-xl sm:text-2xl text-white tracking-tight leading-none">
              {format2(timeLeft.hours)}
            </span>
            <span className="text-[10px] text-white/40 font-medium uppercase mt-1 leading-none">
              часов
            </span>
          </div>

          {/* Minutes */}
          <div className="flex flex-col items-center justify-center bg-[#1A1A20] rounded-xl py-2 px-1">
            <span className="font-geological font-extrabold text-xl sm:text-2xl text-white tracking-tight leading-none">
              {format2(timeLeft.minutes)}
            </span>
            <span className="text-[10px] text-white/40 font-medium uppercase mt-1 leading-none">
              минут
            </span>
          </div>

          {/* Seconds */}
          <div className="flex flex-col items-center justify-center bg-[#1A1A20] rounded-xl py-2 px-1">
            <span className="font-geological font-extrabold text-xl sm:text-2xl text-white tracking-tight leading-none text-[#30D158]">
              {format2(timeLeft.seconds)}
            </span>
            <span className="text-[10px] text-white/40 font-medium uppercase mt-1 leading-none">
              секунд
            </span>
          </div>
        </div>
      </div>

      {/* 4. Open Leaders List without individual plashkas, slightly enlarged, with top-3 corner medal badges */}
      <div className="w-full flex-1 flex flex-col gap-3 pb-8">
        <div className="text-white/40 text-xs font-semibold uppercase tracking-wider mb-2 text-left px-1">
          Топ участников
        </div>

        {INITIAL_LEADERS.map((leader) => {
          const medal = getMedalIcon(leader.rank);
          return (
            <div
              key={leader.id}
              className="w-full flex items-center justify-between py-1.5 px-1 select-none border-0 outline-none gap-3"
            >
              {/* Left: Enlarged Avatar Circle + Corner Medal Icon + Username & spins */}
              <div className="flex items-center gap-3.5 sm:gap-4 min-w-0">
                {/* Enlarged Avatar with medal badge in the bottom-right corner for top 3 */}
                <div className="relative w-12 h-12 sm:w-[52px] sm:h-[52px] rounded-full bg-white/10 shrink-0 border border-white/5 flex items-center justify-center">
                  <span className="text-sm sm:text-base font-bold text-white/50">
                    {leader.username.charAt(1).toUpperCase()}
                  </span>

                  {medal && (
                    <img
                      src={medal}
                      alt={`Топ ${leader.rank}`}
                      className="absolute -bottom-1 -right-1.5 w-6 h-6 sm:w-[26px] sm:h-[26px] object-contain select-none pointer-events-none drop-shadow-md"
                    />
                  )}
                </div>

                {/* Username & spins count */}
                <div className="flex flex-col text-left min-w-0">
                  <span className="text-white font-semibold text-base sm:text-[17px] tracking-tight truncate leading-snug">
                    {leader.username}
                  </span>
                  <span className="text-white/45 text-xs sm:text-[13px] font-medium leading-none mt-1">
                    {formatSpins(leader.spins)}
                  </span>
                </div>
              </div>

              {/* Right: Small prize plashka */}
              <div className="h-8 sm:h-9 px-2.5 sm:px-3 rounded-xl bg-[#27282F] flex items-center gap-1.5 shrink-0 border-0 outline-none select-none">
                <span className="font-geological font-bold text-xs sm:text-[13px] text-white tracking-tight leading-none">
                  {getPrize(leader.rank)}
                </span>
                <img
                  src="/robux_white.webp"
                  alt="Robux"
                  className="w-4 h-4 sm:w-[17px] sm:h-[17px] object-contain shrink-0 select-none pointer-events-none"
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
