import AsyncStorage from '@react-native-async-storage/async-storage';

const BOOKS_STORAGE_KEY = '@reading_tracker_books';
const READING_STREAKS_KEY = '@reading_tracker_streaks';
const READING_HISTORY_KEY = '@reading_tracker_history';

// Book categories
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

export const BookStorage = {
  // Get all books from storage
  async getBooks() {
    try {
      const booksJson = await AsyncStorage.getItem(BOOKS_STORAGE_KEY);
      return booksJson ? JSON.parse(booksJson) : [];
    } catch (error) {
      console.error('Error getting books:', error);
      return [];
    }
  },

  // Save all books to storage
  async saveBooks(books) {
    try {
      await AsyncStorage.setItem(BOOKS_STORAGE_KEY, JSON.stringify(books));
      return true;
    } catch (error) {
      console.error('Error saving books:', error);
      return false;
    }
  },

  // Add a new book
  async addBook(book) {
    try {
      const books = await this.getBooks();
      const newBook = {
        id: Date.now().toString(), // Simple ID generation
        title: book.title,
        totalPages: parseInt(book.totalPages),
        pagesRead: 0,
        category: book.category || 'Other',
        coverImage: book.coverImage || null,
        createdAt: new Date().toISOString(),
      };
      
      books.push(newBook);
      await this.saveBooks(books);
      return newBook;
    } catch (error) {
      console.error('Error adding book:', error);
      return null;
    }
  },

  // Update book progress
  async updateProgress(bookId, pagesReadToday) {
    try {
      const books = await this.getBooks();
      const bookIndex = books.findIndex(book => book.id === bookId);
      
      if (bookIndex === -1) {
        throw new Error('Book not found');
      }

      const pagesToAdd = parseInt(pagesReadToday);
      books[bookIndex].pagesRead += pagesToAdd;
      
      // Ensure pagesRead doesn't exceed totalPages
      if (books[bookIndex].pagesRead > books[bookIndex].totalPages) {
        books[bookIndex].pagesRead = books[bookIndex].totalPages;
      }

      // Record reading activity for streaks and history
      await this.recordReadingActivity(pagesToAdd);

      await this.saveBooks(books);
      return books[bookIndex];
    } catch (error) {
      console.error('Error updating progress:', error);
      return null;
    }
  },

  // Get a specific book by ID
  async getBook(bookId) {
    try {
      const books = await this.getBooks();
      return books.find(book => book.id === bookId);
    } catch (error) {
      console.error('Error getting book:', error);
      return null;
    }
  },

  // Delete a book
  async deleteBook(bookId) {
    try {
      const books = await this.getBooks();
      const filteredBooks = books.filter(book => book.id !== bookId);
      await this.saveBooks(filteredBooks);
      return true;
    } catch (error) {
      console.error('Error deleting book:', error);
      return false;
    }
  },

  // Clear all books (for testing/reset)
  async clearAllBooks() {
    try {
      await AsyncStorage.removeItem(BOOKS_STORAGE_KEY);
      return true;
    } catch (error) {
      console.error('Error clearing books:', error);
      return false;
    }
  },

  // Record reading activity for streaks and history
  async recordReadingActivity(pagesRead) {
    try {
      const today = new Date().toDateString();
      const history = await this.getReadingHistory();
      
      // Update today's reading
      if (history[today]) {
        history[today] += pagesRead;
      } else {
        history[today] = pagesRead;
      }

      await AsyncStorage.setItem(READING_HISTORY_KEY, JSON.stringify(history));
      
      // Update reading streak
      await this.updateReadingStreak();
    } catch (error) {
      console.error('Error recording reading activity:', error);
    }
  },

  // Get reading history
  async getReadingHistory() {
    try {
      const historyJson = await AsyncStorage.getItem(READING_HISTORY_KEY);
      return historyJson ? JSON.parse(historyJson) : {};
    } catch (error) {
      console.error('Error getting reading history:', error);
      return {};
    }
  },

  // Get reading streak data
  async getReadingStreak() {
    try {
      const streakJson = await AsyncStorage.getItem(READING_STREAKS_KEY);
      return streakJson ? JSON.parse(streakJson) : { currentStreak: 0, longestStreak: 0, lastReadDate: null };
    } catch (error) {
      console.error('Error getting reading streak:', error);
      return { currentStreak: 0, longestStreak: 0, lastReadDate: null };
    }
  },

  // Update reading streak
  async updateReadingStreak() {
    try {
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      
      const streakData = await this.getReadingStreak();
      const history = await this.getReadingHistory();
      
      const todayStr = today.toDateString();
      const yesterdayStr = yesterday.toDateString();
      
      // Check if user read today
      if (history[todayStr] && history[todayStr] > 0) {
        // If last read was yesterday, increment streak
        if (streakData.lastReadDate === yesterdayStr) {
          streakData.currentStreak += 1;
        } else if (streakData.lastReadDate !== todayStr) {
          // If last read was not yesterday or today, reset streak
          streakData.currentStreak = 1;
        }
        
        // Update longest streak if current is higher
        if (streakData.currentStreak > streakData.longestStreak) {
          streakData.longestStreak = streakData.currentStreak;
        }
        
        streakData.lastReadDate = todayStr;
      }

      await AsyncStorage.setItem(READING_STREAKS_KEY, JSON.stringify(streakData));
      return streakData;
    } catch (error) {
      console.error('Error updating reading streak:', error);
      return { currentStreak: 0, longestStreak: 0, lastReadDate: null };
    }
  },

  // Get reading stats for the last N days
  async getReadingStats(days = 7) {
    try {
      const history = await this.getReadingHistory();
      const stats = [];
      const today = new Date();
      
      for (let i = days - 1; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateStr = date.toDateString();
        const pagesRead = history[dateStr] || 0;
        
        stats.push({
          date: dateStr,
          pagesRead: pagesRead,
          dayName: date.toLocaleDateString('en-US', { weekday: 'short' })
        });
      }
      
      return stats;
    } catch (error) {
      console.error('Error getting reading stats:', error);
      return [];
    }
  },

  // Get total pages read this week
  async getWeeklyPagesRead() {
    try {
      const stats = await this.getReadingStats(7);
      return stats.reduce((total, day) => total + day.pagesRead, 0);
    } catch (error) {
      console.error('Error getting weekly pages read:', error);
      return 0;
    }
  },

  // Get average pages per day
  async getAveragePagesPerDay(days = 7) {
    try {
      const stats = await this.getReadingStats(days);
      const totalPages = stats.reduce((total, day) => total + day.pagesRead, 0);
      return Math.round(totalPages / days * 10) / 10; // Round to 1 decimal place
    } catch (error) {
      console.error('Error getting average pages per day:', error);
      return 0;
    }
  }
};
