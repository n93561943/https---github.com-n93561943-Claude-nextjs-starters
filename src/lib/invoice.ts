import type { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints/common"

// ─────────────────────────────────────────────
// 타입 정의
// ─────────────────────────────────────────────

/** 견적서 상태 (Notion DB Select 값과 일치) */
export type InvoiceStatus = "초안" | "발송됨" | "승인됨" | "거절됨"

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
  /** 견적서 품목 목록 (Rich Text JSON에서 파싱) */
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
  초안: "secondary",
  발송됨: "default",
  승인됨: "outline",
  거절됨: "destructive",
}

/** 상태별 한국어 레이블 */
export const INVOICE_STATUS_LABEL: Record<InvoiceStatus, string> = {
  초안: "초안",
  발송됨: "발송됨",
  승인됨: "승인됨",
  거절됨: "거절됨",
}

/** 유효한 InvoiceStatus 값 목록 */
const VALID_STATUSES: InvoiceStatus[] = ["초안", "발송됨", "승인됨", "거절됨"]

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
 * Rich Text 속성에서 숫자 값 추출
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function extractNumber(property: any): number {
  if (!property) return 0
  if (property.type === "number") return property.number ?? 0
  return 0
}

/**
 * 품목 데이터를 Rich Text의 JSON 문자열에서 파싱
 * 저장 형식 예시: '[{"name":"웹 개발","quantity":1,"unitPrice":1000000}]'
 */
function parseItems(raw: string): InvoiceItem[] {
  try {
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []

    return parsed.map((item) => ({
      name: String(item.name ?? ""),
      quantity: Number(item.quantity ?? 0),
      unitPrice: Number(item.unitPrice ?? 0),
      amount: Number(item.quantity ?? 0) * Number(item.unitPrice ?? 0),
    }))
  } catch {
    return []
  }
}

/**
 * Notion PageObjectResponse를 Invoice 도메인 모델로 변환
 */
export function mapPageToInvoice(page: PageObjectResponse): Invoice {
  const props = page.properties

  const statusRaw = extractText(props["상태"])
  const status: InvoiceStatus = isInvoiceStatus(statusRaw) ? statusRaw : "초안"

  const itemsRaw = extractText(props["품목"])
  const items = parseItems(itemsRaw)

  const subtotal = extractNumber(props["소계"])
  const tax = extractNumber(props["세금"])
  const totalAmount = extractNumber(props["최종금액"])

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
