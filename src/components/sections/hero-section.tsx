import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, FileText } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden py-24 md:py-32">
      {/* 배경 그라디언트 */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="h-[500px] w-[500px] rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="container relative mx-auto px-4 text-center">
        <Badge variant="secondary" className="mb-6 inline-flex items-center gap-1.5">
          <FileText className="h-3 w-3" />
          노션 기반 견적서 공유 서비스
        </Badge>

        <h1 className="mx-auto max-w-4xl text-4xl font-bold tracking-tight md:text-6xl lg:text-7xl">
          견적서를{" "}
          <span className="text-primary">링크 하나</span>로
          <br />
          간편하게 공유하세요
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl">
          노션 데이터베이스와 연동하여 전문적인 견적서를 생성하고,
          고유 URL로 클라이언트에게 바로 공유하세요.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button asChild size="lg" className="h-11 px-8">
            <Link href="/invoices">
              견적서 관리하기
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        {/* 핵심 기능 요약 */}
        <div className="mt-16 grid grid-cols-3 gap-8 border-t border-border pt-10">
          {[
            { label: "노션 연동", value: "자동" },
            { label: "PDF 다운로드", value: "지원" },
            { label: "공유 링크", value: "즉시" },
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
