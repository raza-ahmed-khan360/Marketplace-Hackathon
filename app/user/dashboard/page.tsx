'use server';

import { auth, currentUser } from '@clerk/nextjs/server';  // Fix import from server
import { redirect } from 'next/navigation';  // Correct redirect for server components

export default async function UserDashboardPage() {
  const { userId } = await auth();  // Await auth() to get userId

  if (!userId) {
    return redirect('/user/login');  // Redirect to login if not signed in
  }

  const user = await currentUser();  // Fetch user data

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">User Dashboard</h1>
      <p>Welcome, User {user?.firstName}</p>  {/* Show user's first name */}
    </div>
  );
}
