import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { DEFAULT_UNIVERSITY, DEFAULT_DEPT, ACCENT_PRESETS } from '../constants/options';

const CoverPageContext = createContext(null);

import confetti from 'canvas-confetti';
import { generateClientPdf, generateClientImage } from '../utils/exportUtils';

const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
    : '37, 99, 235';
};

export const toTitleCase = (str = '') => {
  return str.replace(/\b\w/g, (l) => l.toUpperCase());
};

export function CoverPageProvider({ children }) {
  // Mode: 'assignment' | 'lab'
  const [mode, setMode] = useState('assignment');

  // Mobile / Tablet Tab: 'form' | 'preview'
  const [mobileTab, setMobileTab] = useState('form');

  // Generation status
  const [generatingPdf, setGeneratingPdf] = useState(false);
  const [savingImage, setSavingImage] = useState(false);

  // Form fields
  const today = new Date().toISOString().split('T')[0];
  const [formData, setFormData] = useState({
    workTitle: '',
    courseName: '',
    courseCode: '',
    workNo: '',
    submissionDate: today,
    studentName: '',
    studentId: '',
    studentBatch: '',
    studentSection: '',
    studentDept: DEFAULT_DEPT,
    teacherName: '',
    teacherDesignation: '',
    teacherDept: DEFAULT_DEPT,
    universityLine: DEFAULT_UNIVERSITY,
  });

  // Template & Typography
  const [template, setTemplate] = useState('template-classic');
  const [font, setFont] = useState('font-classic');

  // Accent color
  const [accentColor, setAccentColorState] = useState('#2563eb');

  // Theme: 'dark' | 'light'
  const [theme, setThemeState] = useState('dark');

  // Logo
  const [logoDataUrl, setLogoDataUrl] = useState('');

  // Presets
  const [presets, setPresets] = useState([]);

  // Toasts
  const [toasts, setToasts] = useState([]);

  // Active focus target for click-to-edit
  const [focusedField, setFocusedField] = useState(null);

  const showToast = useCallback((message, type = 'info') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3200);
  }, []);

  // Update Accent Color
  const setAccentColor = useCallback((color) => {
    setAccentColorState(color);
    localStorage.setItem('mu_accent_color', color);
    const rgb = hexToRgb(color);
    document.documentElement.style.setProperty('--accent-color', color);
    document.documentElement.style.setProperty('--accent-blue', color);
    document.documentElement.style.setProperty('--accent-rgb', rgb);
    document.documentElement.style.setProperty('--accent-glow', `rgba(${rgb}, 0.4)`);
  }, []);

  // Update Theme
  const setTheme = useCallback((newTheme) => {
    setThemeState(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    }
    localStorage.setItem('mu_theme', newTheme);
  }, []);

  // Set field helper with auto-save
  const updateField = useCallback((field, value) => {
    setFormData((prev) => {
      const next = { ...prev, [field]: value };
      localStorage.setItem('mu_cover_data', JSON.stringify(next));
      return next;
    });
  }, []);

  // Initialize from localStorage
  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem('mu_theme') || 'dark';
      setTheme(savedTheme);

      const savedAccent = localStorage.getItem('mu_accent_color') || '#2563eb';
      setAccentColor(savedAccent);

      const savedTemplate = localStorage.getItem('mu_template') || 'template-classic';
      setTemplate(savedTemplate);

      const savedFont = localStorage.getItem('mu_font') || 'font-classic';
      setFont(savedFont);

      const savedData = localStorage.getItem('mu_cover_data');
      if (savedData) {
        const parsed = JSON.parse(savedData);
        setFormData((prev) => ({ ...prev, ...parsed }));
      }

      const savedPresets = localStorage.getItem('mu_presets');
      if (savedPresets) {
        setPresets(JSON.parse(savedPresets));
      }

      // Preload default logo as Data URL for instant, local exports
      fetch('/assets/logo.png')
        .then((res) => res.blob())
        .then((blob) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            if (typeof reader.result === 'string') {
              setLogoDataUrl((current) => current || reader.result);
            }
          };
          reader.readAsDataURL(blob);
        })
        .catch(() => {});
    } catch (e) {
      console.error('Error loading initial data from localStorage:', e);
    }
  }, [setAccentColor, setTheme]);

  // Handle template change
  const handleSetTemplate = useCallback((tpl) => {
    setTemplate(tpl);
    localStorage.setItem('mu_template', tpl);
  }, []);

  // Handle font change
  const handleSetFont = useCallback((f) => {
    setFont(f);
    localStorage.setItem('mu_font', f);
  }, []);

  // Smart blur for title casing
  const handleSmartBlur = useCallback((field) => {
    setFormData((prev) => {
      const val = prev[field];
      if (val && typeof val === 'string') {
        const formatted = toTitleCase(val);
        if (formatted !== val) {
          const next = { ...prev, [field]: formatted };
          localStorage.setItem('mu_cover_data', JSON.stringify(next));
          return next;
        }
      }
      return prev;
    });
  }, []);

  // Course Code memory lookup
  const handleCourseCodeBlur = useCallback(() => {
    const code = (formData.courseCode || '').toUpperCase().trim();
    if (!code) return;
    try {
      const memory = JSON.parse(localStorage.getItem('mu_course_memory') || '{}');
      if (memory[code] && !formData.courseName) {
        updateField('courseName', memory[code]);
        showToast(`Suggested: ${memory[code]}`);
      }
    } catch {
      // ignore
    }
  }, [formData.courseCode, formData.courseName, updateField, showToast]);

  // Course Name blur memory save
  const handleCourseNameBlur = useCallback(() => {
    const code = (formData.courseCode || '').toUpperCase().trim();
    const name = (formData.courseName || '').trim();
    if (code && name) {
      try {
        const memory = JSON.parse(localStorage.getItem('mu_course_memory') || '{}');
        memory[code] = name;
        localStorage.setItem('mu_course_memory', JSON.stringify(memory));
      } catch {
        // ignore
      }
    }
  }, [formData.courseCode, formData.courseName]);

  // Presets operations
  const savePreset = useCallback(() => {
    if (!formData.courseName.trim()) {
      showToast('Enter Course Name first to save preset');
      return;
    }
    const newPreset = {
      id: Date.now(),
      name: formData.courseName.trim(),
      courseName: formData.courseName,
      courseCode: formData.courseCode,
      teacherName: formData.teacherName,
      teacherDesignation: formData.teacherDesignation,
      teacherDept: formData.teacherDept,
      studentBatch: formData.studentBatch,
      studentSection: formData.studentSection,
      studentDept: formData.studentDept,
    };
    const updated = [...presets, newPreset];
    setPresets(updated);
    localStorage.setItem('mu_presets', JSON.stringify(updated));
    showToast('Saved to Preset Library!');
  }, [formData, presets, showToast]);

  const loadPreset = useCallback((id) => {
    const found = presets.find((p) => p.id === id);
    if (found) {
      setFormData((prev) => {
        const next = {
          ...prev,
          courseName: found.courseName || prev.courseName,
          courseCode: found.courseCode || prev.courseCode,
          teacherName: found.teacherName || prev.teacherName,
          teacherDesignation: found.teacherDesignation || prev.teacherDesignation,
          teacherDept: found.teacherDept || prev.teacherDept,
          studentBatch: found.studentBatch || prev.studentBatch,
          studentSection: found.studentSection || prev.studentSection,
          studentDept: found.studentDept || prev.studentDept,
        };
        localStorage.setItem('mu_cover_data', JSON.stringify(next));
        return next;
      });
      showToast('Preset Loaded!');
    }
  }, [presets, showToast]);

  const deletePreset = useCallback((id) => {
    const updated = presets.filter((p) => p.id !== id);
    setPresets(updated);
    localStorage.setItem('mu_presets', JSON.stringify(updated));
    showToast('Preset Deleted');
  }, [presets, showToast]);

  // Reset all data
  const resetForm = useCallback(() => {
    const cleared = {
      workTitle: '',
      courseName: '',
      courseCode: '',
      workNo: '',
      submissionDate: today,
      studentName: '',
      studentId: '',
      studentBatch: '',
      studentSection: '',
      studentDept: DEFAULT_DEPT,
      teacherName: '',
      teacherDesignation: '',
      teacherDept: DEFAULT_DEPT,
      universityLine: DEFAULT_UNIVERSITY,
    };
    setFormData(cleared);
    localStorage.removeItem('mu_cover_data');
    showToast('Form Cleared');
  }, [today, showToast]);

  // Click-to-edit focus trigger
  const focusInput = useCallback((fieldName) => {
    setFocusedField(fieldName);
    setMobileTab('form');
    setTimeout(() => {
      const el = document.getElementById(`input-${fieldName}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        el.focus();
        el.classList.add('input-highlight');
        setTimeout(() => el.classList.remove('input-highlight'), 1600);
      }
    }, 120);
  }, []);

  const fireConfetti = useCallback(() => {
    try {
      confetti({
        particleCount: 140,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#4ecdc4', '#ff6b6b', '#4f46e5', '#f59e0b', '#10b981'],
      });
    } catch {
      // ignore
    }
  }, []);

  const validateRequired = useCallback(() => {
    const isLab = mode === 'lab';
    const required = [
      { id: 'input-student-name', name: 'Student Name', value: formData.studentName },
      { id: 'input-work-title', name: isLab ? 'Experiment Name' : 'Assignment Title', value: formData.workTitle },
      { id: 'input-student-id', name: 'Student ID', value: formData.studentId },
    ];

    let firstError = null;
    for (const req of required) {
      if (!req.value || !req.value.trim()) {
        const el = document.getElementById(req.id);
        if (el) {
          el.classList.add('error-shake');
          setTimeout(() => el.classList.remove('error-shake'), 600);
        }
        if (!firstError) firstError = req.name;
      }
    }

    if (firstError) {
      showToast(`Please fill in: ${firstError}`, 'error');
      // If on mobile preview tab, switch to form tab so user sees the error
      setMobileTab('form');
      return false;
    }
    return true;
  }, [mode, formData.studentName, formData.workTitle, formData.studentId, showToast]);

  const buildPayload = useCallback(() => {
    return {
      mode,
      studentName: formData.studentName,
      studentId: formData.studentId,
      studentBatch: formData.studentBatch,
      studentSection: formData.studentSection,
      studentDept: formData.studentDept,
      teacherName: formData.teacherName,
      teacherDesignation: formData.teacherDesignation,
      teacherDept: formData.teacherDept,
      workTitle: formData.workTitle,
      courseName: formData.courseName,
      courseCode: formData.courseCode,
      workNo: formData.workNo,
      submissionDate: formData.submissionDate,
      template,
      font,
      accentColor,
      logoDataUrl: logoDataUrl || '',
      universityLine: formData.universityLine,
    };
  }, [
    mode,
    formData,
    template,
    font,
    accentColor,
    logoDataUrl,
  ]);

  // Generate PDF (Instant client-side with server fallback)
  const handleGeneratePdf = useCallback(async () => {
    if (!validateRequired()) return;

    setGeneratingPdf(true);
    const safeName = (formData.studentName || 'Student').replace(/[^\w\-]+/g, '_').slice(0, 40);

    try {
      // Primary: Instant client-side PDF generation (~300ms)
      await generateClientPdf('capture-area', `CoverPage_${safeName}`);
      showToast('Cover Page Generated Successfully!');
      fireConfetti();
    } catch (clientErr) {
      console.warn('Client-side PDF export failed, attempting server fallback:', clientErr);
      try {
        const payload = buildPayload();
        const resp = await fetch('/api/pdf', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (!resp.ok) {
          let errorMsg = `Server Error: ${resp.status}`;
          try {
            const errJson = await resp.json();
            if (errJson.message) errorMsg = errJson.message;
          } catch {
            // ignore
          }
          throw new Error(errorMsg);
        }

        const blob = await resp.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `CoverPage_${safeName}.pdf`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);

        showToast('Cover Page Generated Successfully!');
        fireConfetti();
      } catch (err) {
        console.error('PDF generation error:', err);
        showToast(`Error: ${err.message}`, 'error');
      }
    } finally {
      setGeneratingPdf(false);
    }
  }, [validateRequired, buildPayload, formData.studentName, showToast, fireConfetti]);

  // Save as Image (Instant client-side with server fallback)
  const handleSaveImage = useCallback(async () => {
    if (!validateRequired()) return;

    setSavingImage(true);
    const safeName = (formData.studentName || 'Student').replace(/[^\w\-]+/g, '_').slice(0, 40);

    try {
      // Primary: Instant client-side PNG generation (~200ms)
      await generateClientImage('capture-area', `CoverPage_${safeName}`);
      showToast('Cover Page Saved as Image!');
      fireConfetti();
    } catch (clientErr) {
      console.warn('Client-side image export failed, attempting server fallback:', clientErr);
      try {
        const payload = buildPayload();
        const resp = await fetch('/api/image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (!resp.ok) {
          const errText = await resp.text();
          throw new Error(errText || 'Image generation failed on server.');
        }

        const blob = await resp.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `CoverPage_${safeName}.png`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);

        showToast('Cover Page Saved as Image!');
        fireConfetti();
      } catch (err) {
        console.error('Image generation error:', err);
        showToast(`Error: ${err.message}`, 'error');
      }
    } finally {
      setSavingImage(false);
    }
  }, [validateRequired, buildPayload, formData.studentName, showToast, fireConfetti]);

  return (
    <CoverPageContext.Provider
      value={{
        mode,
        setMode,
        mobileTab,
        setMobileTab,
        formData,
        updateField,
        template,
        setTemplate: handleSetTemplate,
        font,
        setFont: handleSetFont,
        accentColor,
        setAccentColor,
        theme,
        setTheme,
        logoDataUrl,
        setLogoDataUrl,
        presets,
        savePreset,
        loadPreset,
        deletePreset,
        resetForm,
        toasts,
        showToast,
        handleSmartBlur,
        handleCourseCodeBlur,
        handleCourseNameBlur,
        focusInput,
        generatingPdf,
        savingImage,
        handleGeneratePdf,
        handleSaveImage,
      }}
    >
      {children}
    </CoverPageContext.Provider>
  );
}

export function useCoverPage() {
  const ctx = useContext(CoverPageContext);
  if (!ctx) {
    throw new Error('useCoverPage must be used within CoverPageProvider');
  }
  return ctx;
}
