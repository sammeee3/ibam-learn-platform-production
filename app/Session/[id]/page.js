import Session1_1_Complete from '@/components/Session1_1_Complete';
import Test from '@/components/Test';

export default function SessionPage({ params }) {
  return (
    <div>
      <Test />
      <Session1_1_Complete sessionId={params.id} />
    </div>
  );
}