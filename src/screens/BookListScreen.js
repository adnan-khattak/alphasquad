import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useTheme } from '../contexts/ThemeContext';
import { SPACING, FONT_SIZES, BORDER_RADIUS } from '../constants/dimensions';
import GradientBackground from '../components/GradientBackground';
import { BookService } from '../utils/bookService';
import { useAuth } from '../contexts/AuthContext';

const BookListScreen = ({ navigation }) => {
  const { colors, toggleTheme } = useTheme();
  const { user } = useAuth();

  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterVisible, setFilterVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const streakDays = 5; // Example streak count

  // Fetch books when component loads or user changes
  useEffect(() => {
    const fetchBooks = async () => {
      if (!user) {
        setBooks([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const booksData = await BookService.getBooks();
        // Transform data to include progress percentage
        const booksWithProgress = booksData.map(book => ({
          ...book,
          progress: book.total_pages > 0 ? Math.round((book.pages_read / book.total_pages) * 100) : 0,
          author: book.author || 'Unknown Author' // Add fallback for author
        }));
        setBooks(booksWithProgress);
      } catch (err) {
        console.error('Error fetching books:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [user]);

  // Function to refresh books (can be called from navigation focus)
  const refreshBooks = async () => {
    if (!user) return;
    
    try {
      setError(null);
      const booksData = await BookService.getBooks();
      const booksWithProgress = booksData.map(book => ({
        ...book,
        progress: book.total_pages > 0 ? Math.round((book.pages_read / book.total_pages) * 100) : 0,
        author: book.author || 'Unknown Author'
      }));
      setBooks(booksWithProgress);
    } catch (err) {
      console.error('Error refreshing books:', err);
      setError(err.message);
    }
  };

  // Refresh books when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      if (user && !loading) {
        refreshBooks();
      }
    }, [user, loading])
  );

  const filteredBooks = books.filter(book =>
    book.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderBook = ({ item }) => (
    <View style={[styles.bookCard, { backgroundColor: colors.surface }]}>
      <Text style={[styles.bookTitle, { color: colors.textPrimary }]}>
        {item.title}
      </Text>
      <Text style={[styles.bookAuthor, { color: colors.textSecondary }]}>
        {item.author}
      </Text>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={[styles.progressBar, { backgroundColor: colors.border }]}>
          <View
            style={[
              styles.progressFill,
              { backgroundColor: colors.accent, width: `${item.progress}%` },
            ]}
          />
        </View>
        <Text style={[styles.progressText, { color: colors.textSecondary }]}>
          {item.progress}%
        </Text>
      </View>

      <TouchableOpacity
        style={[styles.updateButton, { backgroundColor: colors.accent }]}
      >
        <Text style={[styles.updateButtonText, { color: colors.background }]}>
          Update Progress
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <GradientBackground colors={[colors.gradientStart, colors.gradientEnd]}>
      {/* HEADER */}
      <View
        style={[
          styles.header,
          { borderBottomColor: colors.border, backgroundColor: colors.surface },
        ]}
      >
        <View>
          <Text style={[styles.title, { color: colors.textPrimary }]}>
            Your Library
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Track your reading journey
          </Text>
        </View>

        <View style={styles.headerActions}>
          <TouchableOpacity
            onPress={toggleTheme}
            style={[styles.iconButton, { backgroundColor: colors.background }]}
          >
            <Ionicons
              name="moon"
              size={20}
              color={colors.textPrimary}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate('Stats')}
            style={[styles.iconButton, { backgroundColor: colors.background }]}
          >
            <Ionicons
              name="stats-chart"
              size={20}
              color={colors.textPrimary}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate('Settings')}
            style={[styles.iconButton, { backgroundColor: colors.background }]}
          >
            <Ionicons
              name="settings"
              size={20}
              color={colors.textPrimary}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* STREAK BADGE */}
      <View
        style={[styles.streakBadge, { backgroundColor: colors.accent + '20' }]}
      >
        <MaterialCommunityIcons
          name="fire"
          size={20}
          color={colors.accent}
        />
        <Text style={[styles.streakText, { color: colors.accent }]}>
          {streakDays}-day streak
        </Text>
      </View>

      {/* SEARCH + FILTER */}
      <View style={styles.searchFilterRow}>
        <View
          style={[styles.searchContainer, { backgroundColor: colors.surface }]}
        >
          <Ionicons
            name="search"
            size={18}
            color={colors.textMuted}
            style={{ marginRight: SPACING.sm }}
          />
          <TextInput
            style={[styles.searchInput, { color: colors.textPrimary }]}
            placeholder="Search books..."
            placeholderTextColor={colors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons
                name="close-circle"
                size={18}
                color={colors.textMuted}
              />
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity
          style={[
            styles.filterButton,
            {
              borderColor: colors.accent,
              backgroundColor: selectedCategory
                ? colors.accent
                : colors.surface,
            },
          ]}
          onPress={() => setFilterVisible(true)}
        >
          <Ionicons
            name="filter"
            size={18}
            color={selectedCategory ? colors.background : colors.accent}
          />
        </TouchableOpacity>
      </View>

      {/* BOOK LIST / EMPTY STATE / LOADING / ERROR */}
      {loading ? (
        <View style={styles.loadingState}>
          <Ionicons
            name="book-outline"
            size={64}
            color={colors.textMuted}
          />
          <Text style={[styles.loadingText, { color: colors.textPrimary }]}>
            Loading your books...
          </Text>
        </View>
      ) : error ? (
        <View style={styles.errorState}>
          <Ionicons
            name="alert-circle-outline"
            size={64}
            color={colors.error || colors.accent}
          />
          <Text style={[styles.errorTitle, { color: colors.textPrimary }]}>
            Error loading books
          </Text>
          <Text style={[styles.errorSubtitle, { color: colors.textSecondary }]}>
            {error}
          </Text>
          <TouchableOpacity
            style={[styles.retryButton, { backgroundColor: colors.accent }]}
            onPress={refreshBooks}
          >
            <Text
              style={[
                styles.retryButtonText,
                { color: colors.background },
              ]}
            >
              Try Again
            </Text>
          </TouchableOpacity>
        </View>
      ) : filteredBooks.length > 0 ? (
        <FlatList
          data={filteredBooks}
          renderItem={renderBook}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyState}>
          <Ionicons
            name="book-outline"
            size={64}
            color={colors.textMuted}
          />
          <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>
            No books yet
          </Text>
          <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
            Start your reading journey by adding a book.
          </Text>
          <TouchableOpacity
            style={[styles.addBookButton, { backgroundColor: colors.accent }]}
            onPress={() => navigation.navigate('AddBook')}
          >
            <Text
              style={[
                styles.addBookButtonText,
                { color: colors.background },
              ]}
            >
              + Add Your First Book
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* FAB */}
      <TouchableOpacity
        style={[styles.fab, { backgroundColor: colors.accent }]}
        onPress={() => navigation.navigate('AddBook')}
      >
        <Ionicons name="add" size={28} color={colors.background} />
      </TouchableOpacity>

      {/* FILTER MODAL */}
      <Modal
        visible={filterVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setFilterVisible(false)}
      >
        <View
          style={[styles.modalOverlay, { backgroundColor: colors.backdrop }]}
        >
          <View
            style={[styles.modalContent, { backgroundColor: colors.surface }]}
          >
            <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>
              Filter by Category
            </Text>
            {['All', 'Fiction', 'Non-fiction', 'Self-help', 'Other'].map(
              category => (
                <TouchableOpacity
                  key={category}
                  style={[
                    styles.categoryOption,
                    selectedCategory === category && {
                      backgroundColor: colors.accent,
                    },
                  ]}
                  onPress={() => {
                    setSelectedCategory(category);
                    setFilterVisible(false);
                  }}
                >
                  <Text
                    style={[
                      styles.categoryText,
                      {
                        color:
                          selectedCategory === category
                            ? colors.background
                            : colors.textPrimary,
                      },
                    ]}
                  >
                    {category}
                  </Text>
                  {selectedCategory === category && (
                    <Ionicons
                      name="checkmark"
                      size={20}
                      color={colors.background}
                    />
                  )}
                </TouchableOpacity>
              )
            )}
            <TouchableOpacity
              style={[styles.closeButton, { backgroundColor: colors.accent }]}
              onPress={() => setFilterVisible(false)}
            >
              <Text
                style={[
                  styles.closeButtonText,
                  { color: colors.background },
                ]}
              >
                Close
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  // HEADER
  header: {
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.md,
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: FONT_SIZES.xxxl,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: FONT_SIZES.md,
    marginTop: 2,
  },
  headerActions: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // STREAK
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginTop: SPACING.md,
    marginLeft: SPACING.xl,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.lg,
    marginBottom: SPACING.lg,
  },
  streakText: {
    marginLeft: SPACING.sm,
    fontWeight: '600',
  },

  // SEARCH & FILTER
  searchFilterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: SPACING.xl,
    marginBottom: SPACING.lg,
    gap: SPACING.md,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    borderRadius: BORDER_RADIUS.xl,
  },
  searchInput: {
    flex: 1,
    fontSize: FONT_SIZES.md,
  },
  filterButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
  },

  // BOOK CARD
  list: {
    paddingHorizontal: SPACING.xl,
    paddingBottom: 100,
  },
  bookCard: {
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  bookTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '700',
  },
  bookAuthor: {
    fontSize: FONT_SIZES.md,
    marginBottom: SPACING.sm,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  progressBar: {
    flex: 1,
    height: 8,
    borderRadius: BORDER_RADIUS.lg,
    marginRight: SPACING.sm,
  },
  progressFill: {
    height: '100%',
    borderRadius: BORDER_RADIUS.lg,
  },
  progressText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
  },
  updateButton: {
    borderRadius: BORDER_RADIUS.lg,
    paddingVertical: SPACING.md,
    alignItems: 'center',
  },
  updateButtonText: {
    fontSize: FONT_SIZES.md,
    fontWeight: '700',
  },

  // LOADING STATE
  loadingState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
  },
  loadingText: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    marginTop: SPACING.md,
  },

  // ERROR STATE
  errorState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
  },
  errorTitle: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '700',
    marginTop: SPACING.md,
    marginBottom: SPACING.sm,
  },
  errorSubtitle: {
    fontSize: FONT_SIZES.md,
    textAlign: 'center',
    marginBottom: SPACING.lg,
  },
  retryButton: {
    borderRadius: BORDER_RADIUS.xl,
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.xxl,
  },
  retryButtonText: {
    fontSize: FONT_SIZES.md,
    fontWeight: '700',
  },

  // EMPTY STATE
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
  },
  emptyTitle: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '700',
    marginTop: SPACING.md,
    marginBottom: SPACING.sm,
  },
  emptySubtitle: {
    fontSize: FONT_SIZES.md,
    textAlign: 'center',
    marginBottom: SPACING.lg,
  },
  addBookButton: {
    borderRadius: BORDER_RADIUS.xl,
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.xxl,
  },
  addBookButtonText: {
    fontSize: FONT_SIZES.md,
    fontWeight: '700',
  },

  // FAB
  fab: {
    position: 'absolute',
    bottom: SPACING.xl,
    right: SPACING.xl,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },

  // MODAL
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: BORDER_RADIUS.xxl,
    borderTopRightRadius: BORDER_RADIUS.xxl,
    padding: SPACING.xl,
  },
  modalTitle: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '700',
    marginBottom: SPACING.lg,
  },
  categoryOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.sm,
  },
  categoryText: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
  },
  closeButton: {
    marginTop: SPACING.lg,
    borderRadius: BORDER_RADIUS.lg,
    paddingVertical: SPACING.md,
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: FONT_SIZES.md,
    fontWeight: '700',
  },
});

export default BookListScreen;
