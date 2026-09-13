import React from 'react';
import { useCoverPage } from '../../context/CoverPageContext';
import { ACCENT_PRESETS } from '../../constants/options';

export default function ColorPicker() {
  const { accentColor, setAccentColor } = useCoverPage();

  return (
    <div className="flex items-center gap-2">
      {ACCENT_PRESETS.map((preset) => (
        <button
          key={preset.hex}
          type="button"
          onClick={() => setAccentColor(preset.hex)}
          title={preset.name}
          className={`w-6 h-6 rounded-full transition-transform hover:scale-110 cursor-pointer ${
            accentColor.toLowerCase() === preset.hex.toLowerCase()
              ? 'ring-2 ring-white ring-offset-2 ring-offset-slate-900 scale-110'
              : 'opacity-85 hover:opacity-100'
          }`}
          style={{ backgroundColor: preset.hex }}
        />
      ))}
      <div className="relative w-7 h-7 rounded-full overflow-hidden border border-white/20 ml-1 cursor-pointer hover:scale-105 transition-transform">
        <input
          type="color"
          value={accentColor}
          onChange={(e) => setAccentColor(e.target.value)}
          title="Custom Color"
          className="absolute -top-2 -left-2 w-12 h-12 cursor-pointer border-none bg-transparent"
        />
      </div>
    </div>
  );
}
