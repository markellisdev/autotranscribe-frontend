"use client";

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function AuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Get the hash parameters from the URL
    const hash = window.location.hash;
    console.log('Full URL hash:', hash);
    
    if (hash) {
      // Parse the hash parameters
      const params = new URLSearchParams(hash.substring(1));
      const accessToken = params.get('access_token');
      const refreshToken = params.get('refresh_token');
      const type = params.get('type');

      console.log('Parsed auth parameters:', {
        accessToken: accessToken ? 'present' : 'missing',
        refreshToken: refreshToken ? 'present' : 'missing',
        type: type
      });

      if (accessToken && type === 'magiclink') {
        console.log('Storing tokens in localStorage...');
        // Store the tokens
        localStorage.setItem('accessToken', accessToken);
        if (refreshToken) {
          localStorage.setItem('refreshToken', refreshToken);
        }

        console.log('Verifying token with backend...');
        // Get user info to verify the token
        const headers = {
          'Authorization': `Bearer ${accessToken}`,
        };
        console.log('Request headers:', headers);
        
        fetch('http://localhost:8000/api/me', {
          method: 'GET',
          headers: headers,
          credentials: 'include',
        })
        .then(async response => {
          console.log('Backend response status:', response.status);
          const responseText = await response.text();
          console.log('Backend response text:', responseText);
          
          if (!response.ok) {
            throw new Error(`Failed to verify token: ${response.status} ${response.statusText}\nResponse: ${responseText}`);
          }
          
          try {
            const userData = JSON.parse(responseText);
            console.log('User data received:', userData);
            localStorage.setItem('user', JSON.stringify(userData));
            console.log('Redirecting to dashboard...');
            router.push('/dashboard');
          } catch (e) {
            throw new Error(`Failed to parse response: ${responseText}`);
          }
        })
        .catch(err => {
          console.error('Auth verification failed:', err);
          // Clear the hash to prevent infinite loop
          window.location.hash = '';
          router.push('/login?error=auth_failed');
        });
      } else {
        console.error('Invalid auth parameters:', { accessToken: !!accessToken, type });
        router.push('/login?error=invalid_params');
      }
    } else {
      console.error('No hash parameters found in URL');
      router.push('/login?error=no_params');
    }
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="inline-block w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <h1 className="text-xl font-semibold text-gray-900">Completing sign in...</h1>
        <p className="text-gray-600 mt-2">Please wait while we set up your account.</p>
      </div>
    </div>
  );
} 