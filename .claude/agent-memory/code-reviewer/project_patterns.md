---
name: 프로젝트 아키텍처 및 코드 패턴
description: claude-nextjs-starters 프로젝트의 핵심 구조, 패턴, 컨벤션 요약
type: project
---

## 기술 스택 (확인 완료)
- Next.js 16.2.2 + React 19.2.4 (최신 버전)
- Tailwind CSS v4 (@tailwindcss/postcss)
- shadcn/ui (radix-nova 스타일) — radix-ui 패키지는 `radix-ui`(단일 패키지) 사용, `@radix-ui/*` 개별 패키지 아님
- Zod v4 (zod ^4.3.6) — API 변경 있을 수 있음
- React Hook Form ^7 + @hookform/resolvers ^5

## 라우트 구조
- `(marketing)/` → Header + Footer 레이아웃 (서버 컴포넌트)
- `(auth)/` → 중앙 카드 레이아웃 (서버 컴포넌트)
- `(dashboard)/` → Sidebar + Main 레이아웃 (서버 컴포넌트)
- 레이아웃들은 모두 서버 컴포넌트로 유지

## 컴포넌트 패턴
- shadcn/ui 컴포넌트: `data-slot` attribute 패턴 사용 (radix-nova 스타일)
- Button: `asChild` prop으로 Link 래핑 시 `Slot.Root` 사용
- 에러 메시지: `<p className="text-xs text-destructive">` 패턴
- 폼 입력: `aria-invalid={!!errors.field}` + `{...register("field")}` 패턴

## 알려진 이슈 (초기 코드 리뷰 시 발견)
- `header.tsx`: `"use client"` 필요(usePathname 사용) — 올바름
- `sidebar.tsx`: `"use client"` 필요(usePathname 사용) — 올바름
- `theme-toggle.tsx`: system 테마일 때 토글 동작 모호함 (system→dark 또는 light→dark 분기 없음)
- `dashboard/page.tsx`: AvatarImage src="" 빈 문자열 (placeholder)
- `(auth)/layout.tsx`: 이용약관/개인정보처리방침 링크가 `href="#"` — 추후 실제 경로 연결 필요
- `footer.tsx`: `<a>` 태그 사용 (Next.js Link 미사용)
- 에러 메시지 p 태그에 `role="alert"` 또는 `aria-live` 미사용
- 폼 페이지들: `metadata` export 없음 (SEO)
- `loginSchema`: `.min(1)` 후 `.min(8)` 중복 체인 — 첫 번째 min이 의미 없음

**Why:** 초기 코드 리뷰에서 발견된 패턴 — 향후 리뷰 시 동일 패턴 반복 여부 확인
**How to apply:** 신규 파일 추가 시 위 이슈들이 반복되는지 체크
