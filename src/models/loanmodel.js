import supabase from '../config/supabase.js';

const loanSelection = `
  *,
  members (id, name, email),
  books (id, title, author)
`;

export async function getAllLoans(filters = {}) {
  let query = supabase
    .from('loans')
    .select(loanSelection)
    .order('created_at', { ascending: false });

  if (filters.status) {
    query = query.eq('status', filters.status);
  }

  if (filters.member_id) {
    query = query.eq('member_id', filters.member_id);
  }

  if (filters.book_id) {
    query = query.eq('book_id', filters.book_id);
  }

  const { data, error } = await query;

  if (error) throw error;

  return data;
}

export async function getLoanById(id) {
  const { data, error } = await supabase
    .from('loans')
    .select(loanSelection)
    .eq('id', id)
    .maybeSingle();

  if (error) throw error;

  return data;
}

export async function getLoanRecordById(id) {
  const { data, error } = await supabase
    .from('loans')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) throw error;

  return data;
}

export async function createLoan(payload) {
  const { data, error } = await supabase
    .from('loans')
    .insert(payload)
    .select('*')
    .single();

  if (error) throw error;

  return data;
}

export async function updateLoan(id, payload) {
  const { data, error } = await supabase
    .from('loans')
    .update(payload)
    .eq('id', id)
    .select('*')
    .maybeSingle();

  if (error) throw error;

  return data;
}

export async function deleteLoan(id) {
  const { data, error } = await supabase
    .from('loans')
    .delete()
    .eq('id', id)
    .select('id')
    .maybeSingle();

  if (error) throw error;

  return data;
}