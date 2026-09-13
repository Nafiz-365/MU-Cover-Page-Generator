import React from 'react';
import { useCoverPage } from '../../context/CoverPageContext';
import { TEMPLATES, FONTS, DEPARTMENTS } from '../../constants/options';
import ColorPicker from './ColorPicker';
import LogoUpload from './LogoUpload';
import PresetLibrary from './PresetLibrary';
import {
  RotateCcw,
  BookmarkPlus,
  FileDown,
  ImageDown,
  Loader2,
  Eye,
  BookOpen,
  User,
  GraduationCap,
  Building,
  Palette,
  Sparkles,
  Calendar,
  Hash,
  FileText,
  Layers,
} from 'lucide-react';

export default function Sidebar() {
  const {
    mode,
    setMode,
    formData,
    updateField,
    template,
    setTemplate,
    font,
    setFont,
    accentColor,
    savePreset,
    resetForm,
    handleSmartBlur,
    handleCourseCodeBlur,
    handleCourseNameBlur,
    mobileTab,
    setMobileTab,
    generatingPdf,
    savingImage,
    handleGeneratePdf,
    handleSaveImage,
  } = useCoverPage();

  const isLab = mode === 'lab';

  const inputStyle = {
    backgroundColor: 'var(--input-bg)',
    borderColor: 'var(--input-border)',
    color: 'var(--input-text)',
    borderWidth: '1px',
    borderStyle: 'solid',
  };

  const inputClasses =
    'w-full px-3 py-2.5 text-xs rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/40 shadow-xs transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500';

  return (
    <aside
      className={`w-full lg:w-107.5 shrink-0 transition-all duration-300 lg:sticky lg:top-28 lg:max-h-[calc(100vh-8.5rem)] lg:overflow-y-auto lg:pr-1.5 ${
        mobileTab === 'preview' ? 'hidden lg:block' : 'block'
      }`}
    >
      <div
        className="card backdrop-blur-xl rounded-2xl p-4 sm:p-6 shadow-xl transition-all duration-300"
        style={{
          backgroundColor: 'var(--card-bg)',
          borderColor: 'var(--card-border)',
          color: 'var(--card-text)',
          borderWidth: '1px',
          borderStyle: 'solid',
        }}
      >
        {/* Card Header & Mode Switcher */}
        <div
          className="pb-4 mb-4"
          style={{
            borderBottomWidth: '1px',
            borderBottomStyle: 'solid',
            borderBottomColor: 'var(--card-border)',
          }}
        >
          <div className="flex items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-xs"
                style={{
                  backgroundColor: 'var(--highlight-bg)',
                  color: 'var(--accent-color, #2563eb)',
                }}
              >
                {isLab ? <Layers className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
              </div>
              <div className="min-w-0">
                <h2
                  className="text-sm sm:text-base font-extrabold tracking-tight truncate flex items-center gap-2"
                  style={{ color: 'var(--header-text)' }}
                >
                  <span>{isLab ? 'Lab Report Details' : 'Assignment Details'}</span>
                </h2>
                <p className="text-[11px] truncate" style={{ color: 'var(--subtext)' }}>
                  {isLab ? 'Customize experiment and lab submission' : 'Fill details for university assignment'}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                if (window.confirm('Are you sure you want to reset all form fields?')) {
                  resetForm();
                }
              }}
              title="Reset All Fields"
              className="p-1.5 rounded-xl hover:text-red-500 hover:bg-red-500/10 transition-colors cursor-pointer opacity-70 hover:opacity-100 shrink-0"
              style={{ color: 'var(--subtext)' }}
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          {/* Mobile-Only Mode Switcher (Assignment vs Lab Report) */}
          <div
            className="sm:hidden mt-3 p-1 rounded-xl flex items-center gap-1"
            style={{
              backgroundColor: 'var(--btn-secondary-bg)',
              borderColor: 'var(--card-border)',
              borderWidth: '1px',
              borderStyle: 'solid',
            }}
          >
            <button
              type="button"
              onClick={() => setMode('assignment')}
              className={`flex-1 py-2 px-3 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                !isLab
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'opacity-70 hover:opacity-100'
              }`}
              style={{
                color: !isLab ? '#ffffff' : 'var(--card-text)',
              }}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Assignment</span>
            </button>

            <button
              type="button"
              onClick={() => setMode('lab')}
              className={`flex-1 py-2 px-3 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                isLab
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'opacity-70 hover:opacity-100'
              }`}
              style={{
                color: isLab ? '#ffffff' : 'var(--card-text)',
              }}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Lab Report</span>
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-3.5">
          {/* Section 1: Course & Work Information */}
          <section
            className="rounded-2xl p-3.5 transition-all"
            style={{
              backgroundColor: 'var(--highlight-bg)',
              borderColor: 'var(--highlight-border)',
              borderWidth: '1px',
              borderStyle: 'solid',
            }}
          >
            <div className="flex items-center justify-between mb-2.5">
              <div className="flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5" style={{ color: 'var(--accent-color, #2563eb)' }} />
                <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: 'var(--card-text)' }}>
                  Course & Work
                </span>
                <span className="text-[9px] font-semibold px-1.5 py-0.2 rounded-md bg-blue-500/15 text-blue-500">
                  Required
                </span>
              </div>
              <button
                type="button"
                onClick={savePreset}
                className="flex items-center gap-1 text-[10px] font-bold hover:underline transition-colors cursor-pointer uppercase tracking-wider"
                style={{ color: 'var(--accent-color, #2563eb)' }}
                title="Save course & teacher details as a preset"
              >
                <BookmarkPlus className="w-3.5 h-3.5" />
                <span>Save Preset</span>
              </button>
            </div>

            {/* Work Title */}
            <div className="flex flex-col gap-1 mb-2.5">
              <label className="text-[10px] font-bold uppercase tracking-wider flex items-center justify-between" style={{ color: 'var(--label-text)' }}>
                <span>{isLab ? 'Experiment Title / Name' : 'Assignment Title / Topic'}</span>
                <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="input-work-title"
                value={formData.workTitle}
                onChange={(e) => updateField('workTitle', e.target.value)}
                onBlur={() => handleSmartBlur('workTitle')}
                placeholder={isLab ? 'e.g. Implementation of Bresenham Algorithm' : 'e.g. Software Architecture & Design'}
                className={inputClasses}
                style={inputStyle}
              />
            </div>

            {/* Course Name & Code */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-2.5">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--label-text)' }}>
                  Course Name
                </label>
                <input
                  type="text"
                  id="input-course-name"
                  value={formData.courseName}
                  onChange={(e) => updateField('courseName', e.target.value)}
                  onBlur={() => {
                    handleSmartBlur('courseName');
                    handleCourseNameBlur();
                  }}
                  placeholder="e.g. Computer Graphics"
                  className={inputClasses}
                  style={inputStyle}
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--label-text)' }}>
                  Course Code
                </label>
                <input
                  type="text"
                  id="input-course-code"
                  value={formData.courseCode}
                  onChange={(e) => updateField('courseCode', e.target.value)}
                  onBlur={handleCourseCodeBlur}
                  placeholder="e.g. CSE-3201"
                  className={inputClasses}
                  style={inputStyle}
                />
              </div>
            </div>

            {/* Work No & Submission Date */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold uppercase tracking-wider flex items-center gap-1" style={{ color: 'var(--label-text)' }}>
                  <Hash className="w-2.5 h-2.5" />
                  <span>{isLab ? 'Report No' : 'Assignment No'}</span>
                </label>
                <input
                  type="text"
                  id="input-work-no"
                  value={formData.workNo}
                  onChange={(e) => updateField('workNo', e.target.value)}
                  placeholder="e.g. 01"
                  className={inputClasses}
                  style={inputStyle}
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold uppercase tracking-wider flex items-center gap-1" style={{ color: 'var(--label-text)' }}>
                  <Calendar className="w-2.5 h-2.5" />
                  <span>Submission Date</span>
                </label>
                <input
                  type="date"
                  id="input-submission-date"
                  value={formData.submissionDate}
                  onChange={(e) => updateField('submissionDate', e.target.value)}
                  className={inputClasses}
                  style={inputStyle}
                />
              </div>
            </div>
          </section>

          {/* Section 2: Student Information */}
          <section
            className="rounded-2xl p-3.5 transition-all"
            style={{
              backgroundColor: 'var(--group-bg)',
              borderColor: 'var(--group-border)',
              borderWidth: '1px',
              borderStyle: 'solid',
            }}
          >
            <div className="flex items-center gap-1.5 mb-2.5">
              <User className="w-3.5 h-3.5" style={{ color: 'var(--accent-color, #2563eb)' }} />
              <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: 'var(--card-text)' }}>
                Student Details
              </span>
              <span className="text-[9px] font-semibold px-1.5 py-0.2 rounded-md bg-blue-500/15 text-blue-500">
                Required
              </span>
            </div>

            {/* Student Name */}
            <div className="flex flex-col gap-1 mb-2.5">
              <label className="text-[10px] font-bold uppercase tracking-wider flex items-center justify-between" style={{ color: 'var(--label-text)' }}>
                <span>Student Full Name</span>
                <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="input-student-name"
                value={formData.studentName}
                onChange={(e) => updateField('studentName', e.target.value)}
                onBlur={() => handleSmartBlur('studentName')}
                placeholder="e.g. Nafiz Kamal Talha"
                className={inputClasses}
                style={inputStyle}
              />
            </div>

            {/* Student ID & Batch */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-2.5">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold uppercase tracking-wider flex items-center justify-between" style={{ color: 'var(--label-text)' }}>
                  <span>Student ID</span>
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="input-student-id"
                  value={formData.studentId}
                  onChange={(e) => updateField('studentId', e.target.value)}
                  placeholder="e.g. 210101"
                  className={inputClasses}
                  style={inputStyle}
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--label-text)' }}>
                  Batch
                </label>
                <input
                  type="text"
                  id="input-student-batch"
                  value={formData.studentBatch}
                  onChange={(e) => updateField('studentBatch', e.target.value)}
                  placeholder="e.g. 58th"
                  className={inputClasses}
                  style={inputStyle}
                />
              </div>
            </div>

            {/* Section & Department */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--label-text)' }}>
                  Section
                </label>
                <input
                  type="text"
                  id="input-student-section"
                  value={formData.studentSection}
                  onChange={(e) => updateField('studentSection', e.target.value)}
                  placeholder="e.g. A"
                  className={inputClasses}
                  style={inputStyle}
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--label-text)' }}>
                  Department
                </label>
                <select
                  id="input-student-dept"
                  value={formData.studentDept}
                  onChange={(e) => updateField('studentDept', e.target.value)}
                  className={inputClasses}
                  style={inputStyle}
                >
                  {DEPARTMENTS.map((dept) => (
                    <option
                      key={dept}
                      value={dept}
                      style={{
                        backgroundColor: 'var(--card-bg)',
                        color: 'var(--card-text)',
                      }}
                    >
                      {dept}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </section>

          {/* Section 3: Teacher Information */}
          <section
            className="rounded-2xl p-3.5 transition-all"
            style={{
              backgroundColor: 'var(--group-bg)',
              borderColor: 'var(--group-border)',
              borderWidth: '1px',
              borderStyle: 'solid',
            }}
          >
            <div className="flex items-center gap-1.5 mb-2.5">
              <GraduationCap className="w-3.5 h-3.5" style={{ color: 'var(--accent-color, #2563eb)' }} />
              <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: 'var(--card-text)' }}>
                Teacher Details
              </span>
            </div>

            {/* Teacher Name */}
            <div className="flex flex-col gap-1 mb-2.5">
              <label className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--label-text)' }}>
                Teacher's Name
              </label>
              <input
                type="text"
                id="input-teacher-name"
                value={formData.teacherName}
                onChange={(e) => updateField('teacherName', e.target.value)}
                onBlur={() => handleSmartBlur('teacherName')}
                placeholder="e.g. Mahfuzur Rahman"
                className={inputClasses}
                style={inputStyle}
              />
            </div>

            {/* Designation & Department */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--label-text)' }}>
                  Designation
                </label>
                <input
                  type="text"
                  id="input-teacher-designation"
                  value={formData.teacherDesignation}
                  onChange={(e) => updateField('teacherDesignation', e.target.value)}
                  placeholder="e.g. Lecturer"
                  className={inputClasses}
                  style={inputStyle}
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--label-text)' }}>
                  Department
                </label>
                <select
                  id="input-teacher-dept"
                  value={formData.teacherDept}
                  onChange={(e) => updateField('teacherDept', e.target.value)}
                  className={inputClasses}
                  style={inputStyle}
                >
                  {DEPARTMENTS.map((dept) => (
                    <option
                      key={dept}
                      value={dept}
                      style={{
                        backgroundColor: 'var(--card-bg)',
                        color: 'var(--card-text)',
                      }}
                    >
                      {dept}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </section>

          {/* Section 4: Institution Details */}
          <section
            className="rounded-2xl p-3.5 transition-all"
            style={{
              backgroundColor: 'var(--group-bg)',
              borderColor: 'var(--group-border)',
              borderWidth: '1px',
              borderStyle: 'solid',
            }}
          >
            <div className="flex items-center gap-1.5 mb-2">
              <Building className="w-3.5 h-3.5" style={{ color: 'var(--accent-color, #2563eb)' }} />
              <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: 'var(--card-text)' }}>
                Institution
              </span>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--label-text)' }}>
                University Name & Location
              </label>
              <input
                type="text"
                id="input-university-line"
                value={formData.universityLine}
                onChange={(e) => updateField('universityLine', e.target.value)}
                placeholder="Metropolitan University, Sylhet"
                className={inputClasses}
                style={inputStyle}
              />
            </div>
          </section>

          {/* Section 5: Design & Branding */}
          <section
            className="rounded-2xl p-3.5 transition-all"
            style={{
              backgroundColor: 'var(--group-bg)',
              borderColor: 'var(--group-border)',
              borderWidth: '1px',
              borderStyle: 'solid',
            }}
          >
            <div className="flex items-center gap-1.5 mb-2.5">
              <Palette className="w-3.5 h-3.5" style={{ color: 'var(--accent-color, #2563eb)' }} />
              <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: 'var(--card-text)' }}>
                Template & Typography
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-3">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--label-text)' }}>
                  Layout Template
                </label>
                <select
                  value={template}
                  onChange={(e) => setTemplate(e.target.value)}
                  className={inputClasses}
                  style={inputStyle}
                >
                  {TEMPLATES.map((tpl) => (
                    <option
                      key={tpl.id}
                      value={tpl.id}
                      style={{
                        backgroundColor: 'var(--card-bg)',
                        color: 'var(--card-text)',
                      }}
                    >
                      {tpl.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--label-text)' }}>
                  Font Family
                </label>
                <select
                  value={font}
                  onChange={(e) => setFont(e.target.value)}
                  className={inputClasses}
                  style={inputStyle}
                >
                  {FONTS.map((f) => (
                    <option
                      key={f.id}
                      value={f.id}
                      style={{
                        backgroundColor: 'var(--card-bg)',
                        color: 'var(--card-text)',
                      }}
                    >
                      {f.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--label-text)' }}>
                  Accent Color
                </label>
                <ColorPicker />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--label-text)' }}>
                  University Logo
                </label>
                <LogoUpload />
              </div>
            </div>
          </section>

          {/* Section 6: Saved Presets */}
          <PresetLibrary />
        </div>

        {/* Action Buttons */}
        <div
          className="flex flex-col gap-2.5 mt-5 pt-4"
          style={{
            borderTopWidth: '1px',
            borderTopStyle: 'solid',
            borderTopColor: 'var(--card-border)',
          }}
        >
          {/* Mobile Only: Quick Switch to Preview Button */}
          <button
            type="button"
            onClick={() => setMobileTab('preview')}
            className="lg:hidden w-full py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
            style={{
              backgroundColor: 'var(--highlight-bg)',
              borderColor: 'var(--highlight-border)',
              color: 'var(--accent-color)',
              borderWidth: '1px',
              borderStyle: 'solid',
            }}
          >
            <Eye className="w-4 h-4" />
            <span>View Live Preview</span>
          </button>

          <button
            type="button"
            onClick={handleGeneratePdf}
            disabled={generatingPdf || savingImage}
            className="w-full py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-blue-600 hover:bg-blue-500 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-md shadow-blue-600/30 disabled:opacity-50 cursor-pointer"
          >
            {generatingPdf ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Generating PDF...</span>
              </>
            ) : (
              <>
                <FileDown className="w-4 h-4" />
                <span>Generate PDF</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleSaveImage}
            disabled={generatingPdf || savingImage}
            className="w-full py-2.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer shadow-xs"
            style={{
              backgroundColor: 'var(--btn-secondary-bg)',
              borderColor: 'var(--btn-secondary-border)',
              color: 'var(--btn-secondary-text)',
              borderWidth: '1px',
              borderStyle: 'solid',
            }}
          >
            {savingImage ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving Image...</span>
              </>
            ) : (
              <>
                <ImageDown className="w-4 h-4" />
                <span>Save as Image</span>
              </>
            )}
          </button>
        </div>
      </div>
    </aside>
  );
}
