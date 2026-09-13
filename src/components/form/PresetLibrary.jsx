import React from 'react';
import { useCoverPage } from '../../context/CoverPageContext';
import { X, Bookmark } from 'lucide-react';

export default function PresetLibrary() {
  const { presets, loadPreset, deletePreset } = useCoverPage();

  if (!presets || presets.length === 0) {
    return null;
  }

  return (
    <div className="mt-3 pt-3 border-t border-slate-200 dark:border-white/10">
      <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
        <Bookmark className="w-3 h-3 text-blue-600 dark:text-blue-400" />
        <span>Saved Presets ({presets.length})</span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 max-h-36 overflow-y-auto pr-1">
        {presets.map((preset) => (
          <div
            key={preset.id}
            onClick={() => loadPreset(preset.id)}
            className="group relative flex items-center justify-between p-2 rounded-lg bg-slate-100 dark:bg-black/20 border border-slate-200 dark:border-white/10 hover:border-blue-500/60 hover:bg-blue-50 dark:hover:bg-blue-500/10 cursor-pointer transition-all text-xs"
            title={`Click to load: ${preset.name}`}
          >
            <span className="truncate font-medium text-[11px] text-slate-700 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-white">
              {preset.name}
            </span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                deletePreset(preset.id);
              }}
              title="Delete preset"
              className="opacity-0 group-hover:opacity-100 p-0.5 text-slate-400 hover:text-red-500 transition-opacity ml-1 cursor-pointer"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
