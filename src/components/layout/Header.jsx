import React, { useState, useEffect } from 'react';
import { useCoverPage } from '../../context/CoverPageContext';
import ThemeToggle from '../ui/ThemeToggle';
import { Menu, X, FileText, Layers, RotateCcw, ExternalLink } from 'lucide-react';

export default function Header() {
  const { mode, setMode, resetForm } = useCoverPage();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu on ESC key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
      <>
          <header
              className={`fixed top-2 sm:top-4 left-2.5 sm:left-6 right-2.5 sm:right-6 z-40 rounded-2xl transition-all duration-300 backdrop-blur-xl ${
                  scrolled
                      ? 'py-1.5 sm:py-2 px-3 sm:px-5 shadow-xl'
                      : 'py-2 sm:py-3 px-3 sm:px-6 shadow-glass'
              }`}
              style={{
                  backgroundColor: 'var(--header-bg)',
                  borderColor: 'var(--header-border)',
                  color: 'var(--header-text)',
                  borderWidth: '1px',
                  borderStyle: 'solid',
              }}
          >
              <div className="flex items-center justify-between gap-2 sm:gap-4 max-w-7xl mx-auto">
                  {/* Left: University Logo & Clean Brand Title */}
                  <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                      <img
                          src="/assets/logo.png"
                          alt="Metropolitan University"
                          className="h-7 sm:h-8 object-contain bg-white rounded-lg p-0.5 sm:p-1 shadow-xs border border-slate-200/60 shrink-0"
                      />
                      <h1
                          className="hidden md:block text-sm sm:text-base font-extrabold tracking-tight truncate m-0"
                          style={{ color: 'var(--header-text)' }}
                      >
                          MU Cover Page Generator
                      </h1>
                  </div>

                  {/* Right: Desktop Switcher & Mobile Controls */}
                  <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                      {/* Desktop Mode Switcher */}
                      <nav
                          className="hidden sm:flex items-center p-0.5 sm:p-1 rounded-xl"
                          style={{
                              backgroundColor: 'var(--btn-secondary-bg)',
                              borderColor: 'var(--header-border)',
                              borderWidth: '1px',
                              borderStyle: 'solid',
                          }}
                      >
                          <button
                              type="button"
                              onClick={() => setMode('assignment')}
                              className={`px-3.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                                  mode === 'assignment'
                                      ? 'bg-blue-600 text-white shadow-sm'
                                      : 'hover:opacity-100 opacity-70'
                              }`}
                              style={{
                                  color:
                                      mode === 'assignment'
                                          ? '#ffffff'
                                          : 'var(--header-text)',
                              }}
                              title="Assignment Mode"
                          >
                              ASSIGNMENT
                          </button>

                          <button
                              type="button"
                              onClick={() => setMode('lab')}
                              className={`px-3.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                                  mode === 'lab'
                                      ? 'bg-blue-600 text-white shadow-sm'
                                      : 'hover:opacity-100 opacity-70'
                              }`}
                              style={{
                                  color:
                                      mode === 'lab'
                                          ? '#ffffff'
                                          : 'var(--header-text)',
                              }}
                              title="Lab Report Mode"
                          >
                              LAB REPORT
                          </button>
                      </nav>

                      <div
                          className="hidden sm:block h-5 w-px"
                          style={{ backgroundColor: 'var(--header-border)' }}
                      />

                      {/* Theme Toggle */}
                      <ThemeToggle />

                      {/* GitHub Icon Link (Desktop / Tablet) */}
                      <a
                          href="https://github.com/Nafiz-365/MU-Cover-Page-Generator"
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Nafiz-365 on GitHub"
                          className="hidden sm:inline-flex p-1.5 rounded-xl hover:bg-slate-200/50 dark:hover:bg-white/10 transition-colors cursor-pointer"
                          style={{ color: 'var(--header-text)' }}
                      >
                          <svg
                              viewBox="0 0 496 512"
                              className="w-4 h-4 fill-current"
                          >
                              <path d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3.3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3zm44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9.3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8z" />
                          </svg>
                      </a>

                      {/* Mobile Hamburger Button */}
                      <button
                          type="button"
                          onClick={() => setMenuOpen(!menuOpen)}
                          className="sm:hidden p-1.5 rounded-xl transition-all cursor-pointer flex items-center justify-center"
                          style={{
                              backgroundColor: menuOpen
                                  ? 'var(--btn-secondary-bg)'
                                  : 'transparent',
                              color: 'var(--header-text)',
                              borderColor: 'var(--header-border)',
                              borderWidth: '1px',
                              borderStyle: 'solid',
                          }}
                          aria-label="Toggle navigation menu"
                          aria-expanded={menuOpen}
                      >
                          {menuOpen ? (
                              <X className="w-5 h-5 text-blue-500" />
                          ) : (
                              <Menu className="w-5 h-5" />
                          )}
                      </button>
                  </div>
              </div>

              {/* Mobile Dropdown Menu */}
              {menuOpen && (
                  <div
                      className="sm:hidden mt-3 pt-3 flex flex-col gap-3.5 transition-all animate-in slide-in-from-top-2 duration-200"
                      style={{
                          borderTopWidth: '1px',
                          borderTopStyle: 'solid',
                          borderTopColor: 'var(--header-border)',
                      }}
                  >
                      {/* Mode Switcher in Hamburger */}
                      <div>
                          <div className="text-[10px] font-bold uppercase tracking-wider mb-2 opacity-60">
                              Document Mode
                          </div>
                          <div
                              className="grid grid-cols-2 p-1 rounded-xl gap-1"
                              style={{
                                  backgroundColor: 'var(--btn-secondary-bg)',
                                  borderColor: 'var(--header-border)',
                                  borderWidth: '1px',
                                  borderStyle: 'solid',
                              }}
                          >
                              <button
                                  type="button"
                                  onClick={() => {
                                      setMode('assignment');
                                      setMenuOpen(false);
                                  }}
                                  className={`py-2 px-3 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                                      mode === 'assignment'
                                          ? 'bg-blue-600 text-white shadow-sm'
                                          : 'opacity-70 hover:opacity-100'
                                  }`}
                                  style={{
                                      color:
                                          mode === 'assignment'
                                              ? '#ffffff'
                                              : 'var(--header-text)',
                                  }}
                              >
                                  <FileText className="w-3.5 h-3.5" />
                                  <span>Assignment</span>
                              </button>

                              <button
                                  type="button"
                                  onClick={() => {
                                      setMode('lab');
                                      setMenuOpen(false);
                                  }}
                                  className={`py-2 px-3 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                                      mode === 'lab'
                                          ? 'bg-blue-600 text-white shadow-sm'
                                          : 'opacity-70 hover:opacity-100'
                                  }`}
                                  style={{
                                      color:
                                          mode === 'lab'
                                              ? '#ffffff'
                                              : 'var(--header-text)',
                                  }}
                              >
                                  <Layers className="w-3.5 h-3.5" />
                                  <span>Lab Report</span>
                              </button>
                          </div>
                      </div>

                      {/* Quick Actions in Hamburger */}
                      <div
                          className="pt-2.5 flex flex-col gap-1.5"
                          style={{
                              borderTopWidth: '1px',
                              borderTopStyle: 'solid',
                              borderTopColor: 'var(--header-border)',
                          }}
                      >
                          <button
                              type="button"
                              onClick={() => {
                                  if (
                                      window.confirm(
                                          'Are you sure you want to reset all form fields?',
                                      )
                                  ) {
                                      resetForm();
                                      setMenuOpen(false);
                                  }
                              }}
                              className="w-full py-2 px-2.5 text-xs font-semibold rounded-xl flex items-center justify-between transition-colors hover:bg-red-500/10 hover:text-red-500 cursor-pointer"
                              style={{ color: 'var(--header-text)' }}
                          >
                              <span className="flex items-center gap-2">
                                  <RotateCcw className="w-3.5 h-3.5 text-red-500" />
                                  <span>Reset Form Fields</span>
                              </span>
                              <span className="text-[10px] text-red-400 font-bold">
                                  Clear
                              </span>
                          </button>

                          <a
                              href="https://github.com/Nafiz-365/MU-Cover-Page-Generator"
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={() => setMenuOpen(false)}
                              className="w-full py-2 px-2.5 text-xs font-semibold rounded-xl flex items-center justify-between transition-colors hover:bg-slate-200/50 dark:hover:bg-white/5 cursor-pointer"
                              style={{ color: 'var(--header-text)' }}
                          >
                              <span className="flex items-center gap-2">
                                  <svg
                                      viewBox="0 0 496 512"
                                      className="w-3.5 h-3.5 fill-current opacity-80"
                                  >
                                      <path d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3.3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3zm44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9.3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8z" />
                                  </svg>
                                  <span>GitHub Repository</span>
                              </span>
                              <ExternalLink className="w-3 h-3 opacity-60" />
                          </a>
                      </div>

                      {/* Micro attribution footer */}
                      <div
                          className="pt-2 flex items-center justify-between text-[10px] opacity-60"
                          style={{
                              borderTopWidth: '1px',
                              borderTopStyle: 'solid',
                              borderTopColor: 'var(--header-border)',
                          }}
                      >
                          <span>Nafiz Kamal Talha</span>
                          <span>Metropolitan University</span>
                      </div>
                  </div>
              )}
          </header>

          {/* Mobile Menu Backdrop */}
          {menuOpen && (
              <div
                  className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs z-30 sm:hidden transition-opacity"
                  onClick={() => setMenuOpen(false)}
              />
          )}
      </>
  );
}
