'use client'
import React from 'react';
import { useUsers } from '@/app/contexts/UsersContext';

const ManageUsers = () => {
  const { users } = useUsers();

  return (
    <div>
      <h1>Manage Users</h1>
      <ul>
        {users.map((user) => (
          <li key={user._id}>{user.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default ManageUsers;
