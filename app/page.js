"use client";

import { useState } from "react";

export default function Home() {
  const [rssUrl, setRssUrl] = useState("");
  const [status, setStatus] = useState("");
  const [fileUrl, setFileUrl] = useState(null);

  const handleSubmit = async () => {
    if (!rssUrl) {
      setStatus("Please enter a valid RSS feed URL.");
      return;
    }

    setStatus("Processing...");

    try {
      const response = await fetch("/api/transcribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rss: rssUrl }),
      });

      const data = await response.json();
      console.log("Backend response:", data);
      
      if (response.ok) {
        setFileUrl(data.file || null); // this sets the download link if it exists
        setStatus("✅ Transcript ready!");
      } else {
        setFileUrl(null);
        setStatus(`❌ Error: ${data.error || "Something went wrong"}`);
      }
    } catch (err) {
      setStatus("❌ Network error. Please try again.");
    }
  };

  return (
    <main className="min-h-screen bg-white text-gray-900 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-2xl text-center">
        <h1 className="text-4xl font-bold mb-4">🎙️ AutoTranscribe</h1>
        <p className="text-lg text-gray-600 mb-6">
          Paste your podcast RSS feed. Get back a clean AI transcript.
        </p>

        <input
          type="text"
          placeholder="Enter podcast RSS feed URL"
          value={rssUrl}
          onChange={(e) => setRssUrl(e.target.value)}
          className="w-full p-3 rounded-lg border border-gray-300 mb-4 shadow-sm"
        />

        <button
          onClick={handleSubmit}
          className="bg-black text-white px-6 py-3 rounded-lg text-lg hover:bg-gray-800"
        >
          ▶️ Transcribe Latest
        </button>

        <p className="text-sm text-gray-400 mt-4">{status}</p>
        {fileUrl && (
          <a
            href={fileUrl}
            download
            className="text-blue-600 underline mt-2 inline-block"
          >
            ⬇️ Download Transcript
          </a>
        )}

        <div className="mt-10 text-left">
          <h2 className="text-xl font-semibold mb-2">✅ Features</h2>
          <ul className="list-disc list-inside text-gray-700">
            <li>Powered by OpenAI Whisper</li>
            <li>Fast & Accurate</li>
            <li>Download TXT or view HTML</li>
            <li>ADHD-friendly, creator-tested</li>
          </ul>
        </div>

        <div className="mt-10">
          <h2 className="text-xl font-semibold mb-2">💰 Pricing</h2>
          <p className="text-gray-700">
            1 transcript free. $3/month for unlimited personal use.
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Fair use policy applies. Be cool 😎
          </p>
        </div>

        <footer className="mt-10 text-sm text-gray-400">
          Built in a weekend. Inspired by Pieter Levels.
        </footer>
      </div>
    </main>
  );
}