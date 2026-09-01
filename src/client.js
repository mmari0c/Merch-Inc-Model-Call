import { createClient } from '@supabase/supabase-js'

const URL = "https://sqlohkswmfesxjnojcyk.supabase.co"
const API_KEY = "sb_publishable_2z3s-x4AD8qV-oue--es2Q_Ybi_hB0B"

export const supabase = createClient(URL, API_KEY)
