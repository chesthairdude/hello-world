import "./globals.css";
import { Geist } from "next/font/google";
import { ThemeProvider } from "./providers/ThemeProvider";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata = {
  title: "FunnyOrNot",
  description: "Caption voting app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={geist.variable} data-theme="light">
      <body style={{ fontFamily: "var(--font-geist-sans), -apple-system, sans-serif" }}>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
