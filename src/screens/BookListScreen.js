import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
  RefreshControl,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/colors';
import { SPACING, FONT_SIZES, BORDER_RADIUS } from '../constants/dimensions';
import { BookStorage } from '../utils/bookStorage';

const BookListScreen = ({ navigation }) => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadBooks = async () => {
    try {
      const booksData = await BookStorage.getBooks();
      setBooks(booksData);
    } catch (error) {
      console.error('Error loading books:', error);
      Alert.alert('Error', 'Failed to load books');
    } finally {
      setLoading(false);
    }
  };

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
    if (progress >= 100) return COLORS.success;
    if (progress >= 75) return COLORS.warning;
    return COLORS.accent;
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
            const success = await BookStorage.deleteBook(book.id);
            if (success) {
              loadBooks();
              Alert.alert('Success', 'Book deleted successfully');
            } else {
              Alert.alert('Error', 'Failed to delete book');
            }
          },
        },
      ]
    );
  };

  const BookCard = ({ item: book }) => {
    const progress = calculateProgress(book.pagesRead, book.totalPages);
    const progressColor = getProgressColor(progress);

    return (
      <View style={styles.bookCard}>
        <View style={styles.bookHeader}>
          <View style={styles.bookInfo}>
            <Text style={styles.bookTitle} numberOfLines={2}>
              {book.title}
            </Text>
            <Text style={styles.bookPages}>
              {book.pagesRead} / {book.totalPages} pages
            </Text>
          </View>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => handleDeleteBook(book)}
          >
            <Ionicons name="trash-outline" size={20} color={COLORS.textSecondary} />
          </TouchableOpacity>
        </View>

        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { width: `${progress}%`, backgroundColor: progressColor },
              ]}
            />
          </View>
          <Text style={styles.progressText}>{progress}%</Text>
        </View>

        <TouchableOpacity
          style={styles.updateButton}
          onPress={() => handleUpdateProgress(book)}
        >
          <Text style={styles.updateButtonText}>Update Progress</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const EmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="library-outline" size={64} color={COLORS.textMuted} />
      <Text style={styles.emptyTitle}>No Books Yet</Text>
      <Text style={styles.emptySubtitle}>
        Start your reading journey by adding your first book
      </Text>
      <TouchableOpacity
        style={styles.addFirstBookButton}
        onPress={() => navigation.navigate('AddBook')}
      >
        <Text style={styles.addFirstBookButtonText}>Add Your First Book</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Reading Tracker</Text>
        <Text style={styles.subtitle}>
          {books.length} {books.length === 1 ? 'book' : 'books'} in your library
        </Text>
      </View>

      {/* Books List */}
      <FlatList
        data={books}
        renderItem={BookCard}
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
        style={styles.fab}
        onPress={() => navigation.navigate('AddBook')}
      >
        <Ionicons name="add" size={24} color={COLORS.background} />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.textMuted,
  },
  title: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  subtitle: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
  },
  listContainer: {
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    flexGrow: 1,
  },
  bookCard: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.textMuted,
  },
  bookHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.md,
  },
  bookInfo: {
    flex: 1,
    marginRight: SPACING.md,
  },
  bookTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  bookPages: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
  },
  deleteButton: {
    padding: SPACING.sm,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: COLORS.textMuted,
    borderRadius: 3,
    marginRight: SPACING.md,
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: COLORS.textPrimary,
    minWidth: 40,
    textAlign: 'right',
  },
  updateButton: {
    backgroundColor: COLORS.accent,
    borderRadius: BORDER_RADIUS.md,
    paddingVertical: SPACING.md,
    alignItems: 'center',
  },
  updateButtonText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: COLORS.background,
  },
  fab: {
    position: 'absolute',
    bottom: SPACING.xl,
    right: SPACING.xl,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.accent,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
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
    color: COLORS.textPrimary,
    marginTop: SPACING.lg,
    marginBottom: SPACING.sm,
  },
  emptySubtitle: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: SPACING.xl,
    lineHeight: 22,
  },
  addFirstBookButton: {
    backgroundColor: COLORS.accent,
    borderRadius: BORDER_RADIUS.md,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl,
  },
  addFirstBookButtonText: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.background,
  },
});

export default BookListScreen;
