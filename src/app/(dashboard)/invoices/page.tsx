import type { Metadata } from "next"
import Link from "next/link"
import { getInvoices } from "@/lib/notion"
import {
  mapPageToInvoice,
  formatCurrency,
  formatDate,
  INVOICE_STATUS_VARIANT,
  INVOICE_STATUS_LABEL,
} from "@/lib/invoice"
import { Badge } from "@/components/ui/badge"

export const metadata: Metadata = {
  title: "견적서 목록 | Invoice Web",
  robots: { index: false },
}

/**
 * F-007: Admin 견적서 목록 조회
 * F-008: 공유 링크 복사
 *
 * Notion DB에서 견적서 목록을 조회하여 테이블로 표시
 */
export default async function InvoicesPage() {
  let invoices: ReturnType<typeof mapPageToInvoice>[] = []
  let error: string | null = null

  try {
    const pages = await getInvoices()
    invoices = pages.map(mapPageToInvoice)
  } catch (err) {
    error =
      err instanceof Error
        ? err.message
        : "견적서 목록을 불러오지 못했습니다."
  }

  return (
    <div className="space-y-6">
      {/* 페이지 헤더 */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">견적서 목록</h1>
        <p className="text-muted-foreground">
          노션 데이터베이스와 연동된 견적서를 관리합니다.
        </p>
      </div>

      {/* 에러 상태 */}
      {error && (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-8 text-center">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      {/* 빈 상태 */}
      {!error && invoices.length === 0 && (
        <div className="rounded-lg border border-border p-8 text-center text-muted-foreground">
          <p className="text-sm">등록된 견적서가 없습니다.</p>
        </div>
      )}

      {/* 견적서 목록 테이블 */}
      {!error && invoices.length > 0 && (
        <div className="overflow-hidden rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-muted/50">
              <tr>
                <th className="px-4 py-3 text-left font-medium">제목</th>
                <th className="px-4 py-3 text-left font-medium">클라이언트</th>
                <th className="px-4 py-3 text-left font-medium">상태</th>
                <th className="px-4 py-3 text-left font-medium">발행일</th>
                <th className="px-4 py-3 text-right font-medium">최종금액</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((invoice) => (
                <tr
                  key={invoice.id}
                  className="border-b border-border transition-colors last:border-0 hover:bg-muted/30"
                >
                  <td className="px-4 py-3">
                    <Link
                      href={`/invoices/${invoice.id}`}
                      className="font-medium hover:underline"
                    >
                      {invoice.title || "제목 없음"}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {invoice.clientName || "-"}
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={INVOICE_STATUS_VARIANT[invoice.status]}>
                      {INVOICE_STATUS_LABEL[invoice.status]}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {formatDate(invoice.issuedAt)}
                  </td>
                  <td className="px-4 py-3 text-right font-medium">
                    {formatCurrency(invoice.totalAmount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
