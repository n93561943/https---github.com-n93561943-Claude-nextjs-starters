# Invoice Web Viewer — 개발 로드맵

> 최종 업데이트: 2026-04-11
> 버전: v0.1.0
> PRD 버전: v0.1.0 (2026-04-06)

---

## 프로젝트 개요

### 목표

노션 데이터베이스를 데이터 소스로 활용하여, 프리랜서·소규모 에이전시가 클라이언트에게
전문적인 견적서를 링크 하나로 공유할 수 있는 웹 뷰어 MVP를 구축한다.

### 성공 지표 (KPI)

- [x] Admin이 견적서 공유 링크를 생성하여 클라이언트에게 전달 가능
- [x] Client가 URL 접근 후 3초 이내 견적서 내용 확인 가능 (ISR 캐시 기준)
- [x] Client가 PDF 다운로드 버튼으로 A4 1~2장 분량의 인쇄물 획득 가능
- [x] Admin 대시보드에서 전체 견적서 상태를 한눈에 조회 가능

### 현재 구현 상태 요약

이미 완료된 작업:

- `src/lib/notion.ts` — Notion API 클라이언트 및 `getInvoices()`, `getInvoicesWithItems()`, `getInvoiceByPageId()`, `getInvoiceWithItems()`, `getItemPagesByIds()` 구현 완료 (`databases.query` v2.3.0 사용)
- `src/lib/invoice.ts` — `Invoice` 타입, `InvoiceStatus`(`시작 전`|`진행 중`|`완료`, Notion DB 실제값 기준), `mapPageToInvoice()`, `mapItemPageToInvoiceItem()`, `extractRelationIds()`, `formatCurrency()`, `formatDate()`, `getPublicInvoiceUrl()`, `INVOICE_STATUS_VARIANT`, `INVOICE_STATUS_LABEL` 구현 완료
- `src/app/invoice/layout.tsx` — 공개 뷰어 레이아웃 구현 완료
- `src/app/invoice/[pageId]/page.tsx` — Notion 연동 및 견적서 뷰어 **구현 완료** (헤더·품목 테이블·합계·메모·404 처리·OG 메타·ISR)
- `src/app/(dashboard)/invoices/page.tsx` — Notion DB 조회 및 견적서 목록 테이블 **구현 완료** (상태 필터·ISR·품목 병렬 fetch·정확한 최종금액 표시)
- `src/app/(dashboard)/invoices/[pageId]/page.tsx` — Admin 상세 뷰 **구현 완료** (CopyLinkButton·미리보기 버튼 포함)
- `src/components/invoice/invoice-header.tsx` — 견적서 헤더 컴포넌트 구현 완료
- `src/components/invoice/invoice-status-badge.tsx` — 상태 배지 컴포넌트 구현 완료
- `src/components/invoice/invoice-items-table.tsx` — 품목 테이블 컴포넌트 구현 완료
- `src/components/invoice/invoice-summary.tsx` — 금액 합계 컴포넌트 구현 완료
- `src/components/invoice/print-button.tsx` — PDF 인쇄 버튼 (모바일 분기) 구현 완료
- `src/components/invoice/invoice-table.tsx` — Admin 목록 테이블 컴포넌트 구현 완료
- `src/components/invoice/copy-link-button.tsx` — 링크 복사 버튼 (toast·Check 아이콘) 구현 완료
- `src/components/invoice/invoice-status-filter.tsx` — 상태 필터 Select 컴포넌트 구현 완료
- `src/components/theme-toggle.tsx` — SSR/CSR Hydration 불일치 수정 완료 (`mounted` 상태 패턴)
- shadcn/ui `Badge`, `Button`, `Card`, `Select`, `Sheet`, `Separator` 관련 UI 컴포넌트 설치 완료

### 기술 스택

| 영역 | 기술 |
|------|------|
| 프레임워크 | Next.js 16 App Router (Server Components 기본) |
| 스타일 | Tailwind CSS v4 |
| UI 컴포넌트 | shadcn/ui (radix-nova 스타일) |
| Notion 연동 | `@notionhq/client` v2.3.0 (`databases.query` API) |
| 알림 | sonner |
| 아이콘 | lucide-react |
| 캐싱 | ISR (`revalidate: 60`) |

---

## 전체 로드맵 개요

```
Week 1                    Week 2                    Week 2.5
│                         │                         │
M1 — 기반 연동            M2 — 핵심 기능            M3 — Admin 대시보드
├─ F-001 Notion 연동 ✓    ├─ F-004 항목 테이블      ├─ F-007 목록 조회
├─ F-002 URL 라우팅 ✓     ├─ F-005 PDF 다운로드     ├─ F-008 링크 복사
└─ F-003 뷰어 레이아웃 ✓  └─ F-006 상태 배지        └─ (Admin 상세 뷰)
                                                     │
                                                     M4 — 품질 및 배포
                                                     └─ 반응형·인쇄 최적화
                                                        환경변수·OG 태그
                                                        Vercel 배포
```

