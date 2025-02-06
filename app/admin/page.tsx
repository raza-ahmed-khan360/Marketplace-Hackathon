import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

export default async function AdminDashboard() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <p>Welcome, {user ? user.given_name : 'Admin'}!</p>
    </div>
  );
}
