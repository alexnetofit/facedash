import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://knvlgtinmoyucxpsmsqr.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtudmxndGlubW95dWN4cHNtc3FyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYxNDY0MTMsImV4cCI6MjA2MTcyMjQxM30.Axch5D6cueH3-dlh1Ha5EL1Y3qVE7gUwlGFAa-eF_cA';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          nome: string;
          email: string;
          facebook_user_id: string | null;
          facebook_access_token: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          nome: string;
          email: string;
          facebook_user_id?: string | null;
          facebook_access_token?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          nome?: string;
          email?: string;
          facebook_user_id?: string | null;
          facebook_access_token?: string | null;
          created_at?: string;
        };
      };
      ad_accounts: {
        Row: {
          id: string;
          user_id: string;
          ad_account_id: string;
          nome_conta: string;
          selecionada: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          ad_account_id: string;
          nome_conta: string;
          selecionada?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          ad_account_id?: string;
          nome_conta?: string;
          selecionada?: boolean;
          created_at?: string;
        };
      };
      metrics: {
        Row: {
          id: string;
          user_id: string;
          ad_account_id: string;
          data: string;
          spend: number;
          cpm: number;
          cpc: number;
          ctr: number;
          conversions: number;
        };
        Insert: {
          id?: string;
          user_id: string;
          ad_account_id: string;
          data: string;
          spend: number;
          cpm: number;
          cpc: number;
          ctr: number;
          conversions: number;
        };
        Update: {
          id?: string;
          user_id?: string;
          ad_account_id?: string;
          data?: string;
          spend?: number;
          cpm?: number;
          cpc?: number;
          ctr?: number;
          conversions?: number;
        };
      };
    };
  };
}; 