> 참고: M1 기반 작업(F-001, F-002, F-003)은 라이브러리 및 라우트 스캐폴딩이 완료된 상태이므로,
> 실제 구현은 M2 핵심 UI 작업부터 시작한다. M1 체크리스트는 미완성 TODO 항목 기준으로 작성.

---

## Epic 목록

### Epic 1: 공개 견적서 뷰어
**목표**: 클라이언트가 링크만으로 견적서를 확인하고 PDF로 저장할 수 있다
**예상 기간**: 1.5주
**우선순위**: Must have

Features:
- Feature 1.1: Notion 데이터 연동 및 뷰어 레이아웃 | 예상: 1일
- Feature 1.2: 견적서 항목 테이블 및 금액 합계 | 예상: 1일
- Feature 1.3: 상태 배지 | 예상: 0.5일
- Feature 1.4: PDF 다운로드 | 예상: 1일

### Epic 2: Admin 대시보드
**목표**: Admin이 대시보드에서 견적서 목록을 조회하고 공유 링크를 복사할 수 있다
**예상 기간**: 1주
**우선순위**: Must have

Features:
- Feature 2.1: 견적서 목록 테이블 및 상태 필터 | 예상: 1.5일
- Feature 2.2: 공유 링크 복사 기능 | 예상: 0.5일
- Feature 2.3: Admin 견적서 상세 뷰 | 예상: 1일

### Epic 3: 품질 및 배포
**목표**: 프로덕션 환경에서 전체 플로우가 안정적으로 동작한다
**예상 기간**: 0.5주
**우선순위**: Must have

Features:
- Feature 3.1: 반응형 및 인쇄 CSS 최적화 | 예상: 1일
- Feature 3.2: 환경변수 설정 및 OG 태그 | 예상: 0.5일
- Feature 3.3: Vercel 배포 및 엔드투엔드 검증 | 예상: 0.5일

---

## 마일스톤별 상세 태스크

---

### M1 — 기반 연동 (현재 상태: 부분 완료)

**목표**: `/invoice/[pageId]`에서 Notion 데이터를 받아 기본 레이아웃에 표시

**완료 기준**:
- [x] 유효한 pageId로 접근 시 Notion에서 조회한 견적서 제목과 클라이언트명이 화면에 표시됨
- [x] 존재하지 않는 pageId 접근 시 Next.js 404 페이지로 리다이렉트됨
- [x] `NOTION_API_KEY`, `NOTION_DATABASE_ID` 환경변수 없이 실행 시 명확한 에러 메시지 출력됨
- [ ] Playwright MCP로 `/invoice/[pageId]` 정상 접근 및 404 케이스 E2E 검증 완료
- [ ] API 연동(Notion): 정상 응답, 존재하지 않는 pageId 오류 케이스 Playwright 시나리오 검증 완료

#### 태스크 목록

**[M1-T1] 공개 뷰어 페이지에 Notion 데이터 연결** (우선순위: 높음)

- [x] `src/app/invoice/[pageId]/page.tsx`의 TODO를 실제 구현으로 교체
- [x] `getInvoiceByPageId(pageId)` 호출 후 `null` 반환 시 `notFound()` 처리
- [x] `mapPageToInvoice(page)`로 도메인 모델 변환
- [x] `generateMetadata`에서 실제 견적서 제목을 OG title로 반환
- [x] ISR 설정: `export const revalidate = 60`

```typescript
// src/app/invoice/[pageId]/page.tsx 구현 골격
import { notFound } from "next/navigation"
import { getInvoiceByPageId } from "@/lib/notion"
import { mapPageToInvoice } from "@/lib/invoice"

export const revalidate = 60

export async function generateMetadata({ params }) {
  const { pageId } = await params
  const page = await getInvoiceByPageId(pageId)
  if (!page) return { title: "견적서를 찾을 수 없습니다" }
  const invoice = mapPageToInvoice(page)
  return {
    title: `${invoice.title} | Invoice Web`,
    description: `${invoice.clientName} 견적서`,
    openGraph: { title: invoice.title, description: invoice.clientName },
  }
}

export default async function PublicInvoicePage({ params }) {
  const { pageId } = await params
  const page = await getInvoiceByPageId(pageId)
  if (!page) notFound()
  const invoice = mapPageToInvoice(page)
  // 컴포넌트에 invoice 전달
}
```

**[M1-T2] .env.local 환경변수 파일 설정**

- [x] `.env.local` 파일 생성 (`.gitignore` 확인)
- [x] `NOTION_API_KEY=secret_...` 설정
- [x] `NOTION_DATABASE_ID=...` 설정
- [x] `NEXT_PUBLIC_BASE_URL=http://localhost:3001` 설정 (프로덕션은 Vercel URL)
- [x] `.env.example` 파일 생성하여 필요한 키 목록 문서화

