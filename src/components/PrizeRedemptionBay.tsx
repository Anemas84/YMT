import React from 'react';
import { PrizeCardSpec, arcadeSound, getShelfRowCards } from '../data/prizes';
import { CyberScrambleText } from './CyberText';

interface PrizeRedemptionBayProps {
  bayNumber: 1 | 2;
  warmAmbiance?: boolean;
  selectedCardId: string | null;
  redeemedCardIds: Set<string>;
  activeFilter?: string | null;
  onSelectCard: (card: PrizeCardSpec, bayNumber: number, rowNumber: number) => void;
  onRedeemShelfAction: (
    bayNumber: number,
    rowNumber: number,
    mode: 'SINGLE' | 'BUNDLE_10' | 'QUICK',
    cards: PrizeCardSpec[]
  ) => void;
}

export const PrizeRedemptionBay: React.FC<PrizeRedemptionBayProps> = ({
  bayNumber,
  warmAmbiance = false,
  selectedCardId,
  redeemedCardIds,
  activeFilter,
  onSelectCard,
  onRedeemShelfAction,
}) => {
  const row1Cards = getShelfRowCards(bayNumber, 1);
  const row2Cards = getShelfRowCards(bayNumber, 2);

  const renderCard = (card: PrizeCardSpec, rowNumber: number) => {
    const isSelected = selectedCardId === card.id;
    const isRedeemed = redeemedCardIds.has(card.id);
    const isDimmed =
      activeFilter &&
      activeFilter !== 'ALL' &&
      !card.subtitleLeft.includes(activeFilter) &&
      !card.title.includes(activeFilter);

    return (
      <div
        key={card.id}
        onClick={() => {
          arcadeSound.playClick();
          onSelectCard(card, bayNumber, rowNumber);
        }}
        onMouseEnter={() => arcadeSound.playHover()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            arcadeSound.playClick();
            onSelectCard(card, bayNumber, rowNumber);
          }
        }}
        aria-label={`${card.title} - ${card.subtitleLeft} (${card.cost} Points)`}
        className={`prize-card-wrapper group relative flex flex-col cursor-pointer select-none transition-all duration-200 min-w-0 ${
          isDimmed ? 'opacity-35 scale-95' : 'opacity-100'
        }`}
      >
        {/* Outer Double-Sized #e30613 Red Border Frame around Gift Display */}
        <div
          className={`relative p-[4px] sm:p-[5px] rounded-[12px] transition-all duration-200 ${
            isSelected
              ? 'neon-card-frame-selected bg-gradient-to-b from-[#ff3340] to-[#e30613] -translate-y-1.5'
              : 'neon-card-frame bg-[#150406]'
          }`}
        >
          {/* Double-Sized Black Gift Display Surface */}
          <div className="prize-display-card relative w-full aspect-[1/1.26] min-h-[210px] sm:min-h-[260px] md:min-h-[300px] rounded-[10px] flex items-center justify-center p-2.5 sm:p-3.5 overflow-hidden">
            {/* Double-Sized Inner Collectible Portrait Card Art */}
            <div className="relative w-[86%] h-[90%] rounded-[6px] overflow-hidden shadow-[0_6px_16px_rgba(0,0,0,0.65),0_0_12px_rgba(227,6,19,0.35)] border border-[#e30613]/55 bg-[#000000]">
              <img
                src={card.image}
                alt={card.title}
                loading="lazy"
                className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-300"
              />
            </div>

            {/* Redeemed Stamp Overlay if user already redeemed this specific slot */}
            {isRedeemed && (
              <div className="pointer-events-none absolute top-2 right-2 px-2 py-0.5 rounded bg-[#e30613] border border-[#ff6670] text-[10px] sm:text-[11px] font-mono font-bold text-white uppercase shadow-[0_0_10px_#e30613] animate-pulse">
                OWNED
              </div>
            )}

            {/* Hover Cost Badge (Double-Sized) */}
            <div className="pointer-events-none absolute bottom-2.5 inset-x-2 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-150">
              <span className="px-3 py-1 rounded-md bg-[#1a0305]/95 border border-[#e30613] text-[11px] sm:text-[13px] font-mono font-bold text-[#ffb3b8] shadow-[0_0_14px_#e30613]">
                {card.cost.toLocaleString()} PTS // CLICK TO REDEEM
              </span>
            </div>
          </div>
        </div>

        {/* Double-Sized Lower Dark Telemetry Label Plaque with Animated Text */}
        <div
          className={`mt-2 px-1.5 py-1.5 rounded-[5px] transition-colors ${
            isSelected
              ? 'bg-[#290508] border border-[#e30613] shadow-[0_0_12px_rgba(227,6,19,0.65)]'
              : 'bg-[#100305]/65 border border-[#e30613]/40 group-hover:border-[#e30613]/80'
          }`}
        >
          {/* Animated Double-Sized Card Title */}
          <div
            className="animate-cyan-text-pulse text-[13px] sm:text-[15px] md:text-[16px] font-bold tracking-[0.04em] text-[#e6fcff] text-center uppercase truncate leading-tight"
            style={{ fontFamily: 'var(--font-hud)' }}
          >
            <CyberScrambleText
              text={card.title}
              scrambleOnMount={false}
              scrambleOnHover={true}
            />
          </div>

          {/* Double-Sized Subtitle Row: Badge + Tier Info */}
          <div className="mt-1 flex items-center justify-between gap-1.5 px-1">
            {card.badge ? (
              <div className="flex items-center gap-1.5 min-w-0">
                <span className="shrink-0 inline-flex items-center justify-center px-1.5 py-[2px] rounded-[3px] bg-[#290407] border border-[#e30613] text-[10px] sm:text-[11px] font-mono font-bold text-[#ff8a93] leading-none shadow-[0_0_8px_rgba(227,6,19,0.75)] animate-pulse">
                  {card.badge}
                </span>
                <span className="text-neon-shimmer-cyan text-[10px] sm:text-[11.5px] font-semibold tracking-[0.03em] uppercase truncate">
                  <CyberScrambleText
                    text={card.subtitleLeft}
                    scrambleOnMount={false}
                    scrambleOnHover={true}
                  />
                </span>
              </div>
            ) : (
              <span className="text-neon-shimmer-cyan text-[10.5px] sm:text-[12px] font-bold tracking-[0.03em] uppercase truncate">
                <CyberScrambleText
                  text={card.subtitleLeft}
                  scrambleOnMount={false}
                  scrambleOnHover={true}
                />
              </span>
            )}

            <span className="animate-telemetry-blink shrink-0 text-[9.5px] sm:text-[11px] font-mono tracking-[0.03em] text-[#ff8a93] uppercase">
              {card.subtitleRight}
            </span>
          </div>
        </div>
      </div>
    );
  };

  const renderShelfRow = (rowNumber: number, cards: PrizeCardSpec[]) => {
    const leftGroup = cards.slice(0, 4);
    const rightGroup = cards.slice(4, 8);

    return (
      <div
        className={`relative rounded-[10px] p-3.5 sm:p-5 md:p-6 transition-all ${
          warmAmbiance
            ? 'neon-shelf-warm bg-gradient-to-r from-[#08131a]/95 via-[#09151d]/95 to-[#221611]/92'
            : 'neon-shelf-cool bg-gradient-to-r from-[#07141e]/95 via-[#081722]/95 to-[#081620]/95'
        }`}
      >
        {/* Top Shelf Glowing #e30613 Laser Line */}
        <div
          className="pointer-events-none absolute -top-[1px] left-4 right-4 h-[2px] rounded-full bg-gradient-to-r from-[#e30613] via-[#ff3b47] to-[#e30613] shadow-[0_0_10px_#e30613,0_0_18px_#e30613]"
        />

        {/* Bottom Shelf Glowing #e30613 Laser Line */}
        <div
          className="pointer-events-none absolute -bottom-[1px] left-4 right-4 h-[2px] rounded-full bg-gradient-to-r from-[#e30613]/85 via-[#ff3b47] to-[#e30613]/85 shadow-[0_0_10px_#e30613]"
        />

        {/* Left & Right Shelf Vertical #e30613 Accent Lines */}
        <div className="pointer-events-none absolute top-3 bottom-3 -left-[1px] w-[2.5px] bg-[#e30613] shadow-[0_0_10px_#e30613] rounded-full" />
        <div className="pointer-events-none absolute top-3 bottom-3 -right-[1px] w-[2.5px] bg-[#e30613] shadow-[0_0_10px_#e30613] rounded-full" />

        {/* Shelf Layout: Double-Sized Product Matrix (2 sub-tiers of 4 giant cards) + Double-Sized 3 Stacked Redeem Buttons */}
        <div className="flex flex-col xl:flex-row items-stretch xl:items-center gap-5 xl:gap-6">
          {/* 8 Double-Sized Cards Container (2 rows of 4 large cards so every product is 200% size) */}
          <div className="flex-1 flex flex-col gap-5 sm:gap-6 min-w-0">
            {/* Upper 4 Double-Sized Products */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 sm:gap-5 min-w-0">
              {leftGroup.map((c) => renderCard(c, rowNumber))}
            </div>

            {/* Subtle Glowing #e30613 Sub-Shelf Divider */}
            <div className="h-[1px] w-full neon-line-red opacity-80" />

            {/* Lower 4 Double-Sized Products */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 sm:gap-5 min-w-0">
              {rightGroup.map((c) => renderCard(c, rowNumber))}
            </div>
          </div>

          {/* Rightmost Column: 3 Double-Sized Stacked REDEEM Action Buttons with Animated Text */}
          <div className="xl:w-[212px] shrink-0 flex flex-col sm:flex-row xl:flex-col justify-center gap-3.5 xl:gap-5 pt-2 xl:pt-0 xl:pl-2">
            {/* Top Button: Single Redeem */}
            <button
              type="button"
              onClick={() => {
                arcadeSound.playClick();
                onRedeemShelfAction(bayNumber, rowNumber, 'SINGLE', cards);
              }}
              onMouseEnter={() => arcadeSound.playHover()}
              className="shelf-redeem-btn flex-1 xl:flex-none rounded-[10px] py-3.5 sm:py-4 px-4 flex flex-col items-center justify-center cursor-pointer"
              title="Redeem Selected Collectible from this Shelf (1,250 PTS)"
            >
              <span
                className="animate-redeem-text-1 text-[17px] sm:text-[19px] font-bold tracking-[0.12em] text-[#e8fdff] leading-tight uppercase"
                style={{ fontFamily: 'var(--font-cyber)' }}
              >
                <CyberScrambleText
                  text="REDEEM"
                  scrambleOnMount={false}
                  periodicIntervalMs={9500}
                />
              </span>
              <span
                className="text-neon-shimmer-cyan text-[10.5px] sm:text-[11.5px] font-semibold tracking-[0.06em] uppercase leading-none mt-1 whitespace-nowrap"
                style={{ fontFamily: 'var(--font-hud)' }}
              >
                SINGLE 1,250 PTS
              </span>
            </button>

            {/* Middle Button: [10] Badge + 10-PACK REDEEM */}
            <button
              type="button"
              onClick={() => {
                arcadeSound.playClick();
                onRedeemShelfAction(bayNumber, rowNumber, 'BUNDLE_10', cards);
              }}
              onMouseEnter={() => arcadeSound.playHover()}
              className="shelf-redeem-btn flex-1 xl:flex-none rounded-[10px] py-3.5 sm:py-4 px-3.5 flex items-center justify-center gap-2.5 cursor-pointer"
              title="Multi-Redeem Full Row Pack (-5,000 PTS)"
            >
              <span className="inline-flex items-center justify-center px-2 py-1 rounded-[4px] bg-[#290407] border border-[#e30613] text-[11px] sm:text-[12px] font-mono font-bold text-[#ff8a93] leading-none shadow-[0_0_8px_#e30613] animate-pulse">
                10
              </span>
              <div className="flex flex-col items-center">
                <span
                  className="animate-redeem-text-2 text-[16px] sm:text-[18px] font-bold tracking-[0.12em] text-[#e8fdff] leading-tight uppercase"
                  style={{ fontFamily: 'var(--font-cyber)' }}
                >
                  <CyberScrambleText
                    text="REDEEM"
                    scrambleOnMount={false}
                    periodicIntervalMs={11000}
                  />
                </span>
                <span
                  className="text-neon-shimmer-cyan text-[10px] sm:text-[11px] font-semibold tracking-[0.06em] uppercase leading-none mt-1 whitespace-nowrap"
                  style={{ fontFamily: 'var(--font-hud)' }}
                >
                  PACK 5,000 PTS
                </span>
              </div>
            </button>

            {/* Bottom Button: Prominent Instant REDEEM */}
            <button
              type="button"
              onClick={() => {
                arcadeSound.playClick();
                onRedeemShelfAction(bayNumber, rowNumber, 'QUICK', cards);
              }}
              onMouseEnter={() => arcadeSound.playHover()}
              className="shelf-redeem-btn flex-1 xl:flex-none rounded-[10px] py-4 sm:py-4.5 px-4 flex flex-col items-center justify-center cursor-pointer"
              title="Open Instant Prize Unboxing Pod for this Shelf"
            >
              <span
                className="animate-redeem-text-3 text-[17px] sm:text-[20px] font-bold tracking-[0.12em] text-[#ffffff] leading-tight uppercase"
                style={{ fontFamily: 'var(--font-cyber)' }}
              >
                <CyberScrambleText
                  text="REDEEM"
                  scrambleOnMount={false}
                  periodicIntervalMs={12500}
                />
              </span>
              <span
                className="text-neon-shimmer-cyan text-[10.5px] sm:text-[11.5px] font-semibold tracking-[0.06em] uppercase leading-none mt-1 whitespace-nowrap"
                style={{ fontFamily: 'var(--font-hud)' }}
              >
                INSTANT UNBOX
              </span>
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <section
      aria-label={`Arcade Prize Redemption Bay 0${bayNumber}`}
      className="relative w-full max-w-[1640px] mx-auto select-none"
    >
      {/* Heavy Outer Industrial Mech Casing with Chamfered Corners & #e30613 Border & Glow */}
      <div className="neon-bay-outer relative p-[3px] rounded-[24px] bg-gradient-to-br from-[#e30613] via-[#750209] to-[#e30613]">
        {/* Continuous Top Neon Edge Line */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-[1px] left-14 right-14 h-[2px] bg-[#e30613] shadow-[0_0_12px_#e30613,0_0_20px_#e30613] z-20"
        />
        {/* Continuous Bottom Neon Edge Line */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-[1px] left-14 right-14 h-[2px] bg-[#e30613] shadow-[0_0_12px_#e30613,0_0_20px_#e30613] z-20"
        />
        {/* Left & Right Continuous Vertical Neon Laser Trim */}
        <div className="pointer-events-none absolute left-[0px] top-12 bottom-12 w-[2.5px] bg-[#e30613] shadow-[0_0_12px_#e30613,0_0_20px_#e30613] z-20" />
        <div className="pointer-events-none absolute right-[0px] top-12 bottom-12 w-[2.5px] bg-[#e30613] shadow-[0_0_14px_#e30613,0_0_24px_#e30613] z-20" />

        {/* Top-Left #e30613 Neon Corner Bracket */}
        <svg
          className="neon-svg-red pointer-events-none absolute -top-[3px] -left-[3px] w-32 h-32 z-20"
          viewBox="0 0 112 112"
          fill="none"
        >
          <path
            d="M2 82V26L26 2H96"
            stroke="#e30613"
            strokeWidth="2.6"
            strokeLinecap="round"
          />
          <path
            d="M8 66V29L29 8H76"
            stroke="#ff4d58"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
        </svg>

        {/* Top-Right #e30613 Neon Corner Bracket */}
        <svg
          className="neon-svg-red pointer-events-none absolute -top-[3px] -right-[3px] w-32 h-32 z-20"
          viewBox="0 0 112 112"
          fill="none"
        >
          <path
            d="M16 2H86L110 26V82"
            stroke="#e30613"
            strokeWidth="2.6"
            strokeLinecap="round"
          />
          <path
            d="M34 8H83L104 29V66"
            stroke="#ff4d58"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
        </svg>

        {/* Bottom-Left #e30613 Corner Bracket + Status Dots */}
        <svg
          className="neon-svg-red pointer-events-none absolute -bottom-[3px] -left-[3px] w-52 h-28 z-20"
          viewBox="0 0 192 96"
          fill="none"
        >
          <path
            d="M2 14V70L26 94H172"
            stroke="#e30613"
            strokeWidth="2.6"
            strokeLinecap="round"
          />
          <path
            d="M8 26V67L29 88H140"
            stroke="#ff4d58"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <circle cx="58" cy="84" r="2.2" fill="#e30613" />
          <circle cx="68" cy="84" r="2.2" fill="#ff4d58" />
          <circle cx="78" cy="84" r="2.2" fill="#ff4d58" />
          <circle cx="88" cy="84" r="2.2" fill="#e30613" />
          <circle cx="98" cy="84" r="2.2" fill="#e30613" />
          <circle cx="108" cy="84" r="2.2" fill="#ff4d58" />
        </svg>

        {/* Bottom-Right #e30613 Corner Bracket + Rivet Circles */}
        <svg
          className="neon-svg-red pointer-events-none absolute -bottom-[3px] -right-[3px] w-52 h-28 z-20"
          viewBox="0 0 192 96"
          fill="none"
        >
          <path
            d="M190 14V70L166 94H20"
            stroke="#e30613"
            strokeWidth="2.6"
            strokeLinecap="round"
          />
          <path
            d="M184 26V67L163 88H52"
            stroke="#ff4d58"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
          {/* 4 Mechanical Rivet Ports with #e30613 */}
          <circle cx="112" cy="84" r="3" stroke="#e30613" strokeWidth="1.3" fill="#170305" />
          <circle cx="124" cy="84" r="3" stroke="#e30613" strokeWidth="1.3" fill="#170305" />
          <circle cx="136" cy="84" r="3" stroke="#e30613" strokeWidth="1.3" fill="#170305" />
          <circle cx="148" cy="84" r="3" stroke="#e30613" strokeWidth="1.3" fill="#170305" />
        </svg>

        {/* Inner Dark Showcase Cabinet with #e30613 Rim */}
        <div className="neon-bay-inner relative rounded-[22px] bg-[#040608] px-3.5 sm:px-7 pt-2.5 pb-9 sm:pb-12">
          {/* Top Recessed Metallic Valance Hood with #e30613 Bottom Rim */}
          <div className="relative mb-6 sm:mb-9">
            <div className="clip-valance w-full h-[46px] sm:h-[58px] bg-gradient-to-b from-[#1f0507] via-[#120304] to-[#080102] border-b-2 border-[#e30613] flex items-center justify-between px-8 sm:px-12 shadow-[0_6px_20px_rgba(227,6,19,0.35)]">
              <div className="flex items-center gap-2.5">
                <span className="w-2 h-2 rounded-full bg-[#e30613] shadow-[0_0_8px_#e30613] animate-ping" />
                <span className="text-neon-shimmer-cyan font-mono text-[10px] sm:text-[12px] font-bold tracking-[0.22em] uppercase">
                  <CyberScrambleText
                    text={`BAY_0${bayNumber} // 2X COLLECTIBLE SHOWCASE`}
                    periodicIntervalMs={13000}
                  />
                </span>
              </div>
              <div className="hidden sm:flex items-center gap-3">
                <span className="animate-telemetry-blink font-mono text-[10px] sm:text-[11px] tracking-[0.2em] text-[#ff8a93]">
                  UNIT: 1,250 PTS
                </span>
                <span className="w-8 h-[1.5px] bg-[#e30613] shadow-[0_0_6px_#e30613]" />
                <span className="animate-neon-pink-glitch font-mono text-[10px] sm:text-[11px] font-bold tracking-[0.2em]">
                  10X PACK: -5,000 PTS
                </span>
              </div>
            </div>
            {/* Glowing #e30613 Strip along Valance Bottom Edge */}
            <div className="pointer-events-none absolute bottom-0 left-7 right-7 h-[2px] neon-line-red rounded-full" />
          </div>

          {/* SHELF ROW 1 */}
          <div className="mb-8 sm:mb-12">{renderShelfRow(1, row1Cards)}</div>

          {/* SHELF ROW 2 */}
          <div>{renderShelfRow(2, row2Cards)}</div>
        </div>
      </div>
    </section>
  );
};
