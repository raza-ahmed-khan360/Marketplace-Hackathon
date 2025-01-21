'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '../contexts/UserContext';
import { validatePassword } from '../../lib/utils/validation';
import toast from 'react-hot-toast';

type AuthMode = 'login' | 'signup';

export default function AuthPage() {
  const router = useRouter();
  const { login, signup } = useUser();
  const [mode, setMode] = useState<AuthMode>('login');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === 'signup') {
        const validation = validatePassword(formData.password);
        if (!validation.isValid) {
          toast.error(validation.error || 'Invalid password');
          setLoading(false);
          return;
        }
      }

      if (mode === 'login') {
        await login(formData.email, formData.password);
        router.push('/');
      } else {
        await signup(formData.name, formData.email, formData.password);
        router.push('/');
      }
    } catch (error) {
      console.error('Auth error:', error);
      toast.error('Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gray-scales-off-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 font-inter">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="text-center text-3xl font-bold text-gray-scales-black">
            {mode === 'login' ? 'Sign in to your account' : 'Create an account'}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-scales-dark-gray">
            {mode === 'login' ? (
              <>
                Don't have an account?{' '}
                <button
                  onClick={() => setMode('signup')}
                  className="font-medium text-accents-dark-accents hover:text-accents-accents"
                >
                  Sign up
                </button>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <button
                  onClick={() => setMode('login')}
                  className="font-medium text-accents-dark-accents hover:text-accents-accents"
                >
                  Sign in
                </button>
              </>
            )}
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-3xs shadow-sm space-y-4">
            {mode === 'signup' && (
              <div>
                <label htmlFor="name" className="sr-only">
                  Full Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full h-[46px] px-4 rounded-3xs bg-gray-scales-white border border-gray-scales-light-gray focus:outline-none focus:ring-2 focus:ring-accents-accents/20 focus:border-accents-accents"
                  placeholder="Full Name"
                />
              </div>
            )}
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                className="w-full h-[46px] px-4 rounded-3xs bg-gray-scales-white border border-gray-scales-light-gray focus:outline-none focus:ring-2 focus:ring-accents-accents/20 focus:border-accents-accents"
                placeholder="Email address"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                required
                value={formData.password}
                onChange={handleInputChange}
                className="w-full h-[46px] px-4 rounded-3xs bg-gray-scales-white border border-gray-scales-light-gray focus:outline-none focus:ring-2 focus:ring-accents-accents/20 focus:border-accents-accents"
                placeholder="Password"
              />
              {mode === 'signup' && (
                <p className="mt-2 text-sm text-gray-scales-dark-gray">
                  Password must be at least 8 characters long and contain uppercase, lowercase, number, and special character.
                </p>
              )}
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-3xs shadow-sm text-sm font-medium text-gray-scales-white bg-accents-accents hover:bg-accents-dark-accents focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accents-accents ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {loading 
                ? 'Processing...' 
                : mode === 'login'
                  ? 'Sign in'
                  : 'Sign up'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 