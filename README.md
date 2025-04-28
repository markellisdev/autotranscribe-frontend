# AutoTranscribe Frontend

This is the minimal frontend for AutoTranscribe:  
a simple service for turning podcast RSS feeds into clean AI-generated transcripts.

Built with Next.js and TailwindCSS — designed for clarity, speed, and ADHD-friendly focus.

---

## 🚀 How It Works

- User pastes a podcast RSS feed.
- Frontend sends it to the backend `/api/transcribe` endpoint.
- Displays real-time status updates (with spinner and error handling).
- Provides a direct download link for the finished transcript.

---

## ⚙️ Tech Stack

- Next.js 15
- TailwindCSS
- React Server Components (`app/` directory)
- Designed for Vercel deployment (zero-config)

---

## 🛠️ Running Locally

Install dependencies:

```bash
npm install
```

Start dev server
npm run dev

App will be available at:
http://localhost:3000
