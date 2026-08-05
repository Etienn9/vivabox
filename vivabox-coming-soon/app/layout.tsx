import "@fontsource/plus-jakarta-sans";
import "./globals.css";

export const metadata = {
  title: "Vivabox",
  description: "Muy pronto.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}