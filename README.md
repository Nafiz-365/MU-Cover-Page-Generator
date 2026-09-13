# 📄 MU Cover Page Generator

A professional, high-fidelity cover page generator for Metropolitan University students. Featuring a real-time preview, dark mode, and high-quality server-side PDF exports.

### 🔗 Live Preview

🚀 **[Try it out here!](https://mu-cover-page-generator.vercel.app/)**

---

## ✨ Features

- **Perfect PDF Exports**: Generates identical, A4-perfect PDFs on both mobile and desktop without layout shifts.
- **Auto-Persist**: Your details are automatically saved in the browser so you don't have to type them twice.
- **Dynamic Themes**: Sleek, modern, and eye-friendly dark mode included.
- **Customizable**: Choose between standard Assignment or Lab Report templates.

## 💻 Local Development

Run both the frontend (Vite) and backend (Express & Puppeteer) concurrently:

```bash
npm install
npm run dev:all
```

Then open `http://localhost:5173` in your browser.

- **Frontend:** `http://localhost:5173`
- **Backend API:** `http://localhost:3000`

To build the frontend bundle for production:
```bash
npm run build
```

## 🛠️ Tech Stack

- **Frontend:** React 19, Tailwind CSS, Vite
- **Backend:** Node.js Express, Vercel Serverless Functions
- **PDF & Image Engine:** Puppeteer & Sparticuz Chromium
