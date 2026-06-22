import Link from "next/link"

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-(--nw-background) p-6">
      <div className="text-center">
        <p className="text-sm font-semibold text-(--nw-primary)">404</p>
        <h1 className="mt-2 text-2xl font-semibold text-(--nw-text-primary)">Page not found</h1>
        <Link className="mt-4 inline-block text-sm font-medium text-(--nw-primary)" href="/dashboard">
          Back to dashboard
        </Link>
      </div>
    </main>
  )
}

