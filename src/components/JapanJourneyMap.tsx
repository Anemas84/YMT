import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { ArrowRight, Check, LockKeyhole, MapPin, Star, X } from 'lucide-react';
import { arcadeSound } from '../data/prizes';
import {
  TOKAIDO_STATIONS,
  type JourneyStation,
  getCurrentStation,
  getNextStation,
} from '../data/journey';

interface JapanJourneyMapProps {
  prizeCount: number;
}

interface Point {
  x: number;
  y: number;
}

// The portrait board uses a wide serpentine trail so every stop has room to be tapped.
const MOBILE_POINTS: Record<string, Point> = {
  fukuoka: { x: 27, y: 89 },
  hiroshima: { x: 68, y: 79 },
  osaka: { x: 27, y: 69 },
  kyoto: { x: 69, y: 59 },
  nagoya: { x: 27, y: 49 },
  fuji: { x: 69, y: 39 },
  tokyo: { x: 27, y: 29 },
  sendai: { x: 69, y: 19 },
  sapporo: { x: 28, y: 9 },
};

const desktopPoints = TOKAIDO_STATIONS.map(({ x, y }) => ({ x, y }));
const mobilePoints = TOKAIDO_STATIONS.map((station) => MOBILE_POINTS[station.id]);

function makeTrail(points: Point[]): string {
  if (!points.length) return '';

  return points.slice(1).reduce((path, point, index) => {
    const previous = points[index];
    const middleY = (previous.y + point.y) / 2;
    return `${path} C ${previous.x} ${middleY}, ${point.x} ${middleY}, ${point.x} ${point.y}`;
  }, `M ${points[0].x} ${points[0].y}`);
}

