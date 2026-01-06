// 개인 페이지
import Heatmap from "@/components/heatmap/Heatmap";

export default function ProfilePage() {
  return (
    <section className="space-y-4">
      <h1 className="text-xl font-bold">내 활동</h1>
      <Heatmap />
    </section>
  );
}
