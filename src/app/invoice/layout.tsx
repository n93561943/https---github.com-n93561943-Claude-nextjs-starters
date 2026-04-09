import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "견적서 | Invoice Web",
  description: "Invoice Web — 노션 기반 견적서 공유 서비스",
}

/**
 * 공개 견적서 뷰어 레이아웃
 * - 사이드바/헤더 없이 견적서 내용에 집중
 * - PDF 인쇄 시 깔끔한 출력을 위해 최소한의 래퍼만 사용
 */
export default function InvoiceLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background">
      {children}
    </div>
  )
}
