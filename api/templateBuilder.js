/**
 * Production Template Builder for Puppeteer PDF & PNG rendering.
 * Standalone with embedded A4 template styles for bulletproof serverless execution.
 */

const A4_TEMPLATE_CSS = `
.a4-page {
  width: 210mm;
  height: 297mm;
  background: #ffffff;
  color: #000000;
  padding: 25mm 20mm 20mm;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  font-family: 'Inter', 'Hind Siliguri', sans-serif;
  overflow: hidden;
  box-sizing: border-box;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
}

.preview-header {
  text-align: center;
  margin-bottom: 1.5rem;
  width: 100%;
  display: flex;
  justify-content: center;
}

.preview-logo {
  width: 380px;
  max-width: 100%;
  height: auto;
  object-fit: contain;
  margin-bottom: 1rem;
}

.preview-title {
  text-align: center;
  margin-top: 0.5rem;
  width: 100%;
}

.preview-title h2 {
  font-size: 2.25rem;
  font-weight: 800;
  color: var(--accent-color, #2563eb);
  text-transform: uppercase;
  margin-bottom: 1.5rem;
  letter-spacing: 1px;
}

.assignment-on {
  font-size: 1.3rem;
  color: #000000;
  margin-bottom: 0.8rem;
  width: 100%;
  text-align: center;
}

.assignment-on span {
  display: block;
  font-style: italic;
  font-weight: 500;
  margin-bottom: 0.5rem;
  color: #000000;
}

#view-work-title {
  font-weight: 800;
  font-style: italic;
  color: #000000;
  border-bottom: 2.5px solid var(--accent-color, #2563eb);
  display: inline-block;
  min-width: 320px;
  padding-bottom: 6px;
  text-align: center;
}

.preview-course-box {
  margin-top: 4.5rem;
  padding: 2.2rem 2.8rem;
  width: 100%;
  max-width: 610px;
  background-color: #f8fafc;
  border-radius: 16px;
  border: 1px solid #edf2f7;
}

.course-row {
  font-size: 1.25rem;
  margin-bottom: 1.25rem;
  display: flex;
  gap: 0.75rem;
  align-items: baseline;
}

.course-row:last-child {
  margin-bottom: 0;
}

.course-row .label {
  font-weight: 700;
  color: #000000;
  white-space: nowrap;
}

.course-row .value {
  color: #000000;
  flex: 1;
  border-bottom: 1px dotted #a0aec0;
  height: 1.6rem;
  padding-left: 8px;
}

.preview-footer {
  width: 100%;
  display: flex;
  justify-content: space-between;
  margin-top: auto;
  padding-top: 1rem;
  gap: 4rem;
}

.footer-column {
  flex: 1;
}

.footer-column:first-child {
  padding-left: 2rem;
}

.footer-column h3 {
  font-size: 1.1rem;
  font-weight: 900;
  color: var(--accent-color, #2563eb);
  border-bottom: 3px solid var(--accent-color, #2563eb);
  padding-bottom: 6px;
  margin-bottom: 1.5rem;
  width: fit-content;
  text-transform: uppercase;
  letter-spacing: 1.5px;
}

.footer-info p {
  margin-bottom: 0.5rem;
  font-size: 1rem;
  line-height: 1.4;
  color: #000000;
}

.footer-info .name {
  font-weight: 800;
  font-size: 1.25rem;
  color: #000000;
  margin-bottom: 0.8rem;
  letter-spacing: 0.2px;
}

.footer-info .dept,
.footer-info .uni,
.footer-info .id,
.footer-info .batch,
.footer-info .section,
.footer-info .designation {
  font-size: 0.95rem;
  color: #000000;
  font-weight: 600;
}

.submission-date {
  margin-top: 4rem;
  font-size: 1.1rem;
  font-weight: 700;
  color: #2d3748;
  text-align: center;
  width: 100%;
  letter-spacing: 0.5px;
}

/* Templates */
.a4-page.template-minimal { padding: 25mm; }
.template-minimal .preview-course-box { background: none; border: none; border-radius: 0; padding-left: 0; padding-right: 0; }
.a4-page.template-modern { border-left: 15mm solid var(--accent-color, #2563eb); padding-left: 15mm; padding-right: 15mm; }
.template-modern .preview-title h2 { text-align: center; width: 100%; }
.template-modern .preview-course-box { margin-left: 0; border-radius: 0 16px 16px 0; }
.template-modern .preview-logo { align-self: center; margin-bottom: 2rem; }

.template-bordered { border: 1px solid #1a202c; position: relative; padding: 20mm !important; }
.template-bordered::before { content: ''; position: absolute; top: 10mm; left: 10mm; right: 10mm; bottom: 10mm; border: 2px solid #1a202c; pointer-events: none; }
.template-bordered .preview-header { border-bottom: 2px solid #1a202c; padding-bottom: 1rem; margin-bottom: 2rem; }

.template-tech {
  background-image:
    radial-gradient(circle at 10% 20%, rgba(var(--accent-rgb, 37, 99, 235), 0.05) 0%, transparent 20%),
    radial-gradient(circle at 90% 80%, rgba(var(--accent-rgb, 37, 99, 235), 0.05) 0%, transparent 20%),
    linear-gradient(to right, rgba(var(--accent-rgb, 37, 99, 235), 0.03) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(var(--accent-rgb, 37, 99, 235), 0.03) 1px, transparent 1px);
  background-size: 100% 100%, 100% 100%, 20px 20px, 20px 20px;
  font-family: 'Inter', monospace;
}
.template-tech .preview-title h2 { color: #0f172a; font-family: 'Inter', sans-serif; letter-spacing: 2px; }
.template-tech #view-work-title, .template-tech .value { font-family: 'Courier New', monospace; font-weight: 600; }
.template-tech .preview-course-box { background-color: white; border: 1px solid #e2e8f0; box-shadow: 4px 4px 0px rgba(var(--accent-rgb, 37, 99, 235), 0.1); border-radius: 0; }

.template-thesis { padding: 25mm 20mm !important; }
.template-thesis::before { content: ''; position: absolute; top: 8mm; left: 8mm; right: 8mm; bottom: 8mm; border: 1px solid #1a202c; pointer-events: none; }
.template-thesis::after { content: ''; position: absolute; top: 9.5mm; left: 9.5mm; right: 9.5mm; bottom: 9.5mm; border: 2.5px solid #1a202c; pointer-events: none; }

.template-cards { background-color: #f4f7fb; }
.template-cards .preview-course-box { background-color: white; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05); border: none; border-radius: 16px; }
.template-cards .preview-footer { gap: 2rem; }
.template-cards .footer-column { background-color: white; padding: 1.5rem; border-radius: 16px; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05); }
.template-cards .footer-column:first-child { padding-left: 1.5rem; }
.template-cards .footer-column h3 { margin-top: -5px; }

.template-stripe { padding-left: 35mm !important; }
.template-stripe::before { content: ''; position: absolute; top: 0; bottom: 0; left: 0; width: 20mm; background-color: var(--accent-color, #2563eb); }
.template-stripe .preview-course-box { margin-left: 0; }

/* Fonts */
.font-classic { font-family: 'Inter', sans-serif !important; }
.font-sans { font-family: 'Open Sans', sans-serif !important; }
.font-modern { font-family: 'Poppins', sans-serif !important; }
.font-serif { font-family: 'Merriweather', serif !important; }
.font-mono { font-family: 'Roboto Mono', monospace !important; }
.font-montserrat { font-family: 'Montserrat', sans-serif !important; }
.font-playfair { font-family: 'Playfair Display', serif !important; }
.font-oswald { font-family: 'Oswald', sans-serif !important; }
`;

