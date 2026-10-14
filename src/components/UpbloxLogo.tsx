import React from 'react';

interface UpbloxLogoProps {
  className?: string;
}

export const UpbloxLogo: React.FC<UpbloxLogoProps> = ({ className = 'h-10 sm:h-12' }) => {
  return (
    <div className={`flex items-center select-none ${className}`}>
      <img
        src="/logo.png"
        alt="UPBLOX"
        className="h-full w-auto max-h-[44px] sm:max-h-[50px] object-contain drop-shadow-none"
        style={{
          filter: 'brightness(0) invert(1)',
        }}
      />
    </div>
  );
};
