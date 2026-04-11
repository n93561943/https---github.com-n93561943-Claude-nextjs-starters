import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ChevronLeft, ExternalLink } from "lucide-react"
import { getInvoiceWithItems } from "@/lib/notion"
import { mapPageToInvoice, getPublicInvoiceUrl } from "@/lib/invoice"
import { InvoiceHeader } from "@/components/invoice/invoice-header"
import { InvoiceItemsTable } from "@/components/invoice/invoice-items-table"
import { InvoiceSummary } from "@/components/invoice/invoice-summary"
import { PrintButton } from "@/components/invoice/print-button"
import { CopyLinkButton } from "@/components/invoice/copy-link-button"
import { Button } from "@/components/ui/button"

interface InvoiceDetailPageProps {
  params: Promise<{ pageId: string }>
}

export async function generateMetadata({
  params,
}: InvoiceDetailPageProps): Promise<Metadata> {
  const { pageId } = await params
  const result = await getInvoiceWithItems(pageId)

  if (!result) {
    return { title: "견적서를 찾을 수 없습니다 | Invoice Web" }
  }

  const invoice = mapPageToInvoice(result.page, result.itemPages)

  return {
    title: `${invoice.title} | Invoice Web`,
    robots: { index: false },
  }
}

/**
 * Admin 견적서 상세 페이지
 * - 공개 링크 복사 버튼 (CopyLinkButton)
 * - 공개 뷰어 미리보기 버튼 (새 탭으로 열기)
 * - 견적서 본문 + PDF 저장 버튼
 */
export default async function InvoiceDetailPage({
  params,
}: InvoiceDetailPageProps) {
  const { pageId } = await params

  const result = await getInvoiceWithItems(pageId)

  if (!result) {
    notFound()
  }

  const invoice = mapPageToInvoice(result.page, result.itemPages)
  // 공개 뷰어 URL 생성
  const publicUrl = getPublicInvoiceUrl(pageId)

  return (
    <div className="space-y-6">
      {/* 상단 내비게이션 + 액션 영역 */}
      <div className="flex items-center justify-between gap-4">
        <Link
          href="/invoices"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ChevronLeft className="h-4 w-4" />
          견적서 목록
        </Link>

        {/* 액션 버튼 그룹 */}
        <div className="flex items-center gap-2">
          {/* 공개 링크 복사 */}
          <CopyLinkButton pageId={pageId} />

          {/* 공개 뷰어 미리보기 (새 탭) */}
          <Button variant="outline" size="sm" asChild>
            <a href={publicUrl} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="mr-2 h-4 w-4" />
              미리보기
            </a>
          </Button>
        </div>
      </div>

      {/* 견적서 본문 */}
      <div className="rounded-lg border border-border p-6">
        <InvoiceHeader invoice={invoice} />
        <InvoiceItemsTable items={invoice.items} />
        <InvoiceSummary
          subtotal={invoice.subtotal}
          tax={invoice.tax}
          totalAmount={invoice.totalAmount}
        />

        {/* 메모 */}
        {invoice.memo && (
          <div className="mt-8 rounded-lg border border-border p-6">
            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              메모
            </p>
            <p className="whitespace-pre-wrap text-sm text-foreground">
              {invoice.memo}
            </p>
          </div>
        )}

        {/* PDF 저장 버튼 */}
        <div className="mt-10 flex justify-center">
          <PrintButton />
        </div>
      </div>
    </div>
  )
}
