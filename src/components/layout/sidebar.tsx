"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { FileText, LayoutDashboard } from "lucide-react"
import { cn } from "@/lib/utils"

// 견적서 관리 Admin 네비게이션 항목
const navItems = [
  { href: "/invoices", label: "견적서 목록", icon: LayoutDashboard },
]

interface SidebarProps {
  className?: string
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname()

  return (
    <aside className={cn("flex h-full w-64 flex-col border-r border-border bg-sidebar", className)}>
      {/* 헤더 */}
      <div className="flex h-14 items-center px-4 border-b border-sidebar-border">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <FileText className="h-5 w-5 text-primary" />
          <span>Invoice Web</span>
        </Link>
      </div>

      {/* 네비게이션 */}
      <nav className="flex-1 overflow-auto py-4 px-2">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon
            // 현재 경로가 해당 메뉴 경로로 시작하면 활성 상태
            const isActive = pathname.startsWith(item.href)

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                    isActive
                      ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                      : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {item.label}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
    </aside>
  )
}
