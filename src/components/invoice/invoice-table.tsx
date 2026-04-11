// 견적서 목록 테이블 컴포넌트 (서버 컴포넌트)
import Link from "next/link"
import type { Invoice } from "@/lib/invoice"
import { formatCurrency, formatDate } from "@/lib/invoice"
import { InvoiceStatusBadge } from "@/components/invoice/invoice-status-badge"
import { CopyLinkButton } from "@/components/invoice/copy-link-button"

interface InvoiceTableProps {
  invoices: Invoice[]
}

/**
 * 견적서 목록을 테이블로 렌더링
 * 빈 목록일 경우 안내 메시지 표시
 */
export function InvoiceTable({ invoices }: InvoiceTableProps) {
  if (invoices.length === 0) {
    return (
      <div className="rounded-lg border border-border p-12 text-center">
        <p className="text-sm text-muted-foreground">등록된 견적서가 없습니다.</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <table className="w-full text-sm">
        <thead className="border-b border-border bg-muted/50">
          <tr>
            <th className="px-4 py-3 text-left font-medium">제목</th>
            <th className="px-4 py-3 text-left font-medium">클라이언트</th>
            <th className="px-4 py-3 text-right font-medium">최종금액</th>
            <th className="px-4 py-3 text-left font-medium">상태</th>
            <th className="px-4 py-3 text-left font-medium">발행일</th>
            {/* 액션 컬럼: 공개 링크 복사 */}
            <th className="px-4 py-3 text-center font-medium">액션</th>
          </tr>
        </thead>
        <tbody>
          {invoices.map((invoice) => (
            <tr
              key={invoice.id}
              className="border-b border-border transition-colors last:border-0 hover:bg-muted/30"
            >
              {/* 제목: 클릭 시 어드민 상세 페이지로 이동 */}
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
              <td className="px-4 py-3 text-right font-medium tabular-nums">
                {formatCurrency(invoice.totalAmount)}
              </td>
              <td className="px-4 py-3">
                <InvoiceStatusBadge status={invoice.status} />
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                {formatDate(invoice.issuedAt)}
              </td>
              {/* 공개 링크 복사 버튼 */}
              <td className="px-4 py-3 text-center">
                <CopyLinkButton pageId={invoice.id} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
