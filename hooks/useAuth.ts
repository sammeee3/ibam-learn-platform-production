import { useState, useEffect } from 'react';

export function useAuth() {
  const [user, setUser] = useState<{ id: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading for a moment, then set a test user
    const timer = setTimeout(() => {
      setUser({ id: 'test-user-123' });
      setLoading(false);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return { user, loading };
}