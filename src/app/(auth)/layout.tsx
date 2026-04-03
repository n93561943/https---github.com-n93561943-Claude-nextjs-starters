import Link from "next/link"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/50 px-4">
      {/* 로고 */}
      <Link href="/" className="mb-8 flex items-center gap-2 font-semibold text-lg">
        <span className="text-primary">✦</span>
        <span>스타터킷</span>
      </Link>

      {/* 인증 카드 */}
      <div className="w-full max-w-sm">{children}</div>

      {/* 하단 링크 */}
      <p className="mt-8 text-center text-sm text-muted-foreground">
        계속 진행하면{" "}
        <Link href="#" className="underline underline-offset-4 hover:text-foreground">
          이용약관
        </Link>{" "}
        및{" "}
        <Link href="#" className="underline underline-offset-4 hover:text-foreground">
          개인정보처리방침
        </Link>
        에 동의하는 것으로 간주됩니다.
      </p>
    </div>
  )
}
