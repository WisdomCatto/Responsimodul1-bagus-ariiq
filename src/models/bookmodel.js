
import supabase from '../config/supabase.js';

export async function getAllBooks() {
  const { data, error } = await supabase
    .from('books')
    .select('*')
    .order('title', { ascending: true });

  if (error) throw error;
  return data;
}

export async function getBookById(id) {
  const { data, error } = await supabase
    .from('books')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function createBook(payload) {
  const { data, error } = await supabase
    .from('books')
    .insert(payload)
    .select('*')
    .single();

  if (error) throw error;
  return data;
}

export async function updateBook(id, payload) {
  const { data, error } = await supabase
    .from('books')
    .update(payload)
    .eq('id', id)
    .select('*')
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function deleteBook(id) {
  const { data, error } = await supabase
    .from('books')
    .delete()
    .eq('id', id)
    .select('id')
    .maybeSingle();

  if (error) throw error;
  return data;
}
