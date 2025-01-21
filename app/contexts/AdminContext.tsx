'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface AdminContextType {
  isAdmin: boolean;
  adminLogin: (email: string, password: string) => Promise<void>;
  adminLogout: () => void;
  loading: boolean;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Check admin status on mount
  useEffect(() => {
    const adminToken = localStorage.getItem('adminToken');
    setIsAdmin(!!adminToken);
    setLoading(false);
  }, []);

  const adminLogin = async (email: string, password: string) => {
    // In a real application, validate against your backend
    if (email === 'admin@example.com' && password === 'admin123') {
      localStorage.setItem('adminToken', 'admin-token');
      setIsAdmin(true);
      return;
    }
    throw new Error('Invalid admin credentials');
  };

  const adminLogout = () => {
    localStorage.removeItem('adminToken');
    setIsAdmin(false);
    router.push('/admin/login');
  };

  return (
    <AdminContext.Provider value={{ isAdmin, adminLogin, adminLogout, loading }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
} 