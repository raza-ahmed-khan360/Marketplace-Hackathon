'use server';

import { auth, currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export default async function AdminDashboardPage() {
  const { userId } = await auth();  // ✅ await here

  if (!userId) {
    redirect('/admin/login');  // ✅ no need "return redirect", just call redirect
  }

  const user = await currentUser();

  const isAdmin = user?.publicMetadata?.role === 'admin';

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <h2 className="text-xl font-bold">Access Denied</h2>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      <p>Welcome Admin, {user?.firstName}</p>
    </div>
  );
}
