import { createClient } from '@/lib/supabase/client';
import { SavedGraph } from '@/lib/types';
import { serializeGraphState } from '@/lib/store/useStore';

export async function saveGraph(title: string, id?: string): Promise<SavedGraph | null> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) throw new Error('User not authenticated');

  const graphData = serializeGraphState();

  const graphPayload = {
    user_id: user.id,
    title,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: graphData as unknown as any, 
    updated_at: new Date().toISOString(),
  };

  let result;
  if (id) {
    // Update
    result = await supabase
      .from('saved_graphs')
      .update(graphPayload)
      .eq('id', id)
      .select()
      .single();
  } else {
    // Insert
    result = await supabase
      .from('saved_graphs')
      .insert(graphPayload)
      .select()
      .single();
  }

  if (result.error) {
    throw new Error(result.error.message);
  }

  return result.data as SavedGraph;
}

export async function fetchGraphs(): Promise<SavedGraph[]> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from('saved_graphs')
    .select('*')
    .eq('user_id', user.id) // Ensure we filter by user explicitly, though RLS handles it
    .order('updated_at', { ascending: false });

  if (error) throw new Error(error.message);
  return data as SavedGraph[];
}

export async function fetchGraphById(id: string): Promise<SavedGraph | null> {
    const supabase = createClient();
    const { data, error } = await supabase
        .from('saved_graphs')
        .select('*')
        .eq('id', id)
        .single();
    
    if (error) return null;
    return data as SavedGraph;
}
