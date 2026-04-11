import { Separator } from "@/components/ui/separator"

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border bg-background">
      <div className="container mx-auto px-4 py-8">
        <Separator className="mb-6" />
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            © 2026 Invoice Web. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            Powered by Notion API
          </p>
        </div>
      </div>
    </footer>
  )
}
