import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Sparkles } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden py-24 md:py-32">
      {/* 배경 그라디언트 */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="h-[500px] w-[500px] rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="container relative mx-auto px-4 text-center">
        <Badge variant="secondary" className="mb-6 inline-flex items-center gap-1.5">
          <Sparkles className="h-3 w-3" />
          Next.js 16 · React 19 · Tailwind v4
        </Badge>

        <h1 className="mx-auto max-w-4xl text-4xl font-bold tracking-tight md:text-6xl lg:text-7xl">
          모던 웹 개발을{" "}
          <span className="text-primary">빠르게</span> 시작하세요
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl">
          검증된 기술 스택과 컴포넌트로 구성된 스타터킷으로
          프로덕션 수준의 웹 애플리케이션을 즉시 개발하세요.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button asChild size="lg" className="h-11 px-8">
            <Link href="/register">
              무료로 시작하기
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="h-11 px-8">
            <Link href="#features">
              기능 살펴보기
            </Link>
          </Button>
        </div>

        {/* 통계 */}
        <div className="mt-16 grid grid-cols-3 gap-8 border-t border-border pt-10">
          {[
            { label: "컴포넌트", value: "20+" },
            { label: "레이아웃", value: "4개" },
            { label: "즉시 배포", value: "가능" },
          ].map((stat) => (
            <div key={stat.label}>
              <p className="text-3xl font-bold">{stat.value}</p>
              <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
