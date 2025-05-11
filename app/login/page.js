"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (event) => {
    event.preventDefault();

    const response = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (response.ok && data.success) {
      router.push('/'); // Redirect to the main page after successful login
    } else {
      setError(data.message || 'Invalid credentials');
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#222', fontFamily: 'sans-serif', color: '#eee' }}> {/* Added background and text color to the container */}
      <div>
        <h1 style={{ color: '#eee' }}>Login</h1> {/* Added text color to the heading */}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="username" style={{ color: '#eee' }}>Username:</label> {/* Added text color to the label */}
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{ margin: '5px 0', padding: '8px', width: '200px', backgroundColor: '#333', color: '#eee', border: '1px solid #555' }}
              /* Added background, text, and border to the input */
            />
          </div>
          <div>
            <label htmlFor="password" style={{ color: '#eee' }}>Password:</label> {/* Added text color to the label */}
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ margin: '5px 0', padding: '8px', width: '200px', backgroundColor: '#333', color: '#eee', border: '1px solid #555' }}
              /* Added background, text, and border to the input */
            />
          </div>
          <button type="submit" style={{ padding: '10px 20px', marginTop: '10px', backgroundColor: '#555', color: '#eee', border: 'none', cursor: 'pointer' }}>Log In</button> {/* Added background and text color to the button */}
        </form>
      </div>
    </div>
  );
}