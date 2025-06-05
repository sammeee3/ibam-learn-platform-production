import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'IBAM Learning Platform',
  description: 'Transform your business education with our comprehensive marketplace learning platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
