import { PublicEnvScript } from 'next-runtime-env';
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <PublicEnvScript />
      <body>{children}</body>
    </html>
  );
}