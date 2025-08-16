import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export interface Donor {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  total_donated: number;
  created_at: string;
}

export interface Transaction {
  id: string;
  donor_id: string;
  amount: number;
  frequency: string;
  payment_method: string;
  status: string;
  created_at: string;
}

export interface Goal {
  id: string;
  year: number;
  target_amount: number;
  current_amount: number;
  description: string;
  updated_at: string;
}

// Get goal progress
export async function getGoalProgress(year: number = 2026): Promise<Goal | null> {
  const { data, error } = await supabase
    .from('donation_goals')
    .select('*')
    .eq('year', year)
    .single();

  if (error) {
    console.error('Error fetching goal:', error);
    return null;
  }

  return data;
}

// Get recent donations (for admin use)
export async function getRecentDonations(limit: number = 10): Promise<Transaction[]> {
  const { data, error } = await supabase
    .from('donation_transactions')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching donations:', error);
    return [];
  }

  return data || [];
}

// Get donor by email
export async function getDonorByEmail(email: string): Promise<Donor | null> {
  const { data, error } = await supabase
    .from('donation_donors')
    .select('*')
    .eq('email', email)
    .single();

  if (error) {
    console.error('Error fetching donor:', error);
    return null;
  }

  return data;
}

// Calculate fees
export function calculateProcessingFees(amount: number, method: 'credit-card' | 'ach'): number {
  if (method === 'credit-card') {
    return amount * 0.029 + 0.30;
  } else if (method === 'ach') {
    return Math.min(amount * 0.008, 5.00);
  }
  return 0;
}

// Format currency
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
}

// Calculate progress percentage
export function calculateProgress(current: number, target: number): number {
  return Math.min((current / target) * 100, 100);
}