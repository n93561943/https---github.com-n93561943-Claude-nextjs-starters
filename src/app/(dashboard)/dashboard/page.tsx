import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Users, TrendingUp, ShoppingCart, DollarSign } from "lucide-react"

// 통계 카드 데이터
const stats = [
  {
    title: "총 사용자",
    value: "12,345",
    change: "+12%",
    trend: "up" as const,
    icon: Users,
  },
  {
    title: "이번 달 매출",
    value: "₩8,450,000",
    change: "+8.2%",
    trend: "up" as const,
    icon: DollarSign,
  },
  {
    title: "신규 주문",
    value: "1,234",
    change: "+23%",
    trend: "up" as const,
    icon: ShoppingCart,
  },
  {
    title: "전환율",
    value: "3.24%",
    change: "-0.4%",
    trend: "down" as const,
    icon: TrendingUp,
  },
]

// 최근 활동 데이터
const activities = [
  {
    name: "김민준",
    email: "minjun@example.com",
    action: "회원가입",
    time: "2분 전",
    initials: "김",
  },
  {
    name: "이서연",
    email: "seoyeon@example.com",
    action: "프리미엄 구독",
    time: "15분 전",
    initials: "이",
  },
  {
    name: "박지호",
    email: "jiho@example.com",
    action: "주문 완료",
    time: "1시간 전",
    initials: "박",
  },
  {
    name: "최수아",
    email: "sua@example.com",
    action: "프로필 수정",
    time: "2시간 전",
    initials: "최",
  },
  {
    name: "정예준",
    email: "yejun@example.com",
    action: "회원가입",
    time: "3시간 전",
    initials: "정",
  },
]

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* 페이지 헤더 */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">대시보드</h1>
        <p className="text-muted-foreground">서비스 현황을 한눈에 확인하세요.</p>
      </div>

      {/* 통계 카드 그리드 */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="mt-1 flex items-center gap-1">
                  <Badge
                    variant={stat.trend === "up" ? "default" : "destructive"}
                    className="text-xs px-1.5 py-0"
                  >
                    {stat.change}
                  </Badge>
                  <span className="text-xs text-muted-foreground">지난 달 대비</span>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* 최근 활동 */}
      <Card>
        <CardHeader>
          <CardTitle>최근 활동</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-0">
            {activities.map((activity, index) => (
              <div key={activity.email}>
                <div className="flex items-center gap-4 py-3">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src="" alt={activity.name} />
                    <AvatarFallback className="text-sm">{activity.initials}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{activity.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{activity.email}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
                {index < activities.length - 1 && <Separator />}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
