"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Copy, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getPublicInvoiceUrl } from "@/lib/invoice"

interface CopyLinkButtonProps {
  pageId: string
}

/**
 * 견적서 공개 링크를 클립보드에 복사하는 버튼
 * 복사 성공 시 1~2초간 Check 아이콘으로 피드백 표시
 */
export function CopyLinkButton({ pageId }: CopyLinkButtonProps) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    const url = getPublicInvoiceUrl(pageId)
    try {
      await navigator.clipboard.writeText(url)
      toast.success("링크가 복사되었습니다.")
      setCopied(true)
      // 2초 후 원래 아이콘으로 복원
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error("링크 복사에 실패했습니다.")
    }
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleCopy}
      aria-label="공개 링크 복사"
    >
      {copied ? (
        <Check className="h-4 w-4 text-green-500" />
      ) : (
        <Copy className="h-4 w-4" />
      )}
    </Button>
  )
}
