"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';

export function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password       
      });

      if (result?.error) {
        setError(result.error || 'Invalid email or password.');
      } else if (result?.ok) {
        router.push('/dashboard');
      } else {
        setError('An error occurred. Please try again later.');
      }
    } catch (error) {
      console.error('Sign in error:', error);
      setError('An error occurred. Please try again later.');
    }

    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center h-screen relative">
      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('https://cdn.motor1.com/images/mgl/2NA6qM/s1/2024-honda-cr-v-sport-l.jpg')" }}></div>
      <div className="absolute inset-0 backdrop-blur-sm bg-black/30"></div>
      <div className="relative z-10 w-full max-w-2xl p-10 bg-white rounded-lg shadow-lg">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900">Login</h1>
        </div>
        {error && <p className="text-red-500 text-center">{error}</p>}
        <form className="space-y-6 mt-8" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              autoComplete="email"
              className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              autoComplete="current-password"
              className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                Remember me
              </label>
            </div>
            <div className="text-sm">
              <a href="#" className="font-medium text-red-600 hover:text-red-500">
                Forgot your password?
              </a>
            </div>
          </div>
          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              disabled={loading}
            >
              {loading ? 'Loading...' : 'Sign In'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
