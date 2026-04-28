import { findBannerNotices } from "@/lib/notices";
import BannerBarClient from "./BannerBarClient";

export default async function BannerBar() {
  const notices = await findBannerNotices();

  return <BannerBarClient notices={notices} />;
}
