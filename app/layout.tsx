import './globals.css'
import HotjarScript from './components/analytics/HotjarScript'

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