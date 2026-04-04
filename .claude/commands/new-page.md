---
description: 'route group에 맞는 새 Next.js 페이지를 스캐폴딩합니다'
allowed-tools:
  [
    'Read',
    'Write',
    'Glob',
    'Bash(mkdir:*)',
  ]
---

# Claude 명령어: New Page

route group 구조에 맞는 새 페이지를 생성합니다.

## 사용법

```
/new-page <경로>
```

### 예시

```
/new-page dashboard/settings
/new-page auth/forgot-password
/new-page marketing/pricing
```

## 프로세스

1. `$ARGUMENTS`에서 경로 파싱
2. 경로 앞부분으로 route group 판별:
   - `dashboard/` → `src/app/(dashboard)/`
   - `auth/` → `src/app/(auth)/`
   - `marketing/` 또는 그 외 → `src/app/(marketing)/`
3. 아래 **템플릿 규칙**에 따라 `page.tsx` 생성
4. 생성된 파일 경로와 접속 URL 안내

## 템플릿 규칙

### (dashboard) 페이지
- 서버 컴포넌트 (no `"use client"`)
- 상단에 `<h1>` 제목 + `<p className="text-muted-foreground">` 설명 패턴
- `Card` 컴포넌트로 콘텐츠 영역 구성
- lucide-react 아이콘 사용

```tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function [Name]Page() {
  return (
    <div className="space-y-8">
      {/* 페이지 헤더 */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">[제목]</h1>
        <p className="text-muted-foreground">[설명]</p>
      </div>

      {/* 콘텐츠 */}
      <Card>
        <CardHeader>
          <CardTitle>[섹션 제목]</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">콘텐츠를 여기에 추가하세요.</p>
        </CardContent>
      </Card>
    </div>
  )
}
```

### (auth) 페이지
- `"use client"` 필수 (폼 인터랙션)
- `Card` + `CardHeader` + `CardContent` + `CardFooter` 구조
- React Hook Form + Zod 폼이 필요한 경우 포함
- 최대 너비는 레이아웃이 `max-w-sm`으로 제한

```tsx
"use client"

import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function [Name]Page() {
  return (
    <Card>
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl text-center">[제목]</CardTitle>
        <CardDescription className="text-center">[설명]</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 콘텐츠 */}
      </CardContent>
      <CardFooter className="flex flex-col gap-4">
        <Button className="w-full">[버튼 텍스트]</Button>
      </CardFooter>
    </Card>
  )
}
```

### (marketing) 페이지
- 서버 컴포넌트 (no `"use client"`)
- `src/components/sections/` 의 섹션 컴포넌트들을 조합
- 섹션이 없으면 인라인으로 작성 후 분리 제안

```tsx
export default function [Name]Page() {
  return (
    <>
      {/* 섹션 컴포넌트들 */}
    </>
  )
}
```

## 주의사항

- 디렉토리가 없으면 `mkdir -p`로 생성
- 이미 파일이 존재하면 덮어쓰지 말고 사용자에게 확인
- 생성 후 접속 가능한 URL 경로 안내 (예: `http://localhost:3000/dashboard/settings`)
- Path alias `@/*` → `src/*` 사용
- `cn()` 함수는 `@/lib/utils`에서 import
