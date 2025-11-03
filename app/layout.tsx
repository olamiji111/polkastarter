import type { Metadata } from 'next'
import './globals.css'
import { headers } from 'next/headers'
import ContextProvider from '@/context'
import { ThemeProvider } from 'next-themes'


export const metadata: Metadata = {
  title: 'Polkastarter',
  description:
    'Polkastarter is the Leading Web3 Fundraising Platform. Empowering Web3 Projects to launch decentralized and fixed swap token pools.',
  icons: {
    icon: [{ url: '/favicon-new.ico', type: 'image/x-icon' }],
  },
  other: {
    'theme-color': '#4363ff',
  },
}


export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  

  const headersObj = await headers()
  const cookies = headersObj.get('cookie')

  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ContextProvider cookies={cookies}>{children}</ContextProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}