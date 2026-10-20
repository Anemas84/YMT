import { useState } from 'react';
import { Volume2, VolumeX, Gift, Coins, Map } from 'lucide-react';
import { TopHeroConsole, NavTabId } from './components/TopHeroConsole';
import { PrizeRedemptionBay } from './components/PrizeRedemptionBay';
import { PrizeRedeemModal, SystemDrawerModal } from './components/ArcadeModals';
import { JapanJourneyMap } from './components/JapanJourneyMap';
import { getCurrentStation } from './data/journey';
import {
  PrizeCardSpec,
  RedeemedItem,
  TelemetryLog,
  arcadeSound,
  getShelfRowCards,
} from './data/prizes';

export function App() {
  const [activeTab, setActiveTab] = useState<NavTabId>('RIME');
  const [pointsBalance, setPointsBalance] = useState<number>(15000);
  const [lastDelta, setLastDelta] = useState<number>(-5000);
  const [lastTimeAgo, setLastTimeAgo] = useState<string>('2 MOINS AGO');
  const [progressPercent, setProgressPercent] = useState<number>(36);

  // Selected card on shelf
  const [selectedCard, setSelectedCard] = useState<{
    card: PrizeCardSpec;
    bay: number;
    row: number;
  } | null>(null);

  // Active Redemption Modal state
  const [redeemModal, setRedeemModal] = useState<{
    card: PrizeCardSpec | null;
    bayNumber: number;
    rowNumber: number;
    mode: 'SINGLE' | 'BUNDLE_10' | 'QUICK';
    rowCards: PrizeCardSpec[];
  } | null>(null);

  // System Drawer Modal ('VAULT' | 'TOPUP' | 'LOGS' | null)
  const [systemModal, setSystemModal] = useState<'VAULT' | 'TOPUP' | 'LOGS' | null>(null);

  // Redeemed items vault
  const [redeemedItems, setRedeemedItems] = useState<RedeemedItem[]>([]);
  const [redeemedCardIds, setRedeemedCardIds] = useState<Set<string>>(new Set());

  // Transaction telemetry history (initialized with the exact -5,000 2 MOINS AGO from screenshot)
  const [logs, setLogs] = useState<TelemetryLog[]>([
    {
      id: 'init-1',
      delta: -5000,
      label: 'ROW 01 FULL SET BUNDLE // REDEEM COMPLETE',
      timeAgo: '2 MOINS AGO',
    },
    {
      id: 'init-2',
      delta: 20000,
      label: 'YAMATO ARCADE CARD SYNC // INITIAL CHARGE',
      timeAgo: '14 MOINS AGO',
    },
  ]);

  // Sound mute toggle
  const [isMuted, setIsMuted] = useState<boolean>(false);

  // Toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3200);
  };

  // Selecting top navigation tabs
  const handleSelectTab = (tab: NavTabId) => {
    setActiveTab(tab);
    if (tab === 'BOISITIES') {
      setSystemModal('VAULT');
    } else if (tab === 'TEEES') {
      setSystemModal('TOPUP');
    } else if (tab === 'GGINS') {
      setSystemModal('LOGS');
    }
  };

  // Clicking a collectible card on any shelf
  const handleSelectCard = (card: PrizeCardSpec, bayNumber: number, rowNumber: number) => {
    setSelectedCard({ card, bay: bayNumber, row: rowNumber });
    const rowCards = getShelfRowCards(bayNumber, rowNumber);
    setRedeemModal({
      card,
      bayNumber,
      rowNumber,
      mode: 'SINGLE',
      rowCards,
    });
  };

  // Clicking one of the 3 stacked REDEEM buttons on the right of a shelf row
  const handleRedeemShelfAction = (
    bayNumber: number,
    rowNumber: number,
    mode: 'SINGLE' | 'BUNDLE_10' | 'QUICK',
    cards: PrizeCardSpec[]
  ) => {
    // If user already highlighted a card in this bay & row, use it for SINGLE/QUICK
    const targetCard =
      selectedCard && selectedCard.bay === bayNumber && selectedCard.row === rowNumber
        ? selectedCard.card
        : cards[0];

    setRedeemModal({
      card: targetCard,
      bayNumber,
      rowNumber,
      mode,
      rowCards: cards,
    });
  };

  // Clicking the main pink "REDEM" button in the top console
  const handleClickMainRedem = () => {
    const defaultRowCards = getShelfRowCards(1, 1);
    const activeCard = selectedCard ? selectedCard.card : defaultRowCards[0];
    setRedeemModal({
      card: activeCard,
      bayNumber: selectedCard?.bay ?? 1,
      rowNumber: selectedCard?.row ?? 1,
      mode: selectedCard ? 'SINGLE' : 'BUNDLE_10',
      rowCards: defaultRowCards,
    });
  };

  // Confirming redemption inside modal
  const handleConfirmRedeem = (
    items: PrizeCardSpec[],
    totalCost: number,
    bay: number,
    row: number
  ) => {
    setPointsBalance((prev) => Math.max(0, prev - totalCost));
    setLastDelta(-totalCost);
    setLastTimeAgo('JUST NOW');
    setProgressPercent((prev) => Math.min(100, Math.max(24, prev + 14)));

    const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newRedeemed: RedeemedItem[] = items.map((prize, idx) => ({
      uid: `redeem-${Date.now()}-${idx}`,
      prize,
      redeemedAt: nowStr,
      bayId: bay,
      rowId: row,
      pointsSpent: Math.round(totalCost / items.length),
    }));

    const previousRank = getCurrentStation(redeemedItems.length).rank;
    const nextCount = redeemedItems.length + newRedeemed.length;
    const nextRankStation = getCurrentStation(nextCount);

    setRedeemedItems((prev) => [...newRedeemed, ...prev]);

    setRedeemedCardIds((prev) => {
      const next = new Set(prev);
      items.forEach((it) => next.add(it.id));
      return next;
    });

    setLogs((prev) => [
      {
        id: `log-${Date.now()}`,
        delta: -totalCost,
        label:
          items.length > 1
            ? `BAY 0${bay} ROW 0${row} BUNDLE (${items.length}X)`
            : `REDEEMED: ${items[0].title}`,
        timeAgo: 'JUST NOW',
      },
      ...prev,
    ]);

    if (nextRankStation.rank > previousRank) {
      triggerToast(`RANK UP! ${nextRankStation.rankName} — ${nextRankStation.city} UNLOCKED`);
    } else {
      triggerToast(
        `REDEEM COMPLETE! ${
          items.length > 1 ? `${items.length} PRIZES` : items[0].title
        } (-${totalCost.toLocaleString()} PTS)`
      );
    }
  };

  // Adding coins from Top-up modal
  const handleAddCoins = (amount: number, label: string) => {
    setPointsBalance((prev) => prev + amount);
    setLastDelta(amount);
    setLastTimeAgo('JUST NOW');
    setLogs((prev) => [
      {
        id: `log-${Date.now()}`,
        delta: amount,
        label,
        timeAgo: 'JUST NOW',
      },
      ...prev,
    ]);
    triggerToast(`+${amount.toLocaleString()} PTS CREDITED TO TERMINAL!`);
    setSystemModal(null);
  };

  const toggleMute = () => {
    const next = !isMuted;
    setIsMuted(next);
    arcadeSound.muted = next;
  };

  return (
    <div className="min-h-screen w-full bg-[#020406] text-[#d6f8ff] flex flex-col justify-between relative overflow-x-hidden">
      {/* Subtle Top Ambient Red Glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed top-0 left-1/2 -translate-x-1/2 w-[960px] h-[260px] bg-radial from-[#e30613]/15 via-transparent to-transparent blur-3xl z-0"
      />

      {/* Live Toast Notification Banner with #e30613 Border */}
      {toastMessage && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full bg-[#170305]/95 border border-[#e30613] text-xs font-mono font-bold text-[#ffccd0] shadow-[0_0_15px_rgba(227,6,19,0.55),0_8px_20px_rgba(0,0,0,0.6)] flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#e30613]" />
          {toastMessage}
        </div>
      )}

      {/* Floating Quick-Access Arcade Utility Pill (Bottom-Right) with #e30613 Border & Glow */}
      <div className="fixed bottom-4 right-4 z-40 flex items-center gap-1.5 bg-[#120204]/95 border border-[#e30613] rounded-full px-3.5 py-2 shadow-[0_0_14px_rgba(227,6,19,0.45),0_8px_20px_rgba(0,0,0,0.7)] backdrop-blur-md">
        <button
          type="button"
          onClick={() => {
            arcadeSound.playClick();
            setSystemModal('TOPUP');
          }}
          className="flex items-center gap-1.5 text-xs font-mono text-[#ff8a93] hover:text-white px-2.5 py-0.5 rounded-full hover:bg-[#290306] transition-colors cursor-pointer"
          title="Insert Arcade Coins / Top-Up Points"
        >
          <Coins className="w-4 h-4 text-[#ffd166] animate-pulse" />
          <span className="animate-cyan-text-pulse">{pointsBalance.toLocaleString()} PTS</span>
        </button>

        <span className="w-[1px] h-4 bg-[#e30613]/60" />

        <button
          type="button"
          onClick={() => {
            arcadeSound.playClick();
            setSystemModal('VAULT');
          }}
          className="flex items-center gap-1.5 text-xs font-mono text-[#ffb0b6] hover:text-white px-2.5 py-0.5 rounded-full hover:bg-[#290306] transition-colors cursor-pointer"
          title="View Redeemed Prizes Vault"
        >
          <Gift className="w-4 h-4 text-[#e30613] animate-bounce" />
          <span>VAULT ({redeemedItems.length})</span>
        </button>

        <span className="w-[1px] h-4 bg-[#e30613]/60" />

        <a
          href="#tokaido-map"
          onClick={() => arcadeSound.playClick()}
          className="flex items-center gap-1.5 text-xs font-mono text-[#ff8a93] hover:text-white px-2.5 py-0.5 rounded-full hover:bg-[#290306] transition-colors"
          title="Open Tokaido Rank Journey Map"
        >
          <Map className="w-4 h-4 text-[#e30613]" />
          <span>MAP</span>
        </a>

        <span className="w-[1px] h-4 bg-[#e30613]/60" />

        <button
          type="button"
          onClick={toggleMute}
          aria-label={isMuted ? 'Unmute Arcade SFX' : 'Mute Arcade SFX'}
          title={isMuted ? 'Unmute Arcade SFX' : 'Mute Arcade SFX'}
          className="p-1 text-[#ff8a93] hover:text-white cursor-pointer"
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>
      </div>

      {/* MAIN 3-FRAME STACK MATCHING REFERENCE DESIGN */}
      <main className="relative z-10 w-full max-w-[1680px] mx-auto px-3 sm:px-6 pt-2 sm:pt-3 pb-8 space-y-5 sm:space-y-7">
        {/* FRAME 1: TOP HERO & POINTS TELEMETRY CONSOLE */}
        <TopHeroConsole
          activeTab={activeTab}
          onSelectTab={handleSelectTab}
          pointsBalance={pointsBalance}
          lastDelta={lastDelta}
          lastTimeAgo={lastTimeAgo}
          progressPercent={progressPercent}
          redeemedCount={redeemedItems.length}
          onClickMainRedem={handleClickMainRedem}
          onOpenVault={() => setSystemModal('VAULT')}
        />

        {/* TOKAIDO RANK JOURNEY MAP */}
        <div id="tokaido-map">
          <JapanJourneyMap prizeCount={redeemedItems.length} />
        </div>

        {/* FRAME 2: MIDDLE PRIZE REDEMPTION BAY 01 (Cool Teal Shelf Ambiance) */}
        <div id="prize-bays">
          <PrizeRedemptionBay
            bayNumber={1}
            warmAmbiance={false}
            selectedCardId={selectedCard?.card.id ?? null}
            redeemedCardIds={redeemedCardIds}
            onSelectCard={handleSelectCard}
            onRedeemShelfAction={handleRedeemShelfAction}
          />
        </div>

        {/* FRAME 3: BOTTOM PRIZE REDEMPTION BAY 02 (Warm Bronze/Amber Right-Edge Shelf Ambiance) */}
        <PrizeRedemptionBay
          bayNumber={2}
          warmAmbiance={true}
          selectedCardId={selectedCard?.card.id ?? null}
          redeemedCardIds={redeemedCardIds}
          onSelectCard={handleSelectCard}
          onRedeemShelfAction={handleRedeemShelfAction}
        />
      </main>

      {/* FOOTER BAR MATCHING REFERENCE DESIGN */}
      <footer className="relative z-10 w-full max-w-[1640px] mx-auto px-4 sm:px-6 pb-8 pt-1">
        <div className="h-[1.5px] w-full neon-line-red rounded-full mb-3.5" />
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs sm:text-[13px] text-[#8ab4c4] tracking-[0.03em]">
          <div>© 2026 YAMATO Urban Play. All rights reserved.</div>
          <div className="flex flex-wrap items-center justify-center gap-1.5">
            <a
              href="#privacy"
              onClick={(e) => {
                e.preventDefault();
                setSystemModal('LOGS');
              }}
              className="hover:text-[#a8d8e6] transition-colors"
            >
              Privacy Policy
            </a>
            <a
              href="#cookies"
              onClick={(e) => {
                e.preventDefault();
                setSystemModal('LOGS');
              }}
              className="hover:text-[#a8d8e6] transition-colors"
            >
              Cookies Privacy Policy
            </a>
            <span>·</span>
            <a
              href="#terms"
              onClick={(e) => {
                e.preventDefault();
                setSystemModal('TOPUP');
              }}
              className="hover:text-[#a8d8e6] transition-colors"
            >
              Terms of Use
            </a>
            <span>·</span>
            <a
              href="#gdpr"
              onClick={(e) => {
                e.preventDefault();
                setSystemModal('VAULT');
              }}
              className="hover:text-[#a8d8e6] transition-colors"
            >
              GDPR
            </a>
          </div>
        </div>
      </footer>

      {/* PRIZE INSPECTION & REDEMPTION MODAL */}
      {redeemModal && (
        <PrizeRedeemModal
          card={redeemModal.card}
          bayNumber={redeemModal.bayNumber}
          rowNumber={redeemModal.rowNumber}
          mode={redeemModal.mode}
          rowCards={redeemModal.rowCards}
          pointsBalance={pointsBalance}
          onClose={() => setRedeemModal(null)}
          onConfirmRedeem={handleConfirmRedeem}
          onOpenTopUp={() => setSystemModal('TOPUP')}
        />
      )}

      {/* VAULT / COIN TOP-UP / TELEMETRY LOG MODAL */}
      <SystemDrawerModal
        mode={systemModal}
        pointsBalance={pointsBalance}
        redeemedItems={redeemedItems}
        logs={logs}
        onClose={() => {
          setSystemModal(null);
          setActiveTab('RIME');
        }}
        onAddCoins={handleAddCoins}
      />
    </div>
  );
}

export default App;
