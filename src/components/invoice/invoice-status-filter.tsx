"use client"

import { useRouter, useSearchParams } from "next/navigation"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { INVOICE_STATUS_LABEL } from "@/lib/invoice"
import type { InvoiceStatus } from "@/lib/invoice"

/** 필터 옵션 목록 (전체 포함) */
const STATUS_OPTIONS: { value: string; label: string }[] = [
  { value: "all", label: "전체" },
  ...(Object.entries(INVOICE_STATUS_LABEL) as [InvoiceStatus, string][]).map(
    ([value, label]) => ({ value, label })
  ),
]

/**
 * 견적서 상태 필터 Select 컴포넌트
 * 선택 변경 시 URL 쿼리 파라미터(?status=값)를 갱신
 * "전체" 선택 시 status 파라미터 제거
 */
export function InvoiceStatusFilter() {
  const router = useRouter()
  const searchParams = useSearchParams()

  // URL에서 현재 상태 파라미터 읽기, 없으면 "all"
  const currentStatus = searchParams.get("status") ?? "all"

  function handleChange(value: string) {
    const params = new URLSearchParams(searchParams.toString())

    if (value === "all") {
      // 전체 선택 시 파라미터 제거
      params.delete("status")
    } else {
      params.set("status", value)
    }

    const queryString = params.toString()
    router.push(queryString ? `?${queryString}` : "?")
  }

  return (
    <Select value={currentStatus} onValueChange={handleChange}>
      <SelectTrigger className="w-[140px]">
        <SelectValue placeholder="상태 선택" />
      </SelectTrigger>
      <SelectContent>
        {STATUS_OPTIONS.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
