"use client";

import { useState } from "react";
import Link from "next/link";

export default function Pricing() {
  const [status, setStatus] = useState("");

  return (
    <main className="min-h-screen bg-white text-gray-900 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Simple, Transparent Pricing</h1>
          <p className="text-lg text-gray-600">
            Choose the plan that works best for your podcast transcription needs
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="border rounded-lg p-6 bg-white shadow-sm">
            <h3 className="font-semibold text-lg mb-2">Free</h3>
            <p className="text-2xl font-bold mb-2">$0</p>
            <ul className="text-sm text-gray-600 space-y-2 mb-4">
              <li>✓ 1 transcript per month</li>
              <li>✓ Basic formatting</li>
              <li>✓ Email delivery</li>
            </ul>
            <Link 
              href="/"
              className="block w-full py-2 px-4 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition text-center"
            >
              Get Started
            </Link>
          </div>

          <div className="border rounded-lg p-6 bg-white shadow-sm border-primary relative">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary text-white text-xs px-3 py-1 rounded-full">
              POPULAR
            </div>
            <h3 className="font-semibold text-lg mb-2">Starter</h3>
            <p className="text-2xl font-bold mb-2">$3<span className="text-sm font-normal text-gray-500">/mo</span></p>
            <ul className="text-sm text-gray-600 space-y-2 mb-4">
              <li>✓ 5 hours of transcripts</li>
              <li>✓ Advanced formatting</li>
              <li>✓ Priority processing</li>
              <li>✓ Email delivery</li>
            </ul>
            <button 
              className="w-full py-2 px-4 bg-primary text-white rounded-md hover:bg-secondary transition"
              onClick={() => setStatus("Coming soon!")}
            >
              Upgrade
            </button>
          </div>

          <div className="border rounded-lg p-6 bg-white shadow-sm">
            <h3 className="font-semibold text-lg mb-2">Pro</h3>
            <p className="text-2xl font-bold mb-2">$10<span className="text-sm font-normal text-gray-500">/mo</span></p>
            <ul className="text-sm text-gray-600 space-y-2 mb-4">
              <li>✓ 10 hours of transcripts</li>
              <li>✓ Premium formatting</li>
              <li>✓ Priority processing</li>
              <li>✓ Email delivery</li>
              <li>✓ Bulk processing</li>
            </ul>
            <button 
              className="w-full py-2 px-4 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition"
              onClick={() => setStatus("Coming soon!")}
            >
              Upgrade
            </button>
          </div>
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm text-gray-500">
            All plans include a 7-day free trial. Fair use policy applies. Be cool 😎
          </p>
          <Link href="/" className="text-primary hover:text-secondary mt-4 inline-block">
            ← Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
} 