# Invoice Web — AI Agent 개발 규칙

## 1. 프로젝트 개요

- **목적**: Notion 데이터베이스를 데이터 소스로 사용하는 견적서 웹 뷰어 + Admin 대시보드
- **기술 스택**: Next.js 16.2.2 (App Router), React 19, TypeScript, Tailwind CSS v4, shadcn/ui, @notionhq/client, React Hook Form + Zod, sonner, next-themes, lucide-react
- **구현 대상 사용자**: Admin(프리랜서/에이전시), Client(발주사)

---

## 2. 프로젝트 아키텍처

### Route Groups

| Route Group | 경로 | 레이아웃 특성 |
|-------------|------|--------------|
| `(marketing)` | `/` | Header + Footer, 공개 |
| `(auth)` | `/login` | 중앙 카드, 공개 |
| `(dashboard)` | `/dashboard/*` | Sidebar + Main, MVP에서 인증 없음 |
| `invoice` | `/invoice/[pageId]` | 미니멀 레이아웃, 공개 (인증 없음) |

### 주요 파일 역할

| 파일 | 역할 |
|------|------|
| `src/lib/notion.ts` | Notion API 클라이언트 싱글톤, `getInvoices()`, `getInvoiceByPageId()`, `getInvoiceWithItems()`, `getItemPagesByIds()` |
| `src/lib/invoice.ts` | 도메인 타입, `mapPageToInvoice()`, `mapItemPageToInvoiceItem()`, `extractRelationIds()`, `formatCurrency()`, `formatDate()`, `getPublicInvoiceUrl()`, `INVOICE_STATUS_VARIANT` |
| `src/lib/utils.ts` | `cn()` className 병합 유틸리티 |
| `src/components/ui/` | shadcn/ui 컴포넌트 (직접 수정 금지) |

### 데이터 흐름

```
Notion DB → notion.ts (API 호출) → invoice.ts (mapPageToInvoice) → 서버 컴포넌트 → UI
```

---

## 3. Notion 연동 규칙

### 환경변수 (절대 규칙)

- `NOTION_API_KEY`: **서버사이드 전용**. 클라이언트 번들에 절대 포함 금지. `NEXT_PUBLIC_` 접두사 사용 금지
- `NOTION_DATABASE_ID`: **서버사이드 전용**
- `NEXT_PUBLIC_BASE_URL`: 클라이언트 접근 가능 (공개 URL 생성에 사용)
- 환경변수 추가 시 `.env.example`도 반드시 동시 업데이트

### Notion DB 속성명 (한국어, 정확히 일치해야 함)

| 속성명 | Notion 타입 | Invoice 필드 |
|--------|------------|-------------|
| `제목` | Title | `title` |
| `클라이언트명` | Text | `clientName` |
| `상태` | Select | `status` |
| `발행일` | Date | `issuedAt` |
| `유효기간` | Date | `validUntil` |
| `공급사명` | Text | `supplierName` |
| `공급사 연락처` | Email | `supplierContact` |
| `메모` | Text | `memo` |
| `품목` | Relation (Items DB) | `items` |

> 소계·세금·최종금액은 Notion DB 저장값을 읽지 않고 items 배열에서 자동 계산합니다.
> (subtotal = Σ item.amount, tax = subtotal × 10%, totalAmount = subtotal + tax)

### Items DB 속성명 (한국어, 정확히 일치해야 함)

| 속성명 | Notion 타입 | InvoiceItem 필드 |
|--------|------------|----------------|
| `항목명` | Title | `name` |
| `수량` | Number | `quantity` |
| `단가` | Number | `unitPrice` |
| `Invoices` | Relation | (역참조, 직접 사용 안 함) |

### 품목(items) 저장 방식

