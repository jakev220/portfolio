import { redirect } from "next/navigation";

/** `/play` → `/archive` (Play was renamed). */
export default function PlayRedirectPage() {
  redirect("/archive");
}
