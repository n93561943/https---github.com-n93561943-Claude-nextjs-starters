"use client"

// 인쇄/PDF 저장 버튼 — 모바일에서는 안내 메시지로 대체
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Printer } from "lucide-react"

export function PrintButton() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    // 터치 디바이스 또는 768px 미만 화면을 모바일로 판별
    setIsMobile("ontouchstart" in window || window.innerWidth < 768)
  }, [])

  if (isMobile) {
    return (
      <p className="text-center text-sm text-muted-foreground print:hidden">
        PDF 저장은 데스크탑 환경을 권장합니다.
      </p>
    )
  }

  return (
    <Button
      onClick={() => window.print()}
      variant="outline"
      className="print:hidden"
    >
      <Printer className="mr-2 h-4 w-4" />
      PDF 저장
    </Button>
  )
}
