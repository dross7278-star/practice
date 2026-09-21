import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono, Noto_Sans, Playfair_Display } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";

const playfairDisplayHeading = Playfair_Display({subsets:['latin'],variable:'--font-heading'});

const notoSans = Noto_Sans({subsets:['latin'],variable:'--font-sans'});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SlotSync — Book time with us",
  description:
    "SlotSync makes it simple to see what we offer and request a time that works for you.",
};

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Appointments" },
  { href: "/book", label: "Book" },
];

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("h-full", "antialiased", geistSans.variable, geistMono.variable, "font-sans", notoSans.variable, playfairDisplayHeading.variable)}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <ThemeProvider>
          <header className="border-b">
            <nav className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-5">
              <div className="flex items-center gap-4">
                <ThemeToggle />
                <Link href="/" className="font-heading text-xl font-semibold tracking-tight">
                  SlotSync
                </Link>
              </div>
              <ul className="flex items-center gap-6 text-sm text-muted-foreground">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="transition-colors hover:text-foreground">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </header>

          <main className="flex-1">{children}</main>

          <footer className="border-t">
            <div className="mx-auto flex w-full max-w-5xl flex-col gap-2 px-6 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
              <p>&copy; {new Date().getFullYear()} SlotSync</p>
              <a href="mailto:hello@slotsync.example" className="transition-colors hover:text-foreground">
                hello@slotsync.example
              </a>
            </div>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}
