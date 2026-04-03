import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Zap,
  Shield,
  Palette,
  Code2,
  LayoutTemplate,
  Moon,
} from "lucide-react"

const features = [
  {
    icon: Zap,
    title: "빠른 개발",
    description:
      "검증된 컴포넌트와 레이아웃으로 반복 작업 없이 핵심 기능 개발에 집중하세요.",
  },
  {
    icon: Shield,
    title: "안전한 폼 처리",
    description:
      "React Hook Form과 Zod로 타입 안전한 폼 유효성 검증을 구현하세요.",
  },
  {
    icon: Palette,
    title: "테마 시스템",
    description:
      "next-themes 기반의 다크/라이트 모드와 CSS 변수 기반 디자인 토큰을 제공합니다.",
  },
  {
    icon: Code2,
    title: "TypeScript 우선",
    description:
      "모든 컴포넌트가 완전한 타입 지원으로 작성되어 안전하게 개발할 수 있습니다.",
  },
  {
    icon: LayoutTemplate,
    title: "다양한 레이아웃",
    description:
      "마케팅, 인증, 대시보드 레이아웃이 준비되어 있어 즉시 사용 가능합니다.",
  },
  {
    icon: Moon,
    title: "다크 모드",
    description:
      "시스템 설정을 따르는 자동 다크 모드와 수동 전환 토글을 지원합니다.",
  },
]

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            모든 것이 준비되어 있습니다
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            프로덕션 수준의 웹 애플리케이션에 필요한 모든 컴포넌트와 기능을 제공합니다.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon
            return (
              <Card key={feature.title} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="mb-2 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle className="text-base">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{feature.description}</CardDescription>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
