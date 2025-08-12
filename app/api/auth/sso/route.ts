import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  return new Response(`
    <html>
      <body style="font-family: Arial; text-align: center; padding: 50px;">
        <h1>🎉 SSO Route Works!</h1>
        <p>This proves the route file is deployed correctly.</p>
        <p>URL: ${request.url}</p>
      </body>
    </html>
  `, {
    headers: { 'Content-Type': 'text/html' }
  });
}