- Invoices DB의 `품목` 속성은 **Relation 타입** — 별도 Items DB 페이지와 연결
- Items DB 페이지를 가져오는 함수: `getInvoiceWithItems(pageId)` (notion.ts)
- Items 페이지를 InvoiceItem으로 변환하는 함수: `mapItemPageToInvoiceItem(page)` (invoice.ts)
- Relation ID 추출 헬퍼: `extractRelationIds(property)` (invoice.ts, export됨)
- 상세 페이지에서는 반드시 `getInvoiceByPageId()` 대신 `getInvoiceWithItems()` 사용
- 목록 페이지(`/invoices`)에서는 items fetch 불필요 — `mapPageToInvoice(page)` 호출 시 items = []

### 데이터 페칭 방식

- 서버 컴포넌트에서 직접 `getInvoices()` 또는 `getInvoiceByPageId()` 호출
- `revalidate: 60` (1분 ISR) 적용 — `cache: 'no-store'` 사용 금지 (성능 이슈)
- Route Handler(`/api/*`) 사용 금지 — 서버 컴포넌트에서 직접 호출

---

## 4. 컴포넌트 작성 규칙

### 서버 vs 클라이언트 컴포넌트 결정

- **기본값**: 서버 컴포넌트 (파일 상단에 directive 없음)
- **`"use client"` 추가 조건**: `onClick`, `useState`, `useEffect`, `navigator.clipboard`, `window.print()` 사용 시에만
- **클라이언트 컴포넌트 분리 패턴**: 서버 컴포넌트에서 데이터 페칭 → 클라이언트 컴포넌트에 props로 전달

### "use client" 필수 컴포넌트

| 컴포넌트 | 이유 |
|----------|------|
| `CopyLinkButton` | `navigator.clipboard.writeText()` |
| `PdfDownloadButton` | `window.print()` |
| `StatusFilter` | URL 쿼리파라미터 조작 (`useRouter`, `useSearchParams`) |

### 새 컴포넌트 위치 규칙

- 특정 페이지 전용 컴포넌트 → 해당 라우트 폴더 내에 위치 (예: `src/app/(dashboard)/invoices/_components/`)
- 여러 페이지에서 재사용되는 컴포넌트 → `src/components/` 하위 적절한 폴더

### className 병합

- `cn()` 함수 사용 필수 (`src/lib/utils.ts` import)
- `clsx` 또는 `twMerge` 직접 사용 금지

---

## 5. 기능 구현 규칙

### 금액 / 날짜 포맷

- 금액 표시: 반드시 `formatCurrency(amount)` 사용 (`src/lib/invoice.ts`)
- 날짜 표시: 반드시 `formatDate(dateString)` 사용 (`src/lib/invoice.ts`)
- 직접 `Intl.NumberFormat` 또는 `Intl.DateTimeFormat` 작성 금지

### 견적서 상태 배지

- `INVOICE_STATUS_VARIANT` 맵 사용 (`src/lib/invoice.ts`)
- `<Badge variant={INVOICE_STATUS_VARIANT[status]}>{status}</Badge>` 패턴 사용
- 상태값 하드코딩 금지 — 항상 `InvoiceStatus` 타입 사용

### 공유 URL 생성

- `getPublicInvoiceUrl(pageId)` 사용 (`src/lib/invoice.ts`)
- 직접 URL 문자열 조합 금지

### 링크 복사 (F-008)

- `navigator.clipboard.writeText()` + sonner `toast()` 알림
- 성공 메시지: `"링크가 복사되었습니다"`
- `lucide-react`의 `Copy` / `CopyCheck` 아이콘으로 복사 상태 시각화

### PDF 다운로드 (F-005)

- `window.print()` 호출 (MVP)
- `@media print { .no-print { display: none; } }` → `src/app/globals.css`에 추가
- 인쇄 시 숨겨야 할 요소: 네비게이션, PDF 버튼, 사이드바

### 상태 필터 (F-007)

- URL 쿼리파라미터(`?status=발송됨`) 방식으로 처리
- 서버 컴포넌트의 `searchParams`로 필터링
- 클라이언트 상태(`useState`)로 필터 관리 금지

