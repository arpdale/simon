import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Simon - Your Hotel Concierge',
  description: 'AI-powered hotel concierge for personalized local recommendations',
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen relative">
          {/* Desktop background */}
          <div 
            className="fixed inset-0 hidden md:block bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: 'url(/images/ren-lax-bg.png)' }}
          />
          {/* Mobile background */}
          <div 
            className="fixed inset-0 md:hidden bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: 'url(/images/ren-lax-mobile.png)' }}
          />
          {/* Content overlay */}
          <div className="relative z-10">
            {children}
          </div>
        </div>
      </body>
    </html>
  )
}