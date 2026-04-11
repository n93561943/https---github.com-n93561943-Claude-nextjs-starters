import type { Metadata } from "next"
import { Suspense } from "react"
import { getInvoicesWithItems } from "@/lib/notion"
import { mapPageToInvoice } from "@/lib/invoice"
import type { InvoiceStatus } from "@/lib/invoice"
import { InvoiceTable } from "@/components/invoice/invoice-table"
import { InvoiceStatusFilter } from "@/components/invoice/invoice-status-filter"

export const metadata: Metadata = {
  title: "견적서 목록 | Invoice Web",
  robots: { index: false },
}

// 60초마다 ISR 재검증
export const revalidate = 60

interface InvoicesPageProps {
  searchParams: Promise<{ status?: string }>
}

/** 유효한 InvoiceStatus 값 목록 (Notion DB 실제 옵션과 일치) */
const VALID_STATUSES: InvoiceStatus[] = ["시작 전", "진행 중", "완료"]

/**
 * F-007: Admin 견적서 목록 조회
 * F-008: 공유 링크 복사
 * F-009: 상태 필터
 *
 * Notion DB에서 견적서 목록을 조회하여 테이블로 표시
 * searchParams.status 값으로 Notion API 필터 적용
 */
export default async function InvoicesPage({ searchParams }: InvoicesPageProps) {
  const { status } = await searchParams

  // 유효한 상태 값일 경우에만 Notion 필터 생성
  const isValidStatus = status && VALID_STATUSES.includes(status as InvoiceStatus)
  const filter = isValidStatus
    ? { property: "상태", select: { equals: status } }
    : undefined

  let invoices: ReturnType<typeof mapPageToInvoice>[] = []
  let error: string | null = null

  try {
    const results = await getInvoicesWithItems(filter)
    invoices = results.map(({ page, itemPages }) => mapPageToInvoice(page, itemPages))
  } catch (err) {
    error =
      err instanceof Error
        ? err.message
        : "견적서 목록을 불러오지 못했습니다."
  }

  return (
    <div className="space-y-6">
      {/* 페이지 헤더 + 상태 필터 */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">견적서 목록</h1>
          <p className="text-muted-foreground">
            노션 데이터베이스와 연동된 견적서를 관리합니다.
          </p>
        </div>
        {/* useSearchParams 사용으로 Suspense 경계 필요 */}
        <Suspense
          fallback={
            <div className="h-10 w-[140px] animate-pulse rounded-md bg-muted" />
          }
        >
          <InvoiceStatusFilter />
        </Suspense>
      </div>

      {/* 에러 상태 */}
      {error && (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-8 text-center">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      {/* 견적서 테이블 (빈 목록 처리는 InvoiceTable 내부에서 담당) */}
      {!error && <InvoiceTable invoices={invoices} />}
    </div>
  )
}
