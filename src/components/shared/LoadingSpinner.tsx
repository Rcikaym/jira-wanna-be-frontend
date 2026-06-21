import { cn } from "@/lib/utils"

export function LoadingSpinner({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const dims = { sm: "h-4 w-4", md: "h-8 w-8", lg: "h-12 w-12" }
  return (
    <div className="flex items-center justify-center p-4">
      <div
        className={cn(
          "animate-spin rounded-full border-2 border-[--nw-border] border-t-[--nw-primary]",
          dims[size]
        )}
      />
    </div>
  )
}

