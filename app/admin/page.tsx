import React from 'react';
import Link from 'next/link';

const AdminDashboard = () => {
  return (
    <div>
      <h1>Admin Dashboard</h1>
      <ul>
        <li><Link href="/admin/products">Manage Products</Link></li>
        <li><Link href="/admin/orders">Manage Orders</Link></li>
        <li><Link href="/admin/users">Manage Users</Link></li>
      </ul>
    </div>
  );
};

export default AdminDashboard;
