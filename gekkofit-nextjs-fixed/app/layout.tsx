import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GEKKO FIT — Track your progress",
  description: "Тренировки, XP, ранги и прогресс в одном приложении.",
  manifest: "/manifest.webmanifest"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ru"><body>{children}</body></html>;
}