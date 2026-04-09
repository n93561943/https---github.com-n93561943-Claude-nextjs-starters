import { Client } from "@notionhq/client"
import type { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints"

// ─────────────────────────────────────────────
// Notion 클라이언트 싱글톤
// ─────────────────────────────────────────────

/**
 * Notion API 클라이언트 인스턴스
 * 서버 컴포넌트 및 서버 액션에서만 사용 (클라이언트 번들 포함 금지)
 */
export const notion = new Client({
  auth: process.env.NOTION_API_KEY,
})

/** 견적서 데이터베이스 ID */
const DATABASE_ID = process.env.NOTION_DATABASE_ID ?? ""

// databases.query 필터 타입을 Client 메서드 시그니처에서 추출
type QueryFilter = NonNullable<
  Parameters<typeof notion.databases.query>[0]["filter"]
>

// ─────────────────────────────────────────────
// 데이터베이스 쿼리 함수
// ─────────────────────────────────────────────

/**
 * 견적서 목록을 Notion 데이터베이스에서 조회
 * @param filter - Notion API 필터 조건 (선택)
 * @returns Notion 페이지 객체 배열
 */
export async function getInvoices(
  filter?: QueryFilter
): Promise<PageObjectResponse[]> {
  if (!DATABASE_ID) {
    throw new Error(
      "NOTION_DATABASE_ID 환경변수가 설정되지 않았습니다."
    )
  }

  const response = await notion.databases.query({
    database_id: DATABASE_ID,
    filter,
    sorts: [
      {
        property: "발행일",
        direction: "descending",
      },
    ],
  })

  // PageObjectResponse만 필터링 (부분 응답 제외)
  return response.results.filter(
    (page): page is PageObjectResponse => page.object === "page"
  )
}

/**
 * 단일 견적서 페이지를 pageId로 조회
 * @param pageId - Notion 페이지 ID (UUID)
 * @returns Notion 페이지 객체 또는 null
 */
export async function getInvoiceByPageId(
  pageId: string
): Promise<PageObjectResponse | null> {
  try {
    const page = await notion.pages.retrieve({ page_id: pageId })

    if (page.object !== "page") return null

    return page as PageObjectResponse
  } catch {
    // 페이지를 찾지 못하거나 접근 권한이 없는 경우
    return null
  }
}
