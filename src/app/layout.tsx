import "./globals.css";
import { Plus_Jakarta_Sans } from "next/font/google";
import { Inter } from "next/font/google";
import { Kalam } from "next/font/google";
import { Caveat } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-jakarta",
});

const kalam = Kalam({
  subsets: ["latin"],
  weight: ["400"],
});

const caveat = Caveat({
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const kalamFont = kalam.className;
export const handwrittenFont = caveat.className;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={`${jakarta.variable} font-sans`}>
        {children}
      </body>
    </html>
  );
}