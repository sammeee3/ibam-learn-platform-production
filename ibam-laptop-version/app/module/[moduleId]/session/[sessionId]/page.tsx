import DynamicSessionTemplate from '@/components/DynamicSessionTemplate';

interface SessionPageProps {
  params: Promise<{
    moduleId: string;
    sessionId: string;
  }>;
}

export default async function SessionPage({ params }: SessionPageProps) {
  // Await the params in Next.js 15
  const { moduleId, sessionId } = await params;
  
  return (
    <DynamicSessionTemplate 
      sessionId={parseInt(sessionId)}
      moduleId={parseInt(moduleId)}
    />
  );
}