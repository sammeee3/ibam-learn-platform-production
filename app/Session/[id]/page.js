import Session1_1_Complete from '@/components/Session1_1_Complete';

export default function SessionPage({ params }) {
  return <Session1_1_Complete sessionId={params.id} />;
}