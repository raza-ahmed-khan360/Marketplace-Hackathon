'use client';
 
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAdmin } from '../../contexts/AdminContext';
import toast from 'react-hot-toast';

export default function AdminLogin() {
  const router = useRouter();
  const { adminLogin, isAdmin, loading } = useAdmin();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && isAdmin) {
      router.push('/admin/dashboard');
    }
  }, [isAdmin, loading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await adminLogin(formData.email, formData.password);
      toast.success('Logged in successfully!');
      router.push('/admin/dashboard');
    } catch (error) {
      toast.error('Invalid admin credentials');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-scales-off-white flex items-center justify-center font-inter">
        <p className="text-gray-scales-dark-gray">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-scales-off-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 font-inter">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="text-center text-3xl font-bold text-gray-scales-black">
            Admin Login
          </h2>
          <p className="mt-2 text-center text-sm text-gray-scales-dark-gray">
            Enter your credentials to access the admin panel
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-3xs shadow-sm space-y-4">
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
                autoComplete="current-password"
                required
                value={formData.password}
                onChange={handleInputChange}
                className="w-full h-[46px] px-4 rounded-3xs bg-gray-scales-white border border-gray-scales-light-gray focus:outline-none focus:ring-2 focus:ring-accents-accents/20 focus:border-accents-accents"
                placeholder="Password"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-3xs shadow-sm text-sm font-medium text-gray-scales-white bg-accents-accents hover:bg-accents-dark-accents focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accents-accents ${
                isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isSubmitting ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 