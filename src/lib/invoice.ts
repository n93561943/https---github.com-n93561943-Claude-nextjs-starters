import type { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints"

// ─────────────────────────────────────────────
// 타입 정의
// ─────────────────────────────────────────────

/** 견적서 상태 (Notion DB Select 값과 일치) */
export type InvoiceStatus = "시작 전" | "진행 중" | "완료"

/** 견적서 품목 */
export interface InvoiceItem {
  /** 품목명 */
  name: string
  /** 수량 */
  quantity: number
  /** 단가 (원) */
  unitPrice: number
  /** 금액 = 수량 × 단가 */
  amount: number
}

/** 견적서 도메인 모델 */
export interface Invoice {
  /** Notion 페이지 ID */
  id: string
  /** 견적서 제목 */
  title: string
  /** 클라이언트명 */
  clientName: string
  /** 견적서 상태 */
  status: InvoiceStatus
  /** 발행일 (ISO 8601) */
  issuedAt: string | null
  /** 유효기간 (ISO 8601) */
  validUntil: string | null
  /** 공급사명 */
  supplierName: string
  /** 공급사 연락처 */
  supplierContact: string
  /** 메모 */
  memo: string
  /** 소계 (원) */
  subtotal: number
  /** 세금 (원) */
  tax: number
  /** 최종금액 (원) */
  totalAmount: number
  /** 견적서 품목 목록 (Items DB Relation에서 조회) */
  items: InvoiceItem[]
}

// ─────────────────────────────────────────────
// 상태 매핑
// ─────────────────────────────────────────────

/** 상태별 배지 색상 매핑 (shadcn Badge variant) */
export const INVOICE_STATUS_VARIANT: Record<
  InvoiceStatus,
  "default" | "secondary" | "outline" | "destructive"
> = {
  "시작 전": "secondary",
  "진행 중": "default",
  완료: "outline",
}

/** 상태별 한국어 레이블 */
export const INVOICE_STATUS_LABEL: Record<InvoiceStatus, string> = {
  "시작 전": "시작 전",
  "진행 중": "진행 중",
  완료: "완료",
}

/** 유효한 InvoiceStatus 값 목록 */
const VALID_STATUSES: InvoiceStatus[] = ["시작 전", "진행 중", "완료"]

/**
 * 문자열이 유효한 InvoiceStatus인지 확인
 */
function isInvoiceStatus(value: string): value is InvoiceStatus {
  return VALID_STATUSES.includes(value as InvoiceStatus)
}

// ─────────────────────────────────────────────
// 금액 포맷 유틸
// ─────────────────────────────────────────────

/**
 * 숫자를 한국 원화 형식으로 포맷
 * @example formatCurrency(1234567) → "₩1,234,567"
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("ko-KR", {
    style: "currency",
    currency: "KRW",
    maximumFractionDigits: 0,
  }).format(amount)
}

/**
 * ISO 날짜 문자열을 한국어 형식으로 포맷
 * @example formatDate("2024-01-15") → "2024년 1월 15일"
 */
export function formatDate(dateString: string | null): string {
  if (!dateString) return "-"
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(dateString))
}

// ─────────────────────────────────────────────
// Notion → Invoice 변환 유틸
// ─────────────────────────────────────────────

/**
 * Notion 페이지 속성에서 문자열 값 추출 헬퍼
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function extractText(property: any): string {
  if (!property) return ""

  switch (property.type) {
    case "title":
      return property.title?.map((t: { plain_text: string }) => t.plain_text).join("") ?? ""
    case "rich_text":
      return property.rich_text?.map((t: { plain_text: string }) => t.plain_text).join("") ?? ""
    case "email":
      return property.email ?? ""
    case "select":
      return property.select?.name ?? ""
    case "number":
      return String(property.number ?? 0)
    case "date":
      return property.date?.start ?? ""
    default:
      return ""
  }
}

/**
 * Notion number 속성에서 숫자 값 추출
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function extractNumber(property: any): number {
  if (!property) return 0
  if (property.type === "number") return property.number ?? 0
  return 0
}

/**
 * Notion relation 속성에서 연결된 페이지 ID 목록 추출
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function extractRelationIds(property: any): string[] {
  if (!property || property.type !== "relation") return []
  return property.relation?.map((r: { id: string }) => r.id) ?? []
}

/**
 * Items DB 페이지를 InvoiceItem으로 변환
 * Items DB 필드: 항목명(title), 수량(number), 단가(number)
 */
export function mapItemPageToInvoiceItem(page: PageObjectResponse): InvoiceItem {
  const props = page.properties
  const quantity = extractNumber(props["수량"])
  const unitPrice = extractNumber(props["단가"])
  return {
    name: extractText(props["항목명"]),
    quantity,
    unitPrice,
    amount: quantity * unitPrice,
  }
}

/**
 * Notion PageObjectResponse를 Invoice 도메인 모델로 변환
 * @param page - Invoices DB 페이지
 * @param relatedItemPages - 관계 연결된 Items DB 페이지 목록 (상세 조회 시 전달)
 */
export function mapPageToInvoice(
  page: PageObjectResponse,
  relatedItemPages?: PageObjectResponse[]
): Invoice {
  const props = page.properties

  const statusRaw = extractText(props["상태"])
  const status: InvoiceStatus = isInvoiceStatus(statusRaw) ? statusRaw : "시작 전"

  // 관계 연결 품목 페이지가 전달된 경우 변환, 없으면 빈 배열
  const items = relatedItemPages
    ? relatedItemPages.map(mapItemPageToInvoiceItem)
    : []

  // 소계·세금·최종금액을 품목 데이터에서 자동 계산
  const subtotal = items.reduce((sum, item) => sum + item.amount, 0)
  const tax = Math.round(subtotal * 0.1)
  const totalAmount = subtotal + tax

  return {
    id: page.id,
    title: extractText(props["제목"]),
    clientName: extractText(props["클라이언트명"]),
    status,
    issuedAt: extractText(props["발행일"]) || null,
    validUntil: extractText(props["유효기간"]) || null,
    supplierName: extractText(props["공급사명"]),
    supplierContact: extractText(props["공급사 연락처"]),
    memo: extractText(props["메모"]),
    subtotal,
    tax,
    totalAmount,
    items,
  }
}

/**
 * 공개 뷰어 공유 URL 생성
 * @param pageId - Notion 페이지 ID
 */
export function getPublicInvoiceUrl(pageId: string): string {
  const base = process.env.NEXT_PUBLIC_BASE_URL ?? ""
  return `${base}/invoice/${pageId}`
}
