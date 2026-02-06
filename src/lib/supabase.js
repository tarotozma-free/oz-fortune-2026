import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  'https://mwgvdtwxiiluwdxtbqgz.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im13Z3ZkdHd4aWlsdXdkeHRicWd6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg0NDM2NzEsImV4cCI6MjA4NDAxOTY3MX0.XnK-V2r2Sb6Ndqw2HocTmrE2ujOLY-etBqpzD9dOZoo'
);

export const orders = {
  create: async (orderData) => {
    const { data, error } = await supabase
      .from('orders')
      .insert(orderData)
      .select()
      .single()
    return { data, error }
  },

  getByUser: async (userId) => {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    return { data, error }
  }
}

export const profiles = {
  create: async (profileData) => {
    const { data, error } = await supabase
      .from('profiles')
      .insert(profileData)
      .select()
      .single()
    return { data, error }
  },

  getAll: async (userId) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    return { data, error }
  }
}