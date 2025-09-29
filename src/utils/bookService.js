import supabase from '../config/supabase';

// Expected Supabase schema:
// tables: books, reading_history
// books: id (uuid), user_id (uuid), title (text), total_pages (int), pages_read (int), category (text), cover_image (text), created_at (timestamptz)
// reading_history: id (uuid), user_id (uuid), book_id (uuid), date (date), pages_read (int), created_at (timestamptz)

export const BOOK_CATEGORIES = [
  'Fiction',
  'Non-Fiction',
  'Self-Help',
  'Biography',
  'Science Fiction',
  'Mystery',
  'Romance',
  'Thriller',
  'Fantasy',
  'History',
  'Philosophy',
  'Business',
  'Technology',
  'Health',
  'Travel',
  'Other'
];

function getUserIdOrThrow(session) {
  const userId = session?.user?.id;
  if (!userId) throw new Error('No authenticated user');
  return userId;
}

export const BookService = {
  async getBooks() {
    const { data: session } = await supabase.auth.getSession();
    const userId = getUserIdOrThrow(session.session);
    const { data, error } = await supabase
      .from('books')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async addBook(book) {
    const { data: session } = await supabase.auth.getSession();
    const userId = getUserIdOrThrow(session.session);
    const payload = {
      user_id: userId,
      title: book.title,
      total_pages: parseInt(book.totalPages, 10),
      pages_read: 0,
      category: book.category || 'Other',
      cover_image: book.coverImage || null,
    };
    const { data, error } = await supabase
      .from('books')
      .insert(payload)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async updateProgress(bookId, pagesReadToday) {
    const { data: session } = await supabase.auth.getSession();
    const userId = getUserIdOrThrow(session.session);
    const increment = parseInt(pagesReadToday, 10);

    // Update book pages_read with clamp not exceeding total_pages
    const { data: book, error: fetchErr } = await supabase
      .from('books')
      .select('id, total_pages, pages_read')
      .eq('id', bookId)
      .eq('user_id', userId)
      .single();
    if (fetchErr) throw fetchErr;

    const newPagesRead = Math.min(book.pages_read + increment, book.total_pages);
    const { data: updated, error: updErr } = await supabase
      .from('books')
      .update({ pages_read: newPagesRead })
      .eq('id', bookId)
      .eq('user_id', userId)
      .select()
      .single();
    if (updErr) throw updErr;

    // Log reading history for today per user and book (aggregate by date)
    const today = new Date();
    const dateStr = today.toISOString().slice(0, 10); // YYYY-MM-DD

    const { data: existing, error: histFetchErr } = await supabase
      .from('reading_history')
      .select('id, pages_read')
      .eq('user_id', userId)
      .eq('book_id', bookId)
      .eq('date', dateStr)
      .maybeSingle();
    if (histFetchErr) throw histFetchErr;

    if (existing) {
      const { error: histUpdErr } = await supabase
        .from('reading_history')
        .update({ pages_read: existing.pages_read + increment })
        .eq('id', existing.id);
      if (histUpdErr) throw histUpdErr;
    } else {
      const { error: histInsErr } = await supabase
        .from('reading_history')
        .insert({ user_id: userId, book_id: bookId, date: dateStr, pages_read: increment });
      if (histInsErr) throw histInsErr;
    }

    return updated;
  },

  async getBook(bookId) {
    const { data: session } = await supabase.auth.getSession();
    const userId = getUserIdOrThrow(session.session);
    const { data, error } = await supabase
      .from('books')
      .select('*')
      .eq('id', bookId)
      .eq('user_id', userId)
      .single();
    if (error) throw error;
    return data;
  },

  async deleteBook(bookId) {
    const { data: session } = await supabase.auth.getSession();
    const userId = getUserIdOrThrow(session.session);
    // Delete related history first due to FK constraints
    const { error: histErr } = await supabase
      .from('reading_history')
      .delete()
      .eq('user_id', userId)
      .eq('book_id', bookId);
    if (histErr) throw histErr;

    const { error } = await supabase
      .from('books')
      .delete()
      .eq('id', bookId)
      .eq('user_id', userId);
    if (error) throw error;
    return true;
  },

  async getReadingHistory(days = 30) {
    const { data: session } = await supabase.auth.getSession();
    const userId = getUserIdOrThrow(session.session);
    const since = new Date();
    since.setDate(since.getDate() - (days - 1));
    const sinceStr = since.toISOString().slice(0, 10);
    const { data, error } = await supabase
      .from('reading_history')
      .select('date, pages_read')
      .eq('user_id', userId)
      .gte('date', sinceStr)
      .order('date');
    if (error) throw error;

    // Aggregate by date across all books
    const map = {};
    for (const row of data || []) {
      map[row.date] = (map[row.date] || 0) + (row.pages_read || 0);
    }
    return map;
  },

  async getReadingStats(days = 7) {
    const history = await this.getReadingHistory(days);
    const stats = [];
    const today = new Date();
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().slice(0, 10);
      const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
      stats.push({ date: dateStr, pagesRead: history[dateStr] || 0, dayName });
    }
    return stats;
  },

  async getWeeklyPagesRead() {
    const stats = await this.getReadingStats(7);
    return stats.reduce((total, d) => total + d.pagesRead, 0);
  },

  async getAveragePagesPerDay(days = 7) {
    const stats = await this.getReadingStats(days);
    const totalPages = stats.reduce((total, d) => total + d.pagesRead, 0);
    return Math.round((totalPages / days) * 10) / 10;
  }
};

export default BookService;


