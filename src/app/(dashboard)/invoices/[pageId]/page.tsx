import type { Metadata } from "next"

interface InvoiceDetailPageProps {
  params: Promise<{ pageId: string }>
}

export async function generateMetadata({
  params,
}: InvoiceDetailPageProps): Promise<Metadata> {
  const { pageId } = await params
  return {
    title: `견적서 상세 ${pageId} | Invoice Web`,
    robots: { index: false },
  }
}

/**
 * Admin 견적서 상세 페이지
 *
 * TODO: pageId로 Notion 페이지를 조회하여 견적서 데이터 표시
 */
export default async function InvoiceDetailPage({
  params,
}: InvoiceDetailPageProps) {
  const { pageId } = await params

  return (
    <div className="space-y-6">
      {/* 페이지 헤더 */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">견적서 상세</h1>
        <p className="text-muted-foreground text-sm font-mono">{pageId}</p>
      </div>

      {/* TODO: 견적서 상세 정보 구현 */}
      <div className="rounded-lg border border-border p-8 text-center text-muted-foreground">
        <p className="text-sm">견적서 데이터를 불러오는 중입니다...</p>
      </div>
    </div>
  )
}
