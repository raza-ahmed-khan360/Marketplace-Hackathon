import { client } from '@/sanity/lib/client';
import { atom, useAtom } from 'jotai';
import { useEffect } from 'react';

interface User {
  email: string;
  _id: string;
  name: string;
}

// Base users atom
const usersAtom = atom<User[]>([]);

// Fetch users atom
const fetchUsersAtom = atom(
  null,
  async (get, set) => {
    const data = await client.fetch('*[_type == "user"]');
    set(usersAtom, data);
  }
);

// Set users atom
const setUsersAtom = atom(
  null,
  (get, set, newUsers: User[]) => {
    set(usersAtom, newUsers);
  }
);

/**
 * Custom hook to use users functionality
 */
export function useUsers() {
  const [users] = useAtom(usersAtom);
  const [, setUsers] = useAtom(setUsersAtom);
  const [, fetchUsers] = useAtom(fetchUsersAtom);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return { users, setUsers };
}
