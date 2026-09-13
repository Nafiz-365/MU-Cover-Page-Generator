import React from 'react';
import { useCoverPage } from '../../context/CoverPageContext';

export default function ThemeToggle() {
  const { theme, setTheme } = useCoverPage();
  const isLight = theme === 'light';

  return (
    <label className="cosmic-toggle" title={`Switch to ${isLight ? 'Dark' : 'Light'} Mode`}>
      <input
        type="checkbox"
        className="toggle"
        checked={isLight}
        onChange={(e) => setTheme(e.target.checked ? 'light' : 'dark')}
      />
      <div className="slider">
        <div className="cosmos"></div>
        <div className="energy-line"></div>
        <div className="energy-line"></div>
        <div className="energy-line"></div>
        <div className="toggle-orb">
          <div className="inner-orb"></div>
          <div className="ring"></div>
        </div>
        <div className="particles">
          <div style={{ '--tx': '22px', '--ty': '-12px' }} className="particle"></div>
          <div style={{ '--tx': '25px', '--ty': '0px' }} className="particle"></div>
          <div style={{ '--tx': '22px', '--ty': '12px' }} className="particle"></div>
          <div style={{ '--tx': '-22px', '--ty': '-12px' }} className="particle"></div>
          <div style={{ '--tx': '-25px', '--ty': '0px' }} className="particle"></div>
          <div style={{ '--tx': '-22px', '--ty': '12px' }} className="particle"></div>
        </div>
      </div>
    </label>
  );
}