function escapeHtml(str = '') {
  return String(str)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function sanitizeString(val, maxLength = 300) {
  if (typeof val !== 'string') return '';
  return val.trim().slice(0, maxLength);
}

function sanitizeLogo(logoSrc, defaultLogo = '') {
  if (!logoSrc || typeof logoSrc !== 'string') return defaultLogo;
  const safeDataUrlRegex = /^data:image\/(png|jpeg|jpg|webp|gif);base64,[A-Za-z0-9+/=]+$/;
  if (safeDataUrlRegex.test(logoSrc)) {
    return logoSrc;
  }
  return defaultLogo;
}

function sanitizeHexColor(hex, fallback = '#2563eb') {
  if (typeof hex === 'string' && /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(hex.trim())) {
    return hex.trim();
  }
  return fallback;
}

function sanitizeRgb(rgb, fallback = '37, 99, 235') {
  if (typeof rgb === 'string' && /^[0-9]{1,3},\s*[0-9]{1,3},\s*[0-9]{1,3}$/.test(rgb.trim())) {
    return rgb.trim();
  }
  return fallback;
}

function sanitizePayload(raw = {}) {
  return {
    mode: raw.mode === 'lab' ? 'lab' : 'assignment',
    template: sanitizeString(raw.template || 'template-classic', 50),
    font: sanitizeString(raw.font || 'font-classic', 50),
    workNo: sanitizeString(raw.workNo, 20),
    workTitle: sanitizeString(raw.workTitle, 250),
    courseName: sanitizeString(raw.courseName, 150),
    courseCode: sanitizeString(raw.courseCode, 50),
    teacherName: sanitizeString(raw.teacherName, 100),
    teacherDesignation: sanitizeString(raw.teacherDesignation, 100),
    teacherDept: sanitizeString(raw.teacherDept, 100),
    studentName: sanitizeString(raw.studentName, 100),
    studentId: sanitizeString(raw.studentId, 50),
    studentBatch: sanitizeString(raw.studentBatch, 50),
    studentSection: sanitizeString(raw.studentSection, 50),
    studentDept: sanitizeString(raw.studentDept, 100),
    submissionDate: sanitizeString(raw.submissionDate, 50),
    universityLine: sanitizeString(raw.universityLine, 150),
    accentColor: sanitizeHexColor(raw.accentColor, '#2563eb'),
    accentRgb: sanitizeRgb(raw.accentRgb, '37, 99, 235'),
    logoDataUrl: raw.logoDataUrl,
  };
}

function buildCaptureAreaHtml(raw, defaultLogoB64 = '') {
  const data = sanitizePayload(raw);
  const modeTitle = data.mode === 'lab' ? 'LAB REPORT NO-' : 'ASSIGNMENT NO-';
  const onLabel = data.mode === 'lab' ? 'Experiment on' : 'Assignment on';

  let displayDate = data.submissionDate || '';
  if (displayDate) {
    const d = new Date(displayDate);
    if (!isNaN(d.getTime())) {
      displayDate = d.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
    }
  }

  const teacherDept = data.teacherDept ? `Department of ${data.teacherDept}` : 'Department of ...';
  const studentDept = data.studentDept ? `Department of ${data.studentDept}` : 'Department of ...';
  const sectionLine = data.studentSection
    ? `<p class="section">Section: <span>${escapeHtml(data.studentSection)}</span></p>`
    : '';
  const batchLine = data.studentBatch
    ? `<p class="batch">Batch: <span id="view-student-batch">${escapeHtml(data.studentBatch)}</span></p>`
    : '<p class="batch">Batch: <span id="view-student-batch">...</span></p>';

  const logoSrc = sanitizeLogo(data.logoDataUrl, defaultLogoB64);

  return `
  <div id="capture-area" class="a4-page ${escapeHtml(data.template)} ${escapeHtml(data.font)}">
    <div class="preview-header">
      <img src="${logoSrc}" alt="Logo" class="preview-logo">
    </div>

    <div class="preview-title">
      <h2 id="preview-mode-title">${escapeHtml(modeTitle)} <span id="view-work-no">${escapeHtml(data.workNo || '...')}</span></h2>
      <div class="assignment-on">
        <span>${escapeHtml(onLabel)}</span>
        <div id="view-work-title">${escapeHtml(data.workTitle || '.........................')}</div>
      </div>
    </div>

    <div class="preview-course-box">
      <div class="course-row">
        <span class="label">Course Name :</span>
        <span class="value" id="view-course-name">${escapeHtml(data.courseName || '.........................')}</span>
      </div>
      <div class="course-row">
        <span class="label">Course Code :</span>
        <span class="value" id="view-course-code">${escapeHtml(data.courseCode || '.........................')}</span>
      </div>
    </div>

    <div class="preview-footer">
      <div class="footer-column">
        <h3>SUBMITTED TO:</h3>
        <div class="footer-info">
          <p class="name" id="view-teacher-name">${escapeHtml(data.teacherName || "Teacher's Name")}</p>
          <p class="designation" id="view-teacher-designation">${escapeHtml(data.teacherDesignation || 'Designation')}</p>
          <p class="dept" id="view-teacher-dept">${escapeHtml(teacherDept)}</p>
          <p class="uni">${escapeHtml(data.universityLine || 'Metropolitan University, Sylhet')}</p>
        </div>
      </div>
      <div class="footer-column">
        <h3>SUBMITTED BY:</h3>
        <div class="footer-info">
          <p class="name" id="view-student-name">${escapeHtml(data.studentName || 'Student Name')}</p>
          <p class="id">ID: <span id="view-student-id">${escapeHtml(data.studentId || '.........')}</span></p>
          ${batchLine}
          ${sectionLine}
          <p class="dept" id="view-student-dept">${escapeHtml(studentDept)}</p>
          <p class="uni">${escapeHtml(data.universityLine || 'Metropolitan University, Sylhet')}</p>
        </div>
      </div>
    </div>

    <div class="submission-date">
      <strong>Date of Submission:</strong> <span id="view-submission-date">${escapeHtml(displayDate)}</span>
    </div>
  </div>
  `;
}

function buildPdfHtml(raw, defaultLogoB64 = '') {
  const data = sanitizePayload(raw);
  const pdfOnlyCss = `
    :root { 
      --accent-color: ${data.accentColor}; 
      --accent-blue: ${data.accentColor}; 
      --accent-rgb: ${data.accentRgb}; 
      --accent-glow: rgba(${data.accentRgb}, 0.4);
    }
    html, body { margin: 0; padding: 0; background: #fff; }
    #capture-area {
      transform: none !important;
      margin: 0 !important;
      padding: 25mm 20mm !important;
      box-shadow: none !important;
      width: 210mm !important;
      height: 297mm !important;
      overflow: hidden !important;
      background: white !important;
    }
    @media print {
      body { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
    }
    @page { size: A4; margin: 0; }
  `;

  const captureArea = buildCaptureAreaHtml(data, defaultLogoB64);

  return `<!doctype html>
  <html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Hind+Siliguri:wght@400;600;700&family=Merriweather:wght@400;700&family=Poppins:wght@400;600;700&family=Roboto+Mono:wght@400;700&family=Open+Sans:wght@400;600;700&family=Montserrat:wght@400;600;700&family=Playfair+Display:wght@400;600;700&family=Oswald:wght@400;600;700&display=swap" rel="stylesheet">
    <style>${A4_TEMPLATE_CSS}</style>
    <style>${pdfOnlyCss}</style>
  </head>
  <body>
    ${captureArea}
  </body>
  </html>`;
}

module.exports = {
  escapeHtml,
  sanitizeString,
  sanitizeLogo,
  sanitizePayload,
  buildCaptureAreaHtml,
  buildPdfHtml,
};
