import "./globals.css";
import { Plus_Jakarta_Sans } from "next/font/google";
import { caveatBrush, gloriaHallelujah } from "@/lib/fonts";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-jakarta",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={`${jakarta.variable} ${caveatBrush.variable} ${gloriaHallelujah.variable}`}>
      <body className="font-sans">
        {children}
      </body>
    </html>
  );
}