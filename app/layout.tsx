import './globals.css'
import HotjarScript from './components/analytics/HotjarScript'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'IBAM Learning Platform',
  description: 'International Business and Ministry - Faith-driven entrepreneurship education',
  viewport: {
    width: 'device-width',
    initialScale: 1.0,
    userScalable: true,
    maximumScale: 5.0,
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <HotjarScript />
        {children}
      </body>
    </html>
  )
}