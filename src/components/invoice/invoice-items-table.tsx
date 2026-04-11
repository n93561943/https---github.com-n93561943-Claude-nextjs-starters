// 견적서 품목 테이블 컴포넌트 (모바일 가로 스크롤 지원)
import { formatCurrency } from "@/lib/invoice"
import type { InvoiceItem } from "@/lib/invoice"

interface InvoiceItemsTableProps {
  items: InvoiceItem[]
}

export function InvoiceItemsTable({ items }: InvoiceItemsTableProps) {
  return (
    // 모바일 환경에서 테이블 가로 스크롤 처리
    <div className="mb-8 overflow-x-auto rounded-lg border border-border">
      <table className="w-full min-w-[480px] text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/50">
            <th className="px-4 py-3 text-left font-medium text-muted-foreground">
              품목명
            </th>
            <th className="px-4 py-3 text-right font-medium text-muted-foreground">
              수량
            </th>
            <th className="px-4 py-3 text-right font-medium text-muted-foreground">
              단가
            </th>
            <th className="px-4 py-3 text-right font-medium text-muted-foreground">
              금액
            </th>
          </tr>
        </thead>
        <tbody>
          {items.length > 0 ? (
            items.map((item, index) => (
              <tr
                key={index}
                // invoice-item 클래스: 인쇄 시 행 분리 방지
                className="invoice-item border-b border-border last:border-0"
              >
                <td className="px-4 py-3 text-foreground">{item.name}</td>
                <td className="px-4 py-3 text-right text-foreground">
                  {item.quantity}
                </td>
                <td className="px-4 py-3 text-right text-foreground">
                  {formatCurrency(item.unitPrice)}
                </td>
                <td className="px-4 py-3 text-right font-medium text-foreground">
                  {formatCurrency(item.amount)}
                </td>
              </tr>
            ))
          ) : (
            // 품목이 없을 때 안내 메시지
            <tr>
              <td
                colSpan={4}
                className="px-4 py-8 text-center text-muted-foreground"
              >
                등록된 품목이 없습니다.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
