import React from 'react';
import { useCoverPage } from '../../context/CoverPageContext';
import { Edit3, Eye } from 'lucide-react';

export default function MobileTabBar() {
  const { mobileTab, setMobileTab } = useCoverPage();

  return (
    <div className="lg:hidden fixed bottom-3 sm:bottom-4 left-0 right-0 z-40 px-4 flex justify-center pointer-events-none">
      <nav
        role="tablist"
        aria-label="Mobile Navigation"
        className="pointer-events-auto flex items-center p-1.5 rounded-2xl backdrop-blur-2xl shadow-2xl max-w-xs w-full transition-all duration-300 ring-1 ring-black/10 dark:ring-white/10"
        style={{
          backgroundColor: 'var(--card-bg)',
          borderColor: 'var(--card-border)',
          borderWidth: '1px',
          borderStyle: 'solid',
        }}
      >
        <button
          type="button"
          role="tab"
          aria-selected={mobileTab === 'form'}
          onClick={() => setMobileTab('form')}
          className={`flex-1 h-11 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 ${
            mobileTab === 'form'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
              : 'opacity-70 hover:opacity-100'
          }`}
          style={{
            color: mobileTab === 'form' ? '#ffffff' : 'var(--card-text)',
          }}
        >
          <Edit3 className="w-4 h-4" />
          <span>Form Editor</span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={mobileTab === 'preview'}
          onClick={() => setMobileTab('preview')}
          className={`flex-1 h-11 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 ${
            mobileTab === 'preview'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
              : 'opacity-70 hover:opacity-100'
          }`}
          style={{
            color: mobileTab === 'preview' ? '#ffffff' : 'var(--card-text)',
          }}
        >
          <Eye className="w-4 h-4" />
          <span>Live Preview</span>
        </button>
      </nav>
    </div>
  );
}
