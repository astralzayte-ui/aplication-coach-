"use client";

import { useLang } from "@/app/providers";

export default function AnnouncementBar() {
  const { t } = useLang();
  return <div className="announce">{t("announce")}</div>;
}
