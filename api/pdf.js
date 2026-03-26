const path = require('path');
const fs = require('fs/promises');
const chromium = require('@sparticuz/chromium');
const puppeteer = require('puppeteer-core');

// Constants
const ROOT = path.resolve(__dirname, '..');

function escapeHtml(str = '') {
  return String(str)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function buildCaptureAreaHtml(data, defaultLogoB64) {
  const mode = data?.mode === 'lab' ? 'lab' : 'assignment';
  const modeTitle = mode === 'lab' ? 'LAB REPORT NO-' : 'ASSIGNMENT NO-';
  const onLabel = mode === 'lab' ? 'Experiment on' : 'Assignment on';

  let displayDate = data?.submissionDate || '';
  if (displayDate) {
    const d = new Date(displayDate);
    if (!isNaN(d)) {
      displayDate = d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
    }
  }

  const teacherDept = data?.teacherDept ? `Department of ${data.teacherDept}` : 'Department of ...';
  const studentDept = data?.studentDept ? `Department of ${data.studentDept}` : 'Department of ...';
  const sectionLine = data?.studentSection ? `<p class="section">Section: <span>${escapeHtml(data.studentSection)}</span></p>` : '';
  const batchLine = data?.studentBatch ? `<p class="batch">Batch: <span id="view-student-batch">${escapeHtml(data.studentBatch)}</span></p>` : '<p class="batch">Batch: <span id="view-student-batch">...</span></p>';

  let logoSrc = data?.logoDataUrl;
  if (!logoSrc || !logoSrc.startsWith('data:')) {
    logoSrc = defaultLogoB64;
  }

  return `
  <div id="capture-area" class="a4-page ${escapeHtml(data?.template || 'template-classic')} ${escapeHtml(data?.font || 'font-classic')}">
    <div class="preview-header">
      <img src="${logoSrc}" alt="Logo" class="preview-logo">
    </div>

    <div class="preview-title">
      <h2 id="preview-mode-title">${escapeHtml(modeTitle)} <span id="view-work-no">${escapeHtml(data?.workNo || '...')}</span></h2>
      <div class="assignment-on">
        <span>${escapeHtml(onLabel)}</span>
        <div id="view-work-title">${escapeHtml(data?.workTitle || '.........................')}</div>
      </div>
    </div>

    <div class="preview-course-box">
      <div class="course-row">
        <span class="label">Course Name :</span>
        <span class="value" id="view-course-name">${escapeHtml(data?.courseName || '.........................')}</span>
      </div>
      <div class="course-row">
        <span class="label">Course Code :</span>
        <span class="value" id="view-course-code">${escapeHtml(data?.courseCode || '.........................')}</span>
      </div>
    </div>

    <div class="preview-footer">
      <div class="footer-column">
        <h3>SUBMITTED TO:</h3>
        <div class="footer-info">
          <p class="name" id="view-teacher-name">${escapeHtml(data?.teacherName || "Teacher's Name")}</p>
          <p class="designation" id="view-teacher-designation">${escapeHtml(data?.teacherDesignation || 'Designation')}</p>
          <p class="dept" id="view-teacher-dept">${escapeHtml(teacherDept)}</p>
          <p class="uni">${escapeHtml(data?.universityLine || 'Metropolitan University, Sylhet')}</p>
        </div>
      </div>
      <div class="footer-column">
        <h3>SUBMITTED BY:</h3>
        <div class="footer-info">
          <p class="name" id="view-student-name">${escapeHtml(data?.studentName || 'Student Name')}</p>
          <p class="id">ID: <span id="view-student-id">${escapeHtml(data?.studentId || '.........')}</span></p>
          ${batchLine}
          ${sectionLine}
          <p class="dept" id="view-student-dept">${escapeHtml(studentDept)}</p>
          <p class="uni">${escapeHtml(data?.universityLine || 'Metropolitan University, Sylhet')}</p>
        </div>
      </div>
    </div>

    <div class="submission-date">
      <strong>Date of Submission:</strong> <span id="view-submission-date">${escapeHtml(displayDate)}</span>
    </div>
  </div>
  `;
}

async function buildPdfHtml(data) {
  // Use relative path for Vercel
  const cssPath = path.join(process.cwd(), 'style.css');
  const css = await fs.readFile(cssPath, 'utf8');
  
  // Default Logo
  let defaultLogoB64 = '';
  try {
    const logoBuf = await fs.readFile(path.join(process.cwd(), 'assets', 'logo.png'));
    defaultLogoB64 = `data:image/png;base64,${logoBuf.toString('base64')}`;
  } catch (e) {
    console.error('Failed to load default logo in API:', e.message);
  }

  const accentColor = data?.accentColor || '#4ecdc4';
  const accentRgb = data?.accentRgb || '78, 205, 196';

  const pdfOnlyCss = `
    :root { 
      --accent-color: ${accentColor}; 
      --accent-blue: ${accentColor}; 
      --accent-rgb: ${accentRgb}; 
      --accent-glow: rgba(${accentRgb}, 0.4);
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
  <html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Hind+Siliguri:wght@400;600;700&family=Merriweather:wght@400;700&family=Poppins:wght@400;600;700&family=Roboto+Mono:wght@400;700&family=Open+Sans:wght@400;600;700&display=swap" rel="stylesheet">
    <style>${css}</style>
    <style>${pdfOnlyCss}</style>
  </head>
  <body>
    ${captureArea}
  </body>
  </html>`;
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const data = req.body || {};
  let browser;

  try {
    const html = await buildPdfHtml(data);

    // Vercel specific puppeteer launch
    browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
      ignoreHTTPSErrors: true,
    });

    const startTime = Date.now();
    console.log('PDF Generation Started');

    const page = await browser.newPage();
    await page.setViewport({ width: 794, height: 1123, deviceScaleFactor: 2 });
    await page.emulateMediaType('screen');
    
    try {
      await page.setContent(html, { waitUntil: 'networkidle0', timeout: 4000 });
    } catch (e) {
      console.log(`setContent networkidle0 timed out: ${e.message}. Proceeding...`);
    }

    console.log(`Content set in ${Date.now() - startTime}ms. Waiting for fonts/images...`);

    await page.evaluate(async () => {
      if (document.fonts && document.fonts.ready) await document.fonts.ready;
      const imgs = Array.from(document.querySelectorAll('img'));
      await Promise.all(imgs.map(img => {
        if (img.complete) return Promise.resolve();
        return new Promise((resolve) => {
          img.onload = resolve;
          img.onerror = resolve;
        });
      }));
    });

    console.log(`Evaluated in ${Date.now() - startTime}ms. Generating PDF...`);

    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
      preferCSSPageSize: true,
    });

    console.log(`PDF generated in ${Date.now() - startTime}ms. Total size: ${pdf.length} bytes`);

    const safeName = String(data?.studentName || 'Student').replace(/[^\w\-]+/g, '_').slice(0, 40);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="CoverPage_${safeName}.pdf"`);
    res.send(pdf);

  } catch (err) {
    console.error('PDF Generation Error:', err);
    res.status(500).json({ error: 'PDF_GENERATION_FAILED', message: err.message, stack: err.stack });
  } finally {
    if (browser) {
      await browser.close();
    }
  }
};
