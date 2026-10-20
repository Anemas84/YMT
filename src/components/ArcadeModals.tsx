import React, { useState } from 'react';
import { X, Sparkles, Coins, PackageCheck, History, CheckCircle2, ShieldAlert } from 'lucide-react';
import { PrizeCardSpec, RedeemedItem, TelemetryLog, arcadeSound } from '../data/prizes';
import { CyberScrambleText, AnimatedCounter } from './CyberText';

interface InspectModalProps {
  card: PrizeCardSpec | null;
  bayNumber: number;
  rowNumber: number;
  mode: 'SINGLE' | 'BUNDLE_10' | 'QUICK';
  rowCards: PrizeCardSpec[];
  pointsBalance: number;
  onClose: () => void;
  onConfirmRedeem: (items: PrizeCardSpec[], totalCost: number, bay: number, row: number) => void;
  onOpenTopUp: () => void;
}

export const PrizeRedeemModal: React.FC<InspectModalProps> = ({
  card,
  bayNumber,
  rowNumber,
  mode,
  rowCards,
  pointsBalance,
  onClose,
  onConfirmRedeem,
  onOpenTopUp,
}) => {
  const [justRedeemed, setJustRedeemed] = useState(false);

  if (!card && mode === 'SINGLE') return null;

  const isBundle = mode === 'BUNDLE_10';
  const targetCards = isBundle
    ? rowCards.slice(0, 4)
    : [card || rowCards[0]];
  const totalCost = isBundle ? 5000 : (card?.cost ?? 1250);
  const canAfford = pointsBalance >= totalCost;

  const handleConfirm = () => {
    if (!canAfford) return;
    arcadeSound.playRedeemFanfare();
    setJustRedeemed(true);
    onConfirmRedeem(targetCards, totalCost, bayNumber, rowNumber);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="neon-console-outer relative w-full max-w-[760px] p-[3px] rounded-[20px] bg-gradient-to-br from-[#e30613] via-[#ff3b47] to-[#750209]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="neon-console-inner rounded-[18px] cyber-grid-bg p-6 sm:p-8 max-h-[92vh] overflow-y-auto">
          {/* Modal Header */}
          <div className="flex items-start justify-between gap-4 pb-3.5 border-b border-[#e30613]/50">
            <div>
              <div className="flex items-center gap-2.5">
                <span className="px-2.5 py-0.5 text-xs font-mono font-bold bg-[#290306] border border-[#e30613] text-[#ff8a93] rounded shadow-[0_0_8px_#e30613]">
                  BAY 0{bayNumber} // ROW 0{rowNumber}
                </span>
                <span className="animate-neon-pink-glitch text-xs font-mono font-bold">
                  {isBundle ? 'FULL SET BUNDLE (4X)' : 'SINGLE COLLECTIBLE (2X VIEW)'}
                </span>
              </div>
              <h2
                className="text-2xl sm:text-3xl font-bold text-[#e2fcff] mt-1.5 tracking-wide"
                style={{ fontFamily: 'var(--font-jp)' }}
              >
                <CyberScrambleText
                  text={
                    justRedeemed
                      ? 'REDEEM COMPLETE!'
                      : isBundle
                      ? 'COMPLETE SET // 4-PACK REDEEM'
                      : `${targetCards[0].title}`
                  }
                  waveChars={true}
                />
              </h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-lg bg-[#140204] border border-[#e30613] text-[#ff8a93] hover:text-white hover:border-[#ff3340] shadow-[0_0_10px_rgba(227,6,19,0.5)] cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Double-Sized Prize Preview Area */}
          {justRedeemed ? (
            <div className="py-6 flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-[#240306] border-2 border-[#e30613] flex items-center justify-center text-[#ff4d58] shadow-[0_0_25px_rgba(227,6,19,0.7)] mb-3">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <p className="text-base text-[#a6e3ed] max-w-lg">
                Successfully redeemed{' '}
                <strong className="text-white">
                  {isBundle ? '4 Collectible Figures (Full Shelf Set)' : targetCards[0].title}
                </strong>{' '}
                for <strong className="text-[#ff7390]">-{totalCost.toLocaleString()} PTS</strong>!
              </p>
              <div className="mt-5 flex flex-wrap justify-center gap-4">
                {targetCards.map((c, idx) => (
                  <div
                    key={idx}
                    className="w-36 sm:w-40 p-2.5 rounded-xl prize-display-card neon-card-frame flex flex-col items-center"
                  >
                    <img
                      src={c.image}
                      alt={c.title}
                      className="w-28 sm:w-32 h-40 object-cover rounded-md border border-black/15 shadow-md"
                    />
                    <span className="mt-1.5 text-xs font-bold text-[#e6fcff] truncate w-full text-center">
                      {c.title}
                    </span>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={onClose}
                className="mt-7 redem-main-btn px-10 py-2.5 rounded-lg text-base font-bold tracking-widest text-[#2a0710] uppercase cursor-pointer"
              >
                CONTINUE PLAYING
              </button>
            </div>
          ) : (
            <>
              <div className="my-5 flex flex-col md:flex-row items-center gap-6 bg-[#0f0204]/95 border border-[#e30613]/60 shadow-[0_0_18px_rgba(227,6,19,0.35)] rounded-xl p-5">
                {isBundle ? (
                  <div className="grid grid-cols-2 gap-3 shrink-0">
                    {targetCards.map((c, i) => (
                      <div key={i} className="w-32 sm:w-36 p-2 rounded-lg prize-display-card border border-[#e30613]/50">
                        <img
                          src={c.image}
                          alt={c.title}
                          className="w-full h-36 sm:h-40 object-cover rounded"
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="w-56 sm:w-64 shrink-0 p-3.5 rounded-xl prize-display-card neon-card-frame">
                    <img
                      src={targetCards[0].image}
                      alt={targetCards[0].title}
                      className="w-full aspect-[2/3] object-cover rounded-lg shadow-lg"
                    />
                  </div>
                )}

                <div className="flex-1 text-left">
                  <div className="animate-telemetry-blink text-sm font-mono text-[#ff8a93] tracking-wider">
                    {isBundle ? 'SERIES_BUNDLE // 05 TIER' : targetCards[0].serialCode}
                  </div>
                  <div
                    className="text-xl sm:text-2xl font-bold text-white mt-1"
                    style={{ fontFamily: 'var(--font-jp)' }}
                  >
                    <CyberScrambleText
                      text={isBundle ? 'LABUBU LIMITED 4-SET COMPLETE PACK' : targetCards[0].seriesName}
                    />
                  </div>
                  <p className="text-sm text-[#c8dce1] mt-2.5 leading-relaxed">
                    {isBundle
                      ? 'Includes all 4 signature series figures: Wings of Forin, Happy Halloween, Labubu Forest, and Labubu Wacky Mart.'
                      : targetCards[0].description}
                  </p>

                  <div className="mt-4 pt-4 border-t border-[#e30613]/40 flex items-center justify-between">
                    <div>
                      <span className="block text-xs font-mono text-[#ff8a93] uppercase">
                        REDEEM COST
                      </span>
                      <span
                        className="animate-neon-pink-glitch text-2xl sm:text-3xl font-bold"
                        style={{ fontFamily: 'var(--font-cyber)' }}
                      >
                        -{totalCost.toLocaleString()} PTS
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="block text-xs font-mono text-[#ff8a93] uppercase">
                        YOUR BALANCE
                      </span>
                      <AnimatedCounter
                        value={pointsBalance}
                        suffix=" PTS"
                        className={`text-xl sm:text-2xl font-bold ${
                          canAfford ? 'text-[#ff8a93]' : 'text-red-400'
                        }`}
                        style={{ fontFamily: 'var(--font-cyber)' }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {!canAfford && (
                <div className="mb-4 p-3.5 rounded-lg bg-[#240306]/85 border border-[#e30613] shadow-[0_0_12px_rgba(227,6,19,0.45)] flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-[#ffb3c6]">
                    <ShieldAlert className="w-5 h-5 text-[#e30613] shrink-0" />
                    <span>Insufficient points! Insert coins or top up credits.</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenTopUp();
                    }}
                    className="shrink-0 px-3.5 py-1.5 rounded bg-[#e30613] text-white text-xs font-bold cursor-pointer hover:bg-[#ff3340]"
                  >
                    + GET COINS
                  </button>
                </div>
              )}

              {/* Action Footer */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-lg bg-[#140204] border border-[#e30613]/60 text-xs sm:text-sm font-semibold text-[#ff8a93] hover:text-white cursor-pointer"
                >
                  CANCEL
                </button>
                <button
                  type="button"
                  disabled={!canAfford}
                  onClick={handleConfirm}
                  className={`redem-main-btn px-7 py-2.5 rounded-lg text-sm sm:text-base font-bold tracking-wider text-[#2a0710] uppercase flex items-center gap-2 ${
                    canAfford ? 'cursor-pointer' : 'opacity-40 cursor-not-allowed'
                  }`}
                >
                  <Sparkles className="w-4 h-4" />
                  CONFIRM REDEEM ({totalCost.toLocaleString()} PTS)
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

interface SystemDrawerModalProps {
  mode: 'VAULT' | 'TOPUP' | 'LOGS' | null;
  pointsBalance: number;
  redeemedItems: RedeemedItem[];
  logs: TelemetryLog[];
  onClose: () => void;
  onAddCoins: (amount: number, label: string) => void;
}

export const SystemDrawerModal: React.FC<SystemDrawerModalProps> = ({
  mode,
  pointsBalance,
  redeemedItems,
  logs,
  onClose,
  onAddCoins,
}) => {
  if (!mode) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        className="neon-console-outer relative w-full max-w-[700px] p-[3px] rounded-[20px] bg-gradient-to-br from-[#e30613] via-[#ff3b47] to-[#750209]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="neon-console-inner rounded-[18px] cyber-grid-bg p-6 sm:p-7 max-h-[88vh] flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between pb-3.5 border-b border-[#e30613]/50">
            <div className="flex items-center gap-2.5">
              {mode === 'VAULT' && <PackageCheck className="w-6 h-6 text-[#ff6670]" />}
              {mode === 'TOPUP' && <Coins className="w-6 h-6 text-[#ffd166]" />}
              {mode === 'LOGS' && <History className="w-6 h-6 text-[#e30613]" />}
              <h2
                className="text-xl sm:text-2xl font-bold text-[#e2fcff] tracking-wide"
                style={{ fontFamily: 'var(--font-jp)' }}
              >
                <CyberScrambleText
                  text={
                    mode === 'VAULT'
                      ? `REDEEMED VAULT // PRIZE COLLECTION (${redeemedItems.length})`
                      : mode === 'TOPUP'
                      ? 'COIN CHARGE // ARCADE COIN EXCHANGE'
                      : 'POINT HISTORY // TELEMETRY LOGS'
                  }
                  waveChars={true}
                />
              </h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-lg bg-[#140204] border border-[#e30613] text-[#ff8a93] hover:text-white cursor-pointer shadow-[0_0_8px_rgba(227,6,19,0.5)]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="my-4 overflow-y-auto pr-1 space-y-3">
            {mode === 'VAULT' && (
              <>
                {redeemedItems.length === 0 ? (
                  <div className="py-12 text-center text-sm sm:text-base text-[#88b8c4]">
                    No gifts redeemed yet. Click any double-sized collectible card or press{' '}
                    <span className="text-[#d6f8ff] font-semibold">REDEEM</span> on the
                    shelves to claim your first prize!
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {redeemedItems.map((item) => (
                      <div
                        key={item.uid}
                        className="flex items-center gap-4 p-3.5 rounded-xl bg-[#0f0204] border border-[#e30613]/70 shadow-[0_0_12px_rgba(227,6,19,0.35)]"
                      >
                        <div className="w-20 h-24 shrink-0 p-1.5 rounded-lg prize-display-card border border-[#e30613]/50">
                          <img
                            src={item.prize.image}
                            alt={item.prize.title}
                            className="w-full h-full object-cover rounded"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-sm font-bold text-[#e2fcff] truncate">
                            {item.prize.title}
                          </div>
                          <div className="text-xs text-[#c8dce1] truncate mt-0.5">
                            {item.prize.seriesName}
                          </div>
                          <div className="mt-2 flex items-center justify-between text-xs font-mono text-[#ff8a93]">
                            <span>BAY 0{item.bayId}</span>
                            <span className="text-[#ff7390]">
                              -{item.pointsSpent.toLocaleString()} PTS
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {mode === 'TOPUP' && (
              <div className="space-y-4">
                <p className="text-xs sm:text-sm text-[#98cbd6]">
                  Convert YAMATO Urban Play arcade tokens into redeemable store points. Choose a
                  token pack below or use the points button at the bottom of the screen.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-1">
                  {[
                    { pts: 2500, coins: '5 TOKENS', tag: 'STARTER PACK' },
                    { pts: 5000, coins: '10 TOKENS', tag: 'ROW BUNDLE PACK' },
                    { pts: 15000, coins: '25 TOKENS', tag: 'VIP JACKPOT' },
                  ].map((pack) => (
                    <button
                      key={pack.pts}
                      type="button"
                      onClick={() => {
                        arcadeSound.playYamatoButton();
                        onAddCoins(pack.pts, `COIN EXCHANGE (${pack.coins})`);
                      }}
                      className="p-4 rounded-xl bg-[#140204] border border-[#e30613] hover:border-[#ff3340] shadow-[0_0_12px_rgba(227,6,19,0.4)] text-left flex flex-col justify-between transition-all hover:-translate-y-1 cursor-pointer group"
                    >
                      <span className="text-[10px] font-mono tracking-wider text-[#ff7390] uppercase">
                        {pack.tag}
                      </span>
                      <div
                        className="text-2xl font-bold text-[#ff8a93] my-2.5 group-hover:scale-105 transition-transform"
                        style={{ fontFamily: 'var(--font-cyber)' }}
                      >
                        +{pack.pts.toLocaleString()} PTS
                      </div>
                      <span className="text-xs font-mono text-[#ffb0b6] bg-[#240306] border border-[#e30613]/60 px-2.5 py-1 rounded text-center">
                        INSERT {pack.coins}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {mode === 'LOGS' && (
              <div className="divide-y divide-[#e30613]/30">
                {logs.map((log) => (
                  <div key={log.id} className="py-3 flex items-center justify-between text-xs sm:text-sm">
                    <div>
                      <div className="font-semibold text-[#e2fcff]">{log.label}</div>
                      <div className="text-[11px] font-mono text-[#ff8a93]">{log.timeAgo}</div>
                    </div>
                    <div
                      className={`font-mono text-base font-bold ${
                        log.delta < 0 ? 'text-[#ff7390]' : 'text-[#ff8a93]'
                      }`}
                    >
                      {log.delta < 0
                        ? `-${Math.abs(log.delta).toLocaleString()}`
                        : `+${log.delta.toLocaleString()}`}{' '}
                      PTS
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="pt-3.5 border-t border-[#e30613]/50 flex items-center justify-between">
            <div className="text-xs sm:text-sm font-mono text-[#98cbd6]">
              CURRENT CREDITS:{' '}
              <AnimatedCounter
                value={pointsBalance}
                suffix=" PTS"
                className="font-bold text-[#ff8a93]"
              />
            </div>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 rounded-lg bg-[#240306] border border-[#e30613] text-xs sm:text-sm font-bold text-[#ff8a93] shadow-[0_0_10px_rgba(227,6,19,0.5)] cursor-pointer hover:border-[#ff3340] hover:text-white"
            >
              CLOSE
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
