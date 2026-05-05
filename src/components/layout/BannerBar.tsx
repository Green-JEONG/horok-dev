"use client";

import { useEffect, useState } from "react";
import BannerBarClient from "./BannerBarClient";

type BannerNotice = {
  id: number;
  title: string;
  href: string;
};

export default function BannerBar() {
  const [notices, setNotices] = useState<BannerNotice[]>([]);

  useEffect(() => {
    let cancelled = false;

    const loadBannerNotices = async () => {
      try {
        const response = await fetch("/api/banner-notices", {
          cache: "no-store",
        });

        if (!response.ok) {
          if (!cancelled) {
            setNotices([]);
          }
          return;
        }

        const data = (await response.json().catch(() => [])) as BannerNotice[];

        if (!cancelled) {
          setNotices(Array.isArray(data) ? data : []);
        }
      } catch {
        if (!cancelled) {
          setNotices([]);
        }
      }
    };

    void loadBannerNotices();

    return () => {
      cancelled = true;
    };
  }, []);

  return <BannerBarClient notices={notices} />;
}
