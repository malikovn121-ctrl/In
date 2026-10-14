import React from 'react';
import { motion, MotionValue, useTransform } from 'motion/react';
import { CardItem } from '../types';

interface CardPlashkaProps {
  card: CardItem;
  index: number;
  scrollX: MotionValue<number>;
  step: number;
  loopWidth: number;
  onClick: () => void;
}

export const CardPlashka: React.FC<CardPlashkaProps> = ({
  index,
  scrollX,
  step,
  loopWidth,
  onClick,
}) => {
  // Compute normalized delta distance from center in [-loopWidth/2, loopWidth/2]
  const x = useTransform(scrollX, (s) => {
    const basePos = index * step;
    let delta = ((basePos - s) % loopWidth + loopWidth) % loopWidth;
    if (delta > loopWidth / 2) delta -= loopWidth;
    return delta;
  });

  // Scale: exactly 1.0 at center (delta = 0), 0.84 at ±step and beyond
  const scale = useTransform(scrollX, (s) => {
    const basePos = index * step;
    let delta = ((basePos - s) % loopWidth + loopWidth) % loopWidth;
    if (delta > loopWidth / 2) delta -= loopWidth;
    const abs = Math.abs(delta);
    if (abs >= step) return 0.84;
    return 1.0 - (abs / step) * 0.16;
  });

  // Smooth opacity fading when cards move outside the viewport
  const opacity = useTransform(scrollX, (s) => {
    const basePos = index * step;
    let delta = ((basePos - s) % loopWidth + loopWidth) % loopWidth;
    if (delta > loopWidth / 2) delta -= loopWidth;
    const abs = Math.abs(delta);
    if (abs > 440) return 0;
    if (abs > step) return Math.max(0, 1 - (abs - step) / (440 - step));
    return 1;
  });

  // Z-index: center card strictly on top
  const zIndex = useTransform(scrollX, (s) => {
    const basePos = index * step;
    let delta = ((basePos - s) % loopWidth + loopWidth) % loopWidth;
    if (delta > loopWidth / 2) delta -= loopWidth;
    return Math.round(50 - Math.abs(delta) / 10);
  });

  return (
    <motion.div
      onClick={onClick}
      style={{
        left: 'calc(50% - 118px)',
        top: 'calc(50% - 118px)',
        x,
        scale,
        opacity,
        zIndex,
        backgroundColor: '#27282F',
        border: 'none',
        outline: 'none',
        boxShadow: 'none',
        WebkitBackfaceVisibility: 'hidden',
        backfaceVisibility: 'hidden',
        willChange: 'transform, opacity',
      }}
      className="absolute aspect-square w-[236px] h-[236px] rounded-[52px] cursor-pointer select-none border-0 outline-none shadow-none pointer-events-auto"
    />
  );
};
