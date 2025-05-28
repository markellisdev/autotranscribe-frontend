"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AuthCallback() {
  const router = useRouter();
  const [error, setError] = useState('');

  useEffect(() => {
    const hash = window.location.hash;
    if (!hash) {
      setError('No authentication information found.');
      return;
    }
    const params = new URLSearchParams(hash.substring(1));
    const accessToken = params.get('access_token');
    if (!accessToken) {
      setError('No access token found in callback.');
      return;
    }

    fetch('http://localhost:8000/api/auth/callback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ access_token: accessToken }),
    })
      .then(async (res) => {
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.detail || 'Authentication failed');
        }
        router.push('/dashboard');
      })
      .catch((err) => {
        setError(err.message || 'Authentication failed');
        setTimeout(() => router.push('/login'), 3000);
      });
  }, [router]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Authentication Error</h1>
          <p className="text-gray-600">{error}</p>
          <p className="text-gray-500 mt-2">Redirecting to login page...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center">
        <div className="inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Completing Authentication</h1>
        <p className="text-gray-600">Please wait while we log you in...</p>
      </div>
    </div>
  );
} 