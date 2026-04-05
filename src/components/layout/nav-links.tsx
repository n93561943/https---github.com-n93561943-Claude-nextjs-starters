"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

const navLinks = [
  { href: "/", label: "홈" },
  { href: "#features", label: "기능" },
  { href: "#cta", label: "시작하기" },
]

interface NavLinksProps {
  className?: string
}

// usePathname을 사용하는 네비게이션 링크만 클라이언트 컴포넌트로 분리
export function NavLinks({ className }: NavLinksProps) {
  const pathname = usePathname()

  return (
    <>
      {navLinks.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={cn(
            "text-sm transition-colors hover:text-foreground",
            pathname === link.href
              ? "text-foreground font-medium"
              : "text-muted-foreground",
            className
          )}
        >
          {link.label}
        </Link>
      ))}
    </>
  )
}
