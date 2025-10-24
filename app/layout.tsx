import "./globals.css";
import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";


export const metadata: Metadata = {
  title: "Polkastarter",
  description:
    "Polkastarter is the Leading Web3 Fundraising Platform. Empowering Web3 Projects to launch decentralized and fixed swap token pools",
  icons: {
    icon: [{ url: "/favicon-new.ico", type: "image/x-icon" }],
  },
  
  other: {
    "theme-color": "#4363ff", 
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className="font-[var(--font-default)]"
    >
      <body className="antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}