'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { client } from '../../lib/sanity';
import toast from 'react-hot-toast';
import { validatePassword } from '../../lib/utils/validation';

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  isVerified: boolean;
} 

interface UserContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored user data on mount
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      // Query Sanity for user with matching email
      const result = await client.fetch(`
        *[_type == "user" && email == $email][0] {
          _id,
          name,
          email,
          password,
          role,
          isVerified
        }
      `, { email });

      if (!result) {
        toast.error('User not found');
        return;
      }

      // In a real app, you should hash passwords and use secure comparison
      if (result.password !== password) {
        toast.error('Invalid password');
        return;
      }

      // Remove password from user object before storing
      const { password: _, ...userWithoutPassword } = result;
      
      // Store user data
      setUser(userWithoutPassword);
      localStorage.setItem('user', JSON.stringify(userWithoutPassword));

      // Update last login time in Sanity
      await client
        .patch(result._id)
        .set({ lastLoginAt: new Date().toISOString() })
        .commit();

      toast.success('Logged in successfully');
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Failed to log in');
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    try {
      // Validate password
      const validation = validatePassword(password);
      if (!validation.isValid) {
        toast.error(validation.error || 'Invalid password');
        return;
      }

      // Check if user already exists
      const existingUser = await client.fetch(`
        *[_type == "user" && email == $email][0]
      `, { email });

      if (existingUser) {
        toast.error('Email already registered');
        return;
      }

      // Create new user in Sanity
      const newUser = await client.create({
        _type: 'user',
        name,
        email,
        password, // In a real app, hash this password
        role: 'user',
        isVerified: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString(),
        credits: 0,
        metadata: {
          totalOrders: 0,
          totalSpent: 0,
        }
      });

      // Remove password from user object before storing
      const { password: _, ...userWithoutPassword } = newUser;
      
      // Store user data
      setUser(userWithoutPassword);
      localStorage.setItem('user', JSON.stringify(userWithoutPassword));

      toast.success('Account created successfully');
    } catch (error) {
      console.error('Signup error:', error);
      toast.error('Failed to create account');
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    toast.success('Logged out successfully');
  };

  const updateProfile = async (updates: Partial<User>) => {
    if (!user) return;

    try {
      const updatedUser = await client
        .patch(user._id)
        .set({
          ...updates,
          updatedAt: new Date().toISOString()
        })
        .commit();

      // Cast the Sanity document to our User type and remove password
      const { password: _, ...userWithoutPassword } = updatedUser as unknown as User & { password?: string };
      setUser(userWithoutPassword);
      localStorage.setItem('user', JSON.stringify(userWithoutPassword));
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Profile update error:', error);
      toast.error('Failed to update profile');
    }
  };

  return (
    <UserContext.Provider value={{ user, loading, login, signup, logout, updateProfile }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
} 
