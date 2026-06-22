import { redirect } from "next/navigation"

export default function HomePage() {
  // Root has no interface; Next renders this server component and sends users into the authenticated workspace.
  redirect("/dashboard")
}
