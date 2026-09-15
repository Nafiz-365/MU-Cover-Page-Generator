import React, { useState, useEffect, useRef } from 'react';
import CoverPagePreview from './CoverPagePreview';
import { useCoverPage } from '../../context/CoverPageContext';
import { ZoomIn, ZoomOut, FileDown, ImageDown, Loader2, Maximize2, Download, X } from 'lucide-react';

export default function PreviewArea() {
  const {
    mobileTab,
    setMobileTab,
    generatingPdf,
    savingImage,
    handleGeneratePdf,
    handleSaveImage,
  } = useCoverPage();

  const containerRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(800);
  const [userZoom, setUserZoom] = useState(1);
  const [fabOpen, setFabOpen] = useState(false);

  // Measure available container width dynamically on resize & layout split drag
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const update = (w) => {
      if (w > 0) setContainerWidth(w);
    };

    update(el.clientWidth);

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentRect && entry.contentRect.width > 0) {
          update(entry.contentRect.width);
        }
      }
    });

    observer.observe(el);
    const handleWinResize = () => update(el.clientWidth);
    window.addEventListener('resize', handleWinResize);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', handleWinResize);
    };
  }, [mobileTab]);

  // Close FAB when switching tabs
  useEffect(() => {
    setFabOpen(false);
  }, [mobileTab]);

  // Base A4 dimensions in px at standard 96 DPI: 210mm = 794px, 297mm = 1123px
  const A4_WIDTH = 794;
  const A4_HEIGHT = 1123;

  // Calculate auto-fit scale so the A4 sheet fits horizontally with comfortable padding
  // Available width subtracts comfortable screen padding
  const availableW = Math.max(containerWidth - 28, 260);
  const autoFitScale = Math.min(1.0, Number((availableW / A4_WIDTH).toFixed(3)));

  // Effective scale combines auto-fit and user manual zoom
  const effectiveScale = Number((autoFitScale * userZoom).toFixed(3));
  const renderedWidth = Math.round(A4_WIDTH * effectiveScale);
  const renderedHeight = Math.round(A4_HEIGHT * effectiveScale);

  const handleZoomIn = () => setUserZoom((prev) => Math.min(prev + 0.15, 2.0));
  const handleZoomOut = () => setUserZoom((prev) => Math.max(prev - 0.15, 0.5));
  const handleResetZoom = () => setUserZoom(1);

  return (
    <section
      ref={containerRef}
      className={`flex-1 flex flex-col items-center w-full min-w-0 transition-all duration-300 ${
        mobileTab === 'form'
          ? 'max-lg:fixed max-lg:-left-[9999px] max-lg:top-0 max-lg:pointer-events-none max-lg:opacity-0 lg:flex'
          : 'flex'
      }`}
    >
      {/* Zoom Toolbar: Clean, Glassmorphism, accessible across all devices */}
      <div
        className="flex items-center justify-between sm:justify-center gap-2 sm:gap-3 mb-3 px-3.5 py-1.5 rounded-xl backdrop-blur-md shadow-xs text-xs transition-all w-full sm:w-auto"
        style={{
          backgroundColor: 'var(--toolbar-bg)',
          borderColor: 'var(--toolbar-border)',
          color: 'var(--toolbar-text)',
          borderWidth: '1px',
          borderStyle: 'solid',
        }}
      >
        <span className="font-semibold text-[11px] sm:text-xs" style={{ color: 'var(--subtext)' }}>
          Zoom: {Math.round(effectiveScale * 100)}%
        </span>

        <div className="h-4 w-px" style={{ backgroundColor: 'var(--toolbar-border)' }} />

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={handleZoomOut}
            title="Zoom Out"
            className="p-1.5 hover:bg-slate-200/50 dark:hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
          >
            <ZoomOut className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
          <button
            type="button"
            onClick={handleResetZoom}
            title="Auto Fit (Reset)"
            className="px-2 py-1 hover:bg-slate-200/50 dark:hover:bg-white/10 rounded-lg text-[10px] font-medium transition-colors cursor-pointer flex items-center gap-1"
          >
            <Maximize2 className="w-3 h-3" />
            <span>Fit</span>
          </button>
          <button
            type="button"
            onClick={() => setUserZoom(Number((1 / autoFitScale).toFixed(2)))}
            title="Actual Size (100%)"
            className="px-2 py-1 hover:bg-slate-200/50 dark:hover:bg-white/10 rounded-lg text-[10px] font-medium transition-colors cursor-pointer hidden sm:flex items-center"
          >
            <span>100%</span>
          </button>
          <button
            type="button"
            onClick={handleZoomIn}
            title="Zoom In"
            className="p-1.5 hover:bg-slate-200/50 dark:hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
          >
            <ZoomIn className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        </div>
      </div>

      {/* Dynamic Scaled A4 Sheet Container */}
      <div
        className="w-full flex justify-center items-start overflow-x-auto overflow-y-visible py-2 pb-28 lg:pb-8"
        style={{
          minHeight: `${renderedHeight + 20}px`,
        }}
      >
        <div
          className="preview-scale-wrapper transition-all duration-200 relative"
          style={{
            width: `${renderedWidth}px`,
            height: `${renderedHeight}px`,
          }}
        >
          <div
            style={{
              width: `${A4_WIDTH}px`,
              height: `${A4_HEIGHT}px`,
              transform: `scale(${effectiveScale})`,
              transformOrigin: 'top left',
              position: 'absolute',
              top: 0,
              left: 0,
            }}
          >
            <CoverPagePreview />
          </div>
        </div>
      </div>

      {/* Mobile / Tablet Collapsible FAB (Floating Action Button) */}
      <div className="lg:hidden fixed bottom-20 right-4 z-30 flex flex-col items-end gap-2.5">
        {/* Backdrop overlay to dismiss when open */}
        {fabOpen && (
          <div
            className="fixed inset-0 z-[-1]"
            onClick={() => setFabOpen(false)}
            aria-hidden="true"
          />
        )}

        {/* Expanded Action Options */}
        <div
          className={`flex flex-col gap-2 transition-all duration-300 origin-bottom ${
            fabOpen
              ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto'
              : 'opacity-0 scale-75 translate-y-3 pointer-events-none'
          }`}
        >
          {/* Download PDF Button */}
          <button
            type="button"
            onClick={() => {
              handleGeneratePdf();
              setFabOpen(false);
            }}
            disabled={generatingPdf || savingImage}
            className="flex items-center gap-2.5 h-11 pl-4 pr-5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold text-xs rounded-full shadow-lg shadow-blue-600/30 transition-all cursor-pointer active:scale-95 whitespace-nowrap"
          >
            {generatingPdf ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <FileDown className="w-4 h-4" />
            )}
            <span>{generatingPdf ? 'Generating...' : 'Download PDF'}</span>
          </button>

          {/* Save as Image Button */}
          <button
            type="button"
            onClick={() => {
              handleSaveImage();
              setFabOpen(false);
            }}
            disabled={generatingPdf || savingImage}
            className="flex items-center gap-2.5 h-11 pl-4 pr-5 font-bold text-xs rounded-full shadow-lg transition-all cursor-pointer active:scale-95 whitespace-nowrap backdrop-blur-xl border border-white/15 ring-1 ring-black/10 dark:ring-white/10"
            style={{
              backgroundColor: 'var(--card-bg)',
              color: 'var(--card-text)',
            }}
          >
            {savingImage ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <ImageDown className="w-4 h-4" />
            )}
            <span>{savingImage ? 'Saving...' : 'Save as Image'}</span>
          </button>
        </div>

        {/* Main FAB Toggle Button */}
        <button
          type="button"
          onClick={() => setFabOpen((prev) => !prev)}
          aria-label={fabOpen ? 'Close download menu' : 'Open download menu'}
          aria-expanded={fabOpen}
          className={`w-14 h-14 rounded-full flex items-center justify-center shadow-xl transition-all duration-300 cursor-pointer active:scale-90 ${
            fabOpen
              ? 'bg-slate-700 dark:bg-slate-600 text-white rotate-0 ring-4 ring-slate-700/20 dark:ring-slate-500/20'
              : 'bg-blue-600 hover:bg-blue-500 text-white ring-4 ring-blue-600/25 hover:ring-blue-500/30'
          }`}
        >
          <div className={`transition-transform duration-300 ${fabOpen ? 'rotate-180' : 'rotate-0'}`}>
            {fabOpen ? <X className="w-5 h-5" /> : <Download className="w-5 h-5" />}
          </div>
        </button>
      </div>
    </section>
  );
}
