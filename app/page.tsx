import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export default async function Home() {
  const cookieStore = await cookies();
  const authCookie = cookieStore.get("jagawarga_auth");

  if (authCookie?.value) {
    try {
      const user = JSON.parse(decodeURIComponent(authCookie.value));
      const dashboardMap: Record<string, string> = {
        citizen: "/citizen/dashboard",
        rt: "/rt/dashboard",
        rw: "/rw/dashboard",
        pemda: "/pemda/dashboard",
      };
      const path = dashboardMap[user.role];
      if (path) redirect(path);
    } catch {
      // back to login
    }
  }

  redirect("/auth/login");
}