```bash
# .env.example
NOTION_API_KEY=secret_여기에_Notion_Integration_키_입력
NOTION_DATABASE_ID=여기에_데이터베이스_ID_입력
NEXT_PUBLIC_BASE_URL=https://your-domain.vercel.app
```

---

### M2 — 핵심 기능 구현 (예상: 1주)

**목표**: 클라이언트가 링크로 견적서 전체 내용을 확인하고 PDF로 저장 가능

**완료 기준**:
- [ ] 견적서 항목 테이블(품목·수량·단가·금액)이 올바르게 표시됨
- [ ] 소계·세금(10%)·최종금액이 한국 원화 형식(₩)으로 표시됨
- [ ] 견적서 상태 배지가 상태에 따라 적절한 색상으로 표시됨
- [ ] "PDF 저장" 버튼 클릭 시 `window.print()` 실행됨
- [ ] 인쇄 미리보기에서 버튼·네비게이션 UI가 숨겨지고 A4 레이아웃이 유지됨
- [ ] Playwright MCP로 견적서 뷰어 핵심 흐름(항목 표시, 금액 계산, PDF 버튼) E2E 테스트 통과
- [ ] 빈 items 배열·극단적 금액값 경계값 케이스 Playwright 시나리오 검증 완료

#### 태스크 목록

**[M2-T1] InvoiceHeader 컴포넌트 구현** (우선순위: 높음)

- [ ] `src/components/invoice/invoice-header.tsx` 파일 생성
- [ ] 공급사명, 견적서 제목, 클라이언트명, 발행일, 유효기간 표시
- [ ] `InvoiceStatusBadge` 컴포넌트 포함 (아래 M2-T2)
- [ ] 모바일 375px 기준 반응형 레이아웃

```
생성 파일: src/components/invoice/invoice-header.tsx
의존성: src/lib/invoice.ts (Invoice 타입, formatDate)
사용 컴포넌트: shadcn/ui Badge (기존 설치됨)
```

**[M2-T2] InvoiceStatusBadge 컴포넌트 구현** (우선순위: 높음)

- [ ] `src/components/invoice/invoice-status-badge.tsx` 파일 생성
- [ ] `INVOICE_STATUS_VARIANT` 매핑을 활용하여 shadcn Badge 렌더링
- [ ] Props: `status: InvoiceStatus`

```typescript
// src/components/invoice/invoice-status-badge.tsx
"use client" 불필요 — 순수 표시 컴포넌트

import { Badge } from "@/components/ui/badge"
import { INVOICE_STATUS_VARIANT } from "@/lib/invoice"
import type { InvoiceStatus } from "@/lib/invoice"

interface InvoiceStatusBadgeProps {
  status: InvoiceStatus
}

export function InvoiceStatusBadge({ status }: InvoiceStatusBadgeProps) {
  return <Badge variant={INVOICE_STATUS_VARIANT[status]}>{status}</Badge>
}
```

**[M2-T3] InvoiceItemsTable 컴포넌트 구현** (우선순위: 높음)

- [ ] `src/components/invoice/invoice-items-table.tsx` 파일 생성
- [ ] 품목명·수량·단가·금액 4개 컬럼 테이블 구현
- [ ] `formatCurrency()`로 단가·금액 포맷
- [ ] 모바일에서 테이블 가로 스크롤 처리 (`overflow-x-auto`)
- [ ] 빈 items 배열 처리 (안내 메시지 표시)

```
생성 파일: src/components/invoice/invoice-items-table.tsx
의존성: src/lib/invoice.ts (InvoiceItem 타입, formatCurrency)
shadcn 컴포넌트: 현재 table.tsx 없음 → Tailwind로 직접 구현하거나 npx shadcn@latest add table 실행
```

> 주의: `shadcn/ui`의 `Table` 컴포넌트가 현재 설치되어 있지 않음.
> 옵션 A: `npx shadcn@latest add table` 실행 후 사용 (권장)
> 옵션 B: Tailwind CSS로 직접 `<table>` 스타일링

**[M2-T4] InvoiceSummary 컴포넌트 구현** (우선순위: 높음)

- [ ] `src/components/invoice/invoice-summary.tsx` 파일 생성
- [ ] 소계·세금(10%)·최종금액 표시
- [ ] `formatCurrency()`로 금액 포맷
- [ ] 우측 정렬 레이아웃 (견적서 관례)
- [ ] 최종금액 행 강조 (폰트 굵기, 구분선 등)

**[M2-T5] PrintButton 컴포넌트 구현** (우선순위: 높음, 클라이언트 컴포넌트)

- [ ] `src/components/invoice/print-button.tsx` 파일 생성
- [ ] `"use client"` 선언 필수 (`window.print()` 사용)
- [ ] 클릭 시 `window.print()` 호출
- [ ] shadcn `Button` 컴포넌트 활용
- [ ] 모바일 환경 안내 배너 분기 처리 (I-06 대응)

