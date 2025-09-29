import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  StatusBar,
  // SafeAreaView,
  RefreshControl,
  Alert,
  TextInput,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import GradientBackground from '../components/GradientBackground';
import AnimatedCard from '../components/AnimatedCard';
import { SPACING, FONT_SIZES, BORDER_RADIUS } from '../constants/dimensions';
import { BookService, BOOK_CATEGORIES } from '../utils/bookService';
import { NotificationService } from '../utils/notificationService';

const BookListScreen = ({ navigation }) => {
  const { colors, isDark, toggleTheme } = useTheme();
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [readingStreak, setReadingStreak] = useState({ currentStreak: 0, longestStreak: 0 });

  const loadBooks = async () => {
    try {
      const booksData = await BookService.getBooks();
      // Streaks are now computed from reading history on Stats; keep simple for now
      setBooks(booksData.map(b => ({
        id: b.id,
        title: b.title,
        totalPages: b.total_pages,
        pagesRead: b.pages_read,
        category: b.category,
        coverImage: b.cover_image,
        createdAt: b.created_at,
      })));
      
      // Initialize notification service on first load
      if (booksData.length === 0) {
        await NotificationService.initialize();
      }
    } catch (error) {
      console.error('Error loading books:', error);
      Alert.alert('Error', 'Failed to load books');
    } finally {
      setLoading(false);
    }
  };

  // Filter books based on search query and category
  const filterBooks = useCallback(() => {
    let filtered = books;

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(book =>
        book.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(book => book.category === selectedCategory);
    }

    setFilteredBooks(filtered);
  }, [books, searchQuery, selectedCategory]);

  // Update filtered books when dependencies change
  useEffect(() => {
    filterBooks();
  }, [filterBooks]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadBooks();
    setRefreshing(false);
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadBooks();
    });

    return unsubscribe;
  }, [navigation]);

  const calculateProgress = (pagesRead, totalPages) => {
    if (totalPages === 0) return 0;
    return Math.round((pagesRead / totalPages) * 100);
  };

  const getProgressColor = (progress) => {
    if (progress >= 100) return colors.success;
    if (progress >= 75) return colors.warning;
    return colors.accent;
  };

  const handleUpdateProgress = (book) => {
    navigation.navigate('UpdateProgress', { book });
  };

  const handleDeleteBook = (book) => {
    Alert.alert(
      'Delete Book',
      `Are you sure you want to delete "${book.title}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await BookService.deleteBook(book.id);
              loadBooks();
              Alert.alert('Success', 'Book deleted successfully');
            } catch (e) {
              Alert.alert('Error', 'Failed to delete book');
            }
          },
        },
      ]
    );
  };

  const BookCard = ({ item: book, index }) => {
    const progress = calculateProgress(book.pagesRead, book.totalPages);
    const progressColor = getProgressColor(progress);

    return (
      <AnimatedCard 
        style={styles.bookCard} 
        delay={index * 100}
      >
        <View style={styles.bookHeader}>
          <View style={styles.bookInfo}>
            <Text style={[styles.bookTitle, { color: colors.textPrimary }]} numberOfLines={2}>
              {book.title}
            </Text>
            <Text style={[styles.bookCategory, { color: colors.accent }]}>
              {book.category}
            </Text>
            <Text style={[styles.bookPages, { color: colors.textSecondary }]}>
              {book.pagesRead} / {book.totalPages} pages
            </Text>
          </View>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => handleDeleteBook(book)}
          >
            <Ionicons name="trash-outline" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        <View style={styles.progressContainer}>
          <View style={[styles.progressBar, { backgroundColor: colors.textMuted }]}>
            <View
              style={[
                styles.progressFill,
                { width: `${progress}%`, backgroundColor: progressColor },
              ]}
            />
          </View>
          <Text style={[styles.progressText, { color: colors.textPrimary }]}>{progress}%</Text>
        </View>

        <TouchableOpacity
          style={[styles.updateButton, { backgroundColor: colors.accent }]}
          onPress={() => handleUpdateProgress(book)}
        >
          <Text style={[styles.updateButtonText, { color: colors.background }]}>Update Progress</Text>
        </TouchableOpacity>
      </AnimatedCard>
    );
  };

  const EmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="library-outline" size={64} color={colors.textMuted} />
      <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>No Books Yet</Text>
      <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
        Start your reading journey by adding your first book
      </Text>
      <TouchableOpacity
        style={[styles.addFirstBookButton, { backgroundColor: colors.accent }]}
        onPress={() => navigation.navigate('AddBook')}
      >
        <Text style={[styles.addFirstBookButtonText, { color: colors.background }]}>Add Your First Book</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <GradientBackground colors={[colors.gradientStart, colors.gradientEnd]}>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={colors.background} />
      
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.textMuted }]}>
        <View style={styles.headerTop}>
          <View style={styles.headerLeft}>
            <Text style={[styles.title, { color: colors.textPrimary }]}>Reading Tracker</Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              {books.length} {books.length === 1 ? 'book' : 'books'} in your library
            </Text>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity
              style={styles.themeToggle}
              onPress={toggleTheme}
            >
              <Ionicons 
                name={isDark ? "sunny" : "moon"} 
                size={20} 
                color={colors.textPrimary} 
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.statsButton}
              onPress={() => navigation.navigate('Stats')}
            >
              <Ionicons name="stats-chart-outline" size={20} color={colors.textPrimary} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.settingsButton}
              onPress={() => navigation.navigate('Settings')}
            >
              <Ionicons name="settings-outline" size={20} color={colors.textPrimary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Reading Streak */}
        {readingStreak.currentStreak > 0 && (
          <View style={[styles.streakContainer, { backgroundColor: colors.accent + '20' }]}>
            <Ionicons name="flame" size={16} color={colors.accent} />
            <Text style={[styles.streakText, { color: colors.accent }]}>
              {readingStreak.currentStreak} day streak
            </Text>
          </View>
        )}

        {/* Search Bar */}
        <View style={[styles.searchContainer, { backgroundColor: colors.surface }]}>
          <Ionicons name="search" size={20} color={colors.textMuted} />
          <TextInput
            style={[styles.searchInput, { color: colors.textPrimary }]}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search books..."
            placeholderTextColor={colors.textMuted}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color={colors.textMuted} />
            </TouchableOpacity>
          )}
        </View>

        {/* Filter Bar */}
        <View style={styles.filterContainer}>
          <TouchableOpacity
            style={[styles.filterButton, { backgroundColor: colors.surface, borderColor: colors.textMuted }]}
            onPress={() => setShowFilterModal(true)}
          >
            <Ionicons name="filter" size={16} color={colors.textPrimary} />
            <Text style={[styles.filterText, { color: colors.textPrimary }]}>
              {selectedCategory}
            </Text>
            <Ionicons name="chevron-down" size={16} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Books List */}
      <FlatList
        data={filteredBooks}
        renderItem={({ item, index }) => <BookCard item={item} index={index} />}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={!loading ? EmptyState : null}
      />

      {/* Floating Add Button */}
      <TouchableOpacity
        style={[styles.fab, { backgroundColor: colors.accent }]}
        onPress={() => navigation.navigate('AddBook')}
      >
        <Ionicons name="add" size={24} color={colors.background} />
      </TouchableOpacity>

      {/* Filter Modal */}
      <Modal
        visible={showFilterModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowFilterModal(false)}
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity
            style={styles.modalContainer}
            activeOpacity={1}
            onPress={() => setShowFilterModal(false)}
          />
          <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
            <View style={[styles.modalHeader, { borderBottomColor: colors.textMuted }]}>
              <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>Filter by Category</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowFilterModal(false)}
              >
                <Ionicons name="close" size={24} color={colors.textPrimary} />
              </TouchableOpacity>
            </View>
            <FlatList
              data={['All', ...BOOK_CATEGORIES]}
              keyExtractor={(item) => item}
              style={styles.categoryList}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.categoryItem, { borderBottomColor: colors.textMuted }]}
                  onPress={() => {
                    setSelectedCategory(item);
                    setShowFilterModal(false);
                  }}
                >
                  <Text
                    style={[
                      styles.categoryItemText,
                      { color: colors.textPrimary },
                      selectedCategory === item && { color: colors.accent, fontWeight: '600' },
                    ]}
                  >
                    {item}
                  </Text>
                  {selectedCategory === item && (
                    <Ionicons name="checkmark" size={20} color={colors.accent} />
                  )}
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
      </SafeAreaView>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.lg,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.lg,
  },
  headerLeft: {
    flex: 1,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: FONT_SIZES.xxxxl,
    fontWeight: '700',
    marginBottom: SPACING.xs,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: FONT_SIZES.md,
    fontWeight: '500',
  },
  themeToggle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.sm,
  },
  statsButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.sm,
  },
  settingsButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  streakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.xl,
    marginBottom: SPACING.lg,
    alignSelf: 'flex-start',
  },
  streakText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    marginLeft: SPACING.sm,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.xl,
    marginBottom: SPACING.lg,
  },
  searchInput: {
    flex: 1,
    fontSize: FONT_SIZES.md,
    marginLeft: SPACING.md,
    fontWeight: '500',
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: SPACING.lg,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.xl,
    borderWidth: 1,
  },
  filterText: {
    fontSize: FONT_SIZES.sm,
    marginLeft: SPACING.sm,
    marginRight: SPACING.sm,
    fontWeight: '500',
  },
  listContainer: {
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.sm,
    paddingBottom: SPACING.xxxl,
    flexGrow: 1,
  },
  bookCard: {
    marginBottom: SPACING.lg,
  },
  bookHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.lg,
  },
  bookInfo: {
    flex: 1,
    marginRight: SPACING.lg,
  },
  bookTitle: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '700',
    marginBottom: SPACING.sm,
    letterSpacing: -0.3,
    lineHeight: 24,
  },
  bookCategory: {
    fontSize: FONT_SIZES.xs,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: SPACING.sm,
  },
  bookPages: {
    fontSize: FONT_SIZES.md,
    fontWeight: '500',
  },
  deleteButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  progressBar: {
    flex: 1,
    height: 8,
    borderRadius: BORDER_RADIUS.xl,
    marginRight: SPACING.lg,
  },
  progressFill: {
    height: '100%',
    borderRadius: BORDER_RADIUS.xl,
  },
  progressText: {
    fontSize: FONT_SIZES.md,
    fontWeight: '700',
    minWidth: 50,
    textAlign: 'right',
  },
  updateButton: {
    borderRadius: BORDER_RADIUS.xl,
    paddingVertical: SPACING.lg,
    alignItems: 'center',
  },
  updateButtonText: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
  },
  fab: {
    position: 'absolute',
    bottom: SPACING.xl,
    right: SPACING.xl,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
  },
  emptyTitle: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '600',
    marginTop: SPACING.lg,
    marginBottom: SPACING.sm,
  },
  emptySubtitle: {
    fontSize: FONT_SIZES.md,
    textAlign: 'center',
    marginBottom: SPACING.xl,
    lineHeight: 22,
  },
  addFirstBookButton: {
    borderRadius: BORDER_RADIUS.md,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl,
  },
  addFirstBookButtonText: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: BORDER_RADIUS.xl,
    borderTopRightRadius: BORDER_RADIUS.xl,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.xl,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
    paddingBottom: SPACING.lg,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
  },
  closeButton: {
    padding: SPACING.sm,
  },
  categoryList: {
    paddingHorizontal: SPACING.xl,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.lg,
    borderBottomWidth: 1,
  },
  categoryItemText: {
    fontSize: FONT_SIZES.md,
    flex: 1,
  },
});

export default BookListScreen;
