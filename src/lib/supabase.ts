import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

let supabase: any;

if (!supabaseUrl || !supabaseKey) {
  if (import.meta.env.DEV) {
    console.info('Supabase environment variables missing. Using mock client for development.');
  }
  supabase = {
    from: () => ({
      select: () => ({ data: [], error: null }),
      insert: () => ({ data: null, error: null }),
      update: () => ({ data: null, error: null }),
      delete: () => ({ data: null, error: null }),
      single: () => ({ data: null, error: null }),
      limit: () => ({ data: [], error: null }),
      order: () => ({ data: [], error: null }),
      eq: () => ({ data: [], error: null })
    }),
    auth: {
      getSession: () => Promise.resolve({ data: { session: null }, error: null }),
      signInWithPassword: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } }),
      signOut: () => Promise.resolve({ error: null })
    }
  };
} else {
  supabase = createClient(supabaseUrl, supabaseKey);
}
export { supabase };

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          name: string;
          title: string;
          bio: string;
          email: string;
          location: string;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['profiles']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>;
      };
      experiences: {
        Row: {
          id: string;
          role: string;
          company: string;
          duration: string;
          description: string;
          technologies: string[];
          order_index: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['experiences']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['experiences']['Insert']>;
      };
      education: {
        Row: {
          id: string;
          school_name: string;
          degree: string;
          duration: string;
          description: string;
          type: 'education' | 'certification';
          order_index: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['education']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['education']['Insert']>;
      };
      projects: {
        Row: {
          id: string;
          title: string;
          description: string;
          technologies: string[];
          live_url: string | null;
          github_url: string | null;
          image_url: string | null;
          featured: boolean;
          order_index: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['projects']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['projects']['Insert']>;
      };
      contact_messages: {
        Row: {
          id: string;
          name: string;
          email: string;
          subject: string;
          message: string;
          read: boolean;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['contact_messages']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['contact_messages']['Insert']>;
      };
    };
  };
};