```typescript
// src/components/invoice/print-button.tsx
"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Printer } from "lucide-react"

export function PrintButton() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    // 터치 디바이스 감지
    setIsMobile("ontouchstart" in window || window.innerWidth < 768)
  }, [])

  if (isMobile) {
    return (
      <p className="text-sm text-muted-foreground text-center print:hidden">
        PDF 저장은 데스크탑 환경을 권장합니다.
      </p>
    )
  }

  return (
    <Button
      onClick={() => window.print()}
      variant="outline"
      className="print:hidden"
    >
      <Printer className="mr-2 h-4 w-4" />
      PDF 저장
    </Button>
  )
}
```

**[M2-T6] 공개 뷰어 페이지 완성** (우선순위: 높음)

- [ ] `src/app/invoice/[pageId]/page.tsx`에 모든 컴포넌트 조합
- [ ] 컴포넌트 배치 순서: InvoiceHeader → InvoiceItemsTable → InvoiceSummary → 메모 → PrintButton
- [ ] 공급사 연락처 표시 영역 추가

**[M2-T7] 인쇄 CSS 구현** (우선순위: 높음)

- [ ] `src/app/globals.css`에 `@media print` 스타일 추가
- [ ] 숨김 대상: 사이드바, 헤더, PrintButton (`.print:hidden` 클래스 활용)
- [ ] A4 레이아웃: `@page { size: A4; margin: 20mm; }`
- [ ] 페이지 나눔 방지: 테이블 행에 `break-inside: avoid`
- [ ] 배경색/그림자 비활성화: `print-color-adjust: exact` 고려

```css
/* globals.css 에 추가 */
@media print {
  @page {
    size: A4 portrait;
    margin: 20mm;
  }

  /* 인쇄 불필요 요소 숨김 */
  .print\:hidden {
    display: none !important;
  }

  /* 페이지 나눔 방지 */
  tr, .invoice-item {
    break-inside: avoid;
  }

  /* 배경색 유지 (상태 배지 등) */
  * {
    print-color-adjust: exact;
    -webkit-print-color-adjust: exact;
  }
}
```

---

### M3 — Admin 대시보드 (예상: 1주)

**목표**: Admin이 대시보드에서 모든 견적서를 조회하고 공유 링크를 클립보드에 복사 가능

**완료 기준**:
- [x] `/invoices`에서 Notion DB의 전체 견적서 목록이 테이블로 표시됨
- [x] 상태 필터(`?status=진행 중` 등) 적용 시 해당 상태 견적서만 표시됨
- [x] 각 행의 "링크 복사" 버튼 클릭 시 클립보드에 공개 URL이 복사되고 토스트 알림 표시됨
- [x] Admin 견적서 상세 페이지에서 견적서 전체 정보 확인 가능
- [x] Playwright MCP로 Admin 대시보드 핵심 흐름(목록 조회, 상태 필터, 링크 복사) E2E 테스트 통과 (TC-12~16 PASS)
- [x] API 연동(Notion 목록 조회): 정상 응답 및 빈 목록 케이스 Playwright 시나리오 검증 완료

#### 태스크 목록

**[M3-T1] InvoiceTable 컴포넌트 구현 (서버 컴포넌트)** (우선순위: 높음)

- [x] `src/components/invoice/invoice-table.tsx` 파일 생성
- [x] 컬럼: 제목·클라이언트명·최종금액·상태·발행일·액션
- [x] Props: `invoices: Invoice[]`
- [x] 금액은 `formatCurrency()`, 날짜는 `formatDate()` 사용
- [x] 상태 컬럼에 `InvoiceStatusBadge` 컴포넌트 사용
- [x] 각 행에 공유 링크 복사 버튼 포함 (클라이언트 컴포넌트 분리 필요)
- [x] 빈 목록 처리 (안내 메시지)

```
생성 파일: src/components/invoice/invoice-table.tsx
의존성: Invoice 타입, formatCurrency, formatDate, InvoiceStatusBadge
추가 컴포넌트: CopyLinkButton (M3-T2에서 생성)
```

**[M3-T2] CopyLinkButton 컴포넌트 구현 (클라이언트 컴포넌트)** (우선순위: 높음)

- [x] `src/components/invoice/copy-link-button.tsx` 파일 생성
- [x] `"use client"` 선언 필수 (`navigator.clipboard` 사용)
- [x] `getPublicInvoiceUrl(pageId)` 호출로 URL 생성
- [x] `navigator.clipboard.writeText(url)` 실행
- [x] 복사 성공 시 `sonner`의 `toast.success("링크가 복사되었습니다.")` 호출
- [x] 복사 실패 시 `toast.error("링크 복사에 실패했습니다.")` 호출
- [x] 복사 후 아이콘 변경 피드백 (Check 아이콘으로 1~2초간 전환)

