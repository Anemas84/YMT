import type { FC } from 'react';
import { arcadeSound } from '../data/prizes';
import { CyberScrambleText, AnimatedCounter } from './CyberText';

export type NavTabId = 'RIME' | 'BOISITIES' | 'TEEES' | 'GGINS';

interface TopHeroConsoleProps {
  activeTab: NavTabId;
  onSelectTab: (tab: NavTabId) => void;
  pointsBalance: number;
  lastDelta: number;
  lastTimeAgo: string;
  progressPercent: number;
  redeemedCount: number;
  onClickMainRedem: () => void;
  onOpenVault: () => void;
}

export const TopHeroConsole: FC<TopHeroConsoleProps> = ({
  activeTab,
  onSelectTab,
  pointsBalance,
  lastDelta,
  lastTimeAgo,
  progressPercent,
  redeemedCount,
  onClickMainRedem,
  onOpenVault,
}) => {
  const navTabs: NavTabId[] = ['RIME', 'BOISITIES', 'TEEES', 'GGINS'];

  return (
    <section
      aria-label="YAMATO Points and Rewards Console"
      className="relative w-full max-w-[1640px] mx-auto select-none"
    >
      {/* Outer Beveled Cyber Frame Wrapper with #e30613 Red Border & Glow */}
      <div className="neon-console-outer relative p-[3px] rounded-[22px] bg-gradient-to-br from-[#e30613] via-[#ff3b47] to-[#730209]">
        {/* Continuous Top Neon Edge Tube */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-[1px] left-12 right-12 h-[2px] bg-[#e30613] shadow-[0_0_10px_#e30613,0_0_18px_#e30613] z-20"
        />
        {/* Continuous Bottom Neon Edge Tube */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-[1px] left-12 right-12 h-[2px] bg-[#e30613] shadow-[0_0_10px_#e30613,0_0_18px_#e30613] z-20"
        />
        {/* Continuous Left Neon Edge Tube */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-12 bottom-12 -left-[1px] w-[2px] bg-[#e30613] shadow-[0_0_10px_#e30613,0_0_18px_#e30613] z-20"
        />
        {/* Continuous Right Neon Edge Tube */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-12 bottom-12 -right-[1px] w-[2px] bg-[#e30613] shadow-[0_0_10px_#e30613,0_0_18px_#e30613] z-20"
        />

        {/* Top-Left #e30613 Neon Corner Accent */}
        <svg
          className="neon-svg-red pointer-events-none absolute -top-[4px] -left-[4px] w-32 h-32 z-20"
          viewBox="0 0 112 112"
          fill="none"
        >
          <path
            d="M3 86V26L26 3H104"
            stroke="#e30613"
            strokeWidth="2.8"
            strokeLinecap="round"
          />
          <path
            d="M9 70V29L29 9H84"
            stroke="#ff4d58"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>

        {/* Top-Right #e30613 Neon Corner Accent */}
        <svg
          className="neon-svg-red pointer-events-none absolute -top-[4px] -right-[4px] w-32 h-32 z-20"
          viewBox="0 0 112 112"
          fill="none"
        >
          <path
            d="M8 3H86L109 26V86"
            stroke="#e30613"
            strokeWidth="2.6"
            strokeLinecap="round"
          />
          <path
            d="M28 9H83L103 29V70"
            stroke="#ff4d58"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>

        {/* Bottom-Left #e30613 Neon Corner & Glowing LED Dots */}
        <svg
          className="neon-svg-red pointer-events-none absolute -bottom-[4px] -left-[4px] w-48 h-28 z-20"
          viewBox="0 0 176 96"
          fill="none"
        >
          <path
            d="M3 12V70L26 93H158"
            stroke="#e30613"
            strokeWidth="2.6"
            strokeLinecap="round"
          />
          <path
            d="M9 24V67L29 87H126"
            stroke="#ff4d58"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          {/* Glowing Status LED Dots along bottom-left rail */}
          <circle cx="52" cy="82" r="2.2" fill="#e30613" />
          <circle cx="62" cy="82" r="2.2" fill="#ff4d58" />
          <circle cx="72" cy="82" r="2.2" fill="#ff4d58" />
          <circle cx="82" cy="82" r="2.2" fill="#e30613" />
          <circle cx="92" cy="82" r="2.2" fill="#e30613" />
          <circle cx="102" cy="82" r="2.2" fill="#ff4d58" />
        </svg>

        {/* Bottom-Right #e30613 Neon Corner Accent */}
        <svg
          className="neon-svg-red pointer-events-none absolute -bottom-[4px] -right-[4px] w-40 h-28 z-20"
          viewBox="0 0 144 96"
          fill="none"
        >
          <path
            d="M141 12V70L118 93H16"
            stroke="#e30613"
            strokeWidth="2.8"
            strokeLinecap="round"
          />
          <path
            d="M135 24V66L115 87H40"
            stroke="#ff4d58"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>

        {/* Left Side Vertical Micro LEDs */}
        <div className="pointer-events-none absolute left-[4px] top-1/2 -translate-y-1/2 flex flex-col gap-1.5 z-20">
          <span className="w-1.5 h-1.5 rounded-full bg-[#e30613] shadow-[0_0_8px_#e30613,0_0_14px_#e30613]" />
          <span className="w-1.5 h-1.5 rounded-full bg-[#ff4d58] shadow-[0_0_8px_#e30613,0_0_14px_#e30613]" />
          <span className="w-1.5 h-1.5 rounded-full bg-[#e30613] shadow-[0_0_6px_#e30613]" />
        </div>

        {/* Main Inner Console Container with Neon Inner Border */}
        <div className="neon-console-inner relative rounded-[20px] cyber-grid-bg px-4 sm:px-7 pt-3 sm:pt-4 pb-4 sm:pb-5 overflow-hidden">
          {/* Subtle Top Barcode & Animated Telemetry Strip (Top Right above Nav) */}
          <div className="hidden sm:flex justify-end items-center gap-3 mb-1 pr-1">
            <span className="animate-telemetry-blink font-mono text-[9.5px] tracking-[0.22em] text-[#7ae8f7]">
              009088800_SYS //{' '}
              <AnimatedCounter value={pointsBalance} suffix=" PTS" />
            </span>
            <div
              aria-hidden="true"
              className="h-3.5 w-28 bg-[#1a0305] border border-[#e30613]/75 shadow-[0_0_8px_rgba(227,6,19,0.45),inset_0_0_5px_rgba(227,6,19,0.3)] px-1.5 flex items-center justify-between"
            >
              {[2, 1, 3, 1, 2, 1, 4, 1, 2, 1, 3, 2, 1, 2, 1, 3].map((w, idx) => (
                <span
                  key={idx}
                  className="h-2.5 bg-[#e30613]/90 shadow-[0_0_4px_#e30613] inline-block animate-pulse"
                  style={{ width: `${w}px`, animationDelay: `${idx * 100}ms` }}
                />
              ))}
            </div>
          </div>

          {/* HEADER BAR: Animated Title on Left, Animated HUD Tabs + 373% on Right */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 pb-3 sm:pb-3.5">
            {/* Top-Left Brand & System Title with Wave & Decode Animation */}
            <div className="flex flex-col pl-1 sm:pl-2">
              <h1
                className="text-[26px] sm:text-[35px] leading-[1.08] font-medium tracking-[0.07em]"
                style={{ fontFamily: 'var(--font-jp)' }}
              >
                <CyberScrambleText
                  text="POINT PROGRESSION"
                  waveChars={true}
                  periodicIntervalMs={9000}
                />
              </h1>
              <div className="flex items-center gap-2.5 mt-0.5">
                <span
                  className="text-neon-shimmer-cyan text-[15px] sm:text-[19px] font-semibold tracking-[0.14em]"
                  style={{ fontFamily: 'var(--font-hud)' }}
                >
                  <CyberScrambleText
                    text="REWARTSB"
                    periodicIntervalMs={11000}
                  />
                </span>
                {/* Small Cyber Stamp Glyph Icon with #e30613 Border */}
                <span className="inline-flex items-center justify-center px-1.5 py-[1px] text-[10px] font-mono leading-none text-[#ff8a93] border border-[#e30613] bg-[#290306] rounded-[2px] shadow-[0_0_8px_rgba(227,6,19,0.65),inset_0_0_4px_rgba(227,6,19,0.4)]">
                  ADVANCE
                </span>
                <span className="w-5 h-[1.5px] bg-[#e30613] shadow-[0_0_6px_#e30613]" />
                <span className="animate-telemetry-blink text-[11px] sm:text-[12px] font-mono tracking-[0.2em] text-[#ff8a93]">
                  <CyberScrambleText text="ANIG" periodicIntervalMs={14000} />
                </span>
              </div>
            </div>

            {/* Top-Right Navigation Tabs + 373% Status Module with #e30613 Borders & Text Scramble */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
              {navTabs.map((tab) => {
                const isActive = activeTab === tab;
                return (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => {
                      arcadeSound.playClick();
                      onSelectTab(tab);
                    }}
                    onMouseEnter={() => arcadeSound.playHover()}
                    className={`clip-hud-tab relative px-4 sm:px-6 py-1.5 sm:py-2 text-[11px] sm:text-[12.5px] font-semibold tracking-[0.15em] transition-all cursor-pointer border ${
                      isActive
                        ? 'bg-[#290508] text-[#ffffff] border-[#e30613] shadow-[0_0_14px_rgba(227,6,19,0.85),inset_0_0_8px_rgba(227,6,19,0.5)]'
                        : 'bg-[#0e0304]/95 text-[#e6b3b8] border-[#e30613]/55 shadow-[0_0_6px_rgba(227,6,19,0.25)] hover:border-[#ff3340] hover:text-white hover:shadow-[0_0_12px_rgba(227,6,19,0.7)]'
                    }`}
                  >
                    <CyberScrambleText text={tab} scrambleOnMount={true} />
                    {tab === 'BOISITIES' && redeemedCount > 0 && (
                      <span className="ml-1.5 inline-flex items-center justify-center px-1.5 py-0.2 text-[9px] bg-[#e30613] text-white rounded-full shadow-[0_0_8px_#e30613] animate-pulse">
                        {redeemedCount}
                      </span>
                    )}
                  </button>
                );
              })}

              {/* 373% + #e30613 Red Status Module */}
              <button
                type="button"
                onClick={() => {
                  arcadeSound.playClick();
                  onOpenVault();
                }}
                title="View Arcade Telemetry & Redeemed Vault"
                className="clip-hud-tab flex items-center gap-2 px-3.5 sm:px-5 py-1 sm:py-1.5 bg-[#120305] border border-[#e30613] shadow-[0_0_10px_rgba(227,6,19,0.55),inset_0_0_6px_rgba(227,6,19,0.3)] hover:border-[#ff3340] hover:shadow-[0_0_16px_rgba(227,6,19,0.9)] transition-all cursor-pointer"
              >
                <span
                  className="animate-cyan-text-pulse text-[16px] sm:text-[19px] font-semibold tracking-[0.09em] text-[#e9fdff]"
                  style={{ fontFamily: 'var(--font-hud)' }}
                >
                  <CyberScrambleText
                    text="373%"
                    periodicIntervalMs={10000}
                  />
                </span>
                {/* Glowing #e30613 Circle-Slash Icon */}
                <span className="relative inline-flex items-center justify-center w-4 h-4 sm:w-4.5 sm:h-4.5 rounded-full border-[1.8px] border-[#e30613] shadow-[0_0_10px_rgba(227,6,19,0.95),inset_0_0_4px_rgba(227,6,19,0.6)] animate-pulse">
                  <span className="w-3.5 h-[1.8px] bg-[#e30613] rotate-45 block shadow-[0_0_6px_#e30613]" />
                </span>
              </button>
            </div>
          </div>

          {/* Glowing #e30613 Neon Divider Line above Telemetry Bar */}
          <div className="h-[1.5px] w-full neon-line-red rounded-full" />

          {/* BOTTOM TELEMETRY & REDEMPTION BAR (2 Horizontal Rows) */}
          <div className="pt-1.5 flex flex-col">
            {/* ROW 1: MAIN POINTS / MY SAVED POINTS | Pink Segmented Progress Bar | -5,000 (2 MOINS AGO) */}
            <div className="grid grid-cols-1 sm:grid-cols-12 items-center gap-3 py-2.5 px-1 sm:px-2">
              {/* Left Animated Label */}
              <div className="sm:col-span-4 flex flex-col">
                <div
                  className="text-[21px] sm:text-[25px] font-medium tracking-[0.06em] leading-tight"
                  style={{ fontFamily: 'var(--font-jp)' }}
                >
                  <CyberScrambleText
                    text="MAIN POINTS"
                    waveChars={true}
                    periodicIntervalMs={12000}
                  />
                </div>
                <div
                  className="text-neon-shimmer-cyan text-[12px] sm:text-[13.5px] font-semibold tracking-[0.15em] uppercase mt-0.5 drop-shadow-[0_0_8px_rgba(92,239,226,0.35)]"
                  style={{ fontFamily: 'var(--font-hud)' }}
                >
                  <CyberScrambleText
                    text="MY SAVED POINTS"
                    periodicIntervalMs={15000}
                  />
                </div>
              </div>

              {/* Center Sci-Fi Pink Progress Module with #e30613 Border Lines */}
              <div className="sm:col-span-4 flex justify-start sm:justify-center">
                <div className="neon-module-cyan relative w-full max-w-[300px] h-[48px] flex items-center bg-[#100304] rounded-[6px] p-1.5">
                  {/* Decorative Glowing #e30613 Bracket Lines */}
                  <span className="pointer-events-none absolute -top-[2px] left-2 w-12 h-[2.5px] bg-[#e30613] shadow-[0_0_10px_#e30613,0_0_18px_#e30613] rounded-full" />
                  <span className="pointer-events-none absolute -bottom-[2px] right-3 w-24 h-[2.5px] bg-[#ff3b47] shadow-[0_0_10px_#e30613,0_0_18px_#e30613] rounded-full" />

                  {/* Left Shield Emblem Socket with #e30613 Border */}
                  <div className="w-[48px] h-[34px] shrink-0 rounded-[4px] bg-[#240407] border border-[#e30613] flex items-center justify-center shadow-[0_0_12px_rgba(227,6,19,0.7),inset_0_0_6px_rgba(227,6,19,0.4)]">
                    <svg
                      className="w-5 h-5 text-[#ff6b75] drop-shadow-[0_0_6px_#e30613]"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <path
                        d="M12 3L4 6.5V12.5C4 17 7.5 20.5 12 22C16.5 20.5 20 17 20 12.5V6.5L12 3Z"
                        stroke="#e30613"
                        strokeWidth="1.8"
                        fill="rgba(227,6,19,0.25)"
                      />
                      <path
                        d="M9 12L11 14L15.5 9.5"
                        stroke="#ffffff"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>

                  {/* Right Segmented Bar Slot with #e30613 Rim */}
                  <div className="ml-2 flex-1 h-[26px] bg-[#1a0407] border border-[#e30613]/75 shadow-[0_0_8px_rgba(227,6,19,0.4),inset_0_0_6px_rgba(227,6,19,0.3)] rounded-[3px] p-[2px] overflow-hidden relative">
                    <div
                      className="h-full pink-led-segments rounded-[2px] transition-all duration-500"
                      style={{ width: `${Math.max(15, Math.min(100, progressPercent))}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Right Animated Points Delta Display (-5,000 + Checkmark + 2 MOINS AGO) */}
              <div className="sm:col-span-4 flex flex-col items-start sm:items-end justify-center">
                <div className="flex items-center gap-2.5">
                  <AnimatedCounter
                    value={lastDelta}
                    showSign={true}
                    className="animate-neon-pink-glitch text-[26px] sm:text-[33px] font-semibold tracking-[0.07em] leading-none"
                    style={{ fontFamily: 'var(--font-cyber)' }}
                  />
                  {/* Circular Checkmark Icon with #e30613 Border */}
                  <span className="inline-flex items-center justify-center w-5.5 h-5.5 rounded-full border border-[#e30613] text-[#ffb0b6] shadow-[0_0_8px_rgba(227,6,19,0.7),inset_0_0_4px_rgba(227,6,19,0.4)]">
                    <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none">
                      <path
                        d="M3.5 8.5L6.5 11.5L12.5 5"
                        stroke="#e30613"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                </div>
                <span className="animate-telemetry-blink text-[10px] sm:text-[11px] font-mono tracking-[0.16em] text-[#ff8a93] uppercase mt-0.5">
                  <CyberScrambleText text={lastTimeAgo} />
                </span>
              </div>
            </div>

            {/* Glowing #e30613 Neon Divider Line between Row 1 and Row 2 */}
            <div className="my-0.5 h-[1px] w-full neon-line-red opacity-85" />

            {/* ROW 2: REWARD RANK / POINTS | Gold Crest + Infinity Slot | REDEM Button + AGDD */}
            <div className="grid grid-cols-1 sm:grid-cols-12 items-center gap-3 pt-2.5 pb-1 px-1 sm:px-2">
              {/* Left Animated Label with #e30613 Claw/Wing Icon */}
              <div className="sm:col-span-4 flex items-center gap-2.5">
                <div className="w-9 h-9 sm:w-10 sm:h-10 shrink-0 flex items-center justify-center text-[#e30613] drop-shadow-[0_0_10px_rgba(227,6,19,0.85)]">
                  <svg className="w-8 h-8" viewBox="0 0 36 36" fill="none">
                    <path
                      d="M17 6L9 19L15 19L13 30L27 16L20 16L23 6H17Z"
                      stroke="#e30613"
                      strokeWidth="2.2"
                      strokeLinejoin="round"
                      fill="rgba(227,6,19,0.22)"
                    />
                    <path
                      d="M6 22L12 28L20 24"
                      stroke="#e30613"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
                <div className="flex flex-col">
                  <div
                    className="text-[21px] sm:text-[26px] font-medium tracking-[0.07em] leading-tight"
                    style={{ fontFamily: 'var(--font-jp)' }}
                  >
                    <CyberScrambleText
                      text="REWARD RANK"
                      waveChars={true}
                      periodicIntervalMs={10500}
                    />
                  </div>
                  <div
                    className="text-neon-shimmer-cyan text-[12px] sm:text-[13.5px] font-semibold tracking-[0.16em] uppercase drop-shadow-[0_0_8px_rgba(227,6,19,0.35)]"
                    style={{ fontFamily: 'var(--font-hud)' }}
                  >
                    <CyberScrambleText
                      text="POINTS"
                      periodicIntervalMs={13500}
                    />
                  </div>
                </div>
              </div>

              {/* Center Sci-Fi Emblem + Animated Infinity Module with #e30613 Border */}
              <div className="sm:col-span-4 flex justify-start sm:justify-center">
                <div className="neon-module-gold relative w-full max-w-[300px] h-[48px] flex items-center bg-[#100304] rounded-[6px] p-1.5">
                  <span className="pointer-events-none absolute -top-[2px] left-2 w-14 h-[2.5px] bg-[#e30613] shadow-[0_0_10px_#e30613,0_0_18px_#e30613] rounded-full" />
                  <span className="pointer-events-none absolute -bottom-[2px] right-3 w-20 h-[2.5px] bg-[#ff4d58] shadow-[0_0_10px_#e30613,0_0_18px_#e30613] rounded-full" />

                  {/* Left Cyber Chip Socket */}
                  <div className="w-[48px] h-[34px] shrink-0 rounded-[4px] bg-[#240407] border border-[#e30613] flex items-center justify-center shadow-[0_0_12px_rgba(227,6,19,0.7),inset_0_0_6px_rgba(227,6,19,0.4)]">
                    <svg
                      className="w-5 h-5 text-[#ff8a93] drop-shadow-[0_0_6px_#e30613]"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <circle
                        cx="12"
                        cy="12"
                        r="7"
                        stroke="#e30613"
                        strokeWidth="1.6"
                        fill="rgba(227,6,19,0.25)"
                      />
                      <path
                        d="M12 7V17M7 12H17M8.5 8.5L15.5 15.5M15.5 8.5L8.5 15.5"
                        stroke="#ffffff"
                        strokeWidth="1.2"
                      />
                    </svg>
                  </div>

                  {/* Right Infinity Symbol Bar Slot with #e30613 Rim */}
                  <div className="ml-2 flex-1 h-[26px] bg-[#1a0407] border border-[#e30613]/80 shadow-[0_0_8px_rgba(227,6,19,0.45),inset_0_0_6px_rgba(227,6,19,0.25)] rounded-[3px] flex items-center justify-center">
                    <span className="animate-infinity-glow text-[20px] font-bold leading-none tracking-widest text-[#ff9ebb]">
                      ∞
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Animated REDEM Button with #e30613 Bevel Frame */}
              <div className="sm:col-span-4 flex items-end justify-start sm:justify-end gap-2.5">
                <div className="p-[2.5px] rounded-[9px] border-[1.8px] border-[#e30613] bg-[#220306] shadow-[0_0_14px_rgba(227,6,19,0.85),0_0_26px_rgba(227,6,19,0.45),inset_0_0_8px_rgba(227,6,19,0.4)]">
                  <button
                    type="button"
                    onClick={() => {
                      arcadeSound.playClick();
                      onClickMainRedem();
                    }}
                    onMouseEnter={() => arcadeSound.playHover()}
                    className="redem-main-btn px-8 sm:px-11 py-2 sm:py-2.5 rounded-[6px] text-[15px] sm:text-[17px] font-bold tracking-[0.16em] text-[#2a0710] uppercase cursor-pointer transition-all active:scale-95"
                    style={{ fontFamily: 'var(--font-cyber)' }}
                  >
                    <CyberScrambleText text="REDEM" periodicIntervalMs={8500} />
                  </button>
                </div>
                <span className="animate-telemetry-blink text-[11px] font-mono tracking-[0.16em] text-[#ff8a93] pb-1">
                  <CyberScrambleText text="AGDD" periodicIntervalMs={11500} />
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
