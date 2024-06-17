"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Cookies from 'js-cookie';

const url = "https://localhost:7126/api/account/Authenticate";

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (event) => {
    event.preventDefault(); 

    try {
      const response = await axios.post(url, {
        email: email,
        password: password,
      });
    
      const data = response.data;
      const token = data.jwToken; 
      const in60minutes = 1/24;
      
      Cookies.set('token', token, {expires : in60minutes})
    
      if (data.hasError) {
        setError(data.error || 'An error occurred. Please try again later.');
      } else {
        console.log('Login successful:', data);
        router.push('/dashboard');
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // The request was made and the server responded with a status code that falls out of the range of 2xx
        setError(error.response?.data.message  || 'Invalid email or password.');
      } else {
        // Something happened in setting up the request that triggered an Error
        setError('An error occurred. Please try again later.');
      }
    };

  } 

  return (
    <div className="flex items-center justify-center h-screen bg-cover bg-center" style={{ backgroundImage: "url('https://dragon2000-multisite.s3.eu-west-2.amazonaws.com/wp-content/uploads/sites/203/2021/05/19110448/Car-Station-Home-page-hero-2_result.jpg?height=1080&width=1920')" }}>
    <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg dark:bg-gray-800">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Car Dealership Login</h1>
        </div>
        {error && <p className="text-red-500 text-center">{error}</p>}
        <form className="space-y-6 mt-8" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="email">
              Email
            </label>
            <div className="mt-1">
              <input
                autoComplete="email"
                className="block w-full px-3 py-2 border border-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                id="email"
                name="email"
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="password">
              Password
            </label>
            <div className="mt-1">
              <input
                autoComplete="current-password"
                className="block w-full px-3 py-2 border border-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                id="password"
                name="password"
                required
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600"
                id="remember-me"
                name="remember-me"
                type="checkbox"
              />
              <label className="ml-2 block text-sm text-gray-900 dark:text-gray-300" htmlFor="remember-me">
                Remember me
              </label>
            </div>
            <div className="text-sm">
              <a
                className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
                href="#"
              >
                Forgot your password?
              </a>
            </div>
          </div>
          <div>
            <button
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-400"
              type="submit"
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
