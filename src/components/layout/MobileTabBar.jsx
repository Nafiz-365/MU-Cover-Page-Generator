import React from 'react';
import { useCoverPage } from '../../context/CoverPageContext';
import { Edit3, Eye } from 'lucide-react';

export default function MobileTabBar() {
  const { mobileTab, setMobileTab } = useCoverPage();

  return (
    <div className="lg:hidden w-full max-w-md mx-auto mb-4 px-1">
      <div
        className="flex items-center p-1 rounded-2xl backdrop-blur-xl shadow-md transition-all duration-300"
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
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
            mobileTab === 'form'
              ? 'bg-blue-600 text-white shadow-md'
              : 'opacity-70 hover:opacity-100'
          }`}
          style={{
            color: mobileTab === 'form' ? '#ffffff' : 'var(--card-text)',
          }}
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span>Form Editor</span>
        </button>

        <button
          type="button"
          onClick={() => setMobileTab('preview')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
            mobileTab === 'preview'
              ? 'bg-blue-600 text-white shadow-md'
              : 'opacity-70 hover:opacity-100'
          }`}
          style={{
            color: mobileTab === 'preview' ? '#ffffff' : 'var(--card-text)',
          }}
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Live Preview</span>
        </button>
      </div>
    </div>
  );
}
