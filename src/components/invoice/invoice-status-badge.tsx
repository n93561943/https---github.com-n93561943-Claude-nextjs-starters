// 견적서 상태 배지 컴포넌트 (순수 표시용)
import { Badge } from "@/components/ui/badge"
import { INVOICE_STATUS_VARIANT } from "@/lib/invoice"
import type { InvoiceStatus } from "@/lib/invoice"

interface InvoiceStatusBadgeProps {
  status: InvoiceStatus
}

export function InvoiceStatusBadge({ status }: InvoiceStatusBadgeProps) {
  return <Badge variant={INVOICE_STATUS_VARIANT[status]}>{status}</Badge>
}
