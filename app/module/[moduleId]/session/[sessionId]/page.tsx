// app/module/[moduleId]/session/[sessionId]/page.tsx
// Updated for Next.js 15 compatibility

import SessionTemplate from '../../../../../components/SessionTemplate';

interface PageProps {
  params: Promise<{ moduleId: string; sessionId: string }>;
}

export default async function SessionPage({ params }: PageProps) {
  const { moduleId, sessionId } = await params;

  return (
    <SessionTemplate 
      moduleId={parseInt(moduleId)} 
      sessionId={parseInt(sessionId)} 
    />
  );
}