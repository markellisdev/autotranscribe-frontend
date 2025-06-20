"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useUser, SignOutButton } from '@clerk/nextjs';

function Spinner() {
  return (
    <div className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
  );
}

export default function Home() {
  const [rssUrl, setRssUrl] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");
  const [fileUrl, setFileUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [inputError, setInputError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const router = useRouter();

  const { isSignedIn, user } = useUser();

  const SHOW_DEBUG = process.env.NODE_ENV !== 'production';

  const validateEmail = (email) => {
    return email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  };

  const getSafeEmail = () => {
    if (!isSignedIn || !user) return email;
    const emailObj = user?.primaryEmailAddress;
    return typeof emailObj?.emailAddress === "string" ? emailObj.emailAddress : "";
  };

  const handleEmailChange = (e) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    setEmailError(newEmail !== "" && !validateEmail(newEmail));
  };

  const handleSubmit = async () => {
    if (!email) {
      setEmailError(true);
      setStatus("Email is required");
      return;
    }
    
    if (!validateEmail(email)) {
      setEmailError(true);
      setStatus("Please enter a valid email address");
      return;
    }

    if (!rssUrl) {
      setInputError(true);
      setStatus("Please enter an RSS feed URL");
      return;
    }

    setLoading(true);
    setStatus("Processing your request...");

    try {
      const emailObj = user?.primaryEmailAddress;
      const safeEmail = isSignedIn && typeof emailObj?.emailAddress === "string"
        ? emailObj.emailAddress
        : email;

      console.log("📤 Submitting for:", safeEmail, typeof safeEmail);

      const response = await fetch('/api/transcribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          rssUrl,
          email: safeEmail,
        }),
      });

      if (!response.ok) {
        throw new Error('Transcription failed');
      }

      const data = await response.json();
      setFileUrl(data.fileUrl);
      setStatus("Transcription complete! Check your email for the transcript.");
    } catch (error) {
      setStatus("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-white text-gray-900 flex flex-col items-center justify-center p-6 relative">
      <div className="absolute top-4 right-4 flex gap-4">
        <Link href="/pricing" className="px-4 py-2 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 text-sm">
          View Plans
        </Link>
        <SignOutButton>
          <button className="px-4 py-2 rounded-md bg-accent text-white hover:bg-gray-400 text-sm">
            Logout
          </button>
        </SignOutButton>
      </div>
      <div className="w-full max-w-2xl text-center flex flex-col items-center">
        <h1 className="text-4xl font-bold mb-4 text-neutralDarkest">🎙️ AutoTranscribe</h1>
        <p className="text-lg text-gray-600 mb-6">
          Get your first podcast transcript for free. Just paste your RSS feed below.
        </p>

        <div className="w-full space-y-4">
          <div>
            <input
              type="text"
              placeholder="Enter podcast RSS feed URL"
              value={rssUrl}
              onChange={(e) => setRssUrl(e.target.value)}
              className={`w-full p-3 rounded-lg shadow-sm transition ${
                inputError
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
              style={{ borderWidth: "1px" }}
            />
            {inputError && (
              <p className="text-red-500 text-sm mt-1 text-left">Please enter an RSS feed URL</p>
            )}
          </div>

          {!isSignedIn ? (
            <div>
              <input
                type="email"
                placeholder="Enter your email address (required)"
                value={email}
                onChange={handleEmailChange}
                required
                className={`w-full p-3 rounded-lg shadow-sm transition ${
                  emailError ? "border-red-500" : "border-gray-300"
                }`}
                style={{ borderWidth: "1px" }}
              />
              {emailError && (
                <p className="text-red-500 text-sm mt-1 text-left">
                  Please enter a valid email address
                </p>
              )}
              <p className="text-sm text-gray-500 mt-1 text-left">
                Get one free transcript per month.{" "}
                <Link href="/pricing" className="text-primary hover:text-secondary">
                  View plans
                </Link>{" "}
                for more.
              </p>
            </div>
          ) : (
            <p className="text-sm text-gray-600 text-left w-full">
              You're signed in as <strong>{user.primaryEmailAddress.emailAddress}</strong>
            </p>
          )}
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className={`mt-4 px-6 py-3 rounded-lg text-lg shadow-sm flex items-center justify-center gap-2 transition ${
            loading
              ? "bg-gray-400 text-white cursor-not-allowed"
              : "bg-primary text-white hover:bg-secondary"
          }`}
        >
          {loading
            ? <><Spinner /> Transcribing...</>
            : <>▶️ Get Transcript</>}
        </button>

        <p className="text-sm text-gray-400 mt-4">{status}</p>

      {SHOW_DEBUG && (
        <p className="text-xs text-gray-400 mt-2">
          Debug: isSignedIn = {isSignedIn ? "✅ yes" : "❌ no"}
        </p>
      )}
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

        <footer className="mt-10 text-sm text-gray-400">
          <span>
            Built <s>in a weekend</s>. Inspired by Pieter Levels.
          </span>
        </footer>
      </div>
    </main>
  );
}