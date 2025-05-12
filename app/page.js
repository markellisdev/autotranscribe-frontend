"use client";

import { useState } from "react";
import { useRouter } from "next/navigation"; // Import useRouter

function Spinner() {
  return (
    <div className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
  );
}

export default function Home() {
  const [rssUrl, setRssUrl] = useState("");
  const [status, setStatus] = useState("");
  const [fileUrl, setFileUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [inputError, setInputError] = useState(false);
  const router = useRouter(); // Initialize useRouter

  const handleLogout = async () => {
    // Call an API route to clear the cookie
    const response = await fetch('/api/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      // Redirect the user to the login page after successful logout
      router.push('/login');
    } else {
      console.error("Logout failed");
      setStatus("Logout failed. Please try again.");
    }
  };

  const handleSubmit = async () => {
    if (!rssUrl) {
      setStatus("Please enter a valid RSS feed URL.");
      setInputError(true); // NEW: trigger red border

      // Auto-clear after 10 seconds
      setTimeout(() => {
        setInputError(false);
      }, 10000);

      return;
    }

    setLoading(true);    // NEW
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
        setFileUrl(data.file || null);
        setStatus("✅ Transcript ready!");

        // Clear success status after 10s
        setTimeout(() => {
          setStatus("");
        }, 10000);

      } else {
        setFileUrl(null);
        setStatus(`❌ Error: ${data.error || "Something went wrong"}`);

        // ❗ DO NOT clear error — keep it visible
      }
    } catch (err) {
      setStatus("❌ Network error. Please try again.");
      // ❗ Again: do NOT auto-clear
    } finally {
      setLoading(false); // NEW
    }
  };

  return (
    <main className="min-h-screen bg-white text-gray-900 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-2xl text-center flex flex-col items-center"> {/* Added flex and items-center */}
        <h1 className="text-4xl font-bold mb-4 text-neutralDarkest">🎙️ AutoTranscribe</h1>
        <p className="text-lg text-gray-600 mb-6">
          Paste your podcast RSS feed. Get back a clean AI transcript.
        </p>

        <input
          type="text"
          placeholder="Enter podcast RSS feed URL"
          value={rssUrl}
          onChange={(e) => setRssUrl(e.target.value)}
          className={`w-full p-3 rounded-lg mb-4 shadow-sm transition ${
            inputError
              ? "border-red-500"
              : "border-gray-300"
          }`}
          style={{ borderWidth: "1px" }}
        />

        <button
          onClick={handleSubmit}
          disabled={loading}
          className={`px-6 py-3 rounded-lg text-lg shadow-sm flex items-center justify-center gap-2 transition ${
            loading
              ? "bg-gray-400 text-white cursor-not-allowed"
              : "bg-primary text-white hover:bg-secondary"
          }`}
        >
          {loading
            ? <><Spinner /> Transcribing...</>
            : <>▶️ Transcribe Latest</>}
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
          <button onClick={handleLogout} className="mt-4 px-4 py-2 rounded-md bg-gray-300 text-gray-700 hover:bg-gray-400">
            Logout
          </button>
        </div>

        <div className="mt-10">
          <h2 className="text-xl font-semibold mb-2">💰 Pricing</h2>
          <p className="text-gray-700">
            1 transcript free. $3/month for 10 hours worth of transcripts.
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