import React, { useEffect, useRef, useCallback } from 'react';
import { useMotionValue, animate } from 'motion/react';
import { CardItem } from '../types';
import { CardPlashka } from './CardPlashka';

interface CarouselProps {
  cards: CardItem[];
  isSpinning: boolean;
  onSpinComplete?: () => void;
}

const STEP = 252; // Exact distance between card centers in pixels

export const Carousel: React.FC<CarouselProps> = ({
  cards,
  isSpinning,
  onSpinComplete,
}) => {
  const total = cards.length;
  const loopWidth = total * STEP;
  const scrollX = useMotionValue(0);
  const touchStartX = useRef<number | null>(null);
  const autoPlayTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isSpinRunningRef = useRef(false);
  const onSpinCompleteRef = useRef(onSpinComplete);
  onSpinCompleteRef.current = onSpinComplete;

  const handleNext = useCallback(() => {
    if (isSpinning || isSpinRunningRef.current) return;
    const currentVal = scrollX.get();
    const target = Math.round(currentVal / STEP) * STEP + STEP;
    animate(scrollX, target, {
      duration: 0.55,
      ease: [0.25, 1, 0.35, 1],
    });
  }, [isSpinning, scrollX]);

  const handlePrev = useCallback(() => {
    if (isSpinning || isSpinRunningRef.current) return;
    const currentVal = scrollX.get();
    const target = Math.round(currentVal / STEP) * STEP - STEP;
    animate(scrollX, target, {
      duration: 0.55,
      ease: [0.25, 1, 0.35, 1],
    });
  }, [isSpinning, scrollX]);

  // Handle spin event strictly once per click
  useEffect(() => {
    if (!isSpinning) {
      isSpinRunningRef.current = false;
      return;
    }

    // Guard against duplicate execution
    if (isSpinRunningRef.current) return;
    isSpinRunningRef.current = true;

    if (autoPlayTimerRef.current) {
      clearInterval(autoPlayTimerRef.current);
      autoPlayTimerRef.current = null;
    }

    const currentVal = scrollX.get();
    const currentRound = Math.round(currentVal / STEP);
    const spinSteps = 20 + Math.floor(Math.random() * 8); // 20 to 27 cards travel distance
    const target = (currentRound + spinSteps) * STEP;

    const controls = animate(scrollX, target, {
      duration: 3.6,
      ease: [0.12, 0.88, 0.22, 1], // Authentic roulette deceleration: smooth glide, zero bounce
      onComplete: () => {
        scrollX.set(target); // Snap strictly to dead-center target with 0.0px error
        isSpinRunningRef.current = false;
        onSpinCompleteRef.current?.();
      },
    });

    return () => {
      controls.stop();
    };
  }, [isSpinning, scrollX]);

  // Gentle auto-rotation when idle (resumes 3s after spin ends)
  useEffect(() => {
    if (isSpinning) {
      if (autoPlayTimerRef.current) clearInterval(autoPlayTimerRef.current);
      return;
    }

    autoPlayTimerRef.current = setInterval(() => {
      handleNext();
    }, 3200);

    return () => {
      if (autoPlayTimerRef.current) clearInterval(autoPlayTimerRef.current);
    };
  }, [isSpinning, handleNext]);

  // Touch & swipe gestures
  const handleTouchStart = (e: React.TouchEvent) => {
    if (isSpinning || isSpinRunningRef.current) return;
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || isSpinning || isSpinRunningRef.current) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchEndX - touchStartX.current;
    if (diff > 35) {
      handlePrev();
    } else if (diff < -35) {
      handleNext();
    }
    touchStartX.current = null;
  };

  return (
    <div
      className="relative w-full h-[260px] flex items-center justify-center touch-pan-y overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="relative w-full h-full">
        {cards.map((card, idx) => (
          <CardPlashka
            key={card.id}
            card={card}
            index={idx}
            scrollX={scrollX}
            step={STEP}
            loopWidth={loopWidth}
            onClick={() => {
              if (isSpinning || isSpinRunningRef.current) return;
              const currentVal = scrollX.get();
              const basePos = idx * STEP;
              let delta = ((basePos - currentVal) % loopWidth + loopWidth) % loopWidth;
              if (delta > loopWidth / 2) delta -= loopWidth;

              if (delta > 100) handleNext();
              if (delta < -100) handlePrev();
            }}
          />
        ))}
      </div>
    </div>
  );
};
