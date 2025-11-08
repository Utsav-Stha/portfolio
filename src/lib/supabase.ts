import { createClient } from '@supabase/supabase-js'

// Supabase configuration
const supabaseUrl = 'https://qdmxtpcmzfiztmyqeiuc.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFkbXh0cGNtemZpenRteXFlaXVjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI1OTYxMjQsImV4cCI6MjA3ODE3MjEyNH0.0Ajbi__LzlOPxFWLtQHseK-gS8ZMWh2jQIbvxOZSLWI'

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types for our database
export interface Project {
  id: string
  title: string
  description: string
  short_description: string
  image_url: string
  tech_stack: string[]
  github_link?: string
  live_demo_link?: string
  order_index: number
  is_featured: boolean
  created_at: string
  updated_at: string
}
