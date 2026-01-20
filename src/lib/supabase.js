import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://mwgvdtwxiiluwdxtbqgz.supabase.co'
//                               올바른 철자: iiluw
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im13Z3ZkdHd4aWlsdXdkeHRicWd6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg0NDM2NzEsImV4cCI6MjA4NDAxOTY3MX0.XnK-V2r2Sb6Ndqw2HocTmrE2ujOLY-etBqpzD9dOZoo'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export const auth = {
  signInWithKakao: async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'kakao',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    })
    return { data, error }
  },

  signOut: async () => {
    const { error } = await supabase.auth.signOut()
    return { error }
  },

  getUser: async () => {
    const { data: { user }, error } = await supabase.auth.getUser()
    return { user, error }
  }
}

export const profiles = {
  getAll: async (userId) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .order('is_default', { ascending: false })
    return { data, error }
  },

  create: async (profileData) => {
    const { data, error } = await supabase
      .from('profiles')
      .insert(profileData)
      .select()
      .single()
    return { data, error }
  }
}

export const products = {
  getAll: async () => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('display_order', { ascending: true })  // display_order로 정렬
    return { data, error }
  }
}

export const orders = {
  create: async (orderData) => {
    const { data, error } = await supabase
      .from('orders')
      .insert(orderData)
      .select()
      .single()
    return { data, error }
  }
}