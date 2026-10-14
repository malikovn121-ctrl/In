import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { User } from '@phosphor-icons/react';

interface LiveDropsBarProps {
  onlineCount: number;
}

interface DropItem {
  id: number;
}

export const LiveDropsBar: React.FC<LiveDropsBarProps> = ({ onlineCount }) => {
  // Initial 4 drop plashki (empty for now, as requested)
  const [drops, setDrops] = useState<DropItem[]>([
    { id: 1 },
    { id: 2 },
    { id: 3 },
    { id: 4 },
  ]);

  // Every 3.5 seconds, a new drop appears on the left, shifting previous ones to the right
  useEffect(() => {
    let nextId = 5;
    const interval = setInterval(() => {
      setDrops((prev) => {
        const newDrop = { id: nextId++ };
        // Keep 4 items on display
        return [newDrop, ...prev.slice(0, 3)];
      });
    }, 3500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full flex items-center gap-2 sm:gap-2.5 select-none">
      {/* 1. Left Plashka: Online Users Count matching increased height */}
      <div className="h-[68px] sm:h-[72px] px-4 sm:px-5 rounded-[22px] bg-[#27282F] flex items-center gap-2 text-[#30D158] font-bold text-[18px] sm:text-[19px] leading-none shrink-0 border-0 outline-none shadow-none">
        <span className="tracking-tight animate-soft-blink">
          {onlineCount.toLocaleString('ru-RU')}
        </span>
        <User size={22} weight="bold" className="text-[#30D158] shrink-0 animate-soft-blink" />
      </div>

      {/* 2. Right Horizontal Plashki: Larger square plashkas with slightly reduced gap */}
      <div
        style={{
          WebkitMaskImage: 'linear-gradient(to right, black 72%, transparent 100%)',
          maskImage: 'linear-gradient(to right, black 72%, transparent 100%)',
        }}
        className="flex-1 flex items-center gap-2 sm:gap-2.5 overflow-hidden pr-2"
      >
        <AnimatePresence initial={false} mode="popLayout">
          {drops.map((drop) => (
            <motion.div
              key={drop.id}
              layout
              initial={{ opacity: 0, scale: 0.7, x: -24 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.7, x: 24 }}
              transition={{
                type: 'spring',
                stiffness: 400,
                damping: 28,
                mass: 0.8,
              }}
              style={{
                backgroundColor: '#27282F',
              }}
              className="w-[68px] h-[68px] sm:w-[72px] sm:h-[72px] aspect-square rounded-[22px] shrink-0 cursor-default flex items-center justify-center border-0 outline-none shadow-none"
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};