```typescript
// src/components/invoice/copy-link-button.tsx
"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Copy, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getPublicInvoiceUrl } from "@/lib/invoice"

interface CopyLinkButtonProps {
  pageId: string
}

export function CopyLinkButton({ pageId }: CopyLinkButtonProps) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    const url = getPublicInvoiceUrl(pageId)
    try {
      await navigator.clipboard.writeText(url)
      toast.success("링크가 복사되었습니다.")
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error("링크 복사에 실패했습니다.")
    }
  }

  return (
    <Button variant="ghost" size="icon" onClick={handleCopy} aria-label="링크 복사">
      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
    </Button>
  )
}
```

**[M3-T3] InvoiceStatusFilter 컴포넌트 구현 (클라이언트 컴포넌트)** (우선순위: 중간)

- [x] `src/components/invoice/invoice-status-filter.tsx` 파일 생성
- [x] `"use client"` 선언 필수 (`useRouter`, `useSearchParams` 사용)
- [x] shadcn `Select` 컴포넌트 활용 (기존 설치됨)
- [x] 선택값 변경 시 `router.push(?status=값)` 처리
- [x] "전체" 옵션 포함 (파라미터 없는 상태)

```
생성 파일: src/components/invoice/invoice-status-filter.tsx
사용 훅: useRouter, useSearchParams (next/navigation)
사용 컴포넌트: shadcn Select (기존 설치됨)
```

**[M3-T4] Admin 견적서 목록 페이지 완성** (우선순위: 높음)

- [x] `src/app/(dashboard)/invoices/page.tsx` 구현
- [x] `searchParams`에서 `status` 파라미터 추출
- [x] 상태 필터가 있을 경우 Notion API 필터 조건 생성
- [x] `getInvoicesWithItems(filter)` 호출 후 `mapPageToInvoice(page, itemPages)` 일괄 변환 (품목 병렬 fetch로 최종금액 정확 표시)
- [x] ISR 설정: `export const revalidate = 60`
- [x] `InvoiceStatusFilter` + `InvoiceTable` 컴포넌트 조합

```typescript
// src/app/(dashboard)/invoices/page.tsx 구현 골격
import { getInvoices } from "@/lib/notion"
import { mapPageToInvoice } from "@/lib/invoice"

export const revalidate = 60

interface InvoicesPageProps {
  searchParams: Promise<{ status?: string }>
}

export default async function InvoicesPage({ searchParams }: InvoicesPageProps) {
  const { status } = await searchParams

  // 상태 필터 조건 생성 (선택적)
  const filter = status
    ? { property: "상태", select: { equals: status } }
    : undefined

  const pages = await getInvoices(filter)
  const invoices = pages.map(mapPageToInvoice)

  return (
    <div className="space-y-6">
      {/* 헤더 + InvoiceStatusFilter */}
      {/* InvoiceTable */}
    </div>
  )
}
```

**[M3-T5] Admin 견적서 상세 페이지 완성** (우선순위: 중간)

- [x] `src/app/(dashboard)/invoices/[pageId]/page.tsx` 구현
- [x] `getInvoiceWithItems(pageId)` 호출, null 시 `notFound()`
- [x] `mapPageToInvoice()` 변환 후 견적서 전체 정보 표시
- [x] 공유 링크 복사 버튼 (CopyLinkButton) 상단 액션 영역에 배치
- [x] 공개 뷰어 링크로 이동하는 "미리보기" 버튼 추가
- [x] 컴포넌트 재사용: `InvoiceHeader`, `InvoiceItemsTable`, `InvoiceSummary`, `InvoiceStatusBadge`

---

### M4 — 품질 및 배포 (예상: 0.5주)

**목표**: Vercel 프로덕션 URL에서 전체 플로우 동작 확인

**완료 기준**:
- [ ] 모바일(375px), 태블릿(768px), 데스크탑(1280px) 반응형 정상 동작
- [ ] 인쇄 미리보기에서 A4 레이아웃 1~2장으로 출력됨
- [ ] Vercel 환경변수 설정 완료 (`NOTION_API_KEY`, `NOTION_DATABASE_ID`, `NEXT_PUBLIC_BASE_URL`)
- [ ] OG 태그 확인 (SNS 링크 미리보기 정상 표시)
- [ ] `npm run build` 에러 없이 성공
- [ ] Playwright MCP로 Admin → 링크 복사 → 공개 뷰어 접근 전체 시나리오 E2E 테스트 통과
- [ ] Playwright MCP로 PDF 저장 버튼 클릭 및 인쇄 다이얼로그 호출 검증 완료

#### 태스크 목록

**[M4-T1] 반응형 레이아웃 검증 및 수정** (우선순위: 높음)

