import React, { useRef } from 'react';
import { useCoverPage } from '../../context/CoverPageContext';
import { Upload, RotateCcw } from 'lucide-react';

export default function LogoUpload() {
  const { logoDataUrl, setLogoDataUrl, showToast } = useCoverPage();
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Please select a valid image file', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setLogoDataUrl(event.target.result);
      showToast('Custom Logo Uploaded!');
    };
    reader.readAsDataURL(file);
  };

  const handleReset = () => {
    setLogoDataUrl('');
    if (fileInputRef.current) fileInputRef.current.value = '';
    showToast('Restored Default University Logo');
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold rounded-lg border border-dashed border-blue-500/60 text-blue-500 hover:bg-blue-500/10 transition-colors cursor-pointer"
        >
          <Upload className="w-3.5 h-3.5" />
          <span>Upload Logo</span>
        </button>

        {logoDataUrl && (
          <button
            type="button"
            onClick={handleReset}
            title="Reset to Default Logo"
            className="p-2 text-red-400 bg-red-500/10 hover:bg-red-500/20 rounded-lg transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-500 px-1">
        <span>Default Logo:</span>
        <button
          type="button"
          onClick={handleReset}
          className="hover:opacity-80 transition-opacity cursor-pointer flex items-center gap-1.5"
          title="Click to use default Metropolitan University logo"
        >
          <img
            src="/assets/logo.png"
            alt="Default MU Logo"
            className="h-5 object-contain bg-white/90 p-0.5 rounded"
          />
          <span className="text-[10px] text-blue-500 underline font-medium">Reset</span>
        </button>
      </div>
    </div>
  );
}
