import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getInvoiceWithItems } from "@/lib/notion"
import { mapPageToInvoice } from "@/lib/invoice"
import { InvoiceHeader } from "@/components/invoice/invoice-header"
import { InvoiceItemsTable } from "@/components/invoice/invoice-items-table"
import { InvoiceSummary } from "@/components/invoice/invoice-summary"
import { PrintButton } from "@/components/invoice/print-button"

// ISR: 60초마다 재검증
export const revalidate = 60

interface PublicInvoicePageProps {
  params: Promise<{ pageId: string }>
}

export async function generateMetadata({
  params,
}: PublicInvoicePageProps): Promise<Metadata> {
  const { pageId } = await params
  const result = await getInvoiceWithItems(pageId)

  if (!result) {
    return { title: "견적서를 찾을 수 없습니다" }
  }

  const invoice = mapPageToInvoice(result.page, result.itemPages)

  return {
    title: `${invoice.title} | Invoice Web`,
    description: `${invoice.clientName} 견적서`,
    openGraph: {
      title: invoice.title,
      description: invoice.clientName,
    },
  }
}

/**
 * 공개 견적서 뷰어 페이지
 * Notion 페이지 ID로 견적서 데이터를 조회하여 렌더링
 */
export default async function PublicInvoicePage({
  params,
}: PublicInvoicePageProps) {
  const { pageId } = await params

  // 환경변수 누락 시 명확한 에러 메시지 표시
  if (!process.env.NOTION_API_KEY || !process.env.NOTION_DATABASE_ID) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-12">
        <div className="rounded-lg border border-destructive bg-destructive/10 p-8 text-center">
          <p className="font-semibold text-destructive">설정 오류</p>
          <p className="mt-2 text-sm text-muted-foreground">
            NOTION_API_KEY 또는 NOTION_DATABASE_ID 환경변수가 설정되지
            않았습니다.
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            .env.local 파일을 확인해주세요.
          </p>
        </div>
      </main>
    )
  }

  const result = await getInvoiceWithItems(pageId)

  // 페이지를 찾지 못하면 404 처리
  if (!result) {
    notFound()
  }

  const invoice = mapPageToInvoice(result.page, result.itemPages)

  return (
    <main className="mx-auto max-w-4xl px-4 py-12">
      {/* 1. 헤더: 제목, 공급사 정보, 메타 그리드 */}
      <InvoiceHeader invoice={invoice} />

      {/* 2. 품목 테이블 */}
      <InvoiceItemsTable items={invoice.items} />

      {/* 3. 금액 합계 */}
      <InvoiceSummary
        subtotal={invoice.subtotal}
        tax={invoice.tax}
        totalAmount={invoice.totalAmount}
      />

      {/* 4. 메모 (있는 경우만 렌더링) */}
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

      {/* 5. 인쇄/PDF 버튼 — 최하단 중앙 정렬 */}
      <div className="mt-10 flex justify-center">
        <PrintButton />
      </div>
    </main>
  )
}