- [ ] 공개 뷰어 페이지 모바일(375px) 레이아웃 점검
  - 테이블 가로 스크롤 처리 확인
  - 헤더 정보 스택 레이아웃 확인
- [ ] Admin 대시보드 모바일 레이아웃 점검
- [ ] 인쇄 CSS 최종 검증 (Chrome 인쇄 미리보기 기준)

**[M4-T2] OG 태그 및 메타데이터 최종 점검** (우선순위: 중간)

- [ ] 공개 뷰어의 `generateMetadata` 반환값 검증
  - `title`: 견적서 제목 포함 여부
  - `description`: 클라이언트명 포함 여부
  - `openGraph.title`, `openGraph.description` 설정 확인
- [ ] Admin 페이지의 `robots: { index: false }` 설정 확인

**[M4-T3] Vercel 배포 설정** (우선순위: 높음)

- [ ] Vercel 프로젝트에 환경변수 등록
  - `NOTION_API_KEY`
  - `NOTION_DATABASE_ID`
  - `NEXT_PUBLIC_BASE_URL` (Vercel 자동 생성 URL 또는 커스텀 도메인)
- [ ] `npm run build` 로컬 빌드 성공 확인 후 배포
- [ ] 배포 후 `/invoice/[실제pageId]` 접근 테스트
- [ ] `/dashboard/invoices` 접근 테스트

**[M4-T4] 엔드투엔드 시나리오 검증** (우선순위: 높음)

Admin 시나리오:
- [ ] 대시보드에서 견적서 목록 조회
- [ ] 상태 필터 동작 확인
- [ ] 링크 복사 후 새 탭에서 공개 뷰어 접근 확인

Client 시나리오:
- [ ] 공유 링크로 견적서 접근
- [ ] 견적서 전체 내용 확인 (항목, 금액, 상태, 날짜)
- [ ] PDF 저장 버튼 클릭 → 인쇄 다이얼로그 → "PDF로 저장" 선택

---

## 🧪 테스트 전략

### 테스트 레벨별 적용 기준

| 테스트 유형 | 적용 대상 | 도구 |
|------------|---------|------|
| E2E 테스트 | UI 흐름, 페이지 렌더링, 사용자 인터랙션 | Playwright MCP |
| API 연동 테스트 | Notion API 응답 검증, 데이터 매핑 | Playwright MCP |
| 단위 테스트 | `formatCurrency()`, `mapPageToInvoice()` 등 순수 함수 | Jest (해당 시) |
| 수동 테스트 | UI 디자인 확인, 반응형 레이아웃 | 브라우저 직접 확인 |

### Playwright MCP 테스트 필수 적용 케이스

API 연동 또는 비즈니스 로직 구현이 포함된 작업은 아래 시나리오를 반드시 수행합니다:

1. **정상 케이스**: 기대한 데이터가 올바르게 표시되는가
2. **오류 케이스**: API 오류/빈 데이터 시 적절한 에러 UI가 표시되는가
3. **경계값 케이스**: 데이터가 없거나 극단적 값일 때 레이아웃이 깨지지 않는가

### 테스트 시점 규칙

- 각 Feature 구현 완료 즉시 해당 Playwright 테스트 수행
- 마일스톤 종료 전 전체 E2E 시나리오 재실행 확인
- Notion API 연동 변경 시 관련 테스트 재검증 필수

---

## 파일 및 컴포넌트 생성 목록

### 신규 생성 파일

```
src/
├── components/
│   └── invoice/                          # 신규 디렉토리
│       ├── invoice-header.tsx            # M2-T1: 견적서 헤더 (공급사명, 날짜, 상태)
│       ├── invoice-status-badge.tsx      # M2-T2: 상태 배지 컴포넌트
│       ├── invoice-items-table.tsx       # M2-T3: 품목 테이블
│       ├── invoice-summary.tsx           # M2-T4: 금액 합계 (소계/세금/최종)
│       ├── print-button.tsx              # M2-T5: PDF 인쇄 버튼 (클라이언트)
│       ├── invoice-table.tsx             # M3-T1: Admin 목록 테이블
│       ├── copy-link-button.tsx          # M3-T2: 링크 복사 버튼 (클라이언트)
│       └── invoice-status-filter.tsx    # M3-T3: 상태 필터 셀렉트 (클라이언트)
└── .env.example                          # M1-T2: 환경변수 예시 파일
```

### 수정 대상 파일 (TODO 구현)

```
src/
├── app/
│   ├── invoice/[pageId]/page.tsx         # M1-T1: Notion 연동 및 컴포넌트 조합
│   ├── (dashboard)/invoices/page.tsx     # M3-T4: 목록 조회 + 필터
│   └── (dashboard)/invoices/[pageId]/page.tsx  # M3-T5: Admin 상세 뷰
└── app/globals.css                       # M2-T7: @media print 스타일 추가
```

### 선택적 설치 (shadcn/ui)

