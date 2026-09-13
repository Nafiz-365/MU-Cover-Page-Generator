import React, { useState, useEffect, useRef } from 'react';
import CoverPagePreview from './CoverPagePreview';
import { useCoverPage } from '../../context/CoverPageContext';
import { ZoomIn, ZoomOut, RotateCcw, FileDown, ImageDown, Edit3, Loader2, Maximize2 } from 'lucide-react';

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

  // Measure available container width on mount, resize, and when mobileTab changes
  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current && containerRef.current.clientWidth > 0) {
        setContainerWidth(containerRef.current.clientWidth);
      }
    };

    // Immediate and next-tick measure to account for display transitions
    updateWidth();
    const timeout = setTimeout(updateWidth, 50);
    window.addEventListener('resize', updateWidth);

    return () => {
      clearTimeout(timeout);
      window.removeEventListener('resize', updateWidth);
    };
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
        mobileTab === 'form' ? 'hidden lg:flex' : 'flex'
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
        className="w-full flex justify-center items-start overflow-x-auto overflow-y-visible py-2 pb-24 lg:pb-8"
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

      {/* Mobile / Tablet Floating Action Bar (Pinned to bottom on mobile preview) */}
      <div
        className="lg:hidden sticky bottom-4 z-30 w-full max-w-md mt-4 px-3 py-2.5 rounded-2xl backdrop-blur-xl shadow-2xl flex items-center gap-2"
        style={{
          backgroundColor: 'var(--card-bg)',
          borderColor: 'var(--card-border)',
          borderWidth: '1px',
          borderStyle: 'solid',
        }}
      >
        <button
          type="button"
          onClick={() => setMobileTab('form')}
          className="px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer shrink-0"
          style={{
            backgroundColor: 'var(--btn-secondary-bg)',
            color: 'var(--card-text)',
            borderWidth: '1px',
            borderStyle: 'solid',
            borderColor: 'var(--card-border)',
          }}
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span>Form</span>
        </button>

        <button
          type="button"
          onClick={handleGeneratePdf}
          disabled={generatingPdf}
          className="flex-1 py-2.5 px-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
        >
          {generatingPdf ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Generating...</span>
            </>
          ) : (
            <>
              <FileDown className="w-3.5 h-3.5" />
              <span>PDF</span>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={handleSaveImage}
          disabled={savingImage}
          className="flex-1 py-2.5 px-2 font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          style={{
            backgroundColor: 'var(--btn-secondary-bg)',
            color: 'var(--btn-secondary-text)',
            borderWidth: '1px',
            borderStyle: 'solid',
            borderColor: 'var(--btn-secondary-border)',
          }}
        >
          {savingImage ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Saving...</span>
            </>
          ) : (
            <>
              <ImageDown className="w-3.5 h-3.5" />
              <span>Image</span>
            </>
          )}
        </button>
      </div>
    </section>
  );
}
