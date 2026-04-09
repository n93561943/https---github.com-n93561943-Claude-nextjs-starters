import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getInvoiceByPageId } from "@/lib/notion"
import {
  mapPageToInvoice,
  formatCurrency,
  formatDate,
  INVOICE_STATUS_LABEL,
} from "@/lib/invoice"

// ISR: 60초마다 재검증
export const revalidate = 60

interface PublicInvoicePageProps {
  params: Promise<{ pageId: string }>
}

export async function generateMetadata({
  params,
}: PublicInvoicePageProps): Promise<Metadata> {
  const { pageId } = await params
  const page = await getInvoiceByPageId(pageId)

  if (!page) {
    return { title: "견적서를 찾을 수 없습니다" }
  }

  const invoice = mapPageToInvoice(page)

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
            NOTION_API_KEY 또는 NOTION_DATABASE_ID 환경변수가 설정되지 않았습니다.
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            .env.local 파일을 확인해주세요.
          </p>
        </div>
      </main>
    )
  }

  const page = await getInvoiceByPageId(pageId)

  // 페이지를 찾지 못하면 404 처리
  if (!page) {
    notFound()
  }

  const invoice = mapPageToInvoice(page)

  return (
    <main className="mx-auto max-w-4xl px-4 py-12">
      {/* 견적서 헤더 */}
      <div className="mb-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">{invoice.title}</h1>
            <p className="mt-1 text-sm text-muted-foreground">{invoice.supplierName}</p>
            {invoice.supplierContact && (
              <p className="text-sm text-muted-foreground">{invoice.supplierContact}</p>
            )}
          </div>
          {/* 상태 배지 */}
          <span className="shrink-0 rounded-full border border-border px-3 py-1 text-sm font-medium">
            {INVOICE_STATUS_LABEL[invoice.status]}
          </span>
        </div>
      </div>

      {/* 견적서 정보 */}
      <div className="mb-8 grid grid-cols-2 gap-4 rounded-lg border border-border p-6 sm:grid-cols-4">
        <div>
          <p className="text-xs text-muted-foreground">클라이언트</p>
          <p className="mt-1 text-sm font-medium text-foreground">{invoice.clientName || "-"}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">발행일</p>
          <p className="mt-1 text-sm font-medium text-foreground">{formatDate(invoice.issuedAt)}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">유효기간</p>
          <p className="mt-1 text-sm font-medium text-foreground">{formatDate(invoice.validUntil)}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">상태</p>
          <p className="mt-1 text-sm font-medium text-foreground">{INVOICE_STATUS_LABEL[invoice.status]}</p>
        </div>
      </div>

      {/* 품목 테이블 */}
      <div className="mb-8 overflow-hidden rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">품목명</th>
              <th className="px-4 py-3 text-right font-medium text-muted-foreground">수량</th>
              <th className="px-4 py-3 text-right font-medium text-muted-foreground">단가</th>
              <th className="px-4 py-3 text-right font-medium text-muted-foreground">금액</th>
            </tr>
          </thead>
          <tbody>
            {invoice.items.length > 0 ? (
              invoice.items.map((item, index) => (
                <tr
                  key={index}
                  className="border-b border-border last:border-0"
                >
                  <td className="px-4 py-3 text-foreground">{item.name}</td>
                  <td className="px-4 py-3 text-right text-foreground">{item.quantity}</td>
                  <td className="px-4 py-3 text-right text-foreground">{formatCurrency(item.unitPrice)}</td>
                  <td className="px-4 py-3 text-right font-medium text-foreground">{formatCurrency(item.amount)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">
                  등록된 품목이 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 합계 섹션 */}
      <div className="flex justify-end">
        <div className="w-full max-w-xs space-y-2 rounded-lg border border-border p-6">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">소계</span>
            <span className="text-foreground">{formatCurrency(invoice.subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">세금 (VAT)</span>
            <span className="text-foreground">{formatCurrency(invoice.tax)}</span>
          </div>
          <div className="border-t border-border pt-2">
            <div className="flex justify-between">
              <span className="font-semibold text-foreground">최종금액</span>
              <span className="font-bold text-foreground">{formatCurrency(invoice.totalAmount)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 메모 */}
      {invoice.memo && (
        <div className="mt-8 rounded-lg border border-border p-6">
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">메모</p>
          <p className="text-sm text-foreground whitespace-pre-wrap">{invoice.memo}</p>
        </div>
      )}
    </main>
  )
}
