'use client';

import { useState, Suspense } from 'react';
import toast from 'react-hot-toast';
export default function ProfilePage() {
  const { user, updateProfile } = useUser();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const updates: any = {
        name: formData.name,
      };

      if (formData.newPassword) {
        updates.password = formData.newPassword;
      }

      await updateProfile(updates);
      setFormData(prev => ({ ...prev, currentPassword: '', newPassword: '' }));
      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Profile update error:', error);
      toast.error('Failed to update profile.');
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

  if (!user) {
    return null;
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="min-h-screen bg-gray-scales-off-white py-12 px-4 sm:px-6 lg:px-8 font-inter">
        <div className="max-w-md mx-auto">
          <h1 className="text-3xl font-bold text-gray-scales-black mb-8">Profile Settings</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-scales-dark-gray">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleInputChange}
                className="mt-1 w-full h-[46px] px-4 rounded-3xs bg-gray-scales-white border border-gray-scales-light-gray focus:outline-none focus:ring-2 focus:ring-accents-accents/20 focus:border-accents-accents"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-scales-dark-gray">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                disabled
                value={formData.email}
                className="mt-1 w-full h-[46px] px-4 rounded-3xs bg-gray-scales-light-gray border border-gray-scales-light-gray cursor-not-allowed"
              />
            </div>

            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-scales-dark-gray">
                New Password
              </label>
              <input
                id="newPassword"
                name="newPassword"
                type="password"
                value={formData.newPassword}
                onChange={handleInputChange}
                className="mt-1 w-full h-[46px] px-4 rounded-3xs bg-gray-scales-white border border-gray-scales-light-gray focus:outline-none focus:ring-2 focus:ring-accents-accents/20 focus:border-accents-accents"
              />
            </div>

            <button
              type="submit"
              className={`w-full h-[46px] bg-accents-accents text-white rounded-3xs hover:bg-accents-dark-accents transition-colors ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={loading}
            >
              {loading ? 'Updating...' : 'Update Profile'}
            </button>
          </form>
        </div>
      </div>
    </Suspense>
  );
} 

function useUser(): { user: any; updateProfile: any; } {
  throw new Error('Function not implemented.');
}
