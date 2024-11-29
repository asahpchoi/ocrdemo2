import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseKey);

export interface ImageAnalysisRecord {
  id?: string;
  image_url: string;
  analysis_text: string;
  token_consumption: number;
  created_at?: string;
}

export const saveImageAnalysis = async (data: Omit<ImageAnalysisRecord, 'id' | 'created_at'>) => {
  try {
    console.log('Saving analysis:', data);
    
    const { data: result, error } = await supabase
      .from('image_analyses')
      .insert([data])
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }

    console.log('Save successful:', result);
    return result;
  } catch (error) {
    console.error('Detailed error:', error);
    throw error;
  }
};

export const getImageAnalyses = async (): Promise<ImageAnalysisRecord[]> => {
  try {
    const { data, error } = await supabase
      .from('image_analyses')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Failed to fetch analyses:', error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching analyses:', error);
    throw error;
  }
};
