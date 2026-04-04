# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## 개발 명령어

```bash
npm run dev      # 개발 서버 실행
npm run build    # 프로덕션 빌드
npm run start    # 프로덕션 서버 실행
npm run lint     # ESLint 실행
```

## 아키텍처 개요

Next.js 16 App Router 기반 스타터 템플릿. 마케팅, 인증, 대시보드 3개 영역을 route group으로 분리한 구조.

### Route Groups

- `(marketing)/` — 랜딩 페이지. Header + Footer 레이아웃
- `(auth)/` — 로그인/회원가입. 중앙 카드 레이아웃
- `(dashboard)/` — 대시보드. Sidebar + Main 레이아웃

### 주요 디렉토리

```
src/
├── app/                  # App Router 라우트
├── components/
│   ├── ui/               # shadcn/ui 컴포넌트
│   ├── sections/         # 랜딩 페이지 섹션 컴포넌트
│   ├── layout/           # Header, Footer, Sidebar
│   └── providers/        # Theme + Toast 프로바이더
└── lib/
    ├── utils.ts           # cn() 유틸리티 (clsx + tailwind-merge)
    └── validations.ts     # Zod 스키마
```

### 기술 스택

- **UI**: shadcn/ui (radix-nova 스타일) + Radix UI + lucide-react
- **폼**: React Hook Form + Zod (검증 메시지는 한국어)
- **테마**: next-themes (다크모드, 시스템 설정 연동)
- **알림**: sonner (토스트 알림)
- **스타일**: Tailwind CSS v4 (@tailwindcss/postcss)

### 컴포넌트 작성 규칙

- 서버 컴포넌트가 기본값. 상태/이벤트 필요 시에만 `"use client"` 추가
- Path alias: `@/*` → `src/*`
- className 병합: `cn()` 함수 사용 (`src/lib/utils.ts`)
- shadcn 컴포넌트 추가: `npx shadcn@latest add <component>`
