// 견적서 금액 합계 컴포넌트 (소계·세금·최종금액 우측 정렬)
import { formatCurrency } from "@/lib/invoice"

interface InvoiceSummaryProps {
  subtotal: number
  tax: number
  totalAmount: number
}

export function InvoiceSummary({
  subtotal,
  tax,
  totalAmount,
}: InvoiceSummaryProps) {
  return (
    <div className="flex justify-end">
      <div className="w-full max-w-xs space-y-2 rounded-lg border border-border p-6">
        {/* 소계 */}
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">소계</span>
          <span className="text-foreground">{formatCurrency(subtotal)}</span>
        </div>
        {/* 세금 (VAT 10%) */}
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">세금 (VAT)</span>
          <span className="text-foreground">{formatCurrency(tax)}</span>
        </div>
        {/* 구분선 + 최종금액 강조 */}
        <div className="border-t border-border pt-2">
          <div className="flex justify-between">
            <span className="font-semibold text-foreground">최종금액</span>
            <span className="font-bold text-foreground">
              {formatCurrency(totalAmount)}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
