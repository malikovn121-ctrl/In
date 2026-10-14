import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2 } from 'lucide-react';

interface ProfilePageProps {
  onPopupChange?: (isOpen: boolean) => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ onPopupChange }) => {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [digits, setDigits] = useState<string[]>(['', '', '', '']);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [resendTimer, setResendTimer] = useState<number>(60);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Notify parent of popup state changes so bottom menu can be hidden cleanly
  useEffect(() => {
    onPopupChange?.(isPopupOpen);
  }, [isPopupOpen, onPopupChange]);

  const validateEmail = (val: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim());
  };

  const handleGetCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      setEmailError('Введите корректный адрес почты');
      return;
    }
    setEmailError('');
    setDigits(['', '', '', '']);
    setResendTimer(60);
    setIsPopupOpen(true);
  };

  // 60-second countdown timer for resending code
  useEffect(() => {
    if (!isPopupOpen || resendTimer <= 0) return;
    const interval = setInterval(() => {
      setResendTimer((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [isPopupOpen, resendTimer]);

  // Auto-focus first input when popup opens
  useEffect(() => {
    if (isPopupOpen) {
      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 150);
    }
  }, [isPopupOpen]);

  // Handle digit input with paste and auto-advance
  const handleDigitChange = (index: number, val: string) => {
    if (val.length > 1) {
      const numbersOnly = val.replace(/\D/g, '').slice(0, 4);
      if (numbersOnly.length > 0) {
        const newDigits = [...digits];
        numbersOnly.split('').forEach((char, i) => {
          if (index + i < 4) newDigits[index + i] = char;
        });
        setDigits(newDigits);
        const nextIdx = Math.min(3, index + numbersOnly.length);
        inputRefs.current[nextIdx]?.focus();
        return;
      }
    }

    const clean = val.replace(/\D/g, '');
    const newDigits = [...digits];
    newDigits[index] = clean ? clean[clean.length - 1] : '';
    setDigits(newDigits);

    if (clean && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle backspace navigation
  const handleDigitKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (!digits[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  const handleLogin = () => {
    setIsPopupOpen(false);
    setIsLoggedIn(true);
  };

  return (
    <div className="relative w-full max-w-[410px] mx-auto h-full flex flex-col justify-between pt-10 pb-6 px-6 z-20 select-none">
      <div className="w-full">
        {/* Header: "Вход или регистрация" on the top left */}
        <h1 className="text-white font-bold text-2xl sm:text-[28px] tracking-tight leading-tight text-left mb-8">
          Вход или регистрация
        </h1>

        {isLoggedIn ? (
          <div className="w-full p-6 rounded-[24px] bg-[#27282F] flex flex-col items-center text-center gap-3">
            <CheckCircle2 className="w-12 h-12 text-[#30D158]" />
            <h3 className="text-white font-bold text-xl">Вы успешно вошли</h3>
            <p className="text-white/60 text-sm">{email}</p>
          </div>
        ) : (
          <>
            {/* 1. Email input & "Получить код" button */}
            <form onSubmit={handleGetCode} className="space-y-4">
              <div className="w-full">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (emailError) setEmailError('');
                  }}
                  placeholder="Адрес электронной почты"
                  required
                  className={`w-full h-[56px] px-6 rounded-[22px] bg-[#27282F] text-white placeholder-white/40 font-medium text-base outline-none border transition-colors ${
                    emailError ? 'border-red-500/80 focus:border-red-500' : 'border-transparent focus:ring-2 focus:ring-[#2663F0]/50'
                  }`}
                />
                {emailError && (
                  <p className="text-red-400 text-xs mt-1.5 ml-3 text-left font-medium">
                    {emailError}
                  </p>
                )}
              </div>

              {/* Blue button: "Получить код" in #2663F0 */}
              <button
                type="submit"
                style={{ backgroundColor: '#2663F0', boxShadow: 'none' }}
                className="w-full h-[56px] rounded-full text-white font-bold text-base flex items-center justify-center active:scale-95 transition-transform cursor-pointer border-0 outline-none shadow-none"
              >
                Получить код
              </button>
            </form>

            {/* 2. Divider with lines: —— ИЛИ —— */}
            <div className="w-full flex items-center justify-center my-6">
              <div className="flex-1 h-[1px] bg-white/10" />
              <span className="px-4 text-xs font-bold text-white/40 tracking-widest uppercase">
                ИЛИ
              </span>
              <div className="flex-1 h-[1px] bg-white/10" />
            </div>

            {/* 3. White Google button below the divider */}
            <button
              type="button"
              onClick={() => {
                alert('Вход через Google');
              }}
              className="w-full h-[56px] rounded-full bg-white text-black font-bold text-base flex items-center justify-center px-6 active:scale-95 transition-transform cursor-pointer border-0 outline-none shadow-none"
            >
              {/* Official Google 'G' icon */}
              <svg className="w-5 h-5 mr-3 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Войти через Google</span>
            </button>
          </>
        )}
      </div>

      {/* 4. Smooth Floating Matte Popup (#27282F, wider & taller, closer to edges without touching, full swipe control, smooth dimming) */}
      <AnimatePresence>
        {isPopupOpen && (
          <div className="fixed inset-0 z-50 flex flex-col justify-end items-center px-3 sm:px-3.5 pb-3.5 sm:pb-4 pointer-events-none">
            {/* Smooth animated dimming backdrop covering everything else */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.28, ease: 'easeOut' }}
              onClick={() => setIsPopupOpen(false)}
              className="absolute inset-0 bg-black/65 backdrop-blur-[2px] pointer-events-auto"
            />

            {/* Popup Card: matte solid #27282F, wider & taller, rounded-[33px], fully interactive swipe with drag="y" */}
            <motion.div
              drag="y"
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={{ top: 0.05, bottom: 0.8 }}
              onDragEnd={(_, info) => {
                if (info.offset.y > 80 || info.velocity.y > 300) {
                  setIsPopupOpen(false);
                }
              }}
              initial={{ y: 340 }}
              animate={{ y: 0 }}
              exit={{ y: 360 }}
              transition={{
                type: 'spring',
                damping: 30,
                stiffness: 240,
                mass: 0.9,
              }}
              style={{
                backgroundColor: '#27282F',
                boxShadow: 'none',
              }}
              className="relative w-full max-w-[400px] rounded-[33px] pt-3.5 pb-7 sm:pb-8 px-6 sm:px-7 flex flex-col pointer-events-auto shadow-none select-none touch-pan-y cursor-grab active:cursor-grabbing border-0 outline-none"
            >
              {/* Grey pill handle at the very top edge */}
              <div className="w-10 h-1.5 rounded-full bg-white/20 mx-auto mt-0.5 mb-5 shrink-0" />

              {/* Title & subtitle above the digit inputs */}
              <div className="w-full text-left mb-5">
                <h3 className="text-white font-bold text-xl sm:text-[22px] tracking-tight leading-snug">
                  Введите код из почты
                </h3>
                <p className="text-white/50 text-xs sm:text-[13px] leading-relaxed mt-1">
                  Мы отправили письмо на{' '}
                  <span className="text-white/80 font-medium break-all">{email}</span>
                </p>
              </div>

              {/* 4 Mini Digit Input Fields: no grey border, 1px blue border on focus */}
              <div className="flex items-center justify-between gap-2.5 sm:gap-3 mb-6">
                {digits.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => {
                      inputRefs.current[index] = el;
                    }}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleDigitChange(index, e.target.value)}
                    onKeyDown={(e) => handleDigitKeyDown(index, e)}
                    className="w-[64px] h-[66px] sm:w-[70px] sm:h-[72px] rounded-[18px] bg-[#1E1E24] text-white font-geological font-bold text-2xl text-center outline-none border border-transparent focus:border focus:border-[#2663F0] transition-colors"
                  />
                ))}
              </div>

              {/* "Войти" button */}
              <button
                type="button"
                onClick={handleLogin}
                style={{ backgroundColor: '#2663F0', boxShadow: 'none' }}
                className="w-full h-[58px] rounded-full text-white font-bold text-base flex items-center justify-center active:scale-95 transition-transform cursor-pointer border-0 outline-none shadow-none"
              >
                Войти
              </button>

              {/* Resend code timer text below the button */}
              <div className="w-full flex items-center justify-center mt-4">
                {resendTimer > 0 ? (
                  <span className="text-xs sm:text-[13px] font-medium text-white/40 select-none">
                    Отправить код повторно [{resendTimer} с.]
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setResendTimer(60);
                    }}
                    className="text-xs sm:text-[13px] font-semibold text-[#2663F0] hover:underline cursor-pointer border-0 outline-none bg-transparent select-none transition-colors"
                  >
                    Отправить повторно
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
