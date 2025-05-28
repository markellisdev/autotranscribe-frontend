"use client";

import { useState } from "react";
import { transcribePodcast } from "../lib/api";

export default function TestPage() {
  const [rssUrl, setRssUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const token = localStorage.getItem("supabase.auth.token");
      if (!token) {
        throw new Error("Please log in first");
      }

      const data = await transcribePodcast(rssUrl, token);
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-white text-gray-900 p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Test Transcription</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="rss" className="block text-sm font-medium text-gray-700 mb-1">
              Podcast RSS Feed URL
            </label>
            <input
              id="rss"
              type="url"
              value={rssUrl}
              onChange={(e) => setRssUrl(e.target.value)}
              required
              className="w-full p-3 rounded-lg border border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary"
              placeholder="https://example.com/podcast/feed.xml"
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg text-white font-medium ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-primary hover:bg-secondary"
            }`}
          >
            {loading ? "Transcribing..." : "Transcribe Podcast"}
          </button>
        </form>

        {result && (
          <div className="mt-8 p-6 bg-gray-50 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Result</h2>
            <pre className="whitespace-pre-wrap text-sm bg-white p-4 rounded border">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </main>
  );
} 