### 존재하지 않는 페이지 처리

- `getInvoiceByPageId(pageId)` 결과가 `null`이면 `notFound()` 호출

---

## 6. shadcn/ui 사용 규칙

- 컴포넌트 추가: `npx shadcn@latest add <component>` (직접 파일 생성 금지)
- `src/components/ui/` 파일 직접 수정 금지
- 사용 가능 컴포넌트 (현재 설치됨): `alert`, `avatar`, `badge`, `button`, `card`, `checkbox`, `dialog`, `dropdown-menu`, `input`, `label`, `select`, `separator`, `sheet`, `switch`, `textarea`
- 견적서 목록 테이블: `Table` 컴포넌트 추가 후 사용 (`npx shadcn@latest add table`)

---

## 7. 파일 상호작용 규칙

### 동시 수정이 필요한 파일 쌍

| 수정 대상 | 함께 수정해야 할 파일 |
|-----------|---------------------|
| `src/lib/notion.ts` | `src/lib/invoice.ts` (타입 정합성 확인) |
| `src/lib/invoice.ts`의 `InvoiceStatus` | 모든 상태 사용처 (`INVOICE_STATUS_VARIANT`, `INVOICE_STATUS_LABEL`, `VALID_STATUSES`) |
| 환경변수 추가 | `.env.example` (주석과 함께 키 추가) |
| `src/app/globals.css` | 인쇄 CSS 추가 시 `@media print` 섹션에 통합 |

---

## 8. AI 의사결정 기준

### 컴포넌트 위치 결정 트리

```
새 컴포넌트를 만들어야 하는가?
├── 한 페이지에서만 사용 → 해당 라우트 폴더 내 _components/ 폴더
└── 여러 페이지에서 사용
    ├── UI 요소 (버튼 등) → src/components/ui/ (shadcn add 사용)
    ├── 레이아웃 관련 → src/components/layout/
    └── 도메인 관련 → src/components/ 직접 하위
```

### 데이터 페칭 결정 트리

```
데이터를 가져와야 하는가?
├── Notion 데이터 → notion.ts 함수 사용 (서버 컴포넌트에서만)
├── 클라이언트에서 실시간 필요 → 없음 (MVP 범위 외)
└── 환경변수 필요 → 서버사이드 전용인지 확인 후 NEXT_PUBLIC_ 여부 결정
```

### 모호한 상황 우선순위

1. PRD(`docs/PRD.md`)의 인수 조건(AC) 확인
2. 기존 유사 컴포넌트 패턴 따르기
3. 서버 컴포넌트 우선, 클라이언트 컴포넌트는 최후 수단

---

## 9. 금지 사항

- `NOTION_API_KEY` 또는 `NOTION_DATABASE_ID`를 클라이언트 컴포넌트에서 import하거나 `NEXT_PUBLIC_` 접두사로 노출 **절대 금지**
- `src/lib/notion.ts` 또는 `src/lib/invoice.ts`를 `"use client"` 컴포넌트에서 직접 import **금지**
- Notion DB 속성명 임의 변경 금지 — 실제 Notion DB와 정확히 일치해야 함
- 품목(items)을 위한 별도 Notion 서브 DB 생성 금지 (MVP: Rich Text JSON 방식)
- `src/components/ui/` 파일 직접 수정 금지
- `formatCurrency()`, `formatDate()` 우회하여 금액/날짜 직접 포맷 금지
- `InvoiceStatus`에 없는 상태값 하드코딩 금지
- `cache: 'no-store'` 사용 금지 (revalidate: 60 사용)
- 새 Route Handler(`/api/*`) 생성 금지 (서버 컴포넌트 직접 호출)
- 견적서 상세 페이지에서 `getInvoiceByPageId()` 단독 사용 금지 — `getInvoiceWithItems()` 사용
- MVP Out-of-Scope 기능 구현 금지: 회원가입, 전자서명, 이메일 발송, 결제 연동, 견적서 직접 편집 UI
