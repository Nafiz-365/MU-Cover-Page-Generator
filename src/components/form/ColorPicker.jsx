import React from 'react';
import { useCoverPage } from '../../context/CoverPageContext';
import { ACCENT_PRESETS } from '../../constants/options';

export default function ColorPicker() {
  const { accentColor, setAccentColor } = useCoverPage();

  return (
    <div className="flex items-center gap-2.5 flex-wrap py-1">
      {ACCENT_PRESETS.map((preset) => (
        <button
          key={preset.hex}
          type="button"
          onClick={() => setAccentColor(preset.hex)}
          title={preset.name}
          aria-label={`Select accent color ${preset.name}`}
          className={`w-8 h-8 rounded-full transition-all hover:scale-110 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
            accentColor.toLowerCase() === preset.hex.toLowerCase()
              ? 'ring-2 ring-blue-500 ring-offset-2 ring-offset-slate-900 scale-110 shadow-sm'
              : 'opacity-85 hover:opacity-100'
          }`}
          style={{ backgroundColor: preset.hex }}
        />
      ))}
      <div className="relative w-8 h-8 rounded-full overflow-hidden border border-white/20 cursor-pointer hover:scale-105 transition-transform shrink-0">
        <input
          type="color"
          value={accentColor}
          onChange={(e) => setAccentColor(e.target.value)}
          title="Custom Color"
          aria-label="Pick custom accent color"
          className="absolute -top-2 -left-2 w-14 h-14 cursor-pointer border-none bg-transparent"
        />
      </div>
    </div>
  );
}
