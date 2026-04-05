import Link from "next/link"
import { Separator } from "@/components/ui/separator"

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* 브랜드 */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold">스타터킷</h3>
            <p className="text-sm text-muted-foreground">
              Next.js 16 App Router 기반 모던 웹 스타터킷.
              빠르게 개발을 시작하세요.
            </p>
          </div>

          {/* 제품 */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold">제품</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="#" className="hover:text-foreground transition-colors">기능 소개</Link></li>
              <li><Link href="#" className="hover:text-foreground transition-colors">가격 정책</Link></li>
              <li><Link href="#" className="hover:text-foreground transition-colors">변경 이력</Link></li>
            </ul>
          </div>

          {/* 지원 */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold">지원</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="#" className="hover:text-foreground transition-colors">문서</Link></li>
              <li><Link href="#" className="hover:text-foreground transition-colors">GitHub</Link></li>
              <li><Link href="#" className="hover:text-foreground transition-colors">Discord</Link></li>
            </ul>
          </div>

          {/* 법적 고지 */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold">법적 고지</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="#" className="hover:text-foreground transition-colors">개인정보처리방침</Link></li>
              <li><Link href="#" className="hover:text-foreground transition-colors">이용약관</Link></li>
            </ul>
          </div>
        </div>

        <Separator className="my-6" />

        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            © 2026 스타터킷. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            Next.js 16 · React 19 · Tailwind CSS v4
          </p>
        </div>
      </div>
    </footer>
  )
}
