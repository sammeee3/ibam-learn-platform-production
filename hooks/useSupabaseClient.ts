import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useEffect, useState } from 'react'

export function useSupabaseClient() {
  const [client, setClient] = useState<any>(null)
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const supabase = createClientComponentClient()
      setClient(supabase)
    }
  }, [])
  
  return client
}
