import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseKey);

export interface ImageAnalysisRecord {
  id?: string;
  image_url: string;
  analysis_text: string;
  token_consumption: number;
  created_at?: string;
}

export const saveImageAnalysis = async (data: Omit<ImageAnalysisRecord, 'id' | 'created_at'>) => {
    console.log({
        data
    })
  const { data: result, error } = await supabase
    .from('image_analyses')
    .insert([data])
    .select()
    .single();

  if (error) throw error;
  return result;
};

export const getImageAnalyses = async () => {
  const { data, error } = await supabase
    .from('image_analyses')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};
