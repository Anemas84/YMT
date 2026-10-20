import React, { useEffect, useState, useRef } from 'react';

const CYBER_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&*+<>!?';

interface CyberScrambleTextProps {
  text: string;
  className?: string;
  style?: React.CSSProperties;
  scrambleOnMount?: boolean;
  scrambleOnHover?: boolean;
  periodicIntervalMs?: number;
  waveChars?: boolean;
}

export const CyberScrambleText: React.FC<CyberScrambleTextProps> = ({
  text,
  className = '',
  style,
  scrambleOnMount = true,
  scrambleOnHover = true,
  periodicIntervalMs,
  waveChars = false,
}) => {
  const [displayText, setDisplayText] = useState(text);
  const frameRef = useRef<number | null>(null);
  const isAnimatingRef = useRef(false);

  const triggerScramble = () => {
    if (isAnimatingRef.current) return;
    isAnimatingRef.current = true;
    let iteration = 0;
    const totalLength = text.length;

    const step = () => {
      setDisplayText(
        text
          .split('')
          .map((char, index) => {
            if (char === ' ') return ' ';
            if (index < iteration) {
              return text[index];
            }
            return CYBER_CHARS[Math.floor(Math.random() * CYBER_CHARS.length)];
          })
          .join('')
      );

      iteration += Math.max(0.35, totalLength / 18);

      if (iteration < totalLength) {
        frameRef.current = window.setTimeout(step, 28);
      } else {
        setDisplayText(text);
        isAnimatingRef.current = false;
      }
    };

    step();
  };

  useEffect(() => {
    setDisplayText(text);
    if (scrambleOnMount) {
      const startTimer = window.setTimeout(() => {
        triggerScramble();
      }, 120);
      return () => clearTimeout(startTimer);
    }
  }, [text]);

  useEffect(() => {
    if (!periodicIntervalMs) return;
    const interval = window.setInterval(() => {
      triggerScramble();
    }, periodicIntervalMs);
    return () => clearInterval(interval);
  }, [periodicIntervalMs, text]);

  useEffect(() => {
    return () => {
      if (frameRef.current) clearTimeout(frameRef.current);
    };
  }, []);

  if (waveChars) {
    return (
      <span
        className={`inline-block ${className}`}
        style={style}
        onMouseEnter={scrambleOnHover ? triggerScramble : undefined}
      >
        {displayText.split('').map((ch, idx) => (
          <span
            key={idx}
            className="inline-block animate-cyber-char-wave"
            style={{
              animationDelay: `${idx * 90}ms`,
              whiteSpace: ch === ' ' ? 'pre' : 'normal',
            }}
          >
            {ch}
          </span>
        ))}
      </span>
    );
  }

  return (
    <span
      className={className}
      style={style}
      onMouseEnter={scrambleOnHover ? triggerScramble : undefined}
    >
      {displayText}
    </span>
  );
};

interface AnimatedCounterProps {
  value: number;
  prefix?: string;
  suffix?: string;
  showSign?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  value,
  prefix = '',
  suffix = '',
  showSign = false,
  className = '',
  style,
}) => {
  const [displayValue, setDisplayValue] = useState(value);
  const prevValueRef = useRef(value);

  useEffect(() => {
    const startVal = prevValueRef.current;
    const endVal = value;
    if (startVal === endVal) return;

    const duration = 520;
    const startTime = performance.now();

    let rafId: number;
    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(startVal + (endVal - startVal) * eased);
      setDisplayValue(current);

      if (progress < 1) {
        rafId = requestAnimationFrame(tick);
      } else {
        prevValueRef.current = endVal;
      }
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [value]);

  const sign = showSign ? (displayValue < 0 ? '-' : '+') : displayValue < 0 ? '-' : '';
  const formatted = `${prefix}${sign}${Math.abs(displayValue).toLocaleString()}${suffix}`;

  return (
    <span className={className} style={style}>
      {formatted}
    </span>
  );
};
