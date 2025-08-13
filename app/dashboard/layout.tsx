import { Suspense } from 'react';

export default function DashboardLayout({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  // Authentication check moved to middleware or page level
  // This just provides the layout wrapper
  
  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
        {children}
      </Suspense>
    </>
  );
}