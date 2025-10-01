// Debug script to test Supabase connection and books query
// Run this with: node debug_books.js

const { createClient } = require('@supabase/supabase-js');

// Your Supabase credentials
const supabaseUrl = 'https://tvyiuzdxoyvittxmfnjk.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR2eWl1emR4b3l2aXR0eG1mbmprIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkwNTY2MDcsImV4cCI6MjA3NDYzMjYwN30.uAVyeKUgEmg5V-QCu9JbnXvanFNE7xtKjVoz73KS7Dc';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function debugBooks() {
  console.log('🔍 Debugging Supabase books query...\n');

  try {
    // 1. Check current session
    console.log('1. Checking current session...');
    const { data: session, error: sessionError } = await supabase.auth.getSession();
    if (sessionError) {
      console.error('❌ Session error:', sessionError);
      return;
    }
    
    if (!session.session) {
      console.log('⚠️  No active session. You need to be logged in.');
      console.log('   Please log in through the app first, then run this script.');
      return;
    }
    
    console.log('✅ Session found for user:', session.session.user.email);
    console.log('   User ID:', session.session.user.id);

    // 2. Check books table structure
    console.log('\n2. Checking books table structure...');
    const { data: booksData, error: booksError } = await supabase
      .from('books')
      .select('*')
      .limit(1);
    
    if (booksError) {
      console.error('❌ Books table error:', booksError);
      return;
    }
    
    console.log('✅ Books table accessible');
    console.log('   Sample book structure:', booksData.length > 0 ? Object.keys(booksData[0]) : 'No books found');

    // 3. Check books for current user
    console.log('\n3. Checking books for current user...');
    const userId = session.session.user.id;
    const { data: userBooks, error: userBooksError } = await supabase
      .from('books')
      .select('*')
      .eq('user_id', userId);
    
    if (userBooksError) {
      console.error('❌ User books error:', userBooksError);
      return;
    }
    
    console.log(`✅ Found ${userBooks.length} books for user ${userId}`);
    if (userBooks.length > 0) {
      console.log('   Books:', userBooks.map(book => ({
        id: book.id,
        title: book.title,
        author: book.author,
        total_pages: book.total_pages,
        pages_read: book.pages_read,
        user_id: book.user_id
      })));
    }

    // 4. Check reading_history table
    console.log('\n4. Checking reading_history table...');
    const { data: historyData, error: historyError } = await supabase
      .from('reading_history')
      .select('*')
      .eq('user_id', userId)
      .limit(5);
    
    if (historyError) {
      console.error('❌ Reading history error:', historyError);
      return;
    }
    
    console.log(`✅ Found ${historyData.length} reading history entries for user ${userId}`);
    if (historyData.length > 0) {
      console.log('   History entries:', historyData);
    }

    // 5. Test the exact query from BookService
    console.log('\n5. Testing BookService.getBooks() query...');
    const { data: serviceBooks, error: serviceError } = await supabase
      .from('books')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (serviceError) {
      console.error('❌ BookService query error:', serviceError);
      return;
    }
    
    console.log(`✅ BookService query successful: ${serviceBooks.length} books`);
    if (serviceBooks.length > 0) {
      console.log('   Service books:', serviceBooks.map(book => ({
        id: book.id,
        title: book.title,
        progress: book.total_pages > 0 ? Math.round((book.pages_read / book.total_pages) * 100) : 0
      })));
    }

  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

debugBooks();
