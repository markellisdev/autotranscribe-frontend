"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { loginWithMagicLink } from "../lib/api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const router = useRouter();

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    try {
      console.log('Attempting to send magic link to:', email);
      const response = await loginWithMagicLink(email);
      console.log('Login response:', response);
      
      if (response && response.message) {
        setSuccess(true);
      } else {
        throw new Error('Unexpected response format');
      }
    } catch (err) {
      console.error('Login error:', err);
      
      // Handle rate limiting error
      if (err.message.includes('Please wait')) {
        const waitTime = parseInt(err.message.match(/\d+/)[0]);
        setCountdown(waitTime);
        setError(`Too many requests. Please wait ${waitTime} seconds before trying again.`);
      } else {
        setError(err.message || 'Failed to send magic link. Please try again.');
      }
    }
  };

  return (
    <main className="min-h-screen bg-white text-gray-900 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
          <p className="text-gray-600">
            Log in to access your transcripts
          </p>
        </div>

        {success ? (
          <div className="text-center p-6 bg-green-50 rounded-lg">
            <h2 className="text-xl font-semibold text-green-700 mb-2">Check Your Email</h2>
            <p className="text-green-600">
              We&apos;ve sent a magic link to {email}. Click the link to log in.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full p-3 rounded-lg border border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary"
                placeholder="you@example.com"
                disabled={countdown > 0}
              />
            </div>

            {error && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="flex">
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">{error}</h3>
                    {countdown > 0 && (
                      <p className="mt-1 text-sm text-red-700">
                        You can try again in {countdown} seconds
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {success && (
              <div className="rounded-md bg-green-50 p-4">
                <div className="flex">
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-green-800">
                      Magic link sent! Check your email.
                    </h3>
                  </div>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={countdown > 0}
              className={`w-full py-3 rounded-lg text-white font-medium ${
                countdown > 0
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-primary hover:bg-secondary"
              }`}
            >
              {countdown > 0 ? `Wait ${countdown}s` : "Send Magic Link"}
            </button>
          </form>
        )}

        <p className="mt-6 text-center text-sm text-gray-600">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-primary hover:text-secondary font-medium">
            Sign up
          </Link>
        </p>
      </div>
    </main>
  );
}