export const JapanJourneyMap = ({ prizeCount }: JapanJourneyMapProps) => {
  const current = getCurrentStation(prizeCount);
  const next = getNextStation(prizeCount);
  const currentIndex = current.rank - 1;
  const [selectedStation, setSelectedStation] = useState<JourneyStation | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const stageRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const browseRef = useRef<HTMLAnchorElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const segmentProgress = next
    ? Math.min(
        100,
        ((prizeCount - current.requiredPrizes) /
          (next.requiredPrizes - current.requiredPrizes)) *
          100,
      )
    : 100;
  const prizesToNext = next ? Math.max(0, next.requiredPrizes - prizeCount) : 0;

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage || !('IntersectionObserver' in window)) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12 },
    );
    observer.observe(stage);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!selectedStation) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeStation();

      if (event.key === 'Tab') {
        if (event.shiftKey && document.activeElement === closeRef.current) {
          event.preventDefault();
          browseRef.current?.focus();
        } else if (!event.shiftKey && document.activeElement === browseRef.current) {
          event.preventDefault();
          closeRef.current?.focus();
        }
      }
    };
    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [selectedStation]);

  function openStation(station: JourneyStation, trigger: HTMLButtonElement) {
    triggerRef.current = trigger;
    arcadeSound.playClick();
    setSelectedStation(station);
  }

  function closeStation() {
    setSelectedStation(null);
    requestAnimationFrame(() => triggerRef.current?.focus());
  }

  function renderTrail(points: Point[], className: string) {
    const fullTrail = makeTrail(points);
    const completedTrail = makeTrail(points.slice(0, currentIndex + 1));
    const nextSegment = next ? makeTrail(points.slice(currentIndex, currentIndex + 2)) : '';

    return (
      <svg
        className={`journey-trail absolute inset-0 w-full h-full pointer-events-none ${className}`}
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path d={fullTrail} className="journey-trail-shadow" />
        <path d={fullTrail} className="journey-trail-base" />
        <path d={fullTrail} className="journey-trail-stitches" />
        {currentIndex > 0 && (
          <path d={completedTrail} className="journey-trail-completed" pathLength="100" />
        )}
        {nextSegment && segmentProgress > 0 && (
          <path
            d={nextSegment}
            className="journey-trail-progress"
            pathLength="100"
            strokeDasharray={`${segmentProgress} 100`}
          />
        )}
      </svg>
    );
  }

  const selectedIsUnlocked = selectedStation
    ? prizeCount >= selectedStation.requiredPrizes
    : false;
  const selectedIsCurrent = selectedStation?.id === current.id;
  const selectedIsNext = selectedStation?.id === next?.id;

  return (
    <section aria-labelledby="journey-heading" className="w-full max-w-[1640px] mx-auto">
      <div className="journey-shell relative overflow-hidden rounded-[22px] border-2 border-[#e30613] bg-[#07141b] shadow-[0_0_18px_rgba(227,6,19,0.35)]">
        <header className="relative z-10 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 px-5 sm:px-8 lg:px-11 pt-7 sm:pt-9 pb-6 sm:pb-7">
          <div>
            <p className="font-mono text-[10px] sm:text-xs tracking-[0.24em] text-[#ff8a93] uppercase mb-2">
              YAMATO / LEVEL SELECT
            </p>
            <h2
              id="journey-heading"
              className="text-[27px] sm:text-[38px] lg:text-[44px] leading-[1.05] font-bold tracking-[0.025em] text-[#eefeff]"
            >
              Journey across Japan
            </h2>
            <p className="mt-2 max-w-xl text-sm sm:text-base text-[#a6c8d1] leading-relaxed">
              Redeem prizes, collect your stamps, and travel from Fukuoka to Sapporo.
            </p>
          </div>
          <div className="flex items-baseline gap-3 lg:flex-col lg:items-end lg:gap-0.5 shrink-0">
            <span className="font-mono text-[10px] tracking-[0.18em] text-[#ff8a93] uppercase">
              Your current stop
            </span>
            <span className="text-lg sm:text-2xl font-bold tracking-[0.04em] text-[#ff9ab0]">
              {String(current.rank).padStart(2, '0')} <span className="text-[#7595a0]">/</span> 09
              <span className="ml-3 text-[#f1feff]">{current.city}</span>
            </span>
          </div>
        </header>

        <div
          ref={stageRef}
          className={`journey-map-stage relative overflow-hidden bg-[#071b23] border-y border-[#e30613]/60 ${isVisible ? 'is-visible' : ''}`}
          aria-label="Japan level map with nine selectable stops"
        >
          <picture className="absolute inset-0 block w-full h-full" aria-hidden="true">
            <source media="(min-width: 768px)" srcSet="/images/japan-journey-landscape.png" />
            <img
              src="/images/japan-journey-portrait.png"
              alt=""
              className="journey-map-art w-full h-full object-cover object-center"
            />
          </picture>
          <div className="absolute inset-0 pointer-events-none journey-map-shade" />

          {renderTrail(mobilePoints, 'md:hidden')}
          {renderTrail(desktopPoints, 'hidden md:block')}

          <span className="journey-map-hint absolute top-4 left-4 sm:top-6 sm:left-7 z-10 font-mono text-[10px] sm:text-xs tracking-[0.14em] uppercase text-[#ddf5f6]">
            Tap any stop to explore
          </span>

          {TOKAIDO_STATIONS.map((station, index) => {
            const isCurrent = station.id === current.id;
            const isCleared = station.requiredPrizes < current.requiredPrizes;
            const isNext = station.id === next?.id;
            const point = MOBILE_POINTS[station.id];
            const status = isCurrent
              ? 'current level'
              : isCleared
                ? 'cleared'
                : isNext
                  ? 'next level'
                  : 'locked';

            return (
              <button
                key={station.id}
                type="button"
                onClick={(event) => openStation(station, event.currentTarget)}
                onMouseEnter={() => arcadeSound.playHover()}
                aria-current={isCurrent ? 'step' : undefined}
                aria-label={`Level ${station.rank}, ${station.city}, ${station.rankName}, ${status}${!isCurrent && !isCleared ? `, requires ${station.requiredPrizes} redeemed prizes` : ''}`}
                style={
                  {
                    '--mobile-x': `${point.x}%`,
                    '--mobile-y': `${point.y}%`,
                    '--desktop-x': `${station.x}%`,
                    '--desktop-y': `${station.y}%`,
                    '--level-delay': `${index * 90}ms`,
                  } as CSSProperties
                }
                className={`journey-level-button ${isCurrent ? 'is-current' : ''} ${isCleared ? 'is-cleared' : ''} ${isNext ? 'is-next' : ''} ${!isCurrent && !isCleared && !isNext ? 'is-locked' : ''}`}
              >
                {isCurrent && <span className="journey-you-tag" aria-hidden="true">YOU</span>}
                <span className="journey-level-face" aria-hidden="true">
                  <span className="journey-level-number">
                    {String(station.rank).padStart(2, '0')}
                  </span>
                  {isCleared && (
                    <span className="journey-level-icon journey-level-icon-cleared"><Star size={13} fill="currentColor" /></span>
                  )}
                  {!isCurrent && !isCleared && !isNext && (
                    <span className="journey-level-icon journey-level-icon-locked"><LockKeyhole size={12} /></span>
                  )}
                  {isCurrent && (
                    <span className="journey-level-icon journey-level-icon-current"><MapPin size={13} fill="currentColor" /></span>
                  )}
                </span>
                <span className="journey-level-label" aria-hidden="true">{station.city}</span>
              </button>
            );
          })}

          <div className="journey-map-fade absolute inset-x-0 bottom-0 h-20 pointer-events-none" />
        </div>

        <div className="flex flex-col lg:flex-row lg:items-center gap-5 lg:gap-9 px-5 sm:px-8 lg:px-11 py-6 sm:py-7 border-t border-[#e30613]/70 bg-[#081820]">
          <div className="min-w-0 lg:w-[270px]">
            <span className="block font-mono text-[10px] tracking-[0.18em] text-[#70bfcc] uppercase">
              Current rank
            </span>
            <span className="block text-xl sm:text-2xl font-bold text-[#f1feff] tracking-[0.06em]">
              {current.rankName}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex justify-between gap-4 mb-2 font-mono text-[11px] sm:text-xs uppercase tracking-[0.08em]">
              <span className="text-[#e8fafc]">{next ? `Next: ${next.city}` : 'All stops completed'}</span>
              <span className="text-[#ff9ab0] whitespace-nowrap">
                {next ? `${prizesToNext} prize${prizesToNext === 1 ? '' : 's'} to go` : 'Legend reached'}
              </span>
            </div>
            <div
              className="h-[9px] rounded-full bg-[#19323a] overflow-hidden"
              role="progressbar"
              aria-label={next ? `Progress to ${next.city}` : 'Journey complete'}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.round(segmentProgress)}
            >
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#ff617d] to-[#ffb986] transition-[width] duration-500"
                style={{ width: `${segmentProgress}%` }}
              />
            </div>
          </div>
          <a href="#prize-bays" className="journey-shop-link inline-flex items-center justify-center gap-2 self-start lg:self-auto shrink-0 px-5 py-3 rounded-lg text-sm font-bold tracking-[0.08em] uppercase">
            Browse prizes <ArrowRight size={17} />
          </a>
        </div>
      </div>

      {selectedStation && (
        <div
          className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center bg-[#010608]/80 p-0 sm:p-5 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeStation();
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="journey-dialog-title"
            className="journey-dialog relative w-full max-w-[510px] overflow-hidden rounded-t-[26px] sm:rounded-[24px] border-2 border-[#e30613] bg-[#071821] text-[#edfdff] shadow-[0_0_24px_rgba(227,6,19,0.5),0_24px_70px_rgba(0,0,0,0.65)]"
          >
            <div className="relative h-[152px] sm:h-[180px] overflow-hidden bg-[#0d2932]">
              <img
                src="/images/japan-journey-landscape.png"
                alt=""
                className="absolute inset-0 w-full h-full object-cover object-center opacity-85"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#071821] via-[#071821]/20 to-[#071821]/10" />
              <span className="absolute left-6 bottom-1 text-[72px] sm:text-[90px] leading-none font-bold text-white/90 tracking-[-0.04em] drop-shadow-[0_3px_0_#b33859]">
                {String(selectedStation.rank).padStart(2, '0')}
              </span>
              <button
                ref={closeRef}
                type="button"
                onClick={closeStation}
                aria-label="Close level details"
                className="absolute top-4 right-4 flex h-10 w-10 items-center justify-center rounded-full border border-[#e30613] bg-[#081820]/80 text-white hover:bg-[#e30613] focus-visible:outline-2 focus-visible:outline-white cursor-pointer shadow-[0_0_8px_rgba(227,6,19,0.4)]"
              >
                <X size={19} />
              </button>
            </div>

            <div className="px-6 sm:px-8 pb-7 sm:pb-8 pt-2">
              <div className="flex items-center gap-2 mb-2 font-mono text-[11px] tracking-[0.16em] uppercase text-[#85b9c5]">
                <span>Level {String(selectedStation.rank).padStart(2, '0')} / 09</span>
                <span className="w-1 h-1 rounded-full bg-[#e30613]" />
                <span>{selectedStation.region}</span>
              </div>
              <h3 id="journey-dialog-title" className="text-[32px] sm:text-[40px] leading-none font-bold tracking-[0.04em] text-white">
                {selectedStation.city}
              </h3>
              <p className="mt-2 text-sm font-bold tracking-[0.12em] uppercase text-[#ff9ab0]">
                {selectedStation.rankName} / {selectedStation.title}
              </p>
              <p className="mt-4 text-sm sm:text-base leading-relaxed text-[#b4d1d8]">
                {selectedStation.flavor}
              </p>

              <div className="mt-6 border-t border-[#e30613]/50 pt-5">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-sm font-semibold text-[#e6fafc]">
                    {selectedIsUnlocked ? <Check size={17} className="text-[#73dfd1]" /> : <LockKeyhole size={16} className="text-[#ff9ab0]" />}
                    {selectedIsCurrent
                      ? 'You are here'
                      : selectedIsUnlocked
                        ? 'Station cleared'
                        : selectedIsNext
                          ? 'Your next destination'
                          : 'Station locked'}
                  </div>
                  <span className="font-mono text-xs text-[#96c4cd] whitespace-nowrap">
                    {selectedStation.requiredPrizes === 0
                      ? 'Starting point'
                      : `${Math.min(prizeCount, selectedStation.requiredPrizes)} / ${selectedStation.requiredPrizes} prizes`}
                  </span>
                </div>
                {!selectedIsUnlocked && (
                  <p className="mt-2 text-xs text-[#93b9c2]">
                    Redeem {selectedStation.requiredPrizes - prizeCount} more prize{selectedStation.requiredPrizes - prizeCount === 1 ? '' : 's'} to reach this stop.
                  </p>
                )}
              </div>

              <a
                ref={browseRef}
                href="#prize-bays"
                onClick={(event) => {
                  event.preventDefault();
                  setSelectedStation(null);
                  window.setTimeout(() => {
                    document.getElementById('prize-bays')?.scrollIntoView({
                      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
                        ? 'instant'
                        : 'smooth',
                      block: 'start',
                    });
                  }, 0);
                }}
                className="journey-shop-link mt-6 flex w-full items-center justify-center gap-2 rounded-lg px-5 py-3.5 text-sm font-bold tracking-[0.08em] uppercase"
              >
                Redeem prizes <ArrowRight size={18} />
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};