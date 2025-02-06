import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

export default async function UserDashboard() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  return (
    <div>
      <h1>User Dashboard</h1>
      <p>Welcome, {user.given_name}!</p>
    </div>
  );
}