```bash
# 견적서 테이블 구현 시 필요
npx shadcn@latest add table

# 이미 설치됨: badge, button, card, select, sheet, separator
```

---

## 의존성 및 작업 순서

```
M1-T2 (환경변수 설정)
    │
    ▼
M1-T1 (뷰어 페이지 Notion 연결)
    │
    ├──► M2-T2 (StatusBadge)
    │        │
    │        ▼
    ├──► M2-T1 (InvoiceHeader) ──► M2-T6 (뷰어 페이지 조합)
    │                                     │
    ├──► M2-T3 (ItemsTable) ─────────────►│
    │                                     │
    ├──► M2-T4 (InvoiceSummary) ─────────►│
    │                                     │
    └──► M2-T5 (PrintButton) ────────────►│
                                          │
                                          ▼
                              M2-T7 (인쇄 CSS)
                                          │
                                          ▼
                              M3-T2 (CopyLinkButton)
                                          │
                              M3-T1 (InvoiceTable) ──► M3-T4 (목록 페이지)
                                          │
                              M3-T3 (StatusFilter) ──► M3-T4
                                          │
                              M2 컴포넌트 재사용 ──► M3-T5 (Admin 상세)
                                          │
                                          ▼
                                  M4 (품질 및 배포)
```

병렬 진행 가능한 작업 그룹:
- M2-T1, M2-T2, M2-T3, M2-T4, M2-T5 는 M1-T1 이후 병렬 진행 가능
- M3-T1, M3-T2, M3-T3 는 M2 컴포넌트 완성 후 병렬 진행 가능

---

## 리스크 및 의존성

### 기술적 리스크

| 리스크 | 가능성 | 영향도 | 대응 방안 |
|--------|--------|--------|----------|
| Notion API 응답 지연 (>2초) | 중간 | 높음 | ISR revalidate:60 설정, 로딩 스켈레톤 UI 추가 (V2) |
| `@notionhq/client` v5 API 변경 (`dataSources.query`) | 낮음 | 높음 | `node_modules/next/dist/docs/` 및 패키지 CHANGELOG 확인 후 적용 |
| 모바일 PDF 품질 저하 | 높음 | 중간 | I-06 대응: 모바일 안내 배너 표시, V2에서 서버사이드 PDF 생성 검토 |
| Notion DB 컬럼명 불일치 (한글) | 중간 | 높음 | `invoice.ts`의 `props["컬럼명"]` 키와 실제 DB 속성명 일치 여부 사전 검증 필수 |
| `window.print()` 브라우저 간 인쇄 CSS 차이 | 중간 | 중간 | Chrome 기준 1차 구현, Firefox·Safari 추가 테스트 |

### 외부 의존성

- **Notion Integration 설정**: Notion 워크스페이스에서 Integration 생성 및 DB 공유 권한 부여 필요 (사전 작업)
- **Notion DB 스키마**: PRD 5장의 컬럼명·타입과 실제 DB가 정확히 일치해야 함
- **Vercel 환경변수**: 배포 전 `NOTION_API_KEY`, `NOTION_DATABASE_ID`, `NEXT_PUBLIC_BASE_URL` 등록 필요

---

## 오픈 이슈 및 결정 사항

| # | 이슈 | MVP 결정 | V2 검토 |
|---|------|---------|---------|
| I-01 | PDF 생성 방식 | `window.print()` + 인쇄 CSS | Puppeteer/Playwright 서버사이드 PDF |
| I-02 | 견적 항목 저장 | Notion Relation(Items DB) 방식으로 구현 완료 (2026-04-10 변경) | — |
| I-03 | Admin 접근 제어 | 인증 없음 (URL 보안에 의존) | NextAuth.js 또는 Clerk 연동 |
| I-04 | 데이터 캐싱 | ISR `revalidate: 60` (60초마다 재생성) | On-demand Revalidation |
| I-05 | 견적서 URL 식별자 | Notion 페이지 UUID 직접 사용 | 별도 단축 슬러그 생성 |
| I-06 | 모바일 PDF | 안내 배너 표시 (`navigator.userAgent` 또는 touch 감지) | 서버사이드 PDF 다운로드 |

---

## 기술 결정 사항 (ADR)

### ADR-001: 견적서 항목 저장 방식 — Notion Relation(Items DB) 방식

- **상태**: 변경됨 (2026-04-10)
- **컨텍스트**: 초기 MVP 계획은 메인 DB의 `품목` Rich Text 속성에 JSON 배열 문자열로 저장하는 방식이었으나, 실제 사용자의 Notion DB는 이미 별도 Items DB와 Relation으로 구성되어 있음.
- **결정**: `품목` 속성을 Relation 타입으로 사용. `getInvoiceWithItems()` 함수가 견적서 페이지와 연결된 Items DB 페이지를 병렬 fetch. `mapItemPageToInvoiceItem()`이 Items 페이지를 `InvoiceItem`으로 변환.
- **결과**: Notion UI에서 직접 품목 편집 가능. 단, 견적서 상세 조회 시 Items DB 페이지 수만큼 추가 API 호출 발생 (Promise.all로 병렬화). 소계·세금·최종금액은 items 배열에서 자동 계산.
- **변경된 함수**: `parseItems()` 제거 → `mapItemPageToInvoiceItem()`, `extractRelationIds()`, `getItemPagesByIds()`, `getInvoiceWithItems()` 추가

