import { RegisterForm } from '@/components/ui/register-form'

export default function RegisterPage() {
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <RegisterForm className="w-full max-w-md" />
    </div>
  )
}