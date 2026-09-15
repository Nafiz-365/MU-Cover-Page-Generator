import React, { useState, useEffect, useRef, useCallback } from 'react';
import { CoverPageProvider } from './context/CoverPageContext';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Sidebar from './components/form/Sidebar';
import PreviewArea from './components/preview/PreviewArea';
import MobileTabBar from './components/layout/MobileTabBar';
import Toast from './components/ui/Toast';
import { GripVertical } from 'lucide-react';

const DEFAULT_SIDEBAR_PERCENT = 40;
const MIN_SIDEBAR_PERCENT = 25;
const MAX_SIDEBAR_PERCENT = 55;

export default function App() {
  const mainRef = useRef(null);
  const [sidebarPercent, setSidebarPercent] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('mu_sidebar_percent');
      if (saved) {
        const parsed = parseFloat(saved);
        if (!isNaN(parsed) && parsed >= MIN_SIDEBAR_PERCENT && parsed <= MAX_SIDEBAR_PERCENT) {
          return parsed;
        }
      }
    }
    return DEFAULT_SIDEBAR_PERCENT;
  });

  const [isDragging, setIsDragging] = useState(false);

  // Dragging logic
  const handleStartDragging = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleResetWidth = useCallback(() => {
    setSidebarPercent(DEFAULT_SIDEBAR_PERCENT);
    localStorage.setItem('mu_sidebar_percent', String(DEFAULT_SIDEBAR_PERCENT));
  }, []);

  // Keyboard navigation for separator accessibility
  const handleKeyDown = useCallback(
    (e) => {
      let delta = 0;
      if (e.key === 'ArrowLeft') delta = -2;
      else if (e.key === 'ArrowRight') delta = 2;
      else if (e.key === 'Home') delta = -100;
      else if (e.key === 'End') delta = 100;
      else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleResetWidth();
        return;
      }

      if (delta !== 0) {
        e.preventDefault();
        setSidebarPercent((prev) => {
          const next = Math.round(Math.max(MIN_SIDEBAR_PERCENT, Math.min(MAX_SIDEBAR_PERCENT, prev + delta)));
          localStorage.setItem('mu_sidebar_percent', String(next));
          return next;
        });
      }
    },
    [handleResetWidth]
  );

  useEffect(() => {
    if (!isDragging) return;

    // Prevent text selection while dragging
    document.body.style.userSelect = 'none';
    document.body.style.cursor = 'col-resize';

    const onMove = (clientX) => {
      if (!mainRef.current) return;
      const rect = mainRef.current.getBoundingClientRect();
      const rawWidth = clientX - rect.left;
      const rawPercent = (rawWidth / rect.width) * 100;

      // Ensure min 320px in pixels and min 25%, max 55%
      const minPct = Math.max(MIN_SIDEBAR_PERCENT, (320 / rect.width) * 100);
      const maxPct = Math.min(MAX_SIDEBAR_PERCENT, ((rect.width - 380) / rect.width) * 100);
      const clamped = Number(Math.max(minPct, Math.min(rawPercent, maxPct)).toFixed(1));

      setSidebarPercent(clamped);
      localStorage.setItem('mu_sidebar_percent', String(clamped));
    };

    const handleMouseMove = (e) => onMove(e.clientX);
    const handleTouchMove = (e) => {
      if (e.touches?.[0]) onMove(e.touches[0].clientX);
    };

    const handleStop = () => {
      setIsDragging(false);
      document.body.style.userSelect = '';
      document.body.style.cursor = '';
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleStop);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleStop);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleStop);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleStop);
      document.body.style.userSelect = '';
      document.body.style.cursor = '';
    };
  }, [isDragging]);

  return (
    <CoverPageProvider>
      <div className="min-h-screen flex flex-col pt-16 sm:pt-20 lg:pt-32 pb-24 lg:pb-12 px-3.5 sm:px-6 lg:px-8">
        <Header />

        <MobileTabBar />

        <main
          ref={mainRef}
          className="flex-1 flex flex-col lg:flex-row gap-4 lg:gap-3 max-w-7xl 2xl:max-w-[1700px] mx-auto w-full items-start justify-center relative"
        >
          <Sidebar sidebarPercent={sidebarPercent} isDragging={isDragging} />

          {/* Desktop Resizable Splitter Handle */}
          <div
            role="separator"
            aria-orientation="vertical"
            aria-valuenow={sidebarPercent}
            aria-valuemin={MIN_SIDEBAR_PERCENT}
            aria-valuemax={MAX_SIDEBAR_PERCENT}
            aria-label="Drag to resize form and preview sections (Default: Form 40%, Preview 60%). Double click or press Enter to reset."
            tabIndex={0}
            onMouseDown={handleStartDragging}
            onTouchStart={handleStartDragging}
            onDoubleClick={handleResetWidth}
            onKeyDown={handleKeyDown}
            title="Drag to resize (Default: Form 40% / Preview 60%) | Double-click to reset"
            className={`hidden lg:flex flex-col items-center justify-center w-5 self-stretch cursor-col-resize select-none relative group z-30 shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-full transition-all py-12 ${
              isDragging ? 'opacity-100' : 'opacity-70 hover:opacity-100'
            }`}
          >
            {/* Visual Guide Bar */}
            <div
              className={`h-full rounded-full transition-all duration-150 ${
                isDragging
                  ? 'w-1.5 bg-blue-500 shadow-lg shadow-blue-500/50'
                  : 'w-1 bg-slate-300/80 dark:bg-slate-700/80 group-hover:bg-blue-500 group-hover:w-1.5'
              }`}
            />

            {/* Central Floating Grip Pill */}
            <div
              className={`absolute top-1/2 -translate-y-1/2 flex items-center justify-center w-6 h-10 rounded-full border shadow-md transition-all duration-150 pointer-events-none ${
                isDragging
                  ? 'bg-blue-600 text-white border-blue-400 scale-110 shadow-blue-500/30 ring-4 ring-blue-500/20'
                  : 'bg-white dark:bg-slate-800 text-slate-400 dark:text-slate-400 border-slate-200 dark:border-slate-700 group-hover:text-blue-500 group-hover:border-blue-400 group-hover:scale-105'
              }`}
            >
              <GripVertical className="w-3.5 h-3.5" />
            </div>
          </div>

          <PreviewArea />
        </main>

        <Footer />
        <Toast />
      </div>
    </CoverPageProvider>
  );
}
