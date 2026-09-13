const path = require('path');
const fs = require('fs/promises');
const syncFs = require('fs');
const express = require('express');
const puppeteer = require('puppeteer');
const { buildPdfHtml } = require('../utils/templateBuilder');

const app = express();
const PORT = process.env.PORT || 3000;
const ROOT = path.resolve(__dirname, '..');

// Load default logo base64 at startup
let DEFAULT_LOGO_B64 = '';
try {
    const buf = syncFs.readFileSync(path.join(ROOT, 'assets', 'logo.png'));
    DEFAULT_LOGO_B64 = `data:image/png;base64,${buf.toString('base64')}`;
    console.log('[Startup] Default logo loaded, size:', DEFAULT_LOGO_B64.length);
} catch (e) {
    console.error('[Startup] Failed to load default logo:', e.message);
}

// Cached CSS content for performance
let cachedCss = null;
async function getStyles() {
    if (!cachedCss || process.env.NODE_ENV !== 'production') {
        try {
            cachedCss = await fs.readFile(path.join(ROOT, 'style.css'), 'utf8');
        } catch (e) {
            console.error('[Styles] Error reading style.css:', e.message);
            cachedCss = '';
        }
    }
    return cachedCss;
}

app.use(express.json({ limit: '2mb' }));
app.use(express.static(ROOT));

app.post('/api/pdf', async (req, res) => {
    const data = req.body || {};
    let browser;
    try {
        const css = await getStyles();
        const html = buildPdfHtml(data, css, DEFAULT_LOGO_B64);

        browser = await puppeteer.launch({
            headless: 'new',
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
        });
        const page = await browser.newPage();

        await page.setViewport({
            width: 794,
            height: 1123,
            deviceScaleFactor: 2,
        });
        await page.emulateMediaType('screen');

        try {
            await page.setContent(html, {
                waitUntil: 'networkidle0',
                timeout: 4000,
            });
        } catch (e) {
            console.log(`setContent networkidle0 timed out: ${e.message}. Proceeding...`);
        }

        await page.evaluate(async () => {
            if (document.fonts && document.fonts.ready) await document.fonts.ready;
            const imgs = Array.from(document.querySelectorAll('img'));
            await Promise.all(
                imgs.map((img) => {
                    if (img.complete) return Promise.resolve();
                    return new Promise((resolve) => {
                        img.onload = resolve;
                        img.onerror = resolve;
                    });
                })
            );
        });

        const pdf = await page.pdf({
            format: 'A4',
            printBackground: true,
            margin: { top: 0, right: 0, bottom: 0, left: 0 },
        });

        const safeName = String(data?.studentName || 'Student')
            .replace(/[^\w\-]+/g, '_')
            .slice(0, 40);

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Length', pdf.length);
        res.setHeader(
            'Content-Disposition',
            `attachment; filename="CoverPage_${safeName}.pdf"`
        );
        res.end(pdf);
    } catch (err) {
        console.error('PDF Generation Error:', err);
        res.status(500).json({ error: 'PDF_GENERATION_FAILED' });
    } finally {
        if (browser) {
            try {
                await browser.close();
            } catch {
                // ignore
            }
        }
    }
});

app.post('/api/image', async (req, res) => {
    const data = req.body || {};
    let browser;
    try {
        const css = await getStyles();
        const html = buildPdfHtml(data, css, DEFAULT_LOGO_B64);

        browser = await puppeteer.launch({
            headless: 'new',
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
        });
        const page = await browser.newPage();

        await page.setViewport({
            width: 794,
            height: 1123,
            deviceScaleFactor: 3,
        });
        await page.emulateMediaType('screen');

        try {
            await page.setContent(html, {
                waitUntil: 'networkidle0',
                timeout: 4000,
            });
        } catch (e) {
            console.log(`setContent networkidle0 timed out: ${e.message}. Proceeding...`);
        }

        await page.evaluate(async () => {
            if (document.fonts && document.fonts.ready) await document.fonts.ready;
            const imgs = Array.from(document.querySelectorAll('img'));
            await Promise.all(
                imgs.map((img) => {
                    if (img.complete) return Promise.resolve();
                    return new Promise((resolve) => {
                        img.onload = resolve;
                        img.onerror = resolve;
                    });
                })
            );
        });

        const imageBuffer = await page.screenshot({
            type: 'png',
            fullPage: true,
            omitBackground: false,
        });

        const safeName = String(data?.studentName || 'Student')
            .replace(/[^\w\-]+/g, '_')
            .slice(0, 40);

        res.setHeader('Content-Type', 'image/png');
        res.setHeader('Content-Length', imageBuffer.length);
        res.setHeader(
            'Content-Disposition',
            `attachment; filename="CoverPage_${safeName}.png"`
        );
        res.end(imageBuffer);
    } catch (err) {
        console.error('Image Generation Error:', err);
        res.status(500).json({ error: 'IMAGE_GENERATION_FAILED' });
    } finally {
        if (browser) {
            try {
                await browser.close();
            } catch {
                // ignore
            }
        }
    }
});

app.get('/health', (_req, res) => res.json({ ok: true }));

app.listen(PORT, () => {
    console.log(`Cover Page Generator running on http://localhost:${PORT}`);
});
