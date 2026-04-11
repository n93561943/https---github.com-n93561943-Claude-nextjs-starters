// 견적서 헤더 컴포넌트 (공급사 정보, 제목, 메타 정보 표시)
import { InvoiceStatusBadge } from "@/components/invoice/invoice-status-badge"
import { formatDate } from "@/lib/invoice"
import type { Invoice } from "@/lib/invoice"

interface InvoiceHeaderProps {
  invoice: Invoice
}

export function InvoiceHeader({ invoice }: InvoiceHeaderProps) {
  return (
    <div className="mb-8">
      {/* 제목 + 상태 배지 행 */}
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h1 className="truncate text-2xl font-bold text-foreground">
            {invoice.title}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {invoice.supplierName}
          </p>
          {invoice.supplierContact && (
            <p className="text-sm text-muted-foreground">
              {invoice.supplierContact}
            </p>
          )}
        </div>
        {/* 상태 배지 — 모바일에서 줄바꿈 방지 */}
        <div className="shrink-0 pt-1">
          <InvoiceStatusBadge status={invoice.status} />
        </div>
      </div>

      {/* 견적서 메타 정보 그리드 */}
      <div className="mt-6 grid grid-cols-2 gap-4 rounded-lg border border-border p-6 sm:grid-cols-4">
        {/* 클라이언트 */}
        <div>
          <p className="text-xs text-muted-foreground">클라이언트</p>
          <p className="mt-1 text-sm font-medium text-foreground">
            {invoice.clientName || "-"}
          </p>
        </div>
        {/* 발행일 */}
        <div>
          <p className="text-xs text-muted-foreground">발행일</p>
          <p className="mt-1 text-sm font-medium text-foreground">
            {formatDate(invoice.issuedAt)}
          </p>
        </div>
        {/* 유효기간 */}
        <div>
          <p className="text-xs text-muted-foreground">유효기간</p>
          <p className="mt-1 text-sm font-medium text-foreground">
            {formatDate(invoice.validUntil)}
          </p>
        </div>
        {/* 상태 */}
        <div>
          <p className="text-xs text-muted-foreground">상태</p>
          <div className="mt-1">
            <InvoiceStatusBadge status={invoice.status} />
          </div>
        </div>
      </div>
    </div>
  )
}
