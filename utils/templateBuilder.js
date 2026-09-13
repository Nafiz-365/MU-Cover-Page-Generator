/**
 * Shared template & validation builder for PDF and Image rendering.
 * Used across server/server.js, api/pdf.js, and api/image.js.
 */

function escapeHtml(str = '') {
    return String(str)
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#39;');
}

// Limits input string length to avoid memory bloat or DoS attacks
function sanitizeString(val, maxLength = 300) {
    if (typeof val !== 'string') return '';
    return val.trim().slice(0, maxLength);
}

// Validates base64 data URL to prevent SVG XSS or attribute breakout
function sanitizeLogo(logoSrc, defaultLogo = '') {
    if (!logoSrc || typeof logoSrc !== 'string') return defaultLogo;
    
    // Allow only safe bitmap image data URLs (strictly base64 encoded)
    const safeDataUrlRegex = /^data:image\/(png|jpeg|jpg|webp|gif);base64,[A-Za-z0-9+/=]+$/;
    if (safeDataUrlRegex.test(logoSrc)) {
        return logoSrc;
    }
    return defaultLogo;
}

// Sanitizes CSS color values to prevent CSS injection
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
        logoDataUrl: raw.logoDataUrl
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

    const teacherDept = data.teacherDept
        ? `Department of ${data.teacherDept}`
        : 'Department of ...';
    const studentDept = data.studentDept
        ? `Department of ${data.studentDept}`
        : 'Department of ...';
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

function buildPdfHtml(raw, cssContent, defaultLogoB64 = '') {
    const data = sanitizePayload(raw);
    const pdfOnlyCss = `
    :root { 
      --accent-color: ${data.accentColor}; 
      --accent-blue: ${data.accentColor}; 
      --accent-rgb: ${data.accentRgb}; 
      --accent-glow: rgba(${data.accentRgb}, 0.4);
    }
    html, body { margin: 0; padding: 0; background: #fff; }
    .app-container, .sidebar, .main-header, .dashboard-footer, .toast-container { display: none !important; }
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
    <style>${cssContent}</style>
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
    buildPdfHtml
};
