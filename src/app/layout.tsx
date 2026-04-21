import type { Metadata } from "next";
import { Share_Tech_Mono, Work_Sans } from "next/font/google";
import Providers from "@/components/Providers";
import "./globals.css";

const workSans = Work_Sans({
  weight: "100",
  subsets: ["latin"],
  variable: "--font-display",
})

const shareTechMono = Share_Tech_Mono({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "argo",
  description: "argo — clothing",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${shareTechMono.variable} ${workSans.variable}`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
