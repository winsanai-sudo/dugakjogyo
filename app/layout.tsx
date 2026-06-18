import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "대치 두각학원 문풀 선생님 지원",
  description: "대치 두각학원 문풀 선생님 채용 지원 페이지"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
