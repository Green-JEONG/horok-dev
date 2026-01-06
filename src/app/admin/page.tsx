import { redirect } from "next/navigation";
import { auth } from "@/app/api/auth/[...nextauth]/route";
import Heatmap from "@/components/heatmap/Heatmap";

export default async function AdminPage() {
  const session = await auth();

  // 로그인 X
  if (!session || session.user.role !== "ADMIN") {
    redirect("/");
  }

  // 로그인 O
  return (
    <section className="space-y-4">
      <h1>관리자 페이지</h1>
      <h2 className="text-lg font-semibold">전체 활동 현황</h2>
      <Heatmap />
    </section>
  );
}
