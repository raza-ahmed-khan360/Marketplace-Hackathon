'use client'
import React, { createContext, useContext, useEffect, useState } from 'react';
import { client } from '@/lib/sanity';

interface User {
  email: string;
  _id: string;
  name: string;
}

interface UsersContextProps {
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
}

const UsersContext = createContext<UsersContextProps | undefined>(undefined);

export const UsersProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    client.fetch('*[_type == "user"]').then((data) => {
      setUsers(data);
    });
  }, []);

  return (
    <UsersContext.Provider value={{ users, setUsers }}>
      {children}
    </UsersContext.Provider>
  );
};

export const useUsers = () => {
  const context = useContext(UsersContext);
  if (!context) {
    throw new Error('useUsers must be used within a UsersProvider');
  }
  return context;
};
