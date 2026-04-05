import type { Metadata } from "next"
import { RegisterForm } from "@/components/auth/register-form"

export const metadata: Metadata = {
  title: "회원가입",
  robots: { index: false },
}

export default function RegisterPage() {
  return <RegisterForm />
}
