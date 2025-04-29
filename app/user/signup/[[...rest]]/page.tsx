import { SignUp } from '@clerk/nextjs'

export default function UserSignupPage() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <SignUp path="/user/signup" />
    </div>
  )
}
