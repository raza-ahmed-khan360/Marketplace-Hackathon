import { SignIn } from '@clerk/nextjs'

export default function UserLoginPage() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <SignIn path="/user/login" />
    </div>
  )
}