### ADR-002: 공개 뷰어 인증 없음

- **상태**: 결정됨 (MVP)
- **컨텍스트**: MVP에서 빠른 클라이언트 공유를 최우선으로 한다. 별도 로그인 없이 URL만으로 접근 가능해야 한다.
- **결정**: `/invoice/[pageId]` 라우트는 인증 없이 공개 접근 허용. 보안은 UUID의 예측 불가능성에 의존.
- **결과**: 클라이언트 경험 최소화. UUID 유출 시 누구나 견적서 접근 가능하므로 민감 정보 포함 금지 권고.

### ADR-003: ISR revalidate 60초 설정

- **상태**: 결정됨 (MVP)
- **컨텍스트**: Notion API를 매 요청마다 호출하면 응답 지연 및 Rate Limit 위험이 있다.
- **결정**: `export const revalidate = 60` 설정으로 60초 단위 ISR 캐싱.
- **결과**: 노션에서 견적서를 수정해도 최대 60초 후 반영됨. 즉시 반영이 필요한 경우 On-demand Revalidation (V2) 검토.

### ADR-004: `@notionhq/client` v2.3.0 `databases.query` 사용

- **상태**: 결정됨 (2026-04-09 변경)
- **컨텍스트**: 초기 `notion.ts`는 `@notionhq/client` v5.x의 `dataSources.query` (`/data_sources/{id}/query`) API를 사용하도록 작성됨. 그러나 실제 테스트 결과 이 엔드포인트는 Notion UI에서 생성한 일반 데이터베이스에 접근 불가(`object_not_found` 404). `dataSources` API는 외부 데이터 소스 연결용 신규 엔드포인트로, 일반 DB와 호환되지 않음.
- **결정**: `@notionhq/client`를 v2.3.0으로 다운그레이드하고 `databases.query` (`/databases/{id}/query`) API 사용. Notion API 버전 `2022-06-28` 기준.
- **결과**: 일반 Notion 데이터베이스 정상 조회 확인. v5.x 업그레이드 시 `dataSources` API 사용 여부 재검토 필요.

### ADR-005: InvoiceStatus 타입을 Notion DB 실제 값 기준으로 정의

- **상태**: 결정됨 (2026-04-11)
- **컨텍스트**: 초기 코드는 `InvoiceStatus`를 `"초안" | "발송됨" | "승인됨" | "거절됨"`으로 정의했으나, 실제 Notion DB의 "상태" Select 필드 옵션은 `"시작 전"`, `"진행 중"`, `"완료"`임. Playwright E2E 테스트(TC-13)에서 상태 필터 적용 시 Notion API 오류(`select option not found`) 발생으로 발견.
- **결정**: `InvoiceStatus` 타입 및 `INVOICE_STATUS_VARIANT`, `INVOICE_STATUS_LABEL`, `VALID_STATUSES`를 실제 Notion DB 값(`"시작 전" | "진행 중" | "완료"`)으로 변경. 앱 코드가 Notion DB를 따름.
- **결과**: 상태 필터 정상 동작 확인 (TC-13 PASS). 폴백 기본값도 `"초안"` → `"시작 전"`으로 변경.

---

## 변경 이력

| 버전 | 날짜 | 변경 내용 |
|------|------|----------|
| 1.0.0 | 2026-04-07 | 초기 로드맵 작성 (PRD v0.1.0 기반) |
| 1.1.0 | 2026-04-07 | 테스트 전략 섹션 추가 및 각 마일스톤 DoD 테스트 항목 보강 |
| 1.2.0 | 2026-04-09 | M1 구현 완료 체크, ADR-004 업데이트 (@notionhq/client v5→v2.3.0 다운그레이드), M3-T4 부분 완료 반영 |
| 1.3.0 | 2026-04-10 | ADR-001 변경: 품목 저장 방식 Rich Text JSON → Notion Relation(Items DB). getInvoiceWithItems(), mapItemPageToInvoiceItem(), extractRelationIds(), getItemPagesByIds() 추가. M2 컴포넌트 전체 구현 완료 확인. |
| 1.4.0 | 2026-04-11 | M3 전체 구현 완료 (T1~T5). Playwright E2E TC-12~16 전체 PASS. ADR-005 추가: InvoiceStatus 타입을 Notion DB 실제값 기준으로 수정. getInvoicesWithItems() 추가로 목록 페이지 최종금액 정확 표시. |
