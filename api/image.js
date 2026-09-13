const path = require('path');
const fs = require('fs/promises');
const chromium = require('@sparticuz/chromium');
const puppeteer = require('puppeteer-core');
const { buildPdfHtml } = require('../utils/templateBuilder');

module.exports = async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const data = req.body || {};
    let browser;

    try {
        const cssPath = path.join(process.cwd(), 'style.css');
        const css = await fs.readFile(cssPath, 'utf8');

        let defaultLogoB64 = '';
        try {
            const logoBuf = await fs.readFile(
                path.join(process.cwd(), 'assets', 'logo.png')
            );
            defaultLogoB64 = `data:image/png;base64,${logoBuf.toString('base64')}`;
        } catch (e) {
            console.error('Failed to load default logo in API:', e.message);
        }

        const html = buildPdfHtml(data, css, defaultLogoB64);

        browser = await puppeteer.launch({
            args: chromium.args,
            defaultViewport: chromium.defaultViewport,
            executablePath: await chromium.executablePath(),
            headless: chromium.headless,
            ignoreHTTPSErrors: true,
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
            console.log(
                `setContent networkidle0 timed out: ${e.message}. Proceeding...`
            );
        }

        await page.evaluate(async () => {
            if (document.fonts && document.fonts.ready)
                await document.fonts.ready;
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
        res.status(500).json({
            error: 'IMAGE_GENERATION_FAILED',
            message: err.message,
        });
    } finally {
        if (browser) {
            try {
                await browser.close();
            } catch {
                // ignore
            }
        }
    }
};
