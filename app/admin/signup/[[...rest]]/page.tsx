import { SignUp } from '@clerk/nextjs'

export default function AdminSignupPage() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <SignUp path="/admin/signup" />
    </div>
  )
}
